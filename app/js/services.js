'use strict';

var serverBaseUrl = 'http://155.92.66.220:8080';

// Demonstrate how to register services
// In this case it is a simple value service.
var services = angular.module('myApp.services', []);

services.factory('PageManager', ['$q', '$http', function ($q, $http) {
  var sharedPageInfo = {pageBeingEdited:null,pageBeingViewed:null};
  var pages = [];
  return {
    getPages: function () {
      return $http({
        method: "GET",
        url: serverBaseUrl + '/content',
        crossDomain: true
      }).then(function (response) {
        pages = response.data;
        response.data = pages;
        return response;
      }, function (responseError) {
        console.log(responseError);
        return responseError;
      });
    },
    addPage: function (page) {
      return $http({
        method: "POST",
        url: serverBaseUrl + '/content',
        data: JSON.stringify(page),
        crossDomain: true
      }).then(function (response) {
        pages.push(response.data);
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
      return deferred.promise;
    },
    editPage: function (page) {
      return $http({
        method: "PUT",
        url: serverBaseUrl + '/content/' + page.id,
        data: JSON.stringify({title:page.title, video:page.video, description:page.description}),
        crossDomain: true
      }).then(function (response) {
        pages.splice(pages.indexOf(pageBeingEdited), 1, response.data);
        return response;
      }, function (responseError) {
        console.log(responseError);
        return responseError;
      });
    },
    pageBeingEdited: sharedPageInfo.pageBeingEdited,
    pageBeingViewed: pageBeingViewed,
    ratePage: function (page, rating, email) {
      return $http({
        method: "POST",
        url: serverBaseUrl + '/content',
        data: JSON.stringify({page: page, rating: rating, email: email}),
        crossDomain: true
      }).then(function (response) {
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
