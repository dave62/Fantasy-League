'use strict';

angular.module('fantasyleagueApp')
    .controller('LogoutController', function (Auth) {
        Auth.logout();
    });
