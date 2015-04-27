define(['app/modules/gumga/module', 'angular-mocks'],
    function () {
        describe('Directive: GumgaSearch', function () {
            var scope;
            var element;
            beforeEach(module('gumga.core'));

            beforeEach(inject(function ($rootScope, $compile) {
                scope = $rootScope;
                element = angular.element('<gumga-search></gumga-search>');
                $compile(element)(scope);
            }))

            it('should have html', function () {
                console.log(element)
            })
        })
    })
