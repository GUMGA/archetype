/**
 * Created by igorsantana on 3/10/15.
 */
 define([
    'angular',
    'app/apiLocations',
    'app/modules/gumga/services/GumgaBase',
    'app/modules/gumga/services/GumgaUtils',
    'app/modules/gumga/services/GumgaBroadcaster',
    'app/modules/gumga/services/GumgaAddressService',
    'app/modules/gumga/services/GumgaStorage',
    'app/modules/gumga/directives/GumgaNav/GumgaNav',
    'app/modules/gumga/directives/GumgaMenu/GumgaMenu',
    'app/modules/gumga/directives/GumgaTable/GumgaTable',
    'app/modules/gumga/directives/GumgaSearch/GumgaSearch',
    'app/modules/gumga/directives/GumgaMax/GumgaMax',
    'app/modules/gumga/directives/GumgaMin/GumgaMin',
    'app/modules/gumga/directives/GumgaRequired/GumgaRequired',
    'app/modules/gumga/directives/GumgaErrors/GumgaErrors',
    'app/modules/gumga/directives/GumgaFormButtons/GumgaFormButtons',
    'app/modules/gumga/directives/GumgaMultiEntitySearch/GumgaMultiEntitySearch',
    'app/modules/gumga/directives/GumgaAddress/GumgaAddress',
    'app/modules/gumga/directives/GumgaManyToMany/GumgaManyToMany',
    'app/modules/gumga/directives/GumgaAlert/GumgaAlert',
    'app/modules/gumga/directives/GumgaGoogleMaps/GumgaGoogleMaps',
    'app/modules/gumga/filters/GumgaLimit/GumgaLimit',
    'app/modules/gumga/controllers/MultiEntityController',
    'jquery',
    'angular-ui-bootstrap',
    'angular-ui-router',
    'app/modules/gumga/directives/GumgaFilter/Filter'
    ], function (angular,
       APILocations,
       GumgaBase,
       GumgaUtils,
       GumgaBroadcaster,
       GumgaAddressService,
       GumgaStorage,
       GumgaNav,
       GumgaMenu,
       GumgaTable,
       GumgaSearch,
       GumgaMax,
       GumgaMin,
       GumgaRequired,
       GumgaErrors,
       GumgaFormButtons,
       GumgaMultiEntitySearch,
       GumgaAddress,
       GumgaManyToMany,
       GumgaAlert,
       GumgaGoogleMaps,
       GumgaLimit,
       MultiEntityController) {


        return angular.module('gumga.core', ['ui.bootstrap', 'gumga.filter', 'ui.router'])
        .service('GumgaBase', GumgaBase)
        .service('GumgaUtils', GumgaUtils)
        .service('GumgaBroadcaster', GumgaBroadcaster)
        .factory('GumgaAddressService', GumgaAddressService)
        .factory('GumgaWebStorage', GumgaStorage)
        .directive('gumgaNav', GumgaNav)
        .directive('gumgaMenu', GumgaMenu)
        .directive('gumgaTable', GumgaTable)
        .directive('gumgaSearch', GumgaSearch)
        .directive('gumgaMax', GumgaMax)
        .directive('gumgaMin', GumgaMin)
        .directive('gumgaRequired', GumgaRequired)
        .directive('gumgaErrors', GumgaErrors)
        .directive('gumgaFormButtons', GumgaFormButtons)
        .directive('gumgaMultiEntitySearch', GumgaMultiEntitySearch)
        .directive('gumgaAddress', GumgaAddress)
        .directive('gumgaGoogleMaps',GumgaGoogleMaps)
        .directive('gumgaManyToMany', GumgaManyToMany)
        .directive('gumgaAlert', GumgaAlert)
        .filter('gumgaLimit', GumgaLimit)
        .controller('MultiEntityController', MultiEntityController)
        .config(function ($stateProvider, $httpProvider) {
            var template = ['multiEntity.html',
            '<gumga-nav></gumga-nav>',
            '<gumga-menu menu-url="gumga-menu.json" keys-url="keys.json"></gumga-menu>',
            '<div class="gumga-container">',
            '<gumga-multi-entity-search data="multi.search"></gumga-multi-entity-search>',
            '</div>']
            $stateProvider
            .state('multientity', {
                url: '/multientity/:search',
                template: template.join('\n'),
                controller: 'MultiEntityController',
                controllerAs: 'multi',
                resolve: {
                    SearchPromise: ['$stateParams', '$http', function ($stateParams, $http) {
                        var url = APILocations.apiLocation + '/public/multisearch/search/';
                        return $http.get(url + $stateParams.search);
                    }]
                }
            })
        })
    });