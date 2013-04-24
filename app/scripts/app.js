'use strict';


//Create the custom elements as an independent module
angular.module('Directives', []).directive('gameList', function () {
    return {
        restrict: 'E',
        scope: false,
        templateUrl: 'templates/gamelist-template.html'
    };
}).directive('videoList', function () {
    return {
        restrict: 'E',
        scope: false,
        templateUrl: 'templates/videolist-template.html'
    };
}).directive('forumList', function () {
    return {
        restrict: 'E',
        scope: false,
        templateUrl: 'templates/forumlist-template.html'
    };
}).directive('includedList', function () {
    return {
        restrict: 'E',
        scope: false,
        templateUrl: 'templates/included-template.html'
    };
});

//Create the Main module
angular.module('miniGeekApp', ['Directives', 'ngCookies'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MenuCtrl'
      })
    .when('/popular', {
        templateUrl: 'views/main.html',
        controller: 'PopularCtrl'
      })
    .when('/collection', {
        templateUrl: 'views/main.html',
        controller: 'CollectionCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });


