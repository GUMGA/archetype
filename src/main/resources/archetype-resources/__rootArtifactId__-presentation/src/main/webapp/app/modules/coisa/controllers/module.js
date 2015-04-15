define(function (require) {
    var angular = require('angular');
    require('app/modules/coisa/services/module');
    
    return angular.module('app.coisa.controllers', ['app.coisa.services'])
    .controller('CoisaFormController', require('app/modules/coisa/controllers/CoisaFormController'))
    .controller('CoisaListController', require('app/modules/coisa/controllers/CoisaListController'))
});
