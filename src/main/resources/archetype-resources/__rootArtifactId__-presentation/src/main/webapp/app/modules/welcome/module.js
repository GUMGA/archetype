
define(function (require) {
    'use strict';
    require('angular-ui-router');
    require('gumga-core');
    var angular = require('angular');
    return angular.module('app.welcome', ['ui.router','gumga.core']);
});
