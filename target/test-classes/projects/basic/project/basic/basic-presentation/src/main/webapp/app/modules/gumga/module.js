/**
 * Created by igorsantana on 3/10/15.
 */
define(function (require) {
    var angular = require('angular'),
        APILocations = require('app/apiLocations');
        require('jquery');
        require('angular-ui-bootstrap');
        require('angular-ui-router');
        require('app/modules/gumga/directives/GumgaFilter/Filter');
        require('app/modules/gumga/directives/GumgaTranslate/module');

    return angular.module('gumga.core', ['ui.bootstrap', 'ui.router','gumga.filter','gumga.translate'])
        .service('GumgaBase', require('app/modules/gumga/services/GumgaBase'))
        .service('GumgaUtils', require('app/modules/gumga/services/GumgaUtils'))
        .service('GumgaBroadcaster', require('app/modules/gumga/services/GumgaBroadcaster'))
        .factory('GumgaAddressService', require('app/modules/gumga/services/GumgaAddressService'))
        .factory('GumgaWebStorage', require('app/modules/gumga/services/GumgaStorage'))
        .directive('gumgaNav', require('app/modules/gumga/directives/GumgaNav/GumgaNav'))
        .directive('gumgaMenu', require('app/modules/gumga/directives/GumgaMenu/GumgaMenu'))
        .directive('gumgaTable', require('app/modules/gumga/directives/GumgaTable/GumgaTable'))
        .directive('gumgaSearch', require('app/modules/gumga/directives/GumgaSearch/GumgaSearch'))
        .directive('gumgaMax', require('app/modules/gumga/directives/GumgaMax/GumgaMax'))
        .directive('gumgaMin', require('app/modules/gumga/directives/GumgaMin/GumgaMin'))
        .directive('gumgaRequired', require('app/modules/gumga/directives/GumgaRequired/GumgaRequired'))
        .directive('gumgaErrors', require('app/modules/gumga/directives/GumgaErrors/GumgaErrors'))
        .directive('gumgaFormButtons', require('app/modules/gumga/directives/GumgaFormButtons/GumgaFormButtons'))
        .directive('gumgaMultiEntitySearch', require('app/modules/gumga/directives/GumgaMultiEntitySearch/GumgaMultiEntitySearch'))
        .directive('gumgaAddress', require('app/modules/gumga/directives/GumgaAddress/GumgaAddress'))
        .directive('gumgaGoogleMaps',require('app/modules/gumga/directives/GumgaGoogleMaps/GumgaGoogleMaps'))
        .directive('gumgaOneToMany',require('app/modules/gumga/directives/GumgaOneToMany/GumgaOneToMany'))
        .directive('gumgaManyToMany', require('app/modules/gumga/directives/GumgaManyToMany/GumgaManyToMany'))
        .directive('gumgaManyToOne',require('app/modules/gumga/directives/GumgaManyToOne/GumgaManyToOne'))
        .directive('gumgaAlert', require('app/modules/gumga/directives/GumgaAlert/GumgaAlert'))
        .directive('gumgaImage', require('app/modules/gumga/directives/GumgaImage/GumgaImage'))
        .directive('gumgaBreadcrumb',require('app/modules/gumga/directives/GumgaBreadCrumb/GumgaBreadCrumb'))
        .filter('gumgaLimit', require('app/modules/gumga/filters/GumgaLimit/GumgaLimit'))
        .controller('MultiEntityController', require('app/modules/gumga/controllers/MultiEntityController'))
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
