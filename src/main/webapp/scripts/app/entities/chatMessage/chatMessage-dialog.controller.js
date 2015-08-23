'use strict';

angular.module('fantasyleagueApp').controller('ChatMessageDialogController',
    ['$scope', '$stateParams', '$modalInstance', 'entity', 'ChatMessage', 'User',
        function($scope, $stateParams, $modalInstance, entity, ChatMessage, User) {

        $scope.chatMessage = entity;
        $scope.users = User.query();
        $scope.load = function(id) {
            ChatMessage.get({id : id}, function(result) {
                $scope.chatMessage = result;
            });
        };

        var onSaveFinished = function (result) {
            $scope.$emit('fantasyleagueApp:chatMessageUpdate', result);
            $modalInstance.close(result);
        };

        $scope.save = function () {
            if ($scope.chatMessage.id != null) {
                ChatMessage.update($scope.chatMessage, onSaveFinished);
            } else {
                ChatMessage.save($scope.chatMessage, onSaveFinished);
            }
        };

        $scope.clear = function() {
            $modalInstance.dismiss('cancel');
        };
}]);
