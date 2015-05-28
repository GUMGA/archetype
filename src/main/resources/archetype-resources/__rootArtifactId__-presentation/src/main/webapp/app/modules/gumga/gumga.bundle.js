/**
 * Created by igorsantana on 28/05/15.
 */
define([
    'angular',
    'angular-ui-bootstrap',
    'angular-ui-router',
    "gumga-translate",
    "gumga-search",
    "gumga-association",
    "gumga-controllers",
    "gumga-directives",
    "gumga-services",
    "gumga-validators"
],function(angular){

    angular.module('gumga.core',
        [
            'ui.bootstrap',
            'ui.router',
            'gumga.translate',
            'gumga.search',
            'gumga.associations',
            'gumga.controllers',
            'gumga.directives',
            'gumga.services',
            'gumga.validators'
        ])

});