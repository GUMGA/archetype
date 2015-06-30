/**
 * Created by igorsantana on 22/05/15.
 */
define(function(require){

    var angular = require('angular');

    angular.module('gumga.services',[])
        .factory('GumgaAddressService',function GumgaAddressService() {
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
        .factory('GumgaKeyboard',function GumgaKeyboard(){
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
        .factory('GumgaWebStorage',function GumgaWebStorage(){
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
        .service('GumgaBase',function BaseService($http, $q) {
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

            function postImage(url, attribute, model) {
                    var fd = new FormData();
                    fd.append(attribute, model);
                    return $http.post(url + '/' + attribute + '/', fd, {
                        transformRequest: angular.identity,
                        headers: {'Content-Type': undefined}
                    });
                }

                function deleteImage(url, attribute, value) {
                    return $http.delete(url + '/' + attribute + '/' + value, {
                        transformRequest: angular.identity,
                        headers: {'Content-Type': undefined}
                    });

                }
        })
        .service('GumgaBroadcaster',function GumgaBroadcaster($rootScope) {
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
        })
        .service('GumgaUtils',function GumgaUtils() {
            this.errorMessages = {
                max: "You've typed more than the maximum!",
                min: "You've typed less than the minimum!",
                req: "Este campo é requerido!"
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
        .factory('returnTemplate',function($templateCache){
            return {
                _ipTemplate:
                '<div class="full-width-without-padding">'+
                '   <label for="name"  gumga-translate-tag="role.title"></label>'+
                '   <input type="text" disabled ng-model="especification.role.name" class="form-control">'+
                '   <label for="especificationName" gumga-translate-tag="ipespecification.name"></label>'+
                '   <div ng-class="{\'form-group\':RoleForm.ipname.$pristine,\'form-group has-error\': RoleForm.ipname.$invalid,\'form-group has-success\': RoleForm.ipname.$valid}">'+
                '       <input type="text" name="ipname" ng-model="especification.name" ng-required="state.value == \'ip\'" class="form-control" />'+
                '       <span ng-show="RoleForm.ipname.$error.required" style="display:block" class="text-danger" minlength="2">Este campo é requerido!</span>'+
                '       <span ng-show="RoleForm.ipname.$error.minlength && RoleForm.ipname.$dirty " style="display:block" class="text-danger">Você precisa digitar no mínimo 2 caracteres</span>'+
                '   </div>'+
                '   <label for="ip" gumga-translate-tag="ipespecification.ip"></label>'+
                '   <div ng-class="{\'form-group\':RoleForm.ip.$pristine,\'form-group has-error\': RoleForm.ip.$invalid,\'form-group has-success\': RoleForm.ip.$valid}">'+
                '       <input id="ip" type="text" name="ip" ng-required="state.value == \'ip\'" ng-model="especification.ip.value" class="form-control" max-length="14"/>'+
                '       <span ng-show="RoleForm.ip.$error.pattern" style="display:block" class="text-danger">É necessário entrar com um IP válido.</span>'+
                '       <span ng-show="RoleForm.ip.$error.required" style="display:block" class="text-danger">Este campo é requerido!</span>'+
                '   </div>'+
                '   <gumga-errors name="ip"></gumga-errors>'+
                '   <div class="full-width-without-padding">'+
                '       <label for="user"  gumga-translate-tag="ipespecification.user"></label>'+
                '       <gumga-many-to-one'+
                '           value="especification.user"'+
                '           search-method="searchManyToOneUser(param)"'+
                '           field="name"'+
                '           add-method="postUsers(value)">'+
                '       </gumga-many-to-one>'+
                '   </div>'+
                '</div>   ',
                _opTemplate:
                "<div class=\"full-width-without-padding\">\n"
                + "                    <label for=\"name\"  gumga-translate-tag=\"role.title\"></label>\n"
                + "                    <input type=\"text\" disabled ng-model=\"especification.role.name\" class=\"form-control\">\n"
                + "                    <gumga-errors name=\"name\"></gumga-errors>\n"
                + "                    <label for=\"especificationName\" gumga-translate-tag=\"operationespecification.name\"></label>\n"
                + "                    <div ng-class=\"{'form-group':RoleForm.opname.$pristine,'form-group has-error': RoleForm.opname.$invalid,'form-group has-success': RoleForm.opname.$valid}\">\n"
                + "                        <input type=\"text\" name=\"opname\" ng-model=\"especification.name\" ng-required=\"state.value == 'operation'\" minlength=\"2\" class=\"form-control\" />\n"
                + "                        <span ng-show=\"RoleForm.opname.$error.required\" style=\"display:block\" class=\"text-danger\" minlength=\"2\">Este campo é requerido!</span>\n"
                + "                        <span ng-show=\"RoleForm.opname.$error.minlength && RoleForm.opname.$dirty \" style=\"display:block\" class=\"text-danger\">Você precisa digitar no mínimo 2 caracteres</span>\n"
                + "                    </div>\n"
                + "                        \n"
                + "                    <div class=\"full-width-without-padding\">\n"
                + "                        <label for=\"user\"  gumga-translate-tag=\"especification.user\"></label>\n"
                + "                        <gumga-many-to-one\n"
                + "                            value=\"especification.user\"\n"
                + "                            search-method=\"searchManyToOneUser(param)\"\n"
                + "                            field=\"name\"\n"
                + "                            add-method=\"postUsers(value)\"\n"
                + "                            authorize-add=\"false\">\n"
                + "                        </gumga-many-to-one>\n"
                + "                    </div> \n"
                + "                    <label for=\"type\"  gumga-translate-tag=\"operationespecification.type\"></label>\n"
                + "                    <div ng-class=\"{'form-group has-error': RoleForm.type.$pristine,'form-group has-success': RoleForm.type.$dirty}\">\n"
                + "                        <select class='form-control' name=\"type\" ng-model=\"especification.type\" >\n"
                + "                            <option ng-selected=\"value.value === especification.type\"  value=\"{{value.value}}\" ng-repeat=\"value in valueAddRemove\">{{value.label}}</option> \n"
                + "                        </select>\n"
                + "                    </div>\n"
                + "                    <div class=\"full-width-without-padding\">\n"
                + "                        <label for=\"operation\"  gumga-translate-tag=\"operationespecification.operation\"></label>\n"
                + "                        <gumga-many-to-one\n"
                + "                            value=\"especification.operation\"\n"
                + "                            search-method=\"searchManyToOneOperation(param)\"\n"
                + "                            field=\"name\"\n"
                + "                            add-method=\"postManyToOneOperation(value)\"\n"
                + "                            authorize-add=\"false\">\n"
                + "                        </gumga-many-to-one>\n"
                + "                    </div>\n"
                + "                </div>",
               _timeTemplate:
                "<div class=\"full-width-without-padding\">\n" +
                "                    <label for=\"name\"  gumga-translate-tag=\"role.title\"></label>\n" +
                "                    <input type=\"text\" disabled ng-model=\"especification.role.name\" class=\"form-control\">\n" +
                "                    <gumga-errors name=\"name\"></gumga-errors>\n" +
                "                    <label for=\"timename\" gumga-translate-tag=\"imeespecification.name\"></label>\n" +
                "                    <div ng-class=\"{'form-group':RoleForm.timename.$pristine,'form-group has-error': RoleForm.timename.$invalid,'form-group has-success': RoleForm.timename.$valid}\">\n" +
                "                        <input type=\"text\" name=\"timename\" ng-model=\"especification.name\" ng-required=\"state.value == 'time'\" minlength=\"2\" class=\"form-control\" />\n" +
                "                        <span ng-show=\"RoleForm.timename.$error.required\" style=\"display:block\" class=\"text-danger\" minlength=\"2\">Este campo é requerido!</span>\n" +
                "                        <span ng-show=\"RoleForm.timename.$error.minlength && RoleForm.timename.$dirty \" style=\"display:block\" class=\"text-danger\">Você precisa digitar no mínimo 2 caracteres</span>\n" +
                "                    </div>\n" +
                "                    <div class=\"full-width-without-padding\">\n" +
                "                        <label for=\"user\"  gumga-translate-tag=\"especification.user\"></label>\n" +
                "                        <gumga-many-to-one\n" +
                "                            value=\"especification.user\"\n" +
                "                            search-method=\"searchManyToOneUser(param)\"\n" +
                "                            field=\"name\"\n" +
                "                            add-method=\"postUsers(value)\"\n" +
                "                            authorize-add=\"false\">\n" +
                "                        </gumga-many-to-one>\n" +
                "                    </div> \n" +
                "                    <select class='form-control' name=\"weekDay\" ng-model=\"especification.weekDay\" >\n" +
                "                        <option  ng-selected=\"value.value === entity.weekDay\"  value=\"{{value.value}}\" ng-repeat=\"value in valueWeekDay\">{{value.label}}</option>\n" +
                "                    </select>\n" +
                "                    <div class=\"full-width-without-padding\" style=\"margin-top: .5%\">\n" +
                "                        <div class=\"col-md-2\" style=\"padding-left: 0\">\n" +
                "                            <label for=\"startTime\"  gumga-translate-tag=\"timeespecification.startTime\"></label>\n" +
                "                            <timepicker ng-model=\"especification.startTime\" show-meridian=\"false\"></timepicker>\n" +
                "                        </div>\n" +
                "                        <label for=\"endTime\"  gumga-translate-tag=\"timeespecification.endTime\"></label>\n" +
                "                        <timepicker ng-model=\"especification.endTime\" show-meridian=\"false\" ></timepicker> \n" +
                "                    </div>\n" +
                "                </div>",
                _putTemplatesInCache: function(){
                    $templateCache.put('iptemplate.html',this._ipTemplate);
                    $templateCache.put('operationtemplate.html',this._opTemplate);
                    $templateCache.put('timetemplate.html',this._timeTemplate);
                },
                getTemplatesIds: function(){
                    this._putTemplatesInCache();
                    return {
                        'ip': 'iptemplate.html',
                        'operation': 'operationtemplate.html',
                        'time': 'timetemplate.html'
                    }
                }
            }
        })
});
