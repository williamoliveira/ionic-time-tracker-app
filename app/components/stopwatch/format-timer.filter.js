module.exports.load = function(mod){
  mod.filter('formatTimer', formatTimer);
};

function formatTimer(){

  return function(time) {

    var h = m = s = ms = 0;
    var newTime = '';

    h = Math.floor( time / (60 * 60 * 1000) );
    time = time % (60 * 60 * 1000);
    m = Math.floor( time / (60 * 1000) );
    time = time % (60 * 1000);
    s = Math.floor( time / 1000 );
    ms = time % 1000;

    newTime = pad(h, 2) + ':' + pad(m, 2) + ':' + pad(s, 2) + ':' + pad(ms, 2);
    return newTime;

  };

  function pad(num, size) {
    var s = "0000" + num;
    return s.substr(s.length - size);
  }
}
