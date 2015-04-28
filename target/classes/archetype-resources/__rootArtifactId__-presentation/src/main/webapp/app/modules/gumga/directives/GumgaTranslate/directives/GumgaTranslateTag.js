/**
 * Created by igorsantana on 28/04/15.
 */
define(function(require){
    GumgaTranslateTag.$inject = ['GumgaTranslateHelper'];

    function GumgaTranslateTag(GumgaTranslateHelper){
        return {
            restrict: 'A',
            scope: {
                gumgaTranslateTag: '@'
            },
            link: function(scope,elm,attrs){
                if(GumgaTranslateHelper.returnTranslation(scope.gumgaTranslateTag.split('.'))){
                    elm[0].innerText = GumgaTranslateHelper.returnTranslation(scope.gumgaTranslateTag.split('.'));
                }


            }
        }
    }
    return GumgaTranslateTag;
});