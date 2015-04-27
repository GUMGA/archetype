define(function() {
    return function() {

        return  {
            "restrict" : 'E',
            "require" : '^gumgaFilterItem',
            "link" : function($scope, $element, $attrs, controller) {
                controller.field.options = controller.field.options || [];
                controller.field.options.push({
                    'value' : $attrs.value,
                    'label' : $attrs.label
                });
            }
        };
    };
});