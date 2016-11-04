module.exports.load = function (mod) {
  mod.run(run);
};

/** @ngInject */
function run(ionicDB, categoryService){


  var categorySchema = ionicDB.builder.schema.createTableIfNotExists('categories', function (table) {
    table.increments();
    table.string('name');
    table.string('icon');
    table.timestamps();
  });

  var timeSchema = ionicDB.builder.schema.createTableIfNotExists('times', function (table) {
    table.increments();
    table.integer('ms');
    table.string('timer');
    table.dateTime('startedAt');
    table.dateTime('endedAt');
    table.integer('categoryId');
    table.timestamps();
    table.foreign('categoryId').references('category.id');
  });

  ionicDB.execute(categorySchema);
  ionicDB.execute(timeSchema);

  categoryService.getAll().then(function(categories){

    if(categories.length < 1){

      var defaultCategories = [
        {
          name: 'Reuniões Operacionais',
          icon: 'ion-chatboxes'
        },
        {
          name: 'Reuniões Estratégicas',
          icon: 'ion-chatboxes'
        },
        {
          name: 'Atividades Operacionais',
          icon: 'ion-document'
        },
        {
          name: 'Atividades Estratégicas',
          icon: 'ion-document'
        },
        {
          name: 'Planejamento',
          icon: 'ion-arrow-graph-up-right'
        },
        {
          name: 'Intervalos',
          icon: 'ion-clock'
        },
        {
          name: 'Almoço e etc',
          icon: 'ion-coffee'
        }
      ];

      for (var i = 0; i < defaultCategories.length; i++) {
        var category = defaultCategories[i];

        categoryService.save(category);
      }
    }
  });

}
