define(['angular-class'], function(AngularClass) {

	return AngularClass.create({
		$inject : ['GumgaGrowl'],
		prototype : {
			handleGlobalError: function(response) {
				var message = response.message || 'Erro na operação';
				var details = response.details;

				if (response.code)
					details = '[CODE:' + response.code + '] ' + (response.details || '');
				this.GumgaGrowl.error(message, details);
			}
		}
	});
	
});
