define(['app/apiLocations'], function (APILocation) {

    CoisaService.$inject = ['GumgaBase', '$stateParams'];

    function CoisaService(GumgaBase, $stateParams) {
        var coisa = this;
        coisa.url = APILocation.apiLocation + '/financeiro-api/api/coisa';
        var query = {};
        query.params = {
            start: 0,
            pageSize: 10
        };

        coisa.get = function (page) {
            if ($stateParams.id) {
                return GumgaBase.getById($stateParams.id);
            }
            if (page) {
                query.params.start = (page - 1) * query.params.pageSize;
                if (page < 1) throw 'Invalid page';
            }
            return GumgaBase.get(coisa.url,query);
        };

        coisa.getSearch = function (field, param) {
            if (!param) param = '';
            query.params = {};
            query.params.q = param;
            query.params.searchFields = field;
            return GumgaBase.get(coisa.url,query);
        };

        coisa.doSort = function (field, way) {
            query.params.start = 0;
            query.params.sortField = field;
            query.params.sortDir = way;
            return GumgaBase.get(coisa.url,query);
        };

        coisa.doRemove = function (entities) {
            return GumgaBase.deleteAll(coisa.url,entities);
        };

        coisa.update = function (entity) {
            if (entity.id) {
                return GumgaBase.update(coisa.url,entity);
            }
            return GumgaBase.save(coisa.url,entity);
        };

        coisa.advancedSearch = function (param) {
            query.params = {};
            query.params.aq = param;
            return GumgaBase.get(coisa.url,query);
        };

    }

    return CoisaService;
});
