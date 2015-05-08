
define(function (require) {
    'use strict';
    require('angular');
    require('angular-ui-router');
    require('app/modules/welcome/module');
    require('app/modules/login/module');
    //FIMREQUIRE
    require('api-locations');

    angular.module('app.core', ['ui.router'
        , 'app.welcome'
        , 'app.login'
        //FIMINJECTIONS
        ])
        .config(function ($stateProvider, $urlRouterProvider, $httpProvider, $injector) {

            $urlRouterProvider.otherwise('login');
            $stateProvider
                .state('welcome',{
                    url: '/welcome',
                    data: {
                        id: 1
                    },
                    templateUrl: 'app/modules/welcome/views/welcome.html'
                })
                .state('login', {
                    url: '/login',
                    data: {
                        id: 0
                    },
                    templateUrl: 'app/modules/login/views/login.html'
                })
                //FIMROUTE
                ;

            var loading = document.getElementsByClassName('loading');
            $httpProvider.interceptors.push(function ($q, $injector) {
                return {
                    'request': function (config) {
                        loading[0].setAttribute('class', 'loading active');
                        var rootScope = $injector.get('$rootScope');
                        if(rootScope.loggedUser){
                            config.headers['gumgaToken'] = rootScope.loggedUser.token || 0;
                        }
                        if (config.url == "gumga-menu.json" || config.url == "keys.json") {
                            config.cache = true;
                        }
                        return config;
                    },
                    'response':function(config){
                        loading[0].setAttribute('class', 'loading');
                        return config;
                    },
                    'responseError': function (rejection) {
                        var $rootScope = $injector.get('$rootScope');
                        $rootScope.$broadcast('dangerMessage', {
                            title: 'Error',
                            message: rejection.statusText
                        });
                        if(rejection.status === 403){
                            var state= $injector.get('$state');
                            state.go('login');
                        }
                        loading[0].setAttribute('class', 'loading');
                        return $q.reject(rejection);
                    }
                };
            })
        })
        .run(function($rootScope,$state){
            $rootScope.breadcrumbs = [];


            $rootScope.$on('$stateChangeSuccess',function(event,toState){
                updateBreadcrumb(toState.name,toState.data.id);
            });

            function getIndex(id){
                var x;
                $rootScope.breadcrumbs.forEach(function(elm,index){
                    if(id === elm.id){
                        x = index;
                    }
                });
                return x;
            }

                function updateBreadcrumb(state, id) {
                    if (state === 'login') {
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