define(['./controller'],function(Ctrl) {
	
    "use strict";

	Directive.$inject = ['$rootScope'];

	function Directive($rootScope) {

		var template = [
			'<div class="gumga-filter">',
				'<div ng-repeat="f in ctrl.selectedItems" class="gumga-filter-item">',
					'<button class="btn btn-default btn-logical btn-{{size}}" ng-click="toggleLogicalOp(f)" ng-show="$index > 0"> {{f.logicalOp | translate}} </button>',
					'<gumga:filter:configuration ng-model="f" on-update="filterUpdated()" class="btn-{{size}}" is-open="f.isOpen"></gumga:filter:configuration>',
					'<button class="btn btn-default btn-remove btn-{{size}}" ng-click="unselect($index)">&times;</button>',
				'</div>',
				'<div class="btn-group" dropdown is-open="isMenuOpen">',
            '<button type="button" class="btn btn-default btn-navigation btn-{{size}} dropdown-toggle gumga-filter-add-button" dropdown-toggle ng-disabled="hasFilterOpened()">',
				    'Adicionar <span class="caret"></span>',
				  '</button>',
				  '<ul class="dropdown-menu gumga-filter-add-menu" role="menu">',
				  	'<li ng-repeat="field in ctrl.fields" ng-click="select(field.name)">',
				  		'<a>{{field.label}}</a>',
				  	'</li>',
				  '</ul>',
				'</div>',
			'</div>'
		].join('');

		function link($scope, $element, $attrs, controllers, $transclude) {

			$scope.size = $scope.size || 'md';

			var ngModelController = controllers[0];
			var controller = controllers[1];

			$transclude($scope, $.noop);

			controller.isOpen = false;

			$('body').mousedown(function(ev) {

				// Todos os cliques que forem realizados sobre o body irá confirmar todos os paineis abertos
				// Isso só não acontecerá se for clicado sobre o painel, pois o painel irá interceptar o evento
				// e impedir que a propagação chegue até o body
				$rootScope.$broadcast('gumga.filter.confirm', ev);
				$scope.$apply();

			});

			ngModelController.$formatters.push(function(filterData) {
				controller.set(filterData);
			});

			$scope.toggleLogicalOp = function(filter) {
				filter.toggleLogicalOp();
				$scope.filterUpdated();
			};

			$scope.hasFilterOpened = function() {
				for (var i=0; i < controller.selectedItems.length; i++) {
					if (controller.selectedItems[i].isOpen) {
						return true;
					}
				}
				return false;
			};

			$scope.hasFilterInvalid = function() {
				for (var i=0; i < controller.selectedItems.length; i++) {
					if (!controller.selectedItems[i].isValid()) {
						return true;
					}
				}
				return false;
			};

			$scope.unselect = function(index) {
				controller.unselect(index);

				$scope.filterUpdated();
			};

			$scope.$watch(function() {
				return $scope.hasFilterOpened();
			}, function(value) {
				$scope.isOpen = value;
			});

			$scope.filterUpdated = function() {
				if ($scope.hasFilterInvalid()) {
					return;
				}
				ngModelController.$setViewValue(controller.get());
			};

			$scope.select = function(name) {
				controller.select(name);
				$scope.isMenuOpen = false;
				$scope.filterUpdated();
			};

		}

		return  {
			"restrict" : 'E',
			"template" : template,
			"replace" : true,
			"require" : ['ngModel', 'gumgaFilter'],
			"transclude" : 'element',
			"controller" : Ctrl,
			"controllerAs" : "ctrl",
			"link" : link,
            "scope" : {
                onChange : '&',
				size : '@',
				isOpen : '=?'
            }
		};
	}



	return Directive;

});