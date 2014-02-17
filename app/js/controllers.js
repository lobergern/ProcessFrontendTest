'use strict';

/* Controllers */

var controllers = angular.module('myApp.controllers', []);
controllers.controller('MyCtrl1', ['$scope', 'PageManager', function ($scope, PageManager) {
  $scope.getPages = function(){
    PageManager.getPages().then(function(response){
      $scope.pages = response.data.pages;
    });
  };

  $scope.getPages();
}]);
controllers.controller('MyCtrl2', [function () {

}]);