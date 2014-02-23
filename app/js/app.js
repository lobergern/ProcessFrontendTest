'use strict';


// Declare app level module which depends on filters, and services
var application = angular.module('myApp', [
  'ngRoute',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers',
  'ui.bootstrap'
]);

application.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/welcome', {templateUrl: 'partials/welcome.html'});
  $routeProvider.when('/pageDetails', {
    templateUrl: 'partials/page_details.html',
    controller: 'PageDetailsCtrl',
    resolve: {
      page: function (PageManager, $location) {
        var thePage = PageManager.getPageBeingViewed();
        if (!thePage) {
          $location.path('/welcome');
        }
      }
    }
  });
  $routeProvider.when('/editPage', {
    templateUrl: 'partials/edit_page.html',
    controller: 'EditPageCtrl',
    resolve: {
      page: function (PageManager, $location) {
        var thePage = PageManager.getPageBeingEdited();
        if (!thePage) {
          $location.path('/welcome');
        }
      }
    }
  });
  $routeProvider.when('/addPage', {templateUrl: 'partials/add_page.html', controller: 'AddPageCtrl'});
  $routeProvider.when('/userManagement', {templateUrl: 'partials/user_management.html', controller: 'UserManagementCtrl'});
  $routeProvider.otherwise({redirectTo: '/welcome'});
}]);

application.config(['$httpProvider', function ($httpProvider) {
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
}]);