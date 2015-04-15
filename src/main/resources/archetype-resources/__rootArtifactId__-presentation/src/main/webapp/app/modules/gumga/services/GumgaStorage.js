define([],function(){

	GumgaWebStorage.$inject = [];

	function GumgaWebStorage(){
		return {
			setSessionStorageItem: function(key,value){
				window.sessionStorage.setItem(key,angular.toJson(value));
			},
			getSessionStorageItem: function(key){
				var g = window.sessionStorage.getItem(key);
				if(!g){
					return null;
				}
				try {
					angular.fromJson(g);
				}catch(e){
					return g;
				}
				return angular.fromJson(g);
			},
			removeSessionStorageItem: function(key){
				window.sessionStorage.removeItem(key);
			},
			clearSessionStorage: function(){
				window.sessionStorage.clear();
			},
			getNumberOfItemsInSessionStorage: function(){
				return window.sessionStorage.length;
			},
			setLocalStorageItem: function(key,value){
				window.localStorage.setItem(key,angular.toJson(value));
			},
			getLocalStorageItem: function(key){
				var g = window.localStorage.getItem(key);
				try {
					angular.fromJson(g);
				}catch(e){
					return g;
				}
				return angular.fromJson(g);
			},
			removeLocalStorageItem: function(key){
				window.localStorage.removeItem(key);
			},
			clearLocalStorage: function(){
				window.localStorage.clear();
			},
			getNumberOfItemsInLocalStorage: function(){
				return window.localStorage.length;
			}

		}
	}

	return GumgaWebStorage;

})