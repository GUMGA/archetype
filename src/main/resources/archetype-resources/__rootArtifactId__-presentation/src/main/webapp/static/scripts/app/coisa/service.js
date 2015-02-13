define([
    'gumga-class',
    'gumga/services/basic-crud-service',
    'app/locations'

    ], function (GumgaClass, BasicCrudService,API) {

        function CoisaService($http, $q,$rootScope) {
            CoisaService.super.constructor.call(this, $http, $q, API.location + "coisa");

            this.getAuditable = function () {
                return $http.get(API.location+'coisa/listoldversions/' + this.getId() + '?gumgaToken=' + $rootScope.gumgaToken);
            }

        }

        return GumgaClass.create({
            constructor: CoisaService,
            extends: BasicCrudService
        });



    });
