
/**
 * Created by igorsantana on 27/03/15.
 */
define(function (require) {
    'use strict';
    var angular = require('angular');
    require('gumga-core');
    return angular.module('app.login.services', ['gumga.core'])
        .service('LoginService', require('app/modules/login/services/LoginService'));
});