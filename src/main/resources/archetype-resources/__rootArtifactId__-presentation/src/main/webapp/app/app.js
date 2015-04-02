define(function (require) {
    require('angular');
    require('angular-ui-router');
    require('app/modules/coisa/module.js'); //Aqui será chamado o arquivo coisa.min.js
    require('app/modules/login/module.js'); // Aqui será chamado o arquivo login.min.js
    require('app/apiLocations')

    angular.module('app.core', ['ui.router', 'app.coisa', 'app.login'])
        .config(function ($stateProvider, $urlRouterProvider, $httpProvider, $injector) {

            $urlRouterProvider.otherwise('login');
            $stateProvider
                .state('core', {
                    url: '/core'
                })
                .state('login', {
                    url: '/login',
                    templateUrl: 'app/modules/login/views/login.html'
                })
                .state('coisa', {
                    url: '/coisa',
                    templateUrl: 'app/modules/coisa/views/base.html'
                })
                .state('pessoa', {
                    url: '/pessoa',
                    templateUrl: 'app/modules/pessoa/views/list.html'
                });


            $httpProvider.interceptors.push(function ($q, $injector) {
                return {
                    'request': function (config) {
                        config.headers['gumgaToken'] = window.sessionStorage.getItem('token') || 0;
                        if (config.url == "gumga-menu.json" || config.url == "keys.json") {
                            config.cache = true;
                        }
                        return config;
                    },
                    'responseError': function (rejection) {
                        var rootScope = $injector.get('$rootScope');
                        var $state = $injector.get('$state');
                        var $timeout = $injector.get('$timeout');
                        switch (rejection.status) {
                            case 401:
                                rootScope.$broadcast('dangerMessage', {
                                    title: 'Error',
                                    message: rejection.statusText,
                                    fade: true
                                });
                                $state.go('login');
                                break;
                            case 500:
                                rootScope.$broadcast('dangerMessage', {
                                    title: 'Error',
                                    message: rejection.statusText,
                                    fade: true
                                });
                                $timeout(function(){
                                    $state.go('login');
                                },1000)
                                break;

                        }
                        return $q.reject(rejection);
                    }
                };
            })
        })
        .run(function ($templateCache) {
            $templateCache.put('modalTemplate.html');
        })
});