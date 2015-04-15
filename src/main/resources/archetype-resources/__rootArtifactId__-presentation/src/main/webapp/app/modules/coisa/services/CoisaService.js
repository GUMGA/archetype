define(['app/apiLocations'], function (APILocation) {

    CoisaService.$inject = ['GumgaBase', '$stateParams','$state'];

    function CoisaService(GumgaBase, $stateParams,$state) {
        
        var url = APILocation.apiLocation + '/financeiro-api/api/coisa';
        var query = {};
        query.params = {
            start: 0,
            pageSize: 10
        };

        this.get = function (page) {
            if ($stateParams.id) {
                return GumgaBase.getById($stateParams.id);
            }
            if (page) {
                query.params.start = (page - 1) * query.params.pageSize;
                if (page < 1) throw 'Invalid page';
            }
            return GumgaBase.get(url,query);
        };

        this.getSearch = function (field, param) {
            if (!param) param = '';
            query.params = {};
            query.params.q = param;
            query.params.searchFields = field;
            return GumgaBase.get(url,query);
        };

        this.doSort = function (field, way) {
            query.params.start = 0;
            query.params.sortField = field;
            query.params.sortDir = way;
            return GumgaBase.get(url,query);
        };

        this.doRemove = function (entities) {
            return GumgaBase.deleteAll(url,entities);
        };

        this.update = function (entity) {
            if (entity.id) {
                GumgaBase.update(url,entity).success(function(){$state.go('coisa.list');});
            }
            GumgaBase.save(url,entity).success(function(){$state.go('coisa.list');});
            
        };

        this.advancedSearch = function (param) {
            query.params = {};
            query.params.aq = param;
            return GumgaBase.get(url,query);
        };

    }

    return CoisaService;
});
