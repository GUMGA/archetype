define([
    'angular',
    './filter/standard-types',
    './filter/directive',
    './filter/directive/config',
    './filter/directive/item',
    './filter/directive/option',
    './filter/directive/panel',
    './filter/service/panel',
    './filter/provider',
    './filter/lang/pt-br',
    'angular-translate'
], function (angular,
             standardTypes,
             GumgaFilter,
             GumgaFilterConfiguration,
             GumgaFilterItem,
             GumgaFilterOption,
             GumgaFilterPanel,
             GumgaFilterPanelService,
             GumgaFilterProvider,
             Translator) {

    return angular.module('gumga.filter', ['pascalprecht.translate'])

        .directive('gumgaFilter', GumgaFilter)
        .directive('gumgaFilterConfiguration', GumgaFilterConfiguration)
        .directive('gumgaFilterItem', GumgaFilterItem)
        .directive('gumgaFilterOption', GumgaFilterOption)
        .directive('gumgaFilterPanel', GumgaFilterPanel)
        .service('GumgaFilterPanelService', GumgaFilterPanelService)
        .provider("GumgaFilter", GumgaFilterProvider)

        .config(['$translateProvider', 'GumgaFilterProvider', function ($translateProvider, GumgaFilterProvider) {
            $translateProvider.translations('pt-br', Translator);
            $translateProvider.preferredLanguage('pt-br');


            for (var type in standardTypes) {
                GumgaFilterProvider.type(type, standardTypes[type]);
            }

        }]);

});
