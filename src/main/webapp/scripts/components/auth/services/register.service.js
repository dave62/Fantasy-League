'use strict';

angular.module('fantasyleagueApp')
    .factory('Register', function ($resource) {
        return $resource('api/register', {}, {
        });
    });


