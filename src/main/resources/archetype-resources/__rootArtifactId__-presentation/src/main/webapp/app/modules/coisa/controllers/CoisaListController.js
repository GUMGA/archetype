define([], function () {

    CoisaListController.$inject = ['$scope','CoisaService'];
    function CoisaListController($scope,CoisaService) {
        $scope.content = {};
        
        function update(values){
            $scope.content = values;
            $scope.get();
        }
        $scope.get = function () {
            CoisaService.get($scope.page)
            .success(function(values){
                $scope.content=values
            });
        };
        $scope.sort = function (field, way) {
            $scope.page = 1;
            CoisaService.doSort(field, way)
            .success(update);
        };
        $scope.del = function (entities) {
            $scope.page = 1;
            CoisaService.doRemove(entities)
            .then(update);
        };
        $scope.search = function (field, param) {
            $scope.page = 1;
            CoisaService.getSearch(field, param)
            .success(update);
        };
        $scope.advancedSearch = function (param) {
            $scope.page = 1;
            CoisaService.advancedSearch(param)
            .success(update);
        };
        
        $scope.get();
    }

    return CoisaListController;

});