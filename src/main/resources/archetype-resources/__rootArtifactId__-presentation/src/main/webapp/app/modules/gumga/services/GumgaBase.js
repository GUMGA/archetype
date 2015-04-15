define(['app/apiLocations'], function (APILocation) {

    BaseService.$inject = ['$http', '$q', '$timeout'];

    function BaseService($http, $q, $timeout) {
        this.get = get;
        this.getById = getById;
        this.getNew = getNew;
        this.deleteAll = deleteAll;
        this.save = save;
        this.update = update;
        this.del = del;

        function get(url,params) {
            if (!params) {
                params = defaultParams;
            }
            return $http.get(url, params);;
        }

        function getById(url,id) {
            return $http.get(url + '/' + id);
        }

        function getNew(url){
            return $http.get(url+'/new');
        };

        function deleteAll(url,entities) {
            var promises = [];
            entities.forEach(function (entity) {
                promises.push(del(url,entity));
            });
            return $q.all(promises);
        }

        function save(url,entity) {
            return $http.post(url, entity);
        }

        function update(url,entity) {
            return $http.put(url + '/' + entity.id, entity);
        }

        function del(url,entity) {
            return $http.delete(url + '/' + entity.id);
        }
    }

    return BaseService;

})
;