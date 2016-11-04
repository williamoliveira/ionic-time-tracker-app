var StopwatchController = require('./stopwatch.controller');
var stopwatchTemplateUrl = require('./stopwatch.tpl.html');

module.exports.load = function(mod){
  mod.directive('stopwatch', stopwatchDirective);
};

/** @ngInject */
function stopwatchDirective() {

  return {
    restrict: "AE", //E = element, A = attribute, C = class, M = comment,
    controller: StopwatchController,
    templateUrl: stopwatchTemplateUrl,
    link: function(scope, iElement, iAttrs, ngModelController, transclude){

      var _stopwatchTimer = angular.element(iElement[0].querySelector('#stopwatch-timer'));

      var timerInterval = null;

      updateHtml();

      scope.stopwatchRun = function(){

        scope.$stopwatch.run();

        timerInterval = setInterval(function(){
          updateHtml()
        }, 51);

      };

      scope.stopwatchPause = function(){
        clearInterval(timerInterval);
        scope.$stopwatch.pause();
      };

      scope.stopwatchReset = function(){
        clearInterval(timerInterval);
        scope.$stopwatch.reset();
        updateHtml();
      };

      function updateHtml(){
        _stopwatchTimer.html(scope.$stopwatch.getTimeFormated());
      }
    }
  }

}
