'use strict';


// Declare app level module which depends on filters, and services
var application = angular.module('myApp', [
  'ngRoute',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers'
]);

application.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: 'MyCtrl1'});
  $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: 'MyCtrl2'});
  $routeProvider.when('/pageDetails', {templateUrl: 'partials/page_details.html', controller: 'PageDetailsCtrl'});
  $routeProvider.when('/editPage', {templateUrl: 'partials/edit_page.html', controller: 'EditPageCtrl'});
  $routeProvider.when('/addPage', {templateUrl: 'partials/add_page.html', controller: 'AddPageCtrl'});
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);

application.config(['$httpProvider', function ($httpProvider) {
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
}]);