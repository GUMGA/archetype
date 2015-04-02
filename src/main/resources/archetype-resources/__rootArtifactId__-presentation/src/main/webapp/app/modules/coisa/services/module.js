/**
 * Created by igorsantana on 3/10/15.
 */

define(function(require){
    require('app/modules/gumga/module');
    var CoisaService = require('app/modules/coisa/services/CoisaService');
    return angular.module('app.coisa.services',['gumga.core'])
        .service('CoisaService',CoisaService);
});