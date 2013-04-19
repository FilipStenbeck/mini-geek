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

miniGeekApp.controller('PopularCtrl', function ($scope, eventBroadcaster) {
    eventBroadcaster.broadcast("menuClicked", "popular");
});


//Main
miniGeekApp.controller('MainCtrl', function ($scope, $http, eventBroadcaster,  $cookies) {
    //get cookie
    window.cookies = $cookies;
    $scope.cookieValue = $cookies;
    
    if ($cookies.username !== undefined) {
        $scope.username = $cookies.username;
    }
    
    //Inject the game getter module
    var injector = angular.injector(['GameGetterModule']);
    var gameGetter = injector.get('gameGetter');
    
    //function for showing game information on the clicked listed game
    $scope.getDetails = function (id) {
        miniGeekApp.gameId = id;
        eventBroadcaster.broadcast("showGameInfo", id);
    };
    
     //handle click event on search  and collection buttons
    $scope.search = function (query) {
        gameGetter.searchGames($scope, $http);
    };
    
    $scope.collection = function () {
        //Set cookie
        window.cookies = $cookies;
        $cookies.username = $scope.username;
        
        gameGetter.getCollection($scope, $http);
    };
    
        
    //handle event broadcasted from the menu
    if (eventBroadcaster.eventName === 'menuClicked') {
        $('.game-details').hide();
        $('#about').hide();
        if (eventBroadcaster.message === 'popular') {
            $scope.message = 'Popular Games';
            gameGetter.getHotGames($scope, $http);
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
                gameGetter.getHotGames($scope, $http);
            } else {
                $scope.gameList = miniGeekApp.hotList;
            }
        }
        eventBroadcaster.reset();
    }
   
});

//Game details view
miniGeekApp.controller('GameDetailsCtrl', function ($scope, $http, eventBroadcaster) {
    
    //Inject the game getter module
    var injector = angular.injector(['GameGetterModule']);
    var gameGetter = injector.get('gameGetter');

    $scope.forumHeader = '<p> Forum </p>';
    
    $scope.getNextForumPost = function (id, leaf, title) {
        if (!leaf) {
            miniGeekApp.prev_node = miniGeekApp.selected_node;
            miniGeekApp.prev_forumHeader = $scope.forumHeader;
            miniGeekApp.selected_node = id;
            $scope.forumHeader = '<i class="icon-arrow-up"></i>' + '<p> ' + title +  '</p>';
            gameGetter.getforumPosts($scope, $http);
            
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
            gameGetter.getforumPosts($scope, $http);
        }
    };
    
    //Handlers for buttons in Game Details
    $scope.showVideos = function () {
        $('.overview').hide();
        $('#forum-list').hide();
        gameGetter.getGameVideos($scope, $http, miniGeekApp.gameId);
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
        gameGetter.getforumPosts($scope, $http);
    };

    if (eventBroadcaster.eventName === 'showGameInfo') {
        miniGeekApp.resetFormList();
        gameGetter.getGameInfo($scope, $http, eventBroadcaster.message);
        eventBroadcaster.reset();
    }
});
