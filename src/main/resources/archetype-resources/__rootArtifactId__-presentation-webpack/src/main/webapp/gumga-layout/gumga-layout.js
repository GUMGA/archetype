!function e(n,t,a){function l(o,r){if(!t[o]){if(!n[o]){var s="function"==typeof require&&require;if(!r&&s)return s(o,!0);if(i)return i(o,!0);var c=new Error("Cannot find module '"+o+"'");throw c.code="MODULE_NOT_FOUND",c}var u=t[o]={exports:{}};n[o][0].call(u.exports,function(e){var t=n[o][1][e];return l(t||e)},u,u.exports,e,n,t,a)}return t[o].exports}for(var i="function"==typeof require&&require,o=0;o<a.length;o++)l(a[o]);return l}({1:[function(e,n,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a='\n  <div class="alert gmd gmd-alert-popup alert-ALERT_TYPE alert-dismissible" role="alert">\n    <button type="button" class="close" aria-label="Close"><span aria-hidden="true">×</span></button>\n    <strong>ALERT_TITLE</strong> ALERT_MESSAGE\n    <a class="action" style="display: none;">Desfazer</a>\n  </div>\n',l=function(){String.prototype.toDOM=String.prototype.toDOM||function(){var e=document.createElement("div");return e.innerHTML=this,document.createDocumentFragment().appendChild(e.removeChild(e.firstChild))};var e=function(e,n,t){var l=a.trim().replace("ALERT_TYPE",e);return l=l.trim().replace("ALERT_TITLE",n),l=l.trim().replace("ALERT_MESSAGE",t)},n=function(){return angular.element("body")[0]},t=function(n,t,a){return c(e("success",n||"",t||""),a)},l=function(n,t,a){return c(e("danger",n||"",t||""),a)},i=function(n,t,a){return c(e("warning",n,t),a)},o=function(n,t,a){return c(e("info",n,t),a)},r=function(e){angular.element(e).css({transform:"scale(0.3)"}),setTimeout(function(){var t=n();t.contains(e)&&t.removeChild(e)},100)},s=function(e){var t=15;angular.forEach(angular.element(n()).find("div.gmd-alert-popup"),function(n){angular.equals(e[0],n)?angular.noop():t+=3*angular.element(n).height()}),e.css({bottom:t+"px",left:"15px",top:null,right:null})},c=function(e,t){var a=void 0,l=void 0,i=angular.element(e.toDOM());return n().appendChild(i[0]),s(i),i.find('button[class="close"]').click(function(e){r(i[0]),a?a(e):angular.noop()}),i.find('a[class="action"]').click(function(e){return l?l(e):angular.noop()}),t?setTimeout(function(){r(i[0]),a?a():angular.noop()},t):angular.noop(),{position:function(e){},onDismiss:function(e){return a=e,this},onRollback:function(e){return i.find('a[class="action"]').css({display:"block"}),l=e,this},close:function(){r(i[0])}}};return{$get:function(){return{success:t,error:l,warning:i,info:o}}}};l.$inject=[],t.default=l},{}],2:[function(e,n,t){"use strict";function a(){var e=document.createElement("p"),n=!1;if(e.addEventListener)e.addEventListener("DOMAttrModified",function(){n=!0},!1);else{if(!e.attachEvent)return!1;e.attachEvent("onDOMAttrModified",function(){n=!0})}return e.setAttribute("id","target"),n}function l(e,n){if(e){var t=this.data("attr-old-value");if(n.attributeName.indexOf("style")>=0){t.style||(t.style={});var a=n.attributeName.split(".");n.attributeName=a[0],n.oldValue=t.style[a[1]],n.newValue=a[1]+":"+this.prop("style")[$.camelCase(a[1])],t.style[a[1]]=n.newValue}else n.oldValue=t[n.attributeName],n.newValue=this.attr(n.attributeName),t[n.attributeName]=n.newValue;this.data("attr-old-value",t)}}var i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},o=window.MutationObserver||window.WebKitMutationObserver;angular.element.fn.attrchange=function(e,n){if("object"==(void 0===e?"undefined":i(e))){var t={trackValues:!1,callback:$.noop};if("function"==typeof e?t.callback=e:$.extend(t,e),t.trackValues&&this.each(function(e,n){for(var t,a={},e=0,l=n.attributes,i=l.length;e<i;e++)t=l.item(e),a[t.nodeName]=t.value;$(this).data("attr-old-value",a)}),o){var r={subtree:!1,attributes:!0,attributeOldValue:t.trackValues},s=new o(function(e){e.forEach(function(e){var n=e.target;t.trackValues&&(e.newValue=$(n).attr(e.attributeName)),"connected"===$(n).data("attrchange-status")&&t.callback.call(n,e)})});return this.data("attrchange-method","Mutation Observer").data("attrchange-status","connected").data("attrchange-obs",s).each(function(){s.observe(this,r)})}return a()?this.data("attrchange-method","DOMAttrModified").data("attrchange-status","connected").on("DOMAttrModified",function(e){e.originalEvent&&(e=e.originalEvent),e.attributeName=e.attrName,e.oldValue=e.prevValue,"connected"===$(this).data("attrchange-status")&&t.callback.call(this,e)}):"onpropertychange"in document.body?this.data("attrchange-method","propertychange").data("attrchange-status","connected").on("propertychange",function(e){e.attributeName=window.event.propertyName,l.call($(this),t.trackValues,e),"connected"===$(this).data("attrchange-status")&&t.callback.call(this,e)}):this}if("string"==typeof e&&$.fn.attrchange.hasOwnProperty("extensions")&&angular.element.fn.attrchange.extensions.hasOwnProperty(e))return $.fn.attrchange.extensions[e].call(this,n)}},{}],3:[function(e,n,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a={transclude:!0,bindings:{forceClick:"=?",opened:"=?"},template:"<ng-transclude></ng-transclude>",controller:["$scope","$element","$attrs","$timeout","$parse",function(e,n,t,a,l){function i(e,n,t){var a=document.createElement("div");document.body.appendChild(a),null!=t&&(a.style=t),a.style.fontSize=n+"px",a.style.position="absolute",a.style.left=-1e3,a.style.top=-1e3,a.innerHTML=e;var l={width:a.clientWidth,height:a.clientHeight};return document.body.removeChild(a),a=null,l}var o=this,r=function(e){a(function(){angular.forEach(e,function(e){angular.element(e).css({left:-1*(i(angular.element(e).text(),"14",e.style).width+30)})})})},s=function(e){n.on("mouseenter",function(){o.opened||(angular.forEach(n.find("ul"),function(e){g(angular.element(e)),r(angular.element(e).find("li > span"))}),u(e))}),n.on("mouseleave",function(){o.opened||(g(angular.element(e)),c(e))})},c=function(e){e[0].hasAttribute("left")?e.find("li").css({transform:"rotate(90deg) scale(0.3)"}):e.find("li").css({transform:"scale(0.3)"}),e.find("li > span").css({opacity:"0",position:"absolute"}),e.css({visibility:"hidden",opacity:"0"}),e.removeClass("open")},u=function(e){e[0].hasAttribute("left")?e.find("li").css({transform:"rotate(90deg) scale(1)"}):e.find("li").css({transform:"rotate(0deg) scale(1)"}),e.find("li > span").hover(function(){angular.element(this).css({opacity:"1",position:"absolute"})}),e.css({visibility:"visible",opacity:"1"}),e.addClass("open")},d=function(e){n.find("button").first().on("click",function(){e.hasClass("open")?c(e):u(e)})},g=function(e){if(n.css({display:"inline-block"}),e[0].hasAttribute("left")){var t=0,a=e.find("li");angular.forEach(a,function(e){return t+=angular.element(e)[0].offsetWidth});var l=-1*(t+10*a.length);e.css({left:l})}else{var i=e.height();e.css({top:-1*i})}};e.$watch("$ctrl.opened",function(e){angular.forEach(n.find("ul"),function(n){g(angular.element(n)),r(angular.element(n).find("li > span")),e?u(angular.element(n)):c(angular.element(n))})},!0),n.ready(function(){a(function(){angular.forEach(n.find("ul"),function(e){g(angular.element(e)),r(angular.element(e).find("li > span")),o.forceClick?d(angular.element(e)):s(angular.element(e))})})})}]};t.default=a},{}],4:[function(e,n,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a={bindings:{},template:'\n    <a class="navbar-brand" data-ng-click="$ctrl.navCollapse()" style="position: relative;cursor: pointer;">\n      <div class="navTrigger">\n        <i></i><i></i><i></i>\n      </div>\n    </a>\n  ',controller:["$scope","$element","$attrs","$timeout","$parse",function(e,n,t,a,l){var i=this;i.$onInit=function(){angular.element("nav.gl-nav").attrchange({trackValues:!0,callback:function(e){"class"==e.attributeName&&i.toggleHamburger(-1!=e.newValue.indexOf("collapsed"))}}),i.toggleHamburger=function(e){e?n.find("div.navTrigger").addClass("active"):n.find("div.navTrigger").removeClass("active")},i.navCollapse=function(){document.querySelector(".gumga-layout nav.gl-nav").classList.toggle("collapsed"),angular.element("nav.gl-nav").attrchange({trackValues:!0,callback:function(e){"class"==e.attributeName&&i.toggleHamburger(-1!=e.newValue.indexOf("collapsed"))}})},i.toggleHamburger(angular.element("nav.gl-nav").hasClass("collapsed"))}}]};t.default=a},{}],5:[function(e,n,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a={transclude:!0,bindings:{},template:"\n    <div ng-transclude></div>\n  ",controller:["$scope","$element","$attrs","$timeout","$parse",function(e,n,t,a,l){var i=this,o=void 0,r=void 0;i.$onInit=function(){var e=function(e){e.value?e.classList.add("active"):e.classList.remove("active")};i.$doCheck=function(){o&&o[0]&&e(o[0])},i.$postLink=function(){var e=n.find("input");o=e[0]?angular.element(e):angular.element(n.find("textarea")),r=o.attr("ng-model")||o.attr("data-ng-model")}}}]};t.default=a},{}],6:[function(e,n,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a={transclude:!0,bindings:{menu:"<",keys:"<",logo:"@?",largeLogo:"@?",smallLogo:"@?",hideSearch:"=?",isOpened:"=?",iconFirstLevel:"@?",showButtonFirstLevel:"=?",textFirstLevel:"@?"},template:'\n\n    <nav class="main-menu">\n        <div class="menu-header">\n            <img ng-if="$ctrl.logo" ng-src="{{$ctrl.logo}}"/>\n            <img class="large" ng-if="$ctrl.largeLogo" ng-src="{{$ctrl.largeLogo}}"/>\n            <img class="small" ng-if="$ctrl.smallLogo" ng-src="{{$ctrl.smallLogo}}"/>\n\n            <svg version="1.1" ng-click="$ctrl.toggleMenu()" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n                width="613.408px" height="613.408px" viewBox="0 0 613.408 613.408" xml:space="preserve">\n                <g>\n                <path d="M605.254,168.94L443.792,7.457c-6.924-6.882-17.102-9.239-26.319-6.069c-9.177,3.128-15.809,11.241-17.019,20.855\n                    l-9.093,70.512L267.585,216.428h-142.65c-10.344,0-19.625,6.215-23.629,15.746c-3.92,9.573-1.71,20.522,5.589,27.779\n                    l105.424,105.403L0.699,613.408l246.635-212.869l105.423,105.402c4.881,4.881,11.45,7.467,17.999,7.467\n                    c3.295,0,6.632-0.709,9.78-2.002c9.573-3.922,15.726-13.244,15.726-23.504V345.168l123.839-123.714l70.429-9.176\n                    c9.614-1.251,17.727-7.862,20.813-17.039C614.472,186.021,612.136,175.801,605.254,168.94z M504.856,171.985\n                    c-5.568,0.751-10.762,3.232-14.745,7.237L352.758,316.596c-4.796,4.775-7.466,11.242-7.466,18.041v91.742L186.437,267.481h91.68\n                    c6.757,0,13.243-2.669,18.04-7.466L433.51,122.766c3.983-3.983,6.569-9.176,7.258-14.786l3.629-27.696l88.155,88.114\n                    L504.856,171.985z"/>\n                </g>\n            </svg>\n\n        </div>\n        <div class="scrollbar style-1">\n            <ul data-ng-class="\'level\'.concat($ctrl.back.length)">\n\n                <li class="goback gmd gmd-ripple" data-ng-show="$ctrl.previous.length > 0" data-ng-click="$ctrl.prev()">\n                    <a>\n                        <i class="material-icons">\n                            keyboard_arrow_left\n                        </i>\n                        <span data-ng-bind="$ctrl.back[$ctrl.back.length - 1].label" class="nav-text"></span>\n                    </a>\n                </li>\n\n                <li class="gmd-ripple"\n                    data-ng-repeat="item in $ctrl.menu | filter:$ctrl.search"\n                    data-ng-show="$ctrl.allow(item)"\n                    ng-click="$ctrl.next(item, $event)"\n                    data-ng-class="[!$ctrl.disableAnimations ? $ctrl.slide : \'\', {header: item.type == \'header\', divider: item.type == \'separator\'}]">\n                    \n                    <a ng-if="item.type != \'separator\' && item.state" ui-sref="{{item.state}}">\n                        <i data-ng-if="item.icon" class="material-icons" data-ng-bind="item.icon"></i>\n                        <span class="nav-text" ng-bind="item.label"></span>\n                        <i data-ng-if="item.children && item.children.length > 0" class="material-icons pull-right">keyboard_arrow_right</i>\n                    </a>\n\n                    <a ng-if="item.type != \'separator\' && !item.state">\n                        <i data-ng-if="item.icon" class="material-icons" data-ng-bind="item.icon"></i>\n                        <span class="nav-text" ng-bind="item.label"></span>\n                        <i data-ng-if="item.children && item.children.length > 0" class="material-icons pull-right">keyboard_arrow_right</i>\n                    </a>\n\n                </li>\n            </ul>\n    </nav>\n    \n    ',controller:["$timeout","$attrs","$element",function(e,n,t){var a=this;a.keys=a.keys||[],a.iconFirstLevel=a.iconFirstLevel||"glyphicon glyphicon-home",a.previous=[],a.back=[];var l=void 0,i=void 0;a.$onInit=function(){l=angular.element(".gumga-layout .gl-main"),i=angular.element(".gumga-layout .gl-header")},a.toggleMenu=function(){t.toggleClass("fixed")},a.prev=function(){e(function(){a.menu=a.previous.pop(),a.back.pop()},250)},a.next=function(n){e(function(){n.children&&n.children.length>0&&(a.previous.push(a.menu),a.menu=n.children,a.back.push(n))},250)},a.goBackToFirstLevel=function(){a.menu=a.previous[0],a.previous=[],a.back=[]},a.allow=function(e){if(a.keys&&a.keys.length>0)return!e.key||a.keys.indexOf(e.key)>-1}}]};t.default=a},{}],7:[function(e,n,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),e("../attrchange/attrchange");var a={transclude:!0,bindings:{menu:"<",keys:"<",hideSearch:"=?",isOpened:"=?",iconFirstLevel:"@?",showButtonFirstLevel:"=?",textFirstLevel:"@?",disableAnimations:"=?",shrinkMode:"=?"},template:'\n\n    <div style="padding: 15px 15px 0px 15px;" ng-if="!$ctrl.hideSearch">\n      <input type="text" data-ng-model="$ctrl.search" class="form-control gmd" placeholder="Busca...">\n      <div class="bar"></div>\n    </div>\n\n    <button class="btn btn-default btn-block gmd" data-ng-if="$ctrl.showButtonFirstLevel" data-ng-click="$ctrl.goBackToFirstLevel()" data-ng-disabled="!$ctrl.previous.length" type="button">\n      <i data-ng-class="[$ctrl.iconFirstLevel]"></i>\n      <span data-ng-bind="$ctrl.textFirstLevel"></span>\n    </button>\n\n    <ul menu data-ng-class="\'level\'.concat($ctrl.back.length)">\n      <li class="goback gmd gmd-ripple" data-ng-show="$ctrl.previous.length > 0" data-ng-click="$ctrl.prev()">\n        <a>\n          <i class="material-icons">\n            keyboard_arrow_left\n          </i>\n          <span data-ng-bind="$ctrl.back[$ctrl.back.length - 1].label"></span>\n        </a>\n      </li>\n\n      <li class="gmd gmd-ripple" \n          data-ng-repeat="item in $ctrl.menu | filter:$ctrl.search"\n          data-ng-show="$ctrl.allow(item)"\n          ng-click="$ctrl.next(item, $event)"\n          data-ng-class="[!$ctrl.disableAnimations ? $ctrl.slide : \'\', {header: item.type == \'header\', divider: item.type == \'separator\'}]">\n\n          <a ng-if="item.type != \'separator\' && item.state" ui-sref="{{item.state}}">\n            <i data-ng-if="item.icon" class="material-icons" data-ng-bind="item.icon"></i>\n            <span ng-bind="item.label"></span>\n            <i data-ng-if="item.children" class="material-icons pull-right">\n              keyboard_arrow_right\n            </i>\n          </a>\n\n          <a ng-if="item.type != \'separator\' && !item.state">\n            <i data-ng-if="item.icon" class="material-icons" data-ng-bind="item.icon"></i>\n            <span ng-bind="item.label"></span>\n            <i data-ng-if="item.children" class="material-icons pull-right">\n              keyboard_arrow_right\n            </i>\n          </a>\n\n      </li>\n    </ul>\n\n    <ng-transclude></ng-transclude>\n\n    <ul class="gl-menu-chevron" ng-if="$ctrl.shrinkMode && !$ctrl.fixed" ng-click="$ctrl.openMenuShrink()">\n      <li>\n        <i class="material-icons">chevron_left</i>\n      </li>\n    </ul>\n\n    <ul class="gl-menu-chevron unfixed" ng-if="$ctrl.shrinkMode && $ctrl.fixed">\n      <li ng-click="$ctrl.unfixedMenuShrink()">\n        <i class="material-icons">chevron_left</i>\n      </li>\n    </ul>\n\n    <ul class="gl-menu-chevron possiblyFixed" ng-if="$ctrl.possiblyFixed">\n      <li ng-click="$ctrl.fixedMenuShrink()" align="center" style="display: flex; justify-content: flex-end;">\n      <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n            width="613.408px" style="display: inline-block; position: relative; height: 1em; width: 3em; font-size: 1.33em; padding: 0; margin: 0;;"  height="613.408px" viewBox="0 0 613.408 613.408" style="enable-background:new 0 0 613.408 613.408;"\n            xml:space="preserve">\n        <g>\n          <path d="M605.254,168.94L443.792,7.457c-6.924-6.882-17.102-9.239-26.319-6.069c-9.177,3.128-15.809,11.241-17.019,20.855\n            l-9.093,70.512L267.585,216.428h-142.65c-10.344,0-19.625,6.215-23.629,15.746c-3.92,9.573-1.71,20.522,5.589,27.779\n            l105.424,105.403L0.699,613.408l246.635-212.869l105.423,105.402c4.881,4.881,11.45,7.467,17.999,7.467\n            c3.295,0,6.632-0.709,9.78-2.002c9.573-3.922,15.726-13.244,15.726-23.504V345.168l123.839-123.714l70.429-9.176\n            c9.614-1.251,17.727-7.862,20.813-17.039C614.472,186.021,612.136,175.801,605.254,168.94z M504.856,171.985\n            c-5.568,0.751-10.762,3.232-14.745,7.237L352.758,316.596c-4.796,4.775-7.466,11.242-7.466,18.041v91.742L186.437,267.481h91.68\n            c6.757,0,13.243-2.669,18.04-7.466L433.51,122.766c3.983-3.983,6.569-9.176,7.258-14.786l3.629-27.696l88.155,88.114\n            L504.856,171.985z"/>\n        </g>\n        </svg>\n      </li>\n    </ul>\n\n  ',controller:["$timeout","$attrs","$element",function(e,n,t){var a=this;a.keys=a.keys||[],a.iconFirstLevel=a.iconFirstLevel||"glyphicon glyphicon-home",a.previous=[],a.back=[],a.$onInit=function(){a.disableAnimations=a.disableAnimations||!1;var l=angular.element(".gumga-layout .gl-main"),i=angular.element(".gumga-layout .gl-header"),o=function(e){switch(e.toLowerCase().trim()){case"true":case"yes":case"1":return!0;case"false":case"no":case"0":case null:return!1;default:return Boolean(e)}};a.fixed=o(n.fixed||"false"),a.fixedMain=o(n.fixedMain||"false"),a.fixedMain&&(a.fixed=!0);var r=function(e){a.shrinkMode?(angular.element(".gumga-layout nav.gl-nav").addClass("closed"),angular.element("div.gmd-menu-backdrop").removeClass("active")):angular.element(".gumga-layout nav.gl-nav").removeClass("collapsed")},s=function(){if(!a.fixed||a.shrinkMode){var e=document.createElement("div");e.classList.add("gmd-menu-backdrop"),0==angular.element("div.gmd-menu-backdrop").length&&angular.element("body")[0].appendChild(e),angular.element("div.gmd-menu-backdrop").on("click",r)}};s();var c=function n(){e(function(){var e=angular.element(".gumga-layout .gl-header").height();0==e&&n(),a.fixed&&(e=0),angular.element(".gumga-layout nav.gl-nav.collapsed").css({top:e})})};a.toggleContent=function(n){e(function(){if(a.fixed){var e=angular.element(".gumga-layout .gl-main"),t=angular.element(".gumga-layout .gl-header");n&&t.ready(function(){c()}),n?e.addClass("collapsed"):e.removeClass("collapsed"),!a.fixedMain&&a.fixed&&(n?t.addClass("collapsed"):t.removeClass("collapsed"))}})};var u=function(n){var t=angular.element(".gumga-layout .gl-header"),l=angular.element("div.gmd-menu-backdrop");if(n&&!a.fixed){l.addClass("active");var i=t.height();i>0&&!a.shrinkMode?l.css({top:i}):l.css({top:0})}else l.removeClass("active");e(function(){return a.isOpened=n})};if(a.shrinkMode){var d=angular.element(".gumga-layout .gl-main"),g=angular.element(".gumga-layout .gl-header"),p=angular.element(".gumga-layout nav.gl-nav");d.css({"margin-left":"64px"}),g.css({"margin-left":"64px"}),p.css({"z-index":"1006"}),angular.element("nav.gl-nav").addClass("closed collapsed"),u(!angular.element("nav.gl-nav").hasClass("closed"))}angular.element.fn.attrchange&&(angular.element("nav.gl-nav").attrchange({trackValues:!0,callback:function(e){"class"==e.attributeName&&(a.shrinkMode?(a.possiblyFixed=-1==e.newValue.indexOf("closed"),u(a.possiblyFixed)):(a.toggleContent(-1!=e.newValue.indexOf("collapsed")),u(-1!=e.newValue.indexOf("collapsed"))))}}),a.shrinkMode||(a.toggleContent(angular.element("nav.gl-nav").hasClass("collapsed")),u(angular.element("nav.gl-nav").hasClass("collapsed")))),a.$onInit=function(){a.hasOwnProperty("showButtonFirstLevel")||(a.showButtonFirstLevel=!0)},a.prev=function(){e(function(){a.menu=a.previous.pop(),a.back.pop()},250)},a.next=function(n){var t=angular.element("nav.gl-nav")[0];if(a.shrinkMode&&t.classList.contains("closed")&&n.children&&angular.element(".gumga-layout nav.gl-nav").is("[open-on-hover]"))return a.openMenuShrink(),void a.next(n);e(function(){n.children&&(a.previous.push(a.menu),a.menu=n.children,a.back.push(n))},250)},a.goBackToFirstLevel=function(){a.menu=a.previous[0],a.previous=[],a.back=[]},a.allow=function(e){if(a.keys&&a.keys.length>0)return!e.key||a.keys.indexOf(e.key)>-1},a.openMenuShrink=function(){a.possiblyFixed=!0,angular.element(".gumga-layout nav.gl-nav").removeClass("closed")},a.fixedMenuShrink=function(){t.attr("fixed",!0),a.fixed=!0,a.possiblyFixed=!1,s(),l.css({"margin-left":""}),i.css({"margin-left":""}),a.toggleContent(!0),u(!0)},a.unfixedMenuShrink=function(){t.attr("fixed",!1),a.fixed=!1,a.possiblyFixed=!0,s(),l.css({"margin-left":"64px"}),i.css({"margin-left":"64px"}),u(!0),angular.element(".gumga-layout nav.gl-nav").addClass("closed")}}}]};t.default=a},{"../attrchange/attrchange":2}],8:[function(e,n,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a={bindings:{icon:"@",notifications:"=",onView:"&?"},template:'\n    <ul class="nav navbar-nav navbar-right notifications">\n      <li class="dropdown">\n        <a href="#" badge="{{$ctrl.notifications.length}}" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">\n          <i class="material-icons" data-ng-bind="$ctrl.icon"></i>\n        </a>\n        <ul class="dropdown-menu">\n          <li data-ng-repeat="item in $ctrl.notifications" data-ng-click="$ctrl.view($event, item)">\n            <div class="media">\n              <div class="media-left">\n                <img class="media-object" data-ng-src="{{item.image}}">\n              </div>\n              <div class="media-body" data-ng-bind="item.content"></div>\n            </div>\n          </li>\n        </ul>\n      </li>\n    </ul>\n  ',controller:function(){var e=this;e.$onInit=function(){e.view=function(n,t){return e.onView({event:n,item:t})}}}};t.default=a},{}],9:[function(e,n,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=function(){return{restrict:"C",link:function(e,n,t){function a(e){var t=angular.element('<span class="gmd-ripple-effect animate">'),a=n[0].getBoundingClientRect(),l=Math.max(a.height,a.width),i=e.pageX-a.left-l/2-document.body.scrollLeft,o=e.pageY-a.top-l/2-document.body.scrollTop;t[0].style.width=t[0].style.height=l+"px",t[0].style.left=i+"px",t[0].style.top=o+"px",t.on("animationend webkitAnimationEnd",function(){angular.element(this).remove()}),n.append(t)}n[0].classList.contains("fixed")||(n[0].style.position="relative"),n[0].style.overflow="hidden",n[0].style.userSelect="none",n[0].style.msUserSelect="none",n[0].style.mozUserSelect="none",n[0].style.webkitUserSelect="none",n.bind("mousedown",a)}}};t.default=a},{}],10:[function(e,n,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a={require:["ngModel","ngRequired"],transclude:!0,bindings:{ngModel:"=",ngDisabled:"=?",unselect:"@?",options:"<",option:"@",value:"@",placeholder:"@?",onChange:"&?",translateLabel:"=?"},template:'\n  <div class="dropdown gmd">\n     <label class="control-label floating-dropdown" ng-show="$ctrl.selected">\n      {{$ctrl.placeholder}} <span ng-if="$ctrl.validateGumgaError" ng-class="{\'gmd-select-required\': $ctrl.ngModelCtrl.$error.required}">*<span>\n     </label>\n     <button class="btn btn-default gmd dropdown-toggle gmd-select-button"\n             type="button"\n             style="border-radius: 0;"\n             id="gmdSelect"\n             data-toggle="dropdown"\n             ng-disabled="$ctrl.ngDisabled"\n             aria-haspopup="true"\n             aria-expanded="true">\n       <span class="item-select" ng-if="!$ctrl.translateLabel" data-ng-show="$ctrl.selected" data-ng-bind="$ctrl.selected"></span>\n       <span class="item-select" ng-if="$ctrl.translateLabel" data-ng-show="$ctrl.selected">\n          {{ $ctrl.selected | gumgaTranslate }}\n       </span>\n       <span data-ng-hide="$ctrl.selected" class="item-select placeholder">\n        {{$ctrl.placeholder}}\n       </span>\n       <span ng-if="$ctrl.ngModelCtrl.$error.required && $ctrl.validateGumgaError" class="word-required">*</span>\n       <span class="caret"></span>\n     </button>\n     <ul class="dropdown-menu" aria-labelledby="gmdSelect" ng-show="$ctrl.option" style="display: none;">\n       <li data-ng-click="$ctrl.clear()" ng-if="$ctrl.unselect">\n         <a data-ng-class="{active: false}">{{$ctrl.unselect}}</a>\n       </li>\n       <li data-ng-repeat="option in $ctrl.options track by $index">\n         <a class="select-option" data-ng-click="$ctrl.select(option)" data-ng-bind="option[$ctrl.option] || option" data-ng-class="{active: $ctrl.isActive(option)}"></a>\n       </li>\n     </ul>\n     <ul class="dropdown-menu gmd" aria-labelledby="gmdSelect" ng-show="!$ctrl.option" style="max-height: 250px;overflow: auto;display: none;" ng-transclude></ul>\n   </div>\n  ',controller:["$scope","$attrs","$timeout","$element","$transclude","$compile",function(e,n,t,a,l,i){function o(e,n){return e.className==n?e:e.parentNode?o(e.parentNode,n):e}function r(e){e=e||window.event;var n=o(e.target,"select-option");if("A"==n.nodeName&&"select-option"==n.className){var t=s(e),a=angular.element(n.parentNode.parentNode).scrollTop();if(a+angular.element(n.parentNode.parentNode).innerHeight()>=n.parentNode.parentNode.scrollHeight&&"UP"!=t)e.preventDefault&&e.preventDefault(),e.returnValue=!1;else{if(!(a<=0&&"DOWN"!=t))return void(e.returnValue=!0);e.preventDefault&&e.preventDefault(),e.returnValue=!1}}else e.preventDefault&&e.preventDefault(),e.returnValue=!1}function s(e){var n;return n=e.wheelDelta?e.wheelDelta:-1*e.deltaY,n<0?"DOWN":n>0?"UP":void 0}function c(e){if(keys&&keys[e.keyCode])return r(e),!1;console.clear()}function u(){window.addEventListener&&(window.addEventListener("scroll",r,!1),window.addEventListener("DOMMouseScroll",r,!1)),window.onwheel=r,window.onmousewheel=document.onmousewheel=r,window.ontouchmove=r,document.onkeydown=c}function d(){window.removeEventListener&&window.removeEventListener("DOMMouseScroll",r,!1),window.onmousewheel=document.onmousewheel=null,window.onwheel=null,window.ontouchmove=null,document.onkeydown=null}var g=this,p=a.controller("ngModel"),m=g.options||[];g.ngModelCtrl=p,g.validateGumgaError=n.hasOwnProperty("gumgaRequired");var f=function(e){for(var n=e.getBoundingClientRect(),t=window.pageXOffset||document.documentElement.scrollLeft,a=(window.pageYOffset||document.documentElement.scrollTop,0),l=0;e&&!isNaN(e.offsetLeft)&&!isNaN(e.offsetTop);)a+=e.offsetLeft-e.scrollLeft,l+=e.offsetTop-e.scrollTop,e=e.offsetParent;return{top:l,left:n.left+t}},v=function(e){var n=angular.element("body").scrollTop(),t=e.offset().top,a=t-n;return angular.element(window).height()-a},h=function(e,n){var t=f(e[0]);angular.forEach(n,function(n){if(0!=angular.element(n).height()){var a=v(angular.element(e[0]));angular.element(n).height()>a?angular.element(n).css({height:a-5+"px"}):angular.element(n).height()!=a-5&&angular.element(n).css({height:"auto"}),angular.element(n).css({display:"block",position:"fixed",left:t.left-1+"px",top:t.top-2+"px",width:e.find("div.dropdown")[0].clientWidth+1})}})},b=function(e,n){var t=angular.element(document).find("body").eq(0),a=angular.element(document.createElement("div"));a.addClass("dropdown gmd"),a.append(n),t.append(a),angular.element(e.find("button.dropdown-toggle")).attrchange({trackValues:!0,callback:function(t){"aria-expanded"==t.attributeName&&"false"==t.newValue&&(d(),n=angular.element(a).find("ul"),angular.forEach(n,function(e){angular.element(e).css({display:"none"})}),e.find("div.dropdown").append(n),a.remove())}})};a.bind("click",function(e){var n=a.find("ul");if(0==n.find("gmd-option").length)return void e.stopPropagation();h(a,n),u(),b(a,n)}),g.select=function(e){angular.forEach(m,function(e){e.selected=!1}),e.selected=!0,g.ngModel=e.ngValue,g.selected=e.ngLabel},g.addOption=function(e){m.push(e)};var y=function(e){angular.forEach(m,function(n){n.ngValue.$$hashKey&&delete n.ngValue.$$hashKey,angular.equals(e,n.ngValue)&&g.select(n)})};t(function(){return y(g.ngModel)}),g.$doCheck=function(){m&&m.length>0&&y(g.ngModel)}}]};t.default=a},{}],11:[function(e,n,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a={transclude:!0,require:{gmdSelectCtrl:"^gmdSelect"},bindings:{},template:'\n      <a class="select-option" data-ng-click="$ctrl.select()" ng-transclude></a>\n    ',controller:["$scope","$attrs","$timeout","$element","$transclude",function(e,n,t,a,l){var i=this,o=this;o.select=function(){o.gmdSelectCtrl.select(i)}}]};t.default=a},{}],12:[function(e,n,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a={transclude:!0,require:{gmdSelectCtrl:"^gmdSelect"},bindings:{ngValue:"=",ngLabel:"="},template:'\n    <a class="select-option" data-ng-click="$ctrl.select($ctrl.ngValue, $ctrl.ngLabel)" ng-class="{active: $ctrl.selected}" ng-transclude></a>\n  ',controller:["$scope","$attrs","$timeout","$element","$transclude",function(e,n,t,a,l){var i=this,o=this;o.$onInit=function(){o.gmdSelectCtrl.addOption(i)},o.select=function(){o.gmdSelectCtrl.select(o),o.gmdSelectCtrl.onChange&&o.gmdSelectCtrl.onChange({value:i.ngValue})}}]};t.default=a},{}],13:[function(e,n,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a={transclude:!0,require:{gmdSelectCtrl:"^gmdSelect"},bindings:{ngModel:"=",placeholder:"@?"},template:'\n    <div class="input-group" style="border: none;background: #f9f9f9;">\n      <span class="input-group-addon" id="basic-addon1" style="border: none;">\n        <i class="material-icons">search</i>\n      </span>\n      <input type="text" style="border: none;" class="form-control gmd" ng-model="$ctrl.ngModel" placeholder="{{$ctrl.placeholder}}">\n    </div>\n  ',controller:["$scope","$attrs","$timeout","$element","$transclude",function(e,n,t,a,l){a.bind("click",function(e){e.stopPropagation()})}]};t.default=a},{}],14:[function(e,n,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a={bindings:{diameter:"@?",box:"=?"},template:'\n  <div class="spinner-material" ng-if="$ctrl.diameter">\n   <svg xmlns="http://www.w3.org/2000/svg"\n        xmlns:xlink="http://www.w3.org/1999/xlink"\n        version="1"\n        ng-class="{\'spinner-box\' : $ctrl.box}"\n        style="width: {{$ctrl.diameter}};height: {{$ctrl.diameter}};"\n        viewBox="0 0 28 28">\n    <g class="qp-circular-loader">\n     <path class="qp-circular-loader-path" fill="none" d="M 14,1.5 A 12.5,12.5 0 1 1 1.5,14" stroke-linecap="round" />\n    </g>\n   </svg>\n  </div>',controller:["$scope","$element","$attrs","$timeout","$parse",function(e,n,t,a,l){var i=this;i.$onInit=function(){i.diameter=i.diameter||"50px"}}]};t.default=a},{}],15:[function(e,n,t){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}
var l=e("./menu/component.js"),i=a(l),o=e("./menu-shrink/component.js"),r=a(o),s=e("./notification/component.js"),c=a(s),u=e("./select/component.js"),d=a(u),g=e("./select/search/component.js"),p=a(g),m=e("./select/option/component.js"),f=a(m),v=e("./select/empty/component.js"),h=a(v),b=e("./input/component.js"),y=a(b),$=e("./ripple/component.js"),w=a($),k=e("./fab/component.js"),x=a(k),M=e("./spinner/component.js"),L=a(M),C=e("./hamburger/component.js"),O=a(C),_=e("./alert/provider.js"),E=a(_);angular.module("gumga.layout",[]).provider("$gmdAlert",E.default).directive("gmdRipple",w.default).component("glMenu",i.default).component("menuShrink",r.default).component("glNotification",c.default).component("gmdSelect",d.default).component("gmdSelectSearch",p.default).component("gmdOptionEmpty",h.default).component("gmdOption",f.default).component("gmdInput",y.default).component("gmdFab",x.default).component("gmdSpinner",L.default).component("gmdHamburger",O.default)},{"./alert/provider.js":1,"./fab/component.js":3,"./hamburger/component.js":4,"./input/component.js":5,"./menu-shrink/component.js":6,"./menu/component.js":7,"./notification/component.js":8,"./ripple/component.js":9,"./select/component.js":10,"./select/empty/component.js":11,"./select/option/component.js":12,"./select/search/component.js":13,"./spinner/component.js":14}]},{},[15]);
//# sourceMappingURL=gumga-layout.js.map
