
/**
 * Created by igorsantana on 29/04/15.
 */
(define(function(require){
    'use strict';
    var angular = require('angular');
    require('gumga-translate');

    return angular.module('gumga.search',['gumga.translate'])
        .directive('gumgaSearch',function GumgaSearch(){
            var template =
                    '<div class="full-width-without-padding">' +
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
                    normal: '&searchMethod',
            onSearch: '&',
            onAdvancedSearch: '&'
                },
                link: function(scope,elm,attrs,controller,transcludeFn){
                    scope.adv = false;
                    scope.attributes = [];
                    scope.normalFields = attrs.fields.split(',');
                    scope.entityToTranslate = attrs.translateEntity;
                    var eventHandler = {
                    search: attrs.onSearch ? scope.onSearch : angular.noop,
                    advanced: attrs.onAdvancedSearch ? scope.onAdvancedSearch : angular.noop
                    }
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
                         eventHandler.search();
                        //ev.stopPropagation() || angular.noop;
                    });

                    scope.$on('normal',function(ev,data){
                        scope.normal({field: data.field,param: data.param});
                         eventHandler.advanced()
                        //ev.stopPropagation() || angular.noop;
                    });

                    scope.getAttributes();
                }
            };
        })
        .directive('gumgaNormalSearch',function GumgaNormalSearch(){
            var template =
                '<div class="input-group">' +
                '   <input type="text" class="form-control" ng-model="searchField" placeholder="Search"/>' +
                '   <span class="input-group-btn">' +
                '       <button class="my-button btn-default" ng-click="showLittlePanel = !showLittlePanel"><span class="glyphicon glyphicon-chevron-down"></span></button>' +
                '       <button class="my-button btn-primary last" type="button" ng-disabled="!searchField" ng-click="doSearch(searchField)" >Search <span class="glyphicon glyphicon-search"></span></button>' +
                '   </span>' +
                '</div>' +
                '<div class="little-panel" ng-show="showLittlePanel">' +
                '   <div class="panel-body">' +
                '       <label ng-repeat="field in normalFields" style="display: block" ><input type="checkbox" ng-model="models[field.value]" style="margin-right: 1%" ><span gumga-translate-tag="{{translate + \'.\' + field.value}}"></span></label>' +
                '   </div>' +
                '</div>';
            return {
                restrict: 'E',
                template: template,
                link: function(scope,elm,attrs){
                    if(!scope.$parent.normalFields.length > 0 || !scope.$parent.entityToTranslate){
                        throw 'Missing some parameters in GumgaSearch';
                    }
                    scope.models = {};
                    scope.searchField = '';
                    scope.translate = scope.$parent.entityToTranslate;
                    scope.normalFields = scope.$parent.normalFields.map(function(elm,$index){
                        scope.models[elm] = false;
                        $index == 0 && (scope.models[elm] = true);
                        return {
                            name: elm.slice(0,1).toUpperCase() + elm.slice(1,elm.length).toLowerCase(),
                            value: elm
                        };
                    });

                    scope.models.returnString = function(){
                        var txt = '';
                        for(var key in this) if(this.hasOwnProperty(key) && key != 'returnString' && this[key]){
                            txt += key + ',';
                        }
                        if(txt.length == 0){
                            return scope.normalFields[0].value;
                        }
                        return txt.slice(0,-1);
                    };

                    elm.find('input')
                        .bind('keypress',function(ev){
                            if(ev.keyCode == 13 && scope.searchField.length > 0){
                                scope.$emit('normal',{field: scope.models.returnString(),param:scope.searchField});
                                if(scope.showLittlePanel){
                                    scope.showLittlePanel = !scope.showLittlePanel;
                                }
                            }
                        });

                    scope.doSearch = function(txt){
                        scope.$emit('normal',{field: scope.models.returnString(),param:txt || ''});
                        scope.showLittlePanel = !scope.showLittlePanel;
                        scope.searchField = '';
                    };

                }
            };
        })
        .directive('gumgaAdvancedSearch',function GumgaAdvancedSearch(GumgaSearchHelper){
            var template =
                '   <div class="input-group">' +
                '       <input type="text" ng-model="searchInputText" class="form-control" ng-disabled="isPanelOpen" id="textMain"/> ' +
                '       <span class="input-group-btn">' +
                '           <button class="my-button btn-default" ng-click="showLittlePanel = !showLittlePanel"><span class="glyphicon glyphicon-chevron-down"></span></button>' +
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
                '               <div class="form-group">' +
                '                   <div class="list-holder">' +
                '                           <ul class="list-selectable" ng-show="selectAttribute">\n' +
                '                               <li ng-repeat="attr in attributes" ng-click="attributeHasChanged(attr)" class="hover-list"><button class="btn btn-link"  gumga-translate-tag="{{translate + \'.\' + attr.name}}"></button></li>\n' +
                '                           </ul>\n' +
                '                       </div>' +
                '                       <button type=button class="btn btn-default" ng-click="selectAttribute = !selectAttribute" >{{query.attribute.name || \'Attribute\'}}<span class="caret"></span></button>' +
                '                      <div class="list-holder">' +
                '                           <ul class="list-selectable" ng-show="selectHQL">\n' +
                '                               <li ng-repeat="opt in hqlOpts" class="hover-list" ng-click="handleHqlOption(opt)"><button class="btn btn-link" >{{opt.label}}</button></li>\n' +
                '                           </ul>\n' +
                '                       </div>' +
                '                    <button type="button" class="btn btn-default" ng-click="selectHQL = !selectHQL"> {{ query.hql.label || \'HQL\'  }} <span class="caret"></span></button>  '+
                '                   <input type="{{typeInput}}" class="form-control col-x-3" ng-model="query.value" id="selectableAdvancedValue" ng-init="input = this"/>' +
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
                '   </div>' +
                '<div class="little-panel" ng-show="showLittlePanel">' +
                '   <div class="panel-body">' +
                '       <label ng-repeat="field in normalFields" style="display: block" ><input type="checkbox" ng-model="models[field.value]" style="margin-right: 1%" ><span gumga-translate-tag="{{translate + \'.\' + field.value}}"></span></label>' +
                '   </div>' +
                '</div>';
            return {
                restrict: 'E',
                template: template,
                scope: false,
                require: '^?gumgaSearch',
                link: function(scope,elm,attrs,ctrl){
                    scope.isPanelOpen = false;
                    scope.selectHQL = false;
                    scope.models = {};
                    scope.searchField = '';
                    scope.translate = scope.$parent.entityToTranslate;

                    scope.$on('_doSearch',function(){
                        if(scope.queries.length != 0){
                            scope.showArray(scope.queries);
                        } else {
                            if(scope.searchInputText){
                                scope.doSearch(scope.searchInputText);
                            }
                        }
                    });

                    scope.$on('_focus',function(){
                        if(scope.isPanelOpen){
                            angular.element(document.getElementById('selectableAdvancedValue')).focus();
                        } else {
                            angular.element(document.getElementById('textMain')).focus();
                        }
                    });



                    if(!scope.$parent.normalFields.length > 0 || !scope.$parent.entityToTranslate){
                        throw 'Missing some parameters in GumgaSearch';
                    }

                    scope.normalFields = scope.$parent.normalFields.map(function(elm,$index){
                        scope.models[elm] = false;
                        $index == 0 && (scope.models[elm] = true);
                        return {
                            name: elm.slice(0,1).toUpperCase() + elm.slice(1,elm.length).toLowerCase(),
                            value: elm
                        };
                    });


                    scope.$on('showPanel',function(){
                        scope.isPanelOpen = !scope.isPanelOpen;
                        scope.$apply();
                    });

                    scope.models.returnString = function(){
                        var txt = '';
                        for(var key in this) if(this.hasOwnProperty(key) && key != 'returnString' && this[key]){
                            txt += key + ',';
                        }
                        if(txt.length == 0){
                            return scope.normalFields[0].value;
                        }
                        return txt.slice(0,-1);
                    };

                    scope.$watch('isPanelOpen',function(){
                        if(scope.isPanelOpen === true){
                            console.log();
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
                        angular.element(document.getElementById('selectableAdvancedValue')).focus();
                        scope.selectHQL = false;
                    };

                    angular.element(document.getElementById('selectableAdvancedValue'))
                        .on('keydown',function(ev){
                            if(ev.keyCode == 13 && ev.target.value.length > 0){
                                scope.addQuery(scope.query);
                            }
                            scope.$apply();
                        });

                    angular.element(document.getElementById('textMain'))
                        .on('keydown',function(ev){
                            if(ev.keyCode == 13 && ev.target.value.length > 0){
                                scope.$emit('normal',{field: scope.models.returnString(),param:scope.searchInputText || ''});
                                if(scope.showLittlePanel){
                                    scope.showLittlePanel = !scope.showLittlePanel;
                                }
                            }
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
                        scope.$emit('normal',{field: scope.models.returnString(),param:txt || ''});
                        scope.searchInputText = '';
                    };
                }
            };
        })
        .directive('gumgaAdvancedLabel',function GumgaAdvancedLabel(){
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
        .factory('GumgaSearchHelper',function GumgaSearchHelper(){
            var types ={
                "string": {
                    "HQLPossibilities": [
                        {hql:"eq",label: "igual" , before: "='",after:"'"},
                        {hql:"ne",label: "diferente de" , before: "!='",after:"'"},
                        {hql: "contains",label: "contém" , before: " like '\%",after:"\%'"},
                        {hql: "not_contains",label:"não contém" , before: " not like '\%",after:"\%'"},
                        {hql: "starts_with",label:"começa com" , before: "like '",after:"\%'"},
                        {hql: "ends_with",label: "termina com" , before: "like '\%",after:"'"},
                        {hql: "ge",label:"maior igual" , before: ">='",after:"'"},
                        {hql: "le",label: "menor igual" , before: "<='",after:"'"}]
                },
                "number": {
                    "HQLPossibilities": [
                        {hql:"eq",label: "igual", before: "=",after:""},
                        {hql:"ne",label: "diferente de", before: "!=",after:""},
                        {hql: "gt",label:"maior que", before: ">",after:""},
                        {hql: "ge",label:"maior igual", before: ">=",after:""},
                        {hql: "lt",label:"menor que", before: "<",after:""},
                        {hql: "le",label:"maior igual", before: "<=",after:""}]
                },
                "money": {
                    "HQLPossibilities": [
                        {hql:"eq",label: "igual", before: "=",after:""},
                        {hql:"ne",label: "diferente de", before: "!=",after:""},
                        {hql: "gt",label:"maior que", before: ">",after:""},
                        {hql: "ge",label:"maior igual", before: ">=",after:""},
                        {hql: "lt",label:"menor que", before: "<",after:""},
                        {hql: "le",label:"maior igual", before: "<=",after:""}]

                },
                "boolean": {
                    "HQLPossibilities": [{hql:"eq",label: "igual" , before: "='",after:"'"}]
                },
                "date": {
                    "HQLPossibilities": [
                        {hql: "eq", label: "igual", before: "='", after: "'"},
                        {hql: "ge", label: "maior igual", before: ">='", after: "'"},
                        {hql: "le", label: "menor igual", before: "<='", after: "'"}]
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
