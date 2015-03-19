define([
    'angular',
    'gumga/services/growl',
    'gumga-keys',
    'app-commons/constant/i18n',
    'angular-ui-router',
    'gumga-components',
    'jquery-blockui',
    'app/login/module'
], function (angular, GumgaGrowl, GumgaKeys, i18n) {

    var module = angular.module("app.base.crud", [
        'ui.router',
        'gumga.components',
        GumgaGrowl.name,
        GumgaKeys.name,
        'app.login'
    ]);

    module.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', 'baseTemplateURL', function ($stateProvider, $urlRouterProvider, $httpProvider, baseTemplateURL) {

            $urlRouterProvider.otherwise("/list");

            $stateProvider
                    .state("list", {
                        url: "/list",
                        templateUrl: "list.html",
                        controller: "ListController",
                        controllerAs: "ctrl",
                        shortcut: 'g l',
                        resolve: {
                            entityListData: ['EntityService', function (EntityService) {
                                    return EntityService.fetch();
                                }]
                        }
                    })
                    .state("insert", {
                        url: "/insert",
                        templateUrl: "form.html",
                        controller: "FormController",
                        controllerAs: "ctrl",
                        confirmExit: true,
                        shortcut: 'g i',
                        resolve: {
                            entity: ['EntityService', function (EntityService) {
                                    return EntityService.loadDefaultValues();
                                }]
                        }
                    })
                    .state("edit", {
                        url: "/edit/:id",
                        templateUrl: "form.html",
                        controller: "FormController",
                        controllerAs: "ctrl",
                        confirmExit: true,
                        resolve: {
                            entity: ['EntityService', '$stateParams', function (EntityService, $stateParams) {
                                    return EntityService.load($stateParams.id);
                                }]

                        }
                    });



            $httpProvider.interceptors.push
            (function ($q, $window, $timeout, GumgaGrowl) {
                return {
                    'responseError': function (response) {
                        console.log(response);
                        if (response.status == 404)
                            GumgaGrowl.error("Service not found");
                        if (response.status == 401) {
                            GumgaGrowl.error("Security Message", response.data);
                            $symbol_dollar
                            .unblockUI();
                        }
                        return $q.reject(response);
                    }
                };
            });

            ${symbol_dollar}.blockUI.defaults = {
                message: "",
                showOverlay: true
            };
        }]);


    module.run(['$rootScope', '$state', 'GumgaGrowl', 'GumgaMessage', '$injector', 'LoginService', function ($rootScope, $state, GumgaGrowl, GumgaMessage, $injector, LoginService) {

            $rootScope.gumgaToken = LoginService.checkToken();

            $injector.get("$http").defaults.transformRequest = function (data, headersGetter) {
                if ($rootScope.gumgaToken)
                    headersGetter()['gumgaToken'] = $rootScope.gumgaToken;
                if (data) {
                    return angular.toJson(data);
                }
            };

            $rootScope.$on('$stateChangeStart', function (e, toState, toParams, fromState, fromParams) {
                if (!${symbol_dollar}state.get(fromState.name).confirmExit) {
                    $symbol_dollar
                .blockUI();
                    return;
                }

                e.preventDefault();

                GumgaMessage.confirm('Deseja descartar as alterações?', function (response) {
                    if (response) {
                        $state.get
                        (fromState.name).confirmExit = false;
                        $state.go
                        (toState.name, toParams);
                    }
                });
            });

            $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                $symbol_dollar
                .unblockUI();
            });

            $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
                $symbol_dollar
                .unblockUI();
                var message = 'Unexpected error';
                var details = null;

                if (error.data) {
                    if (error.data.message)
                        message = error.data.message;
                    if (error.data.details)
                        details = error.data.details;
                }

                GumgaGrowl.error(message, details);
            });

        }]);

    module.constant('i18n', i18n);

    return module;
});
