/**
 * Created by igorsantana on 06/05/15.
 */
define(function (require) {
    'use strict';
    var ch = 0;
    var angular = require('angular');
    return angular.module('gumga.translate', [])
            .directive('gumgaTranslate', ["$http", "GumgaTranslateHelper", function ($http, GumgaTranslateHelper) {
                    return {
                        restrict: 'AEC',
                        scope: false,
                        link: function ($scope, $elm, $attrs) {
                            if (ch === 0) {
                                var language = $attrs.gumgaTranslate.toLowerCase() || navigator.language.toLowerCase();
                                $http.get('./i18n/' + language + '.json')
                                        .success(function (values) {
                                            GumgaTranslateHelper.setTranslators(language, values);
                                        });
                            }
                            ch++;
                        }
                    };
                }])
            .directive('gumgaTranslateTag', ["GumgaTranslateHelper", "$compile", function (GumgaTranslateHelper, $compile) {
                    var child;
                    return {
                        restrict: 'A',
                        scope: {
                            gumgaTranslateTag: '@'
                        },
                        link: function (scope, elm, attrs) {
                            if (GumgaTranslateHelper.returnTranslation(scope.gumgaTranslateTag.split('.'))) {
                                if (elm[0].childNodes.length > 1) {
                                    scope.child = elm[0].childNodes[1];
                                    elm[0].innerHTML = GumgaTranslateHelper.returnTranslation(scope.gumgaTranslateTag.split('.'));
                                    elm.append($compile(scope.child)(scope));
                                } else {
                                    if (GumgaTranslateHelper.returnTranslation(scope.gumgaTranslateTag.split('.')) === -1) {
                                        if(scope.gumgaTranslateTag.split('.')[0].toUpperCase() === 'welcome'.toUpperCase()){
                                            elm[0].innerHTML = 'Página Principal';
                                        }
                                    } else {
                                        elm[0].innerHTML = GumgaTranslateHelper.returnTranslation(scope.gumgaTranslateTag.split('.'));
                                    }
                                }
                            }
                        }

                    };
                }])
            .factory('GumgaTranslateHelper', function () {
                return {
                    translators: {},
                    setTranslators: function (language, obj) {
                        this.translators = obj;
                    },
                    returnTranslation: function (array) {
                        try {
                            return this.translators[array[0].toLowerCase()][array[1].toLowerCase()];
                        } catch (e) {
                            return -1;
                        }
                    }
                };
            });
});
