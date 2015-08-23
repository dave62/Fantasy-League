'use strict';

angular.module('fantasyleagueApp')
    .controller('ChatMessageDetailController', function ($scope, $rootScope, $stateParams, entity, ChatMessage, User) {
        $scope.chatMessage = entity;
        $scope.load = function (id) {
            ChatMessage.get({id: id}, function(result) {
                $scope.chatMessage = result;
            });
        };
        $rootScope.$on('fantasyleagueApp:chatMessageUpdate', function(event, result) {
            $scope.chatMessage = result;
        });
    });
