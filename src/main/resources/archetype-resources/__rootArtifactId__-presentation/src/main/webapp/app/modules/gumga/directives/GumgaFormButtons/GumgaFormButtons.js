/**
 * Created by igorsantana on 3/13/15.
 */
 define([], function () {

    GumgaFormButtons.$inject = ['$state'];

    function GumgaFormButtons($state) {
        return {
            restrict: 'E',
            scope: {
                do: '&submit',
                valid: '='
            },
            require: '^form',
            template: '<div ng-class="getPosition()">' +
            '<button class="btn btn-warning" style="margin-right: 0.8em" ng-click="back()" type="button"><i class="fa fa-history"></i> Back</button>' +
            '<button class="btn btn-primary" style="margin-right: 0.8em" ng-click="do()" ng-disabled="!valid" type="button"><i class="fa fa-floppy-o"></i> Save</button>' +
            '</div>',
            link: function (scope, elm, attrs, ctrl) {
                scope.getPosition = function () {
                    if (attrs.position == 'left') {
                        return 'pull-left';
                    }
                    return 'pull-right';
                };

                scope.back = function () {
                    $state.go(attrs.back);
                };

            }
        };
    }

    return GumgaFormButtons;

});