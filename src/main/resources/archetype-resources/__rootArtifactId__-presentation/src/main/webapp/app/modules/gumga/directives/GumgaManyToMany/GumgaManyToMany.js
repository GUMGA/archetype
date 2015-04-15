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
                    throw 'You\'ve got to provide to the directive two lists';
                }


                scope.$watch('leftList', function(){
                    console.log("obj")
                    scope.rightList.forEach(function(objRight){
                        scope.leftList.forEach(function(objLeft){
                            if(objRight.id == objLeft.id){
                                scope.leftList.splice(scope.leftList.indexOf(objLeft),1);
                            }
                        })
                    })
                })

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
                    var template = [];
                    template.push('<div class="col-md-12" style="padding-left: 0;padding-right:0">');

                    template.push('<div class="col-md-6" style="padding-left: 0;">');
                    if(attrs.leftSearch){
                        template.push('<input type="text" ng-model="filterLeftList" class="form-control" ng-change="leftSearch({param: filterLeftList})"/>');
                    }else{
                        template.push('<input type="text" ng-model="filterLeftList" class="form-control"/>');
                    }
                    template.push('<ul class="list-group" >');
                    if(attrs.leftSearch){
                        template.push('<li ng-repeat="item in leftList" class="list-group-item" ng-click="changeList(0,item)">' + fields.left + '</li>');
                    }else{
                        template.push('<li ng-repeat="item in leftList | filter:filterLeftList " class="list-group-item" ng-click="changeList(0,item)">' + fields.left + '</li>');
                    }
                    template.push('</ul>');
                    template.push('</div>');

                    template.push('<div class="col-md-6 " style="padding-right:0">');
                    if (attrs.rightSearch){
                        template.push('<input type="text" ng-model="filterRightList" class="form-control"  ng-change="rightSearch({text: filterRightList})"/>');
                    }else{
                        template.push('<input type="text" ng-model="filterRightList" class="form-control"/>');
                    }
                    template.push('<ul class="list-group" >');
                    if (attrs.rightSearch){
                        template.push('<li ng-repeat="item in rightList" class="list-group-item" ng-click="changeList(1,item)">' + fields.right + '</li>');
                    }else{
                        template.push('<li ng-repeat="item in rightList | filter:filterRightList" class="list-group-item" ng-click="changeList(1,item)">' + fields.right + '</li>');
                    }
                    template.push('</ul>');
                    template.push('</div>');

                    template.push('</div>');
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