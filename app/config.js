module.exports.load = function (mod) {
  mod.config(config);
};

/** @ngInject */
function config($ionicConfigProvider, $urlRouterProvider) {

  $ionicConfigProvider.views.transition('platform');

  //Default route
  $urlRouterProvider.otherwise(function ($injector) {
    var $state = $injector.get("$state");
    $state.go("home");
  });

  $ionicConfigProvider.tabs.position("bottom"); //Places them at the bottom for all OS
  $ionicConfigProvider.tabs.style("standard"); //Makes them all look the same across all OS

  // note that you can also chain configs
  $ionicConfigProvider.backButton.text('Voltar').icon('ion-chevron-left');


}
