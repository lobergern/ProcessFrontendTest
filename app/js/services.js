'use strict';

/* Services */
var pages = [
  {youtubeLink: 'http://www.youtube.com/watch?v=d2ZNaLQD60Y', title: 'Game Of Thrones', description: 'description', rating: 5},
  {youtubeLink: 'http://www.youtube.com/watch?v=PRYjmBQ2W3s', title: 'Wall', description: 'description', rating: 3}
];

var users = [
  {email: 'atscott01@gmail.com', password: 'Scott'}
];

// Demonstrate how to register services
// In this case it is a simple value service.
var services = angular.module('myApp.services', []);

services.factory('PageManager', ['$q', function ($q) {
  return {
    getPages: function () {
      var deferred = $q.defer();
      deferred.resolve({data: {pages: pages}, status: 200});
      return deferred.promise;
    },
    addPage: function (page) {
      var deferred = $q.defer();
      pages.push(page);
      deferred.resolve({data: 'success', status: 200});
      return deferred.promise;
    },
    removePage: function (page) {
      var deferred = $q.defer();
      pages.splice(pages.indexOf(page), 1);
      deferred.resolve({data: 'success', status: 200});
      return deferred.promise;
    }
  }
}]);

services.factory('UserAuthentication', ['$q,', function ($q) {
  var currentUser = null;
  return{
    login: function (email, password) {
      var deferred = $q.defer();
      var userFound = false;
      $.each(users, function () {
        if (this.email == email) {
          userFound = true;
          if (this.password == password) {
            deferred.resolve({data: 'success', status: 200})
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
      return deferred.promise;
    },
    getCurrentUser: currentUser,
    logout: function () {
      currentUser = null;
    }
  }
}]);
