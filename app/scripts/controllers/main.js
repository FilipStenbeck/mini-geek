'use strict';

//The menu controller
angular.module('miniGeekApp').controller('MenuCtrl', function ($scope, EventBroadcaster, UiService) {
   
    $scope.setSelected = function (item) {
        UiService.hideWelcomeMsg();
        $scope.selected = item;
	};
});

//Search form
angular.module('miniGeekApp').controller('StartSearchCtrl', function ($scope, EventBroadcaster, UiService) {
    UiService.hideWelcomeMsg();
    EventBroadcaster.broadcast("menuClicked", 'search');
});

//hotgame form
angular.module('miniGeekApp').controller('PopularCtrl', function ($scope, EventBroadcaster, UiService) {
    UiService.hideWelcomeMsg();
    EventBroadcaster.broadcast("menuClicked", 'popular');
});

//Collection form
angular.module('miniGeekApp').controller('CollectionCtrl', function ($scope, EventBroadcaster, UiService) {
    UiService.hideWelcomeMsg();
    EventBroadcaster.broadcast("menuClicked", 'collection');
});

//About
angular.module('miniGeekApp').controller('AboutCtrl', function ($scope, EventBroadcaster, UiService) {
    UiService.hideWelcomeMsg();
    EventBroadcaster.broadcast("menuClicked", 'about');
});



//Main controller
angular.module('miniGeekApp').controller('MainCtrl', function ($scope, $http, $routeParams, $location, EventBroadcaster,  $cookies, GeekService, UiService) {
    
     //Define a callback for the loading game services
    var updateGameList = function (data) {
        UiService.stopSpinner();
        $scope.gameList = data.result;
    };

    //get cookie
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
        UiService.startSpinner();
        GeekService.searchGames($scope.search.query, $http, updateGameList);
    };
    
    $scope.collection = function () {
        //Set cookie
        $cookies.username = $scope.username;
        UiService.startSpinner();
        GeekService.getCollection($scope.username, $http, updateGameList);
    };

     //Routing directly to gameInfo
    if ($routeParams && $routeParams.gameId) {
        UiService.hideWelcomeMsg();
        $scope.getDetails($routeParams.gameId);
    }
    
    //handle event broadcasted from the menu
    if (EventBroadcaster.eventName === 'menuClicked') {
        //$('.game-details').hide();
        if (EventBroadcaster.message === 'popular') {
            $scope.message = 'Popular Games';
            UiService.startSpinner();
            GeekService.getHotGames($http, updateGameList);
        } else if (EventBroadcaster.message === 'search') {
            $scope.message = 'Search for games';
            UiService.showForm('#search-form');
        } else if (EventBroadcaster.message === 'collection') {
            $scope.message = 'Game collection';
            UiService.showForm('#collection-form');
            //got username from cookie so get colllection automatic
            if ($scope.username !== undefined && $scope.username !== '') {
                $scope.collection();
            }
        } else if (EventBroadcaster.message === 'about') {
            $scope.message = '';
            UiService.showForm('#about');
        } else if (EventBroadcaster.message === 'history') {
            //Only get the game list once, then use cached version from previous serch, collection or popular list
            if (GeekService.hotList.length === 0) {
                UiService.startSpinner();
                GeekService.getHotGames($http, updateGameList);
            } else {
                $scope.gameList = GeekService.hotList;
            }
        }
        EventBroadcaster.reset();
    }
});

//Game details controller
angular.module('miniGeekApp').controller('GameDetailsCtrl', function ($scope, $http, EventBroadcaster, GeekService, UiService) {
    
    var updateForum = function (data) {
        $scope.forumList = data.result;
    };
    
    $scope.forumHeader = '<p> Forum </p>';
    
    $scope.getNextForumPost = function (id, leaf, title) {
        if (!leaf) {
            GeekService.prev_node = GeekService.selected_node;
            GeekService.prev_forumHeader = $scope.forumHeader;
            GeekService.selected_node = id;
            $scope.forumHeader = '<i class="icon-arrow-up"></i>' + '<p> ' + title +  '</p>';
            GeekService.getforumPosts($http, updateForum);
            
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
            GeekService.getforumPosts($http, updateForum);
        }
    };
    
    //Handlers for buttons in Game Details
    $scope.showVideos = function () {
        GeekService.getGameVideos($http, GeekService.gameId, function (data) {
            UiService.showVideoList();
            $scope.videoList = data.result;
        });
    };
    
    $scope.showOverivew = function () {
        UiService.showGameOverview();
    };
    
    $scope.showForums = function () {
        UiService.showForum();
        GeekService.getforumPosts($http, updateForum);
    };

    if (EventBroadcaster.eventName === 'showGameInfo') {
        GeekService.resetFormList();
        GeekService.getGameInfo($http, EventBroadcaster.message, function (data) {
            $scope.details = data.result[0];
            UiService.showGameDetails();
        });
        EventBroadcaster.reset();
    }
});
