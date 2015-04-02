/**
 * Created by igorsantana on 3/9/15.
 */

define(function (require) {
    var angular = require('angular');

    require('app/modules/coisa/services/module');
    require('angular-ui-router');

    var FormController = require('app/modules/coisa/controllers/FormController');
    var ListController = require('app/modules/coisa/controllers/ListController');
    var ModalController = require('app/modules/coisa/controllers/ModalController');

    return angular.module('app.coisa.controllers', ['app.coisa.services','ui.router'])
        .controller('FormController', FormController)
        .controller('ListController', ListController)
        .controller('ModalController', ModalController);
});
