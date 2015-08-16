'use strict';

angular.module('fantasyleagueApp')
    .factory('Club', function ($resource, DateUtils) {
        return $resource('api/clubs/:id', {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    return data;
                }
            },
            'update': { method:'PUT' }
        });
    });
