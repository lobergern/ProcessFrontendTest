'use strict';

var serverBaseUrl = 'http://75.86.148.205:8080';

var services = angular.module('myApp.services', []);

services.factory('PageManager', ['$q', '$http', function ($q, $http) {
  var pageBeingEdited = null;
  var pageBeingViewed = $.cookie('pageBeingViewed') ? JSON.parse($.cookie('pageBeingViewed')) : null;
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
        crossDomain: true,
        timeout: 2000
      }).then(function (response) {
        pages = response.data;
        return response;
      }, function (responseError) {
        return responseError;
      });
    },
    registerPageObserverCallback: function (callback) {
      pageObserverCallbacks.push(callback);
    },
    registerPageBeingViewedObserverCallback: function (callback) {
      pageBeingViewedObserverCallbacks.push(callback);
    },
    addPage: function (page, sessionToken) {
      return $http({
        method: "POST",
        url: serverBaseUrl + '/content',
        data: JSON.stringify(page),
        headers: {'Authorization': sessionToken},
        crossDomain: true,
        timeout: 2000
      }).then(function (response) {
        pages.push(response.data);
        notifyPageObservers();
        return response;
      }, function (responseError) {
        return responseError;
      });
    },
    deletePage: function (page, sessionToken) {
      return $http({
        method: "DELETE",
        url: serverBaseUrl + '/content/' + page.id,
        headers: {'Authorization': sessionToken},
        crossDomain: true,
        timeout: 2000
      }).then(function (response) {
        pages.splice(pages.indexOf(pageBeingEdited), 1);
        notifyPageObservers();
        return response;
      }, function (responseError) {
        return responseError;
      });
    },
    editPage: function (page, sessionToken) {
      return $http({
        method: "PUT",
        url: serverBaseUrl + '/content/' + page.id,
        data: JSON.stringify({title: page.title, video: page.video, description: page.description}),
        headers: {'Authorization': sessionToken},
        crossDomain: true,
        timeout: 2000
      }).then(function (response) {
        pages.splice(pages.indexOf(pageBeingEdited), 1, response.data);
        notifyPageObservers();
        return response;
      }, function (responseError) {
        return responseError;
      });
    },
    setPageBeingEdited: function (page) {
      pageBeingEdited = page
    },
    getPageBeingEdited: function () {
      return pageBeingEdited
    },
    setPageBeingViewed: function (page) {
      pageBeingViewed = page;
      notifyPageBeingViewedObservers();
    },
    getPageBeingViewed: function () {
      return pageBeingViewed;
    },
    getSessionRatingForPage: function (page, sessionToken) {
      return $http({
        method: "GET",
        url: serverBaseUrl + '/content/' + page.id + '/rate',
        headers: {'Authorization': sessionToken},
        timeout: 2000,
        crossDomain: true
      }).then(function (response) {
        return response;
      }, function (responseError) {
        return responseError;
      });
    },
    ratePage: function (page, rating, sessionToken) {
      return $http({
        method: "POST",
        url: serverBaseUrl + '/content/' + page.id + '/rate',
        data: JSON.stringify({rating: rating}),
        headers: {'Authorization': sessionToken},
        timeout: 2000,
        crossDomain: true
      }).then(function (response) {
        angular.forEach(pages, function (page) {
          if (!pageFound) {
            if (page.id == response.data.id) {
              pages.indexOf[page] = response.data;
              if (pageBeingViewed.id = page.id) {
                pageBeingViewed = page;
                notifyPageBeingViewedObservers();
              }
              var pageFound = true;
            }
          }
        });
        notifyPageObservers();
        return response;
      }, function (responseError) {
        return responseError;
      });
    }
  }
}])
;

services.factory('Authentication', [ '$http', function ($http) {
  var currentUser = $.cookie('currentApplicationUser') ? JSON.parse($.cookie('currentApplicationUser')) : null;
  var userChangeObserverCallbacks = [];

  function notifyUserChangeObservers() {
    angular.forEach(userChangeObserverCallbacks, function (callback) {
      callback(currentUser);
    });
  }

  return{
    login: function (email, password) {
      return $http({
        method: "POST",
        url: serverBaseUrl + '/user',
        data: JSON.stringify({email: email, password: password}),
        crossDomain: true,
        timeout: 2000
      }).then(function (response) {
        currentUser = response.data;
        notifyUserChangeObservers();
        return response;
      }, function (responseError) {
        return responseError;
      });
    },
    getCurrentUser: function () {
      return currentUser
    },
    registerUserChangeCallback: function (callback) {
      userChangeObserverCallbacks.push(callback);
    }, unregisterUserChangeCallback: function (callback) {
      userChangeObserverCallbacks.splice(userChangeObserverCallbacks.indexOf(callback), 1);
    },
    logout: function () {
      currentUser = null;
      notifyUserChangeObservers();
    }
  }
}]);

services.factory('UserManagement', ['$http', function ($http) {
  return{
    deleteUser: function (user, sessionToken) {
      return $http({
        method: "DELETE",
        url: serverBaseUrl + '/user/' + user.email,
        headers: {'Authorization': sessionToken},
        crossDomain: true,
        timeout: 2000
      }).then(function (response) {
        return response;
      }, function (responseError) {
        return responseError;
      });
    },
    editUser: function (user, sessionToken) {
      return $http({
        method: "PUT",
        url: serverBaseUrl + '/user/' + user.email,
        data: JSON.stringify({role: user.role}),
        headers: {'Authorization': sessionToken},
        crossDomain: true,
        timeout: 2000
      }).then(function (response) {
        return response;
      }, function (responseError) {
        return responseError;
      });
    },
    getUserList: function (sessionToken) {
      return $http({
        method: "GET",
        url: serverBaseUrl + '/users',
        headers: {'Authorization': sessionToken},
        crossDomain: true,
        timeout: 2000
      }).then(function (response) {
        return response;
      }, function (responseError) {
        return responseError;
      });
    }
  }
}]);