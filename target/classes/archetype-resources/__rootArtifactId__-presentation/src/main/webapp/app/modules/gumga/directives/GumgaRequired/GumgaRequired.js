/**
 * Created by igorsantana on 3/13/15.
 */
define([], function () {

    GumgaRequired.$inject = ['GumgaBroadcaster', '$timeout'];

    function GumgaRequired(GumgaBroadcaster, $timeout) {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: false,
            link: function (scope, elm, attrs, ctrl) {
                $timeout(function () {
                    if (!angular.isDefined(ctrl.$$rawModelValue)) {
                        ctrl.$setValidity('required', false);
                        GumgaBroadcaster.emitError({name: attrs.name, status: false, field: 'req',element: elm});
                    }
                }, 20);

                ctrl.$parsers.push(function (txt) {
                    var boolean = txt.length >= 1;
                    //Se for false, está errado.
                    ctrl.$setValidity('required', boolean);
                    GumgaBroadcaster.emitError({name: attrs.name, status: boolean, field: 'req'});
                    return txt;
                });
            }
        };
    }

    return GumgaRequired;

});