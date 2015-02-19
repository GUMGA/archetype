define(function (require) {

    return require('angular-class').create({
        $inject: ['$scope', 'LoginService', '$location'],
        prototype: {
            initialize: function () {
                var lg = this;

                var changeLocation = function () {
                    window.location.assign('http://localhost:8084/${rootArtifactId}/crud/coisa/base.html#/');
                }

                lg.checkToken = function () {
                    if (lg.LoginService.checkToken()) {
                        lg.LoginService.removeToken();
                    }
                }

                lg.$scope.doLogin = function (user) {
                    var tokenSvc = lg.LoginService.setToken(user);
                    tokenSvc.then(function (data) {
                        changeLocation();
                    }, function (data) {
                        alert('Invalid User!');
                        lg.$scope.user = {};
                    })
                };

                lg.checkToken();
            }

        }
    });
});
