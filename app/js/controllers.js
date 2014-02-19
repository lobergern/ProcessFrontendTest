'use strict';

/* Controllers */

var controllers = angular.module('myApp.controllers', []);

controllers.controller('NavCtrl', ['$scope', 'PageManager', '$location', function ($scope, PageManager) {

  $scope.getPages = function () {
    PageManager.getPages().then(function (response) {
      $scope.pages = response.data;
    });
  };

  $scope.getPages();

  $scope.pageObserverCallback = function (pages) {
    $scope.pages = pages;
  };
  PageManager.registerPageObserverCallback($scope.pageObserverCallback);

  $scope.setPageBeingViewed = function (page) {
    PageManager.setPageBeingViewed(page);
  }
}]);

controllers.controller('MyCtrl1', ['$scope', 'PageManager', 'Authentication', function ($scope, PageManager, Authentication) {
  $scope.pageBeingEdited = null;
  $scope.copyOfPageBeingEdited = null;
  $scope.user = null;

  $scope.getPages = function () {
    PageManager.getPages().then(function (response) {
      $scope.pages = response.data;
    });
  };


  $scope.submit = function () {
    PageManager.addPage({video: $scope.newPage.video, description: $scope.newPage.description, title: $scope.newPage.title}).then(function (response) {
      if (response.status != 200) {
        var message = response.data.error;
        if (message == null || message.length < 1) {
          message = "Error code " + response.status;
        }
        $scope.editError = {Message: "Could not add Page: " + message};
      }
    });
  };

  $scope.setPageBeingEdited = function (page) {
    $scope.copyOfPageBeingEdited = $.extend({}, page);
    PageManager.pageBeingEdited=page;
  };

  $scope.saveEdit = function () {
    PageManager.editPage($scope.copyOfPageBeingEdited).then(function (response) {
      if (response.status == 200) {
        $scope.copyOfPageBeingEdited = null;
        $scope.getPages();
      } else {
        var message = response.data.error;
        if (message == null || message.length < 1) {
          message = "Error code " + response.status;
        }
        $scope.editError = {Message: "Could not edit Page: " + message};
      }
    });
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
    $scope.copyOfPageBeingEdited = null;
    PageManager.setPageBeingEdited(null);
  };

  $scope.getPages();
}]);


controllers.controller('EditPageCtrl', ['$scope', 'PageManager', '$location', function ($scope, PageManager, $location) {
  $scope.editPage = function () {
    PageManager.editPage($scope.pageBeingEdited).then(function (response) {
      if (response.status == 200) {
        PageManager.pageBeingEdited = null;
        $location.path("/index");
      } else {
        var message = response.data.error;
        if (message == null || message.length < 1) {
          message = "Error code " + response.status;
        }
        $scope.editError = {Message: "Could not edit Page: " + message};
      }
    });
  };

  $scope.cancelEdit = function () {
    $location.path("/index");
  };
}]);

controllers.controller('AddPageCtrl', ['$scope', 'PageManager', '$location', function ($scope, PageManager, $location) {
  $scope.addPage = function () {
    PageManager.addPage({video: $scope.newPage.video, description: $scope.newPage.description, title: $scope.newPage.title}).then(function (response) {
      if (response.status == 200) {
        $location.path('/index');
      } else {
        var message = response.data.error;
        if (message == null || message.length < 1) {
          message = "Error code " + response.status;
        }
        $scope.addError = {Message: "Could not add Page: " + message};
      }
    });
  };
}]);

controllers.controller('LoginCtrl', ['$scope', 'Authentication', function ($scope, Authentication) {
  $scope.login = function () {
    Authentication.login($scope.user.email, $scope.user.password).then(function (response) {
      if (response.status != 200) {
        var message = response.data.error;
        if (message == null || message.length < 1) {
          message = "Error code " + response.status;
        }
        $scope.loginError = {Message: "Could not log in: " + message};
      }
    });
  };
}]);

controllers.controller('PageDetailsCtrl', ['$scope', 'PageManager', 'Authentication', '$location', function ($scope, PageManager, Authentication, $location) {
  $scope.page = PageManager.getPageBeingViewed();

  $scope.pageBeingViewedObserverCallback = function (pageBeingViewed) {
    $scope.page = pageBeingViewed;
  };
  PageManager.registerPageBeingViewedObserverCallback($scope.pageBeingViewedObserverCallback);


  $scope.editPage = function () {
    PageManager.pageBeingEdited = $scope.page;
    $location.path('editPage');
  };

  $scope.ratePage = function (rating) {
    PageManager.ratePage($scope.page, rating, Authentication.getCurrentUser.email).then(function (response) {

    });
  };
}]);