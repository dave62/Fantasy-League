'use strict';

angular.module('fantasyleagueApp')
    .controller('ClubController', function ($scope, Club, ParseLinks) {
        $scope.clubs = [];
        $scope.page = 1;
        $scope.loadAll = function() {
            Club.query({page: $scope.page, per_page: 20}, function(result, headers) {
                $scope.links = ParseLinks.parse(headers('link'));
                $scope.clubs = result;
            });
        };
        $scope.loadPage = function(page) {
            $scope.page = page;
            $scope.loadAll();
        };
        $scope.loadAll();

        $scope.delete = function (id) {
            Club.get({id: id}, function(result) {
                $scope.club = result;
                $('#deleteClubConfirmation').modal('show');
            });
        };

        $scope.confirmDelete = function (id) {
            Club.delete({id: id},
                function () {
                    $scope.loadAll();
                    $('#deleteClubConfirmation').modal('hide');
                    $scope.clear();
                });
        };

        $scope.refresh = function () {
            $scope.loadAll();
            $scope.clear();
        };

        $scope.clear = function () {
            $scope.club = {name: null, id: null};
        };
    });
