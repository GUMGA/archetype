'use strict';
requirejs.config({

    paths: {
        "angular": "bower_components/angular/angular.min",
        "angular-mocks": "node_modules/angular-mocks/angular-mocks",
        "angular-ui-bootstrap": "bower_components/angular-ui-bootstrap-bower/ui-bootstrap-tpls.min",
        "angular-ui-router": "bower_components/angular-ui-router/release/angular-ui-router.min",
        "angular-locale": "resources/javascript/angular-locale_pt-br",
        "bootstrap": "bower_components/bootstrap/dist/js/bootstrap.min",
        "jquery": "bower_components/jquery/dist/jquery.min",
        "es5-sshim": "bower_components/es5-shim/es5-shim.min",

        "gumga-core": "app/modules/gumga/gumga.bundle",
        "gumga-translate": "app/modules/gumga/modules/gumga.translate.bundle",
        "gumga-search": "app/modules/gumga/modules/gumga.search.bundle",
        "gumga-association": "app/modules/gumga/modules/gumga.associations.bundle",
        "gumga-controllers": "app/modules/gumga/modules/gumga.controllers.bundle",
        "gumga-directives": "app/modules/gumga/modules/gumga.directives.bundle",
        "gumga-services": "app/modules/gumga/modules/gumga.services.bundle",
        "gumga-validators": "app/modules/gumga/modules/gumga.validators.bundle",

        'jquery-mask': "bower_components/jQuery-Mask-Plugin/dist/jquery.mask.min",
        'notify': "bower_components/remarkable-bootstrap-notify/dist/bootstrap-notify.min",
        "api-locations":"app/apiLocations",
        "mousetrap": "resources/javascript/mousetrap.min"
    },
    shim: {
        "angular": {exports: "angular", deps: ["jquery"]},
        "angular-ui-bootstrap": {deps: ["angular"]},
        "angular-ui-router": {deps: ["angular"]},
        "angular-mocks": {deps: ["angular"], exports: "angular-mocks"},
        "bootstrap": {deps: ["jquery"]},
        "jquery-mask": {deps: ["jquery"]},
	    "angular-locale": {deps:['angular']},
        "gumga-core": {deps: ['gumga-translate','gumga-search','gumga-association', 'gumga-controllers','gumga-directives','gumga-services','gumga-validators','angular-ui-router','angular-ui-bootstrap']},
        "gumga-associations": {deps: ['gumga-services','gumga-translate']},
        "gumga-directives": {deps: ['gumga-services','gumga-translate','notify','jquery-mask']},
        "gumga-search": {deps: ['gumga-translate']},
        "gumga-services": {deps: ['mousetrap']},
        "gumga-validators":{deps: ['gumga-services']}


    }
});
