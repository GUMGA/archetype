/**
 * Created by igorsantana on 06/05/15.
 */
define(function (require) {
    'use strict';
    var angular = require('angular'),APILocations = require('api-locations'), $ = require('jquery');
    require('angular-ui-bootstrap');
    require('angular-ui-router');
    require('gumga-translate');
    require('gumga-search');
    require('jquery-mask');
    require('notify');
    return angular.module('gumga.core', ['ui.bootstrap', 'ui.router','gumga.translate','gumga.search'])
        .service('GumgaBase', ["$http", "$q", function ($http, $q) {
            this.get = get;
            this.getById = getById;
            this.getNew = getNew;
            this.deleteAll = deleteAll;
            this.save = save;
            this.update = update;
            this.del = del;

            function get(url,params) {
                if (!params) {
                    params = defaultParams;
                }
                return $http.get(url, params);
            }

            function getById(url,id) {
                return $http.get(url + '/' + id);
            }

            function getNew(url){
                return $http.get(url+'/new');
            }

            function deleteAll(url,entities) {
                var promises = entities.map(function(entity){
                    return del(url,entity);
                });
                return $q.all(promises);
            }

            function save(url,entity) {
                return $http.post(url, entity);
            }

            function update(url,entity) {
                return $http.put(url + '/' + entity.id, entity);
            }

            function del(url,entity) {
                return $http.delete(url + '/' + entity.id);
            }

        }])
        .service('GumgaUtils', function () {
            this.errorMessages = {
                max: "You've typed more than the maximum!",
                min: "You've typed less than the minimum!",
                req: "This field is required"
            };
            this.areNotEqualInArray = function (array, index) {
                var aux = array.filter(function (element) {
                    return element == index;
                });
                return (aux.length < 1);
            };
            this.camelCase = function (string) {
                return string.slice(0, 1).toUpperCase() + string.slice(1, string.length);
            };
            this.objInArray = function(array, field) {
                var arrayAux = array.filter(function(obj){
                    return obj.field == field;
                });
                return arrayAux.length > 0;
            };
            this.checkIndex = function(array, txt) {
                var flag = -1;
                array.forEach(function (obj, index) {
                    if (obj.field == txt) {
                        flag = index;
                    }
                });
                return flag;
            };
        })
        .service('GumgaBroadcaster', ["$rootScope", function ($rootScope) {
            this.deletedEntities = deletedEntities;
            this.emitError = emitError;


            function deletedEntities(entities) {
                $rootScope.$broadcast('deletedEntities', entities);
            }

            function emitError(obj) {
                $rootScope.$broadcast('gumgaError', obj);
            }

            function emitTranslate(obj){
                $rootScope.$broadcast('gumgaTranslateEntity');
            }
        }])
        .factory('GumgaAddressService', function () {
            var factory = {};
            var ids = [];
            factory.everyUf = ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR',
                'RJ', 'RN', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO'];
            factory.everyLogradouro = ['Outros', 'Aeroporto', 'Alameda', 'Área', 'Avenida', 'Campo', 'Chácara', 'Colônia', 'Condomínio', 'Conjunto', 'Distrito',
                'Esplanada', 'Estação', 'Estrada', 'Favela', 'Fazenda', 'Feira', 'Jardim', 'Ladeira', 'Largo', 'Lago', 'Lagoa', 'Loteamento', 'Núcleo', 'Parque', 'Passarela', 'Pátio', 'Praça',
                'Quadra', 'Recanto', 'Residencial', 'Rodovia', 'Rua', 'Setor', 'Sítio', 'Travessa', 'Trevo', 'Trecho', 'Vale', 'Vereda', 'Via', 'Viaduto', 'Viela', 'Via'];
            factory.availableCountries = ['Brasil'];
            factory.setId = function(id){
                ids.push(id);
            };
            return factory;
        })
        .factory('GumgaWebStorage', function (){
            return {
                setSessionStorageItem: function(key,value){
                    window.sessionStorage.setItem(key,angular.toJson(value));
                },
                getSessionStorageItem: function(key){
                    var g = window.sessionStorage.getItem(key);
                    if(!g){
                        return null;
                    }
                    try {
                        angular.fromJson(g);
                    }catch(e){
                        return g;
                    }
                    return angular.fromJson(g);
                },
                removeSessionStorageItem: function(key){
                    window.sessionStorage.removeItem(key);
                },
                clearSessionStorage: function(){
                    window.sessionStorage.clear();
                },
                getNumberOfItemsInSessionStorage: function(){
                    return window.sessionStorage.length;
                },
                setLocalStorageItem: function(key,value){
                    window.localStorage.setItem(key,angular.toJson(value));
                },
                getLocalStorageItem: function(key){
                    var g = window.localStorage.getItem(key);
                    try {
                        angular.fromJson(g);
                    }catch(e){
                        return g;
                    }
                    return angular.fromJson(g);
                },
                removeLocalStorageItem: function(key){
                    window.localStorage.removeItem(key);
                },
                clearLocalStorage: function(){
                    window.localStorage.clear();
                },
                getNumberOfItemsInLocalStorage: function(){
                    return window.localStorage.length;
                }

            };
        })
        .directive('gumgaNav', ["$state", function ($state) {
            var template = [
                '<nav id="navbar">',
                '   <a href="#" class="navbar-logo">{{title | uppercase}}</a>',
                '<strong style="margin-left: 1%"> {{organization}} </strong>',
                '   <b class="pull-right"><a href class="status-navbar" ng-click="doLogout()">Logout from {{user}}<i class="glyphicon glyphicon-log-out"></i> </a></b>',
                '    <a ng-click="treatUrl()" class="btn btn-default btn-sm pull-right" style="margin-top: 8px;margin-right: 10%">Search</a>',
                '   <input type="text" ng-model="search" class="navbar-input" placeholder="Search">',
                '</nav>'
            ];
            return {
                restrict: 'E',
                replace: true,
                scope: false,
                template: template.join('\n'),
                link: function (scope, el, attrs) {
                    scope.title = attrs.title; 
                    try {
                    scope.organization = scope.$parent.loggedUser.organization;
                    scope.user = scope.$parent.loggedUser.user;
                    } catch (e){
                        scope.organization = ' '
                        scope.user = ' ';
                    }
                    var tags = el.children();
                    var input = tags[3];
                    scope.treatUrl = function () {
                        $state.go('multientity', {'search': scope.search});
                    };

                    input.onkeypress = function (k) {
                        if (k.keyCode == 13)
                            scope.treatUrl();

                    };

                    scope.doLogout = function () {
                        window.sessionStorage.removeItem('token');
                        $state.go('login');
                    };
                }
            };
        }])
        .directive('gumgaMenu',["$http", "$compile", function ($http, $compile) {
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
                        template.push('<img ng-src="'+ attrs.image +'" alt="logo" width="40%" class="img-centered">');
                        for (var i = 0; i < scope.dados.length; i++) {
                            if (keyIsValid(scope.dados[i].key)) {

                                template.push(gerarNavPill(scope.dados[i], 'menu', {count:-1, label:null}));
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
                            template.push('<i  class="glyphicon glyphicon-minus ' + type + '-color"  ng-click="resetarMenu(' + count + ')"></i>');
                        }
                        template.push('<a ui-sref="' + param.URL + '" ng-class="v[' + count + '].isActive ? \'is-active\' : \' \'"');
                        if(parent.label === null || param.filhos.length > 0){
                            template.push('gumga-translate-tag="'+ param.label +'.menuLabel">');
                        }else if(param.filhos.length === 0){
                            template.push('gumga-translate-tag="'+ parent.label +'.'+ param.label +'">');
                        }
                        template.push(param.label);
                        template.push('</a>');
                        var aux = count;

                        count++;
                        if (param.filhos.length > 0) {
                            template.push('<ul ng-class="v[' + (count - 1) + '].isActive ? \' submenu-group-ativo\' : \'submenu-group\'" class="menu-holder">');
                            for (var i = 0; i < param.filhos.length; i++) {
                                if (keyIsValid(param.filhos[i].key)) {
                                    template.push(gerarNavPill(param.filhos[i], 'submenu', {count:aux,label:param.label}));
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
        }])
        .directive('gumgaTable', ["GumgaUtils", "$compile", function (GumgaUtils, $compile) {

            function LinkFn(scope, elm, attrs, ctrl, transcludeFn) {
                scope.indexes = [];
                scope.trs = [];
                scope.$parent.selectedEntities = [];
                scope.objectColumn = [];
                var rawTableConfig = {
                    multi: scope.multi,
                    list: [],
                    sortFn: scope.sort,
                    size: attrs.size,
                    class: attrs.tableClass,
                    columns: attrs.columns,
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
                                        break;
                                    case 'OBJECT-COLUMN':
                                        scope.objectColumn.push({column: cloneEl.getAttribute('column'),value: cloneEl.getAttribute('property')});
                                        break;
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
                            template.push('<div class="full-width-without-padding" style="margin-top: 1%"><table class="table table-' + config.class + ' ">');
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
                        template.push('<tr ng-class="returnClass($index)" ng-repeat="entity in tableconfig.list" ng-click="handleSingle(entity,$index)">' + generateTableCell(config) + '</tr>');
                    } else {
                        template.push('<tr ng-class="returnClass($index)" ng-repeat="entity in tableconfig.list" ng-click="handleMultiple(entity,$index)">' + generateTableCell(config) + '</tr>');
                    }
                    template.push('</tbody>');
                    template.push('</table></div>');
                    elm.append($compile(template.join('\n'))(scope));

                }
                function checkObject(field){
                    for(var i = 0; i < scope.objectColumn.length;i++){
                        if(scope.objectColumn[i].column === field){
                            return '{{entity.'+  scope.objectColumn[i].value +'}}';
                        }
                    }
                    return -1;
                }

                function generateTableCell(config) {
                    var template = [];
                    config.columns.forEach(function (elm) {
                        if (elm.trueValue) {
                            template.push('<td style="text-align: center">{{entity.' + elm.field + ' === true? \'' + elm.trueValue + '\' : \'' + elm.falseValue + '\'}}</td>');
                        } else if(checkObject(elm.field) != -1){
                            template.push('<td>' + checkObject(elm.field) +' </td>');
                        } else {
                            template.push('<td>{{entity.'+ elm.field + '}} </td>');
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
                    console.log(obj);
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
                        scope.$parent.selectedEntities.push(entity);
                    } else {
                        scope.indexes.splice(scope.indexes.indexOf(index), 1);
                        scope.$parent.selectedEntities.splice(scope.$parent.selectedEntities.indexOf(entity), 1);
                    }
                };

                scope.handleSingle = function (entity, index) {
                    if (scope.indexes.length >= 1) {
                        scope.indexes = [];
                        scope.$parent.selectedEntities = [];
                    }
                    scope.indexes.push(index);
                    scope.$parent.selectedEntities.push(entity);
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
        }])
        .directive('gumgaMax', ["GumgaBroadcaster", "$timeout", function (GumgaBroadcaster, $timeout) {
            return {
                restrict: 'A',
                require: 'ngModel',
                priority: 10,
                link: function (scope, elm, attrs, ctrl) {
                    function emit(boolean) {
                        GumgaBroadcaster.emitError({name: attrs.name, status: boolean, field: 'max'});
                        ctrl.$setValidity('gumgaError', boolean);
                    }
                    var max = parseInt(attrs.gumgaMax);
                    var txt = 0;

                    if(ctrl.$$rawModelValue){
                        txt = ctrl.$$rawModelValue.length;
                    }

                    $timeout(function () {
                        emit(txt <= max);
                    }, 20);

                    ctrl.$parsers.push(function (txt) {
                        emit(txt.length <= max);
                        return txt;
                    });
                }
            };
        }])
        .directive('gumgaMin', ["GumgaBroadcaster", "$timeout", function (GumgaBroadcaster,$timeout) {
            return {
                restrict: 'A',
                require: 'ngModel',
                priority: 10,
                link: function (scope, elm, attrs, ctrl) {
                    var min = parseInt(attrs.gumgaMin);

                    function emit(boolean){
                        GumgaBroadcaster.emitError({name: attrs.name, status: boolean, field: 'min'});
                        ctrl.$setValidity('gumgaError', boolean);
                    }
                    $timeout(function(){
                        var txt = 0;
                        if(ctrl.$$rawModelValue){
                            txt = ctrl.$$rawModelValue.length;
                        }
                        emit(min <= txt);
                    },20);

                    ctrl.$parsers.push(function (txt) {
                        //Se for false, está errado.
                        emit(min <= txt.length);
                        return txt;
                    });
                }
            };
        }])
        .directive('gumgaRequired', ["GumgaBroadcaster", "$timeout", function (GumgaBroadcaster, $timeout) {
            return {
                restrict: 'A',
                require: 'ngModel',
                scope: false,
                link: function (scope, elm, attrs, ctrl) {
                    $timeout(function () {
                        if (!angular.isDefined(ctrl.$$rawModelValue)) {
                            ctrl.$setValidity('required', false);
                            GumgaBroadcaster.emitError({name: attrs.name, status: false, field: 'req',element: elm});
                        }
                    }, 20);

                    ctrl.$parsers.push(function (txt) {
                        var boolean = txt.length >= 1;
                        //Se for false, está errado.
                        ctrl.$setValidity('required', boolean);
                        GumgaBroadcaster.emitError({name: attrs.name, status: boolean, field: 'req'});
                        return txt;
                    });
                }
            };
        }])
        .directive('gumgaErrors', ["GumgaUtils", function (GumgaUtils) {
            return {
                restrict: 'E',
                scope: {},
                require: '^form',
                template: '<ul><li ng-repeat="err in errs track by $index" class="text-danger">{{err.message}}</li></ul>',
                link: function (scope, elm, attrs) {
                    scope.errs = [];
                    var input = $('input[name="' + attrs.name + '"]');

                    function addAndRemoveClass(_bool){
                        if(_bool){
                            if(input.hasClass('success') && input.removeClass('success')){
                                input.addClass('error');
                            }
                        } else {
                            if(input.hasClass('error') && input.removeClass('error') && scope.errs.length < 1){
                                input.addClass('success');
                            }
                        }
                    }

                    function updateMessages(obj,msg) {
                        if (!obj.status && !GumgaUtils.objInArray(scope.errs, obj.field)) {
                            scope.errs.push({message: msg, field: obj.field});
                            addAndRemoveClass(true);
                        }else if(obj.status && GumgaUtils.objInArray(scope.errs, obj.field)){
                            scope.errs.splice(GumgaUtils.checkIndex(scope.errs, obj.field), 1);
                            addAndRemoveClass(false);
                        }
                    }

                    scope.$on('gumgaError',function(ev,obj){
                        var message;
                        if (obj.name === attrs.name) {
                            switch(obj.field){
                                case 'req':
                                    message = GumgaUtils.errorMessages.req;
                                    break;
                                case 'max':
                                    message = GumgaUtils.errorMessages.max;
                                    break;
                                case 'min':
                                    message = GumgaUtils.errorMessages.min;
                            }
                        }
                        updateMessages(obj,message);
                    });
                }
            };
        }])
        .directive('gumgaFormButtons',["$state", "$stateParams", function ($state, $stateParams) {
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
                '       <button class="btn btn-primary" style="margin-right: 0em" ng-click="do()" ng-disabled="!valid" type="button"><i class="glyphicon glyphicon-floppy-saved"></i> Save</button>' +
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
        }])
        .directive('gumgaMultiEntitySearch',function () {
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
        .directive('gumgaAddress', ["GumgaAddressService", "$http", function (GumgaAddressService, $http) {
            var template = [
                '<div class="col-md-12" style="padding-left: 0">',
                '<div class="col-md-8" style="padding-left: 0">',
                '<accordion>',
                '<accordion-group style="margin-top: 1%" is-open="true" heading="{{title}}">',
                '<div class="col-md-12">',
                '<label for="input{{id}}" gumga-translate-tag="address.cep"></label>',
                '<div class="input-group">',
                '<input type="text" class="form-control" ng-model="value.cep" id="input{{id}}" placeholder="_____-___" ng-keypress="custom($event,value.cep)">',
                '<span class="input-group-btn">',
                '<button class="btn btn-primary" type="button" ng-click="searchCep(value.cep)" ng-disabled="loader{{id}}" id="buttonSearch{{id}}">Search <i class="glyphicon glyphicon-search"></i></button>',  '<img src="../resources/images/ajax-loader.gif" style="margin-left: 5%" ng-show="loader{{id}}">',
                '</span>',
                '</div>',
                '</div>',
                '<div class="col-md-4">',
                '<label for="tipoLogradouro"><small gumga-translate-tag="address.tipoLogradouro"></small></label>',
                '<select type="text" ng-model="value.tipoLogradouro" class="form-control" ng-options="log for log in factoryData.logs"/>',
                '</div>',
                '<div class="col-md-5" style="padding-left: 0; padding-right: 0">',
                '<label for="Logradouro"><small gumga-translate-tag="address.logradouro"></small></label>',
                '<input type="text" ng-model="value.logradouro" class="form-control" ng-model="value.logradouro" id="oi"/>',
                '</div>',
                '<div class="col-md-3">',
                '<label for="Número"><small gumga-translate-tag="address.numero"></small></label>',
                '<input type="text" ng-model="value.numero" class="form-control" id="numberInput{{id}}"/>',
                '</div>',
                '<div class="col-md-12">',
                '<label for="Complemento"><small gumga-translate-tag="address.complemento"></small></label>',
                '<input type="text" ng-model="value.complemento" class="form-control"/>',
                '</div>',
                '<div class="col-md-7">',
                '<label for="Bairro"><small gumga-translate-tag="address.bairro"></small></label>',
                '<input type="text" ng-model="value.bairro" class="form-control"/>',
                '</div>',
                '<div class="col-md-5">',
                '<label for="Localidade"><small gumga-translate-tag="address.localidade">Localidade</small></label>',
                '<input type="text" ng-model="value.localidade" class="form-control"/>',
                '</div>',
                '<div class="col-md-4">',
                '<label for="UF"><small gumga-translate-tag="address.uf">UF</small></label>',
                '<select ng-model="value.uf" class="form-control" ng-options="uf for uf in factoryData.ufs"/>',
                '</div>',
                '<div class="col-md-4">',
                '<label for="Bairro"><small gumga-translate-tag="address.pais">País</small></label>',
                '<select ng-model="value.pais" class="form-control" ng-options="pais for pais in factoryData.availableCountries"/>',
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
                    value: '='
                },
                template: template.join('\n'),
                link: function (scope, elm, attrs, ctrl) {
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
                        if (!value.numero) {
                            value.numero = '';
                        }
                        return 'https://www.google.com.br/maps/place/' + value.tipoLogradouro + ',' + value.logradouro + ',' + value.numero + ',' + value.localidade;
                    };
                    scope.searchCep = function (cep) {
                        scope['loader' + scope.id] = true;
                        $http.get('http://www.gumga.com.br/services-api/public/cep/' + cep)
                            .success(function (values) {
                                scope['loader' + scope.id] = false;
                                if (parseInt(values.resultado) == 1) {
                                    scope.value.tipoLogradouro = values.tipo_logradouro;
                                    scope.value.logradouro = values.logradouro;
                                    scope.value.localidade = values.cidade;
                                    scope.value.bairro = values.bairro;
                                    scope.value.uf = values.uf;
                                    scope.value.pais = 'Brasil';
                                    $('#numberInput' + scope.id).focus();
                                }
                            });
                    };
                    if (scope.value.cep) {
                        scope.searchCep(scope.value.cep);
                    }
                }
            };
        }])
        .directive('gumgaOneToMany',["$modal", function ($modal){
            var template = [
                '<div class="col-md-12" style="padding-left: 0;padding-right: 0">',
                '   <button type="button" class="btn btn-default" ng-click="newModal()">New</button>',
                '   <ul class="list-group">',
                '       <li ng-repeat="child in children" class="list-group-item">',
                '           {{child[property]}}',
                '           <button type="button" class="btn btn-default pull-right btn-sm" ng-click="newModal(child)"><i class="glyphicon glyphicon-pencil"></i></button>',
                '           <button type="button" class="btn btn-danger pull-right btn-sm" ng-click="removeFromList(child)"><i class="glyphicon glyphicon-remove"></i></button>',
                '       <div class="clearfix"></div></li>',
                '   <ul>',
                '</div>',
                '<div class="clearfix"></div>'
            ];

            return {
                restrict: 'E',
                template: template.join('\n'),
                scope: {
                    children: '=',
                    templateUrl: '@',
                    property: '@displayableProperty',
                    name: '@',
                    controller: '@'
                },
                link: function (scope,elm,attrs) {
                    scope.newModal = newModal;
                    scope.removeFromList = removeFromList;
                    scope.getFromModal = getFromModal;
                    var name = attrs.name || 'New';
                    if(!scope.children) throw 'You must provide a list to GumgaOneToMany';
                    if(!scope.templateUrl) throw 'You must provide a templateUrl for the modal';
                    if(!scope.property) throw 'You must provide a property to display in GumgaOneToMany';
                    if(!scope.controller) throw 'You must provide a controller to the modal';

                    function getFromModal(selected){
                        if(JSON.stringify(scope.etty) !== '{}'){
                            scope.children.splice(scope.children.indexOf(scope.etty),1,selected);
                        } else {
                            scope.children.push(selected);
                        }
                    }

                    function removeFromList(obj){
                        scope.children.splice(scope.children.indexOf(obj),1);
                    }

                    function newModal(obj){
                        scope.etty = {};
                        if(obj){
                            scope.etty= obj;
                        }

                        var modalInstance = $modal.open({
                            templateUrl: scope.templateUrl,
                            controller: scope.controller,
                            resolve: {
                                entity: function(){
                                    return scope.etty;
                                }
                            }
                        });

                        modalInstance.result.then(getFromModal);
                    }


                }
            };
        }])
        .directive('gumgaManyToMany', ["$compile", "GumgaUtils", function ($compile,GumgaUtils) {
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
                        scope.rightList.forEach(function(objRight){
                            scope.leftList.forEach(function(objLeft){
                                if(objRight.id == objLeft.id){
                                    scope.leftList.splice(scope.leftList.indexOf(objLeft),1);
                                }
                            });
                        });
                    });

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
        }])
        .directive('gumgaManyToOne',function (){
            var template = 	'<div class="col-md-12" style="padding: 0">';
            template += '<div class="input-group" ng-init="open = false">';
            template +='<input class="form-control" ng-keydown="inputKeyEvent($event)" ng-change="refreshList(param)" ng-model="param" type="text">';
            template +='<span class="input-group-btn">';
            template +='<button class=" btn btn-default" ng-click="open = !open" type="button"><span class="caret"></span></button>';
            template +='</div>';
            template +='<ul class="list-group-z" ng-if="open">';
            template +='<li class="list-group-item" ng-click="selectObj(choice);" ng-repeat="choice in list">';
            template +='<span>{{choice[field]}}</span>';
            template +='</li>';
            template +='</ul>';
            template +='</div>';

            return {
                restrict : 'E',
                template: template,
                scope : {
                    model:'=',
                    list:'=',
                    searchMethod: '&'
                },
                link: function(scope, elm, attrs){
                    scope.field = attrs.field;
                    if(scope.model){
                        var aux = angular.copy(scope.model);
                        scope.param = aux[scope.field];
                    }

                    scope.openButton = function(){
                        if(scope.list.length < 1){
                            scope.searchMethod();
                        }
                        scope.open = !scope.open;
                    };

                    scope.selectObj = function(obj){
                        scope.model = obj;

                        var aux = angular.copy(obj);
                        scope.param = aux[scope.field];
                        scope.open = false;
                    };

                    scope.inputKeyEvent = function(event){
                        if(event.keyCode == 40){
                            scope.open = true;
                        }
                    };

                    scope.refreshList = function(param){
                        if(!scope.open){
                            scope.open = !scope.open;
                        }
                        scope.model = {};
                        scope.searchMethod({param:param});
                    };
                }
            };
        })
        .directive('gumgaAlert', ["$rootScope", function ($rootScope) {

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
        }])
        .directive('gumgaUpload',  ["$http", "$parse", function ($http,$parse){
            var template =
                '<div class="col-md-12">' +
                '   <label>{{attr}} </label>' +
                '   <img src="#" alt="Uploaded Image" ng-hide="flag"/>' +
                '   <input type="file" id="upload" ng-show="flag"/>' +
                '   <button type="button" class="btn btn-sm btn-danger" ng-hide="flag" ng-click="deleteImage()"> <span class="glyphicon glyphicon-trash"></span></button>' +
                '</div>';
            return {
                restrict: 'AE',
                scope: {
                    url: '@'
                },
                template: template,
                link:function(scope,elm,attrs){
                    scope.attr = attrs.attribute || "NULL";
                    if(!attrs.attribute){
                        throw 'You must pass an attribute to GumgaUpload';
                    }
                    var model = $parse('upload'),
                        modelSetter = model.assign,
                        element = elm.find('input'),
                        image = elm.find('img')[0],
                        reader = new FileReader();
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
                        scope.upload = {};
                        image.src = '';
                        scope.flag = true;
                        element[0].files = [];
                        var fd = new FormData();
                        fd.append(attrs.attribute,{});
                        $http.delete(scope.url,fd,{
                            transformRequest: angular.identity,
                            headers: {'Content-Type': undefined}
                        });
                    };


                    element.bind('change',function(){
                        scope.$apply(function(){
                            modelSetter(scope,element[0].files[0]);
                            scope.flag = false;
                            reader.onloadend = function(){
                                image.src = reader.result;
                                var newSize = scaleSize(200,200,image.width,image.height);
                                image.width = newSize[0];
                                image.height =newSize[1];
                                doUpload();
                            };
                            reader.readAsDataURL(element[0].files[0]);
                        });
                    });

                    function doUpload(){
                        var fd = new FormData();
                        fd.append(attrs.attribute,scope.upload);
                        $http.post(scope.url,fd,{
                            transformRequest: angular.identity,
                            headers: {'Content-Type': undefined}
                        });
                    }
                }
            };
        }])
        .directive('gumgaBreadcrumb',["$rootScope", function($rootScope){
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
                        $scope.breadcrumbs = $rootScope.breadcrumbs;
                    });
                }
            };
        }])
        .controller('MultiEntityController', ["SearchPromise", function (SearchPromise) {
            var multi = this;
            multi.search = SearchPromise.data;
        }])
        .config(["$stateProvider", "$httpProvider", function ($stateProvider, $httpProvider) {
            var template = [
                '<gumga-nav></gumga-nav>',
                '<gumga-menu menu-url="gumga-menu.json" keys-url="keys.json"></gumga-menu>',
                '<div class="gumga-container">',
                '<gumga-multi-entity-search data="multi.search"></gumga-multi-entity-search>',
                '</div>'];
            $stateProvider
                .state('multientity', {
                    url: '/multientity/:search',
                    template: template.join('\n'),
                    controller: 'MultiEntityController',
                    controllerAs: 'multi',
                    data: {
                        id: 2
                    },
                    resolve: {
                        SearchPromise: ['$stateParams', '$http', function ($stateParams, $http) {
                            var url = APILocations.apiLocation + 'public/multisearch/search/';
                            return $http.get(url + $stateParams.search);
                        }]
                    }
                });
        }]);
});
