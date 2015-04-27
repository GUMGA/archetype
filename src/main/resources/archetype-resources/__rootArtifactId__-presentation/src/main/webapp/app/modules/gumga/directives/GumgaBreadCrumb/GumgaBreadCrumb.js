/**
 * Created by igorsantana on 23/04/15.
 */
define([],function(){

    GumgaBreadCrumb.$inject = ['GumgaUtils','$timeout','$rootScope'];

    function GumgaBreadCrumb(GumgaUtils,$timeout,$rootScope){
        var template = [
            '<ol class="breadcrumb">',
            '<li ng-repeat="bread in breadcrumbs"><a ui-sref="{{bread.state}}">{{bread.state}}</a></li>',
            '</ol>'
        ];
        return {
            restrict: 'E',
            template: template.join('\n'),
            replace: true,
            link: function($scope, $elm, $attrs){
                $scope.$on('breadChanged',function(){
                    $scope.breadcrumbs = $rootScope.breadcrumbs;
                })
            }
        }
    }

    return GumgaBreadCrumb;

});