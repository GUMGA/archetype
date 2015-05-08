'use strict';
requirejs.config({

    paths: {
        "angular": "./bower_components/angular/angular.min",
        "angular-mocks": "./node_modules/angular-mocks/angular-mocks",
        "angular-ui-bootstrap": "./bower_components/angular-ui-bootstrap-bower/ui-bootstrap-tpls.min",
        "angular-ui-router": "./bower_components/angular-ui-router/release/angular-ui-router.min",
        "bootstrap": "./bower_components/bootstrap/dist/js/bootstrap.min",
        "jquery": "./bower_components/jquery/dist/jquery.min",
        "es5-sshim": "./bower_components/es5-shim/es5-shim.min",
        "gumga-core": "./app/modules/gumga/gumga.bundle",
        "gumga-search":"./app/modules/gumga/gumga.search.bundle",
        "gumga-translate":"./app/modules/gumga/gumga.translate.bundle",
        'jquery-mask': "./bower_components/jQuery-Mask-Plugin/dist/jquery.mask.min",
        'notify': "./bower_components/remarkable-bootstrap-notify/dist/bootstrap-notify.min",
        'api-locations':"./app/apiLocations"
    },
    shim: {
        "angular": {exports: "angular", deps: ["jquery"]},
        "angular-ui-bootstrap": {deps: ["angular"]},
        "angular-ui-router": {deps: ["angular"]},
        "angular-mocks": {deps: ["angular"], exports: "angular-mocks"},
        "bootstrap": {deps: ["jquery"]},
        "jquery-mask": {deps: ["jquery"]},
        "gumga-core":{deps: ["angular","angular-ui-bootstrap","angular-ui-router","jquery","jquery-mask","gumga-search","gumga-translate"],exports: "gumga-core"}

    }
});
