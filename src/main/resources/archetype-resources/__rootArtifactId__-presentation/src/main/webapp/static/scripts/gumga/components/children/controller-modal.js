define(["gumga-class"],function(e){return e.create({$inject:["$scope","$modalInstance","entity"],constructor:function(e,t,n){this.$modalInstance=t,this.$scope=e,e.gumgaModalController=this,e.entity=n},prototype:{confirm:function(){this.$modalInstance.close(this.$scope.entity)},cancel:function(){this.$modalInstance.dismiss()},validateModal:function(){return!0}}})});