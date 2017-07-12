"use strict";

//require all nested models

var models = ["data-source.js", "tag.js", "tag-rule.js", "default-mapping.js",
	"manufacturer.js", "account.js", "user.js", "device.js", "timezone.js",
	"group.js", "present-device.js", "present-devices-log.js"];

var l = models.length;
for (var i = 0; i < l; i++) {
    var model = "./" + models[i];
    require(model)();
}
