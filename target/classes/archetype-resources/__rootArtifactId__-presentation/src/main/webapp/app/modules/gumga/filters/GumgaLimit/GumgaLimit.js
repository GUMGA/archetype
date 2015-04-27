/**
 * Created by igorsantana on 3/13/15.
 */
define([], function () {

    GumgaLimit.$inject = [];

    function GumgaLimit() {
        return function (text, limit, afterText) {
            var result;
            if (!angular.isUndefined(text, limit, afterText)) {
                if (text.length >= limit) {
                    result = text.split('');
                    result.splice(limit, result.length - 1);
                    result.push(afterText);
                    result = result.join('');
                } else {
                    result = text;
                }
            }
            return result;
        };
    }

    return GumgaLimit;

});