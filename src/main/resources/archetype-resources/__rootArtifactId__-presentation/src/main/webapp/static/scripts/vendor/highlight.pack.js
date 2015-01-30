var hljs=new function(){function e(e){return e.replace(/&/gm,"&amp;").replace(/</gm,"&lt;").replace(/>/gm,"&gt;")}function t(e){return e.nodeName.toLowerCase()}function n(e,t){var n=e&&e.exec(t);return n&&n.index==0}function r(e){return Array.prototype.map.call(e.childNodes,function(e){return e.nodeType==3?p.useBR?e.nodeValue.replace(/\n/g,""):e.nodeValue:t(e)=="br"?"\n":r(e)}).join("")}function i(e){var t=(e.className+" "+(e.parentNode?e.parentNode.className:"")).split(/\s+/);return t=t.map(function(e){return e.replace(/^language-/,"")}),t.filter(function(e){return w(e)||e=="no-highlight"})[0]}function s(e,t){var n={};for(var r in e)n[r]=e[r];if(t)for(var r in t)n[r]=t[r];return n}function o(e){var n=[];return function r(e,i){for(var s=e.firstChild;s;s=s.nextSibling)s.nodeType==3?i+=s.nodeValue.length:t(s)=="br"?i+=1:s.nodeType==1&&(n.push({event:"start",offset:i,node:s}),i=r(s,i),n.push({event:"stop",offset:i,node:s}));return i}(e,0),n}function u(n,r,i){function a(){return!n.length||!r.length?n.length?n:r:n[0].offset!=r[0].offset?n[0].offset<r[0].offset?n:r:r[0].event=="start"?n:r}function f(n){function r(t){return" "+t.nodeName+'="'+e(t.value)+'"'}o+="<"+t(n)+Array.prototype.map.call(n.attributes,r).join("")+">"}function l(e){o+="</"+t(e)+">"}function c(e){(e.event=="start"?f:l)(e.node)}var s=0,o="",u=[];while(n.length||r.length){var h=a();o+=e(i.substr(s,h[0].offset-s)),s=h[0].offset;if(h==n){u.reverse().forEach(l);do c(h.splice(0,1)[0]),h=a();while(h==n&&h.length&&h[0].offset==s);u.reverse().forEach(f)}else h[0].event=="start"?u.push(h[0].node):u.pop(),c(h.splice(0,1)[0])}return o+e(i.substr(s))}function a(e){function t(e){return e&&e.source||e}function n(n,r){return RegExp(t(n),"m"+(e.cI?"i":"")+(r?"g":""))}function r(i,o){if(i.compiled)return;i.compiled=!0,i.k=i.k||i.bK;if(i.k){var u={};function a(t,n){e.cI&&(n=n.toLowerCase()),n.split(" ").forEach(function(e){var n=e.split("|");u[n[0]]=[t,n[1]?Number(n[1]):1]})}typeof i.k=="string"?a("keyword",i.k):Object.keys(i.k).forEach(function(e){a(e,i.k[e])}),i.k=u}i.lR=n(i.l||/\b[A-Za-z0-9_]+\b/,!0),o&&(i.bK&&(i.b=i.bK.split(" ").join("|")),i.b||(i.b=/\B|\b/),i.bR=n(i.b),!i.e&&!i.eW&&(i.e=/\B|\b/),i.e&&(i.eR=n(i.e)),i.tE=t(i.e)||"",i.eW&&o.tE&&(i.tE+=(i.e?"|":"")+o.tE)),i.i&&(i.iR=n(i.i)),i.r===undefined&&(i.r=1),i.c||(i.c=[]);var f=[];i.c.forEach(function(e){e.v?e.v.forEach(function(t){f.push(s(e,t))}):f.push(e=="self"?i:e)}),i.c=f,i.c.forEach(function(e){r(e,i)}),i.starts&&r(i.starts,o);var l=i.c.map(function(e){return e.bK?"\\.?\\b("+e.b+")\\b\\.?":e.b}).concat([i.tE]).concat([i.i]).map(t).filter(Boolean);i.t=l.length?n(l.join("|"),!0):{exec:function(e){return null}},i.continuation={}}r(e)}function f(t,r,i,s){function o(e,t){for(var r=0;r<t.c.length;r++)if(n(t.c[r].bR,e))return t.c[r]}function u(e,t){if(n(e.eR,t))return e;if(e.eW)return u(e.parent,t)}function c(e,t){return!i&&n(t.iR,e)}function h(e,t){var n=S.cI?t[0].toLowerCase():t[0];return e.k.hasOwnProperty(n)&&e.k[n]}function d(e,t,n,r){var i=r?"":p.classPrefix,s='<span class="'+i,o=n?"":"</span>";return s+=e+'">',s+t+o}function v(){var t=e(C);if(!x.k)return t;var n="",r=0;x.lR.lastIndex=0;var i=x.lR.exec(t);while(i){n+=t.substr(r,i.index-r);var s=h(x,i);s?(L+=s[1],n+=d(s[0],i[0])):n+=i[0],r=x.lR.lastIndex,i=x.lR.exec(t)}return n+t.substr(r)}function m(){if(x.sL&&!g[x.sL])return e(C);var t=x.sL?f(x.sL,C,!0,x.continuation.top):l(C);return x.r>0&&(L+=t.r),x.subLanguageMode=="continuous"&&(x.continuation.top=t.top),d(t.language,t.value,!1,!0)}function y(){return x.sL!==undefined?m():v()}function b(t,n){var r=t.cN?d(t.cN,"",!0):"";t.rB?(T+=r,C=""):t.eB?(T+=e(n)+r,C=""):(T+=r,C=n),x=Object.create(t,{parent:{value:x}})}function E(t,n){C+=t;if(n===undefined)return T+=y(),0;var r=o(n,x);if(r)return T+=y(),b(r,n),r.rB?0:n.length;var i=u(x,n);if(i){var s=x;!s.rE&&!s.eE&&(C+=n),T+=y();do x.cN&&(T+="</span>"),L+=x.r,x=x.parent;while(x!=i.parent);return s.eE&&(T+=e(n)),C="",i.starts&&b(i.starts,""),s.rE?0:n.length}if(c(n,x))throw new Error('Illegal lexeme "'+n+'" for mode "'+(x.cN||"<unnamed>")+'"');return C+=n,n.length||1}var S=w(t);if(!S)throw new Error('Unknown language: "'+t+'"');a(S);var x=s||S,T="";for(var N=x;N!=S;N=N.parent)N.cN&&(T=d(N.cN,T,!0));var C="",L=0;try{var A,O,M=0;for(;;){x.t.lastIndex=M,A=x.t.exec(r);if(!A)break;O=E(r.substr(M,A.index-M),A[0]),M=A.index+O}E(r.substr(M));for(var N=x;N.parent;N=N.parent)N.cN&&(T+="</span>");return{r:L,value:T,language:t,top:x}}catch(_){if(_.message.indexOf("Illegal")!=-1)return{r:0,value:e(r)};throw _}}function l(t,n){n=n||p.languages||Object.keys(g);var r={r:0,value:e(t)},i=r;return n.forEach(function(e){if(!w(e))return;var n=f(e,t,!1);n.language=e,n.r>i.r&&(i=n),n.r>r.r&&(i=r,r=n)}),i.language&&(r.second_best=i),r}function c(e){return p.tabReplace&&(e=e.replace(/^((<[^>]+>|\t)+)/gm,function(e,t,n,r){return t.replace(/\t/g,p.tabReplace)})),p.useBR&&(e=e.replace(/\n/g,"<br>")),e}function h(e){var t=r(e),n=i(e);if(n=="no-highlight")return;var s=n?f(n,t,!0):l(t),a=o(e);if(a.length){var h=document.createElementNS("http://www.w3.org/1999/xhtml","pre");h.innerHTML=s.value,s.value=u(a,o(h),t)}s.value=c(s.value),e.innerHTML=s.value,e.className+=" hljs "+(!n&&s.language||""),e.result={language:s.language,re:s.r},s.second_best&&(e.second_best={language:s.second_best.language,re:s.second_best.r})}function d(e){p=s(p,e)}function v(){if(v.called)return;v.called=!0;var e=document.querySelectorAll("pre code");Array.prototype.forEach.call(e,h)}function m(){addEventListener("DOMContentLoaded",v,!1),addEventListener("load",v,!1)}function b(e,t){var n=g[e]=t(this);n.aliases&&n.aliases.forEach(function(t){y[t]=e})}function w(e){return g[e]||g[y[e]]}var p={classPrefix:"hljs-",tabReplace:null,useBR:!1,languages:undefined},g={},y={};this.highlight=f,this.highlightAuto=l,this.fixMarkup=c,this.highlightBlock=h,this.configure=d,this.initHighlighting=v,this.initHighlightingOnLoad=m,this.registerLanguage=b,this.getLanguage=w,this.inherit=s,this.IR="[a-zA-Z][a-zA-Z0-9_]*",this.UIR="[a-zA-Z_][a-zA-Z0-9_]*",this.NR="\\b\\d+(\\.\\d+)?",this.CNR="(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",this.BNR="\\b(0b[01]+)",this.RSR="!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",this.BE={b:"\\\\[\\s\\S]",r:0},this.ASM={cN:"string",b:"'",e:"'",i:"\\n",c:[this.BE]},this.QSM={cN:"string",b:'"',e:'"',i:"\\n",c:[this.BE]},this.CLCM={cN:"comment",b:"//",e:"$"},this.CBLCLM={cN:"comment",b:"/\\*",e:"\\*/"},this.HCM={cN:"comment",b:"#",e:"$"},this.NM={cN:"number",b:this.NR,r:0},this.CNM={cN:"number",b:this.CNR,r:0},this.BNM={cN:"number",b:this.BNR,r:0},this.REGEXP_MODE={cN:"regexp",b:/\//,e:/\/[gim]*/,i:/\n/,c:[this.BE,{b:/\[/,e:/\]/,r:0,c:[this.BE]}]},this.TM={cN:"title",b:this.IR,r:0},this.UTM={cN:"title",b:this.UIR,r:0}};hljs.registerLanguage("javascript",function(e){return{aliases:["js"],k:{keyword:"in if for while finally var new function do return void else break catch instanceof with throw case default try this switch continue typeof delete let yield const class",literal:"true false null undefined NaN Infinity",built_in:"eval isFinite isNaN parseFloat parseInt decodeURI decodeURIComponent encodeURI encodeURIComponent escape unescape Object Function Boolean Error EvalError InternalError RangeError ReferenceError StopIteration SyntaxError TypeError URIError Number Math Date String RegExp Array Float32Array Float64Array Int16Array Int32Array Int8Array Uint16Array Uint32Array Uint8Array Uint8ClampedArray ArrayBuffer DataView JSON Intl arguments require"},c:[{cN:"pi",b:/^\s*('|")use strict('|")/,r:10},e.ASM,e.QSM,e.CLCM,e.CBLCLM,e.CNM,{b:"("+e.RSR+"|\\b(case|return|throw)\\b)\\s*",k:"return throw case",c:[e.CLCM,e.CBLCLM,e.REGEXP_MODE,{b:/</,e:/>;/,r:0,sL:"xml"}],r:0},{cN:"function",bK:"function",e:/\{/,c:[e.inherit(e.TM,{b:/[A-Za-z$_][0-9A-Za-z$_]*/}),{cN:"params",b:/\(/,e:/\)/,c:[e.CLCM,e.CBLCLM],i:/["'\(]/}],i:/\[|%/},{b:/\$[(.]/},{b:"\\."+e.IR,r:0}]}}),hljs.registerLanguage("css",function(e){var t="[a-zA-Z-][a-zA-Z0-9_-]*",n={cN:"function",b:t+"\\(",e:"\\)",c:["self",e.NM,e.ASM,e.QSM]};return{cI:!0,i:"[=/|']",c:[e.CBLCLM,{cN:"id",b:"\\#[A-Za-z0-9_-]+"},{cN:"class",b:"\\.[A-Za-z0-9_-]+",r:0},{cN:"attr_selector",b:"\\[",e:"\\]",i:"$"},{cN:"pseudo",b:":(:)?[a-zA-Z0-9\\_\\-\\+\\(\\)\\\"\\']+"},{cN:"at_rule",b:"@(font-face|page)",l:"[a-z-]+",k:"font-face page"},{cN:"at_rule",b:"@",e:"[{;]",c:[{cN:"keyword",b:/\S+/},{b:/\s/,eW:!0,eE:!0,r:0,c:[n,e.ASM,e.QSM,e.NM]}]},{cN:"tag",b:t,r:0},{cN:"rules",b:"{",e:"}",i:"[^\\s]",r:0,c:[e.CBLCLM,{cN:"rule",b:"[^\\s]",rB:!0,e:";",eW:!0,c:[{cN:"attribute",b:"[A-Z\\_\\.\\-]+",e:":",eE:!0,i:"[^\\s]",starts:{cN:"value",eW:!0,eE:!0,c:[n,e.NM,e.QSM,e.ASM,e.CBLCLM,{cN:"hexcolor",b:"#[0-9A-Fa-f]+"},{cN:"important",b:"!important"}]}}]}]}]}}),hljs.registerLanguage("xml",function(e){var t="[A-Za-z0-9\\._:-]+",n={b:/<\?(php)?(?!\w)/,e:/\?>/,sL:"php",subLanguageMode:"continuous"},r={eW:!0,i:/</,r:0,c:[n,{cN:"attribute",b:t,r:0},{b:"=",r:0,c:[{cN:"value",v:[{b:/"/,e:/"/},{b:/'/,e:/'/},{b:/[^\s\/>]+/}]}]}]};return{aliases:["html"],cI:!0,c:[{cN:"doctype",b:"<!DOCTYPE",e:">",r:10,c:[{b:"\\[",e:"\\]"}]},{cN:"comment",b:"<!--",e:"-->",r:10},{cN:"cdata",b:"<\\!\\[CDATA\\[",e:"\\]\\]>",r:10},{cN:"tag",b:"<style(?=\\s|>|$)",e:">",k:{title:"style"},c:[r],starts:{e:"</style>",rE:!0,sL:"css"}},{cN:"tag",b:"<script(?=\\s|>|$)",e:">",k:{title:"script"},c:[r],starts:{e:"</script>",rE:!0,sL:"javascript"}},{b:"<%",e:"%>",sL:"vbscript"},n,{cN:"pi",b:/<\?\w+/,e:/\?>/,r:10},{cN:"tag",b:"</?",e:"/?>",c:[{cN:"title",b:"[^ /><]+",r:0},r]}]}}),hljs.registerLanguage("java",function(e){var t="false synchronized int abstract float private char boolean static null if const for true while long throw strictfp finally protected import native final return void enum else break transient new catch instanceof byte super volatile case assert short package default double public try this switch continue throws";return{k:t,i:/<\//,c:[{cN:"javadoc",b:"/\\*\\*",e:"\\*/",c:[{cN:"javadoctag",b:"(^|\\s)@[A-Za-z]+"}],r:10},e.CLCM,e.CBLCLM,e.ASM,e.QSM,{bK:"protected public private",e:/[{;=]/,k:t,c:[{cN:"class",bK:"class interface",eW:!0,i:/[:"<>]/,c:[{bK:"extends implements",r:10},e.UTM]},{b:e.UIR+"\\s*\\(",rB:!0,c:[e.UTM]}]},e.CNM,{cN:"annotation",b:"@[A-Za-z]+"}]}}),hljs.registerLanguage("handlebars",function(e){var t="each in with if else unless bindattr action collection debugger log outlet template unbound view yield";return{cI:!0,sL:"xml",subLanguageMode:"continuous",c:[{cN:"expression",b:"{{",e:"}}",c:[{cN:"begin-block",b:"#[a-zA-Z- .]+",k:t},{cN:"string",b:'"',e:'"'},{cN:"end-block",b:"\\/[a-zA-Z- .]+",k:t},{cN:"variable",b:"[a-zA-Z-.]+",k:t}]}]}}),hljs.registerLanguage("json",function(e){var t={literal:"true false null"},n=[e.QSM,e.CNM],r={cN:"value",e:",",eW:!0,eE:!0,c:n,k:t},i={b:"{",e:"}",c:[{cN:"attribute",b:'\\s*"',e:'"\\s*:\\s*',eB:!0,eE:!0,c:[e.BE],i:"\\n",starts:r}],i:"\\S"},s={b:"\\[",e:"\\]",c:[e.inherit(r,{cN:null})],i:"\\S"};return n.splice(n.length,0,i,s),{c:n,k:t,i:"\\S"}});