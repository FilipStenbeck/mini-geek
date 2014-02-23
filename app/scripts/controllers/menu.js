angular.module('miniGeekApp').controller('MenuCtrl', function ($scope, UiService) {
   
    $scope.setSelected = function (item) {
        UiService.hideWelcomeMsg();
	};
});