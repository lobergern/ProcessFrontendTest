'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function () {
  beforeEach(module('myApp.controllers'));


  describe('PageDetailsCtrl', function () {
    var $scope, createController, $q;
    var mockPageManager, mockAuthentication;
    var pageBeingViewed, currentUser;
    var ratingForSession;


    beforeEach(function () {
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
        },
        ratePage: function (page, rating, sessionToken) {
          var deferred = $q.defer();
          page.rating = rating;
          deferred.resolve({data: {page: page}, status: 200});
          return deferred.promise;
        },
        setPageBeingEdited: function (page) {

        }
      };
    });

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
    });

    it('should attempt to update the user rating when the page changes', function () {
      spyOn($scope, 'getCurrentUserRatingForPage');
      $scope.page = {};
      $scope.$apply();
      expect($scope.getCurrentUserRatingForPage).toHaveBeenCalled();
    });

    it('should attempt update the user rating notified that the logged in user has changed', function () {
      spyOn($scope, 'getCurrentUserRatingForPage');
      $scope.user = {};
      $scope.$apply();
      expect($scope.getCurrentUserRatingForPage).toHaveBeenCalled();
    });

    it('should try to rate the page when the rating changes to a different value than the previous rating', function () {
      $scope.previousRating = 1;
      spyOn(mockPageManager, 'ratePage').andCallThrough();
      $scope.rating = 2;
      $scope.$apply();
      expect(mockPageManager.ratePage).toHaveBeenCalled();
    });

    it('should NOT rate the page if the current rating is the same as the previous', function () {
      $scope.previousRating = 1;
      spyOn(mockPageManager, 'ratePage').andCallThrough();
      $scope.rating = 1;
      $scope.$apply();
      expect(mockPageManager.ratePage).not.toHaveBeenCalled();
    });

    it('should set the page being edited to the current page when user tries to edit a page', function () {
      spyOn(mockPageManager, 'setPageBeingEdited');
      $scope.page = 'someval';
      $scope.editPage();
      expect(mockPageManager.setPageBeingEdited).toHaveBeenCalledWith($scope.page);
    });

  })
});
