/**
 * Created by igorsantana on 3/12/15.
 */
 define([], function () {


    GumgaErrors.$inject = ['GumgaUtils'];

    function GumgaErrors(GumgaUtils) {
        return {
            restrict: 'E',
            scope: {},
            require: '^form',
            template: '<ul><li ng-repeat="err in errs track by $index" class="text-danger">{{err.message}}</li></ul>',
            link: function (scope, elm, attrs) {
                scope.errs = [];
                var input = $('input[name="' + attrs.name + '"]');

                function addAndRemoveClass(_bool){
                    if(_bool){
                        input.hasClass('success') && input.removeClass('success');
                        input.addClass('error');
                    } else {
                        input.hasClass('error') && input.removeClass('error');
                        if (scope.errs.length < 1)
                            input.addClass('success');
                    }
                }

                function updateMessages(obj,msg) {
                    if (!obj.status && !GumgaUtils.objInArray(scope.errs, obj.field)) {
                        scope.errs.push({message: msg, field: obj.field});
                        addAndRemoveClass(true);
                    }else if(obj.status && GumgaUtils.objInArray(scope.errs, obj.field)){
                        scope.errs.splice(GumgaUtils.checkIndex(scope.errs, obj.field), 1);
                        addAndRemoveClass(false);   
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
                    }
                    updateMessages(obj,message);
                })
            }
        };
    }

    return GumgaErrors;

});