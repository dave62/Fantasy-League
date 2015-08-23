'use strict';

angular.module('fantasyleagueApp')
    .controller('ChatMessageController', function ($scope, ChatMessage) {
        $scope.chatMessages = [];
        $scope.loadAll = function() {
            ChatMessage.query(function(result) {
               $scope.chatMessages = result;
            });
        };
        $scope.loadAll();

        $scope.delete = function (id) {
            ChatMessage.get({id: id}, function(result) {
                $scope.chatMessage = result;
                $('#deleteChatMessageConfirmation').modal('show');
            });
        };

        $scope.confirmDelete = function (id) {
            ChatMessage.delete({id: id},
                function () {
                    $scope.loadAll();
                    $('#deleteChatMessageConfirmation').modal('hide');
                    $scope.clear();
                });
        };

        $scope.refresh = function () {
            $scope.loadAll();
            $scope.clear();
        };

        $scope.clear = function () {
            $scope.chatMessage = {content: null, date: null, id: null};
        };
    });
