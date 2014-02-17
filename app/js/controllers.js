'use strict';

/* Controllers */

var controllers = angular.module('myApp.controllers', []);
controllers.controller('MyCtrl1', ['$scope', 'PageManager', function ($scope, PageManager) {
  $scope.getPages = function(){
    PageManager.getPages().then(function(response){
      $scope.pages = response.data.pages;
    });
  };

  $scope.submit = function(){
    PageManager.addPage({youtubeLink:$scope.newPage.youtubeLink, description:$scope.newPage.description, title:$scope.newPage.title})
  };

  $scope.getPages();
}]);
controllers.controller('MyCtrl2', [function () {

}]);