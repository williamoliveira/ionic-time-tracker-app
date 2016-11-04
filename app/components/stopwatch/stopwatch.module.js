var mod = angular.module("app.stopwatch", []);

require("./stopwatch.service").load(mod);
require("./stopwatch.directive").load(mod);
require("./format-timer.filter").load(mod);

module.exports = mod;
