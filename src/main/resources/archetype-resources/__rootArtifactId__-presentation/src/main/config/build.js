({
	baseUrl : "scripts/",
	appDir : "${basedir}/src/main/webapp/WEB-INF/static/",
	mainConfigFile : [
			'${basedir}/src/main/webapp/WEB-INF/static/scripts/config.js',
			'${basedir}/src/main/webapp/WEB-INF/static/scripts/app-config.js' ],
	dir : "${project.build.directory}/${project.build.finalName}/WEB-INF/static/",
	wrapShim : true,
	modules : [ 
        
	],
	paths : {
		'angular' : 'empty:',
		"angular-ui-router" : 'empty:',
		'handlebars' : 'empty:',
		'jquery' : 'empty:',
		'jquery-typeahead' : 'empty:',
		'bootstrap' : 'empty:',
		"bootstrap-notify" : 'empty:',
		"confirm-bootstrap" : 'empty:',
		"menu" : 'empty:',
		'gumga-class' : 'empty:',
		'gumga-keys' : 'empty:',
		"gumga-components" : 'empty:'
	}
})