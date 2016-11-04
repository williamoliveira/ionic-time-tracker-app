var mod = angular.module("app.oauth", []);

require("./auth-bearer-token.service.js").load(mod);
require("./auth-refresh-token.service").load(mod);
require("./token-interceptor.service").load(mod);
require("./auth.service").load(mod);
require('./auth-listener.run').load(mod);

module.exports = mod;