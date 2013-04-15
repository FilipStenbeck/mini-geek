'use strict';
var miniGeekApp = angular.module('miniGeekApp');
miniGeekApp.ROOT_URL = 'http://localhost:8888/';

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
        console.log('Brodcaster broadcasted ' + this.message);
       
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
          console.log("Menu clicked");
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
        });
    };

   var getGameInfo = function ($scope, $http, id) {
        $http({
            method : 'GET',
            url : miniGeekApp.ROOT_URL + 'gameinfo',
            params : {id : id}
        }).success(function (data) {
            $scope.details = data.result[0];
            console.log($scope.details.description);
            console.log($scope.details.rating);
        });
    };
    
     $scope.getDetails = function (id) {
        console.log(id);
         console.log("getDetails");
        getGameInfo($scope, $http, id);
     }
    
    
    if (eventBroadcaster.eventName === 'menuClicked') {
        if (eventBroadcaster.message === 'popular') {
           // $scope.foo = 'Du har val populära spel';
            getHotGames($scope, $http);
        } else if (eventBroadcaster.message === 'search') {
            $scope.foo = 'Du vill söka efter spel';
        } else if (eventBroadcaster.message === 'about') {
            $scope.foo = 'Du vill veta mer om mig';
        }
        eventBroadcaster.reset();
    }
    
   
});






 

