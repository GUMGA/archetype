/**
 * Created by rafaelMangolin on 3/10/15.
 */
(define(['app/modules/gumga/directives/GumgaFilter/filter/exporter/hql'], function (hqlExporter) {

    GumgaSearch.$inject = ['$compile'];

    function GumgaSearch($compile) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                advanced: '=advancedSearch',
                advancedSearch: "&advancedMethod",
                search: '&searchMethod'
            },
            transclude: true,
            link: function (scope, elm, attrs, ctrl, transclude) {
                scope.advancedParams = [];
                transclude(scope, function (clone) {
                    var fields = [];
                    angular.forEach(clone, function (cloneEl) {
                        if (cloneEl.nodeName != "#text") {
                            fields.push(cloneEl);
                        }
                    });
                    generateParams(fields);
                });

                generateSearch();

                var input = findInput();

                function findInput() {
                    var ch = elm.children().children().children();
                    for (var i = 0; i < ch.length; i++) {
                        if (ch[i].tagName.toUpperCase() == 'INPUT') {
                            return ch[i];
                        }
                    }
                }

                input.onkeypress = function (k) {
                    switch (k.keyCode) {
                        case 13:
                            scope.search({field: attrs.field, param: scope.term});
                            break;
                    }
                };

                function generateParams(array) {
                    array.forEach(function (elm) {
                        var aux = angular.element(elm);
                        scope.advancedParams.push({field: aux[0].getAttribute('field'), type: aux[0].getAttribute('type')});
                    });
                }

                function generateSearch() {
                    var template = [];
                    template.push('<div class="col-md-12 pull-right" style="padding-right: 0;padding-left: 0">');
                    template.push('<div class="input-group">');
                    template.push('<input type="text" class="form-control" ng-model="term" id="search">');
                    template.push('<div class="input-group-btn">');
                    if (scope.advanced) {
                        template.push('<button class="btn btn-default" ng-click="isAdvanced = !isAdvanced" type="button">');
                        template.push('<span class="fa fa-filter"> </span> <span class="caret"></span> ');
                        template.push('</button>');
                    }
                    template.push('<button class="btn btn-primary" ng-click="search({field:field , param:term})" type="button">');
                    template.push('<span class="fa fa-search"> </span> Search');
                    template.push('</button>');
                    template.push('</div>');
                    template.push('</div>');
                    if (scope.advanced) {
                        template.push('<div class="panel panel-default" ng-init="isAdavanced = false" ng-show="isAdvanced">');
                        template.push('<div class="panel-heading">Pesquisa avançada</div>');
                        template.push('<div class="panel-body">');
                        template.push('<gumga:filter ng-model="scope.advancedParam">');
                        for (var i = 0; i < scope.advancedParams.length; i++) {
                            var aux = scope.advancedParams[i];
                            template.push('<gumga:filter:item field="' + aux.field + '" label="' + aux.field.toUpperCase() + '" ');
                            if (aux.type) {
                                template.push('type="' + aux.type + '" ');
                            }
                            template.push('></gumga:filter:item>');
                        }
                        template.push('</gumga:filter>');
                        template.push('<button class="btn btn-primary btn-search" ng-click="filterConverter(scope.advancedParam)" ng-disabled="list.isAdvancedOpen">');
                        template.push('<span class="glyphicon glyphicon-search"></span>');
                        template.push('</button>');
                        template.push('</div>');
                        template.push('</div>');
                    }
                    template.push('</div>');
                    elm.append($compile(template.join('\n'))(scope));
                }

                scope.filterConverter = function (param) {
                    var hql = new hqlExporter();

                    var aux = hql.export(param);
                    scope.advancedSearch({param: aux});
                };
            }
        };
    }

    return GumgaSearch;
}));