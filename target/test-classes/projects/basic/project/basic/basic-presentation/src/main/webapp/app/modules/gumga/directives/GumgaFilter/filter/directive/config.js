define(function() {

	FilterConfigurationDirective.$inject = ['GumgaFilterPanelService', '$injector'];

	function FilterConfigurationDirective(GumgaFilterPanelService, $injector) {

		var template = [
			'<button class="btn btn-default btn-config btn-navigation" ng-click="openParametrization()">',
				'<span>',
					'<span class="field">{{filter.field.label}}</span> ',
					'<span class="condition">{{filter.condition | translate}}</span> ',
					'<b class="value" title="{{labelFilter(filter)}}">{{labelFilter(filter)}}</b></span>',
				'</span>',
			'</button>'
		].join('');

		var defaultLabelFilter = function(filter) {
			return filter.value;
		};

		var link = function($scope, $element, $attrs, ngModelController) {

			$scope.openedFilter = undefined;

			ngModelController.$formatters.push(function(filter) {

				$scope.filter = filter;
				$scope.labelFilter = defaultLabelFilter;

				if (filter.field.labelFilter) {
					$scope.labelFilter = $injector.invoke(filter.field.labelFilter);
				}

				// Se não tem valor válido, abre o painel de parametrização
				if (!filter.field.validate(filter.value)) {
					$scope.openParametrization();
				}
			});


			$scope.openParametrization = function() {

				if ($scope.openedFilter) {
					$scope.openedFilter.cancel();
				} else {
					$scope.openedFilter = GumgaFilterPanelService.open($element, $scope.filter);
					$scope.openedFilter.result.then(confirmParametrization, concludeParametrization);
					$scope.isOpen = true;
				}
			};

			function confirmParametrization(result) {

				$scope.filter.set(result);
				$scope.onUpdate({
					'$filter' : $scope.filter
				});

				ngModelController.$setValidity("value", true);
				concludeParametrization();
			}


			function concludeParametrization() {
				$scope.openedFilter = undefined;
				$scope.isOpen = false;
			}

		};

		return  {
			"restrict" : 'E',
			"require" : "ngModel",
			"template" : template,
			"replace" : true,
			"link" : link,
			"scope" : {
				onUpdate : '&',
				isOpen : '=?'
			}
		};
	}



	return FilterConfigurationDirective;
});