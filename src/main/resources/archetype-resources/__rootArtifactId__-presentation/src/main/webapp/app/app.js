define(function (require) {
    'use strict';
    require('angular');
    require('angular-ui-router');
    require('gumga-components');
    require('app/modules/login/module');
    require('app/apiLocations');
    //FIMREQUIRE
    angular.module('app.core', 
    	['ui.router', 'gumga.components',
       'app.login'
    	//FIMINJECTIONS
    	])
    .config(function ($stateProvider, $urlRouterProvider, $httpProvider, $injector, $gumgaTranslateProvider,GumgaAlertProvider) {

        $gumgaTranslateProvider.setLanguage('pt-br');

        var template = [
        '<gumga-nav></gumga-nav>',
        '<gumga-menu menu-url="gumga-menu.json" keys-url="keys.json" image="./resources/images/gumga.png"></gumga-menu>',
        'oi<div class="gumga-container">',
        '<gumga-multi-entity-search data="multi.search"></gumga-multi-entity-search>',
        '</div>'];

        $urlRouterProvider.otherwise('login/log');
        $stateProvider
        .state('login', {
            abstract: true,
            url: '/login',
            data: {
                id: 0
            },
            template: '<div ui-view style="height: 100%;"></div>'
        })
        .state('welcome', {
            url: '/welcome',data: {
                id: 0
            },
            templateUrl: 'app/modules/welcome/views/welcome.html'
        })
        .state('multientity', {
            url: '/multientity/:search',
            template: template.join('\n'),
            controller: 'MultiEntityController',
            controllerAs: 'multi',
            data: {
                id: 0
            },
            resolve: {
                SearchPromise: ['$stateParams', '$http', function ($stateParams, $http) {
                    var url = APILocations.apiLocation + '/public/multisearch/search/';
                    return $http.get(url + $stateParams.search);
                }]
            }
        })
                        //FIMROUTE


                        $httpProvider.interceptors.push(function ($q, $injector,$timeout) {
                            var $rootScope = $injector.get('$rootScope')
                            ,   loading = document.getElementsByClassName('loading')[0];

                            function setLoading(_b){
                                _b ? loading.setAttribute('class', 'loading active') : loading.setAttribute('class', 'loading');
                            }

                            return {
                                'request': function (config) {
                                    setLoading(true);
                                    config.headers['gumgaToken'] = window.sessionStorage.getItem('token') || 0;
                                    if (config.url == "gumga-menu.json" || config.url == "keys.json") {
                                        config.cache = true;
                                    }
                                    return config;
                                },
                                'response': function (config) {
                                    setLoading(false);
                                    return config;
                                },
                                'responseError': function (rejection) {
                                    var $state = $injector.get('$state');
                                    setLoading(false);
                                    GumgaAlertProvider.createDangerMessage(rejection.data.response, rejection.statusText);
                                    rejection.status == 403 && ($state.go('login.log'));    
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

    function updateBreadcrumb(state, id) {
        function get(id) {
            for (var i = 0, len = $rootScope.breadcrumbs.length; i < len; i++) {
                if ($rootScope.breadcrumbs[i].id === id) {
                    return i;
                }
            }
        }

        if (id && get(id) >= 0) {
            $rootScope.breadcrumbs.splice(get(id), $rootScope.breadcrumbs.length - get(id), {state: state, id: id});
        } else {
            $rootScope.breadcrumbs.push({state: state, id: id});
        }
        !id ? $rootScope.breadcrumbs = [] : angular.noop;
        $rootScope.$broadcast('breadChanged');
    }

});
});
