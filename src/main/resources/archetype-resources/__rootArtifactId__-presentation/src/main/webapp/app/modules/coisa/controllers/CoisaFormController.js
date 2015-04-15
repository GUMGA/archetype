define([], function () {

    CoisaFormController.$inject = ['$scope','CoisaService','entity'];

    function CoisaFormController($scope,CoisaService,entity) {
    	$scope.entity = entity.data;

    	$scope.update = function (entity) {
            CoisaService.update(entity);
        };

    }

    return CoisaFormController;
});
