requirejs.config({
    paths: {
    	"angular-class" : "gumga/utils/angular-class",
        "angular-ui-router" : 'vendor/angular-ui-router',
		"bootstrap-notify" : "vendor/bootstrap-notify",
		"confirm-bootstrap": "vendor/confirm-bootstrap"
	},
    deps: ['bootstrap'],
    shim: {
        'angular-ui-router': {
            exports: 'angular',
            deps: [
                'angular'
            ]
        },
		"confirm-bootstrap" : {
			exports: "jQuery",
			deps : [ "jquery" ]
		},
		"bootstrap-notify" : {
			exports: "jQuery",
			deps : [ "jquery" ]
		}
    }
});