'use strict';

/* Controllers */

var controllers = angular.module('myApp.controllers', []);
controllers.controller('MyCtrl1', ['$scope', 'PageManager', function ($scope, PageManager) {
  $scope.pageBeingEdited = null;

  $scope.getPages = function () {
    PageManager.getPages().then(function (response) {
      $scope.pages = response.data.pages;
    });
  };

  $scope.submit = function () {
    PageManager.addPage({video: $scope.newPage.video, description: $scope.newPage.description, title: $scope.newPage.title})
  };

  $scope.setPageBeingEdited = function (page) {
    $scope.pageBeingEdited = $.extend({}, page);
  };

  $scope.editPage = function () {
    if ($scope.pageBeingEdited = null) {
      alert('no page being edited')
    } else {
      PageManager.editPage($scope.pageBeingEdited).then(function (response) {
        if (response.status == 200) {
          $scope.pageBeingEdited = null;
        } else {
          var message = response.data.error;
          if (message == null || message.length < 1) {
            message = "Error code " + response.status;
          }
          $scope.editError = {Message: "Could not edit Page: " + message};
        }
      });
    }
  };

  $scope.cancelEdit = function () {
    $scope.pageBeingEdited = null;
  };

  $scope.getPages();
}]);

controllers.controller('MyCtrl2', [function () {

}]);