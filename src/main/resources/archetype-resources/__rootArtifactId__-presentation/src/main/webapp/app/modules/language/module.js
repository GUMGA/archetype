define(function (require) {

    var angular = require('angular');
    require('app/modules/language/services/module');
    require('app/modules/language/controllers/module');
    require('app/modules/gumga/module');
    var APILocation = require('app/apiLocations');

    angular.module('app.language', ['app.language.controllers', 'app.language.services', 'gumga.core', 'tmh.dynamicLocale' , 'pascalprecht.translate'])

});
