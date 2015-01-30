define(function(require) {
	
	require('gumga-components');
	require('app-commons/modules/crud-module').constant('baseTemplateURL', 'coisa');
	
	return require('angular')
		.module('app.coisa', ["app.base.crud", 'gumga.components'])
		
		.service('EntityService', require('app/coisa/service'))
		
		.controller("ListController", require('app/coisa/controllers/list'))
		.controller("FormController", require('app/coisa/controllers/form'));
	
});
