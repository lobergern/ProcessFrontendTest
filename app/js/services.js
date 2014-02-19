'use strict';

var serverBaseUrl = 'http://75.86.148.205:8080';

// Demonstrate how to register services
// In this case it is a simple value service.
var services = angular.module('myApp.services', []);

services.factory('PageManager', ['$q', '$http', function ($q, $http) {
  var pageBeingEdited = null;
  var pageBeingViewed = null;
  var pages = [];
  var pageObserverCallbacks = [];
  var pageBeingViewedObserverCallbacks = [];

  var notifyPageObservers = function () {
    angular.forEach(pageObserverCallbacks, function (callback) {
      callback(pages);
    });
  };

  var notifyPageBeingViewedObservers = function () {
    angular.forEach(pageBeingViewedObserverCallbacks, function (callback) {
      callback(pageBeingViewed);
    });
  };

  return {
    getPages: function () {
      return $http({
        method: "GET",
        url: serverBaseUrl + '/content',
        crossDomain: true
      }).then(function (response) {
        pages = response.data;
        return response;
      }, function (responseError) {
        console.log(responseError);
        return responseError;
      });
    },
    registerPageObserverCallback: function (callback) {
      pageObserverCallbacks.push(callback);
    },
    registerPageBeingViewedObserverCallback: function (callback) {
      pageBeingViewedObserverCallbacks.push(callback);
    },
    addPage: function (page) {
      return $http({
        method: "POST",
        url: serverBaseUrl + '/content',
        data: JSON.stringify(page),
        crossDomain: true
      }).then(function (response) {
        pages.push(response.data);
        notifyPageObservers();
        return response;
      }, function (responseError) {
        console.log(responseError);
        return responseError;
      });
    },
    removePage: function (page) {
      var deferred = $q.defer();
      pages.splice(pages.indexOf(page), 1);
      deferred.resolve({data: 'success', status: 200});
      notifyPageObservers();
      return deferred.promise;
    },
    editPage: function (page) {
      return $http({
        method: "PUT",
        url: serverBaseUrl + '/content/' + page.id,
        data: JSON.stringify({title: page.title, video: page.video, description: page.description}),
        crossDomain: true
      }).then(function (response) {
        pages.splice(pages.indexOf(pageBeingEdited), 1, response.data);
        notifyPageObservers();
        return response;
      }, function (responseError) {
        console.log(responseError);
        return responseError;
      });
    },
    pageBeingEdited: pageBeingEdited,
    setPageBeingViewed: function (page) {
      pageBeingViewed = page;
      notifyPageBeingViewedObservers();
    },
    getPageBeingViewed: function () {
      return pageBeingViewed;
    },
    ratePage: function (page, rating, email) {
      return $http({
        method: "POST",
        url: serverBaseUrl + '/content',
        data: JSON.stringify({page: page, rating: rating, email: email}),
        crossDomain: true
      }).then(function (response) {
        notifyPageObservers();
        return response;
      }, function (responseError) {
        console.log(responseError);
        return responseError;
      });
    }
  }
}])
;

services.factory('Authentication', ['$q', '$http', function ($q, $http) {
  var currentUser = null;
  return{
    login: function (email, password) {
      return $http({
        method: "POST",
        url: serverBaseUrl + '/user',
        data: JSON.stringify({email: email, password: password}),
        crossDomain: true
      }).then(function (response) {
        currentUser.currentUser = response.data;
        return response;
      }, function (responseError) {
        console.log(responseError);
        return responseError;
      });
    },
    getCurrentUser: currentUser,
    logout: function () {
      currentUser = null;
    }
  }
}]);
