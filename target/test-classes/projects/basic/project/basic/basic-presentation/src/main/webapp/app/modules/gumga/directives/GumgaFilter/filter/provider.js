define(function(){

    function customValidation() {
        return true;
    }

    return function() {

        var types = {};

        this.type = function(name, configuration) {

            configuration.validate = configuration.validate || customValidation;

            types[name] = configuration;

            return this;
        };

        this.$get = function() {
            return {
                type : function(name) {
                    return types[name];
                }
            };
        };
    };
});