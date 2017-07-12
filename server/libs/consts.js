"use strict";

var consts = {
    kW: "kW",
    kWMax: "kW Max",
    kWMin: "kW Min",
    kWh: "kWh",

    WEBBOX: "WebBox",
    EGAUGE: "eGauge",
    ENPHASE: "Enphase",

    icon: "Icon",
    precipType: "PrecipType",
    summary: "Summary",

    precipIntensity: "PrecipIntensity",
    precipProbability: "PrecipProbability",
    temperature: "Temperature",
    apparentTemperature: "ApparentTemperature",
    dewPoint: "DewPoint",
    humidity: "Humidity",
    windSpeed: "WindSpeed",
    windBearing: "WindBearing",
    visibility: "Visibility",
    cloudCover: "CloudCover",
    pressure: "Pressure",
    ozone: "Ozone",
    sunriseTime: "SunriseTime",
    sunsetTime: "SunsetTime",
    precipIntensityMax: "PrecipIntensityMax",
    precipIntensityMaxTime: "PrecipIntensityMaxTime",
    precipAccumulation: "PrecipAccumulation",
    temperatureMin: "TemperatureMin",
    temperatureMinTime: "TemperatureMinTime",
    temperatureMax: "TemperatureMax",
    temperatureMaxTime: "TemperatureMaxTime",
    apparentTemperatureMin: "ApparentTemperatureMin",
    apparentTemperatureMinTime: "ApparentTemperatureMinTime",
    apparentTemperatureMax: "ApparentTemperatureMax",
    apparentTemperatureMaxTime: "ApparentTemperatureMaxTime",
    EMPTY_OBJECT: "[]",

    OK: "OK",
    ASTERISK: "*",
    AT_LEAST_ONE_FACILITY_REQUIRED: "At least one Facility required",
    AT_LEAST_ONE_DATA_LOGGER_REQUIRED: "At least one Data Logger required",
    AT_LEAST_ONE_SENSOR_REQUIRED: "At least one Sensor required",
    AT_LEAST_ONE_METRIC_REQUIRED: "At least one Metric required",
    AT_LEAST_ONE_ACCOUNT_REQUIRED: "At least one Account required",
    AT_LEAST_ONE_DASHBOARD_SEGMENT_REQUIRED: "At least one Dashboard Segment required",
    EMAIL_REQUIRED: "Email is required",
    MESSAGE_REQUIRED: "Message is required",
    PRESENTATION_NAME_REQUIRED: "Presentation name is required",
    PRESENTATION_LINK_REQUIRED: "Presentation link is required",
    DASHBOARD_LINK_REQUIRED: "Dashboard link is required",
    PASSWORD_REQUIRED: "Password is required",
    QUERY_REQUIRED: "Query is required",
    SF_ACCOUNT_REQUIRED: "Salesforce Account Id is required",
    TEMPLATE_NOT_EXISTS: "Template not exists",
    INCORRECT_SECREY_KEY: "Incorrect secret key",
    INCORRECT_EMAIL: "Incorrect email",
    INCORRECT_LIMIT: "Incorrect limit",
    INCORRECT_LOGIN_OR_PASSWORD: "Incorrect login or password",
    UNKNOWN_SF_ACCOUNT: "Unknown SFDC Account",
    INCORRECT_SF_ACCOUNT_ID: "Incorrect SF Account Id",
    SF_CONTACT_ASSOCIATED_WITH_DIFFERENT_SF_ACCOUNT: "SF Contact associated with different SF Account",
    INCORRECT_USER_ID: "Incorrect user Id",
    USER_NOT_EXISTS: "User not exists",
    ACCOUNT_REQUIRED_FOR_UPLOADING_USER_PICTURE: "You should be assigned with account for uploading profile picture",
    ACCOUNT_NOT_EXISTS: "Account not exists",
    INCORRECT_SESSION: "INCORRECT_SESSION",
    INCORRECT_PRESENTATION_ID: "Incorrect presentation Id or presentation has been deleted: ",
    MISSING_PRESENTATION_ID: "Missing presentation Id",
    INCORRECT_DASHBOARD_ID: "Incorrect dashboard Id or dashboard has been deleted: ",
    NOT_UNIQUE_COLLECTIONS: "Collections must be unique for dashboard",
    MISSING_DAASHBOARD_ID: "Missing dashboard Id",
    PRESENTATION_NOT_ACCESSIBLE: "Presentation are not accessible for you",
    DASHBOARD_NOT_ACCESSIBLE: "Dashboard are not accessible for you",
    WIDGETS_NOT_ACCESSIBLE:
        "Widgets are not accessible for you because you do not have access to associated presentation",
    CAN_NOT_REGISTER_BP_USERS: "You can not register BP users",
    CAN_NOT_REGISTER_USERS: "You can not register users",
    CAN_NOT_CREATE_ACCOUNT: "You can not create accounts",
    USER_TAGS_NOT_REGISTERED: "User accessible tags have not registered",
    USER_TAGS_NOT_FOUND: "Not found user accessible tags",
    PRESENTATION_TAGS_NOT_REGISTERED: "Presentation tags have not registered",
    PRESENTATION_TAGS_NOT_FOUND: "Not found presentation tags",
    ONLY_BP_CAN_SAVE_TAG: "Only a BP can save a Tag with this tagType",
    ONLY_BP_CAN_DELETE_TAG: "Only a BP can delete a Tag with this tagType",
    ONLY_BP_CAN_DELETE_RULE: "Only BP can delete that rule",
    ONLY_BP_CAN_ADD_PRESENTATION_EDITOR: "Only BP can add presentation editor",
    ONLY_BP_CAN_REMOVE_PRESENTATION_EDITOR: "Only BP can remove presentation editor",
    ONLY_BP_CAN_SAVE_DASHBOARD: "Only BP can save that Dashboard",
    ONLY_BP_CAN_DELETE_DASHBOARD: "Only BP can delete that Dashboard",
    CAN_NOT_CREATE_TAG: "User has no permission to create Tags",
    CAN_NOT_EDIT_TAG: "User has no permission to edit Tags",
    CAN_NOT_CREATE_RULE: "You can not create Rule",
    CAN_NOT_EDIT_RULE: "You can not edit Rule",
    CAN_NOT_DELETE_TAG: "User has no permission to delete Tags",
    TAG_DOES_NOT_EXIST: "Tag with requested ID does not exist: ",
    GROUP_DOES_NOT_EXIST: "Group with requested ID does not exist: ",
    CAN_NOT_CREATE_GROUP: "User has no permission to create Groups",
    CAN_NOT_EDIT_GROUP: "User has no permission to edit Groups",
    CAN_NOT_DELETE_GROUP: "User has no permission to delete Groups",
    ONLY_BP_CAN_SAVE_GROUP: "Only a BP can save a Group",
    PRESENT_DEVICE_DOES_NOT_EXIST: "Present device with requested ID does not exist: ",
    RULE_NOT_EXISTS: "Rule does not exist: ",
    CAN_NOT_DELETE_PRESENTATION: "You can not delete presentation",
    CAN_NOT_DELETE_RULE: "You can not delete Rule",
    CAN_NOT_DELETE_RESERVED_RULE: "You can not delete reserved Rule",
    CAN_NOT_DELETE_DASHBOARD: "You can not delete dashboard",
    CAN_NOT_EDIT_ACCOUNT: "You can not edit accounts",
    CAN_NOT_EDIT_BP: "You can not edit Brightergy employee",
    INCORRECT_ACCOUNTS_IDS: "At least one unique Account Id is required",
    INCORRECT_SENSORS_IDS: "At least one unique Sensor Id is required",
    CAN_NOT_USE_EXISTING_SF_CONTACT: "You can not use existing Salesforce Contact",
    CAN_NOT_ASSOCIATE_BP_WITH_ACCOUNT: "You can not associate BP with Account",
    CAN_NOT_REGISTER_BP: "You can not register Brightergy employee",
    CAN_NOT_SEE_ADMINS: "You can not see admins",
    DEFAULT_MAPPING_NOT_EXISTS: "Default Mapping does not exists: ",
    CAN_NOT_SAVE_DEFAULT_MAPPING: "You can not save Default Mapping",
    CAN_NOT_DELETE_DEFAULT_MAPPING: "You can not delete Default Mapping",
    CAN_NOT_UPLOAD_GENERAL_ASSETS: "You can not upload general assets",
    CAN_NOT_DELETE_GENERAL_ASSETS: "You can not delete general assets",
    CAN_NOT_UPLOAD_ACCOUNT_ASSETS: "You can not upload account assets",
    CAN_NOT_DELETE_ACCOUNT_ASSETS: "You can not delete account assets",
    UNKNOWN_AWS_ASSETS_KEY: "Unknown AWS assets key prefix",
    PRESENTATION_NOT_EXISTS: "Presentation does not exists: ",
    DASHBOARD_NOT_EXISTS: "Dashboard does not exists: ",
    WIDGET_NOT_EXISTS: "Widget does not exists: ",
    WIDGET_NOT_ADDED_TO_DASHBOARD: "Widget not added to dashboard",
    TAG_IS_BEING_USED: "Tag is being used and therefore cannot be deleted",
    INCORRECT_OR_EXPIRED_TOKEN: "Incorrect or expired action",
    PASSWORD_HAS_BEEN_USED: "Please choose a password you haven't previously used with this account",
    UNEXPECTED_ONEALL_RESPONSE: "Unexpected oneall response",
    NOT_LINKED_SOCIAL_NETWORK: "You are not linked social network with your account",
    LOGIN_PAGE_URL: "/login",
    SET_PASSWORD_PAGE_URL: "/setpassword?token=",
    USER_ACTION_PAGE_URL: "/useraction?token=",
    SOCIAL_LOGIN_URL: "/sociallogin",
    PRESENTATION_PAGE_URL: "/presentation",
    MANAGEMENT_PAGE_URL: "/management",
    DATA_SENCE_PAGE_URL: "/datasense",
    BP_ASSET_URL: "0BwW4a4uizniHLXl6SHA3VDh3LUE",
    CAN_NOT_DELETE_BP: "Yo can not delete Brightergy employee",
    CAN_NOT_DELETE_USERS: "You can not delete users",
    CAN_NOT_DELETE_YOURSELF: "You can not delete yourself",
    CAN_NOT_EDIT_ACCESSIBLE_APPLICATIONS: "You can not edit accessible applications",
    REQUIRED_BP_ROLE: "User should have BP Role",
    UNKNOWN_ASSETS_FOLDER_NAME: "Unknown assets folder name",
    UNKNOWN_ASSETS_FOLDER_ID: "Unknown assets folder Id",
    UNKNOWN_ASSETS_FILE_ID: "Unknown assets file Id",
    NOT_FOUND_ASSETS_FILE: "Not found assets file",
    UNKNOWN_SF_ACCOUNT_ASSETS_ID: "Unknown SF Account assets folder Id",
    UNKNOWN_FILE: "Unknown file",
    UNKNOWN_KEY: "Unknown key",
    UNKNOWN_ENPHASE_USER_ID: "Unknown enphase user Id",
    NOT_UNIQUE_DATA_SENSE_WIDGET_METRICS: "Metric and compareMetric should be different",
    ASSETS_NOT_LOADED: "Your Assets repository is being created, please wait...",
    ASSETS_EMPTY: "Your Assetes repository is empty now",
    NOT_UNIQUE_APPS: "Accessible apps must be unique",
    NOT_ALLOWED_APP: "Not allowed app",
    INCORRECT_DATA_RANGE: "Start date should be less than or equal to end date",
    NOT_ALLOWED_DEFAULT_APP: "Not allowed default app",
    NOT_ACCESSIBLE_PRESENT_APP: "You do not have access to Present application",
    NOT_ACCESSIBLE_ANALYZE_APP: "You do not have access to Analyze application",
    NOT_FOUND_SENSOR_IN_PARENTS: "Not found Sensor in parents",
    TAG_TYPES: ["Facility", "WeatherStation", "Scope", "Node", "Metric"],
    TAG_TYPE: {
        Facility: "Facility",
        WeatherStation: "WeatherStation",
        //DataLogger: "DataLogger",
        //Sensor: "Sensor",
        Metric: "Metric",
        Scope: "Scope",
        Node: "Node"
    },
    NO_PARENT_TAG_TYPE: "None",
    TAG_BINDING_FIELD_NAME: "tagBindings",
    APP_ENTITIES_TAG_FIELD_NAMES: {
        Dashboard: "segments",
        Presentation: "tagBindings" //this.super.TAG_BINDING_FIELD_NAME    //"tagBindings"
    },
    ALL_ENTITIES_TAG_FIELD_NAMES: {
        //this.super.APP_ENTITIES_TAG_FIELD_NAMES["Dashboard"], //"segments",
        Dashboard: "segments",
        //this.super.APP_ENTITIES_TAG_FIELD_NAMES["Presentation"],    //"tagBindings"
        Presentation: "tagBindings",
        // Previous: "accessibleDataSources" // TODO: Should it also be just this.TAG_BINDING_FIELD_NAME ??
        User: "accessibleTags"
    },
    TAG_ENTITIES_FIELD_NAMES: {
        Dashboard: "appEntities",
        Presentation: "appEntities",
        User: "usersWithAccess",
        AnalyzeWidget: "appEntities"
    },
    ENTITY_TYPES: ["Dashboard", "Presentation", "User", "AnalyzeWidget"],
    APP_ENTITY_TYPES: ["Dashboard", "Presentation", "AnalyzeWidget"],
    APP_ENTITY_TYPE: {
        DASHBOARD: "Dashboard",
        PRESENTATION: "Presentation",
        ANALYZE_WIDGET: "AnalyzeWidget"
    },
    USER_WITH_ACCESS_TYPES: ["User"],
    USER_WITH_ACCESS_TYPE: {
        USER: "User"
    },
    CAN_NOT_DESIGNATE_DEFAULT_DASHBOARD: "CAN_NOT_DESIGNATE_DEFAULT_DASHBOARD",
    DEFAULT_DASHBOARD_NOT_EXISTS: "DEFAULT_DASHBOARD_NOT_EXISTS",
    REQUIRED_METRIC_SUMMARY_METHOD: "Summary method is required",
    RESERVED_TAG_RULE_TYPES: ["Facility", "Scope", "WeatherStation", "Node", "Metric"],
    INVALID_ENTITY_TYPE: "Invalid Entity type requested; Type should be an App Entity " +
        "(e.g., \"Dashboard\", \"Presentation\") or a User Entity (i.e., \"User\".",
    INVALID_TAG_TYPE: "Invalid Tag Type",
    MISSING_ENTITY_ID: "Missing Entity ID",
    ALLOWED_DATA_SENSE_WIDGET_TYPES: ["Timeline", "Bar", "Pie", "Image", "Equivalencies",
        "Table", "Boilerplate", "Kpi"],
    ALLOWED_BOILERPLATE_WIDGET_TYPES: ["Current Power", "Communication Monitoring", "Energy Consumed",
        "Energy Produced", "Reimbursement", "CO2 Avoided", "System Information", "Weather", "Location"],
    ALLOWED_METRICS_SUMMARY_METHODS: ["Total", "Average", "Count", "Minimum", "Maximum", "Median"],
    ALLOWED_USER_ROLES: ["BP", "TM", "Admin"],
    ALLOWED_APPS: [
        "Present", "Analyze", "Classroom", "Verify", "Respond", "Utilities", "Projects", "Connect"
    ],
    ALL : "all_data",
    ALL_TYPE : "all_type",
    USER_ROLES: {
        BP: "BP",
        Admin: "Admin",
        TM: "TM"
    },
    BP_ACCOUNT_NAME : "BrightergyPersonnel",
    METRIC_REQUIRED: "Metric is required",
    APPS: {
        Present: "Present",
        Analyze: "Analyze",
        Classroom: "Classroom",
        Verify: "Verify",
        Respond: "Respond",
        Utilities: "Utilities",
        Projects: "Projects",
        Connect: "Connect"
    },
    DATA_SENSE_WIDGET_TYPES: {
        Table: "Table",
        Timeline: "Timeline",
        Bar: "Bar",
        Pie: "Pie",
        Image: "Image",
        Equivalencies: "Equivalencies",
        Boilerplate: "Boilerplate",
        Kpi: "Kpi"
    },
    UNKNOWN_BOILERPLATE_TYPE: "Unknown boilerplate type",
    NOT_FOUND_BOILERPLATE_COMMUNICATION_MONITORING_WIDGET:
        "Not found Boilerplate Communication Monitoring widget",
    BOILERPLATE_WIDGET_TYPES: {
        CurrentPower: "Current Power",
        CommunicationMonitoring: "Communication Monitoring",
        EnergyConsumed: "Energy Consumed",
        EnergyProduced: "Energy Produced",
        Reimbursement: "Reimbursement",
        CO2Avoided: "CO2 Avoided",
        SystemInformation: "System Information",
        Weather: "Weather",
        Location: "Location"
    },
    AWS_ASSETS_INFO: {
        BUCKET_NAME: "blassets",
        CNAMES: ["cdn","assets","blassets"],
        PLATFORM_ASSETS_FOLDER: "PlatformAssets",
        CUSTOM_ASSETS_FOLDER: "CustomAssets"
    },
    BRIGHTERVIEW_WIDGET_TYPES: {
        Graph: "graph",
        Solar: "solar",
        EnergyEquivalencies: "energyEquivalencies",
        Weather: "weather"
    },
    PRESENTATION_ENERGY_DATA: "Presentation energy data",
    METRIC_NAMES: {
        Reimbursement: "Reimbursement",
        Wh: "Energy (Wh)",
        kWh: "Energy (kWh)",
        Watts: "Power (W)",
        kW: "Power (kW)",
        WattsMax: "Max Watts",
        WattsMin: "Min Watts"
    },
    SUMMARY_METHOD_TYPES: ["Total", "Average", "Count", "Minimum", "Maximum"],
    METRIC_TYPE: {
        Datafeed: "Datafeed",
        Calculated: "Calculated"
    },
    DIMENSIONS: {
        // GEOGRAPHIC BASE DIMENSIONS
        CONTINENT: "Continent",
        COUNTRY: "Country",
        STATE: "State",
        CITY: "City",
        ZIP_CODE: "Zip code",
        LATITUDE: "Latitude",
        LONGITUDE: "Longitude",
        // TIME BASE DIMENSIONS
        YEAR: "Year",
        MONTH_OF_YEAR: "Month of the Year",
        WEEK_OF_YEAR: "Week of the Year",
        DAY_OF_MONTH: "Day of the Month",
        DAY_OF_WEEK: "Day of the Week",
        HOUR_OF_DAY: "Hour of the Day",
        MINUTE_OF_HOUR: "Minute of the Hour",
        MONTH: "Month",
        WEEK: "Week",
        DATE: "Date",
        HOUR: "Hour",
        MINUTE: "Minute",
        MONTH_INDEX: "Month Index",
        WEEK_INDEX: "Week Index",
        DAY_INDEX: "Day Index",
        HOUR_INDEX: "Hour Index",
        MINUTE_INDEX: "Minute Index",
        // ORGANIZATION BASE DIMENSIONS
        ACCOUNT: "Account",
        TEAM_MEMBER_WITH_ACCESS: "Team Members with Access",
        // ORIGIN BASE DIMENSIONS
        SOURCE_TYPE: "Source Type",
        ACCESS_METHOD: "Access Method",
        DATA_LOGGER_MANUFACTURER: "DataLogger Manufacturer - manufacturer of metric’s datalogger",
        DATA_LOGGER_DEVICE: "DataLogger Device - device name of metric’s datalogger",
        SENSOR_MANUFACTURER: "Sensor Manufacturer - manufacturer of metric’s sensor",
        SENSOR_DEVICE: "Sensor Device - device name of metric’s sensor",
        // CUSTOM DIMENSION
        CUSTOM: "--Custom--"
    },
    UNKNOWN_UTILITY_PROVIDER: "Unknown Utility Provider",
    UNKNOWN_FACILITY: "Unknown Facility",
    NOT_ALLOWED_USER_ROLE: "Not allowed user role",
    NOT_ALLOWED_RULE_TYPE: "Not allowed rule type",
    NOT_ALLOWED_TAG_TYPES_RELATIONSHIP:
        "Rule engine does not allow connecting supplied child tagType and parent tagType",
    DUPLICATE_RULE_TYPE: "Duplicate role type",
    LOGIN_REQUIRED_FOR_ACTION: "You need login to perform this action",
    CAN_NOT_CHANGE_CREATOR_ROLE: "Creator role is not changeable",
    CAN_NOT_CHANGE_CREATOR: "Creator is not changeable",
    CAN_NOT_CHANGE_USER_ROLE: "User role is not changeable",
    CAN_NOT_CHANGE_SFDC_ACCOUNT: "SFDC Account Id is not changeable",
    CAN_NOT_CHANGE_TAG_TYPE: "Tag type is not changeable",
    CAN_NOT_CHANGE_RULE_TYPE: "Rule type is not changeable",
    GEO_NOT_EXIST: "Missing latitude and longitude",
    FORECAST_URL_WITH_GEO: "http://forecast.io/#/f/",
    GOOGLEMAP_URL_WITH_GEO: "http://maps.google.com/?q=",
    CAN_NOT_MARK_PRIVATE_DASHBOARD: "You can not mark this dashboard as private",
    ERROR_IN_OBJECT_BINDING_PAIR: "An error occurred while attempting to retrieve object binding pair",
    REQUIRE_ACCESSIBLE_TAGS_FOR_USER: "You need to add at least one source for Admin/TM",

    "USER_COOKIE": {
        "STATUS_COOKIE_NAME": "status"
    },

    USER_TOKENS: {
        SET_PASSWORD: "SetPassword",
        ApproveChangingEmailFromNewAddress: "ApproveChangingEmailFromNewAddress",
        RejectChangingEmailFromOldAddress: "RejectChangingEmailFromOldAddress",
        ApproveChangingMasterManagerFromNewAddress: "ApproveChangingMasterManagerFromNewAddress",
        RejectChangingMasterManagerFromOldAddress: "RejectChangingMasterManagerFromOldAddress"
    },

    ASSETS_THUMBNAIL_SIZE: {
        WIDTH : 192,
        HEIGHT : 144
    },

    BRIGHTERVIEW_INTERVALS: {
        Hourly: "Hourly",
        Daily: "Daily",
        Weekly: "Weekly",
        Monthly: "Monthly",
        Yearly: "Yearly"
    },

    ALLOWED_SINGLE_POINT_AGGREGATION: ["Median", "Mode", "Min", "Max", "Total", "Average", "Count"],

    SINGLE_POINT_AGGREGATION: {
        Median: "Median",
        Mode: "Mode",
        Min: "Min",
        Max: "Max",
        Total: "Total",
        Average: "Average",
        Count: "Count"
    },

    METRIC_SUMMARY_METHODS: {
        Total: "Total",
        Average: "Average",
        Count: "Count",
        Minimum:"Minimum",
        Maximum: "Maximum",
        Median: "Median"
    },

    NOT_ALLOWED_TIME_ZONE: "Not allowed time zone",

    TIME_ZONES: [
        {
            name: "Atlantic Daylight Time",
            offset: -180
        } ,
        {
            name: "Atlantic Standard Time",
            offset: -240
        },
        {
            name: "Alaska Daylight Time",
            offset: -480
        },
        {
            name: "Alaska Standard Time",
            offset: -540
        },
        {
            name: "Central Daylight Time",
            offset: -300
        },
        {
            name: "Central Standard Time",
            offset: -360
        },
        {
            name: "Eastern Daylight Time",
            offset: -240
        },
        {
            name: "Eastern Standard Time",
            offset: -300
        },
        {
            name: "Eastern Greenland Summer Time",
            offset: 0
        },
        {
            name: "East Greenland Time",
            offset: -60
        },
        {
            name: "Greenwich Mean Time",
            offset: 0
        },
        {
            name: "Hawaii-Aleutian Daylight Time",
            offset: -540
        },
        {
            name: "Hawaii-Aleutian Standard Time",
            offset: -600
        },
        {
            name: "Mountain Daylight Time",
            offset: -360
        },
        {
            name: "Mountain Standard Time",
            offset: -420
        },
        {
            name: "Newfoundland Daylight Time",
            offset: -150
        },
        {
            name: "Newfoundland Standard Time",
            offset: -210
        },
        {
            name: "Pacific Daylight Time",
            offset: -420
        },
        {
            name: "Pacific Standard Time",
            offset: -480
        },
        {
            name: "Pierre & Miquelon Daylight Time",
            offset: -120
        },
        {
            name: "Pierre & Miquelon Standard Time",
            offset: -180
        },
        {
            name: "Western Greenland Summer Time",
            offset: -120
        },
        {
            name: "West Greenland Time",
            offset: -180
        }
    ],

    WEBSOCKET_EVENTS: {
        DASHBOARD_DATA: "dashboardData",
        PRESENTATION_DATA: "presentationData",
        PRESENTATION: {
            DeviceConfig: "present:deviceconfigs",
            DeviceLogs: "present:devicelogs",
            DeviceInfo: "present:deviceinfo",
            inputDeviceInfo: "present:getdeviceinfo"
        },
        ASSURF: {
            Weather: "assurf:weather",
            WeatherHistory: "assurf:weatherhistory",
            Sources: "assurf:sources",
            SolarEnergyGeneration: "assurf:solarenergygeneration",
            inputSolarEnergyGeneration: "assurf:getsolarenergygeneration",
            YeildComparator: "assurf:yeildcomparator",
            inputYeildComparator: "assurf:getyeildcomparator",
            Energy: "assurf:energy",
            Power: "assurf:power",
            inputPower: "assurf:getpower",
            inputEnergy: "assurf:getenergy",
            Equivalencies: "assurf:equivalencies",
            inputEquivalencies: "assurf:getequivalencies",
            CarbonAvoided: "assurf:carbonavoided",
            inputCarbonAvoided: "assurf:getcarbonavoided",
            RealTimePower: "assurf:realtimepower",
            inputRealTimePower: "assurf:getrealtimepower",
            CurrentPowerChart: "assurf:currentpower",
            FacilityDrillDown: "assurf:facilitydrilldown",
            inputFacilityDrillDown: "assurf:inputfacilitydrilldown",
            SunnyDay: "assurf:sunnyday",
            Savings: "assurf:savings",
            inputSavings: "assurf:getsavings",
            ActualPredictedEnergy: "assurf:actualpredictedenergy",
            inputActualPredictedEnergy: "assurf:inputactualpredictedenergy",
            SunHours: "assurf:sunhours",
            SunHoursRealtime: "assurf:sunhoursrealtime",
            TotalEnergyGeneration: "assurf:totalenergygeneration",
            inputTotalEnergyGeneration: "assurf:gettotalenergygeneration",
            SolarEnergyGenerationDrilldown: "assurf:solarenergygenerationdrilldown",
            inputSolarEnergyGenerationDrilldown: "assurf:getsolarenergygenerationdrilldown",
            inputSelectedSources: "assurf:selectedsources",
            EnergyTodayKPIDrilldown: "assurf:energytodaykpidrilldown",
            Table: "assurf:table"
        }
    },
    NOT_ALLOWED_EMPTY_SELECTION: "Empty selection not allowed.",
    ALLOWED_SUB_DAY: ["12h", "6h", "3h", "1h", "10m"],

    SUB_DAY: {
        h12: "12h",
        h6: "6h",
        h3: "3h",
        h1: "1h",
        m10: "10m"
    },

    NOT_ALLOWED_SUB_DAY: "Not allowed sub day",

    CLIENT_CSS_FILES: {
        LIBRARY: {
            NVD3: "./client/lib/d3/nv.d3.css",
            BOOTSTRAP3: "./client/lib/bootstrap/css/bootstrap.min.css"
        },
        COMMON: ["./client/assets/css/general.min.css"],
        ANALYZE_APP: ["./client/bl-data-sense/assets/css/datasense.min.css"]
    },

    "DATE_TIME_FORMAT": {
        UTC: "UTC",
        LocalTime: "Local Time",
        AutomaticDaylightSavings: "Automatic Daylight Savings"
    },

    "ALLOWED_DATE_TIME_FORMAT": ["UTC", "Local Time", "Automatic Daylight Savings"],

    NOT_ALLOWED_DATE_TIME_FORMAT: "Not allowed date time format",

    INCORRECT_CREATE_ACCOUNT_BODY: "Please specify user and account objects",

    NODE_TYPES: ["Solar", "Generation", "Supply"],

    NODE_TYPE: {
        Solar: "Solar",
        Generation: "Generation",
        Supply: "Supply"
    },

    NOT_ALLOWED_NODE_TYPE: "Not allowed node type",

    APPLICATION: {
        Analyze: "analyze",
        ASSurf: "assurf",
        Present: "present"
    },

    ASSURF_TEMPOIQ_CACHE_TTL: 1800

};

module.exports = consts;
