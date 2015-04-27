define(
    [
        'angular',
        'jquery',
        'app/modules/login/services/LoginService',
        'angular-ui-router'
    ],
    function (angular, $) {

        LoginController.$inject = ['$scope', 'LoginService'];

        function LoginController($scope, LoginService) {
            $('#emailInput').focus();
            $scope.checkToken = function () {
                if (LoginService.checkToken()) {
                    LoginService.removeToken();
                }
            };

            $scope.doLogin = function (user) {
                var tokenSvc = LoginService.setToken(user);
                tokenSvc.then(function () {
                }, function (err) {
                    var msg;
                    if(err.message == "NO_USER"){
                        msg = "Invalid user."
                    } else {
                        msg = "Wrong password."
                    }
                    window.alert(msg);
                })
            };

            $scope.checkToken();
        }

        return angular.module('app.login.controllers', ['app.login.services', 'ui.router'])
            .controller('LoginController', LoginController);
    });