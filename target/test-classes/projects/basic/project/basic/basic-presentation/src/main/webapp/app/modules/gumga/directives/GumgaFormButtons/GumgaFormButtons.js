/**
 * Created by igorsantana on 3/13/15.
 */
 define([], function () {

    GumgaFormButtons.$inject = ['$state', '$stateParams'];

    function GumgaFormButtons($state, $stateParams) {
        return {
            restrict: 'E',
            scope: {
                do: '&submit',
                valid: '=',
                continue: '='
            },
            template: '<div ng-class="getPosition()">' +
            '<label id="continuarInserindo" ng-if="inNew">'+
            '<input type="checkbox" name="continuar" ng-model="continue.insert"/>'+
            '<span gumga-translate-tag="formbuttons.inserir"></span>'+
            '</label>' +
            '<button class="btn btn-warning" style="margin-right: 0.8em" ng-click="back()" type="button"><i class="fa fa-history"></i> Back</button>' +
            '<button class="btn btn-primary" style="margin-right: 0.8em" ng-click="do()" ng-disabled="!valid" type="button"><i class="fa fa-floppy-o"></i> Save</button>' +
            '</div>',
            require: '^form',
            link: function (scope, elm, attrs, ctrl) {
                if(!$stateParams.id){
                    scope.inNew = true;
                }

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