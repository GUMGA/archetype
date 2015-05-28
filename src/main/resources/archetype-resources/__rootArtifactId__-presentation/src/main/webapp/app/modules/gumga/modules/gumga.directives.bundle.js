/**
 * Created by igorsantana on 28/05/15.
 */
define(function(require){
    var angular = require('angular');
    require('gumga-services');

    angular.module('gumga.directives',['gumga.services'])
        .directive('gumgaNav', function GumgaNav($state,GumgaWebStorage,$modal,$rootScope) {
            var template = [
                '<nav id="navbar">',
                '   <a href="#" class="navbar-logo">{{title | uppercase}}</a>' +
                '   <span style="color: white; font-size: 1.4em;margin-left: 2%"><small>{{info.organization}}</small></span>',
                '   <b class="pull-right"><a href class="status-navbar" ng-click="showPanelNavBar()"><small style="font-size: 85%;mar">{{info.user}}<i class="glyphicon glyphicon-triangle-bottom" style="margin-left: 1px"></i> </small></a></b>',
                '    <a ng-click="treatUrl()" class="btn btn-default btn-sm pull-right" style="margin-top: 8px;margin-right: 10%">Search</a>',
                '   <input type="text" ng-model="search" class="navbar-input" placeholder="Search">',
                '</nav>' ,
                '<div class="nav-panel" ng-show="showPanelNav">' ,
                '   <div class="panel-body" id="navPanelBody">',
                '           <button ng-repeat="link in navlinks" ng-click="handle(link)" class="btn btn-link" style="display:block;width: 100%;color: black; font-size: 0.9em;"><i class="{{link.glyphicon}}"></i>{{link.text}} </button>',
                '   </div>',
                '</div>'
            ];

            var modalTemplate = [
                '<div class="modal-header">Change Password</div>',
                '<div class="modal-body">' +
                '   <form name="ModalForm" novalidate>' +
                '   <label> <small>Email</small></label>' +
                '   <input type="email" class="form-control" ng-model="user.email" required/>' +
                '   <label> <small>Old Password</small></label>' +
                '   <input type="password" class="form-control" ng-model="user.oldpass" required/>' +
                '   <label><small> New Password</small></label>' +
                '   <input type="password" class="form-control" ng-model="user.newpass" required/>' +
                '   <label><small> New Password (again)</small></label>' +
                '   <input type="password" class="form-control" ng-model="user.newpasscheck" required/>' +
                '</div>',
                '<div class="modal-footer">' +
                '   <button class="btn btn-primary" ng-click="ok()" type="submit" ng-disabled="ModalForm.$invalid"> Save</button>' +
                '   <button class="btn btn-warning" ng-click="cancel()" type="button"> Cancel</button>' +
                '</div>' +
                '</form>'];
            return {
                restrict: 'E',
                scope: {
                    title: '@'
                },
                template: template.join('\n'),
                link: function (scope, el, attrs) {
                    scope.info = GumgaWebStorage.getSessionStorageItem('user');
                    scope.treatUrl = function () {
                        $state.go('multientity', {'search': scope.search});
                    };
                    scope.$on('close',function(){
                        scope.showPanelNav = false;
                    });
                    scope.showPanelNavBar = function(){
                        scope.showPanelNav = !scope.showPanelNav;
                    };
                    var obj = {};
                    scope.handle = function(link){
                        scope.showPanelNav = !scope.showPanelNav;
                        switch(link.value){
                            case 'pass':
                                var modalInstance = $modal.open({
                                    template: modalTemplate.join('\n'),
                                    size: 'sm',
                                    controller: function($scope,$modalInstance,$http){
                                        $scope.ok = function () {
                                            if($scope.user.newpass.toLowerCase() === $scope.user.newpasscheck.toLowerCase()){
                                                $http.put('http://192.168.25.201:8084/security-api/publicoperations/token/',{
                                                    user: $scope.user.email ,
                                                    password: $scope.user.password,
                                                    newpassword: $scope.user.newpass})
                                                    .success(function(){
                                                        $modalInstance.close();
                                                    })
                                                    .error(function(){
                                                        console.log('Erro!');
                                                    })
                                            }
                                        };
                                        $scope.cancel = function () {
                                            $modalInstance.dismiss();
                                        };
                                    },
                                    resolve: {}
                                });
                                modalInstance.result.then(function (selectedItem) {
                                    $scope.selected = selectedItem;
                                });
                                break;
                            case 'logout':
                                $state.go(attrs.state);
                                break;
                        }
                    };
                    el.find('input')
                        .on('keypress',function(k){
                            if (k.keyCode == 13)
                                scope.treatUrl()
                        });

                    scope.doLogout = function () {
                        $state.go('login');
                    };
                }
            };
        })
        .directive('gumgaMenu', function GumgaMenu($http, $compile) {
            return {
                restrict: 'E',
                replace: true,
                scope: {},
                link: function (scope, el, attrs) {
                    scope.v = [];
                    var indexs = [];
                    var count = 0;
                    var menuOpen = false;

                    $http.get(attrs.menuUrl).then(function (data) {
                        scope.dados = data.data;
                    }, function (data) {
                        throw 'Erro:' + data;
                    });

                    $http.get(attrs.keysUrl).then(function (data) {
                        scope.keys = data.data;
                    }, function (data) {
                        throw 'Erro:' + data;
                    });

                    scope.$watchGroup(['dados', 'keys'], function () {
                        if (scope.dados && scope.keys) {
                            gerateMenus();
                        }
                    });

                    var gerateMenus = function () {
                        var template = ['<div>'];
                        template.push('<button id="btn-menu" class="btn btn-link" ng-click="mostrarMenu()"><i class="glyphicon glyphicon-align-justify"></i></button>');
                        template.push('<nav id="menu" class="col-sm-3" name="menu">');

                        template.push('<ul class="menu-holder">');
                        template.push('<img ng-src="' + attrs.image + '" alt="logo" width="40%" class="img-centered">');
                        for (var i = 0; i < scope.dados.length; i++) {
                            if (keyIsValid(scope.dados[i].key)) {
                                template.push(gerarNavPill(scope.dados[i], 'menu', {count: -1, label: null}));
                            }
                        }
                        template.push('</ul>');
                        template.push('</nav>');
                        template.push('</div>');
                        template = template.join('\n');
                        el.append($compile(template)(scope));
                    };

                    var gerarNavPill = function (param, type, parent) {
                        scope.v[count] = {
                            isActive: false,
                            parent: parent.count
                        };
                        var template = ['<li class="' + type + '-option">'];
                        if (param.filhos.length > 0 && verificarPermicaoFilho(param.filhos)) {
                            template.push('<i  ng-class="v[' + count + '].isActive ? \' glyphicon glyphicon-chevron-down \' : \'glyphicon glyphicon-chevron-right\'" class="fa ' + type + '-color"  ng-click="resetarMenu(' + count + ')"></i>');
                        } else {
                            template.push('<i  class=" ' + param.icon + ' " style="color: #fff" ng-click="resetarMenu(' + count + ')"></i>');
                        }
                        template.push('<a ui-sref="' + param.URL + '" ng-class="v[' + count + '].isActive ? \'is-active\' : \' \'"');
                        if (parent.label === null || param.filhos.length > 0) {
                            template.push('gumga-translate-tag="' + param.label.toLowerCase() + '.menuLabel">');
                        } else if (param.filhos.length === 0) {
                            template.push('gumga-translate-tag="' + parent.label.toLowerCase() + '.' + param.label.toLowerCase() + '">');
                        }
                        template.push(param.label);
                        template.push('</a>');
                        var aux = count;

                        count++;
                        if (param.filhos.length > 0) {
                            template.push('<ul ng-class="v[' + (count - 1) + '].isActive ? \' submenu-group-ativo\' : \'submenu-group\'" class="menu-holder">');
                            for (var i = 0; i < param.filhos.length; i++) {
                                if (keyIsValid(param.filhos[i].key)) {
                                    template.push(gerarNavPill(param.filhos[i], 'submenu', {count: aux, label: param.label}));
                                }
                            }
                            template.push('</ul>');
                        }
                        template.push('</li>');
                        return template.join('\n');
                    };


                    scope.resetarMenu = function (index) {
                        var i;
                        if (scope.v[index].isActive) {
                            for (i = 0; i < scope.v.length; i++) {
                                scope.v[index].isActive = false;
                            }
                            setarTrue(scope.v[index].parent);

                        } else {
                            for (i = 0; i < scope.v.length; i++) {
                                scope.v[i].isActive = false;
                            }
                            setarTrue(index);
                        }

                    };

                    var keyIsValid = function (key) {
                        return scope.keys.indexOf(key) != -1;
                    };

                    function setarTrue(index) {
                        if (index >= 0) {
                            scope.v[index].isActive = true;
                            setarTrue(scope.v[index].parent);
                        }
                    }

                    scope.mostrarMenu = function () {
                        menuOpen = !menuOpen;

                        var elm = el.find('nav');
                        if (menuOpen) {
                            elm.addClass('open-menu');
                        } else {
                            elm.removeClass('open-menu');
                        }
                    };

                    function verificarPermicaoFilho(filhos) {
                        for (var i = 0; i < filhos.length; i++) {
                            for (var j = 0; j < scope.keys.length; j++) {
                                if (filhos[i].key == scope.keys[j]) {
                                    return true;
                                }
                            }
                        }
                        return false;
                    }

                }
            };
        })
        .directive('gumgaTable', function GumgaTable(GumgaUtils, $compile,$rootScope,$state,GumgaKeyboard,$timeout) {
            return {
                restrict: 'E',
                scope: {
                    multi: '=multiSelection',
                    list: '=values',
                    sort: '&sortFunction',
                    rowClass: '=',
                    onSelect: '&',
                    onSort: '&'
                },
                link: LinkFn,
                transclude: true
            };
            function LinkFn(scope, elm, attrs, ctrl, transcludeFn) {
                var eventHandler = {
                    select: (attrs.onSelect ? scope.onSelect : angular.noop),
                    sort: (attrs.onSort ? scope.onSort: angular.noop)
                };
                scope.$on('_clean',function(){
                    scope.cleanSearch();
                });
                var ColumnObject = {};
                scope.indexes = [];
                scope.trs = [];
                scope.$parent.selectedEntities = [];
                scope.objectColumn = [];
                scope.conditionalColumns = [];
                var rawTableConfig = {
                    multi: scope.multi,
                    list: [],
                    sortFn: scope.sort,
                    size: attrs.size || 'large',
                    class: attrs.tableClass || 'bordered',
                    columns: attrs.columns.split(','),
                    headings: [],
                    translate: attrs.translateEntity
                };
                scope.$watch('list', function () {
                    if (scope.list) {
                        scope.$parent.selectedEntities = [];
                        scope.tableconfig.list = scope.list;
                        scope.indexes = [];

                    }
                });
                setColumnConfig(rawTableConfig);
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
                                        break;
                                    case 'OBJECT-COLUMN':
                                        scope.objectColumn.push({column: cloneEl.getAttribute('column'),value: cloneEl.getAttribute('property')});
                                        break;
                                    case 'COLUMN-CLASS':
                                        scope.conditionalColumns.push({column: cloneEl.getAttribute('column'),conditional: cloneEl.getAttribute('conditional-class')});
                                        break;

                                }
                            }
                        });
                    });
                    scope.tableconfig = rawConfig;
                    generateTable(scope.tableconfig);
                }
                function getConditions(){
                    var conditionText = attrs.rowClass || '';
                    return conditionText.replace(/{/,'').replace(/}/,'').split(',');
                }
                function generateTable(config) {
                    var template = [];
                    switch (config.size) {
                        case 'large':
                            template.push(
                                '<div class="full-width-without-padding" style="margin-top: 1%">' +
                                '<button class="btn btn-default btn-xs" gumga-translate-tag="table.select" style="margin-bottom: 0.25%" ng-click="selectAll()"></button>' +
                                '<button class="btn btn-default btn-xs" gumga-translate-tag="table.clean" style="margin-bottom: 0.25%;margin-left:0.25%" ng-click="cleanSearch()"></button>' +
                                '<table class="table table-' + config.class + ' ">');
                            break;
                        case 'medium':
                            template.push(
                                '<div class="col-md-8" style="padding-left:0;padding-right: 0;">' +
                                '<table class="table table-' + config.class + '">');
                            break;
                        case 'small':
                            template.push(
                                '<div class="col-md-4" style="padding-left:0;padding-right: 0;">' +
                                '<table class="table table-' + config.class + '">');
                            break;
                    }
                    template.push('<thead>');
                    template.push('<tr>');
                    if (attrs.sortFunction) {
                        template.push(' <td gumga-translate-tag="'+config.translate +'.{{head.label.toLowerCase()}}" ng-repeat="head in tableconfig.headings track by $index" ng-click="head.label !== \' \' ? sortAux(head) : \'\'"');
                        template.push('     ng-class="head.label != \' \' ? \'clickable-td\' : \' \' ">');
                        template.push('         <small><i ng-class="(head.way != null && head.label !== \' \') ? (head.way === true ? \'glyphicon glyphicon-menu-up\' : \'glyphicon glyphicon-menu-down\') : \'\'"></i></small></td>');
                    } else {
                        template.push('<td gumga-translate-tag="head.label !== '+config.translate +'.{{head.label.toLowerCase()}}" ng-repeat="head in tableconfig.headings track by $index">{{head.label}}');
                    }
                    template.push(' </td>');
                    template.push('</tr>');
                    template.push('</thead>');
                    template.push('<tbody>');
                    if (config.multi === false) {
                        template.push('<tr style="{{getClassFromConditionalRow(entity)}}" ng-class="returnClass($index)" ng-repeat="entity in tableconfig.list" class="used" ng-click="handleSingle(entity,$index)" ng-dblclick="goToEdit(entity.id)">' + generateTableCell(config) + '</tr>');
                    } else {
                        template.push('<tr style="{{getClassFromConditionalRow(entity)}}" ng-class="returnClass($index)" ng-repeat="entity in tableconfig.list" class="used" ng-click="handleMultiple(entity,$index)" ng-dblclick="goToEdit(entity.id)" >' + generateTableCell(config) + '</tr>');
                    }
                    template.push('</tbody>');
                    template.push('</table></div>');
                    elm.append($compile(template.join('\n'))(scope));

                }
                var selected = false;
                scope.goToEdit = function(index){
                    $state.go(scope.tableconfig.translate + '.' + 'edit',{id: index});
                };
                scope.selectAll = function(){
                    if(!selected){
                        for(var i = 0, len = scope.tableconfig.list.length;i < len;i++){
                            scope.indexes.push(i);
                        }
                        scope.$parent.selectedEntities = scope.tableconfig.list;
                    } else {
                        scope.indexes = [];
                        scope.$parent.selectedEntities = [];
                    }
                    selected = !selected;

                };
                scope.cleanSearch = function(){
                    $rootScope.$broadcast('normal',{field:scope.tableconfig.columns[1],param: ''});
                    scope.tableconfig.headings.forEach(function(elm){
                        elm.way = null;
                    })
                };
                scope.getClassFromConditionalRow = function (entity){
                    var HelperObject = {};
                    var conditionsFromTag = getConditions();
                    conditionsFromTag.forEach(function(elm){
                        HelperObject[elm.split(':')[0]] = eval(elm.split(':')[1]);
                    });
                    for(var key in HelperObject) if(HelperObject.hasOwnProperty(key) && HelperObject[key] === true){
                        return 'border-left: 3px solid ' + key.trim();
                    }
                    return '';
                };
                function checkObject(field){
                    for(var i = 0; i < scope.objectColumn.length;i++){
                        if(scope.objectColumn[i].column === field){
                            return '{{entity.'+  scope.objectColumn[i].value +'}}';
                        }
                    }
                    return -1;
                }
                function getClassFromConditionalCell(column,entity){
                    scope.conditionalColumns.forEach(function(elm){
                        if(elm.column.toLowerCase().trim() === column.toLowerCase().trim()){
                            ColumnObject[elm.column] = {};
                            elm.conditional.replace(/{/,'').replace(/}/,'').split(',')
                                .forEach(function(arg){
                                    var x = arg.split(':');
                                    ColumnObject[elm.column][x[0].trim().replace(/"/g,'')] = x[1].trim();
                                })
                        }
                    });
                }
                scope.getStyleFromCell = function(entity,column){
                    if(ColumnObject[column.trim().toLowerCase()]){
                        var auxObj = ColumnObject[column.trim().toLowerCase()];
                        for(var key in auxObj) if(auxObj.hasOwnProperty(key) && eval(auxObj[key]) === true){
                            return 'border-left: 3px solid ' + key.trim();
                        }
                    }
                };
                function generateTableCell(config) {
                    var template = [];
                    config.columns.forEach(function (elm) {
                        getClassFromConditionalCell(elm.field);
                        if (elm.trueValue) {
                            template.push('<td style="{{getStyleFromCell(entity,\' '+ elm.field + ' \')}}">{{entity.' + elm.field + ' === true? \'' + elm.trueValue + '\' : \'' + elm.falseValue + '\'}}</td>');
                        } else if(checkObject(elm.field) != -1){
                            template.push('<td style="{{getStyleFromCell(entity,\' '+ elm.field + ' \')}}">' + checkObject(elm.field) +' </td>');
                        } else {
                            template.push('<td style="{{getStyleFromCell(entity,\' '+ elm.field + ' \')}}">{{entity.'+ elm.field + '}} </td>');
                        }
                    });
                    if (scope.buttonElements) {
                        template.push('<td style="{{getStyleFromCell(entity,\' '+ elm.field + ' \')}}">' + getSpecial(scope.buttonElements) + '</td>');
                    }
                    if (scope.extraElements) {
                        template.push('<td style="{{getStyleFromCell(entity,\' '+ elm.field + ' \')}}">' + getSpecial(scope.extraElements) + '</td>');
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
                    eventHandler.sort({field: obj.label.toLowerCase()});
                    scope.sort({field: obj.label.toLowerCase(), way: aux});
                };
                scope.handleMultiple = function (entity, index) {
                    if (GumgaUtils.areNotEqualInArray(scope.indexes, index) || scope.indexes.length < 1) {
                        scope.indexes.push(index);
                        scope.$parent.selectedEntities.push(entity);
                    } else {
                        scope.indexes.splice(scope.indexes.indexOf(index), 1);
                        scope.$parent.selectedEntities.splice(scope.$parent.selectedEntities.indexOf(entity), 1);
                    }
                    eventHandler.select({selected: scope.$parent.selectedEntities});
                };
                scope.handleSingle = function (entity, index) {
                    if (scope.indexes.length >= 1) {
                        scope.indexes = [];
                        scope.$parent.selectedEntities = [];
                    }
                    scope.selectedIndex = index;
                    scope.indexes.push(index);
                    scope.$parent.selectedEntities.push(entity);
                    eventHandler.select({selected: scope.$parent.selectedEntities});
                };
                scope.returnClass = function (index) {
                    if (!GumgaUtils.areNotEqualInArray(scope.indexes, index)) {
                        return 'info';
                    }
                    return '';
                };
            }
        })
        .directive('gumgaFormButtons', function GumgaFormButtons($state, $stateParams) {
            return {
                restrict: 'E',
                scope: {
                    do: '&submit',
                    valid: '=',
                    continue: '='
                },
                template:
                '<div class="full-width-without-margin">'+
                '   <div ng-class="getPosition()">' +
                '       <label id="continuarInserindo" ng-if="inNew">'+
                '           <input type="checkbox" name="continuar" ng-model="continue.value"/>' +
                '           <span gumga-translate-tag="formbuttons.inserir"></span>'+
                '       </label>' +
                '       <button class="btn btn-warning" style="margin-right: 0.8em" ng-click="back()" type="button"><i class="glyphicon glyphicon-floppy-remove"></i> Back</button>' +
                '       <button class="btn btn-primary" style="margin-right: 0" ng-click="do()" ng-disabled="!valid" type="button"><i class="glyphicon glyphicon-floppy-saved"></i> Save</button>' +
                '   </div>'+
                '<div>',
                require: '^form',
                link: function (scope, elm, attrs, ctrl) {
                    if(!$stateParams.id){
                        scope.inNew = true;
                    }
                    scope.getPosition = function () {
                        if (attrs.position == 'left') {
                            return 'pull-left';
                        }
                        return 'pull-right';
                    };

                    scope.back = function () {
                        $state.go(attrs.back);
                    };

                }
            };
        })
        .directive('gumgaMultiEntitySearch', function GumgaMultiEntitySearch() {
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
        })
        .directive('gumgaAddress', function GumgaAddress(GumgaAddressService, $http) {
            var template = [
                '<div class="col-md-12" style="padding-left: 0">',
                '<div class="col-md-8" style="padding-left: 0">',
                '<accordion>',
                '<accordion-group style="margin-top: 1%" is-open="true" heading="{{title}}">',
                '<div class="col-md-12">',
                '<label for="input{{id}}" gumga-translate-tag="address.zipCode"></label>',
                '<div class="input-group">',
                '<input type="text" class="form-control" ng-model="value.zipCode" id="input{{id}}" placeholder="_____-___" ng-keypress="custom($event,value.zipCode)">',
                '<span class="input-group-btn">',
                '<button class="btn btn-primary" type="button" ng-click="searchCep(value.zipCode)" ng-disabled="loader{{id}}" id="buttonSearch{{id}}">Search <i class="glyphicon glyphicon-search"></i></button>',  '<img src="./resources/images/ajax-loader.gif" style="margin-left: 5%" ng-show="loader{{id}}">',
                '</span>',
                '</div>',
                '</div>',
                '<div class="col-md-4">',
                '<label for="tipoLogradouro"><small gumga-translate-tag="address.tipoLogradouro"></small></label>',
                '<select type="text" ng-model="value.premisseType" class="form-control" ng-options="log for log in factoryData.logs"></select>',
                '</div>',
                '<div class="col-md-5" style="padding-left: 0; padding-right: 0">',
                '<label for="Logradouro"><small gumga-translate-tag="address.logradouro"></small></label>',
                '<input type="text" ng-model="value.premisse" class="form-control id="oi"/>',
                '</div>',
                '<div class="col-md-3">',
                '<label for="Número"><small gumga-translate-tag="address.numero"></small></label>',
                '<input type="text" ng-model="value.number" class="form-control" id="numberInput{{id}}"/>',
                '</div>',
                '<div class="col-md-12">',
                '<label for="Complemento"><small gumga-translate-tag="address.information"></small></label>',
                '<input type="text" ng-model="value.information" class="form-control"/>',
                '</div>',
                '<div class="col-md-7">',
                '<label for="Bairro"><small gumga-translate-tag="address.neighbourhood"></small></label>',
                '<input type="text" ng-model="value.neighbourhood" class="form-control"/>',
                '</div>',
                '<div class="col-md-5">',
                '<label for="Localidade"><small gumga-translate-tag="address.localization">Localidade</small></label>',
                '<input type="text" ng-model="value.localization" class="form-control"/>',
                '</div>',
                '<div class="col-md-4">',
                '<label for="UF"><small gumga-translate-tag="address.state">UF</small></label>',
                '<select ng-model="value.state" class="form-control" ng-options="uf for uf in factoryData.ufs"></select>',
                '</div>',
                '<div class="col-md-4">',
                '<label for="Bairro"><small gumga-translate-tag="address.country">País</small></label>',
                '<select ng-model="value.country" class="form-control" ng-options="pais for pais in factoryData.availableCountries"></select>',
                '</div>',
                '<div class="col-md-4" style="padding-top: 2%">',
                '<a class="btn btn-default pull-right" ng-href="{{returnLink(value)}}" target="_blank">Maps <i class="glyphicon glyphicon-globe"></i></a>',
                '</div>',
                '</accordion-group>',
                '</accordion>',
                '</div>',
                '</div>'];

            return {
                restrict: 'E',
                scope: {
                    value: '=',
                    onSearchCepStart: '&',
                    onSearchCepSuccess: '&',
                    onSearchCepError: '&'
                },
                template: template.join('\n'),
                link: function (scope, elm, attrs, ctrl) {
                    var eventHandler = {
                        searchCepStart: (attrs.onSearchCepStart ? scope.onSearchCepStart : angular.noop),
                        searchCepSuccess: (attrs.onSearchCepSuccess ? scope.onSearchCepSuccess : angular.noop),
                        searchCepError: (attrs.onSearchCepError ? scope.onSearchCepError: angular.noop)
                    };

                    if(scope.value == null || scope.value == undefined || JSON.stringify(scope.value) == "{}"){
                        scope.value = GumgaAddressService.returnFormattedObject();
                    }

                    scope.title = attrs.title || 'Endereço';
                    scope.id = attrs.name || Math.floor(Math.random()*984984984);
                    scope['loader' + scope.id] = false;

                    scope.custom = function ($event, cep) {
                        if ($event.charCode == 13) {
                            scope.searchCep(cep);
                        }
                    };

                    $('#input' + scope.id).mask('99999-999');

                    scope.factoryData = {
                        ufs: GumgaAddressService.everyUf,
                        logs: GumgaAddressService.everyLogradouro,
                        availableCountries: GumgaAddressService.availableCountries
                    };

                    scope.returnLink = function (value) {
                        if (!value.number) {
                            value.number = '';
                        }
                        return 'https://www.google.com.br/maps/place/' + value.premisseType + ',' + value.premisse + ',' + value.number+ ',' + value.localization;
                    };

                    scope.searchCep = function (cep) {
                        scope['loader' + scope.id] = true;
                        eventHandler.searchCepStart();
                        $http.get('http://www.gumga.com.br/services-api/public/cep/'+cep)
                            .success(function (values) {
                                eventHandler.searchCepSuccess();
                                scope['loader' + scope.id] = false;
                                if (parseInt(values.resultado) == 1) {
                                    scope.value.premisseType = values.tipo_logradouro;
                                    scope.value.premisse = values.logradouro;
                                    scope.value.localization = values.cidade;
                                    scope.value.neighbourhood = values.bairro;
                                    scope.value.state = values.uf;
                                    scope.value.country = 'Brasil';
                                    $('#numberInput' + scope.id).focus();
                                }

                            })
                            .error(function(data){
                                eventHandler.searchCepError();
                            })
                    };
                    if (scope.value.zipCode) {
                        scope.searchCep(scope.value.zipCode);
                    }
                }
            };
        })
        .directive('gumgaAlert', function GumgaAlert($rootScope) {

            return {
                restrict: 'EA',
                scope: false,
                compile: function(){

                    $rootScope.$on('dangerMessage', function (ev, data) {
                        notify('glyphicon glyphicon-exclamation-sign', data.title, data.message, 'danger');
                    });
                    $rootScope.$on('successMessage', function (ev, data) {
                        notify('glyphicon glyphicon-ok', data.title, data.message, 'success');
                    });
                    $rootScope.$on('warningMessage', function (ev, data) {
                        notify('glyphicon glyphicon-warning-sign', data.title, data.message, 'warning');
                    });
                    $rootScope.$on('infoMessage', function (ev, data) {
                        notify('glyphicon glyphicon-info-sign', data.title, data.message, 'info');
                    });

                    function notify(icon, title, message, type) {
                        $.notify({
                            icon: icon,
                            title: title,
                            message: message
                        }, {
                            type: type,
                            offset: 50,
                            timer: 100,
                            delay: 3500,
                            onShow: $rootScope.$broadcast('onNotificationShow'),
                            onClose: $rootScope.$broadcast('onNotificationClose'),
                            allow_dismiss: true,
                            animate: {
                                enter: 'animated bounceInRight',
                                exit: 'animated bounceOutRight'
                            },
                            template: '<div data-notify="container" class="col-xs-9 col-sm-3 alert alert-{0}" role="alert">' +
                            '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
                            '<span data-notify="icon"></span> ' +
                            '<span data-notify="title"><b>{1}</b></span><br> ' +
                            '<span data-notify="message">{2}</span>' +
                            '</div>'
                        });
                    }
                }
            };
        })
        .directive('gumgaUpload', function GumgaUpload($http,$parse){
            var template =
                '<div class="full-width-without-padding">' +
                '   <img src="#" alt="Uploaded Image" ng-show="!flag" class="img-rounded" style="object-fit: cover"/>' +
                '   <input type="file" id="upload" ng-show="flag"/>' +
                '   <div class="col-md-12" style="padding-left: 0">' +
                '   <button type="button" class="btn btn-link" ng-hide="flag" ng-click="deleteImage()"> Delete Image <span class="glyphicon glyphicon-trash"></span></button>' +
                '</div>' +
                '</div>';
            return {
                restrict: 'AE',
                scope: {
                    model: '=attribute',
                    uploadMethod: '&',
                    deleteMethod: '&'
                },
                template: template,
                link:function(scope,elm,attrs){
                    var model = $parse(attrs.attribute),
                        modelSetter = model.assign,
                        element = elm.find('input'),
                        image = elm.find('img')[0],
                        reader = new FileReader();
                    scope.$watch('model',function(){
                        if(scope.model){
                            if(scope.model.bytes){
                                scope.flag = false;
                                image.src = 'data:' + scope.model.mimeType + ';base64,' + scope.model.bytes;
                                image.width = 200;
                                image.height = 200;
                            }
                        } else {
                            scope.model = {};
                        }
                    });
                    if(!attrs.attribute){
                        throw 'You must pass an attribute to GumgaUpload';
                    }
                    scope.flag = true;
                    function scaleSize(maxW, maxH, currW, currH){
                        var ratio = currH / currW;
                        if(currW >= maxW && ratio <= 1){
                            currW = maxW;
                            currH = currW * ratio;
                        } else if(currH >= maxH){
                            currH = maxH;
                            currW = currH / ratio;
                        }
                        return [currW, currH];
                    }
                    scope.deleteImage = function(){
                        image.src = '';
                        scope.flag = true;
                        element[0].files = [];
                        scope.deleteMethod();
                    };
                    element.bind('change',function(){
                        scope.$apply(function(){
                            var x;
                            modelSetter(scope,element[0].files[0]);
                            scope.flag = false;
                            reader.onloadend = function(){
                                image.src = reader.result;
                                image.width = 200;
                                image.height =200;
                                var x = attrs.attribute.split('.');
                                scope.uploadMethod({image: scope[x[0]][x[1]]})
                                    .then(function(val){
                                        scope.model.name = val.data;
                                    });
                            };
                            reader.readAsDataURL(element[0].files[0]);
                        });
                    });
                }
            };
        })
        .directive('gumgaBreadcrumb',function GumgaBreadCrumb(GumgaUtils,$timeout,$rootScope){
            var template = [
                '<ol class="breadcrumb">',
                '<li ng-repeat="bread in breadcrumbs" ><a ui-sref="{{bread.state}}" gumga-translate-tag="{{bread.state}}"></a></li>',
                '</ol>'
            ];
            return {
                restrict: 'E',
                template: template.join('\n'),
                replace: true,
                link: function($scope, $elm, $attrs){
                    $scope.$on('breadChanged',function(){
                        $scope.breadcrumbs = $rootScope.breadcrumbs.filter(function(e){
                            return e.state.split('.').length >=2 ;
                        });

                    });
                }
            };
        })
});