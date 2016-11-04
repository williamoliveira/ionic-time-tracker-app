var mod = angular.module("ionic-sql", []);

require("./ionicDB.service.js").load(mod);
require("./ionicDB-util.service.js").load(mod);

module.exports = mod;
