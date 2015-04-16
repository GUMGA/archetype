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
            controller: 'CoisaListController',
            resolve: {
                        translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                            $translatePartialLoader.addPart('coisa');
                            return $translate.refresh();
                        }]
            }
        })
        .state('coisa.insert', {
            url: '/insert',
            templateUrl: 'app/modules/coisa/views/form.html',
            controller: 'CoisaFormController',
            resolve: {
                        entity: ['$stateParams', '$http', function ($stateParams, $http) {
                            var url = APILocation.apiLocation + '/api/coisa/new'
                            return $http.get(url);
                        }]
                        ,translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                            $translatePartialLoader.addPart('coisa');
                            return $translate.refresh();
                        }]
            }
        })
        .state('coisa.edit', {
            url: '/edit/:id',
            templateUrl: 'app/modules/coisa/views/form.html',
            controller: 'CoisaFormController',
            resolve: {
                entity: ['$stateParams', '$http', function ($stateParams, $http) {
                    return $http.get(APILocation.apiLocation + '/api/coisa/' + $stateParams.id);
                }]
                ,translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                            $translatePartialLoader.addPart('coisa');
                            return $translate.refresh();
                }]
            }
        });
    })
});
