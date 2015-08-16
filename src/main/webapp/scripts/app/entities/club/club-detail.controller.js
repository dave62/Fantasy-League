'use strict';

angular.module('fantasyleagueApp')
    .controller('ClubDetailController', function ($scope, $rootScope, $stateParams, entity, Club, Player) {
        $scope.club = entity;
        $scope.load = function (id) {
            Club.get({id: id}, function(result) {
                $scope.club = result;
            });
        };
        $rootScope.$on('fantasyleagueApp:clubUpdate', function(event, result) {
            $scope.club = result;
        });
    });
