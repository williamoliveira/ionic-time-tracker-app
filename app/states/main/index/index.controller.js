module.exports.load = function (mod) {
  mod.controller('IndexController', IndexController);
};

/** @ngInject */
function IndexController($scope) {

  $scope.pageTitle = 'Gestor de Tempo';
}
