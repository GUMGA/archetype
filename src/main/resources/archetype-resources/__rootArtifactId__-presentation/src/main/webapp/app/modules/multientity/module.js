/**
 * Created by igorsantana on 3/18/15.
 */
define(function (require) {
    var angular = require('angular');
    require('angular-ui-router');
    require("gumga-core");

    return angular.module('multi.entity', ['ui.router', 'gumga.core'])
        .controller('MultiEntityController', require('./MultiEntityController'));
});