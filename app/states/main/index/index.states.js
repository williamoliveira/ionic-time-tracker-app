var indexTemplate = require('./index.tpl.html');
var dashboardTemplateUrl = require('./dashboard/dashboard.tpl.html');
var categoriesTemplateUrl = require('./categories/categories.tpl.html');
var listingTemplateUrl = require('./listing/listing.tpl.html');

module.exports.load = function (mod) {
  mod.config(states);
};

/** @ngInject */
function states($stateProvider) {

  $stateProvider.state("home", {
    /** @ngInject */
    onEnter: function($state){
      $state.go("index.dashboard")
    }
  });

  $stateProvider.state("slash", {
    /** @ngInject */
    onEnter: function($state){
      $state.go("index.dashboard")
    }
  });

  $stateProvider.state("index", {
    url: "",
    abstract: true,
    templateUrl: indexTemplate,
    controller: 'IndexController'
  });

  $stateProvider.state('index.dashboard', {
    url: "/dashboard",
    views: {
      'dash-tab': {
        templateUrl: dashboardTemplateUrl,
        controller: 'DashboardController'
      }
    }
  });

  $stateProvider.state('index.categories', {
    url: "/categories",
    views: {
      'cat-tab': {
        templateUrl: categoriesTemplateUrl,
        controller: 'CategoriesController'
      }
    }
  });

  $stateProvider.state('index.listing', {
    url: "/listing",
    views: {
      'list-tab': {
        templateUrl: listingTemplateUrl,
        controller: 'ListingController'
      }
    }
  });

}
