define(function(){

    var conditionMap = {
        'gt' : '>',
        'ge' : '>=',
        'lt' : '<',
        'le' : '<=',
        'eq' : '=',
        'ne' : '!=',
        'in' : 'in',
        'not_in' : 'not in',
        'contains' : 'like',
        'starts_with' : 'like',
        'ends_with' : 'like',
        'not_contains' : 'not like'
    };

    function formatString(value, condition) {

        // SE for in, ou not_in, não converte pra minusculo
        if (condition != 'in' && condition != 'not_in') {
            value = value.toLowerCase();
        }

        if (condition == 'contains' || condition == 'not_contains') {
            return "'%"+value+"%'";
        }
        if (condition == 'starts_with') {
            return "'"+value+"%'";
        }
        if (condition == 'ends_with') {
            return "'%"+value+"'";
        }
        return "'"+value+"'";
    }

    function formatValue(value, condition) {
        if (angular.isString(value)) {
            return formatString(value, condition);
        }
        return value;
    }

    function handleValue(filter) {
        if (angular.isArray(filter.value)) {
            var result = [];
            for (var i=0;i<filter.value.length;i++) {
                result.push(formatValue(filter.value[i], filter.condition));
            }
            return "("+result.join(', ')+")";
        }
        return formatValue(filter.value, filter.condition);
    }

    function handleProperty(filter) {
        if (angular.isString(filter.value)) {
            return "lower(obj."+filter.field+")";
        } else {
            return "obj."+filter.field;
        }

    }

    return function() {

        this.export = function(filters) {
            if (!filters || !filters.length)
                return "1=1";

            var result = [];

            for (var i=0; i < filters.length; i++) {
                var filter = filters[i];
                if (i > 0) {
                    result.push(filter.logicalOp.toLowerCase());
                }

                result.push(handleProperty(filter));
                result.push(conditionMap[filter.condition]);
                result.push(handleValue(filter));
            }

            return result.join(' ');
        };
    };

});