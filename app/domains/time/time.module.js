var mod = angular.module('domains.time', []);

require('./category.service').load(mod);
require('./time.service').load(mod);

module.exports = mod;
