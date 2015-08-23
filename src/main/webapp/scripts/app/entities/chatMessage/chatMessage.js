'use strict';

angular.module('fantasyleagueApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('chatMessage', {
                parent: 'entity',
                url: '/chatMessages',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: 'ChatMessages'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/chatMessage/chatMessages.html',
                        controller: 'ChatMessageController'
                    }
                },
                resolve: {
                }
            })
            .state('chatMessage.detail', {
                parent: 'entity',
                url: '/chatMessage/{id}',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: 'ChatMessage'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/chatMessage/chatMessage-detail.html',
                        controller: 'ChatMessageDetailController'
                    }
                },
                resolve: {
                    entity: ['$stateParams', 'ChatMessage', function($stateParams, ChatMessage) {
                        return ChatMessage.get({id : $stateParams.id});
                    }]
                }
            })
            .state('chatMessage.new', {
                parent: 'chatMessage',
                url: '/new',
                data: {
                    roles: ['ROLE_USER'],
                },
                onEnter: ['$stateParams', '$state', '$modal', function($stateParams, $state, $modal) {
                    $modal.open({
                        templateUrl: 'scripts/app/entities/chatMessage/chatMessage-dialog.html',
                        controller: 'ChatMessageDialogController',
                        size: 'lg',
                        resolve: {
                            entity: function () {
                                return {content: null, date: null, id: null};
                            }
                        }
                    }).result.then(function(result) {
                        $state.go('chatMessage', null, { reload: true });
                    }, function() {
                        $state.go('chatMessage');
                    })
                }]
            })
            .state('chatMessage.edit', {
                parent: 'chatMessage',
                url: '/{id}/edit',
                data: {
                    roles: ['ROLE_USER'],
                },
                onEnter: ['$stateParams', '$state', '$modal', function($stateParams, $state, $modal) {
                    $modal.open({
                        templateUrl: 'scripts/app/entities/chatMessage/chatMessage-dialog.html',
                        controller: 'ChatMessageDialogController',
                        size: 'lg',
                        resolve: {
                            entity: ['ChatMessage', function(ChatMessage) {
                                return ChatMessage.get({id : $stateParams.id});
                            }]
                        }
                    }).result.then(function(result) {
                        $state.go('chatMessage', null, { reload: true });
                    }, function() {
                        $state.go('^');
                    })
                }]
            });
    });
