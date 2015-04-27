/**
 * Created by igorsantana on 3/12/15.
 */
(define([], function () {


    GumgaMax.$inject = ['GumgaBroadcaster', '$timeout'];

    function GumgaMax(GumgaBroadcaster, $timeout) {
        return {
            restrict: 'A',
            require: 'ngModel',
            priority: 10,
            link: function (scope, elm, attrs, ctrl) {
                function emit(boolean) {
                    GumgaBroadcaster.emitError({name: attrs.name, status: boolean, field: 'max'});
                    ctrl.$setValidity('gumgaError', boolean);
                }
                var max = parseInt(attrs.gumgaMax);
                var txt;
                ctrl.$$rawModelValue ? txt = ctrl.$$rawModelValue.length : txt = 0;

                $timeout(function () {
                    emit(txt <= max);
                }, 20);

                ctrl.$parsers.push(function (txt) {
                    //Se for false, está errado.
                    emit(txt.length <= max);
                    return txt;
                });
            }
        };
    }

    return GumgaMax;
}));