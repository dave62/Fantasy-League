'use strict';

angular.module('fantasyleagueApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('club', {
                parent: 'entity',
                url: '/clubs',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: 'Clubs'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/club/clubs.html',
                        controller: 'ClubController'
                    }
                },
                resolve: {
                }
            })
            .state('club.detail', {
                parent: 'entity',
                url: '/club/{id}',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: 'Club'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/club/club-detail.html',
                        controller: 'ClubDetailController'
                    }
                },
                resolve: {
                    entity: ['$stateParams', 'Club', function($stateParams, Club) {
                        return Club.get({id : $stateParams.id});
                    }]
                }
            })
            .state('club.new', {
                parent: 'club',
                url: '/new',
                data: {
                    roles: ['ROLE_USER'],
                },
                onEnter: ['$stateParams', '$state', '$modal', function($stateParams, $state, $modal) {
                    $modal.open({
                        templateUrl: 'scripts/app/entities/club/club-dialog.html',
                        controller: 'ClubDialogController',
                        size: 'lg',
                        resolve: {
                            entity: function () {
                                return {name: null, id: null};
                            }
                        }
                    }).result.then(function(result) {
                        $state.go('club', null, { reload: true });
                    }, function() {
                        $state.go('club');
                    })
                }]
            })
            .state('club.edit', {
                parent: 'club',
                url: '/{id}/edit',
                data: {
                    roles: ['ROLE_USER'],
                },
                onEnter: ['$stateParams', '$state', '$modal', function($stateParams, $state, $modal) {
                    $modal.open({
                        templateUrl: 'scripts/app/entities/club/club-dialog.html',
                        controller: 'ClubDialogController',
                        size: 'lg',
                        resolve: {
                            entity: ['Club', function(Club) {
                                return Club.get({id : $stateParams.id});
                            }]
                        }
                    }).result.then(function(result) {
                        $state.go('club', null, { reload: true });
                    }, function() {
                        $state.go('^');
                    })
                }]
            });
    });
