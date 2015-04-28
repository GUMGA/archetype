/**
 * Created by igorsantana on 28/04/15.
 */
define(function(require){
    var angular = require('angular');
    return angular.module('gumga.translate',[])
        .directive('gumgaTranslate',require('./directives/GumgaTranslate'))
        .directive('gumgaTranslateTag',require('./directives/GumgaTranslateTag'))
        .factory('GumgaTranslateHelper',require('./services/GumgaTranslateHelper'))
});
