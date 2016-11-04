module.exports = StopwatchController;

/** @ngInject */
function StopwatchController($scope, ionicToast, timeService, categoryService, Stopwatch) {

  var startedAt;

  $scope.$stopwatch = new Stopwatch();

  $scope.stop = stopAndSave;
  $scope.run = run;
  $scope.pause = pause;

  init();


  function init(){
    categoryService.getFirst().then(function(category){
      $scope.selectedCategory = category;
    })
  }

  function run(){

    if(!$scope.selectedCategory){
      return alert('Selecione uma atividade antes de iniciar um cronômetro.');
    }

    $scope.stopwatchRun();
    startedAt = startedAt || new Date();
  }

  function pause(){
    $scope.stopwatchPause();
  }

  function stopAndSave(){

    if($scope.$stopwatch.getTime() < 1){
      return $scope.stopwatchReset();
    }

    var time = {
      startedAt: startedAt,
      endedAt: new Date(),
      ms: $scope.$stopwatch.getTime(),
      timer: $scope.$stopwatch.getTimeFormated(),
      categoryId: $scope.selectedCategory.id
    };

    timeService.save(time).then(function(){
      ionicToast.show('Salvo.', 'top', false, 1000);
    });

    $scope.stopwatchReset();
  }
}
