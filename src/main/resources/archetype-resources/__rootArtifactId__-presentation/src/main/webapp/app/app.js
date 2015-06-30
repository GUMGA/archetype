
define(function (require) {
    'use strict';
    require('angular');
    require('angular-ui-router');
    require('app/modules/login/module');
    require('angular-tree');
    require('app/apiLocations');
    //FIMREQUIRE
    angular.module('app.core', 
    	['ui.router',
      'app.login'
    	//FIMINJECTIONS
    	])
    .config(function ($stateProvider, $urlRouterProvider, $httpProvider, $injector) {

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
            template: '<div ui-view></div>'
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
        });
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
                                    config.headers['gumgaToken'] = angular.fromJson(window.sessionStorage.getItem('token')) || 0;
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
                            // $rootScope.$broadcast('dangerMessage', {title: rejection.data.response, message: rejection.statusText});
                            rejection.status == 403 && ($state.go('login.log'));    
                            return $q.reject(rejection);
                        }
                    };
                })
})
.run(function ($rootScope) {
    var count = 0;
    $rootScope.$on('dangerMessage', function (ev, data) {
        console.info(count);
        count++;
        $timeout(function(){
            notify('glyphicon glyphicon-exclamation-sign', data.title, data.message, 'danger');
        })
    });
    $rootScope.$on('successMessage', function (ev, data) {
        $timeout(function(){
            notify('glyphicon glyphicon-ok', data.title, data.message, 'success');
        })
    });
    $rootScope.$on('warningMessage', function (ev, data) {
        $timeout(function(){
            notify('glyphicon glyphicon-warning-sign', data.title, data.message, 'warning');
        })
    });
    $rootScope.$on('infoMessage', function (ev, data) {
        $timeout(function(){
            notify('glyphicon glyphicon-info-sign', data.title, data.message, 'info');
        })
    });

    function notify(icon, title, message, type) {
        $timeout(function(){
            $.notify({
                icon: icon,
                title: title,
                message: message
            }, {
                type: type,
                offset: 50,
                timer: 100,
                delay: 2000,
                onShow: $rootScope.$broadcast('onNotificationShow'),
                onClose: $rootScope.$broadcast('onNotificationClose'),
                allow_dismiss: true,
                animate: {
                    enter: 'animated bounceInRight',
                    exit: 'animated bounceOutRight'
                },
                template: '<div data-notify="container" class="col-xs-9 col-sm-3 alert alert-{0}" role="alert">' +
                '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
                '<span data-notify="icon"></span> ' +
                '<span data-notify="title"><b>{1}</b></span><br> ' +
                '<span data-notify="message">{2}</span>' +
                '</div>'
            })
        })
}

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

})
});
