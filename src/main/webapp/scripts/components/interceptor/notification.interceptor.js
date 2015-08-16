 'use strict';

angular.module('fantasyleagueApp')
    .factory('notificationInterceptor', function ($q, AlertService) {
        return {
            response: function(response) {
                var alertKey = response.headers('X-fantasyleagueApp-alert');
                if (angular.isString(alertKey)) {
                    AlertService.success(alertKey, { param : response.headers('X-fantasyleagueApp-params')});
                }
                return response;
            },
        };
    });