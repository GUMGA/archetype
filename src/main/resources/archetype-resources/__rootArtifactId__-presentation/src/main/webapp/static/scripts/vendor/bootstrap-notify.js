    /**
 * bootstrap-notify.js v1.0
 * --
  * Copyright 2012 Goodybag, Inc.
 * --
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(e){var t=function(t,r){this.$element=e(t),this.$note=e('<div class="alert"></div>'),this.options=e.extend(!0,{},e.fn.notify.defaults,r),this.options.transition?this.options.transition=="fade"?this.$note.addClass("in").addClass(this.options.transition):this.$note.addClass(this.options.transition):this.$note.addClass("fade").addClass("in"),this.options.type?this.$note.addClass("alert-"+this.options.type):this.$note.addClass("alert-success"),!this.options.message&&this.$element.data("message")!==""?this.$note.html(this.$element.data("message")):typeof this.options.message=="object"&&(this.options.message.html?this.$note.html(this.options.message.html):this.options.message.text?this.$note.text(this.options.message.text):this.$note.html(this.options.message));if(this.options.closable)var i=e('<a class="close pull-right" href="#">&times;</a>');return e(i).on("click",e.proxy(n,this)),this.$note.prepend(i),this},n=function(){return this.options.onClose(),e(this.$note).remove(),this.options.onClosed(),!1};t.prototype.show=function(){this.options.fadeOut.enabled&&this.$note.delay(this.options.fadeOut.delay||3e3).fadeOut("slow",e.proxy(n,this)),this.$element.append(this.$note),this.$note.alert()},t.prototype.hide=function(){this.options.fadeOut.enabled?this.$note.delay(this.options.fadeOut.delay||3e3).fadeOut("slow",e.proxy(n,this)):n.call(this)},e.fn.notify=function(e){return new t(this,e)},e.fn.notify.defaults={type:"success",closable:!0,transition:"fade",fadeOut:{enabled:!0,delay:3e3},message:null,onClose:function(){},onClosed:function(){}}})(window.jQuery);