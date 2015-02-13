define(['jquery', 'angular-class', './basic-crud-controller'], function($, AngularClass, BasicCrudController) {
	
	

	return AngularClass.create({
		$inject : ['$scope', '$state', '$http', 'GumgaGrowl', 'i18n', 'EntityService', 'entity', 'GumgaKeys','$location'],
		extends: BasicCrudController,
		prototype : {
			initialize : function() {
				
				this.$scope.entity = this.entity;
				
				this.$state.current.confirmExit = false;
				this.$scope.$watch('entityForm.$dirty', $.proxy(this.updateDirtyStatus, this));
				
				this.EntityService.on('load-default-values-start save-start update-start', $.blockUI);
				this.EntityService.on('load-default-values-finished save-finished update-finished', $.unblockUI);
				
				this.GumgaKeys.bindFunction(this.$scope, 'ctrl+enter', $.proxy(this.save, this));

                                var aux = this.$location.path();
                                if (aux == "/insert") {
                                   this.$scope.checkboxEnable = true;
                                } else {
                                   this.$scope.checkboxEnable = false;
                                }

			},
			updateDirtyStatus : function(isDirty) {
				this.$state.current.confirmExit = isDirty;
			},
			
			saveOrUpdate : function(entityData) {
				if (entityData.id)
					return this.EntityService.update(entityData);
				else
					return this.EntityService.save(entityData);
			},
			save : function($event) {
				var self = this;
				this.$scope.gumgaFormErrors.clearCategory('backend');
				$event.preventDefault();
				this.saving = true;
				this.saveOrUpdate(this.$scope.entity)
					.then($.proxy(this.saveSuccess, this), $.proxy(this.saveError, this))
					.finally(function() {
						self.saving = false;
					});
				
			},
			saveSuccess : function(response) {
                            console.log(response);
				this.GumgaGrowl.success(response.message);
				this.$scope.entityForm.$setPristine(); // Seta o formulário para "limpo" novamente
				this.$state.current.confirmExit = false;
				this.afterSaveSuccess(response.data);
			},
			afterSaveSuccess: function(entity) {
                          if (this.$scope.entity.continuarInserindo == true) {
                                this.$scope.entity = new Object();
                                this.$scope.entity.continuarInserindo = true;
                          } else {
                             this.$state.go('list');
                          }

			
			},
			saveError: function(response) {
				if (response.status == 422)
					this.handleFormErrors(response.data.fieldErrors);
				else
					this.handleGlobalError(response.data);
			},
			handleFormErrors: function(errors) {
				for (var i = 0; i < errors.length; i++) {
					this.$scope.gumgaFormErrors.addError(errors[i].field, null, errors[i].message, 'backend');
				}
			}
		}
	});
	
});
