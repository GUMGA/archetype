define(['app/modules/gumga/module', 'angular-mocks', 'app/modules/coisa/module'],
    function (gumgaCore, coisaModule) {
        describe('Service', function () {
            var e = true;
            var GumgaBase;
            //É necessario inicializar o modulo app.coisa para obter a constante angular RESTConfig
            beforeEach(module('app.coisa'));
            beforeEach(module('gumga.core'));

            beforeEach(inject(function ($injector) {
                    GumgaBase = $injector.get('GumgaBase');
                })
            )
            describe('GumgaBase:', function () {
                it('should return defaultParams:', function () {
                    var a = {start: 0, pageSize: 10};
                    expect(GumgaBase.getParams()).toEqual(a)
                })
            })
        })
    });
