/**
 * Created by igorsantana on 01/04/15.
 */
define(['jquery', 'notify'], function ($) {

    GumgaAlert.$inject = ['$rootScope'];

    function GumgaAlert($rootScope) {

        return {
            restrict: 'EA',
            scope: false,
            compile: function(){

                $rootScope.$on('dangerMessage', function (ev, data) {
                    notify('glyphicon glyphicon-exclamation-sign', data.title, data.message, 'danger');
                });
                $rootScope.$on('successMessage', function (ev, data) {
                    notify('glyphicon glyphicon-ok', data.title, data.message, 'success');
                });
                $rootScope.$on('warningMessage', function (ev, data) {
                    notify('glyphicon glyphicon-warning-sign', data.title, data.message, 'warning');
                });
                $rootScope.$on('infoMessage', function (ev, data) {
                    notify('glyphicon glyphicon-info-sign', data.title, data.message, 'info');
                });

                function notify(icon, title, message, type) {
                    $.notify({
                        icon: icon,
                        title: title,
                        message: message
                    }, {
                        type: type,
                        offset: 50,
                        timer: 100,
                        delay: 3500,
                        allow_dismiss: true,
                        animate: {
                            enter: 'animated bounceInRight',
                            exit: 'animated bounceOutRight'
                        },
                        template: '<div data-notify="container" class="col-xs-9 col-sm-3 alert alert-{0}" role="alert">' +
                        '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
                        '<span data-notify="icon"></span> ' +
                        '<span data-notify="title"><b>{1}</b></span><br> ' +
                        '<span data-notify="message">{2}</span>' +
                        '</div>'
                    });
                }
            }
        }
    }

    return GumgaAlert;
})