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

controllers.controller('EditPageCtrl', ['$scope', 'PageManager', '$location', function ($scope, PageManager, $location) {
  $scope.page = $.extend({}, PageManager.getPageBeingEdited());

  $scope.saveEdit = function () {
    PageManager.editPage($scope.page).then(function (response) {
      if (response.status == 200) {
        PageManager.setPageBeingEdited(null);
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
    PageManager.setPageBeingEdited(null);
    $location.path("/index");
  };
}]);

controllers.controller('AddPageCtrl', ['$scope', 'PageManager', '$location', function ($scope, PageManager, $location) {
  $scope.addPage = function () {
    PageManager.addPage({video: $scope.page.video, description: $scope.page.description, title: $scope.page.title}).then(function (response) {
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
  $scope.loginInfo = null;
  $scope.currentUser = Authentication.currentUser;

  $scope.userChangeCallback = function (user) {
    $scope.currentUser = user;
  };

  Authentication.registerUserChangeCallback($scope.userChangeCallback);

  $scope.login = function () {
    Authentication.login($scope.loginInfo.email, $scope.loginInfo.password).then(function (response) {
      if (response.status != 200) {
        var message = response.data.error;
        if (message == null || message.length < 1) {
          message = "Error code " + response.status;
        }
        $scope.loginError = {Message: "Could not log in: " + message};
      }
    });
  };

  $scope.logout = function () {
    Authentication.logout();
  }

}]);

controllers.controller('PageDetailsCtrl', ['$scope', 'PageManager', 'Authentication', '$location', '$sce', function ($scope, PageManager, Authentication, $location, $sce) {
  $scope.page = PageManager.getPageBeingViewed();

  $scope.pageBeingViewedObserverCallback = function (pageBeingViewed) {
    $scope.page = pageBeingViewed;
  };
  PageManager.registerPageBeingViewedObserverCallback($scope.pageBeingViewedObserverCallback);

  $scope.editPage = function () {
    PageManager.setPageBeingEdited($scope.page);
    $location.path('editPage');
  };

  $scope.getPageDescription = function() {
    return $sce.trustAsHtml($scope.page.description);
  };

  $scope.ratePage = function () {
    PageManager.ratePage($scope.page, $scope.rating, Authentication.getCurrentUser.email).then(function (response) {

    });
  };
}]);

controllers.controller('HeaderCtrl', ['$scope', '$location', function ($scope, $location) {
  $scope.goHome = function () {
    $location.path('/welcome');
  }
}]);

controllers.controller('CookieCtrl', ['Authentication', 'PageManager', function(Authentication, PageManager){
  function pageBeingViewedObserverCallback(page){
    $.cookie('pageBeingViewed', JSON.stringify(page));
  }

  function userChangeObserverCallback(user){
    $.cookie('currentApplicationUser', JSON.stringify(user));
  }

  PageManager.registerPageBeingViewedObserverCallback(pageBeingViewedObserverCallback);
  Authentication.registerUserChangeCallback(userChangeObserverCallback);
}]);
