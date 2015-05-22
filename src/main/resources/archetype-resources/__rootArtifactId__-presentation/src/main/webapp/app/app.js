
define(function (require) {
    'use strict';
    require('angular');
    require('angular-ui-router');
    require('app/modules/login/module');
    require('app/apiLocations');

    angular.module('app.core', ['ui.router', 'app.login'])
            .config(function ($stateProvider, $urlRouterProvider, $httpProvider, $injector) {

                $urlRouterProvider.otherwise('login/log');
                $stateProvider
                        .state('login', {
                            abstract: true,
                            url: '/login',
                            data: {
                                id: 0
                            },
                            template: '<div ui-view></div>'
                        })
                        .state('welcome', {
                            url: '/welcome',data: {
                                id: 0
                            },
                            templateUrl: 'app/modules/welcome/views/welcome.html'
                        })


                var loading = document.getElementsByClassName('loading');
                $httpProvider.interceptors.push(function ($q, $injector) {
                    return {
                        'request': function (config) {
                            loading[0].setAttribute('class', 'loading active');
                            var rootScope = $injector.get('$rootScope');
                            config.headers['gumgaToken'] = angular.fromJson(window.sessionStorage.getItem('token')) || 0;
                            if (config.url == "gumga-menu.json" || config.url == "keys.json") {
                                config.cache = true;
                            }
                            return config;
                        },
                        'response': function (config) {
                            loading[0].setAttribute('class', 'loading');
                            return config;
                        },
                        'responseError': function (rejection) {
                            loading[0].setAttribute('class', 'loading');
                            if (rejection.status === 403) {
                                var state = $injector.get('$state');
                                state.go('login');
                            }
                            return $q.reject(rejection);
                        }
                    };
                })
            })
            .run(function ($rootScope) {

                $rootScope.breadcrumbs = [];

                $rootScope.$on('$stateChangeSuccess', function (event, toState) {
                    updateBreadcrumb(toState.name, toState.data.id);
                });

                function getIndex(id) {
                    var x;
                    $rootScope.breadcrumbs.forEach(function (elm, index) {
                        if (id === elm.id) {
                            x = index;
                        }
                    });
                    return x;
                }

                function updateBreadcrumb(state, id) {
                    if (state === 'login.log' || state === 'multientity') {
                        $rootScope.breadcrumbs = [];
                    } else {
                        if ($rootScope.breadcrumbs.filter(filterArray).length === 0) {
                            $rootScope.breadcrumbs.push({state: state, id: id});
                        } else {
                            $rootScope.breadcrumbs.splice(getIndex(id), 5, {state: state, id: id});
                        }
                        $rootScope.$broadcast('breadChanged');
                    }

                    function filterArray(element) {
                        return element.id === id;
                    }
                }

            })
});