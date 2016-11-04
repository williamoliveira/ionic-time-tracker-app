var listingResultTemplateUrl = require('./listing-result.tpl.html');
var listingTimeTemplateUrl = require('./listing-times.tpl.html');

module.exports.load = function(mod){
  mod.controller('ListingController', ListingController);
};

/** @ngInject */
function ListingController($scope, $window, $ionicModal, moment, categoryService){

  var getColor = $window.d3.scale.category10();

  $scope.intervals = getIntervals();
  $scope.customInterval = $scope.intervals[$scope.intervals.length-1];
  $scope.selectedInterval = $scope.intervals[0];
  $scope.interval = {};
  $scope.chartOptions = {thickness: 100};


  $scope.getCategoryTotalTime = getCategoryTotalTime;
  $scope.openResultModal = openResultModal;
  $scope.closeResultModal = closeResultModal;
  $scope.filterListing = filterListing;
  $scope.intervalChanged = intervalChanged;
  $scope.openTimeModal = openTimeModal;
  $scope.closeTimeModal = closeTimeModal;
  $scope.displayCategoryTimes = displayCategoryTimes;

  intervalChanged($scope.selectedInterval);
  registerResultModal();
  registerTimeModal();

  function intervalChanged(selectedInterval){
    $scope.interval.startsAt = selectedInterval.startsAt;
    $scope.interval.endsAt = selectedInterval.endsAt;
  }

  function filterListing(interval){
    openResultModal();
    loadData(interval);
  }

  function loadData(interval){
    categoryService.getManyByDateRange(interval.startsAt, interval.endsAt)
      .then(function(categories){
        $scope.categories = categories;
        loadChartData(categories);
      });
  }


  function loadChartData(categories){
    var chartData = [];

    for (var i = 0; i < categories.length; i++) {
      var category = categories[i];

      var color =  getColor(i);

      chartData.push({
        label: category.name,
        value: category.totalMs,
        color: color
      });

      category.color = color;
    }

    $scope.chartData = chartData;
  }

  function displayCategoryTimes(category){
    $scope.category = category;
    openTimeModal();
  }

  function getCategoryTotalTime(category){
    return categoryService.getCategoryTotalTime(category);
  }

  function registerResultModal(){

    $ionicModal.fromTemplateUrl(listingResultTemplateUrl, {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.resultModal = modal;
    });

    $scope.$on('$destroy', function() {
      $scope.resultModal.remove();
    });

  }
  function openResultModal() {
    $scope.resultModal.show();
  }

  function closeResultModal() {
    $scope.resultModal.hide();
  }

  function registerTimeModal(){

    $ionicModal.fromTemplateUrl(listingTimeTemplateUrl, {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.timeModal = modal;
    });

    $scope.$on('$destroy', function() {
      $scope.timeModal.remove();
    });

  }

  function openTimeModal() {
    $scope.timeModal.show();
  }

  function closeTimeModal() {
    $scope.timeModal.hide();
    $scope.category = {};
  }

  function getIntervals(){

    return [
      {
        name: 'Este ano',
        startsAt: moment().startOf('year').toDate(),
        endsAt: moment().endOf('year').toDate()
      },
      {
        name: 'Este mês',
        startsAt: moment().startOf('month').toDate(),
        endsAt: moment().endOf('month').toDate()
      },
      {
        name: 'Esta semana',
        startsAt: moment().startOf('week').toDate(),
        endsAt: moment().endOf('week').toDate()
      },
      {
        name: 'Últimos 365 dias',
        startsAt: moment().subtract(365, 'days').toDate(),
        endsAt: moment().toDate()
      },
      {
        name: 'Últimos 30 dias',
        startsAt: moment().subtract(30, 'days').toDate(),
        endsAt: moment().toDate()
      },
      {
        name: 'Últimos 7 dias',
        startsAt: moment().subtract(7, 'days').toDate(),
        endsAt: moment().toDate()
      },
      {
        name: 'Ano passado',
        startsAt: moment().subtract(1, 'year').startOf('year').toDate(),
        endsAt: moment().subtract(1, 'year').endOf('year').toDate()
      },
      {
        name: 'Mês passado',
        startsAt: moment().subtract(1, 'month').startOf('month').toDate(),
        endsAt: moment().subtract(1, 'month').endOf('month').toDate()
      },
      {
        name: 'Semana passada',
        startsAt: moment().subtract(1, 'week').startOf('week').toDate(),
        endsAt: moment().subtract(1, 'week').endOf('week').toDate()
      },
      {
        name: 'Outro...',
        startsAt: null,
        endsAt: null
      }

    ];
  }
}
