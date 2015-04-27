define([], function () {
    LanguageController.$inject = ['Language', '$translate', '$scope'];
    function LanguageController(Language, $translate, $scope) {
        $scope.changeLanguage = function (languageKey) {
            $translate.use(languageKey);
        };
        Language.getAll().then(function (languages) {
            $scope.languages = languages;
        });
    }
    return LanguageController;
});

