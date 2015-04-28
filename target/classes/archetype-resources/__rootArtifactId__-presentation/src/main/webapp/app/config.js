requirejs.config({
    paths: {
        "angular": "bower_components/angular/angular.min",
        "angular-mocks": "node_modules/angular-mocks/angular-mocks",
        "angular-ui-bootstrap": "bower_components/angular-ui-bootstrap-bower/ui-bootstrap-tpls.min",
        "angular-ui-router": "bower_components/angular-ui-router/release/angular-ui-router.min",
        "angular-translate": "bower_components/angular-translate/angular-translate",
        "bootstrap": "bower_components/dist/bootstrap.min",
        "jquery": "bower_components/jquery/dist/jquery.min",
        "es5-sshim": "bower_components/es5-shim/es5-shim.min",
        "gumga-core": "app/modules/gumga/module",
        'jquery-mask': "bower_components/jQuery-Mask-Plugin/dist/jquery.mask.min",
        'notify': "bower_components/remarkable-bootstrap-notify/dist/bootstrap-notify.min",
        'angular-input-masks': "bower_components/angular-input-masks/angular-input-masks.min",
        'angular-cookies': 'bower_components/angular-cookies/angular-cookies.min',
        'angular-dynamic-locale': 'bower_components/angular-dynamic-locale/dist/tmhDynamicLocale',
        'angular-translate-loader-partial': 'bower_components/angular-translate-loader-partial/angular-translate-loader-partial.min',
        'angular-translate-storage-cookie': 'bower_components/angular-translate-storage-cookie/angular-translate-storage-cookie.min'
    },
    shim: {
        "angular": {exports: "angular", deps: ["jquery"]},
        "angular-input-masks":{deps:['angular']},
        "angular-ui-bootstrap": {deps: ["angular"]},
        "angular-ui-router": {deps: ["angular"]},
        "angular-mocks": {deps: ["angular"], exports: "angular-mocks"},
        "bootstrap": {deps: ["jquery"]},
        "jquery-mask": {deps: ["jquery"]},
        "angular-translate": {exports: 'angular-translate', deps: ['angular']},
        "angular-cookies": {deps: ['angular']},
        "angular-dynamic-locale": {deps: ['angular']},
        'angular-translate-loader-partial':{deps:['angular-translate']},
        "angular-translate-storage-cookie":{deps:['angular-translate']}
    }
});