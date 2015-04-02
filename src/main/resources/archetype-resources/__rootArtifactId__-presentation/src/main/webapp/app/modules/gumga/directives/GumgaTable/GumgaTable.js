define(['jquery'], function ($) {

    GumgaTable.$inject = ['GumgaUtils', '$compile'];

    function GumgaTable(GumgaUtils, $compile) {

        function LinkFn(scope, elm, attrs, ctrl, transcludeFn) {
            scope.indexes = [];
            scope.trs = [];
            scope.$parent.deletedEntities = [];
            var rawTableConfig = {
                multi: scope.multi,
                list: [],
                sortFn: scope.sort,
                size: attrs.size,
                class: attrs.tableClass,
                columns: attrs.columns,
                headings: []
            };

            scope.$watch('list', function () {
                if (scope.list) {
                    scope.tableconfig.list = scope.list;
                    scope.indexes = [];
                    scope.$parent.deletedEntities = [];
                }
            });

            transformData(rawTableConfig);

            function transformData(config) {
                if (!config.size)
                    config.size = 'large';
                if(!config.class)
                    config.class = 'bordered';
                config.columns = config.columns.split(',');
                setColumnConfig(config);
            }

            function setColumnConfig(rawConfig) {
                rawConfig.columns.forEach(function (elm) {
                    var obj = {
                        label: GumgaUtils.camelCase(elm),
                        field: elm
                    };
                    rawConfig.headings.push({label: obj.label, way: null});
                    rawConfig.columns.splice(rawConfig.columns.indexOf(elm), 1, obj);
                });


                transcludeFn(function (clone) {
                    angular.forEach(clone, function (cloneEl) {
                        if (cloneEl.nodeName != "#text") {
                            switch (cloneEl.nodeName) {
                                case 'GUMGA-BOOLEAN-MASK':
                                    rawConfig.columns.forEach(function (obj) {
                                        if (obj.field == cloneEl.getAttribute('column')) {
                                            $.extend(obj, {
                                                trueValue: cloneEl.getAttribute('boolean-true'),
                                                falseValue: cloneEl.getAttribute('boolean-false')
                                            });
                                        }
                                    });
                                    break;
                                case 'BUTTONS-COLUMN':
                                    scope.buttonElements = cloneEl.children;
                                    rawConfig.headings.push({label: ' ', way: null});
                                    break;
                                case 'EXTRA-COLUMN':
                                    scope.extraElements = cloneEl.children;
                                    rawConfig.headings.push({label: ' ', way: null});

                            }
                        }
                    });
                });
                scope.tableconfig = rawConfig;
                generateTable(scope.tableconfig);
            }

            function generateTable(config) {
                var template = [];
                switch (config.size) {
                    case 'large':
                        template.push('<div class="col-md-12" style="padding-left:0;padding-right: 0;"><table class="table table-' + config.class + ' ">');
                        break;
                    case 'medium':
                        template.push('<div class="col-md-8" style="padding-left:0;padding-right: 0;"><table class="table table-' + config.class + '">');
                        break;
                    case 'small':
                        template.push('<div class="col-md-4" style="padding-left:0;padding-right: 0;"><table class="table table-' + config.class + '">');
                        break;
                }
                template.push('<thead>');
                template.push('<tr>');
                if (attrs.sortFunction) {
                    template.push(' <td  ng-repeat="head in tableconfig.headings track by $index" ng-click="head.label !== \' \' ? sortAux(head) : \'\'"');
                    template.push('     ng-class="head.label != \' \' ? \'clickable-td\' : \' \' ">');
                    template.push('         {{head.label}}<i ng-class="(head.way !== null && head.label !== \' \') ? (head.way === true ? \' fa fa-caret-up\' : \'fa fa-caret-down\') : \'\'"></i>');
                } else {
                    template.push('<td ng-repeat="head in tableconfig.headings track by $index">{{head.label}}');
                }
                template.push(' </td>');
                template.push('</tr>');
                template.push('</thead>');
                template.push('<tbody>');
                if (config.multi === false) {
                    template.push('<tr ng-class="returnClass($index)" ng-repeat="entity in tableconfig.list" ng-click="handleSingle(entity,$index)">' + generateTableCell(config) + '</tr>');
                } else {
                    template.push('<tr ng-class="returnClass($index)" ng-repeat="entity in tableconfig.list" ng-click="handleMultiple(entity,$index)">' + generateTableCell(config) + '</tr>');
                }
                template.push('</tbody>');
                template.push('</table></div>');
                elm.append($compile(template.join('\n'))(scope));

            }

            function generateTableCell(config) {
                var template = [];
                config.columns.forEach(function (elm) {
                    if (elm.trueValue) {
                        template.push('<td style="text-align: center">{{entity.' + elm.field + ' === true? \'' + elm.trueValue + '\' : \'' + elm.falseValue + '\'}}</td>');
                    } else {
                        if (typeof elm.field == 'string') {
                            template.push('<td style="text-align: left;">{{entity.' + elm.field + '}}</td>');
                        } else if (typeof elm.field == 'number') {
                            template.push('<td style="text-align: right;">{{entity.' + elm.field + '}}</td>');
                        }
                    }
                });

                if (scope.buttonElements) {
                    template.push('<td>' + getSpecial(scope.buttonElements) + '</td>');
                }
                if (scope.extraElements) {
                    template.push('<td>' + getSpecial(scope.extraElements) + '</td>');
                }
                return template.join(' ');
            }


            function getSpecial(array) {
                var txt = [];
                angular.forEach(array, function (elm) {
                    txt.push(elm.outerHTML);
                });
                return txt.join(' ');
            }

            scope.sortAux = function (obj) {
                scope.tableconfig.headings.forEach(function (key) {
                    if (key != obj) {
                        if (key.way === true || key.way === false) {
                            key.way = null;
                        }
                    }
                });
                var index = scope.tableconfig.headings.indexOf(obj);
                obj.way = !obj.way;
                scope.tableconfig.headings.splice(index, 1, obj);
                var aux;
                if (obj.way === true) {
                    aux = 'asc';
                } else {
                    aux = 'desc';
                }
                scope.sort({field: obj.label.toLowerCase(), way: aux});
            };

            scope.handleMultiple = function (entity, index) {
                if (GumgaUtils.areNotEqualInArray(scope.indexes, index) || scope.indexes.length < 1) {
                    scope.indexes.push(index);
                    scope.$parent.deletedEntities.push(entity);
                } else {
                    scope.indexes.splice(scope.indexes.indexOf(index), 1);
                    scope.$parent.deletedEntities.splice(scope.$parent.deletedEntities.indexOf(entity), 1);
                }
            };

            scope.handleSingle = function (entity, index) {
                if (scope.indexes.length >= 1) {
                    scope.indexes = [];
                    scope.$parent.deletedEntities = [];
                }
                scope.indexes.push(index);
                scope.$parent.deletedEntities.push(entity);
            };

            scope.returnClass = function (index) {
                if (!GumgaUtils.areNotEqualInArray(scope.indexes, index)) {
                    return 'info';
                }
                return '';
            };
        }

        return {
            restrict: 'E',
            scope: {
                multi: '=multiSelection',
                list: '=values',
                sort: '&sortFunction'
            },
            link: LinkFn,
            transclude: true
        };
    }

    return GumgaTable;
});