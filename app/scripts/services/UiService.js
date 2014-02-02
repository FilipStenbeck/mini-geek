'use strict';

angular.module('miniGeekApp').factory('UiService', function () {

    // Wrap all direct DOM manipulation in functions
    return {
        stopSpinner: function () {
            $('#loader').hide();
        },
        startSpinner: function () {
            $('#loader').show();
        },
        showGameDetails : function () {
            $('#game-details').show();
        },
        showGameOverview : function () {
            $('#video-list').hide();
            $('#forum-list').hide();
            $('.overview').show();
        },
        showForum : function () {
            $('#video-list').hide();
            $('.overview').hide();
            $('#forum-list').show();
        },
        showVideoList : function () {
            $('.overview').hide();
            $('#forum-list').hide();
            $('#video-list').show();
        },
        showForm : function (id) {
            this.hideForum('#about');
            $(id).fadeIn();
        },
        hideForum : function (id) {
            $(id).hide();
        },
        hideWelcomeMsg : function () {
            $('#about').hide();
            $('#welcome-message').hide();
        }
    };
});
