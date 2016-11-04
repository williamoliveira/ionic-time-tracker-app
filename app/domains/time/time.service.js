module.exports.load = function(mod){
  mod.factory('timeService', timeService);
};

function timeService(ionicDB){

  var timeTable = ionicDB.builder('times');

  var PRIMARY_KEY = 'id';

  return {
    save: save,
    deleteById: deleteById,
    updateById: updateById,
    getById: getById,
    getAll: getAll
  };

  function save(obj){

    var time = {
      startedAt: obj.startedAt,
      endedAt: obj.endedAt,
      ms: obj.ms,
      timer: obj.timer,
      categoryId: obj.categoryId
    };

    var query = timeTable.insert(time);

    return ionicDB.execute(query);
  }

  function deleteById(id){

  }

  function updateById(id, obj){

  }

  function getById(id){
    return timeTable.first(timeTable.where(PRIMARY_KEY, id));
  }

  function getAll(){
    return timeTable.fetchMany(timeTable);
  }


}
