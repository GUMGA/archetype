/**
 * Created by igorsantana on 28/05/15.
 */
define(function(require){
	var angular = require('angular');
	require('gumga-services');
	return angular.module('gumga.associations',['gumga.services'])
		.directive('gumgaManyToMany',function GumgaManyToMany($compile,$timeout,GumgaUtils,$modal) {
			return {
				restrict: 'E',
				scope: {
					left: '=leftList',
					right: '=rightList',
					leftFn: '&leftSearch',
					rightFn: '&rightSearch',
					postMethod: '&',
					onListChange: '&?',
					onNewValueAdded: '&?',
					onValueVisualizationOpened: '&?',
					onValueVisualizationClosed: '&?',
					authorizeAdd: '=?'
				},
				transclude: true,
				link: function (scope, elm, attrs, ctrl, transcludeFn) {
					if(!attrs.authorizeAdd){
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
						function filterOnRight(text){
							return scope.right.filter(function($elm){
								return $elm[attrs.filterParameter] == text;
							}).length
						}
						scope.leftAux = scope.left.filter(function(elm){
							if(filterOnRight(elm[attrs.filterParameter]) == 0){
								return elm;
							}
						});
					}
					function mountRenderedContent(){
						var text =
							'<div class="full-width-without-padding">\n'+
							'   <div class="col-md-6" style="padding-left: 0">\n'+
							'       <strong><small>{{::labels.left}}</small></strong>\n' +
							'       <div class="{{showClass()}}">'+
							'           <input type="text" name="manymanyleft" ng-model="leftFilter" novalidate class="form-control"' + doesItHaveFunction('left',0) + ' ng-change="leftFn({param: leftFilter})" ng-model-options="{ updateOn: \'default blur\', debounce: {\'default\': 300, \'blur\': 0} }"/>\n' +
							'           <span class="input-group-addon" ng-show="showPlus(leftFilter)"> ' +
							'               <button type="button" style="border: 0;background-color: #EEE" ng-click="addNew(leftFilter)"><i class="glyphicon glyphicon-plus"></i></button>' +
							'           </span>' +
							'       </div>' +
							'       <ul class="list-group" style="max-height: 200px;overflow: auto;">\n' +
							'           <li class="list-group-item" style="display:flex;padding: 7px 15px;" ng-repeat="$value in leftAux ' + doesItHaveFunction('left',1) + '">' +
							'               <a class="inside-list-anchor" ng-click="removeFromAndAddTo(leftAux,right,$value)">' + scope.texts.left + '</a>' +
							'              <button class="badge" style="background-color: #81AEDA;cursor: pointer;border: 0" ng-click="halp($value)"><i class="glyphicon glyphicon-resize-full"></i></button>' +
							'           </li>\n'+
							'       </ul>'+
							'   </div>\n'+
							'   <div class="col-md-6" style="padding-right: 0">\n'+
							'       <strong><small>{{::labels.right}}</small></strong>\n'+
							'       <input type="text" name="manymanyleft" ng-model="rightFilter" novalidate class="form-control"' + doesItHaveFunction('right',0) + '/>\n'+
							'       <ul class="list-group" style="max-height: 200px;overflow: auto;">\n' +
							'           <li class="list-group-item" style="display:flex;padding: 7px 15px;" ng-repeat="$value in right ' + doesItHaveFunction('right',1) + '">' +
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
						$timeout(function(){
							scope.leftFn({param: ' '})
						},50)
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
						for (var key in obj) if (obj.hasOwnProperty(key) && key != '$$hashKey' && key != 'oi' && key != 'version') {
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
		.directive('gumgaManyToOne',function GumgaManyToOne($modal,$templateCache,GumgaKeyboard){

			$templateCache.put('mtoItem.html',
				'      <span bind-html-unsafe="match.label | typeaheadHighlight:query" style="cursor: pointer;"></span>');

			var template ='<div class="full-width-without-padding">';
			template += '	<div class="form-group">';
			template += '		<div ng-class="showFullView() || authorizeAdd ? \'input-group\' : \'\'">';
			template += '			<input class="form-control" ng-model="model" type="text" typeahead="$value as $value[field] for $value in searchMethod({param: model})" style="border-right: 0;">';
			template += '			<span class="input-group-addon-mto" ng-show="showFullView()"> ';
			template += '				<button class="badge badge-helper" ng-click="halp(model)" ><i class="glyphicon glyphicon-resize-full"></i></button>';
			template += '			</span>';
			template += '			<span class="input-group-addon" style="padding: 0 0.25%" ng-show="authorizeAdd"> ';
			template += '				<button type="button" style="border: 0;background-color: transparent" ng-click="addNew(model)" ><i class="glyphicon glyphicon-plus"></i></button>';
			template += '			</span>';
			template += '		</div>';
			template += '	</div>';
			template += '</div>';

			return {
				restrict : 'E',
				template: template,
				require: '^form',
				scope : {
					model:'=value',
					searchMethod: '&',
					postMethod: '&addMethod',
					field: '@',
					onNewValueAdded: '&?',
					onValueVisualizationOpened: '&?',
					onValueVisualizationClosed: '&?'
				},
				link: function(scope, elm, attrs,ctrl){

					var ngModelCtrl = elm.find('input').controller('ngModel'),
						eventHandler = {
							newValueAdded: (attrs.onNewValueAdded ? scope.onNewValueAdded : angular.noop),
							valueVisualizationOpened: (attrs.onValueVisualizationOpened ? scope.onValueVisualizationOpened :angular.noop),
							valueVisualizationClosed: (attrs.onValueVisualizationClosed ? scope.onValueVisualizationClosed :angular.noop)
						},
						async;


					!attrs.authorizeAdd ? scope.authorizeAdd = true : scope.authorizeAdd = JSON.parse(attrs.authorizeAdd);
					!attrs.async ? async = true : async = JSON.parse(attrs.async);

					function checkIfItIsString(string){
						return ((typeof string).toUpperCase().trim()) === 'string'.toUpperCase().trim() && string.length > 1;
					}

					scope.$watch('model',function(){
						checkIfItIsString(scope.model) ?
							ctrl.$setValidity('GumgaManyToOne',false) : ctrl.$setValidity('GumgaManyToOne',true);
					});

					GumgaKeyboard.bindToElement(elm.find('input')[0],'down',function(){ngModelCtrl.$setViewValue(' ')});

					scope.showFullView = function(){
						return ((typeof scope.model).toUpperCase().trim()) === 'object'.toUpperCase().trim() && scope.model != undefined;
					};

					scope.showPlus = function(){
						return (((typeof scope.model).toUpperCase().trim()) === 'string'.toUpperCase().trim() && scope.authorizeAdd === true) ;
					};

					scope.addNew = function(text){
						if(async) {
							scope.postMethod({value: text})
								.then(function (values) {
									eventHandler.newValueAdded({$value: values});
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
						for (var key in obj) if (obj.hasOwnProperty(key) && key != '$$hashKey' && key != 'oi' && key != 'version' && key != 'password' && typeof obj[key] != 'object') {
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
				'<div class="full-width-without-padding">',
				'   <strong><small>{{::label}}</small></strong>	',
				'   <button type="button" class="btn btn-default" ng-click="newModal()">New</button>',
				'   <ul class="list-group" style="margin-top: .5%">',
				'       <li ng-repeat="child in children" class="list-group-item">',
				'           {{::child[property]}}',
				'           <button style="margin-left: .5%" type="button" class="btn btn-danger pull-right btn-sm" ng-click="removeFromList(child)"><i class="glyphicon glyphicon-remove"></i></button>',
				'           <button type="button" class="btn btn-default pull-right btn-sm" ng-click="newModal(child)"><i class="glyphicon glyphicon-pencil"></i></button>',
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
					onDelete: '&?',
					label: '@?',
					onValueVisualizationOpened: '&?',
					onValueVisualizationClosed: '&?'
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
						eventHandler.delete({$value: obj });
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
