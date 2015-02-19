define(['gumga-class'], function (GumgaClass) {

    function LoginService($http, $q, $rootScope) {


        this.checkToken = function () {
            return window.sessionStorage.getItem('token');
        }

        this.removeToken = function (user) {
            window.sessionStorage.removeItem('token');
        }

        this.setToken = function (user) {
            var d = $q.defer();
            var promiseObj = {};
            var changeObj = function (state, msg) {
                promiseObj = {
                    changeState: state,
                    message: msg
                }
            }

            $http.get('http://localhost:8084/gumgasecurity-presentation/public/token/create/' + user.email + '/' + user.password)
                    .then(function (data) {
                        if (data.data.token == 0) {
                            changeObj(false, 'Wrong User')
                            d.reject(promiseObj);
                        } else {
                            window.sessionStorage.setItem('token', data.data.token);
                            window.sessionStorage.setItem('user',data.data.login);
                            d.resolve();
                        }
                    }, function (err) {
                        changeObj(false, 'Could not reach the server');
                        d.reject(promiseObj);
                    })
            return d.promise;
        }
    }
    return GumgaClass.create({
        constructor: LoginService
    });

})