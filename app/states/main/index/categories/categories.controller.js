var createTemplateUrl = require('./category-create.tpl.html');
var editTemplateUrl = require('./category-edit.tpl.html');

module.exports.load = function(mod){
  mod.controller('CategoriesController', CategoriesController);
};

/** @ngInject */
function CategoriesController($scope, $ionicModal, categoryService){

  $scope.category = {};

  $scope.openCreateModal = openCreateModal;
  $scope.openEditModal = openEditModal;
  $scope.closeCreateModal = closeCreateModal;
  $scope.closeEditModal = closeEditModal;
  $scope.createCategory = createCategory;
  $scope.updateCategory = updateCategory;
  $scope.editCategory = editCategory;

  $scope.$on('$ionicView.enter', loadData);
  registerCreateModal();
  registerEditModal();

  function registerCreateModal(){

    $ionicModal.fromTemplateUrl(createTemplateUrl, {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.createModal = modal;
    });

    $scope.$on('$destroy', function() {
      $scope.createModal.remove();
    });

  }

  function registerEditModal(){

    $ionicModal.fromTemplateUrl(editTemplateUrl, {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.editModal = modal;
    });

    $scope.$on('$destroy', function() {
      $scope.editModal.remove();
    });

  }

  function loadData(){
    categoryService.getAll().then(function(categories){
      $scope.categories = categories;
    });
  }

  function editCategory(category){
    $scope.category = category;
    openEditModal();
  }

  function createCategory(category){

    if(!category.name){
      alert('Formulário inválido');
      return;
    }

    categoryService.save(category).then(loadData);
    $scope.category = {};
    closeCreateModal();
  }

  function updateCategory(category){

    if(!category.name){
      alert('Formulário inválido');
      return;
    }

    categoryService.updateById(category.id, category).then(loadData);
    $scope.category = {};
    closeEditModal();
  }

  function openCreateModal() {
    $scope.createModal.show();
  }

  function closeCreateModal() {
    $scope.createModal.hide();
  }

  function openEditModal() {
    $scope.editModal.show();
  }

  function closeEditModal() {
    $scope.editModal.hide();
  }
}
