/**
 * Created by igorsantana on 06/05/15.
 */
define(function (require) {
    'use strict';
    var ch = 0;
    var angular = require('angular');
    return angular.module('gumga.translate', [])
            .directive('gumgaTranslate', function ($http,GumgaTranslateHelper){
        var ch = 0;
        return {
            restrict: 'AEC',
            scope: false,
            link: function($scope,$elm,$attrs){
                if(ch === 0){
                    var language = $attrs.gumgaTranslate.toLowerCase() || navigator.language.toLowerCase();
                    if(!GumgaTranslateHelper.getSessionStorageItem(language)){
                        $http.get('./i18n/' + language + '.json')
                            .success(function(values){
                                GumgaTranslateHelper.setTranslators(language,values);
                            });
                    }
                }
                ch++;
            }
        };
    })
            .directive('gumgaTranslateTag', function (GumgaTranslateHelper,$compile){
        var child;
        return {
            restrict: 'A',
            scope: {
                gumgaTranslateTag: '@'
            },
            link: function(scope,elm,attrs){
                if(GumgaTranslateHelper.returnTranslation(scope.gumgaTranslateTag.split('.'))){
                    if(elm[0].childNodes.length > 1){
                        scope.child = elm[0].childNodes[1];
                        elm[0].innerHTML =  GumgaTranslateHelper.returnTranslation(scope.gumgaTranslateTag.split('.'));
                        elm.append($compile(scope.child)(scope));
                    } else {
                        elm[0].innerHTML = GumgaTranslateHelper.returnTranslation(scope.gumgaTranslateTag.split('.'));
                    }
                }
            }

        };
    })
            .factory('GumgaTranslateHelper', function (){
        return {
            getSessionStorageItem: function(key){
                var g = window.sessionStorage.getItem(key);
                if(!g){
                    return null;
                }
                try {
                    angular.fromJson(g);
                }catch(e){
                    return g;
                }
                this.translators = angular.fromJson(angular.fromJson(g));
                return angular.fromJson(angular.fromJson(g));
            },
            translators: {},
            setTranslators: function(language,obj){
                this.translators = obj;
                this.setSessionStorageItem(language,JSON.stringify(obj));
            },
            setSessionStorageItem: function(key,value){
                window.sessionStorage.setItem(key,angular.toJson(value));
            },
            returnTranslation: function(array){
                try {
                    return this.translators[array[0].toLowerCase()][array[1].toLowerCase()];
                } catch(e){

                }
            }
        };
    });
});
