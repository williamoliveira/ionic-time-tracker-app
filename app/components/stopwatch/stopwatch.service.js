module.exports.load = function(mod){
  mod.factory('Stopwatch', Stopwatch);
};

/** @ngInject */
function Stopwatch($interval, $filter) {

  var INTERVAL = 10;
  var defaultTime = '00:00:00:00';

  return Instance;

  function Instance() {
    var self = this;

    // Private vars
    var	startAt	= 0;	// Time of last start / resume. (0 if not running)
    var	lapTime	= 0;	// Time on the clock when last stopped in milliseconds

    self.data = {
      status: 'stopped'
    };

    self.run = function () {

      startAt	= startAt ? startAt : now();

      self.data.status = 'running';
    };

    self.pause = function () {

      // If running, update elapsed time otherwise keep it
      lapTime	= startAt ? lapTime + now() - startAt : lapTime;
      startAt	= 0; // Paused

      self.data.status = 'paused';
    };

    self.reset = function () {
      lapTime = startAt = 0;

      self.data.status = 'stopped';
    };

    self.getTime = function() {
      return lapTime + (startAt ? now() - startAt : 0);
    };

    self.getTimeFormated = function(){
      return $filter('formatTimer')(self.getTime());
    };

    return self;
  }

  function now() {
    return (new Date()).getTime();
  }

}
