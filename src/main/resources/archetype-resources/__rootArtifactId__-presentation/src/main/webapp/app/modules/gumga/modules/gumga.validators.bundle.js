/**
 * Created by igorsantana on 28/05/15.
 */
define(function(require){

    var angular = require('angular');
    require ('gumga-services');
    angular.module('gumga.validators',['gumga.services'])
        .directive('gumgaErrors',function GumgaErrors(GumgaUtils) {
            return {
                restrict: 'E',
                scope: {},
                require: '^form',
                template: '<div class="full-width-without-padding"><ul><li ng-repeat="err in errs track by $index" class="text-danger">{{err.message}}</li></ul></div>',
                link: function (scope, elm, attrs) {
                    scope.errs = [];

                    var tags = document.getElementsByName(attrs.name);
                    var input;
                    for(var i = 0, len = tags.length;i < len; i++){
                        if(tags[i].nodeName !== 'GUMGA-ERRORS'){
                            input = angular.element(tags[i]);
                            break;
                        }
                    }

                    function changeClass(){
                        if(scope.errs.length > 0 ){
                            if(input.hasClass('success')) input.removeClass('success');
                            input.addClass('error');
                        } else {
                            if(input.hasClass('error')) input.removeClass('error');
                            input.addClass('success')
                        }
                    }

                    function updateMessages(obj,msg) {
                        if (!obj.status && !GumgaUtils.objInArray(scope.errs, obj.field)) {
                            scope.errs.push({message: msg, field: obj.field});
                            changeClass();
                        }else if(obj.status && GumgaUtils.objInArray(scope.errs, obj.field)){
                            scope.errs.splice(GumgaUtils.checkIndex(scope.errs, obj.field), 1);
                            changeClass();
                        }
                    }

                    scope.$on('gumgaError',function(ev,obj){
                        var message;
                        if (obj.name === attrs.name) {
                            switch(obj.field){
                                case 'req':
                                    message = GumgaUtils.errorMessages.req;
                                    break;
                                case 'max':
                                    message = GumgaUtils.errorMessages.max;
                                    break;
                                case 'min':
                                    message = GumgaUtils.errorMessages.min;
                            }
                            updateMessages(obj,message);
                        }
                    });
                }
            };
        })
        .directive('gumgaMin',function GumgaMin(GumgaBroadcaster,$timeout) {
            return {
                restrict: 'A',
                require: 'ngModel',
                priority: 10,
                link: function (scope, elm, attrs, ctrl) {

                    function emit(bool){
                        GumgaBroadcaster.emitError({name: attrs.name, status: bool, field: 'min'});
                        ctrl.$setValidity('min', bool);
                    }

                    $timeout(function(){
                        if(!ctrl.$modelValue){
                            emit(false);
                        } else {
                            emit(true);
                        }
                    },20);

                    ctrl.$parsers.push(function (txt) {
                        switch(elm[0].type){
                            case 'text':
                                emit(txt.length >= parseInt(attrs.gumgaMin));
                                break;
                            case 'number':
                                emit(parseInt(txt) >= parseInt(attrs.gumgaMin));
                                break;
                            case 'date':
                                emit(new Date(txt) >= new Date(attrs.gumgaMin));
                                break;
                            case 'time':
                            case 'select-one':
                            case 'datetime-local':
                            case 'color':
                            case 'email':
                            case 'url':
                            default:
                                emit(txt != undefined);
                                break;
                        }
                        return txt;
                    });
                }
            };
        })
        .directive('gumgaMax',function GumgaMax(GumgaBroadcaster, $timeout) {
            return {
                restrict: 'A',
                require: 'ngModel',
                priority: 10,
                link: function (scope, elm, attrs, ctrl) {

                    function emit(boolean){
                        GumgaBroadcaster.emitError({name: attrs.name, status: boolean, field: 'max'});
                        ctrl.$setValidity('max', boolean);
                    }



                    ctrl.$parsers.push(function (txt) {
                        switch(elm[0].type){
                            case 'text':
                                emit(txt.length <= parseInt(attrs.gumgaMax));
                                break;
                            case 'number':
                                emit(parseInt(txt) <= parseInt(attrs.gumgaMax));
                                break;
                            case 'date':
                                emit(new Date(txt) <= new Date(attrs.gumgaMax));
                                break;
                            case 'time':
                            case 'select-one':
                            case 'datetime-local':
                            case 'color':
                            case 'email':
                            case 'url':
                            default:
                                break;
                        }
                        return txt;
                    });
                }
            };
        })
        .directive('gumgaRequired',function GumgaRequired(GumgaBroadcaster, $timeout) {
            return {
                restrict: 'A',
                require: 'ngModel',
                scope: false,
                link: function (scope, elm, attrs, ctrl) {
                    if(!attrs.name){
                        throw 'You must pass a name to the input that contains GumgaRequired';
                    }

                    function doThings(bool){
                        ctrl.$setValidity('required', bool) ;
                        GumgaBroadcaster.emitError({name: attrs.name,status: bool, field: 'req'});
                    }

                    $timeout(function () {
                        if(!ctrl.$modelValue){
                            if(elm[0].type == 'color'){
                                doThings(true);
                            } else {
                                doThings(false);
                            }
                        } else {
                            doThings(true);
                        }
                    }, 20);



                    ctrl.$parsers.push(function (txt) {
                        switch(elm[0].type){
                            case undefined:
                                break;
                            case 'text':
                                doThings(txt != '');
                                break;
                            case 'number':
                                doThings(txt != null);
                                break;
                            case 'select-one':
                            case 'date':
                            case 'datetime-local':
                            case 'color':
                            case 'email':
                            case 'time':
                            case 'url':
                            default:
                                doThings(txt != undefined);
                                break;
                        }
                        return txt;
                    });
                }
            };
        })
});