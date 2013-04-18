'use strict';

//Create the module

var miniGeekApp = angular.module('miniGeekApp', [])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MenuCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });


//Set URL to the backend service
miniGeekApp.ROOT_URL = 'http://mini-geek-service.appspot.com/';

//Define directives
miniGeekApp.directive('gameList', function () {
    return {
        restrict: 'E',
        scope: false,
        templateUrl: 'templates/gamelist-template.html'
    };
});

miniGeekApp.directive('videoList', function () {
    return {
        restrict: 'E',
        scope: false,
        templateUrl: 'templates/videolist-template.html'
    };
});

miniGeekApp.directive('forumList', function () {
    return {
        restrict: 'E',
        scope: false,
        templateUrl: 'templates/forumlist-template.html'
    };
});

//setup for cached data
miniGeekApp.hotList = [];
miniGeekApp.gameId = '';
miniGeekApp.game = {};
miniGeekApp.forumList = [];
miniGeekApp.prev_forumList = [];
miniGeekApp.selected_node = 'root';
miniGeekApp.prev_forumHeader = '';
miniGeekApp.prev_node = 'root';

miniGeekApp.resetFormList = function () {
    miniGeekApp.forumList = [];
    miniGeekApp.selected_node = 'root';
};

//create an event bus
miniGeekApp.factory('eventBroadcaster', function ($rootScope) {
    var eventBroadcaster = {};
    eventBroadcaster.message = '';
    eventBroadcaster.eventName = '';

    // This method is called from within a controller to define an event and attach data to the eventBroadcaster object.
    eventBroadcaster.broadcast = function (evName, msg) {
        this.message = msg;
        this.eventName = evName;
        this.broadcastItem();
    };

    // This method broadcasts an event with the specified name.
    eventBroadcaster.broadcastItem = function () {
        $('#welcome-message').fadeOut('slow');
        $rootScope.$broadcast(this.eventName);
    };
    
    eventBroadcaster.reset = function () {
        eventBroadcaster.eventName = "";
        eventBroadcaster.message = "";
    };

    return eventBroadcaster;
});

