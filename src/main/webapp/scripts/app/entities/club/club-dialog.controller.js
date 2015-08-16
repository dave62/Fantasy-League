'use strict';

angular.module('fantasyleagueApp').controller('ClubDialogController',
    ['$scope', '$stateParams', '$modalInstance', 'entity', 'Club', 'Player',
        function($scope, $stateParams, $modalInstance, entity, Club, Player) {

        $scope.club = entity;
        $scope.players = Player.query();
        $scope.load = function(id) {
            Club.get({id : id}, function(result) {
                $scope.club = result;
            });
        };

        var onSaveFinished = function (result) {
            $scope.$emit('fantasyleagueApp:clubUpdate', result);
            $modalInstance.close(result);
        };

        $scope.save = function () {
            if ($scope.club.id != null) {
                Club.update($scope.club, onSaveFinished);
            } else {
                Club.save($scope.club, onSaveFinished);
            }
        };

        $scope.clear = function() {
            $modalInstance.dismiss('cancel');
        };
}]);
