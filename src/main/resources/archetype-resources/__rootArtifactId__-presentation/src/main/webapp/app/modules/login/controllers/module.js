
/**
 * Created by igorsantana on 05/05/15.
 */
define(function (require) {
    'use strict';
    var angular = require('angular');
    require('app/modules/login/services/module');
    return angular.module('app.login.controllers', ['app.login.services'])
        .controller('LoginController', require('app/modules/login/controllers/LoginController'));
});