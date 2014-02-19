'use strict';

/* Controllers */

var controllers = angular.module('myApp.controllers', []);
controllers.controller('MyCtrl1', ['$scope', 'PageManager', 'Authentication', function ($scope, PageManager, Authentication) {
  $scope.pageBeingEdited = null;
  $scope.copyOfPageBeingEdited = null;
  $scope.user = null;

  $scope.getPages = function () {
    PageManager.getPages().then(function (response) {
      $scope.pages = response.data.pages;
    });
  };

  $scope.submit = function () {
    PageManager.addPage({video: $scope.newPage.video, description: $scope.newPage.description, title: $scope.newPage.title})
  };

  $scope.setPageBeingEdited = function (page) {
    $scope.copyOfPageBeingEdited = $.extend({}, page);
    $scope.pageBeingEdited = page;
  };

  $scope.editPage = function () {
    if ($scope.pageBeingEdited = null) {
      alert('no page being edited')
    } else {
      PageManager.editPage($scope.pageBeingEdited).then(function (response) {
        if (response.status == 200) {
          $scope.pages.splice($scope.pages.indexOf($scope.pageBeingEdited), 1, $scope.copyOfPageBeingEdited);
          $scope.pageBeingEdited = null;
          $scope.copyOfPageBeingEdited = null;
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

  $scope.login = function () {
    Authentication.login($scope.user.email, $scope.user.password).then(function (response) {
        if (response.status == 200) {
          $scope.currentUser = response.data;
        } else {
          var message = response.data.error;
          if (message == null || message.length < 1) {
            message = "Error code " + response.status;
          }
          $scope.loginError = {Message: "Could not log in: " + message};
        }
    });
  };

  $scope.cancelEdit = function () {
    $scope.pageBeingEdited = null;
    $scope.copyOfPageBeingEdited = null;
  };

  $scope.getPages();
}]);

controllers.controller('MyCtrl2', [function () {

}]);