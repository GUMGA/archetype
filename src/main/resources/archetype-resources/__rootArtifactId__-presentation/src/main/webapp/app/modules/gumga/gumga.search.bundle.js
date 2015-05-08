/**
 * Created by igorsantana on 06/05/15.
 */
(define(function(require){
    'use strict';
    var angular = require('angular');
    var $ = require('jquery');
    require('gumga-translate');
    return angular.module('gumga.search',['gumga.translate'])
        .directive('gumgaSearch',function GumgaSearch(){
            var template =
                    '<div class="col-md-12" style="padding-left: 0; padding-right: 0;">' +
                    '     <div ng-if="!adv">' +
                    '         <gumga-normal-search></gumga-normal-search>' +
                    '     </div>' +
                    '     <div ng-if="adv">' +
                    '         <gumga-advanced-search></gumga-advanced-search>' +
                    '     </div>' +
                    '</div>'
                ;
            return {
                restrict: 'E',
                template: template,
                transclude: true,
                scope : {
                    advanced: '&advancedMethod',
                    normal: '&searchMethod'
                },
                link: function(scope,elm,attrs,controller,transcludeFn){
                    scope.adv = false;
                    scope.attributes = [];
                    if(attrs.advanced === "true"){
                        scope.adv = true;
                    }
                    scope.getAttributes = function (){
                        transcludeFn(function(clone){
                            angular.forEach(clone,function(cloneEl){
                                if(cloneEl.nodeName == 'ADVANCED-FIELD'){
                                    scope.attributes.push({
                                        name: cloneEl.getAttribute('name'),
                                        type: cloneEl.getAttribute('type')
                                    });
                                }
                            });
                        });
                    };

                    scope.$on('advanced',function(ev,data){
                        scope.advanced({param: data});
                        ev.stopPropagation();
                    });

                    scope.$on('normal',function(ev,data){
                        scope.normal($.extend({},{field: attrs.field},data));
                        ev.stopPropagation();
                    });
                    scope.getAttributes();
                }
            };
        })
        .directive('gumgaNormalSearch',function (){
            var template =
                '<div class="input-group">' +
                '   <input type="text" class="form-control" ng-model="searchField" placeholder="Search"/>' +
                '   <span class="input-group-btn">' +
                '       <button class="my-button btn-primary last" type="button" ng-disabled="!searchField" ng-click="doSearch(searchField)" >Search <span class="glyphicon glyphicon-search"></span></button>' +
                '   </span>' +
                '</div>';
            return {
                restrict: 'E',
                scope: false,
                template: template,
                link: function(scope,elm,attrs){

                    elm.find('input')
                        .bind('keypress',function(ev){
                            if(ev.keyCode == 13 && scope.searchField.length > 0){
                                scope.$emit('normal',{param: scope.searchField});
                            }
                        });

                    scope.doSearch = function(txt){
                        scope.$emit('normal',{param: txt});
                    };

                }
            };
        })
        .directive('gumgaAdvancedSearch',["GumgaSearchHelper", function (GumgaSearchHelper){
            var template =
                '   <div class="input-group">' +
                '       <input type="text" ng-model="searchInputText" class="form-control" ng-disabled="isPanelOpen"/> ' +
                '       <span class="input-group-btn">' +
                '           <button class="my-button btn-default" type="button" ng-click="isPanelOpen = !isPanelOpen"><span class="glyphicon glyphicon-filter"></span>' +
                '           <button class="my-button btn-primary last" type="button" ng-disabled="isPanelOpen" ng-click="doSearch(searchInputText)">Search <span class="glyphicon glyphicon-search"></span>' +
                '       </span>' +
                '   </div>' +
                '   <div class="panel-advanced" ng-show="isPanelOpen">' +
                '       <div class="panel-body">' +
                '           <div class="col-md-3">' +
                '           <h3 style="margin-top: 0;margin-bottom: 0"><small>Advanced Search</small></h3>' +
                '           </div>' +
                '           <div class="form-inline col-md-9">' +
                '               <div class="correct-form-group">' +
                '                   <div class="list-holder">' +
                '                           <ul class="list-selectable" ng-show="selectAttribute">\n' +
                '                               <li ng-repeat="attr in attributes" ng-click="attributeHasChanged(attr)" class="hover-list"><button class="btn btn-link">{{attr.name}}</button></li>\n' +
                '                           </ul>\n' +
                '                       </div>' +
                '                       <button type=button class="btn btn-default" ng-click="selectAttribute = !selectAttribute">{{query.attribute.name || \'Attribute\'}}<span class="caret"></span></button>' +
                '                      <div class="list-holder">' +
                '                           <ul class="list-selectable" ng-show="selectHQL">\n' +
                '                               <li ng-repeat="opt in hqlOpts" class="hover-list" ng-click="handleHqlOption(opt)"><button class="btn btn-link" >{{opt.label}}</button></li>\n' +
                '                           </ul>\n' +
                '                       </div>' +
                '                    <button type="button" class="btn btn-default" ng-click="selectHQL = !selectHQL"> {{ query.hql.label || \'HQL\'  }} <span class="caret"></span></button>  '+
                '                   <input type="{{typeInput}}" class="form-control col-x-3" ng-model="query.value" id="selectableAdvancedValue"/>' +
                '                   <button type="button" class="btn btn-default" ng-click="addQuery(query)" ng-disabled="query.value.length > 0 ? false : true"><span class="glyphicon glyphicon-plus"></span></button>' +
                '               </div>' +
                '           </div>' +
                '       </div>'+
                '           <hr/>' +
                '       <div class="col-md-12" style="padding-bottom: 2%">' +
                '       <gumga-advanced-label ng-repeat="query in queries" attr="{{query.attribute.name}}" hql="{{query.hql.label}}" value="query.value" index="$index" style="margin-right: 1%"></gumga-advanced-label>' +
                '       <div class="col-md-12" style="margin-top: 1%;">' +
                '       <button class="btn btn-primary pull-right" type="button" ng-disabled="queries.length == 0" ng-click="showArray(queries)">Advanced Search<span class="glyphicon glyphicon-search"></span>' +
                '       </div>' +
                '       </div>' +
                '       <div class="clearfix" style="margin-bottom: 2%"></div>' +
                '   </div>';
            return {
                restrict: 'E',
                template: template,
                scope: false,
                require: '^?gumgaSearch',
                link: function(scope,elm,attrs,ctrl){
                    scope.isPanelOpen = false;
                    scope.selectHQL = false;
                    scope.$watch('isPanelOpen',function(){
                        if(scope.isPanelOpen === true){
                            scope.selectAttribute = true;
                        } else {
                            scope.queries = [];
                        }
                        scope.query = {};
                    });
                    scope.attributes = scope.$parent.attributes;
                    scope.hqlOpts = [];
                    scope.queries = [];

                    scope.attributeHasChanged = function(attribute) {
                        scope.query.attribute = attribute;
                        if(attribute.type === 'date'){
                            scope.typeInput = 'date';
                        } else {
                            scope.typeInput = 'text';
                        }
                        scope.hqlOpts = GumgaSearchHelper.getTypeListOfHQLPossibilities(attribute.type);
                        scope.selectHQL = true ;
                        scope.selectAttribute = false;
                    };

                    scope.handleHqlOption = function(hq){
                        scope.query.hql = hq;
                        document.getElementById('selectableAdvancedValue').focus();
                        scope.selectHQL = false;
                    };

                    document.getElementById('selectableAdvancedValue')
                        .addEventListener('keydown',function(ev){
                            if(ev.keyCode == 13 && ev.target.value.length > 0){
                                scope.addQuery(scope.query);
                            }
                            scope.$apply();
                        });

                    scope.addQuery = function(query){
                        if(scope.queries.length === 0){
                            scope.queries.push(query);
                        } else if(scope.queries.length >= 1){
                            scope.queries.splice(scope.queries.length,1,{value: 'AND'},query);
                        }
                        scope.query = {};
                        scope.typeInput = 'text';
                    };

                    scope.$on('deletepls',function(ev,data){
                        scope.queries.splice(data,1);
                    });

                    scope.showArray = function(array){
                        scope.isPanelOpen = false;
                        scope.$emit('advanced',GumgaSearchHelper.translateArrayToHQL(array));
                    };

                    scope.doSearch = function(txt){
                        scope.$emit('normal',{param: txt});
                    };
                }
            };
        }])
        .directive('gumgaAdvancedLabel',function (){
            var template =
                '<div class="btn-group">' +
                '   <button class="btn btn-default btn-xs" id="btn{{attr}}" ng-click="orOrAnd(value)"><strong>{{attr}}</strong> {{hql}} <strong>{{value}}</strong></button>' +
                '   <button class="btn btn-default btn-xs" ng-click="emitDelete()" ng-if="getVisibility(value)"><span aria-hidden="true">&times;</span></button>' +
                '</div>';


            return {
                restrict: 'E',
                template: template,
                scope: {
                    attr: '@',
                    hql: '@',
                    value: '=',
                    index: '='
                },
                link: function(scope,$elm,$attrs){
                    scope.bol = false;

                    scope.orOrAnd = function(){

                        if(typeof scope.value === 'string' && scope.value.toUpperCase() === 'OR' && !scope.hql){
                            scope.value = 'AND';
                        }   else  if(scope.value.toUpperCase() === 'AND' && !scope.hql){
                            scope.value = 'OR';
                        }
                    };

                    scope.emitDelete = function(){
                        scope.$emit('deletepls',scope.index);
                    };


                    scope.getVisibility = function(val){
                        return !(val == 'AND' || val == 'OR');
                    }
                }
            };
        })
        .factory('GumgaSearchHelper',function (){
            var types ={
                "string": {
                    "HQLPossibilities": [
                        {hql:"eq",label: "igual" , before: "='",after:"'"},
                        {hql:"ne",label: "diferente de" , before: "\!='",after:"'"},
                        {hql: "contains",label: "contém" , before: " like '\%",after:"\%'"},
                        {hql: "not_contains",label:"não contém" , before: " not like '\%",after:"\%'"},
                        {hql: "starts_with",label:"começa com" , before: " like '",after:"\%'"},
                        {hql: "ends_with",label: "termina com" , before: " like '\%",after:"'"},
                        {hql: "ge",label:"maior igual" , before: ">='",after:"'"},
                        {hql: "le",label: "menor igual" , before: "<='",after:"'"}],
                    "validation":function(string){
                        return string.length > 0 && angular.isString(string);
                    }
                },
                "number": {
                    "HQLPossibilities": [
                        {hql:"eq",label: "igual", before: "=",after:""},
                        {hql:"ne",label: "diferente de", before: "!=",after:""},
                        {hql: "gt",label:"maior que", before: ">",after:""},
                        {hql: "ge",label:"maior igual", before: ">=",after:""},
                        {hql: "lt",label:"menor que", before: "<",after:""},
                        {hql: "le",label:"maior igual", before: "<=",after:""}],
                    "validation":function(int){
                        return angular.isNumber(int);
                    }
                },
                "money": {
                    "HQLPossibilities": [
                        {hql:"eq",label: "igual", before: "=",after:""},
                        {hql:"ne",label: "diferente de", before: "!=",after:""},
                        {hql: "gt",label:"maior que", before: ">",after:""},
                        {hql: "ge",label:"maior igual", before: ">=",after:""},
                        {hql: "lt",label:"menor que", before: "<",after:""},
                        {hql: "le",label:"maior igual", before: "<=",after:""}],
                    "validation":function(money){
                        return angular.isNumber(money);
                    }
                },
                "boolean": {
                    "HQLPossibilities": [{hql:"eq",label: "igual" , before: "='",after:"'"}],
                    "validation":function(bool){
                        return bool === true || bool === false;
                    }
                },
                "date": {
                    "HQLPossibilities": [
                        {hql:"eq",label: "igual" , before: "='",after:"'"},
                        {hql: "ge",label:"maior igual" , before: ">='",after:"'"},
                        {hql: "le",label: "menor igual" , before: "<='",after:"'"}],
                    "validation":function(date){
                        return angular.isDate(date) && (date < new Date(2100,0,1) || date > new Date(1900,0,1));
                    }
                }
            };

            return {
                getTypeListOfHQLPossibilities: function(type){
                    if(angular.isDefined(types[type]))
                        return types[type].HQLPossibilities;
                    throw 'Type doesn\'t exist';
                },
                translateArrayToHQL: function(array){
                    return array
                        .map(function(element) {
                            return (
                            (angular.isDefined(element.attribute) ? 'obj.' + element.attribute.name : '!')
                            + '' +
                            (angular.isDefined(element.hql) ? element.hql.before : ' !')
                            + '' +
                            element.value
                            + (angular.isDefined(element.hql) ? element.hql.after : ' !') );
                        }).map(function(element){
                            if(element.indexOf('!') != -1){
                                return element.replace(/!/g,'');
                            }
                            return element;
                        }).join("");
                }
            };
        });
}));