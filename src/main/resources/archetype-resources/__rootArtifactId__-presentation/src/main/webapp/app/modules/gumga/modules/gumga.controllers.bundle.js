/**
 * Created by igorsantana on 28/05/15.
 */
define(function(require){
    var angular = require('angular');

    return angular.module('gumga.controllers',[])
        .controller('MultiEntityController',function MultiEntityController(SearchPromise) {
            var multi = this;
            multi.search = SearchPromise.data;
        })

});