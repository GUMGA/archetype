define([], function () {

    ListController.$inject = ['$scope', 'CoisaService', '$modal', '$templateCache', '$timeout'];
    function ListController($scope, CoisaService, $modal, $templateCache, $timeout) {
        var list = this;
        list.content = {};
        list.page = 1;
        list.caracters = [
            {
                "name": "Bilbo Baggins",
                "race": "Hobbit",
                "universe": "Lord of the rings",
                "family": [
                    {
                        "name": "Frodo Baggins",
                        "race": "Hobbit",
                        "universe": "Lord of the rings",
                        "family": []
                    }
                ]
            },
            {
                "name": "Anakin Skywalker",
                "race": "Human",
                "universe": "Star Wars",
                "family": [
                    {
                        "name": "Luke Skywalker",
                        "race": "Human",
                        "universe": "Star Wars",
                        "family": []
                    },
                    {
                        "name": "Leia Organa",
                        "race": "Human",
                        "universe": "Star Wars",
                        "family": []
                    }
                ]
            }
        ];

        list.open = function (obj) {
            var modalInstance = $modal.open({
                template: $templateCache.get('modalTemplate.html'),
                controller: 'ModalController',
                size: 'lg',
                resolve: {
                    item: function () {
                        return obj || {};
                    }
                }
            });

            modalInstance.result.then(
                function (data) {
                    var index = list.caracters.indexOf(data);
                    if (index == -1) {
                        list.caracters.push(data);
                    } else {
                        list.caracters.splice(index, data);
                    }
                }
            );
        };


        list.removeChar = function (obj) {
            var index = list.caracters.indexOf(obj);
            list.caracters.splice(index, 1);
        };

        list.get = function () {
            CoisaService.get(list.page).success(function (values) {
                list.content = values;
            });
        };

        list.sort = function (field, way) {
            list.page = 1;
            CoisaService.doSort(field, way)
                .success(function (values) {
                    list.content = values;
                });
        };

        list.del = function (entities) {
            list.page = 1;
            CoisaService.doRemove(entities)
                .then(function () {
                    list.get();
                });

        };

        list.search = function (field, param) {
            list.page = 1;
            CoisaService.getSearch(field, param)
                .success(function (values) {
                    list.content = values;
                });
        };

        list.advancedSearch = function (param) {
            list.page = 1;
            var a = CoisaService.advancedSearch(param);
            a.success(function (values) {
                list.content = values;
            });
        };

        list.get();
    }

    return ListController;

});