'use strict';

//The menu
angular.module('miniGeekApp').controller('MenuCtrl', function ($scope, EventBroadcaster) {
    $scope.selected = "";
    $scope.setSelected = function (item) {
		$scope.selected = item;
        if (item !== undefined) {
            EventBroadcaster.broadcast("menuClicked", item);
        }
	};
});

//trigger show popular games
angular.module('miniGeekApp').controller('PopularCtrl', function ($scope, EventBroadcaster) {
    EventBroadcaster.broadcast("menuClicked", "popular");
});

//trigger show game collection
angular.module('miniGeekApp').controller('CollectionCtrl', function ($scope, EventBroadcaster) {
    EventBroadcaster.broadcast("menuClicked", "collection");
});

//Main
angular.module('miniGeekApp').controller('MainCtrl', function ($scope, $http, EventBroadcaster,  $cookies, GeekService) {
    
     //Define callbacks for loading data service
    var hotgameCallBack = function (data) {
        $('#loader').hide();
        $scope.gameList = data.result;
    }
    
    var searchCallback = function (data) {
        $('#loader').hide();
        $scope.gameList = data.result;
    }
    
    var collectionCallback = function (data) {
        $('#loader').hide();
        $scope.gameList = data.result;
    }
    
    //get cookie
    window.cookies = $cookies;
    $scope.cookieValue = $cookies;
    
    if ($cookies.username !== undefined) {
        $scope.username = $cookies.username;
    }
    
    
    //function for showing game information on the clicked listed game
    $scope.getDetails = function (id) {
        GeekService.gameId = id;
        EventBroadcaster.broadcast("showGameInfo", id);
    };
    
     //handle click event on search  and collection buttons
    $scope.search = function (query) {
        $('#loader').fadeIn();
        GeekService.searchGames($scope.search.query, $http, searchCallback);
    };
    
    $scope.collection = function () {
        $('#loader').fadeIn();
        //Set cookie
        window.cookies = $cookies;
        $cookies.username = $scope.username;
        GeekService.getCollection($scope.username, $http,collectionCallback);
    };
    
   
    
    
    //handle event broadcasted from the menu
    if (EventBroadcaster.eventName === 'menuClicked') {
        $('.game-details').hide();
        $('#about').hide();
        if (EventBroadcaster.message === 'popular') {
            $scope.message = 'Popular Games';
            $('#loader').fadeIn();
            GeekService.getHotGames($http,hotgameCallBack);
            
            
        } else if (EventBroadcaster.message === 'search') {
            $scope.message = 'Search for games';
            $('#search-form').fadeIn();
        } else if (EventBroadcaster.message === 'collection') {
            $scope.message = 'Game collection';
            $('#collection-form').fadeIn(); 
            //got username from cookie so get colllection automatic
            if ($scope.username !== undefined && $scope.username !== '') {
                $scope.collection();
            }
        } else if (EventBroadcaster.message === 'about') {
            $scope.message = '';
            $('#about').fadeIn();
        } else if (EventBroadcaster.message === 'history') {
            //Only get the game list once, then use cached version from previous serch, collection or popular list
            if (GeekService.hotList.length === 0) {
                $('#loader').fadeIn();
                GeekService.getHotGames($http, hotgameCallBack);
            } else {
                $scope.gameList = GeekService.hotList;
            }
        }
        EventBroadcaster.reset();
    }
   
});

//Game details view
angular.module('miniGeekApp').controller('GameDetailsCtrl', function ($scope, $http, EventBroadcaster, GeekService) {
    
    $scope.forumHeader = '<p> Forum </p>';
    
    $scope.getNextForumPost = function (id, leaf, title) {
        if (!leaf) {
            GeekService.prev_node = GeekService.selected_node;
            GeekService.prev_forumHeader = $scope.forumHeader;
            GeekService.selected_node = id;
            $scope.forumHeader = '<i class="icon-arrow-up"></i>' + '<p> ' + title +  '</p>';
            GeekService.getforumPosts($scope, $http);
            
        }
    };
    
    $scope.getPrevForumPost = function () {
        if (GeekService.selected_node !== 'root') {
            if (GeekService.forumList[0] === undefined) {
                GeekService.selected_node = 'root';
                $scope.forumHeader =  '<p> Forum </p>';
            } else if (GeekService.prev_forumList[0] === undefined) {
                GeekService.selected_node = 'root';
                $scope.forumHeader =  '<p> Forum </p>';
            } else if (GeekService.forumList[0].leaf === false) {
                GeekService.selected_node = 'root';
                $scope.forumHeader =  '<p> Forum </p>';
            } else if (GeekService.forumList[0].leaf === true) {
                GeekService.selected_node = GeekService.prev_node;
                $scope.forumHeader =  GeekService.prev_forumHeader;
            }
            GeekService.getforumPosts($scope, $http);
        }
    };
    
    //Handlers for buttons in Game Details
    $scope.showVideos = function () {
        $('.overview').hide();
        $('#forum-list').hide();
        GeekService.getGameVideos($scope, $http, GeekService.gameId);
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
        GeekService.getforumPosts($scope, $http);
    };

    if (EventBroadcaster.eventName === 'showGameInfo') {
        GeekService.resetFormList();
        GeekService.getGameInfo($http, EventBroadcaster.message, function (data) {
            $scope.details = data.result[0];        
            $('#game-details').fadeIn();
        });
        EventBroadcaster.reset();
    }
});
