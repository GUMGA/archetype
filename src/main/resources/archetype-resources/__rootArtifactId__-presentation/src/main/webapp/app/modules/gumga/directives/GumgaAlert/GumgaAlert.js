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
                    notify('glyphicon glyphicon-exclamation-sign', data.title, data.message, 'danger', data.fade);
                });
                $rootScope.$on('successMessage', function (ev, data) {
                    notify('glyphicon glyphicon-ok', data.title, data.message, 'success', data.fade);
                });
                $rootScope.$on('warningMessage', function (ev, data) {
                    notify('glyphicon glyphicon-warning-sign', data.title, data.message, 'warning', data.fade);
                });
                $rootScope.$on('infoMessage', function (ev, data) {
                    notify('glyphicon glyphicon-info-sign', data.title, data.message, 'info', data.fade);
                });

                function notify(icon, title, message, type,fade) {
                    var delay;
                    if(fade === true){
                        delay = 3500;
                    } else {
                        delay = false
                    }
                    $.notify({
                        icon: icon,
                        title: title,
                        message: message
                    }, {
                        type: type,
                        offset: 50,
                        timer: 0,
                        delay: delay,
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