'use strict';

angular.module('fantasyleagueApp')
    .controller('PlayerDetailController', function ($scope, $rootScope, $stateParams, entity, Player, Club) {
        $scope.player = entity;
        $scope.load = function (id) {
            Player.get({id: id}, function(result) {
                $scope.player = result;
            });
        };
        $rootScope.$on('fantasyleagueApp:playerUpdate', function(event, result) {
            $scope.player = result;
        });
    });
