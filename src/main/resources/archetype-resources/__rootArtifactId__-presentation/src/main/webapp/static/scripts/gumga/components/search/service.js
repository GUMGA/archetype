define(["jquery"],function(e){return function(t,n){function u(e,n,r){var i=r.length?{fields:r.join(",")}:undefined,s={term:n,fields:r};a(s),t.get(e,{params:i}).then(function(t){f(t.data,s)},function o(o){l(o,s)}).finally(function(){c(s)})}function a(e){h(r,arguments)}function f(e,t){h(i,arguments)}function l(e,t){h(s,arguments)}function c(e){h(o,arguments)}function h(e,t){for(var n=0;n<e.length;n++)e[n].apply(null,t)}this.url=n;var r=[],i=[],s=[],o=[];this.search=function(e,t){if(!this.url)throw new Error("<gumga:search> error: URL must be provided");var n=this.url.replace("{search}",e);u(n,e,t)},this.onFetchStart=function(e){r.push(e)},this.onFetchSuccess=function(e){i.push(e)},this.onFetchError=function(e){s.push(e)},this.onFetchFinished=function(e){o.push(e)}}});