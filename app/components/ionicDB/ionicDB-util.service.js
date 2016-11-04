module.exports.load = function(mod){
  mod.factory('ionicDBUtil', ionicDBUtil);
};

/** @ngInject */
function ionicDBUtil(){

  var DEFAULT_PRIMARY_KEY_ATTR = 'id';

  return {
    getPrimaryKeys: getPrimaryKeys,
    relate: relate
  };

  function getPrimaryKeys(entities, primaryKeyAttr){

    primaryKeyAttr = primaryKeyAttr || DEFAULT_PRIMARY_KEY_ATTR;

    var primaryKeys = [];

    for (var i = 0; i < entities.length; i++) {
      var entity = entities[i];

      primaryKeys.push(entity[primaryKeyAttr]);
    }

    return primaryKeys;
  }

  function relate(entities, relations, relationName, foreignKey, primaryKeyAttr){

    entities = entities || [];
    relations = relations || [];
    primaryKeyAttr = primaryKeyAttr || DEFAULT_PRIMARY_KEY_ATTR;

    for (var j = 0; j < entities.length; j++) {
      var entity = entities[j];

      entity[relationName] = entity[relationName] || [];

      for (var i = 0; i < relations.length; i++) {
        var relative = relations[i];

        if(relative[foreignKey] === entity[primaryKeyAttr]){
          entity[relationName].push(relative);
        }
      }
    }

    return entities;
  }
}
