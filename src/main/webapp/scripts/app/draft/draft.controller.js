'use strict';

angular.module('fantasyleagueApp')
    .controller('DraftController', function ($scope, Player, ParseLinks) {
        $scope.players = [];
        $scope.page = 1;
        $scope.loadAll = function() {
        	Player.query({page: $scope.page, per_page: 25}, function(result, headers) {
                $scope.links = ParseLinks.parse(headers('link'));
                $scope.players = result;
            });
        };
        $scope.loadPage = function(page) {
            $scope.page = page;
            $scope.loadAll();
        };
        $scope.loadAll();

    });
