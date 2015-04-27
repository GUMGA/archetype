define([], function(){
    GumgaImage.$inject = ['$compile'];
    function GumgaImage($compile){
        var template = '<div class="row">'
        template += '<div class="col-md-12">'
        template += '<div class="{{positionClass}}" style="height:{{height}}; width:{{width}};">'
        template += '<img src="{{src}}" class="responsive-img img-{{border}}">'
        template += '</div>'
        template += '</div>'
        template += '</div>'
        return {
            template: template,
            restrict: 'E',
            scope: {},
            link: function(scope, el, attrs) {
                scope.positionClass = attrs.position;

                if(scope.positionClass == 'center'){
                    scope.positionClass = 'center-block';
                }else if(scope.positionClass == 'right'){
                    scope.positionClass = 'pull-right';
                }else if(scope.positionClass == 'left'){
                    scope.positionClass = 'pull-left';
                }
                scope.height = attrs.height+'px';
                if(!scope.height){
                    scope.height = 'auto';
                }
                scope.width = attrs.width+'px';
                if(!scope.width){
                    scope.width = 'auto';
                }
                scope.src = attrs.src;
                scope.border = attrs.borderType
            }

        }
    };
    return GumgaImage;
})