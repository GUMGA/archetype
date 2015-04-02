define(['angular'],function(angular) {


    var CustomTypeDirective = function(GumgaFilter) {


        var regexValidation = function(regex) {
            return function(value) {
                return regex.test(value);
            };
        };

        var controller = function() {

        };

        var link = function($scope, $element, $attrs, controllers , $transclude) {

            var gumgaFilterController = controllers[0];
            var controller = controllers[1];

            var typeConfiguration = angular.copy(GumgaFilter.type($attrs.type || "string"));

            controller.field = $.extend({}, typeConfiguration, {
                'name' : $attrs.field,
                'label' : $attrs.label
            });

            if (controller.field.configuration) {
                for (var conf in $attrs) {
                    if (controller.field.configuration.hasOwnProperty(conf)) {
                        controller.field.configuration[conf] = $attrs[conf];
                    }
                }
            }

            $transclude($scope, $.noop);

            // Verifica se tem validação via regex
            if ($attrs.regex) {
                controller.field.validate = regexValidation(new RegExp($attrs.regex));
            }

            // Adiciona
            gumgaFilterController.add(controller.field);

        };


        return  {
            "restrict" : 'E',
            "require" : ['^gumgaFilter', 'gumgaFilterItem'],
            "link" : link,
            "transclude" : "element",
            "controller" : controller
        };
    };


    CustomTypeDirective.$inject = ['GumgaFilter'];
    return CustomTypeDirective;
});