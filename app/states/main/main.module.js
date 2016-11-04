var mod = angular.module('states.main', [
  require('./index/index.module.js').name
]);

require('./main.controller.js').load(mod);

module.exports = mod;
