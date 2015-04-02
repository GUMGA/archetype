define(function (require) {

    var angular = require('angular');
    require('angular-ui-router');
    require('app/modules/coisa/services/module');
    require('app/modules/coisa/controllers/module');
    require('app/modules/gumga/module');
    var APILocation = require('app/apiLocations');

    angular.module('app.coisa', ['ui.router', 'app.coisa.controllers', 'app.coisa.services', 'gumga.core'])
        .config(function ($stateProvider, $httpProvider) {
            $stateProvider
                .state('coisa.list', {
                    url: '/list',
                    templateUrl: 'app/modules/coisa/views/list.html',
                    controller: 'ListController',
                    controllerAs: 'list'
                })
                .state('coisa.insert', {
                    url: '/insert',
                    templateUrl: 'app/modules/coisa/views/form.html',
                    controller: 'FormController',
                    controllerAs: 'form',
                    resolve: {
                        entity: function () {
                            return {};
                        }
                    }
                })
                .state('coisa.edit', {
                    url: '/edit/:id',
                    templateUrl: 'app/modules/coisa/views/form.html',
                    controller: 'FormController',
                    controllerAs: 'form',
                    resolve: {
                        entity: ['$stateParams', '$http', function ($stateParams, $http) {
                            var url = APILocation.apiLocation + '/financeiro-api/api/coisa/' + $stateParams.id;
                            return $http.get(url);
                        }]
                    }
                });
        })
});