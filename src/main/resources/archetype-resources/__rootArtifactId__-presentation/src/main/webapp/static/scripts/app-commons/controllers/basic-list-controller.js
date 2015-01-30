define(['jquery', 'angular-class', './basic-crud-controller'], function($, AngularClass, BasicCrudController) {
	
	return AngularClass.create({
		$inject : ['$scope', 'EntityService', 'i18n', '$state', 'GumgaKeys', 'GumgaMessage', 'GumgaGrowl', 'entityListData'],
		extends: BasicCrudController,
		prototype : {
			initialize : function() {
				
				this.GumgaKeys
					.bindFunction(this.$scope, 'ctrl+del', $.proxy(this.removeSelection, this))
					.bindFunction(this.$scope, 'e', $.proxy(this.edit, this));
				
				this.$scope.page = this.entityListData.start / this.entityListData.pageSize + 1;
				this.$scope.$watch('page', $.proxy(this.pageChanged, this));
				
				this.EntityService.on('fetch-start remove-all-start', $.blockUI);
				this.EntityService.on('fetch-finished remove-all-finished', $.unblockUI);
				this.EntityService.on('fetch-success', $.proxy(this.updateList, this));
				this.EntityService.on('fetch-error remove-error', $.proxy(this.handleGlobalError, this));
				this.EntityService.on('remove-all-finished', $.proxy(this.reload, this));
				
				this.updateList(this.entityListData);
				
			},
			
			reload : function() {
				this.EntityService.fetch();
			},
			
			search: function(term, fields) {
            	this.$scope.page = 1;
				this.$scope.search.fields = fields;
				this.EntityService.search(term, fields);
			},

            advancedSearch: function(filter) {
                this.$scope.page = 1;
                this.EntityService.advancedSearch(filter);
            },
			
			edit : function() {
				if (this.$scope.selection.length > 0) {
					var id = this.$scope.selection[0].id;
					this.$state.go('edit', {"id" : id});
					this.$scope.$apply();
				}
			},
			
			removeSelection: function() {
				this.messages.confirm(this.i18n.remove.confirm, $.proxy(this.doRemove, this));
			},
			
			doRemove : function(isConfirmed) {
				if (!isConfirmed) return;
				
				var self = this;
				this.EntityService.removeAll(this.$scope.selection).then(function success() {
					self.EntityService.fetch();
				});
			},
		
			doSort: function(column, direction) {
				this.$scope.page = 1;
				if (direction == "asc")
					this.EntityService.sortAsc(column.sortField);
				else
					this.EntityService.sortDesc(column.sortField);
			},
			
			pageChanged: function(value, oldValue) {
				if (value !== oldValue)
					this.goToPage(value);
			},

			goToPage: function(page) {
                if (page)
                	this.EntityService.fetchPage(page);
			},
			
			updateList: function(list) {
				this.$scope.list = list;
				this.$scope.selection = [];
			}
		}
	});
	
});