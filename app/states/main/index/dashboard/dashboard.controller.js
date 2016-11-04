module.exports.load = function (mod) {
  mod.controller("DashboardController", DashboardController);
};

/** @ngInject */
function DashboardController($scope, categoryService) {

  $scope.stopwatches = [0];

  $scope.newStopwatch = newStopwatch;
  $scope.destroyStopwatch = destroyStopwatch;

  $scope.$on('$ionicView.enter', loadData);

  function loadData(){
    categoryService.getAll().then(function(categories){
      $scope.categories = categories;
    });
  }
  function destroyStopwatch(index){
    $scope.stopwatches.splice(index, 1);

    if($scope.stopwatches.length === 0){
      newStopwatch();
    }
  }

  function newStopwatch(){
    var stopwatchesLength = $scope.stopwatches.length;
    var number = (stopwatchesLength === 0) ? 0 : $scope.stopwatches[stopwatchesLength-1]+1;
    $scope.stopwatches.push(number);
  }

}
