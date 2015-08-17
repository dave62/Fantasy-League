'use strict';

angular.module('fantasyleagueApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('draft', {
                parent: 'entity',
                url: '/draft',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: 'Draft'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/draft/draft.html',
                        controller: 'DraftController'
                    }
                },
                resolve: {
                }
            })
            ;
    });
