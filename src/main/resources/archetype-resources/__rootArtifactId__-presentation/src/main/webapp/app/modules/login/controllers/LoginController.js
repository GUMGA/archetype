define(['jquery'],
    function ($) {
        'use strict';
        LoginController.$inject = ['$scope', 'LoginService','$modal'];

        function LoginController($scope, LoginService,$modal) {
            $('#emailInput').focus();

            LoginService.removeToken();

            $scope.doLogin = function (user) {
                LoginService.setToken(user)
            };
        }
        return LoginController;

    });