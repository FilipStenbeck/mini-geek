'use strict';
var miniGeekApp = angular.module('miniGeekApp');
var ROOT_URL = 'http://localhost:8888/';

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
    return eventBroadcaster;
});



miniGeekApp.controller('MenuCtrl', function ($scope, $rootScope, eventBroadcaster) {
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
    if (eventBroadcaster.eventName === 'menuClicked') {
        if (eventBroadcaster.message === 'popular') {
            $scope.foo = 'Du har val populära spel';
            $scope.gameList = miniGeekApp.getHotGames($scope, $http);
        } else if (eventBroadcaster.message === 'search') {
            $scope.foo = 'Du vill söka efter spel';
        } else if (eventBroadcaster.message === 'about') {
            $scope.foo = 'Du vill veta mer om mig';
        }
    } else {
        $scope.foo = 'Välkommen!';
    }
});


miniGeekApp.getHotGames = function ($scope, $http) {
    //var hotGames;
    //return hotGames;
    $http.get(ROOT_URL + 'hotgames').success(function (data) {
       $scope.gameList = data.result;
    });
};
