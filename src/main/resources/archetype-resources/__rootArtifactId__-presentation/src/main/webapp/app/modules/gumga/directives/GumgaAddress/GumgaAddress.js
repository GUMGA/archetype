/**
 * Created by igorsantana on 26/03/15.
 */
define(['jquery', 'app/apiLocations', 'jquery-mask'], function ($, APILocation) {

    GumgaAddress.$inject = ['GumgaAddressService', '$http'];


    function GumgaAddress(GumgaAddressService, $http) {
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
            '<button class="btn btn-primary" type="button" ng-click="searchCep(value.cep)" ng-disabled="loader{{id}}" id="buttonSearch{{id}}">Search <i class="fa fa-search"></i></button>',  '<img src="../resources/images/ajax-loader.gif" style="margin-left: 5%" ng-show="loader{{id}}">',
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
            '<a class="btn btn-default pull-right" ng-href="{{returnLink(value)}}" target="_blank">Maps <i class="fa fa-globe"></i></a>',
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

                $(document).ready(function () {
                    $('#input' + scope.id).mask('99999-999');
                });


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
                    $http.get(APILocation.apiLocation + '/services-api/public/cep/' + cep)
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
    }

    return GumgaAddress;
});