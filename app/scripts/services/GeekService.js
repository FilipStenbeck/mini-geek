'use strict';

angular.module('miniGeekApp')
  .factory('GeekService', function () {
    // Internal Service logic
    
      var meaningOfLife = 42;

    // Public API here
    return {
       getHotGames : function ($scope, $http) {
            $('#loader').fadeIn();
            $http.get(miniGeekApp.ROOT_URL + 'hotgames').success(function (data) {
                $('#loader').hide();
                
                //Connect the data with the view and creat a gamelit cache
                $scope.gameList = data.result;
                miniGeekApp.hotList = $scope.gameList;
            });
        },
    
        searchGames : function ($scope, $http) {
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
        },
        getCollection : function ($scope, $http) {
            $('#loader').fadeIn();
            $http({
                method : 'GET',
                url : miniGeekApp.ROOT_URL + 'collection',
                params : {
                    username :  $scope.username
                }
            }).success(function (data) {
                $('#loader').hide();
                //Connect the data with the view and creat a gamelit cache
                $scope.gameList = data.result;
                miniGeekApp.hotList = $scope.gameList;
            });
        },  
          
        getGameInfo : function ($scope, $http, id) {
        
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
        },
        getGameVideos : function ($scope, $http, id) {
            $http({
                method : 'GET',
                url : miniGeekApp.ROOT_URL + 'videolist',
                params : {id : id}
            }).success(function (data) {
                $('#video-list').fadeIn();
                $scope.videoList = data.result;
            });
        },
        getforumPosts : function ($scope, $http) {
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
        }  
        
        
    };
  });
