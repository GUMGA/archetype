define(['app/apiLocations'], function (APILocation) {
    LoginService.$inject = ['$http', '$q', '$rootScope', '$state'];

    function LoginService($http, $q, $rootScope, $state) {

        this.checkToken = function () {
            return window.sessionStorage.getItem('token');
        };

        this.removeToken = function (user) {
            window.sessionStorage.removeItem('token');
        };

        this.setToken = function (user) {
            var d = $q.defer();
            var promiseObj = {};

            function changeObj(state, msg) {
                promiseObj = {
                    changeState: state,
                    message: msg
                };
            };
            $http.get(APILocation.apiLocation + '/public/token/create/' + user.email + '/' + user.password)
                .then(function (data) {
                    if (data.data.response) {
                        changeObj(false, data.data.response);
                        d.reject(promiseObj);
                    }
                    if (data.data.token) {
                        $rootScope.loggedUser = {
                            user: data.data.login,
                            token: data.data.token
                        };
                        window.sessionStorage.setItem('token', data.data.token);
                        $state.go('coisa.list');
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