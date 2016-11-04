module.exports.load = function(mod){
  mod.factory('categoryService', categoryService);
};

/** @ngInject */
function categoryService($q, $filter, ionicDBUtil, ionicDB){

  var PRIMARY_KEY = 'id';

  var CATEGORIES_TABLE = 'categories';
  var TIMES_TABLE = 'times';

  return {
    getFirst: getFirst,
    save: save,
    deleteById: deleteById,
    updateById: updateById,
    getById: getById,
    getManyByDateRange: getManyByDateRange,
    getAll: getAll
  };

  function getFirst(){
    return ionicDB.fetchFirst(ionicDB.builder(CATEGORIES_TABLE));
  }

  function save(obj){

    var now = new Date();

    var newCategory = {
      name: obj.name || '',
      icon: obj.icon || 'ion-pricetag',
      created_at: now,
      updated_at: now
    };

    var query = ionicDB.builder(CATEGORIES_TABLE).insert(newCategory);

    return ionicDB.execute(query);
  }

  function deleteById(id){

  }

  function updateById(id, obj){
    var now = new Date();

    var newCategory = {
      name: obj.name || '',
      icon: obj.icon || 'ion-pricetag',
      updated_at: now
    };

    var query = ionicDB.builder(CATEGORIES_TABLE).where(PRIMARY_KEY, id).update(newCategory);

    return ionicDB.execute(query);
  }

  function getById(id){

    var query = ionicDB.builder(CATEGORIES_TABLE).where(PRIMARY_KEY, id);

    return ionicDB.fetchFirst(query);
  }

  function getAll(){

    var defer = $q.defer();

    queryHasMany(ionicDB.builder(CATEGORIES_TABLE), TIMES_TABLE, 'categoryId', PRIMARY_KEY)
      .then(function(categories){
        defer.resolve(setCategoryTotalTimes(categories));
      })
      .catch(function(reason){
        defer.reject(reason);
      });

    return defer.promise;
  }

  function queryHasMany(query, relationTable, foreignKey, entityPrimaryKey){

    var defer = $q.defer();

    ionicDB.fetchMany(query)
      .then(function(entities){

        var relationQuery = ionicDB.builder(relationTable)
          .whereIn(foreignKey, ionicDBUtil.getPrimaryKeys(entities, entityPrimaryKey));

        ionicDB.fetchMany(relationQuery).then(function(relations){
          defer.resolve(ionicDBUtil.relate(entities, relations, relationTable, foreignKey));
        });

      })
      .catch(function(reason){
        defer.reject(reason);
      });

    return defer.promise;

  }

  function setCategoryTotalTimes(categories){

    for (var i = 0; i < categories.length; i++) {
      var category = categories[i];

      setCategoryTotalTime(category);
    }

    return $q.resolve(categories);

  }

  function setCategoryTotalTime(category){

    var totalMs = 0;

    for (var i = 0; i < category.times.length; i++) {
      var time = category.times[i];

      totalMs += time.ms;
    }

    category.totalMs = totalMs;
    category.totalTimer = $filter('formatTimer')(totalMs);

    return $q.resolve(category);

  }

  function getManyByDateRange(dateStart, dateEnd){

    var query = ionicDB.builder(CATEGORIES_TABLE);

    if(dateStart && dateEnd) {
      query.whereExists(function(){
        this.select('*').from(TIMES_TABLE).whereBetween('startedAt', [dateStart, dateEnd]);
      });
    }
    else if(dateStart){
      query.whereExists(function(){
        this.select('*').from(TIMES_TABLE).where('startedAt', '>', dateStart);
      });
    }
    else if(dateEnd){
      query.whereExists(function(){
        this.select('*').from(TIMES_TABLE).where('startedAt', '<', dateEnd);
      });
    }

    var defer = $q.defer();

    queryHasMany(query, TIMES_TABLE, 'categoryId', PRIMARY_KEY)
      .then(function(categories){
        defer.resolve(setCategoryTotalTimes(categories));
      })
      .catch(function(reason){
        defer.reject(reason);
      });

    return defer.promise;
  }
}
