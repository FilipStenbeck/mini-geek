'use strict';

angular.module('miniGeekApp')
  .factory('GeekService', function () {

    return {
        
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
        
       getHotGames : function ($http, callback) {
           var that = this;
            $http.get(this.ROOT_URL + 'hotgames').success(function (data) {
                //keep a cache of latest response
                that.hotList = data.result;
                callback(data);
            });
        },
    
        searchGames : function (query, $http, callback) {
            var that = this;
            $http({
                method : 'GET',
                url : that.ROOT_URL + 'search',
                params : {
                    query :  query
                }
            }).success(function (data) {
                //keep a cache of latest response
                that.hotList = data.result;
                callback(data);
            });
        },
        getCollection : function (username, $http, callback) {
            var that = this;
            $http({
                method : 'GET',
                url : that.ROOT_URL + 'collection',
                params : {
                    username :  username
                }
            }).success(function (data) {
                that.hotList =  data.result;
                callback(data);
            });
        },  
          
        getGameInfo : function ($http, id, callback) {
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
                
                //Keep a cashed list of game
                that.game = data.result[0];
                callback(data);
                
            });
        },
        getGameVideos : function ($http, id, callback) {
            var that = this;
            $http({
                method : 'GET',
                url : that.ROOT_URL + 'videolist',
                params : {id : id}
            }).success(function (data) {
                callback(data);
            });
        },
        getforumPosts : function ($http, callback) {
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
                that.forumList = data.result;
                callback(data);
            });
        }  
    };
  });
