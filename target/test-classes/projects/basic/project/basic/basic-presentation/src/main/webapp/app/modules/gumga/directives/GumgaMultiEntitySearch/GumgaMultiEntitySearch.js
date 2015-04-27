/**
 * Created by igorsantana on 3/18/15.
 */
define([], function () {


    GumgaMultiEntitySearch.$inject = [];

    function GumgaMultiEntitySearch() {
        return {
            restrict: 'E',
            scope: {
                data: '='
            },
            template: '<div ng-repeat="arr in array">\n' +
            '   <a class="btn btn-link" ui-sref="{{arr.link}}"><h5>{{arr.fatherName}}</h5></a>\n' +
            '   <ul ng-repeat="x in arr.txt" class="list-unstyled">\n' +
            '       <li><strong class="text-info">{{x.title | uppercase }}</strong>: {{x.description}}</li>' +
            '   </ul>\n' +
            '</div>\n',
            link: function (scope, elm) {
                googleGenerator();
                function googleGenerator() {
                    var modifiedEntries = [];
                    angular.forEach(scope.data, function (a) {
                        var id;
                        var o = {};
                        o.txt = [];
                        o.values = [];
                        for (var key in a.data) {
                            if (key == 'id') {
                                id = a.data[key];
                            }
                            if (a.data[key] !== null) {
                                o.txt.push({title: key, description: a.data[key]});
                            }

                        }
                        o.fatherName = a.metadata.name;
                        o.link = o.fatherName.toLowerCase() + '.edit({id: ' + id + '})';

                        modifiedEntries.push(o);
                    });
                    scope.array = modifiedEntries;
                }
            }
        };
    }

    return GumgaMultiEntitySearch;


});