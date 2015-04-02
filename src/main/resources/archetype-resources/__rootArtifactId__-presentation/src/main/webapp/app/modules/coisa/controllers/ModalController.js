define([], function () {

    ModalController.$inject = ['$scope', '$modalInstance', 'item', '$modal','$templateCache'];

    function ModalController($scope, $modalInstance, item, $modal,$templateCache) {
        var modal = $scope;

        modal.item = item;
        modal.label = item.name;

        modal.ok = function (item) {
            $modalInstance.close(item);
        };

        modal.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        modal.open = function (obj) {

            var modalInstance = $modal.open({
                template: $templateCache.get('modalTemplate.html'),
                controller: 'ModalController',
                size: 'lg',
                resolve: {
                    item: function () {
                        return obj || {};
                    }
                }
            })


            modalInstance.result.then(
                function (data) {
                    var index = modal.item.family.indexOf(data);
                    if (index == -1) {
                        modal.item.family.push(data);
                    } else {
                        modal.item.family.splice(index, data);
                    }
                },
                function () {
                    console.log('Modal dismissed at: ' + new Date());
                }
            );
        };

        modal.removeChar = function (obj) {
            var index = modal.item.family.indexOf(obj);
            modal.item.family.splice(index, 1)
        }
    };

    return ModalController;
});