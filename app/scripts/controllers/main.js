'use strict';

angular.module('components', [])

var miniGeekApp = angular.module('miniGeekApp');
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

//cached data
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

//Define controllers

//The top menu
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

//Search and game list
miniGeekApp.controller('ListCtrl', function ($scope, $http, eventBroadcaster) {

    var getHotGames = function ($scope, $http) {
          $('#loader').fadeIn();
        $http.get(miniGeekApp.ROOT_URL + 'hotgames').success(function (data) {
              $('#loader').hide();
            //Connect the data with the view and creat a gamelit cache
            $scope.gameList = data.result;
            miniGeekApp.hotList = $scope.gameList;
        });
    };
    
     var searchGames = function ($scope, $http) {
          $('#loader').fadeIn();
         $http({
            method : 'GET',
            url : miniGeekApp.ROOT_URL + 'search',
            params : {
                        query :  $scope.search.query
                     }
        }).success(function (data) {
             $('#loader').hide();
            //Connect the data with the view and creat a gamelit cache
            $scope.gameList = data.result;
            miniGeekApp.hotList = $scope.gameList;
        });
    };
    
    $scope.getDetails = function (id) {
        miniGeekApp.gameId = id;
        eventBroadcaster.broadcast("showGameInfo", id);
     }
        
    if (eventBroadcaster.eventName === 'menuClicked') {
        $('.game-details').hide();
        $('#about').hide();
        if (eventBroadcaster.message === 'popular') {
            $scope.message = 'Popular Games';
            getHotGames($scope, $http);
        } else if (eventBroadcaster.message === 'search') {
            $scope.message = '';
            $('#search-form').fadeIn();
        } else if (eventBroadcaster.message === 'about') {
            $scope.message = '';
              $('#about').fadeIn();
        } else if (eventBroadcaster.message === 'history') {
            //Only get the game list once, then use cached version from perevious serch or popular list
            if (miniGeekApp.hotList.length === 0) {
                getHotGames($scope, $http);
            } else {
                 $scope.gameList = miniGeekApp.hotList;
            }
        }
        eventBroadcaster.reset();
    }
    
    $scope.search = function(query) {
        console.log($scope.search.query);
        searchGames($scope, $http);
    }
   
});

//Game details view
miniGeekApp.controller('GameDetailsCtrl', function ($scope, $http, eventBroadcaster) {

    $scope.forumHeader = '<p> Forum </p>';
    var getGameInfo = function ($scope, $http, id) {
        
        miniGeekApp.resetFormList();
        
        $http({
            method : 'GET',
            url : miniGeekApp.ROOT_URL + 'gameinfo',
            params : {id : id}
        }).success(function (data) {
            //Clean the response
            data.result[0].link = 'http://boardgamegeek.com/boardgame/' + id;
            data.result[0].description =   data.result[0].description.replace(/&#10;/g, " ");  
            data.result[0].description =   data.result[0].description.replace(/&quot;/g, " ");
            data.result[0].description =   data.result[0].description.replace(/&ndash;/g, " ");

            //connect the data with the view
            $scope.details = data.result[0];
            
            //Keep a cashed list of game
            miniGeekApp.game = data.result[0];
            
              //Show the details
            $('#game-details').fadeIn();
            
        });
    };
    
    var getGameVideos = function ($scope, $http, id) {  
        //console.log("show videos for " + miniGeekApp.gameId);
        $http({
            method : 'GET',
            url : miniGeekApp.ROOT_URL + 'videolist',
            params : {id : id}
        }).success(function (data) {
            $('#video-list').fadeIn();
            $scope.videoList = data.result;
        });
    };    
    
    var getforumPosts = function ($scope, $http) {
      
        miniGeekApp.prev_forumList = miniGeekApp.forumList;
      // console.log("show forum for " + miniGeekApp.gameId + " node: " +  miniGeekApp.selected_node);
        $http({
            method : 'GET',
            url : miniGeekApp.ROOT_URL + 'forumlist',
            params : {
                        node :  miniGeekApp.selected_node,
                        game : miniGeekApp.gameId
                     
                     }
        }).success(function (data) {
            $scope.forumList = data.result;
            miniGeekApp.forumList = data.result;
        });
    };    
    
    $scope.getNextForumPost = function (id, leaf, title) {
        if (!leaf) { 
            miniGeekApp.prev_node = miniGeekApp.selected_node; 
            miniGeekApp.prev_forumHeader = $scope.forumHeader;
             miniGeekApp.selected_node = id;
            $scope.forumHeader = '<i class="icon-arrow-up"></i>' + '<p> ' + title +  '</p>';
            getforumPosts($scope, $http);
            
        }
    };
    
      $scope.getPrevForumPost = function () {
        if (miniGeekApp.selected_node !== 'root') { 
             
            if (miniGeekApp.forumList[0] === undefined) {
                miniGeekApp.selected_node = 'root';
                $scope.forumHeader =  '<p> Forum </p>';
            } else if (miniGeekApp.prev_forumList[0] === undefined) {
                miniGeekApp.selected_node = 'root';
                  $scope.forumHeader =  '<p> Forum </p>';
            } else if (miniGeekApp.forumList[0].leaf === false) {
                 miniGeekApp.selected_node = 'root';
                  $scope.forumHeader =  '<p> Forum </p>';
            }
            else if (miniGeekApp.forumList[0].leaf === true) {
                miniGeekApp.selected_node = miniGeekApp.prev_node; 
              $scope.forumHeader =  miniGeekApp.prev_forumHeader;    
        } 
        getforumPosts($scope, $http);
        }
    };
    
    //Handlers for buttons in Game Details
    $scope.showVideos = function () {
         $('.overview').hide();
        $('#forum-list').hide();
       getGameVideos($scope, $http, miniGeekApp.gameId);  
    };
    
     $scope.showOverivew = function () {
        $('#video-list').hide();
        $('#forum-list').hide();
       $('.overview').fadeIn();
    };
    
     $scope.showForums = function () {
        $('#video-list').hide();
        $('.overview').hide();
        $('#forum-list').fadeIn();
        getforumPosts($scope, $http);  
    };

    if (eventBroadcaster.eventName === 'showGameInfo') {
        getGameInfo($scope, $http, eventBroadcaster.message);
        eventBroadcaster.reset();
    } 
});
