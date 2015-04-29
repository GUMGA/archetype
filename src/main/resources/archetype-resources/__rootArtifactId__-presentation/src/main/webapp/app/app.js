define(function (require) {
    require('angular');
    require('angular-ui-router');
    require('angular-input-masks');

    require('angular-cookies');
    require('angular-dynamic-locale');
    require('app/modules/language/module');

    require('app/modules/login/module');
    //FIMREQUIRE
    require('app/apiLocations');

    angular.module('app.core', [
        'ui.router'
        , 'app.login'
        , 'ngCookies'
        , 'app.language'
        , 'ui.utils.masks'
        //FIMINJECTIONS
        ])
    .config(function ($stateProvider, $urlRouterProvider, $httpProvider, $injector,$translateProvider, tmhDynamicLocaleProvider) {

         $urlRouterProvider.otherwise('login');
        $stateProvider
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
                    loading[0].setAttribute('class', 'loading');
                    var rootScope = $injector.get('$rootScope');
                    rootScope.$broadcast('dangerMessage', {
                        title: 'Error',
                        message: rejection.statusText
                    });                  
                    return $q.reject(rejection);
                }
            };
        })
})
.run(function ($rootScope, $templateCache, Language, $translate) {
    $templateCache.put('modalTemplate.html');
    $rootScope.breadcrumbs = [];
    $rootScope.$on('$stateChangeSuccess',function(event,toState){
        updateBreadcrumb({state: toState.name, id: toState.data.id});
    });

    function updateBreadcrumb(obj){
        if(obj.state == 'login'){
            $rootScope.breadcrumbs = [];
        }
        var aux = -1;
        $rootScope.breadcrumbs.forEach(function(el,idx){
            if(obj.id === el.id){
                aux = idx;
            }
        });
        if(aux >= 0){
            $rootScope.breadcrumbs.splice(aux,($rootScope.breadcrumbs.length -1),obj);
        } else {
            $rootScope.breadcrumbs.push(obj);
        }
        $rootScope.$broadcast('breadChanged');
    }

})
});
