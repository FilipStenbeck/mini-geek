'use strict';

//The menu
miniGeekApp.controller('MenuCtrl', function ($scope, eventBroadcaster) {
    $scope.selected = "";
    $scope.setSelected = function (item) {
		$scope.selected = item;
        if (item !== undefined) {
            eventBroadcaster.broadcast("menuClicked", item);
        }
	};
});

//trigger show popular games
miniGeekApp.controller('PopularCtrl', function ($scope, eventBroadcaster) {
    eventBroadcaster.broadcast("menuClicked", "popular");
});

//trigger show game collection
miniGeekApp.controller('CollectionCtrl', function ($scope, eventBroadcaster) {
    eventBroadcaster.broadcast("menuClicked", "collection");
});

//Main
miniGeekApp.controller('MainCtrl', function ($scope, $http, eventBroadcaster,  $cookies, GeekService) {
    //get cookie
    window.cookies = $cookies;
    $scope.cookieValue = $cookies;
    
    if ($cookies.username !== undefined) {
        $scope.username = $cookies.username;
    }
    
    
    //function for showing game information on the clicked listed game
    $scope.getDetails = function (id) {
        miniGeekApp.gameId = id;
        eventBroadcaster.broadcast("showGameInfo", id);
    };
    
     //handle click event on search  and collection buttons
    $scope.search = function (query) {
        GeekService.searchGames($scope, $http);
    };
    
    $scope.collection = function () {
        //Set cookie
        window.cookies = $cookies;
        $cookies.username = $scope.username;
        
        GeekService.getCollection($scope, $http);
    };
    
        
    //handle event broadcasted from the menu
    if (eventBroadcaster.eventName === 'menuClicked') {
        $('.game-details').hide();
        $('#about').hide();
        if (eventBroadcaster.message === 'popular') {
            $scope.message = 'Popular Games';
            GeekService.getHotGames($scope, $http);
            
            
        } else if (eventBroadcaster.message === 'search') {
            $scope.message = 'Search for games';
            $('#search-form').fadeIn();
        } else if (eventBroadcaster.message === 'collection') {
            $scope.message = 'Game collection';
            $('#collection-form').fadeIn(); 
            //got username from cookie so get colllection automatic
            if ($scope.username !== undefined && $scope.username !== '') {
                $scope.collection();
            }
        } else if (eventBroadcaster.message === 'about') {
            $scope.message = '';
            $('#about').fadeIn();
        } else if (eventBroadcaster.message === 'history') {
            //Only get the game list once, then use cached version from previous serch, collection or popular list
            if (miniGeekApp.hotList.length === 0) {
                GeekService.getHotGames($scope, $http);
            } else {
                $scope.gameList = miniGeekApp.hotList;
            }
        }
        eventBroadcaster.reset();
    }
   
});

//Game details view
miniGeekApp.controller('GameDetailsCtrl', function ($scope, $http, eventBroadcaster, GeekService) {
  
    $scope.forumHeader = '<p> Forum </p>';
    
    $scope.getNextForumPost = function (id, leaf, title) {
        if (!leaf) {
            miniGeekApp.prev_node = miniGeekApp.selected_node;
            miniGeekApp.prev_forumHeader = $scope.forumHeader;
            miniGeekApp.selected_node = id;
            $scope.forumHeader = '<i class="icon-arrow-up"></i>' + '<p> ' + title +  '</p>';
            GeekService.getforumPosts($scope, $http);
            
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
            } else if (miniGeekApp.forumList[0].leaf === true) {
                miniGeekApp.selected_node = miniGeekApp.prev_node;
                $scope.forumHeader =  miniGeekApp.prev_forumHeader;
            }
            GeekService.getforumPosts($scope, $http);
        }
    };
    
    //Handlers for buttons in Game Details
    $scope.showVideos = function () {
        $('.overview').hide();
        $('#forum-list').hide();
        GeekService.getGameVideos($scope, $http, miniGeekApp.gameId);
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

    if (eventBroadcaster.eventName === 'showGameInfo') {
        miniGeekApp.resetFormList();
        GeekService.getGameInfo($scope, $http, eventBroadcaster.message);
        eventBroadcaster.reset();
    }
});
