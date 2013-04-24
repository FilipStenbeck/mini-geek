'use strict';

angular.module('miniGeekApp')
  .factory('GeekService', function () {
    // Internal Service logic
    
      var meaningOfLife = 42;

    // Public API here
    return {
        
        that : this,
        //Set URL to the backend service
       ROOT_URL : 'http://mini-geek-service.appspot.com/',
        
        //locally cached data
        hotList : [],
        gameId : '',
        game : {},
        forumList : [],
        prev_forumList : [], 
        selected_node : 'root',
        prev_forumHeader : '',
        prev_node : 'root',
        
        resetFormList : function () {
            this.forumList = [];
            this.selected_node = 'root';
        },  
        
       getHotGames : function ($scope, $http) {
            $('#loader').fadeIn();
           var that = this;
            $http.get(this.ROOT_URL + 'hotgames').success(function (data) {
                $('#loader').hide();
                
                //Connect the data with the view and creat a gamelit cache
                $scope.gameList = data.result;
                that.hotList = $scope.gameList;
            });
        },
    
        searchGames : function ($scope, $http) {
            var that = this;
            $('#loader').fadeIn();
            $http({
                method : 'GET',
                url : that.ROOT_URL + 'search',
                params : {
                    query :  $scope.search.query
                }
            }).success(function (data) {
                $('#loader').hide();
                //Connect the data with the view and creat a gamelit cache
                $scope.gameList = data.result;
                that.hotList = $scope.gameList;
            });
        },
        getCollection : function ($scope, $http) {
            var that = this;
            $('#loader').fadeIn();
            $http({
                method : 'GET',
                url : that.ROOT_URL + 'collection',
                params : {
                    username :  $scope.username
                }
            }).success(function (data) {
                $('#loader').hide();
                //Connect the data with the view and creat a gamelit cache
                $scope.gameList = data.result;
                that.hotList = $scope.gameList;
            });
        },  
          
        getGameInfo : function ($scope, $http, id) {
            var that = this;
            $http({
                method : 'GET',
                url : that.ROOT_URL + 'gameinfo',
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
                that.game = data.result[0];
                
                  //Show the details
                $('#game-details').fadeIn();
                
            });
        },
        getGameVideos : function ($scope, $http, id) {
            var that = this;
            $http({
                method : 'GET',
                url : that.ROOT_URL + 'videolist',
                params : {id : id}
            }).success(function (data) {
                $('#video-list').fadeIn();
                $scope.videoList = data.result;
            });
        },
        getforumPosts : function ($scope, $http) {
            var that = this;
            that.prev_forumList = that.forumList;
            $http({
                method : 'GET',
                url : that.ROOT_URL + 'forumlist',
                params : {
                    node :  that.selected_node,
                    game : that.gameId
                         
                }
            }).success(function (data) {
                $scope.forumList = data.result;
                that.forumList = data.result;
            });
        }  
    };
  });
