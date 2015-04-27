define({

	'string' : {
		'conditions' : {
			'accepted' : ['eq', 'ne', 'contains', 'starts_with', 'ends_with', 'not_contains'],
			'default' : 'contains'
		},
		'validate' : function(value) {
			return value.length > 0;
		},
		'templateUrl' : "filter-panel-string.html",
		'template' : [
			'<div class="row">',
				'<div class="col-xs-6">',
					'<select class="form-control" name="condition" ng-model="$condition">',
						'<option value="{{opt}}" ng-selected="$condition == opt" ng-repeat="opt in $field.conditions.accepted">{{opt | translate}}</option>',
					'</select>',
				'</div>',
				'<div class="col-xs-6">',
					'<input type="text" class="form-control" autofocus ng-model="$value" name="value" />',
				'</div>',
			'</div>'].join('')
	},



	'integer' : {
		'conditions' : {
			'accepted' : ['eq', 'ne', 'gt', 'ge', 'lt', 'le'],
			'default' : 'eq'
		},
		'validate' : function(value) {
			return /^[0-9]+$/.test(value);
		},
		'templateUrl' : "filter-panel-integer.html",
		'template' : [
			'<div class="row">',
				'<div class="col-xs-6">',
					'<select class="form-control" name="condition" ng-model="$condition">',
						'<option value="{{opt}}" ng-selected="$condition == opt" ng-repeat="opt in $field.conditions.accepted">{{opt | translate}}</option>',
					'</select>',
				'</div>',
				'<div class="col-xs-6">',
					'<input type="number" class="form-control" ng-model="$value" name="value" autofocus />',
				'</div>',
			'</div>'].join('')
	},



	'money' : {
		'conditions' : {
			'accepted' : ['eq', 'ne', 'gt', 'ge', 'lt', 'le'],
			'default' : 'eq'
		},
		'labelFilter' : ['$filter', function($filter) {
			return function(filter) {
				return $filter('currency')(filter.value);
			};
		}],
		'validate' : function(value) {
			return /^[0-9]+(\.[0-9]+)?$/.test(value);
		},
		'template' : [
			'<div class="row">',
				'<div class="col-xs-6">',
					'<select class="form-control" name="condition" ng-model="$condition">',
						'<option value="{{opt}}" ng-selected="$condition == opt" ng-repeat="opt in $field.conditions.accepted">{{opt | translate}}</option>',
					'</select>',
				'</div>',
				'<div class="col-xs-6">',
					'<input type="text" gumga-number ng-model="$value" class="form-control" name="value" autofocus />',
				'</div>',
			'</div>'].join('')
	},

	'checkbox' : {
		'conditions' : {
			'accepted' : ['in'],
			'default' : 'in'
		},
		'validate' : function(value) {
			return angular.isArray(value) && value.length > 0;
		},
		'labelFilter' : function() {
			return function(filter) {
				var options = filter.field.options;
				var labels = [];
				for (var i = 0; i < options.length; i++) {
					var opt = options[i];
					var index = filter.value.indexOf(opt.value);
					if (index >= 0) {
						labels.push(opt.label);
					}
				}
				return labels.join(", ");
			};
		},
		'options' : [],
		'templateUrl' : "filter-panel-selection.html",
		'controller' : ['$scope', function($scope) {

			if (!angular.isArray($scope.$value)) {
				$scope.$value = [];
			} else {
				$scope.$value = angular.copy($scope.$value);
			}

			$scope.selectAll = function() {
				var isAllSelected = $scope.$value.length == $scope.$field.options.length;
				$scope.$value = [];

				if (!isAllSelected) {
					for (var i = 0; i < $scope.$field.options.length; i++) {
						$scope.$value.push($scope.$field.options[i].value);
					}
				}
			};

			$scope.add = function(value) {
				var index = $scope.$value.indexOf(value);
				if (index >= 0) {
					$scope.$value.splice(index, 1);
				} else {
					$scope.$value.push(value);
				}
			};

		}],
		'template' : [
			'<div>',
				'<button class="btn btn-default btn-xs" ng-click="selectAll()">Marcar/Desmarcar todos</button>',
				'<div class="gumga-filter-selection columns-2">',
					'<div class="gumga-filter-selection-option" ng-repeat="opt in $field.options">',
						'<div class="checkbox"><label><input type="checkbox" value="{{opt.value}}" ng-click="add(opt.value)" ng-checked="$value.indexOf(opt.value) >= 0">{{opt.label}}</label></div>',
					'</div>',
				'</div>',
			'</div>'].join('')
	},
	'radio' : {
		'conditions' : {
			'accepted' : ['eq'],
			'default' : 'eq'
		},
		'validate' : function(value) {
			return !!value;
		},
		'labelFilter' : function() {
			return function(filter) {
				var options = filter.field.options;
				for (var i = 0; i < options.length; i++) {
					var opt = options[i];
					if (opt.value == filter.value) {
						return opt.label;
					}
				}
				return "";
			};
		},
		'configuration' : {
			columns : 1
		},
		'options' : [],
		'template' : [
			'<div>',
				'<div class="gumga-filter-selection columns-{{$field.configuration.columns}}">',
					'<div class="gumga-filter-selection-option" ng-repeat="opt in $field.options">',
						'<div class="radio"><label><input type="radio" value="{{opt.value}}" name="options" ng-model="$parent.$value">{{opt.label}}</label></div>',
					'</div>',
				'</div>',
			'</div>'].join('')
	}
});