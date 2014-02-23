'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function () {
  beforeEach(module('myApp.controllers', 'ui.bootstrap'));


  describe('UserManagementCtrl', function () {
    var $scope, createController, $q;
    var mockAuthentication, mockUserManagement;
    var currentUser;
    var userList = ['something', 'something2'];

    beforeEach(function () {
      mockAuthentication = {
        getCurrentUser: function () {
          return currentUser;
        },
        registerUserChangeCallback: function (callback) {
        }
      };
      mockUserManagement = {
        getUserList: function () {
          var deferred = $q.defer();
          deferred.resolve({data:userList, status: 200});
          return deferred.promise;
        }
      };
    });

    beforeEach
    (inject(function ($rootScope, $controller, $modal, _$q_, $httpBackend) {
      $scope = $rootScope.$new();
      $q = _$q_;
      $httpBackend.when('GET', 'partials/modal_message.html').respond();
      createController = function () {
        return $controller('UserManagementCtrl', {
          $scope: $scope,
          Authentication: mockAuthentication,
          UserManagement: mockUserManagement
        });
      };
      createController();
    }));

    it('should watch for changes to the user logged in', function () {
      spyOn(mockAuthentication, 'registerUserChangeCallback');
      createController();
      expect(mockAuthentication.registerUserChangeCallback).toHaveBeenCalled();
    });

    it('should not get the list of users if there is no user logged in', function () {
      spyOn(mockUserManagement, 'getUserList');
      $scope.getUsers();
      expect(mockUserManagement.getUserList).not.toHaveBeenCalled();
    });

    it('should not get the list of users if there is no user logged in', function () {
      spyOn($scope, 'showModal');
      currentUser = null;
      $scope.getUsers();
      expect($scope.showModal).toHaveBeenCalled();
    });

    it('should show an error if the current user does not have admin rights', function () {
      spyOn($scope, 'showModal');
      currentUser = {session: ''};
      mockUserManagement.getUserList = function () {
        var deferred = $q.defer();
        deferred.resolve({status: 500});
        return deferred.promise;
      };
      $scope.getUsers();
      $scope.$apply();
      expect($scope.showModal).toHaveBeenCalled();
    });

    it('should set the users in the scope to be the list of users passed back by the service', function(){
      currentUser = {session:''};
      $scope.getUsers();
      $scope.$apply();
      expect($scope.users).toEqual(userList);
    });

    afterEach(inject(function($rootScope) {
      $rootScope.$apply();
    }));
  });

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
      $scope.page = {};
      $scope.$apply();
      expect(mockPageManager.getSessionRatingForPage).not.toHaveBeenCalled();
    });

    it('should get the current user\'s page rating when the page changes', function () {
      spyOn(mockPageManager, 'getSessionRatingForPage').andCallThrough();
      currentUser = {session: ''};
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
