define(['app/apiLocations'], function (APILocation) {
    'use strict';
    LoginService.$inject = ['$http', '$q', '$rootScope', '$state','GumgaWebStorage'];

    function LoginService($http, $q, $rootScope, $state,GumgaWebStorage) {

        this.checkToken = function () {
            return GumgaWebStorage.getSessionStorageItem('token');
        };

        this.removeToken = function (user) {
            GumgaWebStorage.removeSessionStorageItem('token');
            GumgaWebStorage.removeSessionStorageItem('user');
        };

        this.setToken = function (user) {
            var d = $q.defer();
            var promiseObj = {};

            function changeObj(state, msg) {
                promiseObj = {
                    changeState: state,
                    message: msg
                };
            }

            $http.post(APILocation.apiLocation + 'public/token',{user: user.email ,password: user.password})
                .then(function (data) {
                    if (data.data.response) {
                        changeObj(false, data.data.response);
                        d.reject(promiseObj);
                    }
                    if (data.data.token) {
                        $rootScope.loggedUser = {
                            user: data.data.login,
                            token: data.data.token,
                            organization: data.data.organization
                        };
                        GumgaWebStorage.setSessionStorageItem('user',$rootScope.loggedUser);
                        GumgaWebStorage.setSessionStorageItem('token',data.data.token);
                        $state.go('welcome');
                        d.resolve();
                    }

                }, function () {
                    changeObj(false, 'Could not reach the server');
                    d.reject(promiseObj);
                });
            return d.promise;
        };
    }

    return LoginService;
});