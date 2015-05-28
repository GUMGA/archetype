/**
 * Created by igorsantana on 28/05/15.
 */
define(function(require){
	var angular = require('angular');
	require('gumga-services');
	return angular.module('gumga.associations',['gumga.services'])
		.directive('gumgaManyToMany',function GumgaManyToMany($compile,GumgaUtils,$modal) {
			return {
				restrict: 'E',
				scope: {
					left: '=leftList',
					right: '=rightList',
					leftFn: '&leftSearch',
					rightFn: '&rightSearch',
					postMethod: '&',
					onListChange: '&',
					onNewValueAdded: '&',
					onValueVisualizationOpened: '&',
					onValueVisualizationClosed: '&',
					authorizeAdd: '='
				},
				transclude: true,
				link: function (scope, elm, attrs, ctrl, transcludeFn) {
					if(!scope.authorizeAdd){
						scope.authorizeAdd = true;
					}
					var eventHandler = {
						listChange: (attrs.onListChange? scope.onListChange : angular.noop),
						newValueAdded: (attrs.onNewValueAdded ? scope.onNewValueAdded : angular.noop),
						valueVisualizationOpened: (attrs.onValueVisualizationOpened ? scope.onValueVisualizationOpened :angular.noop),
						valueVisualizationClosed: (attrs.onValueVisualizationClosed ? scope.onValueVisualizationClosed :angular.noop)
					};
					scope.texts = {left: '',right: ''};
					scope.template = '';
					scope.labels = {left: attrs.leftLabel,right: attrs.rightLabel};
					var mockObject = {};
					transcludeFn(scope,function(cloneEl){
						angular.forEach(cloneEl,function(cl){
							var element = angular.element(cl)[0];
							switch(element.nodeName){
								case 'LEFT-FIELD':
									scope.texts.left = element.innerHTML;
									break;
								case 'RIGHT-FIELD':
									scope.texts.right = element.innerHTML;
									break;
							}
						});
						checkErrors();
					});
					mountRenderedContent();
					scope.$watch('left',function(){
						checkErrors();
						copyObject(scope.left[0]);
					});
					function copyObject(obj) {
						for (var key in obj) if (obj.hasOwnProperty(key)) {
							mockObject[key] = null;
						}
					}
					function checkErrors(){
						var errorTexts = [];
						if(!scope.left || !scope.right){
							errorTexts.push('You haven\'t provided a list to GumgaManyToMany directive');
						}
						if(!scope.texts.left || !scope.texts.right){
							errorTexts.push('You have\'nt provided the content to GumgaManyToMany directive');
						}
						errorTexts.forEach(function(txt){
							throw txt;
						});
						removeDuplicates();
					}
					function removeDuplicates(){
						scope.leftAux = scope.left;
						scope.right.forEach(function(elm){
							var aux = scope.leftAux.map(function(el,$index){
								if(el[attrs.filterParameter] == elm[attrs.filterParameter]){
									return $index;
								}
							}).filter(function(e){return e === 0 || e});
							if(aux.length > 0){
								aux.forEach(function(elm){
									scope.leftAux.splice(elm,1);
								})
							}
						});
					}
					function mountRenderedContent(){
						var text =
							'<div class="full-width-without-padding">\n'+
							'   <div class="col-md-6" style="padding-left: 0">\n'+
							'       <strong><small>{{labels.left}}</small></strong>\n' +
							'       <div class="{{showClass()}}">'+
							'           <input type="text" ng-model="leftFilter" class="form-control"' + doesItHaveFunction('left',0) + ' ng-change="leftFn({param: leftFilter})" ng-model-options="{ updateOn: \'default blur\', debounce: {\'default\': 300, \'blur\': 0} }"/>\n' +
							'           <span class="input-group-addon" ng-show="showPlus(leftFilter)"> ' +
							'               <button type="button" style="border: 0;background-color: #EEE" ng-click="addNew(leftFilter)"><i class="glyphicon glyphicon-plus"></i></button>' +
							'           </span>' +
							'       </div>' +
							'       <ul class="list-group" style="max-height: 300px;overflow: auto;">\n' +
							'           <li class="list-group-item" style="display:flex" ng-repeat="$value in leftAux ' + doesItHaveFunction('left',1) + '">' +
							'               <a class="inside-list-anchor" ng-click="removeFromAndAddTo(leftAux,right,$value)">' + scope.texts.left + '</a>' +
							'              <button class="badge" style="background-color: #81AEDA;cursor: pointer;border: 0" ng-click="halp($value)"><i class="glyphicon glyphicon-resize-full"></i></button>' +
							'           </li>\n'+
							'       </ul>'+
							'   </div>\n'+
							'   <div class="col-md-6" style="padding-right: 0">\n'+
							'       <strong><small>{{labels.right}}</small></strong>\n'+
							'       <input type="text" ng-model="rightFilter" class="form-control"' + doesItHaveFunction('right',0) + '/>\n'+
							'       <ul class="list-group" style="max-height: 300px;overflow: auto;">\n' +
							'           <li class="list-group-item" style="display:flex" ng-repeat="$value in right ' + doesItHaveFunction('right',1) + '">' +
							'               <a class="inside-list-anchor" ng-click="removeFromAndAddTo(right,leftAux,$value)">' + scope.texts.right + '</a>' +
							'              <button class="badge badge-helper" ng-click="halp($value)"><i class="glyphicon glyphicon-resize-full"></i></button>' +
							'           </li>\n'+
							'       </ul>\n'+
							'   </div>\n'+
							'</div>\n';
						elm.append($compile(text)(scope));
					}
					scope.removeFromAndAddTo = function(removeFrom,addTo,value){
						removeFrom.splice(removeFrom.indexOf(value),1);
						eventHandler.listChange({$value:value});
						addTo.push(value);
					};
					scope.addNew = function(text){
						scope.leftFilter = '';
						scope.postMethod({value: text });
						eventHandler.newValueAdded();
						scope.leftFn({param: ''});
					};
					scope.showClass = function(){
						if(scope.showPlus()){
							return 'input-group';
						}
						return '';
					};
					scope.halp = function(obj){
						scope.template =
							'<div class="modal-body">\n';
						for (var key in obj) if (obj.hasOwnProperty(key) && key != '$$hashKey') {
							scope.template += '   <div class="form-group">\n';
							scope.template += '       <label><small>'+ key +'</small></label>\n';
							scope.template += '       <input type="text" ng-model="$value.' + key +'" disabled class="form-control"/>\n';
							scope.template += '   </div>\n';
						}
						scope.template += '   <div class="modal-footer">\n';
						scope.template += '       <button type="button" class="btn btn-warning" ng-click="back()">Back</button>\n';
						scope.template += '   </div>\n';
						scope.template += '</div>\n';
						eventHandler.valueVisualizationOpened();
						var mi = $modal.open({
							template: scope.template,
							size: 'sm',
							controller: function($scope,$value,$modalInstance){
								$scope.$value = $value;
								$scope.back = function(){
									$modalInstance.dismiss();
								}
							},
							resolve: {
								$value: function(){
									return obj;
								}
							}
						});

						mi.result.then(function(){
							eventHandler.valueVisualizationClosed();
						})
					};
					scope.showPlus = function(){
						function filterLeft(){
							return scope.leftAux.filter(function(el){
									return el[attrs.filterParameter] == scope.leftFilter;
								}).length < 1;
						}
						function filterRight(){
							return scope.right.filter(function(el){
									return el[attrs.filterParameter] == scope.leftFilter;
								}).length < 1;
						}
						if(scope.authorizeAdd == true){
							return filterLeft() && filterRight();
						}
						return false;
					};

					scope.doesItHaveClass = function(){
						if(scope.left.length > 0){
							return '';
						}
						return 'input-group';
					};
					function doesItHaveFunction(field,place){
						if(place == 0){
							if(field == 'left' && attrs.leftFn){
								return  'ng-change= "' + attrs.leftFn  +'({text: leftFilter})" ';
							}
							if(field == 'right' && attrs.rightFn){
								return  'ng-change= "' + attrs.leftFn  +'({text: rightFilter})" ';
							}
							return '';
						} else {
							if(field == 'left' && !attrs.leftFn){
								return ' | filter: leftFilter';
							}
							if(field == 'right' && !attrs.rightFn){
								return ' | filter: rightFilter'
							}
							return '';
						}
					}
				}
			}
		})
		.directive('gumgaManyToOne',function GumgaManyToOne($modal,$templateCache,$timeout,GumgaKeyboard){
			$templateCache.put('mtoItem.html',
				'      <span bind-html-unsafe="match.label | typeaheadHighlight:query" style="cursor: pointer;"></span>');
			var template ='<div class="full-width-without-padding">';
			template += '	<div class="form-group has-success">';
			template += '		<div class="input-group" ng-init="open = false">';
			template += '			<input class="form-control" ng-model="model" type="text" typeahead="{{typeaheadSyntax}} |filter: $viewValue" ng-model-options="{debounce: 200 }" style="border-right: 0;" ng-change="teste()">';
			template += '			<span class="input-group-addon-mto" ng-show="showFullView()"> ';
			template += '				<button class="badge badge-helper" ng-click="halp(model)"><i class="glyphicon glyphicon-resize-full"></i></button>';
			template += '			</span>';
			template += '			<span class="input-group-addon" style="padding: 0 0.25%" ng-show="showPlus()"> ';
			template += '				<button type="button" style="border: 0;background-color: transparent" ng-click="addNew(model)" ><i class="glyphicon glyphicon-plus"></i></button>';
			template += '			</span>';
			template += '			<span class="input-group-btn">';
			template += '				<button class=" btn btn-default" ng-click="openClickHandler()" type="button"><span class="caret"></span></button>';
			template += '			</span>';
			template += '		</div>';
			template += '</div>';
			template += '</div>';
			return {
				restrict : 'E',
				template: template,
				require: '^form',
				scope : {
					model:'=ngModel',
					searchMethod: '&',
					postMethod: '&',
					onNewValueAdded: '&',
					authorizeAdd: '=',
					onValueVisualizationOpened: '&',
					onValueVisualizationClosed: '&'
				},
				link: function(scope, elm, attrs,ctrl){
					if(!scope.authorizeAdd){
						scope.authorizeAdd = true;
					}
					var eventHandler = {
						newValueAdded: (attrs.onNewValueAdded ? scope.onNewValueAdded : angular.noop),
						valueVisualizationOpened: (attrs.onValueVisualizationOpened ? scope.onValueVisualizationOpened :angular.noop),
						valueVisualizationClosed: (attrs.onValueVisualizationClosed ? scope.onValueVisualizationClosed :angular.noop)
					};
					scope.field = attrs.field;
					var ngModelCtrl = elm.find('input').controller('ngModel');
					scope.$watch('model',function(){
						if(((typeof scope.model).toUpperCase().trim()) === 'string'.toUpperCase().trim() && scope.model.length > 1){
							ctrl.$setValidity('GumgaManyToOne',false);
						} else {
							ctrl.$setValidity('GumgaManyToOne',true);
						}
					});
					GumgaKeyboard.bindToElement(elm.find('input')[0],'down',function(){
						if(!ngModelCtrl.$viewValue) {
							ngModelCtrl.$setViewValue(' ');
						}
					});
					scope.openClickHandler = function(){
						if(!ngModelCtrl.$viewValue) {
							ngModelCtrl.$setViewValue(' ');
						}
					};
					scope.showFullView = function(){
						return ((typeof scope.model).toUpperCase().trim()) === 'object'.toUpperCase().trim();
					};
					scope.showPlus = function(){
						return ((typeof scope.model).toUpperCase().trim()) === 'string'.toUpperCase().trim() && scope.authorizeAdd === true;
					};
					$timeout(function(){
						document.querySelector('.dropdown-menu')
							.style.width = '100%';
					},20);
					scope.addNew = function(text){
						if(attrs.postMethod){
							scope.postMethod({value: text})
								.then(function(values){
									eventHandler.newValueAdded({$value:value});
									scope.model = values.data.data;

								});
						} else {
							scope.list.push(text);
						}
					};
					scope.halp = function(obj){
						var template = '';
						template =
							'<div class="modal-body">\n';
						for (var key in obj) if (obj.hasOwnProperty(key) && key != '$$hashKey') {
							template += '   <div class="form-group">\n';
							template += '       <label><small>'+ key +'</small></label>\n';
							template += '       <input type="text" ng-model="$value.' + key +'" disabled class="form-control"/>\n';
							template += '   </div>\n';
						}
						template += '   <div class="modal-footer">\n';
						template += '       <button type="button" class="btn btn-warning" ng-click="back()">Back</button>\n';
						template += '   </div>\n';
						template += '</div>\n';
						eventHandler.valueVisualizationOpened();
						var mi = $modal.open({
							template: template,
							size: 'sm',
							controller: function($scope,$value,$modalInstance){
								$scope.$value = $value;
								$scope.back = function(){
									$modalInstance.dismiss();
								}
							},
							resolve: {
								$value: function(){
									return obj;
								}
							}
						});

						mi.result.then(function(){
							eventHandler.valueVisualizationClosed();
						})
					};

				}
			};
		})
		.directive('gumgaOneToMany',function GumgaOneToMany($modal){
			var template = [
				'<div class="col-md-12" style="padding-left: 0;padding-right: 0">',
				'   <button type="button" class="btn btn-default" ng-click="newModal()">New</button>',
				'   <ul class="list-group">',
				'       <li ng-repeat="child in children" class="list-group-item">',
				'           {{child[property]}}',
				'           <button type="button" class="btn btn-default pull-right btn-sm" ng-click="newModal(child)"><i class="glyphicon glyphicon-pencil"></i></button>',
				'           <button type="button" class="btn btn-danger pull-right btn-sm" ng-click="removeFromList(child)"><i class="glyphicon glyphicon-remove"></i></button>',
				'       <div class="clearfix"></div></li>',
				'   <ul>',
				'</div>',
				'<div class="clearfix"></div>'
			];
			return {
				restrict: 'E',
				template: template.join('\n'),
				scope: {
					children: '=',
					templateUrl: '@',
					property: '@displayableProperty',
					name: '@',
					controller: '@',
					onDelete: '&',
					onValueVisualizationOpened: '&',
					onValueVisualizationClosed: '&'
				},
				link: function (scope,elm,attrs) {
					var eventHandler = {
						valueVisualizationOpened: (attrs.onValueVisualizationOpened ? scope.onValueVisualizationOpened :angular.noop),
						valueVisualizationClosed: (attrs.onValueVisualizationClosed ? scope.onValueVisualizationClosed :angular.noop),
						delete: (attrs.onDelete ? scope.onDelete : angular.noop)
					};
					scope.newModal = newModal;
					scope.removeFromList = removeFromList;
					scope.getFromModal = getFromModal;
					var name = attrs.name || 'New';
					if(!scope.children) throw 'You must provide a list to GumgaOneToMany';
					if(!scope.templateUrl) throw 'You must provide a templateUrl for the modal';
					if(!scope.property) throw 'You must provide a property to display in GumgaOneToMany';
					if(!scope.controller) throw 'You must provide a controller to the modal';
					function getFromModal(selected){
						eventHandler.valueVisualizationClosed();
						if(JSON.stringify(scope.etty) !== '{}'){
							scope.children.splice(scope.children.indexOf(scope.etty),1,selected);
						} else {
							scope.children.push(selected);
						}
					}
					function removeFromList(obj){
						eventHandler.delete({$value: value});
						scope.children.splice(scope.children.indexOf(obj),1);
					}
					function newModal(obj){
						scope.etty = {};
						if(obj){
							scope.etty= obj;
						}
						eventHandler.valueVisualizationOpened();
						var modalInstance = $modal.open({
							templateUrl: scope.templateUrl,
							controller: scope.controller,
							resolve: {
								entity: function(){
									return scope.etty;
								},
								title: function(){
									return scope.name;
								}
							}
						});
						modalInstance.result.then(getFromModal);
					}
				}
			};
		})
});