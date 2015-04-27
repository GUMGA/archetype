
define(function (require) {
    var angular = require('angular');

    require('app/modules/language/services/module');

    return angular.module('app.language.controllers', ['app.language.services'])
        .controller('LanguageController', require('app/modules/language/controllers/LanguageController'))
});
