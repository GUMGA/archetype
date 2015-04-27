define(['app/modules/coisa/controllers/module', 'app/modules/coisa/module', 'angular-mocks'], function () {
    describe('CoisaModule', function () {
        var ListController;
        beforeEach(module('app.coisa'))
        beforeEach(module('app.coisa.controllers'));
        beforeEach(inject(function ($controller) {
            ListController = $controller('ListController')
        }))

        describe('ListController', function () {
            it('should have a entity', function () {
                console.log(ListController)
                expect(ListController).not.toBe(null)
            })
        })
    })
})