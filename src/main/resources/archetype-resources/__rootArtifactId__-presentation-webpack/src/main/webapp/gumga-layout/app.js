(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var template = '\n  <div class="alert gmd gmd-alert-popup alert-ALERT_TYPE alert-dismissible" role="alert">\n    <button type="button" class="close" aria-label="Close"><span aria-hidden="true">\xD7</span></button>\n    <strong>ALERT_TITLE</strong> ALERT_MESSAGE\n    <a class="action" style="display: none;">Desfazer</a>\n  </div>\n';

var Provider = function Provider() {

  String.prototype.toDOM = String.prototype.toDOM || function () {
    var el = document.createElement('div');
    el.innerHTML = this;
    var frag = document.createDocumentFragment();
    return frag.appendChild(el.removeChild(el.firstChild));
  };

  var getTemplate = function getTemplate(type, title, message) {
    var toReturn = template.trim().replace('ALERT_TYPE', type);
    toReturn = toReturn.trim().replace('ALERT_TITLE', title);
    toReturn = toReturn.trim().replace('ALERT_MESSAGE', message);
    return toReturn;
  };

  var getElementBody = function getElementBody() {
    return angular.element('body')[0];
  };

  var success = function success(title, message, time) {
    return createAlert(getTemplate('success', title || '', message || ''), time);
  };

  var error = function error(title, message, time) {
    return createAlert(getTemplate('danger', title || '', message || ''), time);
  };

  var warning = function warning(title, message, time) {
    return createAlert(getTemplate('warning', title, message), time);
  };

  var info = function info(title, message, time) {
    return createAlert(getTemplate('info', title, message), time);
  };

  var closeAlert = function closeAlert(elm) {
    angular.element(elm).css({
      transform: 'scale(0.3)'
    });
    setTimeout(function () {
      var body = getElementBody();
      if (body.contains(elm)) {
        body.removeChild(elm);
      }
    }, 100);
  };

  var bottomLeft = function bottomLeft(elm) {
    var bottom = 15;
    angular.forEach(angular.element(getElementBody()).find('div.gmd-alert-popup'), function (popup) {
      angular.equals(elm[0], popup) ? angular.noop() : bottom += angular.element(popup).height() * 3;
    });
    elm.css({
      bottom: bottom + 'px',
      left: '15px',
      top: null,
      right: null
    });
  };

  var createAlert = function createAlert(template, time) {
    var _onDismiss = void 0,
        _onRollback = void 0,
        elm = angular.element(template.toDOM());
    getElementBody().appendChild(elm[0]);

    bottomLeft(elm);

    elm.find('button[class="close"]').click(function (evt) {
      closeAlert(elm[0]);
      _onDismiss ? _onDismiss(evt) : angular.noop();
    });

    elm.find('a[class="action"]').click(function (evt) {
      return _onRollback ? _onRollback(evt) : angular.noop();
    });

    time ? setTimeout(function () {
      closeAlert(elm[0]);
      _onDismiss ? _onDismiss() : angular.noop();
    }, time) : angular.noop();

    return {
      position: function position(_position) {},
      onDismiss: function onDismiss(callback) {
        _onDismiss = callback;
        return this;
      },
      onRollback: function onRollback(callback) {
        elm.find('a[class="action"]').css({ display: 'block' });
        _onRollback = callback;
        return this;
      },
      close: function close() {
        closeAlert(elm[0]);
      }
    };
  };

  return {
    $get: function $get() {
      return {
        success: success,
        error: error,
        warning: warning,
        info: info
      };
    }
  };
};

Provider.$inject = [];

exports.default = Provider;

},{}],2:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function isDOMAttrModifiedSupported() {
	var p = document.createElement('p');
	var flag = false;

	if (p.addEventListener) {
		p.addEventListener('DOMAttrModified', function () {
			flag = true;
		}, false);
	} else if (p.attachEvent) {
		p.attachEvent('onDOMAttrModified', function () {
			flag = true;
		});
	} else {
		return false;
	}
	p.setAttribute('id', 'target');
	return flag;
}

function checkAttributes(chkAttr, e) {
	if (chkAttr) {
		var attributes = this.data('attr-old-value');

		if (e.attributeName.indexOf('style') >= 0) {
			if (!attributes['style']) attributes['style'] = {}; //initialize
			var keys = e.attributeName.split('.');
			e.attributeName = keys[0];
			e.oldValue = attributes['style'][keys[1]]; //old value
			e.newValue = keys[1] + ':' + this.prop("style")[$.camelCase(keys[1])]; //new value
			attributes['style'][keys[1]] = e.newValue;
		} else {
			e.oldValue = attributes[e.attributeName];
			e.newValue = this.attr(e.attributeName);
			attributes[e.attributeName] = e.newValue;
		}

		this.data('attr-old-value', attributes); //update the old value object
	}
}

//initialize Mutation Observer
var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

angular.element.fn.attrchange = function (a, b) {
	if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) == 'object') {
		//core
		var cfg = {
			trackValues: false,
			callback: $.noop
		};
		//backward compatibility
		if (typeof a === "function") {
			cfg.callback = a;
		} else {
			$.extend(cfg, a);
		}

		if (cfg.trackValues) {
			//get attributes old value
			this.each(function (i, el) {
				var attributes = {};
				for (var attr, i = 0, attrs = el.attributes, l = attrs.length; i < l; i++) {
					attr = attrs.item(i);
					attributes[attr.nodeName] = attr.value;
				}
				$(this).data('attr-old-value', attributes);
			});
		}

		if (MutationObserver) {
			//Modern Browsers supporting MutationObserver
			var mOptions = {
				subtree: false,
				attributes: true,
				attributeOldValue: cfg.trackValues
			};
			var observer = new MutationObserver(function (mutations) {
				mutations.forEach(function (e) {
					var _this = e.target;
					//get new value if trackValues is true
					if (cfg.trackValues) {
						e.newValue = $(_this).attr(e.attributeName);
					}
					if ($(_this).data('attrchange-status') === 'connected') {
						//execute if connected
						cfg.callback.call(_this, e);
					}
				});
			});

			return this.data('attrchange-method', 'Mutation Observer').data('attrchange-status', 'connected').data('attrchange-obs', observer).each(function () {
				observer.observe(this, mOptions);
			});
		} else if (isDOMAttrModifiedSupported()) {
			//Opera
			//Good old Mutation Events
			return this.data('attrchange-method', 'DOMAttrModified').data('attrchange-status', 'connected').on('DOMAttrModified', function (event) {
				if (event.originalEvent) {
					event = event.originalEvent;
				} //jQuery normalization is not required
				event.attributeName = event.attrName; //property names to be consistent with MutationObserver
				event.oldValue = event.prevValue; //property names to be consistent with MutationObserver
				if ($(this).data('attrchange-status') === 'connected') {
					//disconnected logically
					cfg.callback.call(this, event);
				}
			});
		} else if ('onpropertychange' in document.body) {
			//works only in IE
			return this.data('attrchange-method', 'propertychange').data('attrchange-status', 'connected').on('propertychange', function (e) {
				e.attributeName = window.event.propertyName;
				//to set the attr old value
				checkAttributes.call($(this), cfg.trackValues, e);
				if ($(this).data('attrchange-status') === 'connected') {
					//disconnected logically
					cfg.callback.call(this, e);
				}
			});
		}
		return this;
	} else if (typeof a == 'string' && $.fn.attrchange.hasOwnProperty('extensions') && angular.element.fn.attrchange['extensions'].hasOwnProperty(a)) {
		//extensions/options
		return $.fn.attrchange['extensions'][a].call(this, b);
	}
};

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Component = {
  transclude: true,
  bindings: {
    forceClick: '=?',
    opened: '=?'
  },
  template: '<ng-transclude></ng-transclude>',
  controller: ['$scope', '$element', '$attrs', '$timeout', '$parse', function ($scope, $element, $attrs, $timeout, $parse) {
    var ctrl = this;

    var handlingOptions = function handlingOptions(elements) {
      $timeout(function () {
        angular.forEach(elements, function (option) {
          angular.element(option).css({ left: (measureText(angular.element(option).text(), '14', option.style).width + 30) * -1 });
        });
      });
    };

    function measureText(pText, pFontSize, pStyle) {
      var lDiv = document.createElement('div');
      document.body.appendChild(lDiv);

      if (pStyle != null) {
        lDiv.style = pStyle;
      }

      lDiv.style.fontSize = "" + pFontSize + "px";
      lDiv.style.position = "absolute";
      lDiv.style.left = -1000;
      lDiv.style.top = -1000;

      lDiv.innerHTML = pText;

      var lResult = {
        width: lDiv.clientWidth,
        height: lDiv.clientHeight
      };

      document.body.removeChild(lDiv);

      lDiv = null;

      return lResult;
    }

    var withFocus = function withFocus(ul) {
      $element.on('mouseenter', function () {
        if (ctrl.opened) {
          return;
        }
        angular.forEach($element.find('ul'), function (ul) {
          verifyPosition(angular.element(ul));
          handlingOptions(angular.element(ul).find('li > span'));
        });
        open(ul);
      });
      $element.on('mouseleave', function () {
        if (ctrl.opened) {
          return;
        }
        verifyPosition(angular.element(ul));
        close(ul);
      });
    };

    var close = function close(ul) {
      if (ul[0].hasAttribute('left')) {
        ul.find('li').css({ transform: 'rotate(90deg) scale(0.3)' });
      } else {
        ul.find('li').css({ transform: 'scale(0.3)' });
      }
      ul.find('li > span').css({ opacity: '0', position: 'absolute' });
      ul.css({ visibility: "hidden", opacity: '0' });
      ul.removeClass('open');
      // if(ctrl.opened){
      //   ctrl.opened = false;
      //   $scope.$digest();
      // }
    };

    var open = function open(ul) {
      if (ul[0].hasAttribute('left')) {
        ul.find('li').css({ transform: 'rotate(90deg) scale(1)' });
      } else {
        ul.find('li').css({ transform: 'rotate(0deg) scale(1)' });
      }
      ul.find('li > span').hover(function () {
        angular.element(this).css({ opacity: '1', position: 'absolute' });
      });
      ul.css({ visibility: "visible", opacity: '1' });
      ul.addClass('open');
      // if(!ctrl.opened){
      //   ctrl.opened = true;
      //   $scope.$digest();
      // }
    };

    var withClick = function withClick(ul) {
      $element.find('button').first().on('click', function () {
        if (ul.hasClass('open')) {
          close(ul);
        } else {
          open(ul);
        }
      });
    };

    var verifyPosition = function verifyPosition(ul) {
      $element.css({ display: "inline-block" });
      if (ul[0].hasAttribute('left')) {
        var width = 0,
            lis = ul.find('li');
        angular.forEach(lis, function (li) {
          return width += angular.element(li)[0].offsetWidth;
        });
        var size = (width + 10 * lis.length) * -1;
        ul.css({ left: size });
      } else {
        var _size = ul.height();
        ul.css({ top: _size * -1 });
      }
    };

    $scope.$watch('$ctrl.opened', function (value) {
      angular.forEach($element.find('ul'), function (ul) {
        verifyPosition(angular.element(ul));
        handlingOptions(angular.element(ul).find('li > span'));
        if (value) {
          open(angular.element(ul));
        } else {
          close(angular.element(ul));
        }
      });
    }, true);

    $element.ready(function () {
      $timeout(function () {
        angular.forEach($element.find('ul'), function (ul) {
          verifyPosition(angular.element(ul));
          handlingOptions(angular.element(ul).find('li > span'));
          if (!ctrl.forceClick) {
            withFocus(angular.element(ul));
          } else {
            withClick(angular.element(ul));
          }
        });
      });
    });
  }]
};

exports.default = Component;

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Component = {
  bindings: {},
  template: '\n    <a class="navbar-brand" data-ng-click="$ctrl.navCollapse()" style="position: relative;cursor: pointer;">\n      <div class="navTrigger">\n        <i></i><i></i><i></i>\n      </div>\n    </a>\n  ',
  controller: ['$scope', '$element', '$attrs', '$timeout', '$parse', function ($scope, $element, $attrs, $timeout, $parse) {
    var ctrl = this;

    ctrl.$onInit = function () {
      angular.element("nav.gl-nav").attrchange({
        trackValues: true,
        callback: function callback(evnt) {
          if (evnt.attributeName == 'class') {
            ctrl.toggleHamburger(evnt.newValue.indexOf('collapsed') != -1);
          }
        }
      });

      ctrl.toggleHamburger = function (isCollapsed) {
        isCollapsed ? $element.find('div.navTrigger').addClass('active') : $element.find('div.navTrigger').removeClass('active');
      };

      ctrl.navCollapse = function () {
        document.querySelector('.gumga-layout nav.gl-nav').classList.toggle('collapsed');
        angular.element("nav.gl-nav").attrchange({
          trackValues: true,
          callback: function callback(evnt) {
            if (evnt.attributeName == 'class') {
              ctrl.toggleHamburger(evnt.newValue.indexOf('collapsed') != -1);
            }
          }
        });
      };

      ctrl.toggleHamburger(angular.element('nav.gl-nav').hasClass('collapsed'));
    };
  }]
};

exports.default = Component;

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Component = {
  transclude: true,
  bindings: {},
  template: '\n    <div ng-transclude></div>\n  ',
  controller: ['$scope', '$element', '$attrs', '$timeout', '$parse', function ($scope, $element, $attrs, $timeout, $parse) {
    var ctrl = this,
        input = void 0,
        model = void 0;

    ctrl.$onInit = function () {
      var changeActive = function changeActive(target) {
        if (target.value) {
          target.classList.add('active');
        } else {
          target.classList.remove('active');
        }
      };
      ctrl.$doCheck = function () {
        if (input && input[0]) changeActive(input[0]);
      };
      ctrl.$postLink = function () {
        var gmdInput = $element.find('input');
        if (gmdInput[0]) {
          input = angular.element(gmdInput);
        } else {
          input = angular.element($element.find('textarea'));
        }
        model = input.attr('ng-model') || input.attr('data-ng-model');
      };
    };
  }]
};

exports.default = Component;

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var Component = {
    transclude: true,
    bindings: {
        menu: '<',
        keys: '<',
        logo: '@?',
        largeLogo: '@?',
        smallLogo: '@?',
        hideSearch: '=?',
        isOpened: '=?',
        iconFirstLevel: '@?',
        showButtonFirstLevel: '=?',
        textFirstLevel: '@?',
        itemDisabled: '&?'
    },
    template: '\n\n    <nav class="main-menu">\n        <div class="menu-header">\n            <img ng-if="$ctrl.logo" ng-src="{{$ctrl.logo}}"/>\n            <img class="large" ng-if="$ctrl.largeLogo" ng-src="{{$ctrl.largeLogo}}"/>\n            <img class="small" ng-if="$ctrl.smallLogo" ng-src="{{$ctrl.smallLogo}}"/>\n\n            <svg version="1.1" ng-click="$ctrl.toggleMenu()" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n                width="613.408px" height="613.408px" viewBox="0 0 613.408 613.408" xml:space="preserve">\n                <g>\n                <path d="M605.254,168.94L443.792,7.457c-6.924-6.882-17.102-9.239-26.319-6.069c-9.177,3.128-15.809,11.241-17.019,20.855\n                    l-9.093,70.512L267.585,216.428h-142.65c-10.344,0-19.625,6.215-23.629,15.746c-3.92,9.573-1.71,20.522,5.589,27.779\n                    l105.424,105.403L0.699,613.408l246.635-212.869l105.423,105.402c4.881,4.881,11.45,7.467,17.999,7.467\n                    c3.295,0,6.632-0.709,9.78-2.002c9.573-3.922,15.726-13.244,15.726-23.504V345.168l123.839-123.714l70.429-9.176\n                    c9.614-1.251,17.727-7.862,20.813-17.039C614.472,186.021,612.136,175.801,605.254,168.94z M504.856,171.985\n                    c-5.568,0.751-10.762,3.232-14.745,7.237L352.758,316.596c-4.796,4.775-7.466,11.242-7.466,18.041v91.742L186.437,267.481h91.68\n                    c6.757,0,13.243-2.669,18.04-7.466L433.51,122.766c3.983-3.983,6.569-9.176,7.258-14.786l3.629-27.696l88.155,88.114\n                    L504.856,171.985z"/>\n                </g>\n            </svg>\n\n        </div>\n        <div class="scrollbar style-1">\n            <ul data-ng-class="\'level\'.concat($ctrl.back.length)">\n\n                <li class="goback gmd gmd-ripple" data-ng-show="$ctrl.previous.length > 0" data-ng-click="$ctrl.prev()">\n                    <a>\n                        <i class="material-icons">\n                            keyboard_arrow_left\n                        </i>\n                        <span data-ng-bind="$ctrl.back[$ctrl.back.length - 1].label" class="nav-text"></span>\n                    </a>\n                </li>\n\n                <li class="gmd-ripple"\n                    data-ng-repeat="item in $ctrl.menu | filter:$ctrl.search"\n                    data-ng-show="$ctrl.allow(item)"\n                    data-ng-click="$ctrl.next(item, $event)"\n                    data-ng-class="[!$ctrl.disableAnimations ? $ctrl.slide : \'\', {\'disabled\': $ctrl.itemDisabled({item: item})}, {header: item.type == \'header\', divider: item.type == \'separator\'}]">\n                    \n                    <a ng-if="item.type != \'separator\' && item.state" ui-sref="{{item.state}}">\n                        <i data-ng-if="item.icon" class="material-icons" data-ng-bind="item.icon"></i>\n                        <span class="nav-text" ng-bind="item.label"></span>\n                        <i data-ng-if="item.children && item.children.length > 0" class="material-icons pull-right">keyboard_arrow_right</i>\n                    </a>\n\n                    <a ng-if="item.type != \'separator\' && !item.state">\n                        <i data-ng-if="item.icon" class="material-icons" data-ng-bind="item.icon"></i>\n                        <span class="nav-text" ng-bind="item.label"></span>\n                        <i data-ng-if="item.children && item.children.length > 0" class="material-icons pull-right">keyboard_arrow_right</i>\n                    </a>\n\n                </li>\n            </ul>\n    </nav>\n    \n    ',
    controller: ['$timeout', '$attrs', '$element', function ($timeout, $attrs, $element) {
        var ctrl = this;
        ctrl.keys = ctrl.keys || [];
        ctrl.iconFirstLevel = ctrl.iconFirstLevel || 'glyphicon glyphicon-home';
        ctrl.previous = [];
        ctrl.back = [];
        var mainContent = void 0,
            headerContent = void 0;

        ctrl.$onInit = function () {
            mainContent = angular.element('.gumga-layout .gl-main');
            headerContent = angular.element('.gumga-layout .gl-header');
            if (eval(sessionStorage.getItem('gmd-menu-shrink'))) {
                $element.addClass('fixed');
            }
        };

        ctrl.toggleMenu = function () {
            $element.toggleClass('fixed');
            sessionStorage.setItem('gmd-menu-shrink', $element.hasClass('fixed'));
        };

        ctrl.prev = function () {
            ctrl.menu = ctrl.previous.pop();
            ctrl.back.pop();
        };

        ctrl.next = function (item) {
            if (item.children && item.children.length > 0) {
                ctrl.previous.push(ctrl.menu);
                ctrl.menu = item.children;
                ctrl.back.push(item);
            }
        };

        ctrl.goBackToFirstLevel = function () {
            ctrl.menu = ctrl.previous[0];
            ctrl.previous = [];
            ctrl.back = [];
        };

        ctrl.allow = function (item) {
            if (ctrl.keys && ctrl.keys.length > 0) {
                if (!item.key) return true;
                return ctrl.keys.indexOf(item.key) > -1;
            }
        };
    }]
};

exports.default = Component;

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
require('../attrchange/attrchange');

var Component = {
  transclude: true,
  bindings: {
    menu: '<',
    keys: '<',
    hideSearch: '=?',
    isOpened: '=?',
    iconFirstLevel: '@?',
    showButtonFirstLevel: '=?',
    textFirstLevel: '@?',
    disableAnimations: '=?',
    shrinkMode: '=?'
  },
  template: '\n\n    <div style="padding: 15px 15px 0px 15px;" ng-if="!$ctrl.hideSearch">\n      <input type="text" data-ng-model="$ctrl.search" class="form-control gmd" placeholder="Busca...">\n      <div class="bar"></div>\n    </div>\n\n    <button class="btn btn-default btn-block gmd" data-ng-if="$ctrl.showButtonFirstLevel" data-ng-click="$ctrl.goBackToFirstLevel()" data-ng-disabled="!$ctrl.previous.length" type="button">\n      <i data-ng-class="[$ctrl.iconFirstLevel]"></i>\n      <span data-ng-bind="$ctrl.textFirstLevel"></span>\n    </button>\n\n    <ul menu data-ng-class="\'level\'.concat($ctrl.back.length)">\n      <li class="goback gmd gmd-ripple" data-ng-show="$ctrl.previous.length > 0" data-ng-click="$ctrl.prev()">\n        <a>\n          <i class="material-icons">\n            keyboard_arrow_left\n          </i>\n          <span data-ng-bind="$ctrl.back[$ctrl.back.length - 1].label"></span>\n        </a>\n      </li>\n\n      <li class="gmd gmd-ripple" \n          data-ng-repeat="item in $ctrl.menu | filter:$ctrl.search"\n          data-ng-show="$ctrl.allow(item)"\n          ng-click="$ctrl.next(item, $event)"\n          data-ng-class="[!$ctrl.disableAnimations ? $ctrl.slide : \'\', {header: item.type == \'header\', divider: item.type == \'separator\'}]">\n\n          <a ng-if="item.type != \'separator\' && item.state" ui-sref="{{item.state}}">\n            <i data-ng-if="item.icon" class="material-icons" data-ng-bind="item.icon"></i>\n            <span ng-bind="item.label"></span>\n            <i data-ng-if="item.children" class="material-icons pull-right">\n              keyboard_arrow_right\n            </i>\n          </a>\n\n          <a ng-if="item.type != \'separator\' && !item.state">\n            <i data-ng-if="item.icon" class="material-icons" data-ng-bind="item.icon"></i>\n            <span ng-bind="item.label"></span>\n            <i data-ng-if="item.children" class="material-icons pull-right">\n              keyboard_arrow_right\n            </i>\n          </a>\n\n      </li>\n    </ul>\n\n    <ng-transclude></ng-transclude>\n\n    <ul class="gl-menu-chevron" ng-if="$ctrl.shrinkMode && !$ctrl.fixed" ng-click="$ctrl.openMenuShrink()">\n      <li>\n        <i class="material-icons">chevron_left</i>\n      </li>\n    </ul>\n\n    <ul class="gl-menu-chevron unfixed" ng-if="$ctrl.shrinkMode && $ctrl.fixed">\n      <li ng-click="$ctrl.unfixedMenuShrink()">\n        <i class="material-icons">chevron_left</i>\n      </li>\n    </ul>\n\n    <ul class="gl-menu-chevron possiblyFixed" ng-if="$ctrl.possiblyFixed">\n      <li ng-click="$ctrl.fixedMenuShrink()" align="center" style="display: flex; justify-content: flex-end;">\n      <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n            width="613.408px" style="display: inline-block; position: relative; height: 1em; width: 3em; font-size: 1.33em; padding: 0; margin: 0;;"  height="613.408px" viewBox="0 0 613.408 613.408" style="enable-background:new 0 0 613.408 613.408;"\n            xml:space="preserve">\n        <g>\n          <path d="M605.254,168.94L443.792,7.457c-6.924-6.882-17.102-9.239-26.319-6.069c-9.177,3.128-15.809,11.241-17.019,20.855\n            l-9.093,70.512L267.585,216.428h-142.65c-10.344,0-19.625,6.215-23.629,15.746c-3.92,9.573-1.71,20.522,5.589,27.779\n            l105.424,105.403L0.699,613.408l246.635-212.869l105.423,105.402c4.881,4.881,11.45,7.467,17.999,7.467\n            c3.295,0,6.632-0.709,9.78-2.002c9.573-3.922,15.726-13.244,15.726-23.504V345.168l123.839-123.714l70.429-9.176\n            c9.614-1.251,17.727-7.862,20.813-17.039C614.472,186.021,612.136,175.801,605.254,168.94z M504.856,171.985\n            c-5.568,0.751-10.762,3.232-14.745,7.237L352.758,316.596c-4.796,4.775-7.466,11.242-7.466,18.041v91.742L186.437,267.481h91.68\n            c6.757,0,13.243-2.669,18.04-7.466L433.51,122.766c3.983-3.983,6.569-9.176,7.258-14.786l3.629-27.696l88.155,88.114\n            L504.856,171.985z"/>\n        </g>\n        </svg>\n      </li>\n    </ul>\n\n  ',
  controller: ['$timeout', '$attrs', '$element', function ($timeout, $attrs, $element) {
    var ctrl = this;
    ctrl.keys = ctrl.keys || [];
    ctrl.iconFirstLevel = ctrl.iconFirstLevel || 'glyphicon glyphicon-home';
    ctrl.previous = [];
    ctrl.back = [];

    ctrl.$onInit = function () {
      ctrl.disableAnimations = ctrl.disableAnimations || false;

      var mainContent = angular.element('.gumga-layout .gl-main');
      var headerContent = angular.element('.gumga-layout .gl-header');

      var stringToBoolean = function stringToBoolean(string) {
        switch (string.toLowerCase().trim()) {
          case "true":case "yes":case "1":
            return true;
          case "false":case "no":case "0":case null:
            return false;
          default:
            return Boolean(string);
        }
      };

      ctrl.fixed = stringToBoolean($attrs.fixed || 'false');
      ctrl.fixedMain = stringToBoolean($attrs.fixedMain || 'false');

      if (ctrl.fixedMain) {
        ctrl.fixed = true;
      }

      var onBackdropClick = function onBackdropClick(evt) {
        if (ctrl.shrinkMode) {
          angular.element('.gumga-layout nav.gl-nav').addClass('closed');
          angular.element('div.gmd-menu-backdrop').removeClass('active');
        } else {
          angular.element('.gumga-layout nav.gl-nav').removeClass('collapsed');
        }
      };

      var init = function init() {
        if (!ctrl.fixed || ctrl.shrinkMode) {
          var elm = document.createElement('div');
          elm.classList.add('gmd-menu-backdrop');
          if (angular.element('div.gmd-menu-backdrop').length == 0) {
            angular.element('body')[0].appendChild(elm);
          }
          angular.element('div.gmd-menu-backdrop').on('click', onBackdropClick);
        }
      };

      init();

      var setMenuTop = function setMenuTop() {
        $timeout(function () {
          var size = angular.element('.gumga-layout .gl-header').height();
          if (size == 0) setMenuTop();
          if (ctrl.fixed) size = 0;
          angular.element('.gumga-layout nav.gl-nav.collapsed').css({
            top: size
          });
        });
      };

      ctrl.toggleContent = function (isCollapsed) {
        $timeout(function () {
          if (ctrl.fixed) {
            var _mainContent = angular.element('.gumga-layout .gl-main');
            var _headerContent = angular.element('.gumga-layout .gl-header');
            if (isCollapsed) {
              _headerContent.ready(function () {
                setMenuTop();
              });
            }
            isCollapsed ? _mainContent.addClass('collapsed') : _mainContent.removeClass('collapsed');
            if (!ctrl.fixedMain && ctrl.fixed) {
              isCollapsed ? _headerContent.addClass('collapsed') : _headerContent.removeClass('collapsed');
            }
          }
        });
      };

      var verifyBackdrop = function verifyBackdrop(isCollapsed) {
        var headerContent = angular.element('.gumga-layout .gl-header');
        var backContent = angular.element('div.gmd-menu-backdrop');
        if (isCollapsed && !ctrl.fixed) {
          backContent.addClass('active');
          var size = headerContent.height();
          if (size > 0 && !ctrl.shrinkMode) {
            backContent.css({ top: size });
          } else {
            backContent.css({ top: 0 });
          }
        } else {
          backContent.removeClass('active');
        }
        $timeout(function () {
          return ctrl.isOpened = isCollapsed;
        });
      };

      if (ctrl.shrinkMode) {
        var _mainContent2 = angular.element('.gumga-layout .gl-main');
        var _headerContent2 = angular.element('.gumga-layout .gl-header');
        var navContent = angular.element('.gumga-layout nav.gl-nav');
        _mainContent2.css({ 'margin-left': '64px' });
        _headerContent2.css({ 'margin-left': '64px' });
        navContent.css({ 'z-index': '1006' });
        angular.element("nav.gl-nav").addClass('closed collapsed');
        verifyBackdrop(!angular.element('nav.gl-nav').hasClass('closed'));
      }

      if (angular.element.fn.attrchange) {
        angular.element("nav.gl-nav").attrchange({
          trackValues: true,
          callback: function callback(evnt) {
            if (evnt.attributeName == 'class') {
              if (ctrl.shrinkMode) {
                ctrl.possiblyFixed = evnt.newValue.indexOf('closed') == -1;
                verifyBackdrop(ctrl.possiblyFixed);
              } else {
                ctrl.toggleContent(evnt.newValue.indexOf('collapsed') != -1);
                verifyBackdrop(evnt.newValue.indexOf('collapsed') != -1);
              }
            }
          }
        });
        if (!ctrl.shrinkMode) {
          ctrl.toggleContent(angular.element('nav.gl-nav').hasClass('collapsed'));
          verifyBackdrop(angular.element('nav.gl-nav').hasClass('collapsed'));
        }
      }

      ctrl.$onInit = function () {
        if (!ctrl.hasOwnProperty('showButtonFirstLevel')) {
          ctrl.showButtonFirstLevel = true;
        }
      };

      ctrl.prev = function () {
        $timeout(function () {
          // ctrl.slide = 'slide-in-left';
          ctrl.menu = ctrl.previous.pop();
          ctrl.back.pop();
        }, 250);
      };

      ctrl.next = function (item) {
        var nav = angular.element('nav.gl-nav')[0];
        if (ctrl.shrinkMode && nav.classList.contains('closed') && item.children && angular.element('.gumga-layout nav.gl-nav').is('[open-on-hover]')) {
          ctrl.openMenuShrink();
          ctrl.next(item);
          return;
        }
        $timeout(function () {
          if (item.children) {
            // ctrl.slide = 'slide-in-right';
            ctrl.previous.push(ctrl.menu);
            ctrl.menu = item.children;
            ctrl.back.push(item);
          }
        }, 250);
      };

      ctrl.goBackToFirstLevel = function () {
        // ctrl.slide = 'slide-in-left'
        ctrl.menu = ctrl.previous[0];
        ctrl.previous = [];
        ctrl.back = [];
      };

      ctrl.allow = function (item) {
        if (ctrl.keys && ctrl.keys.length > 0) {
          if (!item.key) return true;
          return ctrl.keys.indexOf(item.key) > -1;
        }
      };

      // ctrl.slide = 'slide-in-left';

      ctrl.openMenuShrink = function () {
        ctrl.possiblyFixed = true;
        angular.element('.gumga-layout nav.gl-nav').removeClass('closed');
      };

      ctrl.fixedMenuShrink = function () {
        $element.attr('fixed', true);
        ctrl.fixed = true;
        ctrl.possiblyFixed = false;
        init();
        mainContent.css({ 'margin-left': '' });
        headerContent.css({ 'margin-left': '' });
        ctrl.toggleContent(true);
        verifyBackdrop(true);
      };

      ctrl.unfixedMenuShrink = function () {
        $element.attr('fixed', false);
        ctrl.fixed = false;
        ctrl.possiblyFixed = true;
        init();
        mainContent.css({ 'margin-left': '64px' });
        headerContent.css({ 'margin-left': '64px' });
        verifyBackdrop(true);
        angular.element('.gumga-layout nav.gl-nav').addClass('closed');
      };
    };
  }]
};

exports.default = Component;

},{"../attrchange/attrchange":2}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Component = {
  bindings: {
    icon: '@',
    notifications: '=',
    onView: '&?'
  },
  template: '\n    <ul class="nav navbar-nav navbar-right notifications">\n      <li class="dropdown">\n        <a href="#" badge="{{$ctrl.notifications.length}}" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">\n          <i class="material-icons" data-ng-bind="$ctrl.icon"></i>\n        </a>\n        <ul class="dropdown-menu">\n          <li data-ng-repeat="item in $ctrl.notifications" data-ng-click="$ctrl.view($event, item)">\n            <div class="media">\n              <div class="media-left">\n                <img class="media-object" data-ng-src="{{item.image}}">\n              </div>\n              <div class="media-body" data-ng-bind="item.content"></div>\n            </div>\n          </li>\n        </ul>\n      </li>\n    </ul>\n  ',
  controller: function controller() {
    var ctrl = this;

    ctrl.$onInit = function () {
      ctrl.view = function (event, item) {
        return ctrl.onView({ event: event, item: item });
      };
    };
  }
};

exports.default = Component;

},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Component = function Component() {
  return {
    restrict: 'C',
    link: function link($scope, element, attrs) {
      if (!element[0].classList.contains('fixed')) {
        element[0].style.position = 'relative';
      }
      element[0].style.overflow = 'hidden';
      element[0].style.userSelect = 'none';

      element[0].style.msUserSelect = 'none';
      element[0].style.mozUserSelect = 'none';
      element[0].style.webkitUserSelect = 'none';

      function createRipple(evt) {
        var ripple = angular.element('<span class="gmd-ripple-effect animate">'),
            rect = element[0].getBoundingClientRect(),
            radius = Math.max(rect.height, rect.width),
            left = evt.pageX - rect.left - radius / 2 - document.body.scrollLeft,
            top = evt.pageY - rect.top - radius / 2 - document.body.scrollTop;

        ripple[0].style.width = ripple[0].style.height = radius + 'px';
        ripple[0].style.left = left + 'px';
        ripple[0].style.top = top + 'px';
        ripple.on('animationend webkitAnimationEnd', function () {
          angular.element(this).remove();
        });

        element.append(ripple);
      }

      element.bind('mousedown', createRipple);
    }
  };
};

exports.default = Component;

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Component = {
  require: ['ngModel', 'ngRequired'],
  transclude: true,
  bindings: {
    ngModel: '=',
    ngDisabled: '=?',
    unselect: '@?',
    options: '<',
    option: '@',
    value: '@',
    placeholder: '@?',
    onChange: "&?",
    translateLabel: '=?'
  },
  template: '\n  <div class="dropdown gmd">\n     <label class="control-label floating-dropdown" ng-show="$ctrl.selected">\n      {{$ctrl.placeholder}} <span ng-if="$ctrl.validateGumgaError" ng-class="{\'gmd-select-required\': $ctrl.ngModelCtrl.$error.required}">*<span>\n     </label>\n     <button class="btn btn-default gmd dropdown-toggle gmd-select-button"\n             type="button"\n             style="border-radius: 0;"\n             id="gmdSelect"\n             data-toggle="dropdown"\n             ng-disabled="$ctrl.ngDisabled"\n             aria-haspopup="true"\n             aria-expanded="true">\n       <span class="item-select" ng-if="!$ctrl.translateLabel" data-ng-show="$ctrl.selected" data-ng-bind="$ctrl.selected"></span>\n       <span class="item-select" ng-if="$ctrl.translateLabel" data-ng-show="$ctrl.selected">\n          {{ $ctrl.selected | gumgaTranslate }}\n       </span>\n       <span data-ng-hide="$ctrl.selected" class="item-select placeholder">\n        {{$ctrl.placeholder}}\n       </span>\n       <span ng-if="$ctrl.ngModelCtrl.$error.required && $ctrl.validateGumgaError" class="word-required">*</span>\n       <span class="caret"></span>\n     </button>\n     <ul class="dropdown-menu" aria-labelledby="gmdSelect" ng-show="$ctrl.option" style="display: none;">\n       <li data-ng-click="$ctrl.clear()" ng-if="$ctrl.unselect">\n         <a data-ng-class="{active: false}">{{$ctrl.unselect}}</a>\n       </li>\n       <li data-ng-repeat="option in $ctrl.options track by $index">\n         <a class="select-option" data-ng-click="$ctrl.select(option)" data-ng-bind="option[$ctrl.option] || option" data-ng-class="{active: $ctrl.isActive(option)}"></a>\n       </li>\n     </ul>\n     <ul class="dropdown-menu gmd" aria-labelledby="gmdSelect" ng-show="!$ctrl.option" style="max-height: 250px;overflow: auto;display: none;" ng-transclude></ul>\n   </div>\n  ',
  controller: ['$scope', '$attrs', '$timeout', '$element', '$transclude', '$compile', function ($scope, $attrs, $timeout, $element, $transclude, $compile) {
    var ctrl = this,
        ngModelCtrl = $element.controller('ngModel');

    var options = ctrl.options || [];

    ctrl.ngModelCtrl = ngModelCtrl;
    ctrl.validateGumgaError = $attrs.hasOwnProperty('gumgaRequired');

    function findParentByName(elm, parentName) {
      if (elm.className == parentName) {
        return elm;
      }
      if (elm.parentNode) {
        return findParentByName(elm.parentNode, parentName);
      }
      return elm;
    }

    function preventDefault(e) {
      e = e || window.event;
      var target = findParentByName(e.target, 'select-option');
      if (target.nodeName == 'A' && target.className == 'select-option' || e.target.nodeName == 'A' && e.target.className == 'select-option') {
        var direction = findScrollDirectionOtherBrowsers(e);
        var scrollTop = angular.element(target.parentNode.parentNode).scrollTop();
        if (scrollTop + angular.element(target.parentNode.parentNode).innerHeight() >= target.parentNode.parentNode.scrollHeight && direction != 'UP') {
          if (e.preventDefault) e.preventDefault();
          e.returnValue = false;
        } else if (scrollTop <= 0 && direction != 'DOWN') {
          if (e.preventDefault) e.preventDefault();
          e.returnValue = false;
        } else {
          e.returnValue = true;
          return;
        }
      } else {
        if (e.preventDefault) e.preventDefault();
        e.returnValue = false;
      }
    }

    function findScrollDirectionOtherBrowsers(event) {
      var delta;
      if (event.wheelDelta) {
        delta = event.wheelDelta;
      } else {
        delta = -1 * event.deltaY;
      }
      if (delta < 0) {
        return "DOWN";
      } else if (delta > 0) {
        return "UP";
      }
    }

    function preventDefaultForScrollKeys(e) {
      if (keys && keys[e.keyCode]) {
        preventDefault(e);
        return false;
      }
      console.clear();
    }

    function disableScroll() {
      if (window.addEventListener) {
        window.addEventListener('scroll', preventDefault, false);
        window.addEventListener('DOMMouseScroll', preventDefault, false);
      }
      window.onwheel = preventDefault; // modern standard
      window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
      window.ontouchmove = preventDefault; // mobile
      document.onkeydown = preventDefaultForScrollKeys;
    }

    function enableScroll() {
      if (window.removeEventListener) window.removeEventListener('DOMMouseScroll', preventDefault, false);
      window.onmousewheel = document.onmousewheel = null;
      window.onwheel = null;
      window.ontouchmove = null;
      document.onkeydown = null;
    }

    var getOffset = function getOffset(el) {
      var rect = el.getBoundingClientRect(),
          scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
          scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      var _x = 0,
          _y = 0;
      while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
        _x += el.offsetLeft - el.scrollLeft;
        if (el.nodeName == 'BODY') {
          _y += el.offsetTop - Math.max(angular.element("html").scrollTop(), angular.element("body").scrollTop());
        } else {
          _y += el.offsetTop - el.scrollTop;
        }
        el = el.offsetParent;
      }
      return { top: _y, left: rect.left + scrollLeft };
    };

    var getElementMaxHeight = function getElementMaxHeight(elm) {
      var scrollPosition = Math.max(angular.element("html").scrollTop(), angular.element("body").scrollTop());
      var elementOffset = elm.offset().top;
      var elementDistance = elementOffset - scrollPosition;
      var windowHeight = angular.element(window).height();
      return windowHeight - elementDistance;
    };

    var handlingElementStyle = function handlingElementStyle($element, uls) {
      var SIZE_BOTTOM_DISTANCE = 5;
      var position = getOffset($element[0]);

      angular.forEach(uls, function (ul) {
        if (angular.element(ul).height() == 0) return;
        var maxHeight = getElementMaxHeight(angular.element($element[0]));
        if (angular.element(ul).height() > maxHeight) {
          angular.element(ul).css({
            height: maxHeight - SIZE_BOTTOM_DISTANCE + 'px'
          });
        } else if (angular.element(ul).height() != maxHeight - SIZE_BOTTOM_DISTANCE) {
          angular.element(ul).css({
            height: 'auto'
          });
        }

        angular.element(ul).css({
          display: 'block',
          position: 'fixed',
          left: position.left - 1 + 'px',
          top: position.top - 2 + 'px',
          width: $element.find('div.dropdown')[0].clientWidth + 1
        });
      });
    };

    var handlingElementInBody = function handlingElementInBody(elm, uls) {
      var body = angular.element(document).find('body').eq(0);
      var div = angular.element(document.createElement('div'));
      div.addClass("dropdown gmd");
      div.append(uls);
      body.append(div);
      angular.element(elm.find('button.dropdown-toggle')).attrchange({
        trackValues: true,
        callback: function callback(evnt) {
          if (evnt.attributeName == 'aria-expanded' && evnt.newValue == 'false') {
            enableScroll();
            uls = angular.element(div).find('ul');
            angular.forEach(uls, function (ul) {
              angular.element(ul).css({
                display: 'none'
              });
            });
            elm.find('div.dropdown').append(uls);
            div.remove();
          }
        }
      });
    };

    $element.bind('click', function (event) {
      var uls = $element.find('ul');
      if (uls.find('gmd-option').length == 0) {
        event.stopPropagation();
        return;
      }
      handlingElementStyle($element, uls);
      disableScroll();
      handlingElementInBody($element, uls);
    });

    ctrl.select = function (option) {
      angular.forEach(options, function (option) {
        option.selected = false;
      });
      option.selected = true;
      ctrl.ngModel = option.ngValue;
      ctrl.selected = option.ngLabel;
    };

    ctrl.addOption = function (option) {
      options.push(option);
    };

    var setSelected = function setSelected(value) {
      angular.forEach(options, function (option) {
        if (option.ngValue.$$hashKey) {
          delete option.ngValue.$$hashKey;
        }
        if (angular.equals(value, option.ngValue)) {
          ctrl.select(option);
        }
      });
    };

    $timeout(function () {
      return setSelected(ctrl.ngModel);
    });

    ctrl.$doCheck = function () {
      if (options && options.length > 0) setSelected(ctrl.ngModel);
    };
  }]
};

exports.default = Component;

},{}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Component = {
  transclude: true,
  require: {
    gmdSelectCtrl: '^gmdSelect'
  },
  bindings: {},
  template: '\n      <a class="select-option" data-ng-click="$ctrl.select()" ng-transclude></a>\n    ',
  controller: ['$scope', '$attrs', '$timeout', '$element', '$transclude', function ($scope, $attrs, $timeout, $element, $transclude) {
    var _this = this;

    var ctrl = this;

    ctrl.select = function () {
      ctrl.gmdSelectCtrl.select(_this);
    };
  }]
};

exports.default = Component;

},{}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Component = {
  // require: ['ngModel','ngRequired'],
  transclude: true,
  require: {
    gmdSelectCtrl: '^gmdSelect'
  },
  bindings: {
    ngValue: '=',
    ngLabel: '='
  },
  template: '\n    <a class="select-option" data-ng-click="$ctrl.select($ctrl.ngValue, $ctrl.ngLabel)" ng-class="{active: $ctrl.selected}" ng-transclude></a>\n  ',
  controller: ['$scope', '$attrs', '$timeout', '$element', '$transclude', function ($scope, $attrs, $timeout, $element, $transclude) {
    var _this = this;

    var ctrl = this;

    ctrl.$onInit = function () {
      ctrl.gmdSelectCtrl.addOption(_this);
    };

    ctrl.select = function () {
      ctrl.gmdSelectCtrl.select(ctrl);
      if (ctrl.gmdSelectCtrl.onChange) {
        ctrl.gmdSelectCtrl.onChange({ value: _this.ngValue });
      }
    };
  }]
};

exports.default = Component;

},{}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Component = {
  transclude: true,
  require: {
    gmdSelectCtrl: '^gmdSelect'
  },
  bindings: {
    ngModel: '=',
    placeholder: '@?'
  },
  template: '\n    <div class="input-group" style="border: none;background: #f9f9f9;">\n      <span class="input-group-addon" id="basic-addon1" style="border: none;">\n        <i class="material-icons">search</i>\n      </span>\n      <input type="text" style="border: none;" class="form-control gmd" ng-model="$ctrl.ngModel" placeholder="{{$ctrl.placeholder}}">\n    </div>\n  ',
  controller: ['$scope', '$attrs', '$timeout', '$element', '$transclude', function ($scope, $attrs, $timeout, $element, $transclude) {
    var ctrl = this;

    $element.bind('click', function (evt) {
      evt.stopPropagation();
    });
  }]
};

exports.default = Component;

},{}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Component = {
  bindings: {
    diameter: "@?",
    box: "=?"
  },
  template: "\n  <div class=\"spinner-material\" ng-if=\"$ctrl.diameter\">\n   <svg xmlns=\"http://www.w3.org/2000/svg\"\n        xmlns:xlink=\"http://www.w3.org/1999/xlink\"\n        version=\"1\"\n        ng-class=\"{'spinner-box' : $ctrl.box}\"\n        style=\"width: {{$ctrl.diameter}};height: {{$ctrl.diameter}};\"\n        viewBox=\"0 0 28 28\">\n    <g class=\"qp-circular-loader\">\n     <path class=\"qp-circular-loader-path\" fill=\"none\" d=\"M 14,1.5 A 12.5,12.5 0 1 1 1.5,14\" stroke-linecap=\"round\" />\n    </g>\n   </svg>\n  </div>",
  controller: ['$scope', '$element', '$attrs', '$timeout', '$parse', function ($scope, $element, $attrs, $timeout, $parse) {
    var ctrl = this;

    ctrl.$onInit = function () {
      ctrl.diameter = ctrl.diameter || '50px';
    };
  }]
};

exports.default = Component;

},{}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var Provider = function Provider() {

    var setElementHref = function setElementHref(href) {
        var elm = angular.element('link[href*="gumga-layout"]');
        if (elm && elm[0]) {
            elm.attr('href', href);
        }
        elm = angular.element(document.createElement('link'));
        elm.attr('href', href);
        elm.attr('rel', 'stylesheet');
        document.head.appendChild(elm[0]);
    };

    var setThemeDefault = function setThemeDefault(themeName, save) {
        var src = void 0,
            themeDefault = sessionStorage.getItem('gmd-theme-default');
        if (themeName && !themeDefault) {
            if (save) sessionStorage.setItem('gmd-theme-default', themeName);
            src = 'gumga-layout/' + themeName + '/gumga-layout.min.css';
        } else {
            if (themeDefault) {
                src = 'gumga-layout/' + themeDefault + '/gumga-layout.min.css';
            } else {
                src = 'gumga-layout/gumga-layout.min.css';
            }
        }
        setElementHref(src);
    };

    var setTheme = function setTheme(themeName, updateSession) {
        var src,
            themeDefault = sessionStorage.getItem('gmd-theme');

        if (themeName && updateSession || themeName && !themeDefault) {
            sessionStorage.setItem('gmd-theme', themeName);
            src = 'gumga-layout/' + themeName + '/gumga-layout.min.css';
            setElementHref(src);
            return;
        }

        if (themeName && !updateSession) {
            src = 'gumga-layout/' + themeDefault + '/gumga-layout.min.css';
            setElementHref(src);
            return;
        }

        src = 'gumga-layout/gumga-layout.min.css';
        setElementHref(src);
    };

    return {
        setThemeDefault: setThemeDefault,
        setTheme: setTheme,
        $get: function $get() {
            return {
                setThemeDefault: setThemeDefault,
                setTheme: setTheme
            };
        }
    };
};

Provider.$inject = [];

exports.default = Provider;

},{}],16:[function(require,module,exports){
'use strict';

var _component = require('./menu/component.js');

var _component2 = _interopRequireDefault(_component);

var _component3 = require('./menu-shrink/component.js');

var _component4 = _interopRequireDefault(_component3);

var _component5 = require('./notification/component.js');

var _component6 = _interopRequireDefault(_component5);

var _component7 = require('./select/component.js');

var _component8 = _interopRequireDefault(_component7);

var _component9 = require('./select/search/component.js');

var _component10 = _interopRequireDefault(_component9);

var _component11 = require('./select/option/component.js');

var _component12 = _interopRequireDefault(_component11);

var _component13 = require('./select/empty/component.js');

var _component14 = _interopRequireDefault(_component13);

var _component15 = require('./input/component.js');

var _component16 = _interopRequireDefault(_component15);

var _component17 = require('./ripple/component.js');

var _component18 = _interopRequireDefault(_component17);

var _component19 = require('./fab/component.js');

var _component20 = _interopRequireDefault(_component19);

var _component21 = require('./spinner/component.js');

var _component22 = _interopRequireDefault(_component21);

var _component23 = require('./hamburger/component.js');

var _component24 = _interopRequireDefault(_component23);

var _provider = require('./alert/provider.js');

var _provider2 = _interopRequireDefault(_provider);

var _provider3 = require('./theme/provider.js');

var _provider4 = _interopRequireDefault(_provider3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

angular.module('gumga.layout', []).provider('$gmdAlert', _provider2.default).provider('$gmdTheme', _provider4.default).directive('gmdRipple', _component18.default).component('glMenu', _component2.default).component('menuShrink', _component4.default).component('glNotification', _component6.default).component('gmdSelect', _component8.default).component('gmdSelectSearch', _component10.default).component('gmdOptionEmpty', _component14.default).component('gmdOption', _component12.default).component('gmdInput', _component16.default).component('gmdFab', _component20.default).component('gmdSpinner', _component22.default).component('gmdHamburger', _component24.default);

},{"./alert/provider.js":1,"./fab/component.js":3,"./hamburger/component.js":4,"./input/component.js":5,"./menu-shrink/component.js":6,"./menu/component.js":7,"./notification/component.js":8,"./ripple/component.js":9,"./select/component.js":10,"./select/empty/component.js":11,"./select/option/component.js":12,"./select/search/component.js":13,"./spinner/component.js":14,"./theme/provider.js":15}]},{},[16])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL21lZGlhL21hdGV1cy9oZC9ndW1nYS9sYXlvdXQvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi4uLy4uLy4uL21lZGlhL21hdGV1cy9oZC9ndW1nYS9sYXlvdXQvc3JjL2NvbXBvbmVudHMvYWxlcnQvcHJvdmlkZXIuanMiLCIuLi8uLi8uLi9tZWRpYS9tYXRldXMvaGQvZ3VtZ2EvbGF5b3V0L3NyYy9jb21wb25lbnRzL2F0dHJjaGFuZ2UvYXR0cmNoYW5nZS5qcyIsIi4uLy4uLy4uL21lZGlhL21hdGV1cy9oZC9ndW1nYS9sYXlvdXQvc3JjL2NvbXBvbmVudHMvZmFiL2NvbXBvbmVudC5qcyIsIi4uLy4uLy4uL21lZGlhL21hdGV1cy9oZC9ndW1nYS9sYXlvdXQvc3JjL2NvbXBvbmVudHMvaGFtYnVyZ2VyL2NvbXBvbmVudC5qcyIsIi4uLy4uLy4uL21lZGlhL21hdGV1cy9oZC9ndW1nYS9sYXlvdXQvc3JjL2NvbXBvbmVudHMvaW5wdXQvY29tcG9uZW50LmpzIiwiLi4vLi4vLi4vbWVkaWEvbWF0ZXVzL2hkL2d1bWdhL2xheW91dC9zcmMvY29tcG9uZW50cy9tZW51LXNocmluay9jb21wb25lbnQuanMiLCIuLi8uLi8uLi9tZWRpYS9tYXRldXMvaGQvZ3VtZ2EvbGF5b3V0L3NyYy9jb21wb25lbnRzL21lbnUvY29tcG9uZW50LmpzIiwiLi4vLi4vLi4vbWVkaWEvbWF0ZXVzL2hkL2d1bWdhL2xheW91dC9zcmMvY29tcG9uZW50cy9ub3RpZmljYXRpb24vY29tcG9uZW50LmpzIiwiLi4vLi4vLi4vbWVkaWEvbWF0ZXVzL2hkL2d1bWdhL2xheW91dC9zcmMvY29tcG9uZW50cy9yaXBwbGUvY29tcG9uZW50LmpzIiwiLi4vLi4vLi4vbWVkaWEvbWF0ZXVzL2hkL2d1bWdhL2xheW91dC9zcmMvY29tcG9uZW50cy9zZWxlY3QvY29tcG9uZW50LmpzIiwiLi4vLi4vLi4vbWVkaWEvbWF0ZXVzL2hkL2d1bWdhL2xheW91dC9zcmMvY29tcG9uZW50cy9zZWxlY3QvZW1wdHkvY29tcG9uZW50LmpzIiwiLi4vLi4vLi4vbWVkaWEvbWF0ZXVzL2hkL2d1bWdhL2xheW91dC9zcmMvY29tcG9uZW50cy9zZWxlY3Qvb3B0aW9uL2NvbXBvbmVudC5qcyIsIi4uLy4uLy4uL21lZGlhL21hdGV1cy9oZC9ndW1nYS9sYXlvdXQvc3JjL2NvbXBvbmVudHMvc2VsZWN0L3NlYXJjaC9jb21wb25lbnQuanMiLCIuLi8uLi8uLi9tZWRpYS9tYXRldXMvaGQvZ3VtZ2EvbGF5b3V0L3NyYy9jb21wb25lbnRzL3NwaW5uZXIvY29tcG9uZW50LmpzIiwiLi4vLi4vLi4vbWVkaWEvbWF0ZXVzL2hkL2d1bWdhL2xheW91dC9zcmMvY29tcG9uZW50cy90aGVtZS9wcm92aWRlci5qcyIsIi4uLy4uLy4uL3Vzci9saWIvbm9kZV9tb2R1bGVzL2d1bWdhLWxheW91dC9zcmMvY29tcG9uZW50cy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0FDQUEsSUFBSSx5VUFBSjs7QUFRQSxJQUFJLFdBQVcsU0FBWCxRQUFXLEdBQU07O0FBRW5CLFNBQU8sU0FBUCxDQUFpQixLQUFqQixHQUF5QixPQUFPLFNBQVAsQ0FBaUIsS0FBakIsSUFBMEIsWUFBVTtBQUMzRCxRQUFJLEtBQUssU0FBUyxhQUFULENBQXVCLEtBQXZCLENBQVQ7QUFDQSxPQUFHLFNBQUgsR0FBZSxJQUFmO0FBQ0EsUUFBSSxPQUFPLFNBQVMsc0JBQVQsRUFBWDtBQUNBLFdBQU8sS0FBSyxXQUFMLENBQWlCLEdBQUcsV0FBSCxDQUFlLEdBQUcsVUFBbEIsQ0FBakIsQ0FBUDtBQUNELEdBTEQ7O0FBUUEsTUFBTSxjQUFjLFNBQWQsV0FBYyxDQUFDLElBQUQsRUFBTyxLQUFQLEVBQWMsT0FBZCxFQUEwQjtBQUM1QyxRQUFJLFdBQVcsU0FBUyxJQUFULEdBQWdCLE9BQWhCLENBQXdCLFlBQXhCLEVBQXNDLElBQXRDLENBQWY7QUFDSSxlQUFXLFNBQVMsSUFBVCxHQUFn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QU1HLFNBTkgsQ0FNYSxZQU5iLHVCQU9HLFNBUEgsQ0FPYSxnQkFQYix1QkFRRyxTQVJILENBUWEsV0FSYix1QkFTRyxTQVRILENBU2EsaUJBVGIsd0JBVUcsU0FWSCxDQVVhLGdCQVZiLHdCQVdHLFNBWEgsQ0FXYSxXQVhiLHdCQVlHLFNBWkgsQ0FZYSxVQVpiLHdCQWFHLFNBYkgsQ0FhYSxRQWJiLHdCQWNHLFNBZEgsQ0FjYSxZQWRiLHdCQWVHLFNBZkgsQ0FlYSxjQWZiIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImxldCB0ZW1wbGF0ZSA9IGBcbiAgPGRpdiBjbGFzcz1cImFsZXJ0IGdtZCBnbWQtYWxlcnQtcG9wdXAgYWxlcnQtQUxFUlRfVFlQRSBhbGVydC1kaXNtaXNzaWJsZVwiIHJvbGU9XCJhbGVydFwiPlxuICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2xvc2VcIiBhcmlhLWxhYmVsPVwiQ2xvc2VcIj48c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj7Dlzwvc3Bhbj48L2J1dHRvbj5cbiAgICA8c3Ryb25nPkFMRVJUX1RJVExFPC9zdHJvbmc+IEFMRVJUX01FU1NBR0VcbiAgICA8YSBjbGFzcz1cImFjdGlvblwiIHN0eWxlPVwiZGlzcGxheTogbm9uZTtcIj5EZXNmYXplcjwvYT5cbiAgPC9kaXY+XG5gO1xuXG5sZXQgUHJvdmlkZXIgPSAoKSA9PiB7XG5cbiAgU3RyaW5nLnByb3RvdHlwZS50b0RPTSA9IFN0cmluZy5wcm90b3R5cGUudG9ET00gfHwgZnVuY3Rpb24oKXtcbiAgICBsZXQgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBlbC5pbm5lckhUTUwgPSB0aGlzO1xuICAgIGxldCBmcmFnID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgIHJldHVybiBmcmFnLmFwcGVuZENoaWxkKGVsLnJlbW92ZUNoaWxkKGVsLmZpcnN0Q2hpbGQpKTtcbiAgfTtcblxuXG4gIGNvbnN0IGdldFRlbXBsYXRlID0gKHR5cGUsIHRpdGxlLCBtZXNzYWdlKSA9PiB7XG4gICAgbGV0IHRvUmV0dXJuID0gdGVtcGxhdGUudHJpbSgpLnJlcGxhY2UoJ0FMRVJUX1RZUEUnLCB0eXBlKTtcbiAgICAgICAgdG9SZXR1cm4gPSB0b1JldHVybi50cmltKCkucmVwbGFjZSgnQUxFUlRfVElUTEUnLCB0aXRsZSk7XG4gICAgICAgIHRvUmV0dXJuID0gdG9SZXR1cm4udHJpbSgpLnJlcGxhY2UoJ0FMRVJUX01FU1NBR0UnLCBtZXNzYWdlKTtcbiAgICByZXR1cm4gdG9SZXR1cm47XG4gIH1cblxuICBjb25zdCBnZXRFbGVtZW50Qm9keSAgICA9ICgpID0+IGFuZ3VsYXIuZWxlbWVudCgnYm9keScpWzBdO1xuXG4gIGNvbnN0IHN1Y2Nlc3MgPSAodGl0bGUsIG1lc3NhZ2UsIHRpbWUpID0+IHtcbiAgICByZXR1cm4gY3JlYXRlQWxlcnQoZ2V0VGVtcGxhdGUoJ3N1Y2Nlc3MnLCB0aXRsZSB8fCAnJywgbWVzc2FnZSB8fCAnJyksIHRpbWUpO1xuICB9XG5cbiAgY29uc3QgZXJyb3IgPSAodGl0bGUsIG1lc3NhZ2UsIHRpbWUpID0+IHtcbiAgICByZXR1cm4gY3JlYXRlQWxlcnQoZ2V0VGVtcGxhdGUoJ2RhbmdlcicsIHRpdGxlIHx8ICcnLCBtZXNzYWdlIHx8ICcnKSwgdGltZSk7XG4gIH1cblxuICBjb25zdCB3YXJuaW5nID0gKHRpdGxlLCBtZXNzYWdlLCB0aW1lKSA9PiB7XG4gICAgcmV0dXJuIGNyZWF0ZUFsZXJ0KGdldFRlbXBsYXRlKCd3YXJuaW5nJywgdGl0bGUsIG1lc3NhZ2UpLCB0aW1lKTtcbiAgfVxuXG4gIGNvbnN0IGluZm8gPSAodGl0bGUsIG1lc3NhZ2UsIHRpbWUpID0+IHtcbiAgICByZXR1cm4gY3JlYXRlQWxlcnQoZ2V0VGVtcGxhdGUoJ2luZm8nLCB0aXRsZSwgbWVzc2FnZSksIHRpbWUpO1xuICB9XG5cbiAgY29uc3QgY2xvc2VBbGVydCA9IChlbG0pID0+IHtcbiAgICBhbmd1bGFyLmVsZW1lbnQoZWxtKS5jc3Moe1xuICAgICAgdHJhbnNmb3JtOiAnc2NhbGUoMC4zKSdcbiAgICB9KTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGxldCBib2R5ID0gZ2V0RWxlbWVudEJvZHkoKTtcbiAgICAgIGlmKGJvZHkuY29udGFpbnMoZWxtKSl7XG4gICAgICAgIGJvZHkucmVtb3ZlQ2hpbGQoZWxtKTtcbiAgICAgIH1cbiAgICB9LCAxMDApO1xuICB9XG5cbiAgY29uc3QgYm90dG9tTGVmdCA9IChlbG0pID0+IHtcbiAgICBsZXQgYm90dG9tID0gMTU7XG4gICAgYW5ndWxhci5mb3JFYWNoKGFuZ3VsYXIuZWxlbWVudChnZXRFbGVtZW50Qm9keSgpKS5maW5kKCdkaXYuZ21kLWFsZXJ0LXBvcHVwJyksIHBvcHVwID0+IHtcbiAgICAgIGFuZ3VsYXIuZXF1YWxzKGVsbVswXSwgcG9wdXApID8gYW5ndWxhci5ub29wKCkgOiBib3R0b20gKz0gYW5ndWxhci5lbGVtZW50KHBvcHVwKS5oZWlnaHQoKSAqIDM7XG4gICAgfSk7XG4gICAgZWxtLmNzcyh7XG4gICAgICBib3R0b206IGJvdHRvbSsgJ3B4JyxcbiAgICAgIGxlZnQgIDogJzE1cHgnLFxuICAgICAgdG9wICAgOiAgbnVsbCxcbiAgICAgIHJpZ2h0IDogIG51bGxcbiAgICB9KVxuICB9XG5cbiAgY29uc3QgY3JlYXRlQWxlcnQgPSAodGVtcGxhdGUsIHRpbWUpID0+IHtcbiAgICBsZXQgb25EaXNtaXNzLCBvblJvbGxiYWNrLCBlbG0gPSBhbmd1bGFyLmVsZW1lbnQodGVtcGxhdGUudG9ET00oKSk7XG4gICAgZ2V0RWxlbWVudEJvZHkoKS5hcHBlbmRDaGlsZChlbG1bMF0pO1xuXG4gICAgYm90dG9tTGVmdChlbG0pO1xuXG4gICAgZWxtLmZpbmQoJ2J1dHRvbltjbGFzcz1cImNsb3NlXCJdJykuY2xpY2soKGV2dCkgPT4ge1xuICAgICAgY2xvc2VBbGVydChlbG1bMF0pO1xuICAgICAgb25EaXNtaXNzID8gb25EaXNtaXNzKGV2dCkgOiBhbmd1bGFyLm5vb3AoKVxuICAgIH0pO1xuXG4gICAgZWxtLmZpbmQoJ2FbY2xhc3M9XCJhY3Rpb25cIl0nKS5jbGljaygoZXZ0KSA9PiBvblJvbGxiYWNrID8gb25Sb2xsYmFjayhldnQpIDogYW5ndWxhci5ub29wKCkpO1xuXG4gICAgdGltZSA/IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgY2xvc2VBbGVydChlbG1bMF0pO1xuICAgICAgb25EaXNtaXNzID8gb25EaXNtaXNzKCkgOiBhbmd1bGFyLm5vb3AoKTtcbiAgICB9LCB0aW1lKSA6IGFuZ3VsYXIubm9vcCgpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHBvc2l0aW9uKHBvc2l0aW9uKXtcblxuICAgICAgfSxcbiAgICAgIG9uRGlzbWlzcyhjYWxsYmFjaykge1xuICAgICAgICBvbkRpc21pc3MgPSBjYWxsYmFjaztcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9LFxuICAgICAgb25Sb2xsYmFjayhjYWxsYmFjaykge1xuICAgICAgICBlbG0uZmluZCgnYVtjbGFzcz1cImFjdGlvblwiXScpLmNzcyh7IGRpc3BsYXk6ICdibG9jaycgfSk7XG4gICAgICAgIG9uUm9sbGJhY2sgPSBjYWxsYmFjaztcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9LFxuICAgICAgY2xvc2UoKXtcbiAgICAgICAgY2xvc2VBbGVydChlbG1bMF0pO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICByZXR1cm4ge1xuICAgICRnZXQoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgc3VjY2Vzczogc3VjY2VzcyxcbiAgICAgICAgICBlcnJvciAgOiBlcnJvcixcbiAgICAgICAgICB3YXJuaW5nOiB3YXJuaW5nLFxuICAgICAgICAgIGluZm8gICA6IGluZm9cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgfVxufVxuXG5Qcm92aWRlci4kaW5qZWN0ID0gW107XG5cbmV4cG9ydCBkZWZhdWx0IFByb3ZpZGVyXG4iLCJmdW5jdGlvbiBpc0RPTUF0dHJNb2RpZmllZFN1cHBvcnRlZCgpIHtcblx0XHR2YXIgcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcblx0XHR2YXIgZmxhZyA9IGZhbHNlO1xuXG5cdFx0aWYgKHAuYWRkRXZlbnRMaXN0ZW5lcikge1xuXHRcdFx0cC5hZGRFdmVudExpc3RlbmVyKCdET01BdHRyTW9kaWZpZWQnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0ZmxhZyA9IHRydWVcblx0XHRcdH0sIGZhbHNlKTtcblx0XHR9IGVsc2UgaWYgKHAuYXR0YWNoRXZlbnQpIHtcblx0XHRcdHAuYXR0YWNoRXZlbnQoJ29uRE9NQXR0ck1vZGlmaWVkJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGZsYWcgPSB0cnVlXG5cdFx0XHR9KTtcblx0XHR9IGVsc2UgeyByZXR1cm4gZmFsc2U7IH1cblx0XHRwLnNldEF0dHJpYnV0ZSgnaWQnLCAndGFyZ2V0Jyk7XG5cdFx0cmV0dXJuIGZsYWc7XG5cdH1cblxuXHRmdW5jdGlvbiBjaGVja0F0dHJpYnV0ZXMoY2hrQXR0ciwgZSkge1xuXHRcdGlmIChjaGtBdHRyKSB7XG5cdFx0XHR2YXIgYXR0cmlidXRlcyA9IHRoaXMuZGF0YSgnYXR0ci1vbGQtdmFsdWUnKTtcblxuXHRcdFx0aWYgKGUuYXR0cmlidXRlTmFtZS5pbmRleE9mKCdzdHlsZScpID49IDApIHtcblx0XHRcdFx0aWYgKCFhdHRyaWJ1dGVzWydzdHlsZSddKVxuXHRcdFx0XHRcdGF0dHJpYnV0ZXNbJ3N0eWxlJ10gPSB7fTsgLy9pbml0aWFsaXplXG5cdFx0XHRcdHZhciBrZXlzID0gZS5hdHRyaWJ1dGVOYW1lLnNwbGl0KCcuJyk7XG5cdFx0XHRcdGUuYXR0cmlidXRlTmFtZSA9IGtleXNbMF07XG5cdFx0XHRcdGUub2xkVmFsdWUgPSBhdHRyaWJ1dGVzWydzdHlsZSddW2tleXNbMV1dOyAvL29sZCB2YWx1ZVxuXHRcdFx0XHRlLm5ld1ZhbHVlID0ga2V5c1sxXSArICc6J1xuXHRcdFx0XHRcdFx0KyB0aGlzLnByb3AoXCJzdHlsZVwiKVskLmNhbWVsQ2FzZShrZXlzWzFdKV07IC8vbmV3IHZhbHVlXG5cdFx0XHRcdGF0dHJpYnV0ZXNbJ3N0eWxlJ11ba2V5c1sxXV0gPSBlLm5ld1ZhbHVlO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZS5vbGRWYWx1ZSA9IGF0dHJpYnV0ZXNbZS5hdHRyaWJ1dGVOYW1lXTtcblx0XHRcdFx0ZS5uZXdWYWx1ZSA9IHRoaXMuYXR0cihlLmF0dHJpYnV0ZU5hbWUpO1xuXHRcdFx0XHRhdHRyaWJ1dGVzW2UuYXR0cmlidXRlTmFtZV0gPSBlLm5ld1ZhbHVlO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLmRhdGEoJ2F0dHItb2xkLXZhbHVlJywgYXR0cmlidXRlcyk7IC8vdXBkYXRlIHRoZSBvbGQgdmFsdWUgb2JqZWN0XG5cdFx0fVxuXHR9XG5cblx0Ly9pbml0aWFsaXplIE11dGF0aW9uIE9ic2VydmVyXG5cdHZhciBNdXRhdGlvbk9ic2VydmVyID0gd2luZG93Lk11dGF0aW9uT2JzZXJ2ZXJcblx0XHRcdHx8IHdpbmRvdy5XZWJLaXRNdXRhdGlvbk9ic2VydmVyO1xuXG5cdGFuZ3VsYXIuZWxlbWVudC5mbi5hdHRyY2hhbmdlID0gZnVuY3Rpb24oYSwgYikge1xuXHRcdGlmICh0eXBlb2YgYSA9PSAnb2JqZWN0Jykgey8vY29yZVxuXHRcdFx0dmFyIGNmZyA9IHtcblx0XHRcdFx0dHJhY2tWYWx1ZXMgOiBmYWxzZSxcblx0XHRcdFx0Y2FsbGJhY2sgOiAkLm5vb3Bcblx0XHRcdH07XG5cdFx0XHQvL2JhY2t3YXJkIGNvbXBhdGliaWxpdHlcblx0XHRcdGlmICh0eXBlb2YgYSA9PT0gXCJmdW5jdGlvblwiKSB7IGNmZy5jYWxsYmFjayA9IGE7IH0gZWxzZSB7ICQuZXh0ZW5kKGNmZywgYSk7IH1cblxuXHRcdFx0aWYgKGNmZy50cmFja1ZhbHVlcykgeyAvL2dldCBhdHRyaWJ1dGVzIG9sZCB2YWx1ZVxuXHRcdFx0XHR0aGlzLmVhY2goZnVuY3Rpb24oaSwgZWwpIHtcblx0XHRcdFx0XHR2YXIgYXR0cmlidXRlcyA9IHt9O1xuXHRcdFx0XHRcdGZvciAoIHZhciBhdHRyLCBpID0gMCwgYXR0cnMgPSBlbC5hdHRyaWJ1dGVzLCBsID0gYXR0cnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRhdHRyID0gYXR0cnMuaXRlbShpKTtcblx0XHRcdFx0XHRcdGF0dHJpYnV0ZXNbYXR0ci5ub2RlTmFtZV0gPSBhdHRyLnZhbHVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQkKHRoaXMpLmRhdGEoJ2F0dHItb2xkLXZhbHVlJywgYXR0cmlidXRlcyk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoTXV0YXRpb25PYnNlcnZlcikgeyAvL01vZGVybiBCcm93c2VycyBzdXBwb3J0aW5nIE11dGF0aW9uT2JzZXJ2ZXJcblx0XHRcdFx0dmFyIG1PcHRpb25zID0ge1xuXHRcdFx0XHRcdHN1YnRyZWUgOiBmYWxzZSxcblx0XHRcdFx0XHRhdHRyaWJ1dGVzIDogdHJ1ZSxcblx0XHRcdFx0XHRhdHRyaWJ1dGVPbGRWYWx1ZSA6IGNmZy50cmFja1ZhbHVlc1xuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YXIgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihmdW5jdGlvbihtdXRhdGlvbnMpIHtcblx0XHRcdFx0XHRtdXRhdGlvbnMuZm9yRWFjaChmdW5jdGlvbihlKSB7XG5cdFx0XHRcdFx0XHR2YXIgX3RoaXMgPSBlLnRhcmdldDtcblx0XHRcdFx0XHRcdC8vZ2V0IG5ldyB2YWx1ZSBpZiB0cmFja1ZhbHVlcyBpcyB0cnVlXG5cdFx0XHRcdFx0XHRpZiAoY2ZnLnRyYWNrVmFsdWVzKSB7XG5cdFx0XHRcdFx0XHRcdGUubmV3VmFsdWUgPSAkKF90aGlzKS5hdHRyKGUuYXR0cmlidXRlTmFtZSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAoJChfdGhpcykuZGF0YSgnYXR0cmNoYW5nZS1zdGF0dXMnKSA9PT0gJ2Nvbm5lY3RlZCcpIHsgLy9leGVjdXRlIGlmIGNvbm5lY3RlZFxuXHRcdFx0XHRcdFx0XHRjZmcuY2FsbGJhY2suY2FsbChfdGhpcywgZSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdHJldHVybiB0aGlzLmRhdGEoJ2F0dHJjaGFuZ2UtbWV0aG9kJywgJ011dGF0aW9uIE9ic2VydmVyJykuZGF0YSgnYXR0cmNoYW5nZS1zdGF0dXMnLCAnY29ubmVjdGVkJylcblx0XHRcdFx0XHRcdC5kYXRhKCdhdHRyY2hhbmdlLW9icycsIG9ic2VydmVyKS5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0XHRvYnNlcnZlci5vYnNlcnZlKHRoaXMsIG1PcHRpb25zKTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0fSBlbHNlIGlmIChpc0RPTUF0dHJNb2RpZmllZFN1cHBvcnRlZCgpKSB7IC8vT3BlcmFcblx0XHRcdFx0Ly9Hb29kIG9sZCBNdXRhdGlvbiBFdmVudHNcblx0XHRcdFx0cmV0dXJuIHRoaXMuZGF0YSgnYXR0cmNoYW5nZS1tZXRob2QnLCAnRE9NQXR0ck1vZGlmaWVkJykuZGF0YSgnYXR0cmNoYW5nZS1zdGF0dXMnLCAnY29ubmVjdGVkJykub24oJ0RPTUF0dHJNb2RpZmllZCcsIGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0XHRcdFx0aWYgKGV2ZW50Lm9yaWdpbmFsRXZlbnQpIHsgZXZlbnQgPSBldmVudC5vcmlnaW5hbEV2ZW50OyB9Ly9qUXVlcnkgbm9ybWFsaXphdGlvbiBpcyBub3QgcmVxdWlyZWRcblx0XHRcdFx0XHRldmVudC5hdHRyaWJ1dGVOYW1lID0gZXZlbnQuYXR0ck5hbWU7IC8vcHJvcGVydHkgbmFtZXMgdG8gYmUgY29uc2lzdGVudCB3aXRoIE11dGF0aW9uT2JzZXJ2ZXJcblx0XHRcdFx0XHRldmVudC5vbGRWYWx1ZSA9IGV2ZW50LnByZXZWYWx1ZTsgLy9wcm9wZXJ0eSBuYW1lcyB0byBiZSBjb25zaXN0ZW50IHdpdGggTXV0YXRpb25PYnNlcnZlclxuXHRcdFx0XHRcdGlmICgkKHRoaXMpLmRhdGEoJ2F0dHJjaGFuZ2Utc3RhdHVzJykgPT09ICdjb25uZWN0ZWQnKSB7IC8vZGlzY29ubmVjdGVkIGxvZ2ljYWxseVxuXHRcdFx0XHRcdFx0Y2ZnLmNhbGxiYWNrLmNhbGwodGhpcywgZXZlbnQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9IGVsc2UgaWYgKCdvbnByb3BlcnR5Y2hhbmdlJyBpbiBkb2N1bWVudC5ib2R5KSB7IC8vd29ya3Mgb25seSBpbiBJRVxuXHRcdFx0XHRyZXR1cm4gdGhpcy5kYXRhKCdhdHRyY2hhbmdlLW1ldGhvZCcsICdwcm9wZXJ0eWNoYW5nZScpLmRhdGEoJ2F0dHJjaGFuZ2Utc3RhdHVzJywgJ2Nvbm5lY3RlZCcpLm9uKCdwcm9wZXJ0eWNoYW5nZScsIGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0XHRlLmF0dHJpYnV0ZU5hbWUgPSB3aW5kb3cuZXZlbnQucHJvcGVydHlOYW1lO1xuXHRcdFx0XHRcdC8vdG8gc2V0IHRoZSBhdHRyIG9sZCB2YWx1ZVxuXHRcdFx0XHRcdGNoZWNrQXR0cmlidXRlcy5jYWxsKCQodGhpcyksIGNmZy50cmFja1ZhbHVlcywgZSk7XG5cdFx0XHRcdFx0aWYgKCQodGhpcykuZGF0YSgnYXR0cmNoYW5nZS1zdGF0dXMnKSA9PT0gJ2Nvbm5lY3RlZCcpIHsgLy9kaXNjb25uZWN0ZWQgbG9naWNhbGx5XG5cdFx0XHRcdFx0XHRjZmcuY2FsbGJhY2suY2FsbCh0aGlzLCBlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fSBlbHNlIGlmICh0eXBlb2YgYSA9PSAnc3RyaW5nJyAmJiAkLmZuLmF0dHJjaGFuZ2UuaGFzT3duUHJvcGVydHkoJ2V4dGVuc2lvbnMnKSAmJlxuXHRcdFx0XHRhbmd1bGFyLmVsZW1lbnQuZm4uYXR0cmNoYW5nZVsnZXh0ZW5zaW9ucyddLmhhc093blByb3BlcnR5KGEpKSB7IC8vZXh0ZW5zaW9ucy9vcHRpb25zXG5cdFx0XHRyZXR1cm4gJC5mbi5hdHRyY2hhbmdlWydleHRlbnNpb25zJ11bYV0uY2FsbCh0aGlzLCBiKTtcblx0XHR9XG5cdH1cbiIsImxldCBDb21wb25lbnQgPSB7XG4gIHRyYW5zY2x1ZGU6IHRydWUsXG4gIGJpbmRpbmdzOiB7XG4gICAgZm9yY2VDbGljazogJz0/JyxcbiAgICBvcGVuZWQ6ICc9PydcbiAgfSxcbiAgdGVtcGxhdGU6IGA8bmctdHJhbnNjbHVkZT48L25nLXRyYW5zY2x1ZGU+YCxcbiAgY29udHJvbGxlcjogWyckc2NvcGUnLCckZWxlbWVudCcsJyRhdHRycycsJyR0aW1lb3V0JywgJyRwYXJzZScsIGZ1bmN0aW9uKCRzY29wZSwgJGVsZW1lbnQsICRhdHRycywgJHRpbWVvdXQsJHBhcnNlKSB7XG4gICAgbGV0IGN0cmwgPSB0aGlzO1xuXG4gICAgY29uc3QgaGFuZGxpbmdPcHRpb25zID0gKGVsZW1lbnRzKSA9PiB7XG4gICAgICAkdGltZW91dCgoKSA9PiB7XG4gICAgICAgIGFuZ3VsYXIuZm9yRWFjaChlbGVtZW50cywgKG9wdGlvbikgPT4ge1xuICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudChvcHRpb24pLmNzcyh7bGVmdDogKG1lYXN1cmVUZXh0KGFuZ3VsYXIuZWxlbWVudChvcHRpb24pLnRleHQoKSwgJzE0Jywgb3B0aW9uLnN0eWxlKS53aWR0aCArIDMwKSAqIC0xfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSlcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtZWFzdXJlVGV4dChwVGV4dCwgcEZvbnRTaXplLCBwU3R5bGUpIHtcbiAgICAgICAgdmFyIGxEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChsRGl2KTtcblxuICAgICAgICBpZiAocFN0eWxlICE9IG51bGwpIHtcbiAgICAgICAgICAgIGxEaXYuc3R5bGUgPSBwU3R5bGU7XG4gICAgICAgIH1cblxuICAgICAgICBsRGl2LnN0eWxlLmZvbnRTaXplID0gXCJcIiArIHBGb250U2l6ZSArIFwicHhcIjtcbiAgICAgICAgbERpdi5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcbiAgICAgICAgbERpdi5zdHlsZS5sZWZ0ID0gLTEwMDA7XG4gICAgICAgIGxEaXYuc3R5bGUudG9wID0gLTEwMDA7XG5cbiAgICAgICAgbERpdi5pbm5lckhUTUwgPSBwVGV4dDtcblxuICAgICAgICB2YXIgbFJlc3VsdCA9IHtcbiAgICAgICAgICAgIHdpZHRoOiBsRGl2LmNsaWVudFdpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiBsRGl2LmNsaWVudEhlaWdodFxuICAgICAgICB9O1xuXG4gICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQobERpdik7XG5cbiAgICAgICAgbERpdiA9IG51bGw7XG5cbiAgICAgICAgcmV0dXJuIGxSZXN1bHQ7XG4gICAgfVxuXG4gICAgY29uc3Qgd2l0aEZvY3VzID0gKHVsKSA9PiB7XG4gICAgICAkZWxlbWVudC5vbignbW91c2VlbnRlcicsICgpID0+IHtcbiAgICAgICAgaWYoY3RybC5vcGVuZWQpe1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBhbmd1bGFyLmZvckVhY2goJGVsZW1lbnQuZmluZCgndWwnKSwgKHVsKSA9PiB7XG4gICAgICAgICAgdmVyaWZ5UG9zaXRpb24oYW5ndWxhci5lbGVtZW50KHVsKSk7XG4gICAgICAgICAgaGFuZGxpbmdPcHRpb25zKGFuZ3VsYXIuZWxlbWVudCh1bCkuZmluZCgnbGkgPiBzcGFuJykpO1xuICAgICAgICB9KVxuICAgICAgICBvcGVuKHVsKTtcbiAgICAgIH0pO1xuICAgICAgJGVsZW1lbnQub24oJ21vdXNlbGVhdmUnLCAoKSA9PiB7XG4gICAgICAgIGlmKGN0cmwub3BlbmVkKXtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmVyaWZ5UG9zaXRpb24oYW5ndWxhci5lbGVtZW50KHVsKSk7XG4gICAgICAgIGNsb3NlKHVsKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IGNsb3NlID0gKHVsKSA9PiB7XG4gICAgICBpZih1bFswXS5oYXNBdHRyaWJ1dGUoJ2xlZnQnKSl7XG4gICAgICAgIHVsLmZpbmQoJ2xpJykuY3NzKHt0cmFuc2Zvcm06ICdyb3RhdGUoOTBkZWcpIHNjYWxlKDAuMyknfSk7XG4gICAgICB9ZWxzZXtcbiAgICAgICAgdWwuZmluZCgnbGknKS5jc3Moe3RyYW5zZm9ybTogJ3NjYWxlKDAuMyknfSk7XG4gICAgICB9XG4gICAgICB1bC5maW5kKCdsaSA+IHNwYW4nKS5jc3Moe29wYWNpdHk6ICcwJywgcG9zaXRpb246ICdhYnNvbHV0ZSd9KVxuICAgICAgdWwuY3NzKHt2aXNpYmlsaXR5OiBcImhpZGRlblwiLCBvcGFjaXR5OiAnMCd9KVxuICAgICAgdWwucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcbiAgICAgIC8vIGlmKGN0cmwub3BlbmVkKXtcbiAgICAgIC8vICAgY3RybC5vcGVuZWQgPSBmYWxzZTtcbiAgICAgIC8vICAgJHNjb3BlLiRkaWdlc3QoKTtcbiAgICAgIC8vIH1cbiAgICB9XG5cbiAgICBjb25zdCBvcGVuID0gKHVsKSA9PiB7XG4gICAgICBpZih1bFswXS5oYXNBdHRyaWJ1dGUoJ2xlZnQnKSl7XG4gICAgICAgIHVsLmZpbmQoJ2xpJykuY3NzKHt0cmFuc2Zvcm06ICdyb3RhdGUoOTBkZWcpIHNjYWxlKDEpJ30pO1xuICAgICAgfWVsc2V7XG4gICAgICAgIHVsLmZpbmQoJ2xpJykuY3NzKHt0cmFuc2Zvcm06ICdyb3RhdGUoMGRlZykgc2NhbGUoMSknfSk7XG4gICAgICB9XG4gICAgICB1bC5maW5kKCdsaSA+IHNwYW4nKS5ob3ZlcihmdW5jdGlvbigpe1xuICAgICAgICBhbmd1bGFyLmVsZW1lbnQodGhpcykuY3NzKHtvcGFjaXR5OiAnMScsIHBvc2l0aW9uOiAnYWJzb2x1dGUnfSlcbiAgICAgIH0pXG4gICAgICB1bC5jc3Moe3Zpc2liaWxpdHk6IFwidmlzaWJsZVwiLCBvcGFjaXR5OiAnMSd9KVxuICAgICAgdWwuYWRkQ2xhc3MoJ29wZW4nKTtcbiAgICAgIC8vIGlmKCFjdHJsLm9wZW5lZCl7XG4gICAgICAvLyAgIGN0cmwub3BlbmVkID0gdHJ1ZTtcbiAgICAgIC8vICAgJHNjb3BlLiRkaWdlc3QoKTtcbiAgICAgIC8vIH1cbiAgICB9XG5cbiAgICBjb25zdCB3aXRoQ2xpY2sgPSAodWwpID0+IHtcbiAgICAgICAkZWxlbWVudC5maW5kKCdidXR0b24nKS5maXJzdCgpLm9uKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgIGlmKHVsLmhhc0NsYXNzKCdvcGVuJykpe1xuICAgICAgICAgICBjbG9zZSh1bCk7XG4gICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgb3Blbih1bCk7XG4gICAgICAgICB9XG4gICAgICAgfSlcbiAgICB9XG5cbiAgICBjb25zdCB2ZXJpZnlQb3NpdGlvbiA9ICh1bCkgPT4ge1xuICAgICAgJGVsZW1lbnQuY3NzKHtkaXNwbGF5OiBcImlubGluZS1ibG9ja1wifSk7XG4gICAgICBpZih1bFswXS5oYXNBdHRyaWJ1dGUoJ2xlZnQnKSl7XG4gICAgICAgIGxldCB3aWR0aCA9IDAsIGxpcyA9IHVsLmZpbmQoJ2xpJyk7XG4gICAgICAgIGFuZ3VsYXIuZm9yRWFjaChsaXMsIGxpID0+IHdpZHRoKz1hbmd1bGFyLmVsZW1lbnQobGkpWzBdLm9mZnNldFdpZHRoKTtcbiAgICAgICAgY29uc3Qgc2l6ZSA9ICh3aWR0aCArICgxMCAqIGxpcy5sZW5ndGgpKSAqIC0xO1xuICAgICAgICB1bC5jc3Moe2xlZnQ6IHNpemV9KTtcbiAgICAgIH1lbHNle1xuICAgICAgICBjb25zdCBzaXplID0gdWwuaGVpZ2h0KCk7XG4gICAgICAgIHVsLmNzcyh7dG9wOiBzaXplICogLTF9KVxuICAgICAgfVxuICAgIH1cblxuICAgICRzY29wZS4kd2F0Y2goJyRjdHJsLm9wZW5lZCcsICh2YWx1ZSkgPT4ge1xuICAgICAgICBhbmd1bGFyLmZvckVhY2goJGVsZW1lbnQuZmluZCgndWwnKSwgKHVsKSA9PiB7XG4gICAgICAgICAgdmVyaWZ5UG9zaXRpb24oYW5ndWxhci5lbGVtZW50KHVsKSk7XG4gICAgICAgICAgaGFuZGxpbmdPcHRpb25zKGFuZ3VsYXIuZWxlbWVudCh1bCkuZmluZCgnbGkgPiBzcGFuJykpO1xuICAgICAgICAgIGlmKHZhbHVlKXtcbiAgICAgICAgICAgIG9wZW4oYW5ndWxhci5lbGVtZW50KHVsKSk7XG4gICAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgY2xvc2UoYW5ndWxhci5lbGVtZW50KHVsKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgfSwgdHJ1ZSk7XG5cbiAgICAkZWxlbWVudC5yZWFkeSgoKSA9PiB7XG4gICAgICAkdGltZW91dCgoKSA9PiB7XG4gICAgICAgIGFuZ3VsYXIuZm9yRWFjaCgkZWxlbWVudC5maW5kKCd1bCcpLCAodWwpID0+IHtcbiAgICAgICAgICB2ZXJpZnlQb3NpdGlvbihhbmd1bGFyLmVsZW1lbnQodWwpKTtcbiAgICAgICAgICBoYW5kbGluZ09wdGlvbnMoYW5ndWxhci5lbGVtZW50KHVsKS5maW5kKCdsaSA+IHNwYW4nKSk7XG4gICAgICAgICAgaWYoIWN0cmwuZm9yY2VDbGljayl7XG4gICAgICAgICAgICB3aXRoRm9jdXMoYW5ndWxhci5lbGVtZW50KHVsKSk7XG4gICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICB3aXRoQ2xpY2soYW5ndWxhci5lbGVtZW50KHVsKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KVxuXG4gIH1dXG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvbmVudFxuIiwibGV0IENvbXBvbmVudCA9IHtcbiAgYmluZGluZ3M6IHtcbiAgfSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8YSBjbGFzcz1cIm5hdmJhci1icmFuZFwiIGRhdGEtbmctY2xpY2s9XCIkY3RybC5uYXZDb2xsYXBzZSgpXCIgc3R5bGU9XCJwb3NpdGlvbjogcmVsYXRpdmU7Y3Vyc29yOiBwb2ludGVyO1wiPlxuICAgICAgPGRpdiBjbGFzcz1cIm5hdlRyaWdnZXJcIj5cbiAgICAgICAgPGk+PC9pPjxpPjwvaT48aT48L2k+XG4gICAgICA8L2Rpdj5cbiAgICA8L2E+XG4gIGAsXG4gIGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGVsZW1lbnQnLCckYXR0cnMnLCckdGltZW91dCcsICckcGFyc2UnLCBmdW5jdGlvbigkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMsICR0aW1lb3V0LCRwYXJzZSkge1xuICAgIGxldCBjdHJsID0gdGhpcztcblxuICAgIGN0cmwuJG9uSW5pdCA9ICgpID0+IHtcbiAgICAgIGFuZ3VsYXIuZWxlbWVudChcIm5hdi5nbC1uYXZcIikuYXR0cmNoYW5nZSh7XG4gICAgICAgICAgdHJhY2tWYWx1ZXM6IHRydWUsXG4gICAgICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uKGV2bnQpIHtcbiAgICAgICAgICAgIGlmKGV2bnQuYXR0cmlidXRlTmFtZSA9PSAnY2xhc3MnKXtcbiAgICAgICAgICAgICAgY3RybC50b2dnbGVIYW1idXJnZXIoZXZudC5uZXdWYWx1ZS5pbmRleE9mKCdjb2xsYXBzZWQnKSAhPSAtMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGN0cmwudG9nZ2xlSGFtYnVyZ2VyID0gKGlzQ29sbGFwc2VkKSA9PiB7XG4gICAgICAgIGlzQ29sbGFwc2VkID8gJGVsZW1lbnQuZmluZCgnZGl2Lm5hdlRyaWdnZXInKS5hZGRDbGFzcygnYWN0aXZlJykgOiAkZWxlbWVudC5maW5kKCdkaXYubmF2VHJpZ2dlcicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgIH1cblxuICAgICAgY3RybC5uYXZDb2xsYXBzZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ3VtZ2EtbGF5b3V0IG5hdi5nbC1uYXYnKVxuICAgICAgICAgIC5jbGFzc0xpc3QudG9nZ2xlKCdjb2xsYXBzZWQnKTtcbiAgICAgICAgYW5ndWxhci5lbGVtZW50KFwibmF2LmdsLW5hdlwiKS5hdHRyY2hhbmdlKHtcbiAgICAgICAgICAgIHRyYWNrVmFsdWVzOiB0cnVlLFxuICAgICAgICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uKGV2bnQpIHtcbiAgICAgICAgICAgICAgaWYoZXZudC5hdHRyaWJ1dGVOYW1lID09ICdjbGFzcycpe1xuICAgICAgICAgICAgICAgIGN0cmwudG9nZ2xlSGFtYnVyZ2VyKGV2bnQubmV3VmFsdWUuaW5kZXhPZignY29sbGFwc2VkJykgIT0gLTEpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBjdHJsLnRvZ2dsZUhhbWJ1cmdlcihhbmd1bGFyLmVsZW1lbnQoJ25hdi5nbC1uYXYnKS5oYXNDbGFzcygnY29sbGFwc2VkJykpO1xuICAgIH1cblxuICB9XVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnQ7XG4iLCJsZXQgQ29tcG9uZW50ID0ge1xuICB0cmFuc2NsdWRlOiB0cnVlLFxuICBiaW5kaW5nczoge1xuICB9LFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXYgbmctdHJhbnNjbHVkZT48L2Rpdj5cbiAgYCxcbiAgY29udHJvbGxlcjogWyckc2NvcGUnLCckZWxlbWVudCcsJyRhdHRycycsJyR0aW1lb3V0JywgJyRwYXJzZScsIGZ1bmN0aW9uKCRzY29wZSwgJGVsZW1lbnQsICRhdHRycywgJHRpbWVvdXQsJHBhcnNlKSB7XG4gICAgbGV0IGN0cmwgPSB0aGlzLFxuICAgICAgICBpbnB1dCxcbiAgICAgICAgbW9kZWw7XG5cbiAgICBjdHJsLiRvbkluaXQgPSAoKSA9PiB7XG4gICAgICBsZXQgY2hhbmdlQWN0aXZlID0gdGFyZ2V0ID0+IHtcbiAgICAgICAgaWYgKHRhcmdldC52YWx1ZSkge1xuICAgICAgICAgIHRhcmdldC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjdHJsLiRkb0NoZWNrID0gKCkgPT4ge1xuICAgICAgICBpZiAoaW5wdXQgJiYgaW5wdXRbMF0pIGNoYW5nZUFjdGl2ZShpbnB1dFswXSlcbiAgICAgIH1cbiAgICAgIGN0cmwuJHBvc3RMaW5rID0gKCkgPT4ge1xuICAgICAgICBsZXQgZ21kSW5wdXQgPSAkZWxlbWVudC5maW5kKCdpbnB1dCcpO1xuICAgICAgICBpZihnbWRJbnB1dFswXSl7XG4gICAgICAgICAgaW5wdXQgPSBhbmd1bGFyLmVsZW1lbnQoZ21kSW5wdXQpXG4gICAgICAgIH1lbHNle1xuICAgICAgICAgIGlucHV0ID0gYW5ndWxhci5lbGVtZW50KCRlbGVtZW50LmZpbmQoJ3RleHRhcmVhJykpO1xuICAgICAgICB9XG4gICAgICAgIG1vZGVsID0gaW5wdXQuYXR0cignbmctbW9kZWwnKSB8fCBpbnB1dC5hdHRyKCdkYXRhLW5nLW1vZGVsJyk7XG4gICAgICB9XG4gICAgfVxuXG4gIH1dXG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvbmVudFxuIiwibGV0IENvbXBvbmVudCA9IHtcbiAgICB0cmFuc2NsdWRlOiB0cnVlLFxuICAgIGJpbmRpbmdzOiB7XG4gICAgICAgIG1lbnU6ICc8JyxcbiAgICAgICAga2V5czogJzwnLFxuICAgICAgICBsb2dvOiAnQD8nLFxuICAgICAgICBsYXJnZUxvZ286ICdAPycsXG4gICAgICAgIHNtYWxsTG9nbzogJ0A/JyxcbiAgICAgICAgaGlkZVNlYXJjaDogJz0/JyxcbiAgICAgICAgaXNPcGVuZWQ6ICc9PycsXG4gICAgICAgIGljb25GaXJzdExldmVsOiAnQD8nLFxuICAgICAgICBzaG93QnV0dG9uRmlyc3RMZXZlbDogJz0/JyxcbiAgICAgICAgdGV4dEZpcnN0TGV2ZWw6ICdAPycsXG4gICAgICAgIGl0ZW1EaXNhYmxlZDogJyY/J1xuICAgIH0sXG4gICAgdGVtcGxhdGU6IGBcblxuICAgIDxuYXYgY2xhc3M9XCJtYWluLW1lbnVcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cIm1lbnUtaGVhZGVyXCI+XG4gICAgICAgICAgICA8aW1nIG5nLWlmPVwiJGN0cmwubG9nb1wiIG5nLXNyYz1cInt7JGN0cmwubG9nb319XCIvPlxuICAgICAgICAgICAgPGltZyBjbGFzcz1cImxhcmdlXCIgbmctaWY9XCIkY3RybC5sYXJnZUxvZ29cIiBuZy1zcmM9XCJ7eyRjdHJsLmxhcmdlTG9nb319XCIvPlxuICAgICAgICAgICAgPGltZyBjbGFzcz1cInNtYWxsXCIgbmctaWY9XCIkY3RybC5zbWFsbExvZ29cIiBuZy1zcmM9XCJ7eyRjdHJsLnNtYWxsTG9nb319XCIvPlxuXG4gICAgICAgICAgICA8c3ZnIHZlcnNpb249XCIxLjFcIiBuZy1jbGljaz1cIiRjdHJsLnRvZ2dsZU1lbnUoKVwiIGlkPVwiQ2FwYV8xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiIHg9XCIwcHhcIiB5PVwiMHB4XCJcbiAgICAgICAgICAgICAgICB3aWR0aD1cIjYxMy40MDhweFwiIGhlaWdodD1cIjYxMy40MDhweFwiIHZpZXdCb3g9XCIwIDAgNjEzLjQwOCA2MTMuNDA4XCIgeG1sOnNwYWNlPVwicHJlc2VydmVcIj5cbiAgICAgICAgICAgICAgICA8Zz5cbiAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTYwNS4yNTQsMTY4Ljk0TDQ0My43OTIsNy40NTdjLTYuOTI0LTYuODgyLTE3LjEwMi05LjIzOS0yNi4zMTktNi4wNjljLTkuMTc3LDMuMTI4LTE1LjgwOSwxMS4yNDEtMTcuMDE5LDIwLjg1NVxuICAgICAgICAgICAgICAgICAgICBsLTkuMDkzLDcwLjUxMkwyNjcuNTg1LDIxNi40MjhoLTE0Mi42NWMtMTAuMzQ0LDAtMTkuNjI1LDYuMjE1LTIzLjYyOSwxNS43NDZjLTMuOTIsOS41NzMtMS43MSwyMC41MjIsNS41ODksMjcuNzc5XG4gICAgICAgICAgICAgICAgICAgIGwxMDUuNDI0LDEwNS40MDNMMC42OTksNjEzLjQwOGwyNDYuNjM1LTIxMi44NjlsMTA1LjQyMywxMDUuNDAyYzQuODgxLDQuODgxLDExLjQ1LDcuNDY3LDE3Ljk5OSw3LjQ2N1xuICAgICAgICAgICAgICAgICAgICBjMy4yOTUsMCw2LjYzMi0wLjcwOSw5Ljc4LTIuMDAyYzkuNTczLTMuOTIyLDE1LjcyNi0xMy4yNDQsMTUuNzI2LTIzLjUwNFYzNDUuMTY4bDEyMy44MzktMTIzLjcxNGw3MC40MjktOS4xNzZcbiAgICAgICAgICAgICAgICAgICAgYzkuNjE0LTEuMjUxLDE3LjcyNy03Ljg2MiwyMC44MTMtMTcuMDM5QzYxNC40NzIsMTg2LjAyMSw2MTIuMTM2LDE3NS44MDEsNjA1LjI1NCwxNjguOTR6IE01MDQuODU2LDE3MS45ODVcbiAgICAgICAgICAgICAgICAgICAgYy01LjU2OCwwLjc1MS0xMC43NjIsMy4yMzItMTQuNzQ1LDcuMjM3TDM1Mi43NTgsMzE2LjU5NmMtNC43OTYsNC43NzUtNy40NjYsMTEuMjQyLTcuNDY2LDE4LjA0MXY5MS43NDJMMTg2LjQzNywyNjcuNDgxaDkxLjY4XG4gICAgICAgICAgICAgICAgICAgIGM2Ljc1NywwLDEzLjI0My0yLjY2OSwxOC4wNC03LjQ2Nkw0MzMuNTEsMTIyLjc2NmMzLjk4My0zLjk4Myw2LjU2OS05LjE3Niw3LjI1OC0xNC43ODZsMy42MjktMjcuNjk2bDg4LjE1NSw4OC4xMTRcbiAgICAgICAgICAgICAgICAgICAgTDUwNC44NTYsMTcxLjk4NXpcIi8+XG4gICAgICAgICAgICAgICAgPC9nPlxuICAgICAgICAgICAgPC9zdmc+XG5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJzY3JvbGxiYXIgc3R5bGUtMVwiPlxuICAgICAgICAgICAgPHVsIGRhdGEtbmctY2xhc3M9XCInbGV2ZWwnLmNvbmNhdCgkY3RybC5iYWNrLmxlbmd0aClcIj5cblxuICAgICAgICAgICAgICAgIDxsaSBjbGFzcz1cImdvYmFjayBnbWQgZ21kLXJpcHBsZVwiIGRhdGEtbmctc2hvdz1cIiRjdHJsLnByZXZpb3VzLmxlbmd0aCA+IDBcIiBkYXRhLW5nLWNsaWNrPVwiJGN0cmwucHJldigpXCI+XG4gICAgICAgICAgICAgICAgICAgIDxhPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJtYXRlcmlhbC1pY29uc1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleWJvYXJkX2Fycm93X2xlZnRcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvaT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGRhdGEtbmctYmluZD1cIiRjdHJsLmJhY2tbJGN0cmwuYmFjay5sZW5ndGggLSAxXS5sYWJlbFwiIGNsYXNzPVwibmF2LXRleHRcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICA8L2xpPlxuXG4gICAgICAgICAgICAgICAgPGxpIGNsYXNzPVwiZ21kLXJpcHBsZVwiXG4gICAgICAgICAgICAgICAgICAgIGRhdGEtbmctcmVwZWF0PVwiaXRlbSBpbiAkY3RybC5tZW51IHwgZmlsdGVyOiRjdHJsLnNlYXJjaFwiXG4gICAgICAgICAgICAgICAgICAgIGRhdGEtbmctc2hvdz1cIiRjdHJsLmFsbG93KGl0ZW0pXCJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS1uZy1jbGljaz1cIiRjdHJsLm5leHQoaXRlbSwgJGV2ZW50KVwiXG4gICAgICAgICAgICAgICAgICAgIGRhdGEtbmctY2xhc3M9XCJbISRjdHJsLmRpc2FibGVBbmltYXRpb25zID8gJGN0cmwuc2xpZGUgOiAnJywgeydkaXNhYmxlZCc6ICRjdHJsLml0ZW1EaXNhYmxlZCh7aXRlbTogaXRlbX0pfSwge2hlYWRlcjogaXRlbS50eXBlID09ICdoZWFkZXInLCBkaXZpZGVyOiBpdGVtLnR5cGUgPT0gJ3NlcGFyYXRvcid9XVwiPlxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgPGEgbmctaWY9XCJpdGVtLnR5cGUgIT0gJ3NlcGFyYXRvcicgJiYgaXRlbS5zdGF0ZVwiIHVpLXNyZWY9XCJ7e2l0ZW0uc3RhdGV9fVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGkgZGF0YS1uZy1pZj1cIml0ZW0uaWNvblwiIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnNcIiBkYXRhLW5nLWJpbmQ9XCJpdGVtLmljb25cIj48L2k+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cIm5hdi10ZXh0XCIgbmctYmluZD1cIml0ZW0ubGFiZWxcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aSBkYXRhLW5nLWlmPVwiaXRlbS5jaGlsZHJlbiAmJiBpdGVtLmNoaWxkcmVuLmxlbmd0aCA+IDBcIiBjbGFzcz1cIm1hdGVyaWFsLWljb25zIHB1bGwtcmlnaHRcIj5rZXlib2FyZF9hcnJvd19yaWdodDwvaT5cbiAgICAgICAgICAgICAgICAgICAgPC9hPlxuXG4gICAgICAgICAgICAgICAgICAgIDxhIG5nLWlmPVwiaXRlbS50eXBlICE9ICdzZXBhcmF0b3InICYmICFpdGVtLnN0YXRlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aSBkYXRhLW5nLWlmPVwiaXRlbS5pY29uXCIgY2xhc3M9XCJtYXRlcmlhbC1pY29uc1wiIGRhdGEtbmctYmluZD1cIml0ZW0uaWNvblwiPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibmF2LXRleHRcIiBuZy1iaW5kPVwiaXRlbS5sYWJlbFwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpIGRhdGEtbmctaWY9XCJpdGVtLmNoaWxkcmVuICYmIGl0ZW0uY2hpbGRyZW4ubGVuZ3RoID4gMFwiIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnMgcHVsbC1yaWdodFwiPmtleWJvYXJkX2Fycm93X3JpZ2h0PC9pPlxuICAgICAgICAgICAgICAgICAgICA8L2E+XG5cbiAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgPC91bD5cbiAgICA8L25hdj5cbiAgICBcbiAgICBgLFxuICAgIGNvbnRyb2xsZXI6IFsnJHRpbWVvdXQnLCAnJGF0dHJzJywgJyRlbGVtZW50JywgZnVuY3Rpb24gKCR0aW1lb3V0LCAkYXR0cnMsICRlbGVtZW50KSB7XG4gICAgICAgIGxldCBjdHJsID0gdGhpcztcbiAgICAgICAgY3RybC5rZXlzID0gY3RybC5rZXlzIHx8IFtdO1xuICAgICAgICBjdHJsLmljb25GaXJzdExldmVsID0gY3RybC5pY29uRmlyc3RMZXZlbCB8fCAnZ2x5cGhpY29uIGdseXBoaWNvbi1ob21lJztcbiAgICAgICAgY3RybC5wcmV2aW91cyA9IFtdO1xuICAgICAgICBjdHJsLmJhY2sgPSBbXTtcbiAgICAgICAgbGV0IG1haW5Db250ZW50LCBoZWFkZXJDb250ZW50O1xuXG4gICAgICAgIGN0cmwuJG9uSW5pdCA9ICgpID0+IHtcbiAgICAgICAgICAgIG1haW5Db250ZW50ID0gYW5ndWxhci5lbGVtZW50KCcuZ3VtZ2EtbGF5b3V0IC5nbC1tYWluJyk7XG4gICAgICAgICAgICBoZWFkZXJDb250ZW50ID0gYW5ndWxhci5lbGVtZW50KCcuZ3VtZ2EtbGF5b3V0IC5nbC1oZWFkZXInKTtcbiAgICAgICAgICAgIGlmKGV2YWwoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnZ21kLW1lbnUtc2hyaW5rJykpKXtcbiAgICAgICAgICAgICAgICAkZWxlbWVudC5hZGRDbGFzcygnZml4ZWQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBjdHJsLnRvZ2dsZU1lbnUgPSAoKSA9PiB7XG4gICAgICAgICAgICAkZWxlbWVudC50b2dnbGVDbGFzcygnZml4ZWQnKTtcbiAgICAgICAgICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ2dtZC1tZW51LXNocmluaycsICRlbGVtZW50Lmhhc0NsYXNzKCdmaXhlZCcpKTtcbiAgICAgICAgfTtcblxuICAgICAgICBjdHJsLnByZXYgPSAoKSA9PiB7XG4gICAgICAgICAgICBjdHJsLm1lbnUgPSBjdHJsLnByZXZpb3VzLnBvcCgpO1xuICAgICAgICAgICAgY3RybC5iYWNrLnBvcCgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGN0cmwubmV4dCA9IChpdGVtKSA9PiB7XG4gICAgICAgICAgICBpZiAoaXRlbS5jaGlsZHJlbiAmJiBpdGVtLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBjdHJsLnByZXZpb3VzLnB1c2goY3RybC5tZW51KTtcbiAgICAgICAgICAgICAgICBjdHJsLm1lbnUgPSBpdGVtLmNoaWxkcmVuO1xuICAgICAgICAgICAgICAgIGN0cmwuYmFjay5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGN0cmwuZ29CYWNrVG9GaXJzdExldmVsID0gKCkgPT4ge1xuICAgICAgICAgICAgY3RybC5tZW51ID0gY3RybC5wcmV2aW91c1swXTtcbiAgICAgICAgICAgIGN0cmwucHJldmlvdXMgPSBbXTtcbiAgICAgICAgICAgIGN0cmwuYmFjayA9IFtdO1xuICAgICAgICB9O1xuXG4gICAgICAgIGN0cmwuYWxsb3cgPSBpdGVtID0+IHtcbiAgICAgICAgICAgIGlmIChjdHJsLmtleXMgJiYgY3RybC5rZXlzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBpZiAoIWl0ZW0ua2V5KSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3RybC5rZXlzLmluZGV4T2YoaXRlbS5rZXkpID4gLTE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICB9XVxufTtcblxuZXhwb3J0IGRlZmF1bHQgQ29tcG9uZW50OyIsInJlcXVpcmUoJy4uL2F0dHJjaGFuZ2UvYXR0cmNoYW5nZScpO1xuXG5sZXQgQ29tcG9uZW50ID0ge1xuICB0cmFuc2NsdWRlOiB0cnVlLFxuICBiaW5kaW5nczoge1xuICAgIG1lbnU6ICc8JyxcbiAgICBrZXlzOiAnPCcsXG4gICAgaGlkZVNlYXJjaDogJz0/JyxcbiAgICBpc09wZW5lZDogJz0/JyxcbiAgICBpY29uRmlyc3RMZXZlbDogJ0A/JyxcbiAgICBzaG93QnV0dG9uRmlyc3RMZXZlbDogJz0/JyxcbiAgICB0ZXh0Rmlyc3RMZXZlbDogJ0A/JyxcbiAgICBkaXNhYmxlQW5pbWF0aW9uczogJz0/JyxcbiAgICBzaHJpbmtNb2RlOiAnPT8nXG4gIH0sXG4gIHRlbXBsYXRlOiBgXG5cbiAgICA8ZGl2IHN0eWxlPVwicGFkZGluZzogMTVweCAxNXB4IDBweCAxNXB4O1wiIG5nLWlmPVwiISRjdHJsLmhpZGVTZWFyY2hcIj5cbiAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGRhdGEtbmctbW9kZWw9XCIkY3RybC5zZWFyY2hcIiBjbGFzcz1cImZvcm0tY29udHJvbCBnbWRcIiBwbGFjZWhvbGRlcj1cIkJ1c2NhLi4uXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwiYmFyXCI+PC9kaXY+XG4gICAgPC9kaXY+XG5cbiAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0IGJ0bi1ibG9jayBnbWRcIiBkYXRhLW5nLWlmPVwiJGN0cmwuc2hvd0J1dHRvbkZpcnN0TGV2ZWxcIiBkYXRhLW5nLWNsaWNrPVwiJGN0cmwuZ29CYWNrVG9GaXJzdExldmVsKClcIiBkYXRhLW5nLWRpc2FibGVkPVwiISRjdHJsLnByZXZpb3VzLmxlbmd0aFwiIHR5cGU9XCJidXR0b25cIj5cbiAgICAgIDxpIGRhdGEtbmctY2xhc3M9XCJbJGN0cmwuaWNvbkZpcnN0TGV2ZWxdXCI+PC9pPlxuICAgICAgPHNwYW4gZGF0YS1uZy1iaW5kPVwiJGN0cmwudGV4dEZpcnN0TGV2ZWxcIj48L3NwYW4+XG4gICAgPC9idXR0b24+XG5cbiAgICA8dWwgbWVudSBkYXRhLW5nLWNsYXNzPVwiJ2xldmVsJy5jb25jYXQoJGN0cmwuYmFjay5sZW5ndGgpXCI+XG4gICAgICA8bGkgY2xhc3M9XCJnb2JhY2sgZ21kIGdtZC1yaXBwbGVcIiBkYXRhLW5nLXNob3c9XCIkY3RybC5wcmV2aW91cy5sZW5ndGggPiAwXCIgZGF0YS1uZy1jbGljaz1cIiRjdHJsLnByZXYoKVwiPlxuICAgICAgICA8YT5cbiAgICAgICAgICA8aSBjbGFzcz1cIm1hdGVyaWFsLWljb25zXCI+XG4gICAgICAgICAgICBrZXlib2FyZF9hcnJvd19sZWZ0XG4gICAgICAgICAgPC9pPlxuICAgICAgICAgIDxzcGFuIGRhdGEtbmctYmluZD1cIiRjdHJsLmJhY2tbJGN0cmwuYmFjay5sZW5ndGggLSAxXS5sYWJlbFwiPjwvc3Bhbj5cbiAgICAgICAgPC9hPlxuICAgICAgPC9saT5cblxuICAgICAgPGxpIGNsYXNzPVwiZ21kIGdtZC1yaXBwbGVcIiBcbiAgICAgICAgICBkYXRhLW5nLXJlcGVhdD1cIml0ZW0gaW4gJGN0cmwubWVudSB8IGZpbHRlcjokY3RybC5zZWFyY2hcIlxuICAgICAgICAgIGRhdGEtbmctc2hvdz1cIiRjdHJsLmFsbG93KGl0ZW0pXCJcbiAgICAgICAgICBuZy1jbGljaz1cIiRjdHJsLm5leHQoaXRlbSwgJGV2ZW50KVwiXG4gICAgICAgICAgZGF0YS1uZy1jbGFzcz1cIlshJGN0cmwuZGlzYWJsZUFuaW1hdGlvbnMgPyAkY3RybC5zbGlkZSA6ICcnLCB7aGVhZGVyOiBpdGVtLnR5cGUgPT0gJ2hlYWRlcicsIGRpdmlkZXI6IGl0ZW0udHlwZSA9PSAnc2VwYXJhdG9yJ31dXCI+XG5cbiAgICAgICAgICA8YSBuZy1pZj1cIml0ZW0udHlwZSAhPSAnc2VwYXJhdG9yJyAmJiBpdGVtLnN0YXRlXCIgdWktc3JlZj1cInt7aXRlbS5zdGF0ZX19XCI+XG4gICAgICAgICAgICA8aSBkYXRhLW5nLWlmPVwiaXRlbS5pY29uXCIgY2xhc3M9XCJtYXRlcmlhbC1pY29uc1wiIGRhdGEtbmctYmluZD1cIml0ZW0uaWNvblwiPjwvaT5cbiAgICAgICAgICAgIDxzcGFuIG5nLWJpbmQ9XCJpdGVtLmxhYmVsXCI+PC9zcGFuPlxuICAgICAgICAgICAgPGkgZGF0YS1uZy1pZj1cIml0ZW0uY2hpbGRyZW5cIiBjbGFzcz1cIm1hdGVyaWFsLWljb25zIHB1bGwtcmlnaHRcIj5cbiAgICAgICAgICAgICAga2V5Ym9hcmRfYXJyb3dfcmlnaHRcbiAgICAgICAgICAgIDwvaT5cbiAgICAgICAgICA8L2E+XG5cbiAgICAgICAgICA8YSBuZy1pZj1cIml0ZW0udHlwZSAhPSAnc2VwYXJhdG9yJyAmJiAhaXRlbS5zdGF0ZVwiPlxuICAgICAgICAgICAgPGkgZGF0YS1uZy1pZj1cIml0ZW0uaWNvblwiIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnNcIiBkYXRhLW5nLWJpbmQ9XCJpdGVtLmljb25cIj48L2k+XG4gICAgICAgICAgICA8c3BhbiBuZy1iaW5kPVwiaXRlbS5sYWJlbFwiPjwvc3Bhbj5cbiAgICAgICAgICAgIDxpIGRhdGEtbmctaWY9XCJpdGVtLmNoaWxkcmVuXCIgY2xhc3M9XCJtYXRlcmlhbC1pY29ucyBwdWxsLXJpZ2h0XCI+XG4gICAgICAgICAgICAgIGtleWJvYXJkX2Fycm93X3JpZ2h0XG4gICAgICAgICAgICA8L2k+XG4gICAgICAgICAgPC9hPlxuXG4gICAgICA8L2xpPlxuICAgIDwvdWw+XG5cbiAgICA8bmctdHJhbnNjbHVkZT48L25nLXRyYW5zY2x1ZGU+XG5cbiAgICA8dWwgY2xhc3M9XCJnbC1tZW51LWNoZXZyb25cIiBuZy1pZj1cIiRjdHJsLnNocmlua01vZGUgJiYgISRjdHJsLmZpeGVkXCIgbmctY2xpY2s9XCIkY3RybC5vcGVuTWVudVNocmluaygpXCI+XG4gICAgICA8bGk+XG4gICAgICAgIDxpIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnNcIj5jaGV2cm9uX2xlZnQ8L2k+XG4gICAgICA8L2xpPlxuICAgIDwvdWw+XG5cbiAgICA8dWwgY2xhc3M9XCJnbC1tZW51LWNoZXZyb24gdW5maXhlZFwiIG5nLWlmPVwiJGN0cmwuc2hyaW5rTW9kZSAmJiAkY3RybC5maXhlZFwiPlxuICAgICAgPGxpIG5nLWNsaWNrPVwiJGN0cmwudW5maXhlZE1lbnVTaHJpbmsoKVwiPlxuICAgICAgICA8aSBjbGFzcz1cIm1hdGVyaWFsLWljb25zXCI+Y2hldnJvbl9sZWZ0PC9pPlxuICAgICAgPC9saT5cbiAgICA8L3VsPlxuXG4gICAgPHVsIGNsYXNzPVwiZ2wtbWVudS1jaGV2cm9uIHBvc3NpYmx5Rml4ZWRcIiBuZy1pZj1cIiRjdHJsLnBvc3NpYmx5Rml4ZWRcIj5cbiAgICAgIDxsaSBuZy1jbGljaz1cIiRjdHJsLmZpeGVkTWVudVNocmluaygpXCIgYWxpZ249XCJjZW50ZXJcIiBzdHlsZT1cImRpc3BsYXk6IGZsZXg7IGp1c3RpZnktY29udGVudDogZmxleC1lbmQ7XCI+XG4gICAgICA8c3ZnIHZlcnNpb249XCIxLjFcIiBpZD1cIkNhcGFfMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIiB4PVwiMHB4XCIgeT1cIjBweFwiXG4gICAgICAgICAgICB3aWR0aD1cIjYxMy40MDhweFwiIHN0eWxlPVwiZGlzcGxheTogaW5saW5lLWJsb2NrOyBwb3NpdGlvbjogcmVsYXRpdmU7IGhlaWdodDogMWVtOyB3aWR0aDogM2VtOyBmb250LXNpemU6IDEuMzNlbTsgcGFkZGluZzogMDsgbWFyZ2luOiAwOztcIiAgaGVpZ2h0PVwiNjEzLjQwOHB4XCIgdmlld0JveD1cIjAgMCA2MTMuNDA4IDYxMy40MDhcIiBzdHlsZT1cImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNjEzLjQwOCA2MTMuNDA4O1wiXG4gICAgICAgICAgICB4bWw6c3BhY2U9XCJwcmVzZXJ2ZVwiPlxuICAgICAgICA8Zz5cbiAgICAgICAgICA8cGF0aCBkPVwiTTYwNS4yNTQsMTY4Ljk0TDQ0My43OTIsNy40NTdjLTYuOTI0LTYuODgyLTE3LjEwMi05LjIzOS0yNi4zMTktNi4wNjljLTkuMTc3LDMuMTI4LTE1LjgwOSwxMS4yNDEtMTcuMDE5LDIwLjg1NVxuICAgICAgICAgICAgbC05LjA5Myw3MC41MTJMMjY3LjU4NSwyMTYuNDI4aC0xNDIuNjVjLTEwLjM0NCwwLTE5LjYyNSw2LjIxNS0yMy42MjksMTUuNzQ2Yy0zLjkyLDkuNTczLTEuNzEsMjAuNTIyLDUuNTg5LDI3Ljc3OVxuICAgICAgICAgICAgbDEwNS40MjQsMTA1LjQwM0wwLjY5OSw2MTMuNDA4bDI0Ni42MzUtMjEyLjg2OWwxMDUuNDIzLDEwNS40MDJjNC44ODEsNC44ODEsMTEuNDUsNy40NjcsMTcuOTk5LDcuNDY3XG4gICAgICAgICAgICBjMy4yOTUsMCw2LjYzMi0wLjcwOSw5Ljc4LTIuMDAyYzkuNTczLTMuOTIyLDE1LjcyNi0xMy4yNDQsMTUuNzI2LTIzLjUwNFYzNDUuMTY4bDEyMy44MzktMTIzLjcxNGw3MC40MjktOS4xNzZcbiAgICAgICAgICAgIGM5LjYxNC0xLjI1MSwxNy43MjctNy44NjIsMjAuODEzLTE3LjAzOUM2MTQuNDcyLDE4Ni4wMjEsNjEyLjEzNiwxNzUuODAxLDYwNS4yNTQsMTY4Ljk0eiBNNTA0Ljg1NiwxNzEuOTg1XG4gICAgICAgICAgICBjLTUuNTY4LDAuNzUxLTEwLjc2MiwzLjIzMi0xNC43NDUsNy4yMzdMMzUyLjc1OCwzMTYuNTk2Yy00Ljc5Niw0Ljc3NS03LjQ2NiwxMS4yNDItNy40NjYsMTguMDQxdjkxLjc0MkwxODYuNDM3LDI2Ny40ODFoOTEuNjhcbiAgICAgICAgICAgIGM2Ljc1NywwLDEzLjI0My0yLjY2OSwxOC4wNC03LjQ2Nkw0MzMuNTEsMTIyLjc2NmMzLjk4My0zLjk4Myw2LjU2OS05LjE3Niw3LjI1OC0xNC43ODZsMy42MjktMjcuNjk2bDg4LjE1NSw4OC4xMTRcbiAgICAgICAgICAgIEw1MDQuODU2LDE3MS45ODV6XCIvPlxuICAgICAgICA8L2c+XG4gICAgICAgIDwvc3ZnPlxuICAgICAgPC9saT5cbiAgICA8L3VsPlxuXG4gIGAsXG4gIGNvbnRyb2xsZXI6IFsnJHRpbWVvdXQnLCAnJGF0dHJzJywgJyRlbGVtZW50JywgZnVuY3Rpb24gKCR0aW1lb3V0LCAkYXR0cnMsICRlbGVtZW50KSB7XG4gICAgbGV0IGN0cmwgPSB0aGlzXG4gICAgY3RybC5rZXlzID0gY3RybC5rZXlzIHx8IFtdO1xuICAgIGN0cmwuaWNvbkZpcnN0TGV2ZWwgPSBjdHJsLmljb25GaXJzdExldmVsIHx8ICdnbHlwaGljb24gZ2x5cGhpY29uLWhvbWUnO1xuICAgIGN0cmwucHJldmlvdXMgPSBbXTtcbiAgICBjdHJsLmJhY2sgPSBbXTtcblxuICAgIGN0cmwuJG9uSW5pdCA9ICgpID0+IHtcbiAgICAgIGN0cmwuZGlzYWJsZUFuaW1hdGlvbnMgPSBjdHJsLmRpc2FibGVBbmltYXRpb25zIHx8IGZhbHNlO1xuXG4gICAgICBjb25zdCBtYWluQ29udGVudCA9IGFuZ3VsYXIuZWxlbWVudCgnLmd1bWdhLWxheW91dCAuZ2wtbWFpbicpO1xuICAgICAgY29uc3QgaGVhZGVyQ29udGVudCA9IGFuZ3VsYXIuZWxlbWVudCgnLmd1bWdhLWxheW91dCAuZ2wtaGVhZGVyJyk7XG5cbiAgICAgIGNvbnN0IHN0cmluZ1RvQm9vbGVhbiA9IChzdHJpbmcpID0+IHtcbiAgICAgICAgc3dpdGNoIChzdHJpbmcudG9Mb3dlckNhc2UoKS50cmltKCkpIHtcbiAgICAgICAgICBjYXNlIFwidHJ1ZVwiOiBjYXNlIFwieWVzXCI6IGNhc2UgXCIxXCI6IHJldHVybiB0cnVlO1xuICAgICAgICAgIGNhc2UgXCJmYWxzZVwiOiBjYXNlIFwibm9cIjogY2FzZSBcIjBcIjogY2FzZSBudWxsOiByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgZGVmYXVsdDogcmV0dXJuIEJvb2xlYW4oc3RyaW5nKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjdHJsLmZpeGVkID0gc3RyaW5nVG9Cb29sZWFuKCRhdHRycy5maXhlZCB8fCAnZmFsc2UnKTtcbiAgICAgIGN0cmwuZml4ZWRNYWluID0gc3RyaW5nVG9Cb29sZWFuKCRhdHRycy5maXhlZE1haW4gfHwgJ2ZhbHNlJyk7XG5cbiAgICAgIGlmIChjdHJsLmZpeGVkTWFpbikge1xuICAgICAgICBjdHJsLmZpeGVkID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgb25CYWNrZHJvcENsaWNrID0gKGV2dCkgPT4ge1xuICAgICAgICBpZihjdHJsLnNocmlua01vZGUpe1xuICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudCgnLmd1bWdhLWxheW91dCBuYXYuZ2wtbmF2JykuYWRkQ2xhc3MoJ2Nsb3NlZCcpO1xuICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudCgnZGl2LmdtZC1tZW51LWJhY2tkcm9wJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQoJy5ndW1nYS1sYXlvdXQgbmF2LmdsLW5hdicpLnJlbW92ZUNsYXNzKCdjb2xsYXBzZWQnKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCBpbml0ID0gKCkgPT4ge1xuICAgICAgICBpZiAoIWN0cmwuZml4ZWQgfHwgY3RybC5zaHJpbmtNb2RlKSB7XG4gICAgICAgICAgbGV0IGVsbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgIGVsbS5jbGFzc0xpc3QuYWRkKCdnbWQtbWVudS1iYWNrZHJvcCcpO1xuICAgICAgICAgIGlmIChhbmd1bGFyLmVsZW1lbnQoJ2Rpdi5nbWQtbWVudS1iYWNrZHJvcCcpLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQoJ2JvZHknKVswXS5hcHBlbmRDaGlsZChlbG0pOyBcbiAgICAgICAgICB9XG4gICAgICAgICAgYW5ndWxhci5lbGVtZW50KCdkaXYuZ21kLW1lbnUtYmFja2Ryb3AnKS5vbignY2xpY2snLCBvbkJhY2tkcm9wQ2xpY2spO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGluaXQoKTtcblxuICAgICAgY29uc3Qgc2V0TWVudVRvcCA9ICgpID0+IHtcbiAgICAgICAgJHRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIGxldCBzaXplID0gYW5ndWxhci5lbGVtZW50KCcuZ3VtZ2EtbGF5b3V0IC5nbC1oZWFkZXInKS5oZWlnaHQoKTtcbiAgICAgICAgICBpZiAoc2l6ZSA9PSAwKSBzZXRNZW51VG9wKCk7XG4gICAgICAgICAgaWYgKGN0cmwuZml4ZWQpIHNpemUgPSAwO1xuICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudCgnLmd1bWdhLWxheW91dCBuYXYuZ2wtbmF2LmNvbGxhcHNlZCcpLmNzcyh7XG4gICAgICAgICAgICB0b3A6IHNpemVcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGN0cmwudG9nZ2xlQ29udGVudCA9IChpc0NvbGxhcHNlZCkgPT4ge1xuICAgICAgICAkdGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgaWYgKGN0cmwuZml4ZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IG1haW5Db250ZW50ID0gYW5ndWxhci5lbGVtZW50KCcuZ3VtZ2EtbGF5b3V0IC5nbC1tYWluJyk7XG4gICAgICAgICAgICBjb25zdCBoZWFkZXJDb250ZW50ID0gYW5ndWxhci5lbGVtZW50KCcuZ3VtZ2EtbGF5b3V0IC5nbC1oZWFkZXInKTtcbiAgICAgICAgICAgIGlmIChpc0NvbGxhcHNlZCkge1xuICAgICAgICAgICAgICBoZWFkZXJDb250ZW50LnJlYWR5KCgpID0+IHtcbiAgICAgICAgICAgICAgICBzZXRNZW51VG9wKCk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaXNDb2xsYXBzZWQgPyBtYWluQ29udGVudC5hZGRDbGFzcygnY29sbGFwc2VkJykgOiBtYWluQ29udGVudC5yZW1vdmVDbGFzcygnY29sbGFwc2VkJyk7XG4gICAgICAgICAgICBpZiAoIWN0cmwuZml4ZWRNYWluICYmIGN0cmwuZml4ZWQpIHtcbiAgICAgICAgICAgICAgaXNDb2xsYXBzZWQgPyBoZWFkZXJDb250ZW50LmFkZENsYXNzKCdjb2xsYXBzZWQnKSA6IGhlYWRlckNvbnRlbnQucmVtb3ZlQ2xhc3MoJ2NvbGxhcHNlZCcpO1xuICAgICAgICAgICAgfSAgICAgICAgICAgIFxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgY29uc3QgdmVyaWZ5QmFja2Ryb3AgPSAoaXNDb2xsYXBzZWQpID0+IHtcbiAgICAgICAgY29uc3QgaGVhZGVyQ29udGVudCA9IGFuZ3VsYXIuZWxlbWVudCgnLmd1bWdhLWxheW91dCAuZ2wtaGVhZGVyJyk7XG4gICAgICAgIGNvbnN0IGJhY2tDb250ZW50ID0gYW5ndWxhci5lbGVtZW50KCdkaXYuZ21kLW1lbnUtYmFja2Ryb3AnKTtcbiAgICAgICAgaWYgKGlzQ29sbGFwc2VkICYmICFjdHJsLmZpeGVkKSB7XG4gICAgICAgICAgYmFja0NvbnRlbnQuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgIGxldCBzaXplID0gaGVhZGVyQ29udGVudC5oZWlnaHQoKTtcbiAgICAgICAgICBpZiAoc2l6ZSA+IDAgJiYgIWN0cmwuc2hyaW5rTW9kZSkge1xuICAgICAgICAgICAgYmFja0NvbnRlbnQuY3NzKHsgdG9wOiBzaXplIH0pO1xuICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgYmFja0NvbnRlbnQuY3NzKHsgdG9wOiAwIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBiYWNrQ29udGVudC5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIH1cbiAgICAgICAgJHRpbWVvdXQoKCkgPT4gY3RybC5pc09wZW5lZCA9IGlzQ29sbGFwc2VkKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGN0cmwuc2hyaW5rTW9kZSkge1xuICAgICAgICBjb25zdCBtYWluQ29udGVudCA9IGFuZ3VsYXIuZWxlbWVudCgnLmd1bWdhLWxheW91dCAuZ2wtbWFpbicpO1xuICAgICAgICBjb25zdCBoZWFkZXJDb250ZW50ID0gYW5ndWxhci5lbGVtZW50KCcuZ3VtZ2EtbGF5b3V0IC5nbC1oZWFkZXInKTtcbiAgICAgICAgY29uc3QgbmF2Q29udGVudCA9IGFuZ3VsYXIuZWxlbWVudCgnLmd1bWdhLWxheW91dCBuYXYuZ2wtbmF2Jyk7XG4gICAgICAgIG1haW5Db250ZW50LmNzcyh7J21hcmdpbi1sZWZ0JzogJzY0cHgnfSk7XG4gICAgICAgIGhlYWRlckNvbnRlbnQuY3NzKHsnbWFyZ2luLWxlZnQnOiAnNjRweCd9KTtcbiAgICAgICAgbmF2Q29udGVudC5jc3MoeyAnei1pbmRleCc6ICcxMDA2J30pO1xuICAgICAgICBhbmd1bGFyLmVsZW1lbnQoXCJuYXYuZ2wtbmF2XCIpLmFkZENsYXNzKCdjbG9zZWQgY29sbGFwc2VkJyk7XG4gICAgICAgIHZlcmlmeUJhY2tkcm9wKCFhbmd1bGFyLmVsZW1lbnQoJ25hdi5nbC1uYXYnKS5oYXNDbGFzcygnY2xvc2VkJykpO1xuICAgICAgfVxuXG4gICAgICBpZiAoYW5ndWxhci5lbGVtZW50LmZuLmF0dHJjaGFuZ2UpIHtcbiAgICAgICAgYW5ndWxhci5lbGVtZW50KFwibmF2LmdsLW5hdlwiKS5hdHRyY2hhbmdlKHtcbiAgICAgICAgICB0cmFja1ZhbHVlczogdHJ1ZSxcbiAgICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24gKGV2bnQpIHtcbiAgICAgICAgICAgIGlmIChldm50LmF0dHJpYnV0ZU5hbWUgPT0gJ2NsYXNzJykge1xuICAgICAgICAgICAgICBpZihjdHJsLnNocmlua01vZGUpe1xuICAgICAgICAgICAgICAgIGN0cmwucG9zc2libHlGaXhlZCA9IGV2bnQubmV3VmFsdWUuaW5kZXhPZignY2xvc2VkJykgPT0gLTE7XG4gICAgICAgICAgICAgICAgdmVyaWZ5QmFja2Ryb3AoY3RybC5wb3NzaWJseUZpeGVkKTtcbiAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgY3RybC50b2dnbGVDb250ZW50KGV2bnQubmV3VmFsdWUuaW5kZXhPZignY29sbGFwc2VkJykgIT0gLTEpO1xuICAgICAgICAgICAgICAgIHZlcmlmeUJhY2tkcm9wKGV2bnQubmV3VmFsdWUuaW5kZXhPZignY29sbGFwc2VkJykgIT0gLTEpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKCFjdHJsLnNocmlua01vZGUpIHtcbiAgICAgICAgICBjdHJsLnRvZ2dsZUNvbnRlbnQoYW5ndWxhci5lbGVtZW50KCduYXYuZ2wtbmF2JykuaGFzQ2xhc3MoJ2NvbGxhcHNlZCcpKTtcbiAgICAgICAgICB2ZXJpZnlCYWNrZHJvcChhbmd1bGFyLmVsZW1lbnQoJ25hdi5nbC1uYXYnKS5oYXNDbGFzcygnY29sbGFwc2VkJykpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGN0cmwuJG9uSW5pdCA9ICgpID0+IHtcbiAgICAgICAgaWYgKCFjdHJsLmhhc093blByb3BlcnR5KCdzaG93QnV0dG9uRmlyc3RMZXZlbCcpKSB7XG4gICAgICAgICAgY3RybC5zaG93QnV0dG9uRmlyc3RMZXZlbCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY3RybC5wcmV2ID0gKCkgPT4ge1xuICAgICAgICAkdGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgLy8gY3RybC5zbGlkZSA9ICdzbGlkZS1pbi1sZWZ0JztcbiAgICAgICAgICBjdHJsLm1lbnUgPSBjdHJsLnByZXZpb3VzLnBvcCgpO1xuICAgICAgICAgIGN0cmwuYmFjay5wb3AoKTtcbiAgICAgICAgfSwgMjUwKTtcbiAgICAgIH1cblxuICAgICAgY3RybC5uZXh0ID0gKGl0ZW0pID0+IHtcbiAgICAgICAgbGV0IG5hdiA9IGFuZ3VsYXIuZWxlbWVudCgnbmF2LmdsLW5hdicpWzBdO1xuICAgICAgICBpZiAoY3RybC5zaHJpbmtNb2RlICYmIG5hdi5jbGFzc0xpc3QuY29udGFpbnMoJ2Nsb3NlZCcpICYmIGl0ZW0uY2hpbGRyZW4gJiYgYW5ndWxhci5lbGVtZW50KCcuZ3VtZ2EtbGF5b3V0IG5hdi5nbC1uYXYnKS5pcygnW29wZW4tb24taG92ZXJdJykpIHtcbiAgICAgICAgICBjdHJsLm9wZW5NZW51U2hyaW5rKCk7XG4gICAgICAgICAgY3RybC5uZXh0KGl0ZW0pO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAkdGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgaWYgKGl0ZW0uY2hpbGRyZW4pIHtcbiAgICAgICAgICAgIC8vIGN0cmwuc2xpZGUgPSAnc2xpZGUtaW4tcmlnaHQnO1xuICAgICAgICAgICAgY3RybC5wcmV2aW91cy5wdXNoKGN0cmwubWVudSk7XG4gICAgICAgICAgICBjdHJsLm1lbnUgPSBpdGVtLmNoaWxkcmVuO1xuICAgICAgICAgICAgY3RybC5iYWNrLnB1c2goaXRlbSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCAyNTApO1xuICAgICAgfVxuXG4gICAgICBjdHJsLmdvQmFja1RvRmlyc3RMZXZlbCA9ICgpID0+IHtcbiAgICAgICAgLy8gY3RybC5zbGlkZSA9ICdzbGlkZS1pbi1sZWZ0J1xuICAgICAgICBjdHJsLm1lbnUgPSBjdHJsLnByZXZpb3VzWzBdXG4gICAgICAgIGN0cmwucHJldmlvdXMgPSBbXVxuICAgICAgICBjdHJsLmJhY2sgPSBbXVxuICAgICAgfVxuXG4gICAgICBjdHJsLmFsbG93ID0gaXRlbSA9PiB7XG4gICAgICAgIGlmIChjdHJsLmtleXMgJiYgY3RybC5rZXlzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBpZiAoIWl0ZW0ua2V5KSByZXR1cm4gdHJ1ZVxuICAgICAgICAgIHJldHVybiBjdHJsLmtleXMuaW5kZXhPZihpdGVtLmtleSkgPiAtMVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIGN0cmwuc2xpZGUgPSAnc2xpZGUtaW4tbGVmdCc7XG5cbiAgICAgIGN0cmwub3Blbk1lbnVTaHJpbmsgPSAoKSA9PiB7XG4gICAgICAgIGN0cmwucG9zc2libHlGaXhlZCA9IHRydWU7IFxuICAgICAgICBhbmd1bGFyLmVsZW1lbnQoJy5ndW1nYS1sYXlvdXQgbmF2LmdsLW5hdicpLnJlbW92ZUNsYXNzKCdjbG9zZWQnKTtcbiAgICAgIH1cblxuICAgICAgY3RybC5maXhlZE1lbnVTaHJpbmsgPSAoKSA9PiB7XG4gICAgICAgICRlbGVtZW50LmF0dHIoJ2ZpeGVkJywgdHJ1ZSk7XG4gICAgICAgIGN0cmwuZml4ZWQgPSB0cnVlO1xuICAgICAgICBjdHJsLnBvc3NpYmx5Rml4ZWQgPSBmYWxzZTtcbiAgICAgICAgaW5pdCgpO1xuICAgICAgICBtYWluQ29udGVudC5jc3MoeydtYXJnaW4tbGVmdCc6ICcnfSk7XG4gICAgICAgIGhlYWRlckNvbnRlbnQuY3NzKHsnbWFyZ2luLWxlZnQnOiAnJ30pO1xuICAgICAgICBjdHJsLnRvZ2dsZUNvbnRlbnQodHJ1ZSk7XG4gICAgICAgIHZlcmlmeUJhY2tkcm9wKHRydWUpO1xuICAgICAgfVxuXG4gICAgICBjdHJsLnVuZml4ZWRNZW51U2hyaW5rID0gKCkgPT4ge1xuICAgICAgICAkZWxlbWVudC5hdHRyKCdmaXhlZCcsIGZhbHNlKTtcbiAgICAgICAgY3RybC5maXhlZCA9IGZhbHNlO1xuICAgICAgICBjdHJsLnBvc3NpYmx5Rml4ZWQgPSB0cnVlO1xuICAgICAgICBpbml0KCk7XG4gICAgICAgIG1haW5Db250ZW50LmNzcyh7J21hcmdpbi1sZWZ0JzogJzY0cHgnfSk7XG4gICAgICAgIGhlYWRlckNvbnRlbnQuY3NzKHsnbWFyZ2luLWxlZnQnOiAnNjRweCd9KTtcbiAgICAgICAgdmVyaWZ5QmFja2Ryb3AodHJ1ZSk7XG4gICAgICAgIGFuZ3VsYXIuZWxlbWVudCgnLmd1bWdhLWxheW91dCBuYXYuZ2wtbmF2JykuYWRkQ2xhc3MoJ2Nsb3NlZCcpO1xuICAgICAgfVxuXG4gICAgfVxuXG4gIH1dXG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvbmVudFxuIiwibGV0IENvbXBvbmVudCA9IHtcbiAgYmluZGluZ3M6IHtcbiAgICBpY29uOiAnQCcsXG4gICAgbm90aWZpY2F0aW9uczogJz0nLFxuICAgIG9uVmlldzogJyY/J1xuICB9LFxuICB0ZW1wbGF0ZTogYFxuICAgIDx1bCBjbGFzcz1cIm5hdiBuYXZiYXItbmF2IG5hdmJhci1yaWdodCBub3RpZmljYXRpb25zXCI+XG4gICAgICA8bGkgY2xhc3M9XCJkcm9wZG93blwiPlxuICAgICAgICA8YSBocmVmPVwiI1wiIGJhZGdlPVwie3skY3RybC5ub3RpZmljYXRpb25zLmxlbmd0aH19XCIgY2xhc3M9XCJkcm9wZG93bi10b2dnbGVcIiBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCIgcm9sZT1cImJ1dHRvblwiIGFyaWEtaGFzcG9wdXA9XCJ0cnVlXCIgYXJpYS1leHBhbmRlZD1cImZhbHNlXCI+XG4gICAgICAgICAgPGkgY2xhc3M9XCJtYXRlcmlhbC1pY29uc1wiIGRhdGEtbmctYmluZD1cIiRjdHJsLmljb25cIj48L2k+XG4gICAgICAgIDwvYT5cbiAgICAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudVwiPlxuICAgICAgICAgIDxsaSBkYXRhLW5nLXJlcGVhdD1cIml0ZW0gaW4gJGN0cmwubm90aWZpY2F0aW9uc1wiIGRhdGEtbmctY2xpY2s9XCIkY3RybC52aWV3KCRldmVudCwgaXRlbSlcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtZWRpYVwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWVkaWEtbGVmdFwiPlxuICAgICAgICAgICAgICAgIDxpbWcgY2xhc3M9XCJtZWRpYS1vYmplY3RcIiBkYXRhLW5nLXNyYz1cInt7aXRlbS5pbWFnZX19XCI+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWVkaWEtYm9keVwiIGRhdGEtbmctYmluZD1cIml0ZW0uY29udGVudFwiPjwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9saT5cbiAgICAgICAgPC91bD5cbiAgICAgIDwvbGk+XG4gICAgPC91bD5cbiAgYCxcbiAgY29udHJvbGxlcjogZnVuY3Rpb24oKSB7XG4gICAgbGV0IGN0cmwgPSB0aGlzXG5cbiAgICBjdHJsLiRvbkluaXQgPSAoKSA9PiB7XG4gICAgICBjdHJsLnZpZXcgPSAoZXZlbnQsIGl0ZW0pID0+IGN0cmwub25WaWV3KHtldmVudDogZXZlbnQsIGl0ZW06IGl0ZW19KVxuICAgIH1cbiAgICBcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnRcbiIsImxldCBDb21wb25lbnQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0MnLFxuICAgIGxpbms6IGZ1bmN0aW9uKCRzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgIGlmKCFlbGVtZW50WzBdLmNsYXNzTGlzdC5jb250YWlucygnZml4ZWQnKSl7XG4gICAgICAgIGVsZW1lbnRbMF0uc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnXG4gICAgICB9XG4gICAgICBlbGVtZW50WzBdLnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbidcbiAgICAgIGVsZW1lbnRbMF0uc3R5bGUudXNlclNlbGVjdCA9ICdub25lJ1xuXG4gICAgICBlbGVtZW50WzBdLnN0eWxlLm1zVXNlclNlbGVjdCA9ICdub25lJ1xuICAgICAgZWxlbWVudFswXS5zdHlsZS5tb3pVc2VyU2VsZWN0ID0gJ25vbmUnXG4gICAgICBlbGVtZW50WzBdLnN0eWxlLndlYmtpdFVzZXJTZWxlY3QgPSAnbm9uZSdcblxuICAgICAgZnVuY3Rpb24gY3JlYXRlUmlwcGxlKGV2dCkge1xuICAgICAgICB2YXIgcmlwcGxlID0gYW5ndWxhci5lbGVtZW50KCc8c3BhbiBjbGFzcz1cImdtZC1yaXBwbGUtZWZmZWN0IGFuaW1hdGVcIj4nKSxcbiAgICAgICAgICByZWN0ID0gZWxlbWVudFswXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxcbiAgICAgICAgICByYWRpdXMgPSBNYXRoLm1heChyZWN0LmhlaWdodCwgcmVjdC53aWR0aCksXG4gICAgICAgICAgbGVmdCA9IGV2dC5wYWdlWCAtIHJlY3QubGVmdCAtIHJhZGl1cyAvIDIgLSBkb2N1bWVudC5ib2R5LnNjcm9sbExlZnQsXG4gICAgICAgICAgdG9wID0gZXZ0LnBhZ2VZIC0gcmVjdC50b3AgLSByYWRpdXMgLyAyIC0gZG9jdW1lbnQuYm9keS5zY3JvbGxUb3A7XG5cbiAgICAgICAgcmlwcGxlWzBdLnN0eWxlLndpZHRoID0gcmlwcGxlWzBdLnN0eWxlLmhlaWdodCA9IHJhZGl1cyArICdweCc7XG4gICAgICAgIHJpcHBsZVswXS5zdHlsZS5sZWZ0ID0gbGVmdCArICdweCc7XG4gICAgICAgIHJpcHBsZVswXS5zdHlsZS50b3AgPSB0b3AgKyAncHgnO1xuICAgICAgICByaXBwbGUub24oJ2FuaW1hdGlvbmVuZCB3ZWJraXRBbmltYXRpb25FbmQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQodGhpcykucmVtb3ZlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGVsZW1lbnQuYXBwZW5kKHJpcHBsZSk7XG4gICAgICB9XG5cbiAgICAgIGVsZW1lbnQuYmluZCgnbW91c2Vkb3duJywgY3JlYXRlUmlwcGxlKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29tcG9uZW50XG4iLCJsZXQgQ29tcG9uZW50ID0ge1xuICByZXF1aXJlOiBbJ25nTW9kZWwnLCduZ1JlcXVpcmVkJ10sXG4gIHRyYW5zY2x1ZGU6IHRydWUsXG4gIGJpbmRpbmdzOiB7XG4gICAgbmdNb2RlbDogJz0nLFxuICAgIG5nRGlzYWJsZWQ6ICc9PycsXG4gICAgdW5zZWxlY3Q6ICdAPycsXG4gICAgb3B0aW9uczogJzwnLFxuICAgIG9wdGlvbjogJ0AnLFxuICAgIHZhbHVlOiAnQCcsXG4gICAgcGxhY2Vob2xkZXI6ICdAPycsXG4gICAgb25DaGFuZ2U6IFwiJj9cIixcbiAgICB0cmFuc2xhdGVMYWJlbDogJz0/J1xuICB9LFxuICB0ZW1wbGF0ZTogYFxuICA8ZGl2IGNsYXNzPVwiZHJvcGRvd24gZ21kXCI+XG4gICAgIDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWwgZmxvYXRpbmctZHJvcGRvd25cIiBuZy1zaG93PVwiJGN0cmwuc2VsZWN0ZWRcIj5cbiAgICAgIHt7JGN0cmwucGxhY2Vob2xkZXJ9fSA8c3BhbiBuZy1pZj1cIiRjdHJsLnZhbGlkYXRlR3VtZ2FFcnJvclwiIG5nLWNsYXNzPVwieydnbWQtc2VsZWN0LXJlcXVpcmVkJzogJGN0cmwubmdNb2RlbEN0cmwuJGVycm9yLnJlcXVpcmVkfVwiPio8c3Bhbj5cbiAgICAgPC9sYWJlbD5cbiAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdCBnbWQgZHJvcGRvd24tdG9nZ2xlIGdtZC1zZWxlY3QtYnV0dG9uXCJcbiAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICBzdHlsZT1cImJvcmRlci1yYWRpdXM6IDA7XCJcbiAgICAgICAgICAgICBpZD1cImdtZFNlbGVjdFwiXG4gICAgICAgICAgICAgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiXG4gICAgICAgICAgICAgbmctZGlzYWJsZWQ9XCIkY3RybC5uZ0Rpc2FibGVkXCJcbiAgICAgICAgICAgICBhcmlhLWhhc3BvcHVwPVwidHJ1ZVwiXG4gICAgICAgICAgICAgYXJpYS1leHBhbmRlZD1cInRydWVcIj5cbiAgICAgICA8c3BhbiBjbGFzcz1cIml0ZW0tc2VsZWN0XCIgbmctaWY9XCIhJGN0cmwudHJhbnNsYXRlTGFiZWxcIiBkYXRhLW5nLXNob3c9XCIkY3RybC5zZWxlY3RlZFwiIGRhdGEtbmctYmluZD1cIiRjdHJsLnNlbGVjdGVkXCI+PC9zcGFuPlxuICAgICAgIDxzcGFuIGNsYXNzPVwiaXRlbS1zZWxlY3RcIiBuZy1pZj1cIiRjdHJsLnRyYW5zbGF0ZUxhYmVsXCIgZGF0YS1uZy1zaG93PVwiJGN0cmwuc2VsZWN0ZWRcIj5cbiAgICAgICAgICB7eyAkY3RybC5zZWxlY3RlZCB8IGd1bWdhVHJhbnNsYXRlIH19XG4gICAgICAgPC9zcGFuPlxuICAgICAgIDxzcGFuIGRhdGEtbmctaGlkZT1cIiRjdHJsLnNlbGVjdGVkXCIgY2xhc3M9XCJpdGVtLXNlbGVjdCBwbGFjZWhvbGRlclwiPlxuICAgICAgICB7eyRjdHJsLnBsYWNlaG9sZGVyfX1cbiAgICAgICA8L3NwYW4+XG4gICAgICAgPHNwYW4gbmctaWY9XCIkY3RybC5uZ01vZGVsQ3RybC4kZXJyb3IucmVxdWlyZWQgJiYgJGN0cmwudmFsaWRhdGVHdW1nYUVycm9yXCIgY2xhc3M9XCJ3b3JkLXJlcXVpcmVkXCI+Kjwvc3Bhbj5cbiAgICAgICA8c3BhbiBjbGFzcz1cImNhcmV0XCI+PC9zcGFuPlxuICAgICA8L2J1dHRvbj5cbiAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudVwiIGFyaWEtbGFiZWxsZWRieT1cImdtZFNlbGVjdFwiIG5nLXNob3c9XCIkY3RybC5vcHRpb25cIiBzdHlsZT1cImRpc3BsYXk6IG5vbmU7XCI+XG4gICAgICAgPGxpIGRhdGEtbmctY2xpY2s9XCIkY3RybC5jbGVhcigpXCIgbmctaWY9XCIkY3RybC51bnNlbGVjdFwiPlxuICAgICAgICAgPGEgZGF0YS1uZy1jbGFzcz1cInthY3RpdmU6IGZhbHNlfVwiPnt7JGN0cmwudW5zZWxlY3R9fTwvYT5cbiAgICAgICA8L2xpPlxuICAgICAgIDxsaSBkYXRhLW5nLXJlcGVhdD1cIm9wdGlvbiBpbiAkY3RybC5vcHRpb25zIHRyYWNrIGJ5ICRpbmRleFwiPlxuICAgICAgICAgPGEgY2xhc3M9XCJzZWxlY3Qtb3B0aW9uXCIgZGF0YS1uZy1jbGljaz1cIiRjdHJsLnNlbGVjdChvcHRpb24pXCIgZGF0YS1uZy1iaW5kPVwib3B0aW9uWyRjdHJsLm9wdGlvbl0gfHwgb3B0aW9uXCIgZGF0YS1uZy1jbGFzcz1cInthY3RpdmU6ICRjdHJsLmlzQWN0aXZlKG9wdGlvbil9XCI+PC9hPlxuICAgICAgIDwvbGk+XG4gICAgIDwvdWw+XG4gICAgIDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnUgZ21kXCIgYXJpYS1sYWJlbGxlZGJ5PVwiZ21kU2VsZWN0XCIgbmctc2hvdz1cIiEkY3RybC5vcHRpb25cIiBzdHlsZT1cIm1heC1oZWlnaHQ6IDI1MHB4O292ZXJmbG93OiBhdXRvO2Rpc3BsYXk6IG5vbmU7XCIgbmctdHJhbnNjbHVkZT48L3VsPlxuICAgPC9kaXY+XG4gIGAsXG4gIGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGF0dHJzJywnJHRpbWVvdXQnLCckZWxlbWVudCcsICckdHJhbnNjbHVkZScsICckY29tcGlsZScsIGZ1bmN0aW9uKCRzY29wZSwkYXR0cnMsJHRpbWVvdXQsJGVsZW1lbnQsJHRyYW5zY2x1ZGUsICRjb21waWxlKSB7XG4gICAgbGV0IGN0cmwgPSB0aGlzXG4gICAgLCAgIG5nTW9kZWxDdHJsID0gJGVsZW1lbnQuY29udHJvbGxlcignbmdNb2RlbCcpO1xuXG4gICAgbGV0IG9wdGlvbnMgPSBjdHJsLm9wdGlvbnMgfHwgW107XG5cbiAgICBjdHJsLm5nTW9kZWxDdHJsICAgICAgICA9IG5nTW9kZWxDdHJsO1xuICAgIGN0cmwudmFsaWRhdGVHdW1nYUVycm9yID0gJGF0dHJzLmhhc093blByb3BlcnR5KCdndW1nYVJlcXVpcmVkJyk7XG5cbiAgICBmdW5jdGlvbiBmaW5kUGFyZW50QnlOYW1lKGVsbSwgcGFyZW50TmFtZSl7XG4gICAgICBpZihlbG0uY2xhc3NOYW1lID09IHBhcmVudE5hbWUpe1xuICAgICAgICByZXR1cm4gZWxtO1xuICAgICAgfVxuICAgICAgaWYoZWxtLnBhcmVudE5vZGUpe1xuICAgICAgICByZXR1cm4gZmluZFBhcmVudEJ5TmFtZShlbG0ucGFyZW50Tm9kZSwgcGFyZW50TmFtZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZWxtO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHByZXZlbnREZWZhdWx0KGUpIHtcbiAgICAgIGUgPSBlIHx8IHdpbmRvdy5ldmVudDtcbiAgICAgIGxldCB0YXJnZXQgPSBmaW5kUGFyZW50QnlOYW1lKGUudGFyZ2V0LCAnc2VsZWN0LW9wdGlvbicpO1xuICAgICAgaWYoKHRhcmdldC5ub2RlTmFtZSA9PSAnQScgJiYgdGFyZ2V0LmNsYXNzTmFtZSA9PSAnc2VsZWN0LW9wdGlvbicpIHx8IChlLnRhcmdldC5ub2RlTmFtZSA9PSAnQScgJiYgZS50YXJnZXQuY2xhc3NOYW1lID09ICdzZWxlY3Qtb3B0aW9uJykpe1xuICAgICAgICBsZXQgZGlyZWN0aW9uID0gZmluZFNjcm9sbERpcmVjdGlvbk90aGVyQnJvd3NlcnMoZSlcbiAgICAgICAgbGV0IHNjcm9sbFRvcCA9IGFuZ3VsYXIuZWxlbWVudCh0YXJnZXQucGFyZW50Tm9kZS5wYXJlbnROb2RlKS5zY3JvbGxUb3AoKTtcbiAgICAgICAgaWYoc2Nyb2xsVG9wICsgYW5ndWxhci5lbGVtZW50KHRhcmdldC5wYXJlbnROb2RlLnBhcmVudE5vZGUpLmlubmVySGVpZ2h0KCkgPj0gdGFyZ2V0LnBhcmVudE5vZGUucGFyZW50Tm9kZS5zY3JvbGxIZWlnaHQgJiYgZGlyZWN0aW9uICE9ICdVUCcpe1xuICAgICAgICAgIGlmIChlLnByZXZlbnREZWZhdWx0KVxuICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgZS5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xuICAgICAgICB9ZWxzZSBpZihzY3JvbGxUb3AgPD0gMCAgJiYgZGlyZWN0aW9uICE9ICdET1dOJyl7XG4gICAgICAgICAgaWYgKGUucHJldmVudERlZmF1bHQpXG4gICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICBlLnJldHVyblZhbHVlID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZS5yZXR1cm5WYWx1ZSA9IHRydWU7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9ZWxzZXtcbiAgICAgICAgaWYgKGUucHJldmVudERlZmF1bHQpXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGUucmV0dXJuVmFsdWUgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmaW5kU2Nyb2xsRGlyZWN0aW9uT3RoZXJCcm93c2VycyhldmVudCl7XG4gICAgICB2YXIgZGVsdGE7XG4gICAgICBpZiAoZXZlbnQud2hlZWxEZWx0YSl7XG4gICAgICAgIGRlbHRhID0gZXZlbnQud2hlZWxEZWx0YTtcbiAgICAgIH1lbHNle1xuICAgICAgICBkZWx0YSA9IC0xICpldmVudC5kZWx0YVk7XG4gICAgICB9XG4gICAgICBpZiAoZGVsdGEgPCAwKXtcbiAgICAgICAgcmV0dXJuIFwiRE9XTlwiO1xuICAgICAgfWVsc2UgaWYgKGRlbHRhID4gMCl7XG4gICAgICAgIHJldHVybiBcIlVQXCI7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcHJldmVudERlZmF1bHRGb3JTY3JvbGxLZXlzKGUpIHtcbiAgICAgICAgaWYgKGtleXMgJiYga2V5c1tlLmtleUNvZGVdKSB7XG4gICAgICAgICAgICBwcmV2ZW50RGVmYXVsdChlKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmNsZWFyKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGlzYWJsZVNjcm9sbCgpIHtcbiAgICAgIGlmICh3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcil7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBwcmV2ZW50RGVmYXVsdCwgZmFsc2UpO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignRE9NTW91c2VTY3JvbGwnLCBwcmV2ZW50RGVmYXVsdCwgZmFsc2UpO1xuICAgICAgfVxuICAgICAgd2luZG93Lm9ud2hlZWwgPSBwcmV2ZW50RGVmYXVsdDsgLy8gbW9kZXJuIHN0YW5kYXJkXG4gICAgICB3aW5kb3cub25tb3VzZXdoZWVsID0gZG9jdW1lbnQub25tb3VzZXdoZWVsID0gcHJldmVudERlZmF1bHQ7IC8vIG9sZGVyIGJyb3dzZXJzLCBJRVxuICAgICAgd2luZG93Lm9udG91Y2htb3ZlICA9IHByZXZlbnREZWZhdWx0OyAvLyBtb2JpbGVcbiAgICAgIGRvY3VtZW50Lm9ua2V5ZG93biAgPSBwcmV2ZW50RGVmYXVsdEZvclNjcm9sbEtleXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZW5hYmxlU2Nyb2xsKCkge1xuICAgICAgICBpZiAod2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIpXG4gICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignRE9NTW91c2VTY3JvbGwnLCBwcmV2ZW50RGVmYXVsdCwgZmFsc2UpO1xuICAgICAgICB3aW5kb3cub25tb3VzZXdoZWVsID0gZG9jdW1lbnQub25tb3VzZXdoZWVsID0gbnVsbDtcbiAgICAgICAgd2luZG93Lm9ud2hlZWwgPSBudWxsO1xuICAgICAgICB3aW5kb3cub250b3VjaG1vdmUgPSBudWxsO1xuICAgICAgICBkb2N1bWVudC5vbmtleWRvd24gPSBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGdldE9mZnNldCA9IGVsID0+IHtcbiAgICAgICAgdmFyIHJlY3QgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxcbiAgICAgICAgc2Nyb2xsTGVmdCA9IHdpbmRvdy5wYWdlWE9mZnNldCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsTGVmdCxcbiAgICAgICAgc2Nyb2xsVG9wID0gd2luZG93LnBhZ2VZT2Zmc2V0IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3A7XG4gICAgICAgIGxldCBfeCA9IDAsIF95ID0gMDtcbiAgICAgICAgd2hpbGUoIGVsICYmICFpc05hTiggZWwub2Zmc2V0TGVmdCApICYmICFpc05hTiggZWwub2Zmc2V0VG9wICkgKSB7XG4gICAgICAgICAgICBfeCArPSBlbC5vZmZzZXRMZWZ0IC0gZWwuc2Nyb2xsTGVmdDsgICAgICAgICAgICBcbiAgICAgICAgICAgIGlmKGVsLm5vZGVOYW1lID09ICdCT0RZJyl7XG4gICAgICAgICAgICAgIF95ICs9IGVsLm9mZnNldFRvcCAtIE1hdGgubWF4KCBhbmd1bGFyLmVsZW1lbnQoXCJodG1sXCIpLnNjcm9sbFRvcCgpLCBhbmd1bGFyLmVsZW1lbnQoXCJib2R5XCIpLnNjcm9sbFRvcCgpICk7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgX3kgKz0gZWwub2Zmc2V0VG9wIC0gZWwuc2Nyb2xsVG9wO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWwgPSBlbC5vZmZzZXRQYXJlbnQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHsgdG9wOiBfeSwgbGVmdDogcmVjdC5sZWZ0ICsgc2Nyb2xsTGVmdCB9XG4gICAgfVxuXG4gICAgY29uc3QgZ2V0RWxlbWVudE1heEhlaWdodCA9IChlbG0pID0+IHtcbiAgICAgIHZhciBzY3JvbGxQb3NpdGlvbiA9IE1hdGgubWF4KCBhbmd1bGFyLmVsZW1lbnQoXCJodG1sXCIpLnNjcm9sbFRvcCgpLCBhbmd1bGFyLmVsZW1lbnQoXCJib2R5XCIpLnNjcm9sbFRvcCgpICk7XG4gICAgICB2YXIgZWxlbWVudE9mZnNldCA9IGVsbS5vZmZzZXQoKS50b3A7XG4gICAgICB2YXIgZWxlbWVudERpc3RhbmNlID0gKGVsZW1lbnRPZmZzZXQgLSBzY3JvbGxQb3NpdGlvbik7XG4gICAgICB2YXIgd2luZG93SGVpZ2h0ID0gYW5ndWxhci5lbGVtZW50KHdpbmRvdykuaGVpZ2h0KCk7XG4gICAgICByZXR1cm4gd2luZG93SGVpZ2h0IC0gZWxlbWVudERpc3RhbmNlO1xuICAgIH1cblxuICAgIGNvbnN0IGhhbmRsaW5nRWxlbWVudFN0eWxlID0gKCRlbGVtZW50LCB1bHMpID0+IHtcbiAgICAgIGxldCBTSVpFX0JPVFRPTV9ESVNUQU5DRSA9IDU7XG4gICAgICBsZXQgcG9zaXRpb24gPSBnZXRPZmZzZXQoJGVsZW1lbnRbMF0pO1xuXG4gICAgICBhbmd1bGFyLmZvckVhY2godWxzLCB1bCA9PiB7XG4gICAgICAgIGlmKGFuZ3VsYXIuZWxlbWVudCh1bCkuaGVpZ2h0KCkgPT0gMCkgcmV0dXJuO1xuICAgICAgICBsZXQgbWF4SGVpZ2h0ID0gZ2V0RWxlbWVudE1heEhlaWdodChhbmd1bGFyLmVsZW1lbnQoJGVsZW1lbnRbMF0pKTtcbiAgICAgICAgaWYoYW5ndWxhci5lbGVtZW50KHVsKS5oZWlnaHQoKSA+IG1heEhlaWdodCl7XG4gICAgICAgICAgYW5ndWxhci5lbGVtZW50KHVsKS5jc3Moe1xuICAgICAgICAgICAgaGVpZ2h0OiBtYXhIZWlnaHQgLSBTSVpFX0JPVFRPTV9ESVNUQU5DRSArICdweCdcbiAgICAgICAgICB9KTtcbiAgICAgICAgfWVsc2UgaWYoYW5ndWxhci5lbGVtZW50KHVsKS5oZWlnaHQoKSAhPSAobWF4SGVpZ2h0IC1TSVpFX0JPVFRPTV9ESVNUQU5DRSkpe1xuICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudCh1bCkuY3NzKHtcbiAgICAgICAgICAgIGhlaWdodDogJ2F1dG8nXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBhbmd1bGFyLmVsZW1lbnQodWwpLmNzcyh7XG4gICAgICAgICAgZGlzcGxheTogJ2Jsb2NrJyxcbiAgICAgICAgICBwb3NpdGlvbjogJ2ZpeGVkJyxcbiAgICAgICAgICBsZWZ0OiBwb3NpdGlvbi5sZWZ0LTEgKyAncHgnLFxuICAgICAgICAgIHRvcDogcG9zaXRpb24udG9wLTIgKyAncHgnLFxuICAgICAgICAgIHdpZHRoOiAkZWxlbWVudC5maW5kKCdkaXYuZHJvcGRvd24nKVswXS5jbGllbnRXaWR0aCArIDFcbiAgICAgICAgfSk7XG5cblxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgaGFuZGxpbmdFbGVtZW50SW5Cb2R5ID0gKGVsbSwgdWxzKSA9PiB7XG4gICAgICB2YXIgYm9keSA9IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudCkuZmluZCgnYm9keScpLmVxKDApO1xuICAgICAgbGV0IGRpdiA9IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSk7XG4gICAgICBkaXYuYWRkQ2xhc3MoXCJkcm9wZG93biBnbWRcIik7XG4gICAgICBkaXYuYXBwZW5kKHVscyk7XG4gICAgICBib2R5LmFwcGVuZChkaXYpO1xuICAgICAgYW5ndWxhci5lbGVtZW50KGVsbS5maW5kKCdidXR0b24uZHJvcGRvd24tdG9nZ2xlJykpLmF0dHJjaGFuZ2Uoe1xuICAgICAgICAgIHRyYWNrVmFsdWVzOiB0cnVlLFxuICAgICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbihldm50KSB7XG4gICAgICAgICAgICBpZihldm50LmF0dHJpYnV0ZU5hbWUgPT0gJ2FyaWEtZXhwYW5kZWQnICYmIGV2bnQubmV3VmFsdWUgPT0gJ2ZhbHNlJyl7XG4gICAgICAgICAgICAgIGVuYWJsZVNjcm9sbCgpO1xuICAgICAgICAgICAgICB1bHMgPSBhbmd1bGFyLmVsZW1lbnQoZGl2KS5maW5kKCd1bCcpO1xuICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2godWxzLCB1bCA9PiB7XG4gICAgICAgICAgICAgICAgYW5ndWxhci5lbGVtZW50KHVsKS5jc3Moe1xuICAgICAgICAgICAgICAgICAgZGlzcGxheTogJ25vbmUnXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIGVsbS5maW5kKCdkaXYuZHJvcGRvd24nKS5hcHBlbmQodWxzKTtcbiAgICAgICAgICAgICAgZGl2LnJlbW92ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgICRlbGVtZW50LmJpbmQoJ2NsaWNrJywgZXZlbnQgPT4ge1xuICAgICAgbGV0IHVscyA9ICRlbGVtZW50LmZpbmQoJ3VsJyk7XG4gICAgICBpZih1bHMuZmluZCgnZ21kLW9wdGlvbicpLmxlbmd0aCA9PSAwKXtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGhhbmRsaW5nRWxlbWVudFN0eWxlKCRlbGVtZW50LCB1bHMpOyAgICBcbiAgICAgIGRpc2FibGVTY3JvbGwoKTtcbiAgICAgIGhhbmRsaW5nRWxlbWVudEluQm9keSgkZWxlbWVudCwgdWxzKTtcbiAgICB9KVxuXG4gICAgY3RybC5zZWxlY3QgPSBmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgIGFuZ3VsYXIuZm9yRWFjaChvcHRpb25zLCBmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgICAgb3B0aW9uLnNlbGVjdGVkID0gZmFsc2U7XG4gICAgICB9KTtcbiAgICAgIG9wdGlvbi5zZWxlY3RlZCA9IHRydWU7XG4gICAgICBjdHJsLm5nTW9kZWwgPSBvcHRpb24ubmdWYWx1ZVxuICAgICAgY3RybC5zZWxlY3RlZCA9IG9wdGlvbi5uZ0xhYmVsXG4gICAgfTtcblxuICAgIGN0cmwuYWRkT3B0aW9uID0gZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICBvcHRpb25zLnB1c2gob3B0aW9uKTtcbiAgICB9O1xuXG4gICAgbGV0IHNldFNlbGVjdGVkID0gKHZhbHVlKSA9PiB7XG4gICAgICBhbmd1bGFyLmZvckVhY2gob3B0aW9ucywgb3B0aW9uID0+IHtcbiAgICAgICAgaWYgKG9wdGlvbi5uZ1ZhbHVlLiQkaGFzaEtleSkge1xuICAgICAgICAgIGRlbGV0ZSBvcHRpb24ubmdWYWx1ZS4kJGhhc2hLZXlcbiAgICAgICAgfVxuICAgICAgICBpZiAoYW5ndWxhci5lcXVhbHModmFsdWUsIG9wdGlvbi5uZ1ZhbHVlKSkge1xuICAgICAgICAgIGN0cmwuc2VsZWN0KG9wdGlvbilcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICAkdGltZW91dCgoKSA9PiBzZXRTZWxlY3RlZChjdHJsLm5nTW9kZWwpKTtcblxuICAgIGN0cmwuJGRvQ2hlY2sgPSAoKSA9PiB7XG4gICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmxlbmd0aCA+IDApIHNldFNlbGVjdGVkKGN0cmwubmdNb2RlbClcbiAgICB9XG5cblxuICB9XVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnRcbiIsImxldCBDb21wb25lbnQgPSB7XG4gICAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgICByZXF1aXJlOiB7XG4gICAgICBnbWRTZWxlY3RDdHJsOiAnXmdtZFNlbGVjdCdcbiAgICB9LFxuICAgIGJpbmRpbmdzOiB7XG4gICAgfSxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgPGEgY2xhc3M9XCJzZWxlY3Qtb3B0aW9uXCIgZGF0YS1uZy1jbGljaz1cIiRjdHJsLnNlbGVjdCgpXCIgbmctdHJhbnNjbHVkZT48L2E+XG4gICAgYCxcbiAgICBjb250cm9sbGVyOiBbJyRzY29wZScsJyRhdHRycycsJyR0aW1lb3V0JywnJGVsZW1lbnQnLCckdHJhbnNjbHVkZScsIGZ1bmN0aW9uKCRzY29wZSwkYXR0cnMsJHRpbWVvdXQsJGVsZW1lbnQsJHRyYW5zY2x1ZGUpIHtcbiAgICAgIGxldCBjdHJsID0gdGhpcztcbiBcbiAgICAgIGN0cmwuc2VsZWN0ID0gKCkgPT4ge1xuICAgICAgICBjdHJsLmdtZFNlbGVjdEN0cmwuc2VsZWN0KHRoaXMpO1xuICAgICAgfVxuICAgICAgXG4gICAgfV1cbiAgfVxuICBcbiAgZXhwb3J0IGRlZmF1bHQgQ29tcG9uZW50XG4gICIsImxldCBDb21wb25lbnQgPSB7XG4gIC8vIHJlcXVpcmU6IFsnbmdNb2RlbCcsJ25nUmVxdWlyZWQnXSxcbiAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgcmVxdWlyZToge1xuICAgIGdtZFNlbGVjdEN0cmw6ICdeZ21kU2VsZWN0J1xuICB9LFxuICBiaW5kaW5nczoge1xuICAgIG5nVmFsdWU6ICc9JyxcbiAgICBuZ0xhYmVsOiAnPSdcbiAgfSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8YSBjbGFzcz1cInNlbGVjdC1vcHRpb25cIiBkYXRhLW5nLWNsaWNrPVwiJGN0cmwuc2VsZWN0KCRjdHJsLm5nVmFsdWUsICRjdHJsLm5nTGFiZWwpXCIgbmctY2xhc3M9XCJ7YWN0aXZlOiAkY3RybC5zZWxlY3RlZH1cIiBuZy10cmFuc2NsdWRlPjwvYT5cbiAgYCxcbiAgY29udHJvbGxlcjogWyckc2NvcGUnLCckYXR0cnMnLCckdGltZW91dCcsJyRlbGVtZW50JywnJHRyYW5zY2x1ZGUnLCBmdW5jdGlvbigkc2NvcGUsJGF0dHJzLCR0aW1lb3V0LCRlbGVtZW50LCR0cmFuc2NsdWRlKSB7XG4gICAgbGV0IGN0cmwgPSB0aGlzO1xuXG4gICAgY3RybC4kb25Jbml0ID0gKCkgPT4ge1xuICAgICAgY3RybC5nbWRTZWxlY3RDdHJsLmFkZE9wdGlvbih0aGlzKVxuICAgIH1cbiAgICBcbiAgICBjdHJsLnNlbGVjdCA9ICgpID0+IHtcbiAgICAgIGN0cmwuZ21kU2VsZWN0Q3RybC5zZWxlY3QoY3RybCk7XG4gICAgICBpZihjdHJsLmdtZFNlbGVjdEN0cmwub25DaGFuZ2Upe1xuICAgICAgICBjdHJsLmdtZFNlbGVjdEN0cmwub25DaGFuZ2Uoe3ZhbHVlOiB0aGlzLm5nVmFsdWV9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgfV1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29tcG9uZW50XG4iLCJsZXQgQ29tcG9uZW50ID0ge1xuICB0cmFuc2NsdWRlOiB0cnVlLFxuICByZXF1aXJlOiB7XG4gICAgZ21kU2VsZWN0Q3RybDogJ15nbWRTZWxlY3QnXG4gIH0sXG4gIGJpbmRpbmdzOiB7XG4gICAgbmdNb2RlbDogJz0nLFxuICAgIHBsYWNlaG9sZGVyOiAnQD8nXG4gIH0sXG4gIHRlbXBsYXRlOiBgXG4gICAgPGRpdiBjbGFzcz1cImlucHV0LWdyb3VwXCIgc3R5bGU9XCJib3JkZXI6IG5vbmU7YmFja2dyb3VuZDogI2Y5ZjlmOTtcIj5cbiAgICAgIDxzcGFuIGNsYXNzPVwiaW5wdXQtZ3JvdXAtYWRkb25cIiBpZD1cImJhc2ljLWFkZG9uMVwiIHN0eWxlPVwiYm9yZGVyOiBub25lO1wiPlxuICAgICAgICA8aSBjbGFzcz1cIm1hdGVyaWFsLWljb25zXCI+c2VhcmNoPC9pPlxuICAgICAgPC9zcGFuPlxuICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgc3R5bGU9XCJib3JkZXI6IG5vbmU7XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgZ21kXCIgbmctbW9kZWw9XCIkY3RybC5uZ01vZGVsXCIgcGxhY2Vob2xkZXI9XCJ7eyRjdHJsLnBsYWNlaG9sZGVyfX1cIj5cbiAgICA8L2Rpdj5cbiAgYCxcbiAgY29udHJvbGxlcjogWyckc2NvcGUnLCckYXR0cnMnLCckdGltZW91dCcsJyRlbGVtZW50JywnJHRyYW5zY2x1ZGUnLCBmdW5jdGlvbigkc2NvcGUsJGF0dHJzLCR0aW1lb3V0LCRlbGVtZW50LCR0cmFuc2NsdWRlKSB7XG4gICAgbGV0IGN0cmwgPSB0aGlzO1xuXG4gICAgJGVsZW1lbnQuYmluZCgnY2xpY2snLCAoZXZ0KSA9PiB7XG4gICAgICBldnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfSlcblxuICB9XVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnRcbiIsImxldCBDb21wb25lbnQgPSB7XG4gIGJpbmRpbmdzOiB7XG4gICAgZGlhbWV0ZXI6IFwiQD9cIixcbiAgICBib3ggICAgIDogXCI9P1wiXG4gIH0sXG4gIHRlbXBsYXRlOiBgXG4gIDxkaXYgY2xhc3M9XCJzcGlubmVyLW1hdGVyaWFsXCIgbmctaWY9XCIkY3RybC5kaWFtZXRlclwiPlxuICAgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJcbiAgICAgICAgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCJcbiAgICAgICAgdmVyc2lvbj1cIjFcIlxuICAgICAgICBuZy1jbGFzcz1cInsnc3Bpbm5lci1ib3gnIDogJGN0cmwuYm94fVwiXG4gICAgICAgIHN0eWxlPVwid2lkdGg6IHt7JGN0cmwuZGlhbWV0ZXJ9fTtoZWlnaHQ6IHt7JGN0cmwuZGlhbWV0ZXJ9fTtcIlxuICAgICAgICB2aWV3Qm94PVwiMCAwIDI4IDI4XCI+XG4gICAgPGcgY2xhc3M9XCJxcC1jaXJjdWxhci1sb2FkZXJcIj5cbiAgICAgPHBhdGggY2xhc3M9XCJxcC1jaXJjdWxhci1sb2FkZXItcGF0aFwiIGZpbGw9XCJub25lXCIgZD1cIk0gMTQsMS41IEEgMTIuNSwxMi41IDAgMSAxIDEuNSwxNFwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiAvPlxuICAgIDwvZz5cbiAgIDwvc3ZnPlxuICA8L2Rpdj5gLFxuICBjb250cm9sbGVyOiBbJyRzY29wZScsJyRlbGVtZW50JywnJGF0dHJzJywnJHRpbWVvdXQnLCAnJHBhcnNlJywgZnVuY3Rpb24oJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzLCAkdGltZW91dCwkcGFyc2UpIHtcbiAgICBsZXQgY3RybCA9IHRoaXM7XG5cbiAgICBjdHJsLiRvbkluaXQgPSAoKSA9PiB7XG4gICAgICBjdHJsLmRpYW1ldGVyID0gY3RybC5kaWFtZXRlciB8fCAnNTBweCc7XG4gICAgfVxuXG4gIH1dXG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvbmVudFxuIiwibGV0IFByb3ZpZGVyID0gKCkgPT4ge1xuXG4gICAgY29uc3Qgc2V0RWxlbWVudEhyZWYgPSAoaHJlZikgPT4ge1xuICAgICAgICBsZXQgZWxtID0gYW5ndWxhci5lbGVtZW50KCdsaW5rW2hyZWYqPVwiZ3VtZ2EtbGF5b3V0XCJdJyk7XG4gICAgICAgIGlmKGVsbSAmJiBlbG1bMF0pe1xuICAgICAgICAgICAgZWxtLmF0dHIoJ2hyZWYnLCBocmVmKTtcbiAgICAgICAgfVxuICAgICAgICBlbG0gPSBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGluaycpKTtcbiAgICAgICAgZWxtLmF0dHIoJ2hyZWYnLCBocmVmKTtcbiAgICAgICAgZWxtLmF0dHIoJ3JlbCcsICdzdHlsZXNoZWV0Jyk7XG4gICAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoZWxtWzBdKTtcbiAgICB9XG5cbiAgICBjb25zdCBzZXRUaGVtZURlZmF1bHQgPSAodGhlbWVOYW1lLCBzYXZlKSA9PiB7XG4gICAgICAgIGxldCBzcmMsIHRoZW1lRGVmYXVsdCA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ2dtZC10aGVtZS1kZWZhdWx0Jyk7XG4gICAgICAgIGlmKHRoZW1lTmFtZSAmJiAhdGhlbWVEZWZhdWx0KXtcbiAgICAgICAgICAgIGlmKHNhdmUpIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ2dtZC10aGVtZS1kZWZhdWx0JywgdGhlbWVOYW1lKTtcbiAgICAgICAgICAgIHNyYyA9ICdndW1nYS1sYXlvdXQvJyt0aGVtZU5hbWUrJy9ndW1nYS1sYXlvdXQubWluLmNzcyc7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgaWYodGhlbWVEZWZhdWx0KXtcbiAgICAgICAgICAgICAgICBzcmMgPSAnZ3VtZ2EtbGF5b3V0LycrdGhlbWVEZWZhdWx0KycvZ3VtZ2EtbGF5b3V0Lm1pbi5jc3MnO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgc3JjID0gJ2d1bWdhLWxheW91dC9ndW1nYS1sYXlvdXQubWluLmNzcyc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc2V0RWxlbWVudEhyZWYoc3JjKTtcbiAgICB9XG5cbiAgICBjb25zdCBzZXRUaGVtZSA9ICh0aGVtZU5hbWUsIHVwZGF0ZVNlc3Npb24pID0+IHtcbiAgICAgICAgdmFyIHNyYywgdGhlbWVEZWZhdWx0ID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnZ21kLXRoZW1lJyk7XG5cbiAgICAgICAgaWYoKHRoZW1lTmFtZSAmJiB1cGRhdGVTZXNzaW9uKSB8fCAodGhlbWVOYW1lICYmICF0aGVtZURlZmF1bHQpKXtcbiAgICAgICAgICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ2dtZC10aGVtZScsIHRoZW1lTmFtZSk7XG4gICAgICAgICAgICBzcmMgPSAnZ3VtZ2EtbGF5b3V0LycgKyB0aGVtZU5hbWUgKyAnL2d1bWdhLWxheW91dC5taW4uY3NzJztcbiAgICAgICAgICAgIHNldEVsZW1lbnRIcmVmKHNyYyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZih0aGVtZU5hbWUgJiYgIXVwZGF0ZVNlc3Npb24pe1xuICAgICAgICAgICAgc3JjID0gJ2d1bWdhLWxheW91dC8nICsgdGhlbWVEZWZhdWx0ICsgJy9ndW1nYS1sYXlvdXQubWluLmNzcyc7XG4gICAgICAgICAgICBzZXRFbGVtZW50SHJlZihzcmMpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgc3JjID0gJ2d1bWdhLWxheW91dC9ndW1nYS1sYXlvdXQubWluLmNzcyc7XG4gICAgICAgIHNldEVsZW1lbnRIcmVmKHNyYyk7XG4gICAgfTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHNldFRoZW1lRGVmYXVsdDogc2V0VGhlbWVEZWZhdWx0LCBcbiAgICAgICAgc2V0VGhlbWU6IHNldFRoZW1lLCBcbiAgICAgICAgJGdldCgpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc2V0VGhlbWVEZWZhdWx0OiBzZXRUaGVtZURlZmF1bHQsXG4gICAgICAgICAgICAgICAgc2V0VGhlbWU6IHNldFRoZW1lXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxufVxuXG5Qcm92aWRlci4kaW5qZWN0ID0gW107XG5cbmV4cG9ydCBkZWZhdWx0IFByb3ZpZGVyO1xuIiwiaW1wb3J0IE1lbnUgICAgICAgICBmcm9tICcuL21lbnUvY29tcG9uZW50LmpzJztcbmltcG9ydCBNZW51U2hyaW5rICAgICAgICAgZnJvbSAnLi9tZW51LXNocmluay9jb21wb25lbnQuanMnO1xuaW1wb3J0IEdtZE5vdGlmaWNhdGlvbiBmcm9tICcuL25vdGlmaWNhdGlvbi9jb21wb25lbnQuanMnO1xuaW1wb3J0IFNlbGVjdCAgICAgICBmcm9tICcuL3NlbGVjdC9jb21wb25lbnQuanMnO1xuaW1wb3J0IFNlbGVjdFNlYXJjaCAgICAgICBmcm9tICcuL3NlbGVjdC9zZWFyY2gvY29tcG9uZW50LmpzJztcbmltcG9ydCBPcHRpb24gICAgICAgZnJvbSAnLi9zZWxlY3Qvb3B0aW9uL2NvbXBvbmVudC5qcyc7XG5pbXBvcnQgT3B0aW9uRW1wdHkgICAgICAgZnJvbSAnLi9zZWxlY3QvZW1wdHkvY29tcG9uZW50LmpzJztcbmltcG9ydCBJbnB1dCAgICAgICAgZnJvbSAnLi9pbnB1dC9jb21wb25lbnQuanMnO1xuaW1wb3J0IFJpcHBsZSAgICAgICBmcm9tICcuL3JpcHBsZS9jb21wb25lbnQuanMnO1xuaW1wb3J0IEZhYiAgICAgICAgICBmcm9tICcuL2ZhYi9jb21wb25lbnQuanMnO1xuaW1wb3J0IFNwaW5uZXIgICAgICBmcm9tICcuL3NwaW5uZXIvY29tcG9uZW50LmpzJztcbmltcG9ydCBIYW1idXJnZXIgICAgICBmcm9tICcuL2hhbWJ1cmdlci9jb21wb25lbnQuanMnO1xuaW1wb3J0IEFsZXJ0ICAgICAgZnJvbSAnLi9hbGVydC9wcm92aWRlci5qcyc7XG5pbXBvcnQgVGhlbWUgICAgICBmcm9tICcuL3RoZW1lL3Byb3ZpZGVyLmpzJztcblxuYW5ndWxhclxuICAubW9kdWxlKCdndW1nYS5sYXlvdXQnLCBbXSlcbiAgLnByb3ZpZGVyKCckZ21kQWxlcnQnLCBBbGVydClcbiAgLnByb3ZpZGVyKCckZ21kVGhlbWUnLCBUaGVtZSlcbiAgLmRpcmVjdGl2ZSgnZ21kUmlwcGxlJywgUmlwcGxlKVxuICAuY29tcG9uZW50KCdnbE1lbnUnLCBNZW51KVxuICAuY29tcG9uZW50KCdtZW51U2hyaW5rJywgTWVudVNocmluaylcbiAgLmNvbXBvbmVudCgnZ2xOb3RpZmljYXRpb24nLCBHbWROb3RpZmljYXRpb24pXG4gIC5jb21wb25lbnQoJ2dtZFNlbGVjdCcsIFNlbGVjdClcbiAgLmNvbXBvbmVudCgnZ21kU2VsZWN0U2VhcmNoJywgU2VsZWN0U2VhcmNoKVxuICAuY29tcG9uZW50KCdnbWRPcHRpb25FbXB0eScsIE9wdGlvbkVtcHR5KVxuICAuY29tcG9uZW50KCdnbWRPcHRpb24nLCBPcHRpb24pXG4gIC5jb21wb25lbnQoJ2dtZElucHV0JywgSW5wdXQpXG4gIC5jb21wb25lbnQoJ2dtZEZhYicsIEZhYilcbiAgLmNvbXBvbmVudCgnZ21kU3Bpbm5lcicsIFNwaW5uZXIpXG4gIC5jb21wb25lbnQoJ2dtZEhhbWJ1cmdlcicsIEhhbWJ1cmdlcilcbiJdfQ==
