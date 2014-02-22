'use strict';

/* Controllers */

var controllers = angular.module('myApp.controllers', []);

controllers.controller('NavCtrl', ['$scope', 'PageManager', 'Authentication', function ($scope, PageManager, Authentication) {
  $scope.currentUser = Authentication.getCurrentUser();

  $scope.userChangeObserverCallback = function (user) {
    $scope.currentUser = user;
  };
  Authentication.registerUserChangeCallback($scope.userChangeObserverCallback);

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

controllers.controller('EditPageCtrl', ['$scope', 'PageManager', 'Authentication', '$location', function ($scope, PageManager, Authentication, $location) {
  $scope.page = $.extend({}, PageManager.getPageBeingEdited());

  $scope.saveEdit = function () {
    if (Authentication.getCurrentUser()) {
      PageManager.editPage($scope.page, Authentication.getCurrentUser().session).then(function (response) {
        if (response.status == 200) {
          PageManager.setPageBeingEdited(null);
          $location.path("/index");
        } else {
          var message = response.data.error || response.data.message;
          if (message == null || message.length < 1) {
            message = "Error code " + response.status;
          }
          $scope.editDeleteError = {Message: "Could not edit Page: " + message};
        }
      });
    } else {
      $scope.editDeleteError = {Message: "Must log in as an administrator to edit page."};
    }
  };

  $scope.deletePage = function () {
    if (Authentication.getCurrentUser()) {
      PageManager.deletePage($scope.page, Authentication.getCurrentUser().session).then(function (response) {
        if (response.status == 200) {
          PageManager.setPageBeingEdited(null);
          $location.path("/index");
        } else {
          var message = response.data.error || response.data.message;
          if (message == null || message.length < 1) {
            message = "Error code " + response.status;
          }
          $scope.editDeleteError = {Message: "Could not delete page: " + message};
        }
      });
    } else {
      $scope.editDeleteError = {Message: "Must log in as administrator to delete page"};
    }
  };

  $scope.cancelEdit = function () {
    PageManager.setPageBeingEdited(null);
    $location.path("/index");
  };
}]);

controllers.controller('AddPageCtrl', ['$scope', 'PageManager', 'Authentication', '$location', function ($scope, PageManager, Authentication, $location) {
  $scope.addPage = function () {
    PageManager.addPage($scope.page, Authentication.getCurrentUser().session).then(function (response) {
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
  $scope.currentUser = Authentication.getCurrentUser();

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
  $scope.currentUser = Authentication.getCurrentUser();

  $scope.userChangeObserverCallback = function (user) {
    $scope.currentUser = user;
    $scope.getCurrentUserRatingForPage();
  };
  $scope.pageBeingViewedObserverCallback = function (pageBeingViewed) {
    $scope.page = pageBeingViewed;
  };
  PageManager.registerPageBeingViewedObserverCallback($scope.pageBeingViewedObserverCallback);
  Authentication.registerUserChangeCallback($scope.userChangeObserverCallback);

  $scope.editPage = function () {
    PageManager.setPageBeingEdited($scope.page);
    $location.path('editPage');
  };

  $scope.getPageDescription = function () {
    return $sce.trustAsHtml($scope.page.description);
  };

  $scope.$watch('rating', function () {
    if ($scope.rating && $scope.rating != $scope.previousRating) {
      PageManager.ratePage($scope.page, $scope.rating, Authentication.getCurrentUser().session).then(function (response) {
        if (response.status != 200) {
          var message = response.data.error || response.data.message;
          if (message == null || message.length < 1) {
            message = "Error code " + response.status;
          }
          $scope.rateError = {Message: "Could not rate Page: " + message};
          $scope.rating = $scope.previousRating;
        } else {
          $scope.previousRating = $scope.rating;
          $scope.page.rating = response.data.rating;
        }
      });
    } else {
      $scope.previousRating = $scope.rating;
    }
  });

  $scope.$watch('page', function () {
    $scope.getCurrentUserRatingForPage();
  });

  $scope.getCurrentUserRatingForPage = function () {
    if ($scope.page && $scope.currentUser) {
      PageManager.getSessionRatingForPage($scope.page, Authentication.getCurrentUser().session).then(function (response) {
        if (response.status == 200) {
          $scope.previousRating = response.data.rating;
          if (response.data.rating > 0) {
            $scope.rating = response.data.rating;
          }
        } else {
          $scope.rating = null;
          $scope.previousRating = 0;
          var message = response.data.error || response.data.message;
          if (message == null || message.length < 1) {
            message = "Error code " + response.status;
          }
          $scope.rateError = {Message: "Could not retrieve rating for user: " + message};
        }
      });
    }
  }

}]);

controllers.controller('HeaderCtrl', ['$scope', '$location', function ($scope, $location) {
  $scope.goHome = function () {
    $location.path('/welcome');
  }
}]);

controllers.controller('CookieCtrl', ['Authentication', 'PageManager', function (Authentication, PageManager) {
  function pageBeingViewedObserverCallback(page) {
    $.cookie('pageBeingViewed', JSON.stringify(page));
  }

  function userChangeObserverCallback(user) {
    $.cookie('currentApplicationUser', JSON.stringify(user));
  }

  PageManager.registerPageBeingViewedObserverCallback(pageBeingViewedObserverCallback);
  Authentication.registerUserChangeCallback(userChangeObserverCallback);
}]);

controllers.controller('UserManagementCtrl', ['Authentication', 'UserManagement', '$modal', '$scope', '$location',
  function (Authentication, UserManagement, $modal, $scope, $location) {
    $scope.userRoles = ['ADMIN', 'VIEWER'];

    $scope.userChangeObserverCallback = function () {
      if ($location.path() == '/userManagement') {
        $scope.getUsers();
      }
    };
    Authentication.registerUserChangeCallback($scope.userChangeObserverCallback);

    $scope.getUsers = function () {
      if (Authentication.getCurrentUser()) {
        UserManagement.getUserList(Authentication.getCurrentUser().session).then(function (response) {
          if (response.status == 200) {
            $scope.users = response.data;
          } else {
            var message = response.data.error || response.data.message;
            if (message == null || message.length < 1) {
              message = "Error code " + response.status;
            }
            $scope.showModal({title: 'Error', message: "Could not retrieve users: " + message});
          }
        })
      } else {
        $scope.showModal({title: 'Error', message: "Must be logged in as administrator to edit users."});
        $scope.users = null;
      }

    };
    $scope.getUsers();

    $scope.deleteUser = function (user) {
      if (Authentication.getCurrentUser()) {
        if (user.email == Authentication.getCurrentUser().email) {
          $scope.deleteError = {Message: "Cannot delete yourself"};
        } else {
          UserManagement.deleteUser(user, Authentication.getCurrentUser().session).then(function (response) {
            if (response.status == 200) {
              $.each($scope.users, function (index) {
                if (this.email == response.data.email) {
                  $scope.users.splice(index, 1);
                  return false;
                }
              });
              $scope.deleteSuccess = true;
            } else {
              var message = response.data.error || response.data.message;
              if (message == null || message.length < 1) {
                message = "Error code " + response.status;
              }
              $scope.showModal({title: 'Error', message: "Could not delete user: " + message});
            }
          });
        }
      } else {
        $scope.showModal({title: 'Log in', message: "You need to log in as administrator to delete a user"});
      }
    };

    $scope.saveUser = function (user) {
      if (Authentication.getCurrentUser()) {
        UserManagement.editUser(user, Authentication.getCurrentUser().session).then(function (response) {
          if (response.status == 200) {
            $scope.showModal({title: 'Success', message: 'User saved successfully'})
          } else {
            var message = response.data.error || response.data.message;
            if (message == null || message.length < 1) {
              message = "Error code " + response.status;
            }
            $scope.showModal({title: 'Error', message: "Could not edit user: " + message});
          }
        });
      } else {
        $scope.showModal({title: 'Log in', message: "You need to log in as administrator to edit a user's role"});
      }
    };

    $scope.showModal = function (message) {
      $modal.open({
        templateUrl: 'partials/modal_message.html',
        controller: function ($scope, $modalInstance, message) {
          $scope.message = message;
          $scope.dismiss = function () {
            $modalInstance.dismiss();
          }
        },
        resolve: {
          message: function () {
            return message;
          }
        }
      });
    }
  }]);
