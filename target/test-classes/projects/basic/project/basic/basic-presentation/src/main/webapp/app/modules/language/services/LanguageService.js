define([], function () {

    Language.$inject = ['$q', '$http', '$translate'];

    function Language($q, $http, $translate) {
        var factory = {
            languages: ['pt-br', 'en-us'],
            getCurrent: function () {
                var deferred = $q.defer();
                var language = $translate.storage().get('NG_TRANSLATE_LANG_KEY');

                if (angular.isUndefined(language)) {
                    language = 'pt-br';
                }

                deferred.resolve(language);
                return deferred.promise;
            },
            getAll: function () {
                var deferred = $q.defer();
                deferred.resolve(this.languages);
                return deferred.promise;
            }
        };
        return factory;
    }

    return Language;

});




