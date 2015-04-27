/**
 * Created by igorsantana on 13/04/2015 17:31:34.
 */

define(function(require){
    require('app/modules/gumga/module');
    var LanguageService = require('app/modules/language/services/LanguageService');
    return angular.module('app.language.services',['gumga.core'])
        .service('Language',LanguageService);
});