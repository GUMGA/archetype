define([],function() {

    var FilterPanelService = function($rootScope, $compile, $q, $controller, $templateCache, $http) {

        var stack = {};

        function getTemplatePromise(options) {
            return options.template ? $q.when(options.template) :
                $http.get(angular.isFunction(options.templateUrl) ? (options.templateUrl)() : options.templateUrl,
                    {cache: $templateCache}).then(function (result) {
                        return result.data;
                    });
        }

        function invalidPanelDataEffect(panel) {
            panel.addClass('effect shake');
            setTimeout(function() {
                panel.removeClass('effect shake');
            }, 500);
        }

        this.open = function($container, filter) {

            var panelDeffered      = $q.defer();

            var panelInstance = {
                result :  panelDeffered.promise,
                confirm : function(condition, value) {

                    if (validateAndClose(value)) {
                        panelDeffered.resolve({
                            'condition' : condition,
                            'value' : value
                        });
                    }


                },

                cancel : function() {
                    if (validateAndClose(filter.value)) {
                        panelDeffered.reject();
                    }
                }
            };

            var ctrlLocals = {};

            function validateAndClose(value) {
                if (!filter.field.validate(value)) {
                    invalidPanelDataEffect(panelInstance.el);
                    return false;

                } else {
                    panelInstance.el.remove();
                    panelInstance.$scope.$destroy();
                    delete stack[filter];
                    return true;
                }
            }

            getTemplatePromise(filter.field).then(function(template) {

                var $scope = $rootScope.$new();
                $scope.$condition = filter.condition;
                $scope.$value = filter.value;
                $scope.$field = filter.field;
                $scope.$panelInstance = panelInstance;

                // Cria um controller para controlar o componetne
                if (filter.field.controller) {
                    ctrlLocals.$scope = $scope;
                    ctrlLocals.$panelInstance = panelInstance;
                    $controller(filter.field.controller, ctrlLocals);
                }

                var angularDomEl = angular.element('<div gumga-filter-panel class="gumga-filter-panel"></div>');
                angularDomEl.html(template);

                panelInstance.el = $compile(angularDomEl)($scope);
                panelInstance.$scope = $scope;
                $container.after(panelInstance.el);

                stack[filter] = panelInstance;
            });

            return panelInstance;
        };

    };

    FilterPanelService.$inject = ['$rootScope', '$compile', '$q', '$controller', '$templateCache', '$http'];

    return FilterPanelService;
});