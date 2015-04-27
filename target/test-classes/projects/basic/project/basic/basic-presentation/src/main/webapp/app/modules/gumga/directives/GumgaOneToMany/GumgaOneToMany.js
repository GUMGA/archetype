/**
 * Created by igorsantana on 22/04/15.
 */
define(['jquery'],function($){

    GumgaOneToMany.$inject = ['$modal'];

    function GumgaOneToMany($modal){
        var template = [
            '<div class="col-md-12" style="padding-left: 0;padding-right: 0">',
            '   <button type="button" class="btn btn-default" ng-click="newModal()">New</button>',
            '   <ul class="list-group">',
            '       <li ng-repeat="child in children" class="list-group-item">',
            '           {{child[property]}}',
            '           <button type="button" class="btn btn-default pull-right btn-sm" ng-click="newModal(child)"><i class="glyphicon glyphicon-pencil"></i></button>',
            '           <button type="button" class="btn btn-danger pull-right btn-sm" ng-click="removeFromList(child)"><i class="glyphicon glyphicon-remove"></i></button>',
            '       <div class="clearfix"></div></li>',
            '   <ul>',
            '</div>',
            '<div class="clearfix"></div>'
        ];

        return {
            restrict: 'E',
            template: template.join('\n'),
            scope: {
                children: '=',
                templateUrl: '@',
                property: '@displayableProperty',
                controller: '@'
            },
            link: function (scope,elm,attrs) {
                scope.etty;
                scope.newModal = newModal;
                scope.removeFromList = removeFromList;
                scope.getFromModal = getFromModal;
                if(!scope.children) throw 'You must provide a list to GumgaOneToMany';
                if(!scope.templateUrl) throw 'You must provide a templateUrl for the modal';
                if(!scope.property) throw 'You must provide a property to display in GumgaOneToMany';
                if(!scope.controller) throw 'You must provide a controller to the modal';

                function getFromModal(selected){
                    if(JSON.stringify(scope.etty) !== '{}'){
                        scope.children.splice(scope.children.indexOf(scope.etty),1,selected);
                    } else {
                        scope.children.push(selected);
                    }
                }

                function removeFromList(obj){
                    scope.children.splice(scope.children.indexOf(obj),1);
                }

                function newModal(obj){
                    scope.etty = {};
                    if(obj){
                        scope.etty= obj;
                    }

                    var modalInstance = $modal.open({
                        templateUrl: scope.templateUrl,
                        controller: scope.controller,
                        resolve: {
                            entity: function(){
                                return scope.etty;
                            }
                        }
                    });

                    modalInstance.result.then(getFromModal);
                }


            }
        }
    }

    return GumgaOneToMany;

})
