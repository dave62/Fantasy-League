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
    }).directive('toggle', function() {
    	  return function(scope, element, attrs) {
    		    var clickingCallback = function() {
    		    	var $content = $(element).next();
    	    	    //open up the content needed - toggle the slide- if visible, slide up, if not slidedown.
    	    	    $content.slideToggle(300, function () {
    	    	    });
    		    };
    		    element.bind('click', clickingCallback);
    		  }
    		});
    
    




