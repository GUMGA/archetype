define(function(require) {

	return require('angular-class').create({
		extends : require('app-commons/controllers/basic-form-controller'),
		prototype : {

			initialize : function() {
				// Inicialização do controller
				var $scope = this.$scope;
                this.EntityService.getAuditable().then(function (data) {
                    if (data) {
                        $scope.older = data.data;
                        //  $scope.older.pop();
                    }

                })
			}
	
			// Demais métodos do controller



		}
	});
});
