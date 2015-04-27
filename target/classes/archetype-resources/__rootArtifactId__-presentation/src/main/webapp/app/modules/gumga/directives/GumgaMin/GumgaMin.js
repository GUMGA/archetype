/**
 * Created by igorsantana on 3/12/15.
 */
 define([], function () {

    GumgaMin.$inject = ['GumgaBroadcaster','$timeout'];

    function GumgaMin(GumgaBroadcaster,$timeout) {
        return {
            restrict: 'A',
            require: 'ngModel',
            priority: 10,
            link: function (scope, elm, attrs, ctrl) {
                var min = parseInt(attrs.gumgaMin);
                
                function emit(boolean){
                    GumgaBroadcaster.emitError({name: attrs.name, status: boolean, field: 'min'});
                    ctrl.$setValidity('gumgaError', boolean);
                }
                $timeout(function(){
                    var txt;
                    ctrl.$$rawModelValue ? txt = ctrl.$$rawModelValue.length : txt = 0;
                    emit(min <= txt);
                },20)
                
                ctrl.$parsers.push(function (txt) {
                    //Se for false, está errado.
                    emit(min <= txt.length);
                    return txt;
                });
            }
        };
    }

    return GumgaMin;
});