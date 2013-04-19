'use strict';


// Provide a module that get lists of games
angular.module('GameGetterModule', []).
 
  factory('gameGetter', function() {
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

//Create the custom element as an independent module
angular.module('Directives', []).directive('gameList', function () {
    return {
        restrict: 'E',
        scope: false,
        templateUrl: 'templates/gamelist-template.html'
    };
}).directive('videoList', function () {
    return {
        restrict: 'E',
        scope: false,
        templateUrl: 'templates/videolist-template.html'
    };
}).directive('forumList', function () {
    return {
        restrict: 'E',
        scope: false,
        templateUrl: 'templates/forumlist-template.html'
    };
});

//Create the Main module
var miniGeekApp = angular.module('miniGeekApp', ['Directives', 'GameGetterModule', 'ngCookies'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MenuCtrl'
      })
    .when('/popular', {
        templateUrl: 'views/main.html',
        controller: 'PopularCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });


//Set URL to the backend service
miniGeekApp.ROOT_URL = 'http://mini-geek-service.appspot.com/';

//setup for cached data
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

