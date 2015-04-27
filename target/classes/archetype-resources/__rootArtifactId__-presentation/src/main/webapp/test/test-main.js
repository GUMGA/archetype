var allTestFiles = [];
var TEST_REGEXP = /Spec\.js$/i;

var pathToModule = function (path) {
    return path.replace(/^\/base\//, '').replace(/\.js$/, '');
};

Object.keys(window.__karma__.files).forEach(function (file) {
    if (TEST_REGEXP.test(file)) {
        // Normalize paths to RequireJS module names.
        allTestFiles.push(pathToModule(file));
    }
});

require.config({
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
        'jquery-mask': "bower_components/jQuery-Mask-Plugin/dist/jquery.mask.min"

    },
    shim: {
        "angular": {'exports': "angular", deps: ["jquery"]},
        "angular-ui-bootstrap": {deps: ["angular"]},
        "angular-ui-router": {deps: ["angular"]},
        "angular-mocks": {'exports': 'angular.mock', deps: ["angular"]},
        "bootstrap": {deps: ["jquery"]},
        "jquery-blockui": {deps: ["jquery"]},
        "angular-translate": {deps: ["angular"]}

    },
    priority: [
        "angular"
    ],

    // Karma serves files under /base, which is the basePath from your config file
    baseUrl: '/base/',

    // dynamically load all test files
    deps: allTestFiles,

    // we have to kickoff jasmine, as it is asynchronous
    callback: window.__karma__.start
});
