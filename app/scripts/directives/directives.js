//Create the custom elements as an independent module
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
}).directive('includedList', function () {
    return {
        restrict: 'E',
        scope: false,
        templateUrl: 'templates/included-template.html'
    };
});