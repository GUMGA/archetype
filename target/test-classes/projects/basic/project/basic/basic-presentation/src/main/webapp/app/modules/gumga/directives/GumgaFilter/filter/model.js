define(['angular'], function(angular) {

	/**
		Filter Model
	*/
	var FilterModel = function(field, condition, value, logicalOp) {
		this.field = field;
		this.condition = condition || field.conditions.default;
		this.value = value || '';
		this.logicalOp = logicalOp || 'AND';
	};

	angular.extend(FilterModel.prototype, {

		toggleLogicalOp : function() {
			this.logicalOp = (this.logicalOp == 'AND') ? 'OR' : 'AND';
		},

		set : function(newValue) {

			if (!this.field.validate(newValue.value))
				return;

			if (newValue.condition !== undefined)
				this.condition = newValue.condition;

			if (newValue.value !== undefined)
				this.value = newValue.value;

			if (newValue.logicalOp !== undefined)
				this.logicalOp = newValue.logicalOp;

		},

		isOpen : false,

		isValid : function() {
			return this.field.validate(this.value);
		},

		get : function() {
			return {
				'field' : this.field.name,
				'condition' : this.condition,
				'value' : this.value,
				'logicalOp' : this.logicalOp
			};
		}
	});


	return FilterModel;

});