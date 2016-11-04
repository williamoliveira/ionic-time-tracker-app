var mod = angular.module('states.main.index', []);

require('./index.states').load(mod);
require('./index.controller').load(mod);

require('./dashboard/dashboard.controller').load(mod);

require('./categories/categories.controller').load(mod);

require('./listing/listing.controller').load(mod);


module.exports = mod;
