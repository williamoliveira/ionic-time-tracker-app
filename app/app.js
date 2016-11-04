var libsModule = require('./boot');

window._ = require('lodash');
require('angular-moment');
require('d3/d3');
require('ionic-toast/src/ionic-toast');
require('pie-chart/dist/pie-chart');
require('angular-charts/dist/angular-charts');
require('ion-datetime-picker/release/ion-datetime-picker.min');
require('./libs/ionic-modal-select');

// styles
require('ionic-toast/src/style.css');
require('../scss/ionic.app.scss');

var app = angular.module('gestorTempoApp', [

  /*
   * Dependences
   */
  libsModule.name,
  'ui.router', // state routing
  'angularMoment',
  'ion-datetime-picker',
  'ionic-modal-select',
  'angularCharts',
  'n3-pie-chart',
  'ionic-toast',

  /*
   * Components
   */

  require('./components/angular-locales/pt-br.module').name,
  require('./components/ionicDB/ionicDB.module.js').name,
  require('./components/stopwatch/stopwatch.module.js').name,
  require('./components/ionic-icon-picker/ionic-icon-picker.module').name,
  require('./domains/time/time.module.js').name,
  require('./states/main/main.module').name  // States (main state requires child states and so on)


]);

//global config
require('./config').load(app);
require('./migrate.run').load(app);
require('./update.run').load(app);
require('./run').load(app);

//constants
app.constant('APP', {
  name: 'Gestor de Tempo'
});

app.constant('DB_CONFIG', {
  name: 'DB'
});

libsModule.ionicBootstrap(app, global);
