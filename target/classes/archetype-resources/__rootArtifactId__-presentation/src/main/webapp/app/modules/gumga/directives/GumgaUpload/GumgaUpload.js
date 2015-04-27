/**
 * Created by igorsantana on 23/04/15.
 */
define([],function(){

    GumgaUpload.$inject = ['$http','$parse'];

    function GumgaUpload($http,$parse){
        return {
            restrict: 'A',
            link:function(scope,elm,attrs){
                var model = $parse(attrs.ngModel);
                var modelSetter = model.assign;

                elm.bind('change',function(){
                    scope.$apply(function(){
                        if(attrs.multiple){
                            var arr = [];
                            for(var i = 0,len = elm[0].files.length;i < len;i++){
                                arr.push(elm[0].files[i]);
                            }
                            modelSetter(scope,arr);
                        } else {
                            modelSetter(scope,elm[0].files[0]);
                        }
                    })
                })
            }
        }
    }

    return GumgaUpload;
});