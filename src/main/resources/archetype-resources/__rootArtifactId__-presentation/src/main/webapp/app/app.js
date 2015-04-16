define(function (require) {
    require('angular');
    require('angular-ui-router');

    require('angular-cookies');
    require('angular-dynamic-locale');
    require('angular-translate');
    require('angular-translate-loader-partial');
    require('angular-translate-storage-cookie');
    require('app/modules/language/module');

    require('app/modules/coisa/module');
    require('app/modules/login/module');
    //FIMREQUIRE
    require('app/apiLocations');

    angular.module('app.core', [
        'ui.router'
        , 'app.coisa'
        , 'app.login'
        , 'ngCookies' , 'app.language'
        //FIMINJECTIONS
        ])
    .config(function ($stateProvider, $urlRouterProvider, $httpProvider, $injector,$translateProvider, tmhDynamicLocaleProvider) {


         // Initialize angular-translate
         $translateProvider.useLoader('$translatePartialLoader', {
          urlTemplate: 'i18n/{lang}/{part}.json'
        });

        $translateProvider.preferredLanguage('pt-br');
        $translateProvider.useCookieStorage();

        tmhDynamicLocaleProvider.localeLocationPattern('bower_components/angular-i18n/angular-locale_{{locale}}.js');
        tmhDynamicLocaleProvider.useCookieStorage('NG_TRANSLATE_LANG_KEY');

        $urlRouterProvider.otherwise('login');
        $stateProvider
        .state('coisa',{
            url: '/coisa',
            templateUrl: 'app/modules/coisa/views/base.html'
        })
        .state('login', {
            url: '/login',
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
                    var rootScope = $injector.get('$rootScope');
                    var $state = $injector.get('$state');
                    var $timeout = $injector.get('$timeout');
                    rootScope.$broadcast('dangerMessage', {
                        title: 'Error',
                        message: rejection.statusText,
                        fade: true
                    });
                    $timeout(function(){
                        $state.go('login');
                    },1000)
                    
                    return $q.reject(rejection);
                }
            };
        })
})
.run(function ($rootScope, $templateCache, Language, $translate) {
    $templateCache.put('modalTemplate.html');
        $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams) {
        // Update the language
        Language.getCurrent().then(function (language) {
            $translate.use(language);
        });
    });

})
});
