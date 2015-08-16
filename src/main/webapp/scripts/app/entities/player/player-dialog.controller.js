'use strict';

angular.module('fantasyleagueApp').controller('PlayerDialogController',
    ['$scope', '$stateParams', '$modalInstance', 'entity', 'Player', 'Club',
        function($scope, $stateParams, $modalInstance, entity, Player, Club) {

        $scope.player = entity;
        $scope.clubs = Club.query();
        $scope.load = function(id) {
            Player.get({id : id}, function(result) {
                $scope.player = result;
            });
        };

        var onSaveFinished = function (result) {
            $scope.$emit('fantasyleagueApp:playerUpdate', result);
            $modalInstance.close(result);
        };

        $scope.save = function () {
            if ($scope.player.id != null) {
                Player.update($scope.player, onSaveFinished);
            } else {
                Player.save($scope.player, onSaveFinished);
            }
        };

        $scope.clear = function() {
            $modalInstance.dismiss('cancel');
        };
}]);
