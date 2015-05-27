/**
 * Created by igorsantana on 06/05/15.
 */
define(function (require) {
    'use strict';
    var angular = require('angular'),APILocations = require('app/apiLocations'), $ = require('jquery');
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
        this.postImage = postImage;
        this.deleteImage = deleteImage;
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

        function postImage(url,attribute,model){
            var fd = new FormData();
            fd.append(attribute,model);
            return $http.post('http://192.168.25.201:8084/security-api/api/user/' + attribute +'/',fd,{
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            });
        }

        function deleteImage(url,attribute){
            var fd = new FormData();
            fd.append(attribute,{});
            return $http.delete('http://192.168.25.201:8084/security-api/api/user/' + attribute +'/',fd,{
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            });

        }

    }])
        .service('GumgaUtils', function() {

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
        .service('GumgaBroadcaster', ["$rootScope", function($rootScope) {
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
        .factory('GumgaKeyboard', function (){
	var Keyboard = require('mousetrap'); 
        return {
            addBind: function(key,fn,event){
                if(key && fn){
                    Keyboard.bind(key,fn,event? event : '');
                    this.__binds.push(key);
                }

            },removeBind: function(key){
                if(key){
                    Keyboard.unbind(key);
                    this.__binds.splice(this.__binds.indexOf(key),1);
                }
            },
            triggerBoundedEvent: function(key){
                if(key){
                    Keyboard.trigger(key);
                }
            },
            bindToElement: function(element,key,fn,event){
                if(element && key && fn){
                    Keyboard(element).bind(key,fn,event ? event: '');
                    this.__binds.push(key);
                }
            },
            unbindFromElement: function(element,key){
              if(element && key) {
                    Keyboard(element).unbind(key);
              }
            },
            bindToMultipleElements: function(arrayOfElements,key,fn,event){
                for(var i = 0, len = arrayOfElements.length; i < len; i++) if(key && fn){
                    Keyboard(arrayOfElements[i]).bind(key,fn,event? event: '');
                    this.__binds.push(key);
                }
            },
            getBinds: function(){
                return this.__binds;
            },
            __binds: []
        }


    })
        .factory('GumgaAddressService', function() {
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
        
        factory.returnFormattedObject = function(){
            return {
                zipCode : null,
                premisseType: null,
                premisse: null,
                number: null,
                information: null,
                neighbourhood: null,
                localization: null,
                state: null,
                country: null
            }
        }
        return factory;
    })
        .factory('GumgaWebStorage', function(){
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
        .directive('gumgaNav', function ($state,GumgaWebStorage,$modal,$rootScope) {

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

		scope.navlinks = [
                   {text:'Change Password',glyphicon: 'glyphicon glyphicon-user',value: 'pass'},
                   {text: 'Logout',glyphicon: 'glyphicon glyphicon-log-out',value: 'logout'}
               ];

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
			    if(attrs.state){
				$state.go(attrs.state);
			    } else {
				$state.go('login.log');	
				}
                            
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
        .directive('gumgaMenu',function ($http, $compile) {
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
			if(attrs.image){
                    		template.push('<img ng-src="' + attrs.image + '" alt="logo" width="40%" class="img-centered">');
			}
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
                    
                        template.push('<i  class=" ' + param.icon + '  " style="color: #fff" ng-click="resetarMenu(' + count + ')"></i>');
                    
                    template.push('<a ui-sref="' + param.URL + '" ng-class="v[' + count + '].isActive ? \'is-active\' : \' \'"');
                    if (parent.label === null || param.filhos.length > 0) {
                        template.push('gumga-translate-tag="' + param.label.toLowerCase() + '.menuLabel">');
                    } else if (param.filhos.length === 0) {
                        template.push('gumga-translate-tag="' + parent.label.toLowerCase() + '.' + param.label.toLowerCase() + '">');
                    }
                    template.push(param.label);
                    template.push('</a>');

		    if (param.filhos.length > 0 && verificarPermicaoFilho(param.filhos)) {
                        template.push('<i  ng-class="v[' + count + '].isActive ? \' glyphicon glyphicon-chevron-down \' : \'glyphicon glyphicon-chevron-left\'" class="fa ' + type + '-color pull-right" style="margin-top: 3%" ng-click="resetarMenu(' + count + ')"></i>');
                    }
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
        .directive('gumgaTable', function (GumgaUtils, $compile,$rootScope,$state,GumgaKeyboard,$timeout) {
        return {
            restrict: 'E',
            scope: {
                multi: '=multiSelection',
                list: '=values',
                sort: '&sortFunction',
                rowClass: '='
            },
            link: LinkFn,
            transclude: true
        };

        function LinkFn(scope, elm, attrs, ctrl, transcludeFn) {

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
                scope.selectedIndex = index;
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


    })
        .directive('gumgaMax', function (GumgaBroadcaster, $timeout) {
        return {
            restrict: 'A',
            require: 'ngModel',
            priority: 10,
            link: function (scope, elm, attrs, ctrl) {

                function emit(boolean){
                    GumgaBroadcaster.emitError({name: attrs.name, status: boolean, field: 'max'});
                    ctrl.$setValidity('max', boolean);
                }



                ctrl.$parsers.push(function (txt) {
                    switch(elm[0].type){
                        case 'text':
                            emit(txt.length <= parseInt(attrs.gumgaMax));
                            break;
                        case 'number':
                            emit(parseInt(txt) <= parseInt(attrs.gumgaMax));
                            break;
                        case 'date':
                            emit(new Date(txt) <= new Date(attrs.gumgaMax));
                            break;
                        case 'time':
                        case 'select-one':
                        case 'datetime-local':
                        case 'color':
                        case 'email':
                        case 'url':
                        default:
                            break;
                    }
                    return txt;
                });
            }
        };
    })
        .directive('gumgaMin', function (GumgaBroadcaster,$timeout) {
        return {
            restrict: 'A',
            require: 'ngModel',
            priority: 10,
            link: function (scope, elm, attrs, ctrl) {

                function emit(bool){
                    GumgaBroadcaster.emitError({name: attrs.name, status: bool, field: 'min'});
                    ctrl.$setValidity('min', bool);
                }

                $timeout(function(){
                    if(!ctrl.$modelValue){
                        emit(false);
                    } else {
                        emit(true);
                    }
                },20);

                ctrl.$parsers.push(function (txt) {
                    switch(elm[0].type){
                        case 'text':
                            emit(txt.length >= parseInt(attrs.gumgaMin));
                            break;
                        case 'number':
                            emit(parseInt(txt) >= parseInt(attrs.gumgaMin));
                            break;
                        case 'date':
                            emit(new Date(txt) >= new Date(attrs.gumgaMin));
                            break;
                        case 'time':
                        case 'select-one':
                        case 'datetime-local':
                        case 'color':
                        case 'email':
                        case 'url':
                        default:
                            emit(txt != undefined);
                            break;
                    }
                    return txt;
                });
            }
        };
    })
        .directive('gumgaRequired', function (GumgaBroadcaster, $timeout) {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: false,
            link: function (scope, elm, attrs, ctrl) {
                if(!attrs.name){
                    throw 'You must pass a name to the input that contains GumgaRequired';
                }

                function doThings(bool){
                    ctrl.$setValidity('required', bool) ;
                    GumgaBroadcaster.emitError({name: attrs.name,status: bool, field: 'req'});
                }

                $timeout(function () {
                    if(!ctrl.$modelValue){
                        if(elm[0].type == 'color'){
                            doThings(true);
                        } else {
                            doThings(false);
                        }
                    } else {
                        doThings(true);
                    }
                }, 20);



                ctrl.$parsers.push(function (txt) {
                    switch(elm[0].type){
                        case undefined:
                            break;
                        case 'text':
                            doThings(txt != '');
                            break;
                        case 'number':
                            doThings(txt != null);
                            break;
                        case 'select-one':
                        case 'date':
                        case 'datetime-local':
                        case 'color':
                        case 'email':
                        case 'time':
                        case 'url':
                        default:
                            doThings(txt != undefined);
                            break;
                    }
                    return txt;
                });
            }
        };
    })
        .directive('gumgaErrors', function (GumgaUtils) {
        return {
            restrict: 'E',
            scope: {},
            require: '^form',
            template: '<div class="full-width-without-padding"><ul><li ng-repeat="err in errs track by $index" class="text-danger">{{err.message}}</li></ul></div>',
            link: function (scope, elm, attrs) {
                scope.errs = [];

                var tags = document.getElementsByName(attrs.name);
                var input;
                for(var i = 0, len = tags.length;i < len; i++){
                    if(tags[i].nodeName !== 'GUMGA-ERRORS'){
                        input = angular.element(tags[i]);
                        break;
                    }
                }
                //console.log(input);

                function changeClass(){
                    if(scope.errs.length > 0 ){
                        if(input.hasClass('success')) input.removeClass('success');
                        input.addClass('error');
                    } else {
                        if(input.hasClass('error')) input.removeClass('error');
                        input.addClass('success')
                    }
                }

                function updateMessages(obj,msg) {
                    if (!obj.status && !GumgaUtils.objInArray(scope.errs, obj.field)) {
                        scope.errs.push({message: msg, field: obj.field});
                        changeClass();
                    }else if(obj.status && GumgaUtils.objInArray(scope.errs, obj.field)){
                        scope.errs.splice(GumgaUtils.checkIndex(scope.errs, obj.field), 1);
                        changeClass();
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
                        updateMessages(obj,message);
                    }
                });
            }
        };
    })
        .directive('gumgaFormButtons',function ($state, $stateParams) {
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
    })
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
        .directive('gumgaAddress', function(GumgaAddressService, $http) {
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
            '<select type="text" ng-model="value.premisseType" class="form-control" ng-options="log for log in factoryData.logs"/>',
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
            '<select ng-model="value.state" class="form-control" ng-options="uf for uf in factoryData.ufs"/>',
            '</div>',
            '<div class="col-md-4">',
            '<label for="Bairro"><small gumga-translate-tag="address.country">País</small></label>',
            '<select ng-model="value.country" class="form-control" ng-options="pais for pais in factoryData.availableCountries"/>',
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

                $(document).ready(function () {
                    $('#input' + scope.id).mask('99999-999');
                });


                scope.factoryData = {
                    ufs: GumgaAddressService.everyUf,
                    logs: GumgaAddressService.everyLogradouro,
                    availableCountries: GumgaAddressService.availableCountries
                };

                scope.returnLink = function (value) {
                    if (!value.number) {
                        value.number = '';
                    }
                    return 'https://www.google.com.br/maps/place/' + value.tipoLogradouro + ',' + value.logradouro + ',' + value.numero + ',' + value.localidade;
                };

                scope.searchCep = function (cep) {
                    scope['loader' + scope.id] = true;
                    $http.get('http://www.gumga.com.br/services-api/public/cep/'+cep)
                        .success(function (values) {
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

                        });
                };
                if (scope.value.zipCode) {
                    scope.searchCep(scope.value.zipCode);
                }
            }
        };
    })
        .directive('gumgaOneToMany',function ($modal){
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
                            },
                            title: function(){
                                return scope.name;
                            }
                        }
                    });

                    modalInstance.result.then(getFromModal);
                }


            }
        };
    })
        .directive('gumgaManyToMany', function ($compile,GumgaUtils,$modal) {

        return {
            restrict: 'E',
            scope: {
                left: '=leftList',
                right: '=rightList',
                leftFn: '&leftSearch',
                rightFn: '&rightSearch',
                postMethod: '&'
            },
            transclude: true,
            link: function (scope, elm, attrs, ctrl, transcludeFn) {
                scope.texts = {left: '',right: ''};
                scope.template = '';

                scope.labels = {left: attrs.leftLabel,right: attrs.rightLabel};

                var mockObject = {};


                transcludeFn(scope,function(cloneEl){
                    angular.forEach(cloneEl,function(cl){
                        var element = angular.element(cl)[0];
                        switch(element.nodeName){
                            case 'LEFT-FIELD':
                                scope.texts.left = element.innerHTML;
                                break;
                            case 'RIGHT-FIELD':
                                scope.texts.right = element.innerHTML;
                                break;
                        }
                    });
                    checkErrors();
                });

                mountRenderedContent();

                scope.$watch('left',function(){
                    checkErrors();
                    copyObject(scope.left[0]);
                });

                function copyObject(obj) {
                    for (var key in obj) if (obj.hasOwnProperty(key)) {
                        mockObject[key] = null;
                    }
                }


                function checkErrors(){
                    var errorTexts = [];
                    if(!attrs.leftList || !attrs.rightList){
                        errorTexts.push('You haven\'t provided a list to GumgaManyToMany directive');
                    }
                    if(!scope.texts.left || !scope.texts.right){
                        errorTexts.push('You have\'nt provided the content to GumgaManyToMany directive');
                    }
                    errorTexts.forEach(function(txt){
                        throw txt;
                    });
                    removeDuplicates();
                }

                function removeDuplicates(){
                    scope.leftAux = scope.left;
                    scope.right.forEach(function(elm){
                        var aux = scope.leftAux.map(function(el,$index){
                            if(el[attrs.filterParameter] == elm[attrs.filterParameter]){
                                return $index;
                            }
                        }).filter(function(e){return e === 0 || e});
                        if(aux.length > 0){
                            aux.forEach(function(elm){
                                scope.leftAux.splice(elm,1);
                            })
                        }
                    });
                }


                function mountRenderedContent(){
                    var text =
                        '<div class="full-width-without-padding">\n'+
                        '   <div class="col-md-6" style="padding-left: 0">\n'+
                        '       <strong><small>{{labels.left}}</small></strong>\n' +
                        '       <div class="{{showClass()}}">'+
                        '           <input type="text" ng-model="leftFilter" class="form-control"' + doesItHaveFunction('left',0) + ' ng-change="leftFn({param: leftFilter})" ng-model-options="{ updateOn: \'default blur\', debounce: {\'default\': 300, \'blur\': 0} }"/>\n' +
                        '           <span class="input-group-addon" ng-show="showPlus(leftFilter)"> ' +
                        '               <button type="button" style="border: 0;background-color: #EEE" ng-click="addNew(leftFilter)"><i class="glyphicon glyphicon-plus"></i></button>' +
                        '           </span>' +
                        '       </div>' +
                        '       <ul class="list-group" style="max-height: 300px;overflow: auto;">\n' +
                        '           <li class="list-group-item" style="display:flex" ng-repeat="$value in leftAux ' + doesItHaveFunction('left',1) + '">' +
                        '               <a class="inside-list-anchor" ng-click="removeFromAndAddTo(leftAux,right,$value)">' + scope.texts.left + '</a>' +
                        '              <button class="badge" style="background-color: #81AEDA;cursor: pointer;border: 0" ng-click="halp($value)"><i class="glyphicon glyphicon-resize-full"></i></button>' +
                        '           </li>\n'+
                        '       </ul>'+
                        '   </div>\n'+
                        '   <div class="col-md-6" style="padding-right: 0">\n'+
                        '       <strong><small>{{labels.right}}</small></strong>\n'+
                        '       <input type="text" ng-model="rightFilter" class="form-control"' + doesItHaveFunction('right',0) + '/>\n'+
                        '       <ul class="list-group" style="max-height: 300px;overflow: auto;">\n' +
                        '           <li class="list-group-item" style="display:flex" ng-repeat="$value in right ' + doesItHaveFunction('right',1) + '">' +
                        '               <a class="inside-list-anchor" ng-click="removeFromAndAddTo(right,leftAux,$value)">' + scope.texts.right + '</a>' +
                        '              <button class="badge badge-helper" ng-click="halp($value)"><i class="glyphicon glyphicon-resize-full"></i></button>' +
                        '           </li>\n'+
                        '       </ul>\n'+
                        '   </div>\n'+
                        '</div>\n';
                    elm.append($compile(text)(scope));
                }

                scope.removeFromAndAddTo = function(removeFrom,addTo,value){
                    removeFrom.splice(removeFrom.indexOf(value),1);
                    addTo.push(value);
                };

                scope.addNew = function(text){
                    scope.leftFilter = '';
                    scope.postMethod({value: text });
                    scope.leftFn({param: ''});

                };

                scope.showClass = function(){
                    if(scope.showPlus()){
                        return 'input-group';
                    }
                    return '';
                };

                scope.halp = function(obj){
                    scope.template =
                        '<div class="modal-body">\n';
                    for (var key in obj) if (obj.hasOwnProperty(key) && key != '$$hashKey') {
                        scope.template += '   <div class="form-group">\n';
                        scope.template += '       <label><small>'+ key +'</small></label>\n';
                        scope.template += '       <input type="text" ng-model="$value.' + key +'" disabled class="form-control"/>\n';
                        scope.template += '   </div>\n';
                    }
                    scope.template += '   <div class="modal-footer">\n';
                    scope.template += '       <button type="button" class="btn btn-warning" ng-click="back()">Back</button>\n';
                    scope.template += '   </div>\n';
                    scope.template += '</div>\n';

                    var mi = $modal.open({
                        template: scope.template,
                        size: 'sm',
                        controller: function($scope,$value,$modalInstance){
                            $scope.$value = $value;
                            $scope.back = function(){
                                $modalInstance.dismiss();
                            }
                        },
                        resolve: {
                            $value: function(){
                                return obj;
                            }
                        }
                    })

                };

                scope.showPlus = function(){
                    function filterLeft(){
                        return scope.leftAux.filter(function(el){
                                return el[attrs.filterParameter] == scope.leftFilter;
                            }).length < 1;
                    }
                    function filterRight(){
                        return scope.right.filter(function(el){
                                return el[attrs.filterParameter] == scope.leftFilter;
                            }).length < 1;
                    }
                    return filterLeft() && filterRight();
                };

                scope.doesItHaveClass = function(){
                    if(scope.left.length > 0){
                        return '';
                    }
                    return 'input-group';
                };

                function doesItHaveFunction(field,place){
                    if(place == 0){
                        if(field == 'left' && attrs.leftFn){
                            return  'ng-change= "' + attrs.leftFn  +'({text: leftFilter})" ';
                        }
                        if(field == 'right' && attrs.rightFn){
                            return  'ng-change= "' + attrs.leftFn  +'({text: rightFilter})" ';
                        }
                        return '';
                    } else {
                        if(field == 'left' && !attrs.leftFn){
                            return ' | filter: leftFilter';
                        }
                        if(field == 'right' && !attrs.rightFn){
                            return ' | filter: rightFilter'
                        }
                        return '';
                    }
                }
            }
        }
    })
        .directive('gumgaManyToOne',function ($modal,$templateCache,$timeout,GumgaKeyboard){
		$templateCache.put('mtoItem.html',
		'      <span bind-html-unsafe="match.label | typeaheadHighlight:query" style="cursor: pointer;"></span>');

        var template ='<div class="full-width-without-padding">';
		template += '	<div class="form-group has-success">';
        template += '		<div class="input-group" ng-init="open = false">';
        template += '			<input class="form-control" ng-model="model" type="text" typeahead="{{typeaheadSyntax}} |filter: $viewValue" ng-model-options="{debounce: 200 }" style="border-right: 0;" ng-change="teste()">';
		template += '			<span class="input-group-addon-mto" ng-show="showFullView()"> ';
		template += '				<button class="badge badge-helper" ng-click="halp(model)"><i class="glyphicon glyphicon-resize-full"></i></button>';
		template += '			</span>';
		template += '			<span class="input-group-addon" style="padding: 0 0.25%" ng-show="showPlus()"> ';
		template += '				<button type="button" style="border: 0;background-color: transparent" ng-click="addNew(model)" ><i class="glyphicon glyphicon-plus"></i></button>';
		template += '			</span>';
        template += '			<span class="input-group-btn">';
        template += '				<button class=" btn btn-default" ng-click="openClickHandler()" type="button"><span class="caret"></span></button>';
		template += '			</span>';
        template += '		</div>';
		template += '</div>';
        template += '</div>';

		return {
			restrict : 'E',
            template: template,
			require: '^form',
			scope : {
				model:'=ngModel',
				searchMethod: '&',
				postMethod: '&',
				list: '=',
				typeaheadSyntax: '@'
			},
			link: function(scope, elm, attrs,ctrl){
				scope.field = attrs.field;
				var ngModelCtrl = elm.find('input').controller('ngModel');

				scope.$watch('model',function(){
					if(((typeof scope.model).toUpperCase().trim()) === 'string'.toUpperCase().trim() && scope.model.length > 1){
						ctrl.$setValidity('GumgaManyToOne',false);
					} else {
						ctrl.$setValidity('GumgaManyToOne',true);
					}
				});

				GumgaKeyboard.bindToElement(elm.find('input')[0],'down',function(){
					if(!ngModelCtrl.$viewValue) {
						ngModelCtrl.$setViewValue(' ');
					}
				});

                scope.openClickHandler = function(){
					if(!ngModelCtrl.$viewValue) {
						ngModelCtrl.$setViewValue(' ');
					}
				};

				scope.showFullView = function(){
					return ((typeof scope.model).toUpperCase().trim()) === 'object'.toUpperCase().trim();
				};

				scope.showPlus = function(){
					return ((typeof scope.model).toUpperCase().trim()) === 'string'.toUpperCase().trim();
				};

				$timeout(function(){
					document.querySelector('.dropdown-menu')
						.style.width = '100%';
				},20);

				scope.addNew = function(text){
					if(attrs.postMethod){
						scope.postMethod({value: text})
							.then(function(values){
								scope.model = values.data.data;
							});
					} else {
						scope.list.push(text);
					}
				};

				scope.halp = function(obj){
					var template = '';
					template =
						'<div class="modal-body">\n';
					for (var key in obj) if (obj.hasOwnProperty(key) && key != '$$hashKey') {
						template += '   <div class="form-group">\n';
						template += '       <label><small>'+ key +'</small></label>\n';
						template += '       <input type="text" ng-model="$value.' + key +'" disabled class="form-control"/>\n';
						template += '   </div>\n';
					}
					template += '   <div class="modal-footer">\n';
					template += '       <button type="button" class="btn btn-warning" ng-click="back()">Back</button>\n';
					template += '   </div>\n';
					template += '</div>\n';

					var mi = $modal.open({
						template: template,
						size: 'sm',
						controller: function($scope,$value,$modalInstance){
							$scope.$value = $value;
							$scope.back = function(){
								$modalInstance.dismiss();
							}
						},
						resolve: {
							$value: function(){
								return obj;
							}
						}
					})

				};

			}
		};
	})
        .directive('gumgaAlert', function($rootScope) {

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
    })
        .directive('gumgaUpload',  function ($http,$parse){
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
        .directive('gumgaBreadcrumb',function (GumgaUtils,$timeout,$rootScope){
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
