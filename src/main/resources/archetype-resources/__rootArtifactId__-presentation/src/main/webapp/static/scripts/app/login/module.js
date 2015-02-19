define(function (require) {

    require('gumga-components')
    require('angular-ui-router');
    return require('angular')
            .module('app.login', ['gumga.components', 'ui.router'])

            .service('LoginService', require('app/login/service'))

            .controller('LoginController', require('app/login/controllers/login'));
});
