'use strict';

angular.module('fantasyleagueApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('player', {
                parent: 'entity',
                url: '/players',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: 'Players'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/player/players.html',
                        controller: 'PlayerController'
                    }
                },
                resolve: {
                }
            })
            .state('player.detail', {
                parent: 'entity',
                url: '/player/{id}',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: 'Player'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/player/player-detail.html',
                        controller: 'PlayerDetailController'
                    }
                },
                resolve: {
                    entity: ['$stateParams', 'Player', function($stateParams, Player) {
                        return Player.get({id : $stateParams.id});
                    }]
                }
            })
            .state('player.new', {
                parent: 'player',
                url: '/new',
                data: {
                    roles: ['ROLE_USER'],
                },
                onEnter: ['$stateParams', '$state', '$modal', function($stateParams, $state, $modal) {
                    $modal.open({
                        templateUrl: 'scripts/app/entities/player/player-dialog.html',
                        controller: 'PlayerDialogController',
                        size: 'lg',
                        resolve: {
                            entity: function () {
                                return {name: null, position: null, id: null};
                            }
                        }
                    }).result.then(function(result) {
                        $state.go('player', null, { reload: true });
                    }, function() {
                        $state.go('player');
                    })
                }]
            })
            .state('player.edit', {
                parent: 'player',
                url: '/{id}/edit',
                data: {
                    roles: ['ROLE_USER'],
                },
                onEnter: ['$stateParams', '$state', '$modal', function($stateParams, $state, $modal) {
                    $modal.open({
                        templateUrl: 'scripts/app/entities/player/player-dialog.html',
                        controller: 'PlayerDialogController',
                        size: 'lg',
                        resolve: {
                            entity: ['Player', function(Player) {
                                return Player.get({id : $stateParams.id});
                            }]
                        }
                    }).result.then(function(result) {
                        $state.go('player', null, { reload: true });
                    }, function() {
                        $state.go('^');
                    })
                }]
            });
    });
