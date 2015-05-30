/**
 * Created by igorsantana on 28/05/15.
 */
define([
    'angular',
    'mousetrap',
    'angular-ui-bootstrap',
    'angular-ui-router',
    'angular-locale',
    "gumga-translate",
    "gumga-search",
    "gumga-association",
    "gumga-controllers",
    "gumga-directives",
    "gumga-services",
    "gumga-validators"
],function(angular,Keyboard){

    angular.module('gumga.core',
        [
            'ui.bootstrap',
            'ui.router',
            'ngLocale',
            'gumga.translate',
            'gumga.search',
            'gumga.associations',
            'gumga.controllers',
            'gumga.directives',
            'gumga.services',
            'gumga.validators'
        ])
	.run(function ($state, $rootScope) {
                Keyboard.bind('a s', function (e) {
                    e.preventDefault();
                    if ($state.current.name.split('.')[1] == 'list') {
                        $rootScope.$broadcast('showPanel');
                    }
                });
                Keyboard.bind('ins', function (e) {
                    e.preventDefault();
                    $state.go($state.current.name.split('.')[0] + '.insert');
                });
                Keyboard.bind('del', function (e) {
                    e.preventDefault();
                    if (document.querySelector('gumga-table') && e.defaultPrevented) {
                        $rootScope.$broadcast('_del');
                    }
                });
                Keyboard.bind('ctrl+l', function (e) {
                    e.preventDefault();
                    if (document.querySelector('gumga-table') && e.defaultPrevented) {
                        $rootScope.$broadcast('_clean');
                    }
                });
                Keyboard.bind('ctrl+enter', function (e) {
                    e.preventDefault();
                    if (document.querySelector('gumga-search') && e.defaultPrevented) {
                        $rootScope.$broadcast('_doSearch');
                    }
                });
                Keyboard.bind('shift+f', function (e) {
                    e.preventDefault();
                    if (document.querySelector('gumga-search') && e.defaultPrevented) {
                        $rootScope.$broadcast('_focus');
                    }
                })
            })

});
