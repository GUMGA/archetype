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
});
