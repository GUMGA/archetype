/**
 * Created by igorsantana on 3/10/15.
 */
define([], function () {

    Directive.$inject = ['$http', '$compile'];
    function Directive($http, $compile) {
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
                    var template = ['<div>']
                    template.push('<button id="btn-menu" class="btn btn-link" ng-click="mostrarMenu()"><i class="fa fa-bars"></i></button>');
                    template.push('<nav id="menu" class="col-sm-3" name="menu">');

                    template.push('<ul class="menu-holder">');
                    template.push('<img ng-src="'+ attrs.image +'" alt="logo" width="40%" class="img-centered">')
                    for (var i = 0; i < scope.dados.length; i++) {
                        if (keyIsValid(scope.dados[i].key)) {
                            template.push(gerarNavPill(scope.dados[i], 'menu', -1));
                        }
                    }
                    template.push('</ul>')
                    template.push('</nav>')
                    template.push('</div>')
                    template = template.join('\n');
                    el.append($compile(template)(scope))
                }

                var gerarNavPill = function (param, type, parent) {
                    scope.v[count] = {
                        isActive: false,
                        parent: parent
                    }
                    var template = ['<li class="' + type + '-option">']
                    if (param.filhos.length > 0 && verificarPermicaoFilho(param.filhos)) {
                        template.push('<i  ng-class="v[' + count + '].isActive ? \' glyphicon glyphicon-chevron-down \' : \'glyphicon glyphicon-chevron-right\'" class="fa ' + type + '-color"  ng-click="resetarMenu(' + count + ')"></i>')
                    } else {
                        template.push('<i  class="glyphicon glyphicon-minus ' + type + '-color"  ng-click="resetarMenu(' + count + ')"></i>')
                    }
                    template.push('<a ui-sref="' + param.URL + '" ng-class="v[' + count + '].isActive ? \'is-active\' : \' \'">')
                    template.push(param.label)
                    template.push('</a>')
                    var aux = count;
                    count++;
                    if (param.filhos.length > 0) {
                        template.push('<ul ng-class="v[' + (count - 1) + '].isActive ? \' submenu-group-ativo\' : \'submenu-group\'" class="menu-holder">')
                        for (var i = 0; i < param.filhos.length; i++) {
                            if (keyIsValid(param.filhos[i].key)) {
                                template.push(gerarNavPill(param.filhos[i], 'submenu', aux))
                            }
                        }
                        template.push('</ul>')
                    }
                    template.push('</li>')
                    return template.join('\n');
                }

                scope.resetarMenu = function (index) {
                    if (scope.v[index].isActive) {
                        for (var i = 0; i < scope.v.length; i++) {
                            scope.v[index].isActive = false;
                        }
                        setarTrue(scope.v[index].parent)

                    } else {
                        for (var i = 0; i < scope.v.length; i++) {
                            scope.v[i].isActive = false;
                        }
                        setarTrue(index)
                    }

                }

                var keyIsValid = function (key) {
                    return scope.keys.indexOf(key) != -1;
                }

                function setarTrue(index) {
                    if (index >= 0) {
                        scope.v[index].isActive = true;
                        setarTrue(scope.v[index].parent)
                    }
                }

                scope.mostrarMenu = function () {
                    menuOpen = !menuOpen;

                    var elm = el.find('nav')
                    if (menuOpen) {
                        elm.addClass('open-menu')
                    } else {
                        elm.removeClass('open-menu')
                    }
                }

                function verificarPermicaoFilho(filhos) {
                    for (var i = 0; i < filhos.length; i++) {
                        for (var j = 0; j < scope.keys.length; j++) {
                            if (filhos[i].key == scope.keys[j]) {
                                return true
                            }
                        }
                    }
                    return false;
                }

            }
        }
    }

    return Directive;
});