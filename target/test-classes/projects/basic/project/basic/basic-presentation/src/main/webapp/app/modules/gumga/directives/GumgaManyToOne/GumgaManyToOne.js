define([], function(){
	function GumgaManyToOne(){
        var template = 	'<div class="col-md-12" style="padding: 0">';
        template += '<div class="input-group" ng-init="open = false">'
        template +='<input class="form-control" ng-keydown="inputKeyEvent($event)" ng-change="refreshList(param)" ng-model="param" type="text">'
        template +='<span class="input-group-btn">'
        template +='<button class=" btn btn-default" ng-click="open = !open" type="button"><span class="caret"></span></button>'
        template +='</div>'
        template +='<ul class="list-group" ng-if="open">'
        template +='<li class="list-group-item" ng-click="selectObj(choice);" ng-repeat="choice in list">'
        template +='<span>{{choice[field]}}</span>'
        template +='</li>'
        template +='</ul>'
        template +='</div>'

		return {
			restrict : 'E',
            template: template,
			scope : {
				model:'=',
				list:'=',
				searchMethod: '&'
			},
			link: function(scope, elm, attrs){
                scope.field = attrs.field;
                if(scope.model){
                    var aux = angular.copy(scope.model);
                    scope.param = aux[scope.field];
				}

				scope.openButton = function(){
					if(scope.list.length < 1){
						scope.searchMethod();
					}
					scope.open = !scope.open;
				}

				scope.selectObj = function(obj){
					scope.model = obj;

                    var aux = angular.copy(obj);
					scope.param = aux[scope.field];
					scope.open = false;
				}

				scope.inputKeyEvent = function(event){
					if(event.keyCode == 40){
						scope.open = true;
					}
				}

				scope.refreshList = function(param){
					if(!scope.open){
						scope.open = !scope.open;
					}
					scope.model = {};
					scope.searchMethod({param:param});
				}
			}
		}
	}
	return GumgaManyToOne;
})