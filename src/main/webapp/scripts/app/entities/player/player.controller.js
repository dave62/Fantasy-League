'use strict';

angular.module('fantasyleagueApp')
    .controller('PlayerController', function ($scope, Player, ParseLinks) {
        $scope.players = [];
        $scope.page = 1;
        $scope.loadAll = function() {
            Player.query({page: $scope.page, per_page: 20}, function(result, headers) {
                $scope.links = ParseLinks.parse(headers('link'));
                $scope.players = result;
            });
        };
        $scope.loadPage = function(page) {
            $scope.page = page;
            $scope.loadAll();
        };
        $scope.loadAll();

        $scope.delete = function (id) {
            Player.get({id: id}, function(result) {
                $scope.player = result;
                $('#deletePlayerConfirmation').modal('show');
            });
        };

        $scope.confirmDelete = function (id) {
            Player.delete({id: id},
                function () {
                    $scope.loadAll();
                    $('#deletePlayerConfirmation').modal('hide');
                    $scope.clear();
                });
        };

        $scope.refresh = function () {
            $scope.loadAll();
            $scope.clear();
        };

        $scope.clear = function () {
            $scope.player = {name: null, position: null, id: null};
        };
    });
