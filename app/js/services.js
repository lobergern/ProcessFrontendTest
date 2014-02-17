'use strict';

/* Services */
var pages = [
  {youtubeLink: 'http://www.youtube.com/watch?v=d2ZNaLQD60Y', title: 'Game Of Thrones', description: 'description', rating: 5},
  {youtubeLink: 'http://www.youtube.com/watch?v=PRYjmBQ2W3s', title: 'Wall', description: 'description', rating: 3}
];

// Demonstrate how to register services
// In this case it is a simple value service.
var services = angular.module('myApp.services', []);

services.value('version', '0.1');

services.factory('PageManager', ['$q', function ($q) {
  return {
    getPages: function () {
      var deferred = $q.defer();
      deferred.resolve({data: {pages: pages}, status: 200});
      return deferred.promise;
    },
    addPage: function(page){
      var deferred = $q.defer();
      pages.push(page);
      deferred.resolve({data: 'success', status: 200});
      return q.promise;
    },
    removePage:function(page)
    {
      var deferred = $q.defer();
      pages.splice(pages.indexOf(page),1);
      deferred.resolve({data: 'success', status: 200});
      return q.promise;
    }
  }
}]);
