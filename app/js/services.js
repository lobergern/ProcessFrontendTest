'use strict';

var serverBaseUrl = 'http://155.92.69.91';

/* Services */
var pages = [
  {video: 'http://www.youtube.com/watch?v=d2ZNaLQD60Y', title: 'Game Of Thrones', description: 'description', rating: 5},
  {video: 'http://www.youtube.com/watch?v=PRYjmBQ2W3s', title: 'Wall', description: 'description', rating: 3}
];

var users = [
  {email: 'atscott01@gmail.com', password: 'Scott'}
];

// Demonstrate how to register services
// In this case it is a simple value service.
var services = angular.module('myApp.services', []);

services.factory('PageManager', ['$q', '$http', function ($q, $http) {
  return {
    getPages: function () {
      return $http({
        method: "GET",
        url: serverBaseUrl + '/content',
        crossDomain: true
      }).then(function (response) {
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
        pages.push(page);
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
      var deferred = $q.defer();

      $http({
        method: "PUT",
        url: serverBaseUrl + '/content' + page.id,
        data: JSON.stringify(page),
        crossDomain: true
      }).then(function (response) {
        return response;
      }, function (responseError) {
        console.log(responseError);
        return responseError;
      });

      return deferred.promise;
    },
    ratePage: function (page, rating, email) {
      return $http({
        method: "POST",
        url: serverBaseUrl + '/content/',
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
}]);

services.factory('UserAuthentication', ['$q', '$http', function ($q, $http) {
  var currentUser = null;
  return{
    login: function (email, password) {
      var deferred = $q.defer();
      var userFound = false;
      $.each(users, function () {
        if (this.email == email) {
          userFound = true;
          if (this.password == password) {
            deferred.resolve({data: 'success', status: 200});
            currentUser = this;
          } else {
            deferred.resolve({data: 'incorrect password', status: 400});
          }
        }
      });
      if (!userFound) {
        users.push({email: email, password: password});
        currentUser = users[users.size - 1];
        deferred.resolve({data: 'success', status: 200});
      }

      $http({
        method: "POST",
        url: serverBaseUrl + '/user',
        data: JSON.stringify({email: email, password: password}),
        crossDomain: true
      }).then(function (response) {
        currentUser = response.data;
        return response;
      }, function (responseError) {
        console.log(responseError);
        return responseError;
      });

      return deferred.promise;
    },
    getCurrentUser: currentUser,
    logout: function () {
      currentUser = null;
    }
  }
}]);
