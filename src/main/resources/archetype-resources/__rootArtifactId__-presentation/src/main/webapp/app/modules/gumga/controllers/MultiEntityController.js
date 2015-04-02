/**
 * Created by igorsantana on 3/18/15.
 */
define([], function () {

    MultiEntityController.$inject = ['SearchPromise'];

    function MultiEntityController(SearchPromise) {
        var multi = this;
        multi.search = SearchPromise.data;
    }

    return MultiEntityController;


});