"use strict";

require("./server/general/models");
require("./server/bl-brighter-view/models");
require("./server/bl-data-sense/models");

var cluster = require("cluster"),
    express = require("express"),
    multer  = require("multer"),
    path = require("path"),
    favicon = require("static-favicon"),
    cookieParser = require("cookie-parser"),
    session = require("express-session"),
    MongoStore = require("connect-mongo")(session),
    bodyParser = require("body-parser"),
    config = require("./server/config"),
    log = require("./server/libs/log")(module),
    utils = require("./server/libs/utils"),
    mongoose = require("mongoose"),
    schedulerJob = require("./server/libs/scheduler-jobs"),
    websockets = require("./server/general/core/realtime/websockets"),
    assurfwebsockets = require("./server/bl-analyze-solar-surface/core/realtime/websockets"),
    cpuCount = require("os").cpus().length,
    argv = require("minimist")(process.argv.slice(2)),
//semver = require("semver"),
    consts = require("./server/libs/consts"),

//routes
    generalRoutes = require("./server/general/routes"),
    brighterViewRoutes = require("./server/bl-brighter-view/routes"),
    dataSenseRoutes = require("./server/bl-data-sense/routes"),
    brighterSavingsRoutes = require("./server/bl-brighter-savings/routes"),
    energyStarPortfolioManagerRoutes = require("./server/bl-energy-star-portfolio-manager/routes"),
    loadResponseRoutes = require("./server/bl-load-response/routes"),
    programsAndProjectsRoutes = require("./server/bl-programs-and-projects/routes"),
    utilityManagerRoutes = require("./server/bl-utility-manager/routes"),
    verifiedSavingsRoutes = require("./server/bl-verified-savings/routes"),
    helpAndUpdatesRoutes = require("./server/bl-help-and-updates/routes");


function startServer(port, runScheduler, isCore) {
    mongoose.connect(config.get("db:connection"), config.get("db:options"), function (mongooseErr) {

        var applicationTitle = config.get("application");//application name, if it is app server
        var isASSurfApp = applicationTitle ?
        applicationTitle.toLowerCase() === consts.APPLICATION.ASSurf : false;

        if(runScheduler && isCore) {
            //run scheduler jobs if it is not application server
            schedulerJob.start();
        }

        var app = express();

        app.use(function (req, res, next) {
            var domain = config.get("domain");
            var cookieDomain = config.get("session:cookieDomain");
            var origin = req.header("host");
            if(origin) {
                origin = origin.toLowerCase().indexOf(cookieDomain) > -1 ? req.headers.origin : domain;
                res.header("Access-Control-Allow-Origin", origin);
            } else {
                res.header("Access-Control-Allow-Origin", "*");
            }
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, viewerTZOffset");
            res.header("Access-Control-Allow-Credentials", true);
            next();
        });

        //check if app is on eb and over http, and then redirect to https
        app.use(function (req, res, next) {
            if ((req.originalUrl.indexOf("/presentation?id=") > -1) &&
                (req.get("X-Forwarded-Proto") && req.get("X-Forwarded-Proto") === "https")) {
                res.redirect("http://" + req.get("Host") + req.url);
            }
            else if ((!req.secure) && (req.originalUrl.indexOf("/presentation?id=") < 0) &&
                (req.get("X-Forwarded-Proto") && req.get("X-Forwarded-Proto") !== "https")) {
                res.redirect("https://" + req.get("Host") + req.url);
            }
            else {
                next();
            }
        });

        var envCDN = config.get("cdn:env");
        log.info("CDN Environment: %s", envCDN);

        // Set the CDN options
        var options = {
            publicDir: path.join(__dirname, "/client"),
            viewsDir: path.join(__dirname, "/server/views"),
            domain: config.get("cdn:domain"),
            bucket: consts.AWS_ASSETS_INFO.BUCKET_NAME,
            key: config.get("aws:auth:accessKeyId"),
            secret: config.get("aws:auth:secretAccessKey"),
            hostname: config.get("cdn:domain"),
            port: (envCDN === "production" ? 443 : config.get("port")),
            ssl: envCDN === "production",
            production: envCDN === "production"
        };

        // Initialize the CDN magic
        var CDN = require("express-cdn")(app, options);

        // view engine setup
        app.set("views", path.join(__dirname, "/server/views"));
        app.set("view engine", "jade");

        app.use(favicon());
        app.use(bodyParser.json({
            limit: "5mb"
        }));
        app.use(bodyParser.urlencoded({
            extended: false,
            limit: "5mb"
        }));
        app.use(multer({dest: "./uploads/"}));
        app.use(cookieParser());

        //session parameters
        var sessionParameters = session({
            name: config.get('session:cookieName'),
            secret: config.get('session:key'),
            saveUninitialized: false,
            resave: false,
            store: new MongoStore({
                db: mongoose.connection.db
            }),
            cookie: {
                path: "/",
                domain: utils.isDevelopmentEnv() ? null : config.get("session:cookieDomain"),
                httpOnly: true,
                secure: config.get("cookie:secure")
            }
        });
        app.use(sessionParameters);

        app.use(express.static(path.join(__dirname, "client")));
        app.use("/apidocs", express.static(__dirname + "/docs"));
        app.use("/documentation", express.static(__dirname + "/docs"));

        // Add the CDN view helper
        app.locals.CDN = CDN();

        var enableAnalyze = config.get("ENABLE_ANALYZE");

        generalRoutes.register(app, isASSurfApp);
        if(!isCore) {
            brighterViewRoutes.register(app);
            brighterSavingsRoutes.register(app);
            energyStarPortfolioManagerRoutes.register(app);
            loadResponseRoutes.register(app);
            programsAndProjectsRoutes.register(app);
            utilityManagerRoutes.register(app);
            verifiedSavingsRoutes.register(app);
            if(enableAnalyze) {
                dataSenseRoutes.register(app);
            }
            helpAndUpdatesRoutes.register(app);
        }

        // catch 404
        app.use(function (req, res, next) {
            var err = new Error("Invalid API endpoint");
            err.url = req.protocol + "://" + req.get("host") + req.originalUrl;
            err.status = 404;

            /* If invalid url is api url, send error response in json format
             * else render 404 jade
             */
            var subDomains = req.subdomains;
            if (subDomains.indexOf("api") > -1) {
                res.send(new utils.serverAnswer(false, err));
            } else {
                var siteAnalytics = config.get("siteAnalytics");
                res.render('404', {errors: err.message, siteAnalytics: siteAnalytics});
            }
        });

        // error handlers
        app.use(function (err, req, res, next) {
            //utils.setAccessControlAllowOrigin(req, res, true);
            res.status(err.status || 500);
            res.send(new utils.serverAnswer(false, err));
        });

        var workerId = cluster.isMaster ? "master" : cluster.worker.id;

        var server = app.listen(port, function () {
            log.info("Express server listening on port: %s worker id: %s", server.address().port, workerId);
            log.info("Environment: %s", config.get("env"));
            log.info('application: ' + applicationTitle);
        });

        var io = require("socket.io").listen(server,
            {
                "transports": [
                    "websocket",
                    "flashsocket",
                    "htmlfile",
                    "xhr-polling",
                    "jsonp-polling",
                    "polling"],
                "pingTimeout": 500000
            });

        if(isASSurfApp) {
            assurfwebsockets.run(io, sessionParameters);
        } else if(!isCore){
            websockets.run(io);
        }
    });
}

var basePort =  process.env.PORT || config.get("port");
var isCore = config.get("CORE");

if(argv.nocluster) {
    startServer(basePort, true, isCore);
} else {

    if (cluster.isMaster) {

        //var applicationTitle = config.get("application");//application name, if it is app server
        if(isCore) {
            //run scheduler jobs in master thread, if it is core
            //scheduler jobs requires connection to db
            mongoose.connect(config.get("db:connection"), config.get("db:options"), function (mongooseErr) {
                schedulerJob.start();
            });
        }

        log.info("CPU count: %s", cpuCount);

        basePort = parseInt(basePort);

        var appPorts = {};

        // Create a worker for each CPU
        for (var i = 0; i < cpuCount; i++) {

            var worker = cluster.fork();
            var workerPort = basePort + i;

            appPorts[worker.id] = workerPort;//save port for reusing if worker die

            worker.send({
                port: workerPort
            })
        }

        cluster.on("exit", function (diedWorker) {
            //Replace the dead worker
            log.info("Worker " + diedWorker.id + " died");
            var worker = cluster.fork();

            var reusedPort = appPorts[diedWorker.id];//find port to reuse
            delete appPorts[diedWorker.id];//delete died worker id
            appPorts[worker.id] = reusedPort;//save port with new worker id

            console.log(appPorts);

            worker.send({
                port: reusedPort
            })
        });

    } else {
        process.on("message", function(msg) {

            if(msg.port) {
                startServer(msg.port, false, isCore);
            }
        });
    }
}


//module.exports = app;
