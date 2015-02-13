define(function (require) {

    return require('angular').module('generic', [])

            .directive('generateGeneric', function ($compile) {
                return {
                    restrict: 'E',
                    scope: {
                        data: '='
                    },
                    link: function (scope, el, attrs) {
                        var name = '';
                        var attributes = scope.data.atributes;
                        var text = '<form name="entityForm" method="POST" ng-submit="ctrl.save($event,entity)" gumga-form-errors gumga-ng-model-errors>';
                        for (var i = 0; i < attributes.length; i++) {
                            var obj = attributes[i];
                            for (var key in obj) {
                                if (key == 'name') {
                                    name = obj[key];
                                } else if (key == 'type') {
                                    text = text + '<div class="form-group" gumga-form-group="' + name + '"> <label class="control-label"> ' + name + '</label>'
                                    if (obj[key] == "TEXT") {
                                        text = text + '<input type="text" name="' + name + '" class="form-control" ng-model="entity.' + name + '" required>'
                                        text = text + '<gumga:input:errors field="' + name + '"></gumga:input:errors> </div>'
                                    } else if (obj[key] == "NUMBER") {
                                        text = text + '<input type="number" name="' + name + '" class="form-control" ng-model="entity.' + name + '" required>'
                                        text = text + '<gumga:input:errors field="' + name + '"></gumga:input:errors> </div>'
                                    } else if (obj[key] == "BOOLEAN") {
                                        text = text + '<label><input type="checkbox" ng-model="entity.' + name + '"> </label>';
                                    }
                                }
                            }
                        }
                        text = text + '<div class="text-right">' +
                                '<input type="submit" value="Salvar" class="btn btn-primary" ng-disabled="ctrl.saving || entityForm.$invalid" />' +
                                '<a href="#" class="btn btn-default">Cancelar</a>' +
                                '</div></form>'
                        el.replaceWith($compile(text)(scope.$parent));
                    }
                }
            })
})

