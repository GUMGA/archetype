define([
    'gumga-class',
    'gumga/services/basic-crud-service',
    'app/locations'

], function (GumgaClass, BasicCrudService,API) {
    
    function CoisaService($http, $q) {
        CoisaService.super.constructor.call(this, $http, $q, API.location + "coisa");
    }

    return GumgaClass.create({
        constructor: CoisaService,
        extends: BasicCrudService
    });

});
