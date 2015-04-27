/**
 * Created by igorsantana on 3/11/15.
 */
define([], function () {

    GumgaBroadcaster.$inject = ['$rootScope'];

    function GumgaBroadcaster($rootScope) {
        this.deletedEntities = deletedEntities;
        this.emitError = emitError;


        function deletedEntities(entities) {
            $rootScope.$broadcast('deletedEntities', entities);
        }

        function emitError(obj) {
            $rootScope.$broadcast('gumgaError', obj);
        }

    }

    return GumgaBroadcaster;

});