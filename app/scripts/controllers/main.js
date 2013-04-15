'use strict';
var miniGeekApp = angular.module('miniGeekApp');
miniGeekApp.ROOT_URL = 'http://mini-geek-service.appspot.com/';

//cached version of hot games
miniGeekApp.hotList = [];

miniGeekApp.factory('eventBroadcaster', function ($rootScope) {
    
    // eventBroadcaster is the object created by the factory method.
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
        $rootScope.$broadcast(this.eventName);
    };
    
    eventBroadcaster.reset = function () {
        eventBroadcaster.eventName = "";
        eventBroadcaster.message = "";
    };

    return eventBroadcaster;
});

miniGeekApp.controller('MenuCtrl', function ($scope, eventBroadcaster) {
   
    $scope.selected = "";
    var broadcaster = eventBroadcaster;
    $scope.setSelected = function (item) {
		$scope.selected = item;
        if (item !== undefined) {
            broadcaster.broadcast("menuClicked", item);
        }
	};
});

miniGeekApp.controller('ListCtrl', function ($scope, $http, eventBroadcaster) {
    
    
    
    var getHotGames = function ($scope, $http) {
        $http.get(miniGeekApp.ROOT_URL + 'hotgames').success(function (data) {
            $scope.gameList = data.result;
            miniGeekApp.hotList = $scope.gameList;
        });
    };
    
    $scope.getDetails = function (id) {
         eventBroadcaster.broadcast("showGameInfo", id);
     }
        
    if (eventBroadcaster.eventName === 'menuClicked') {
         $('.game-details').hide();
        if (eventBroadcaster.message === 'popular') {
            
            //Only get the hot game list once, then use cached
            if (miniGeekApp.hotList.length === 0) {
                getHotGames($scope, $http);
            } else {
                 $scope.gameList = miniGeekApp.hotList;
            }
        } else if (eventBroadcaster.message === 'search') {
            $scope.foo = 'Du vill söka efter spel';
        } else if (eventBroadcaster.message === 'about') {
            $scope.foo = 'Du vill veta mer om mig';
        }
        eventBroadcaster.reset();
    }
    
   
});

miniGeekApp.controller('GameDetailsCtrl', function ($scope, $http, eventBroadcaster) {
        
   var getGameInfo = function ($scope, $http, id) {
        $http({
            method : 'GET',
            url : miniGeekApp.ROOT_URL + 'gameinfo',
            params : {id : id}
        }).success(function (data) {
            //Clean the response
            data.result[0].link = 'http://boardgamegeek.com/boardgame/' + id;
            data.result[0].description =   data.result[0].description.replace(/&#10;/g, " ");
            
            //connect the response to scope
            $scope.details = data.result[0];
            
              //Show the details
            $('#game-details').fadeIn();
            
        });
   };
    
    if (eventBroadcaster.eventName === 'showGameInfo') {
        getGameInfo($scope, $http, eventBroadcaster.message);
        eventBroadcaster.reset();
    }
});
