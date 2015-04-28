/**
 * Created by igorsantana on 28/04/15.
 */
define([],function(){

    GumgaTranslate.$inject = ['$http','GumgaTranslateHelper'];
    var ch = 0;
    // ui.router executa duas vezes a directive
    function GumgaTranslate($http,GumgaTranslateHelper){
        return {
            restrict: 'AEC',
            scope: false,
            link: function($scope,$elm,$attrs){
                if(ch == 0){
                    var language = $attrs.gumgaTranslate.toLowerCase() || navigator.language.toLowerCase();
                    if(!GumgaTranslateHelper.getSessionStorageItem(language)){
                        $http.get('./i18n/' + language + '.json')
                            .success(function(values){
                                GumgaTranslateHelper.setTranslators(language,values);
                            })
                    }
                }
                ch++;
            }
        }
    }
    return GumgaTranslate;


});