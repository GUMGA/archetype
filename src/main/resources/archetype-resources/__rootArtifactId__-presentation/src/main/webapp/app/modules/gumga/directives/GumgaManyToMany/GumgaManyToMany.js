/**
 * Created by igorsantana on 26/03/15.
 */
define([], function () {
    GumgaManyToMany.$inject = ['$compile','GumgaUtils'];

    function GumgaManyToMany($compile,GumgaUtils) {
        return {
            restrict: 'E',
            scope: {
                leftList: '=',
                rightList: '=',
                leftSearch: '&',
                rightSearch: '&'
            },
            transclude: true,
            link: function (scope, elm, attrs, ctrl, transcludeFn) {
                var fields = {};
                if (!scope.leftList || !scope.rightList) {
                    throw 'You\'ve got to provide the directive two lists';
                }

                transcludeFn(function (clone) {
                    angular.forEach(clone, function (cloneEl) {
                        if (cloneEl.nodeName != '#text') {
                            if (cloneEl.nodeName == "LEFT-LIST-FIELD") {
                                fields.left = cloneEl.innerHTML;
                            } else {
                                fields.right = cloneEl.innerHTML;
                            }
                        }
                    });
                    generateLists();
                });

                function generateLists() {
                    var firstDisabled = false;
                    var secondDisabled = false;
                    if (!attrs.leftSearch) {
                        //firstDisabled = 'true';
                    }
                    if (!attrs.rightSearch) {
                        //secondDisabled = 'true';
                    }
                    var template = [
                        '<div class="col-md-12" style="padding-left: 0;padding-right:0">',
                        '<div class="col-md-6" style="padding-left: 0;">',
                        //'<div class="input-group" style="margin-bottom: 2%">',
                        '<input type="text" ng-model="filterLeftList" class="form-control"  ng-change="leftSearch({text: filterLeftList})" ng-disabled="' + firstDisabled + '" style="margin-bottom: 2%"/>',
                        //'<span class="input-group-btn">',
                        //'<button class="btn btn-primary" type="button" ng-disabled="' + firstDisabled + '" ng-click="leftSearch({text: filterLeftList})">Search <i class="fa fa-search"></i></button>',
                        //'</span>',
                        //'</div>',
                        '<ul class="list-group" >',
                        '<li ng-repeat="item in leftList | filter:filterLeftList " class="list-group-item" ng-click="changeList(0,item)">' + fields.left + '</li>',
                        '</ul>',
                        '</div>',
                        '<div class="col-md-6 " style="padding-right:0">',
                        //'<div class="input-group" style="margin-bottom: 2%">',
                        '<input type="text" ng-model="filterSecondList" class="form-control"  ng-change="rightSearch({text: filterSecondList})" ng-disabled="' + secondDisabled + '" style="margin-bottom: 2%"/>',
                        //'<span class="input-group-btn">',
                        //'<button class="btn btn-primary" type="button" ng-disabled="' + secondDisabled + '" ng-click="rightSearch({text: filterSecondList})">Search <i class="fa fa-search"></i></button>',
                        //'</span>',
                        //'</div>',
                        '<ul class="list-group" >',
                        '<li ng-repeat="item in rightList | filter:filterSecondList" class="list-group-item" ng-click="changeList(1,item)">' + fields.right + '</li>',
                        '</ul>',
                        '</div>',
                        '</div>'
                    ];

                    elm.append($compile(template.join('\n'))(scope));
                }

                function containsObj(obj, list) {
                    var x;
                    for (x in list) {
                        if (list.hasOwnProperty(x) && list[x] === obj) {
                            return x;
                        }
                    }
                    return -1;
                }

                function removeAndPush(value, arrayFrom, arrayTo) {
                    if (value != -1) {
                        var obj = arrayFrom.splice(value, 1);
                        arrayTo.push(obj[0]);
                    }
                }


                scope.changeList = function (bool, item) {
                    switch (bool) {
                        case 0:
                            removeAndPush(containsObj(item, scope.leftList), scope.leftList, scope.rightList);
                            break;
                        case 1:
                            removeAndPush(containsObj(item, scope.rightList), scope.rightList, scope.leftList);
                            break;
                    }
                };
            }

        };
    }


    return GumgaManyToMany;
});