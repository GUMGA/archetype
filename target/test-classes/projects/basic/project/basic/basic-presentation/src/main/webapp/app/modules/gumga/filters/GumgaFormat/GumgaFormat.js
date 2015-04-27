/**
 * Created by igorsantana on 23/04/15.
 */
define([],function(){

    GumgaFormat.$inject = [];

    function GumgaFormat(){
        return function(txt){
            if(angular.isDefined(txt)){
                var auxTxt;
                auxTxt = txt.split('');
                console.log(auxTxt);
            }
            return txt;
        }
    }

    return GumgaFormat;

});