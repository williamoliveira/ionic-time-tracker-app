var knex = require('knex')({
  dialect: 'websql',
  useNullAsDefault: true
});

module.exports.load = function (mod) {
  mod.factory('ionicDB', ionicDB);
};

function ionicDB($window, $q, $log, DB_CONFIG){

  var db = null;

  openDatabase();

  return {
    execute: execute,
    fetchMany: fetchMany,
    fetchFirst: fetchFirst,
    builder: knex
  };

  function openDatabase(){

    if($window.sqlitePlugin){
      $log.debug('Using Cordova SQLite Plugin.');
      return db = $window.sqlitePlugin.openDatabase({name: DB_CONFIG.name, androidLockWorkaround: 1});
    }
    else if($window.openDatabase) {
      $log.debug('Using WebSQL database.');
      return db = $window.openDatabase(DB_CONFIG.name, '1.0', 'database', -1);
    }

    throw Error('No WebSQL or Cordova SQLite Plugin support.');
  }
  function fetchMany(query, bindinds){

    var defer = $q.defer();

    execute(query, bindinds).then(function(results){

      var output = [];

      for (var i = 0; i < results.rows.length; i++) {
        output.push(results.rows.item(i));
      }

      defer.resolve(output);

    });

    return defer.promise;
  }

  function fetchFirst(query, bindinds){
    var defer = $q.defer();

    execute(query, bindinds).then(function(results){
      defer.resolve(results.rows.item(0));
    });

    return defer.promise;
  }

  function execute(query, bindings) {

    query = angular.isString(query) ? query : query.toString();

    $log.debug(query);

    bindings = typeof bindings !== 'undefined' ? bindings : [];
    var deferred = $q.defer();

    db.transaction(function(transaction) {
      transaction.executeSql(query, bindings,
        function(transaction, result) {
          deferred.resolve(result);
        },
        function(transaction, error) {
          deferred.reject(error);
        });
    });



    return deferred.promise;
  }

}
