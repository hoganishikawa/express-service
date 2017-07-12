/**
 * Validate Javascript Files
 *
 * ---------------------------------------------------------------
 * This task is configured to validate all javascript files across codebase
 * JSHint for detect errors and potential problems in javascript files
 *      , and make reports files with beautiful html markups
 *
 * JSCS for enforce coding rules in team
 *
 * For more information:
 *      https://www.npmjs.org/package/gulp-jshint
 * 		https://github.com/jscs-dev/gulp-jscs
 *
 */

module.exports = function(gulp) {

    var jshint = require('gulp-jshint');

    var paths = {
        'client': {
            'files': ['./client/**/*.js', '!./client/lib/**/*.js', '!./client/dist/*.js','!./client/components/**/dist/*.js'],
            'log': './logs/jshint-frontend-output.html',
            'jshintrc': './client/.jshintrc'
        },
        'server': {
            'files': ['./server/**/*.js', '!./server/node_modules/**/*.js'],
            'log': './logs/jshint-backend-output.html',
            'jshintrc': './server/.jshintrc'
        }
    };

    gulp.task('jshint-client', function(){
        return gulp.src(paths.client.files)
            .pipe(jshint(paths.client.jshintrc))
            .pipe(jshint.reporter('gulp-jshint-html-reporter', {
                filename: paths.client.log
            }))
            .pipe(jshint.reporter('fail'));
    });

    gulp.task('jshint-server', function(){
        return gulp.src(paths.server.files)
            .pipe(jshint(paths.server.jshintrc))
            .pipe(jshint.reporter('gulp-jshint-html-reporter', {
                filename: paths.server.log
            }))
            .pipe(jshint.reporter('fail'));
    });

    gulp.task('jshint', ['jshint-client', 'jshint-server']);

};