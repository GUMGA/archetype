
define([
    'angular',
    'angular-ui-router',
    'app/modules/login/controllers/module',
    'app/modules/login/services/module'], function (angular) {
    'use strict';
    return angular.module('app.login', ['ui.router', 'app.login.controllers', 'app.login.services']);
});
