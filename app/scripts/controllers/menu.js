/*
	Controller for handle menu click
*/
angular.module('miniGeekApp').controller('MenuCtrl', function ($scope, UiService) {
    $scope.setSelected = function (item) {
        UiService.hideWelcomeMsg();
	};
});

/*
	Controllers to handle routing to difrent part of the application
*/
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