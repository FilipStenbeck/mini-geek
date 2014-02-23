'use strict';

//Create the Main module
angular.module('miniGeekApp', ['Directives', 'ngCookies']).config(function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'views/main.html',
        controller: 'MenuCtrl'
    }).when('/search', {
        templateUrl: 'views/main.html',
        controller: 'StartSearchCtrl'
    }).when('/popular', {
        templateUrl: 'views/main.html',
        controller: 'PopularCtrl'
    }).when('/about', {
        templateUrl: 'views/main.html',
        controller: 'AboutCtrl'
    }).when('/collection', {
        templateUrl: 'views/main.html',
        controller: 'CollectionCtrl'
    }).when('/game/:gameId', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
    }).otherwise({
        redirectTo: '/'
    });
});


