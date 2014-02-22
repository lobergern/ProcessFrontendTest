'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function () {
  beforeEach(module('myApp.controllers'));


  describe('PageDetailsCtrl', function () {
    var $scope, $location, $rootScope, createController, $q;
    var mockPageManager, mockAuthentication;
    var pageBeingViewed, currentUser;
    var ratingForSession;


    mockAuthentication = {
      getCurrentUser: function () {
        return currentUser;
      },
      registerUserChangeCallback: function (callback) {
      }
    };


    mockPageManager = {
      getPageBeingViewed: function () {
        var deferred = $q.defer();
        deferred.resolve(pageBeingViewed);
        return deferred.promise;
      },
      registerPageBeingViewedObserverCallback: function (callback) {
      },
      getSessionRatingForPage: function (page, sessionToken) {
        var deferred = $q.defer();
        deferred.resolve({data: {rating: ratingForSession}, status: 200});
        return deferred.promise;
      }
    };

    beforeEach
    (inject(function ($rootScope, $controller, _$q_) {
      $scope = $rootScope.$new();
      $q = _$q_;

      createController = function () {
        return $controller('PageDetailsCtrl', {
          $scope: $scope,
          PageManager: mockPageManager,
          Authentication: mockAuthentication
        });
      };
      createController();
    }));

    it('should watch for changes to the page being viewed', function () {
      spyOn(mockPageManager, 'registerPageBeingViewedObserverCallback');
      createController();
      expect(mockPageManager.registerPageBeingViewedObserverCallback).toHaveBeenCalled();
    });

    it('should watch for changes to the user logged in', function () {
      spyOn(mockAuthentication, 'registerUserChangeCallback');
      createController();
      expect(mockAuthentication.registerUserChangeCallback).toHaveBeenCalled();
    });

    it('should NOT get the current user\'s page rating when the page changes if no user is logged in', function () {
      spyOn(mockPageManager, 'getSessionRatingForPage').andCallThrough();
      currentUser = null;
      $scope.$apply();
      expect(mockPageManager.getSessionRatingForPage).not.toHaveBeenCalled();
    });

    it('should get the current user\'s page rating when the page changes', function () {
      spyOn(mockPageManager, 'getSessionRatingForPage').andCallThrough();
      currentUser = {session: ''};
      ratingForSession = 3;
      $scope.page = {};
      $scope.$apply();
      expect(mockPageManager.getSessionRatingForPage).toHaveBeenCalled();
    })
  })
});
