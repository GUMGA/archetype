define([
    'angular',
    'angular-ui-router',
    'app/modules/login/controllers/LoginController',
    'app/modules/login/services/module'], function (angular) {

    return angular.module('app.login', ['ui.router', 'app.login.controllers', 'app.login.services']);
});
