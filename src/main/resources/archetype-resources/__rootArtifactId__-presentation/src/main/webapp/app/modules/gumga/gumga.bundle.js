/**
 * Created by igorsantana on 28/05/15.
 */
define([
    'angular',
    'mousetrap',
    'angular-ui-bootstrap',
    'angular-ui-router',
    'angular-locale',
    "gumga-translate",
    "gumga-search",
    "gumga-association",
    "gumga-controllers",
    "gumga-directives",
    "gumga-services",
    "gumga-validators"
],function(angular,Keyboard){
    angular.module('gumga.core',
        [
            'ui.bootstrap',
            'ui.router',
            'ngLocale',
            'gumga.translate',
            'gumga.search',
            'gumga.associations',
            'gumga.controllers',
            'gumga.directives',
            'gumga.services',
            'gumga.validators'
        ])
        .run(function ($state, $rootScope) {
            Keyboard.bind('a s', function (e) {
                e.preventDefault();
                if ($state.current.name.split('.')[1] == 'list') {
                    $rootScope.$broadcast('showPanel');
                }
            });
            Keyboard.bind('ins', function (e) {
                e.preventDefault();
                $state.go($state.current.name.split('.')[0] + '.insert');
            });
            Keyboard.bind('del', function (e) {
                e.preventDefault();
                if (document.querySelector('gumga-table') && e.defaultPrevented) {
                    $rootScope.$broadcast('_del');
                }
            });
            Keyboard.bind('ctrl+l', function (e) {
                e.preventDefault();
                if (document.querySelector('gumga-table') && e.defaultPrevented) {
                    $rootScope.$broadcast('_clean');
                }
            });
            Keyboard.bind('ctrl+enter', function (e) {
                e.preventDefault();
                if (document.querySelector('gumga-search') && e.defaultPrevented) {
                    $rootScope.$broadcast('_doSearch');
                }
            });
            Keyboard.bind('shift+f', function (e) {
                e.preventDefault();
                if (document.querySelector('gumga-search') && e.defaultPrevented) {
                    $rootScope.$broadcast('_focus');
                }
            })
        })
        .directive('secOneToMany',function($compile,returnTemplate,$timeout){
            return {
                restrict: 'E',
                transclude: true,
                scope: false,
                link:function($scope,$element,$attrs,$ctrl,$transcludeFn){
                    $scope.insider = '';
                    $scope._list = $scope[$attrs.list];
                    
                    $transcludeFn(function(elm){
                        for(var key in elm) if(elm.hasOwnProperty(key) && elm[key].nodeName && elm[key].nodeName != "#text"){
                            $scope.insider = elm[key].innerHTML;
                        }
                    });
                    $scope.btnFree = true;
                    
                    $scope.$watch('_list',function(){
                        console.log($scope._list);
                    })


                    var template =
                        '<div>' +
                        '   <label><strong><small>{{_list.length}} {{_list.length > 1 || _list.length == 0 ? \'Especificações cadastradas\' : \'Especificação cadastrada\'}}</small></strong></label>'+
                        '   <ul class="list-group">' +
                        '       <li ng-repeat="$value in _list" class="list-group-item">'+ $scope.insider +'</li>' +
                        '   </ul>' +
                        '</div>';
                    $element.append($compile(template)($scope));
                }
            }
        })
        .controller('MultiEntityController',function MultiEntityController(SearchPromise) {
            var multi = this;
            multi.search = SearchPromise.data;
        })
});
