
define(['jquery'],
    function ($) {
        'use strict';
        LoginController.$inject = ['$scope', 'LoginService'];

        function LoginController($scope, LoginService) {
            $('#emailInput').focus();

            $scope.checkToken = function () {
                LoginService.removeToken();
            };

            $scope.doLogin = function (user) {
                LoginService.setToken(user)
            };


            $scope.checkToken();

        }
        return LoginController;

    });