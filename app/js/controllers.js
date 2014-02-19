'use strict';

/* Controllers */

var controllers = angular.module('myApp.controllers', []);
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
    $scope.pageBeingEdited = page;
  };

  $scope.saveEdit = function () {
    if ($scope.pageBeingEdited == null) {
      alert('no page being edited')
    } else {
      PageManager.editPage($scope.copyOfPageBeingEdited).then(function (response) {
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
  $scope.page = PageManager.pageBeingViewed;

  $scope.editPage = function () {
    PageManager.pageBeingEdited = $scope.page;
    $location.path('editPage');
  };

  $scope.ratePage = function (rating) {
    PageManager.ratePage($scope.page, rating, Authentication.getCurrentUser.email).then(function (response) {

    });
  };
}]);