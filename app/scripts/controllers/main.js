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
miniGeekApp.controller('MainCtrl', function ($scope, $http, eventBroadcaster) {

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
    };
        
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
    
    $scope.search = function (query) {
        searchGames($scope, $http);
    };
   
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
            } else if (miniGeekApp.forumList[0].leaf === true) {
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
