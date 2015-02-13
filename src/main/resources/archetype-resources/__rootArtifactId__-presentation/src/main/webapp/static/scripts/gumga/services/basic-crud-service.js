define(function (require) {

    var $ = require('jquery');
    var ObjectEventsManager = require('gumga/utils/object-events-manager');
    var HQLExporter = require('gumga/components/filter/exporter/hql');
    function BasicCrudService($http, $q, baseUrl, defaultParameters) {
        if (!baseUrl)
            throw "Base URL is required";
        this.eventsManager = new ObjectEventsManager();
        this.baseUrl = baseUrl;
        this.$http = $http;
        this.$q = $q;
        this.parameters = $.extend({}, BasicCrudService.globalDefaultParameters, defaultParameters);
        this.hqlExporter = new HQLExporter();
        this.id = 0;
    }

    BasicCrudService.globalDefaultParameters = {
        start: 0,
        pageSize: 10
    };
    return require('gumga-class').create({
        constructor: BasicCrudService,
        prototype: {
            getBaseURL: function () {
                return this.baseUrl;
            },
            fetch: function () {
                return this.executePromise("fetch", [this.parameters], function () {
                    return this.$http.get(this.getBaseURL(), {params: this.parameters});
                });
            },
            getId: function () {
                return this.id;
            },
            fetchPage: function (page) {
                if (page <= 0)
                    throw "Invalid page: " + page;
                this.parameters.start = (page - 1) * this.parameters.pageSize;
                return this.fetch();
            },
            search: function (term, fields) {
                this.parameters.start = 0;
                this.parameters.q = term;
                delete this.parameters.aq;
                this.parameters.searchFields = fields ? fields.join(",") : "";
                return this.fetch();
            },
            advancedSearch: function (filter) {
                this.parameters.start = 0;
                this.parameters.aq = this.hqlExporter.export(filter);
                return this.fetch();
            },
            clearSearch: function () {
                this.parameters.start = 0;
                delete this.parameters.q;
                delete this.parameters.searchFields;
                return this.fetch();
            },
            pageSize: function (pageSize) {
                this.parameters.pageSize = pageSize;
                return this.fetch();
            },
            sortAsc: function (field) {
                this.parameters.start = 0;
                this.parameters.sortField = field;
                this.parameters.sortDir = "asc";
                return this.fetch();
            },
            sortDesc: function (field) {
                this.parameters.start = 0;
                this.parameters.sortField = field;
                this.parameters.sortDir = "desc";
                return this.fetch();
            },
            remove: function (entity) {
                return this.executePromise("remove", [entity], function () {
                    return this.$http.delete(this.getBaseURL() + '/' + entity.id);
                });
            },
            removeAll: function (entities) {
                var self = this;
                return this.executePromise("remove-all", [entities], function () {
                    var promises = [];
                    var errors = [];
                    angular.forEach(entities, function (entity) {
                        var removePromise = self.remove(entity).catch(function (result) {
                            errors.push({entity: entity, result: result});
                            return result;
                        });
                        promises.push(removePromise);
                    });
                    return self.$q.all(promises).then(function () {
                        return errors.length ? self.$q.reject({data: errors}) : {};
                    });
                });
            },
            load: function (id) {
                this.id = id;
                return this.executePromise("load", [id], function () {
                    return this.$http.get(this.getBaseURL() + '/' + id);
                });

            },
            save: function (entityData) {
                return this.executePromise("save", [entityData], function () {
                    return this.$http.post(this.getBaseURL(), entityData);
                });
            },
            update: function (entityData) {
                return this.executePromise("update", [entityData], function () {
                    return this.$http.put(this.getBaseURL() + '/' + entityData.id, entityData);
                });
            },
            loadDefaultValues: function () {
                return this.executePromise("load-default-values", null, function () {
                    return this.$http.get(this.getBaseURL() + '/new');
                });
            },
            executePromise: function (eventPrefix, parameters, promiseFunction) {
                parameters = parameters || [];
                this.eventsManager.trigger(eventPrefix + "-start", parameters);
                var self = this;
                return promiseFunction.call(this).then(
                        function success(result) {
                            var dataArgs = result.data ? [result.data] : [];
                            self.eventsManager.trigger(eventPrefix + "-success", dataArgs.concat(parameters));
                            return result.data;
                        },
                        function error(result) {
                            var dataArgs = result.data ? [result.data] : [];
                            self.eventsManager.trigger(eventPrefix + "-error", dataArgs.concat(parameters));
                            return self.$q.reject(result);
                        }).finally(function finished() {
                    self.eventsManager.trigger(eventPrefix + "-finished", parameters);
                }
                );
            },
            on: function (eventsName, callback) {
                return this.eventsManager.on(eventsName, callback);
            }
        }
    });
});
