"use strict";(self.webpackChunkread_books=self.webpackChunkread_books||[]).push([[162],{5648:(n,t,e)=>{e.d(t,{Ep:()=>v,PP:()=>l,aU:()=>r,cP:()=>d,lX:()=>c});var r,a=e(272);!function(n){n.Pop="POP",n.Push="PUSH",n.Replace="REPLACE"}(r||(r={}));var u=function(n){return n};var o="beforeunload",i="popstate";function c(n){void 0===n&&(n={});var t=n.window,e=void 0===t?document.defaultView:t,c=e.history;function l(){var n=e.location,t=n.pathname,r=n.search,a=n.hash,o=c.state||{};return[o.idx,u({pathname:t,search:r,hash:a,state:o.usr||null,key:o.key||"default"})]}var f=null;e.addEventListener(i,(function(){if(f)b.call(f),f=null;else{var n=r.Pop,t=l(),e=t[0],a=t[1];if(b.length){if(null!=e){var u=y-e;u&&(f={action:n,location:a,retry:function(){R(-1*u)}},R(u))}}else L(n)}}));var g=r.Pop,k=l(),y=k[0],m=k[1],P=h(),b=h();function x(n){return"string"==typeof n?n:v(n)}function E(n,t){return void 0===t&&(t=null),u((0,a.Z)({pathname:m.pathname,hash:"",search:""},"string"==typeof n?d(n):n,{state:t,key:p()}))}function w(n,t){return[{usr:n.state,key:n.key,idx:t},x(n)]}function S(n,t,e){return!b.length||(b.call({action:n,location:t,retry:e}),!1)}function L(n){g=n;var t=l();y=t[0],m=t[1],P.call({action:g,location:m})}function R(n){c.go(n)}null==y&&(y=0,c.replaceState((0,a.Z)({},c.state,{idx:y}),""));var Z={get action(){return g},get location(){return m},createHref:x,push:function n(t,a){var u=r.Push,o=E(t,a);if(S(u,o,(function(){n(t,a)}))){var i=w(o,y+1),l=i[0],f=i[1];try{c.pushState(l,"",f)}catch(n){e.location.assign(f)}L(u)}},replace:function n(t,e){var a=r.Replace,u=E(t,e);if(S(a,u,(function(){n(t,e)}))){var o=w(u,y),i=o[0],l=o[1];c.replaceState(i,"",l),L(a)}},go:R,back:function(){R(-1)},forward:function(){R(1)},listen:function(n){return P.push(n)},block:function(n){var t=b.push(n);return 1===b.length&&e.addEventListener(o,s),function(){t(),b.length||e.removeEventListener(o,s)}}};return Z}function l(n){void 0===n&&(n={});var t=n,e=t.initialEntries,o=void 0===e?["/"]:e,i=t.initialIndex,c=o.map((function(n){return u((0,a.Z)({pathname:"/",search:"",hash:"",state:null,key:p()},"string"==typeof n?d(n):n))})),l=f(null==i?c.length-1:i,0,c.length-1),s=r.Pop,g=c[l],k=h(),y=h();function m(n,t){return void 0===t&&(t=null),u((0,a.Z)({pathname:g.pathname,search:"",hash:""},"string"==typeof n?d(n):n,{state:t,key:p()}))}function P(n,t,e){return!y.length||(y.call({action:n,location:t,retry:e}),!1)}function b(n,t){s=n,g=t,k.call({action:s,location:g})}function x(n){var t=f(l+n,0,c.length-1),e=r.Pop,a=c[t];P(e,a,(function(){x(n)}))&&(l=t,b(e,a))}var E={get index(){return l},get action(){return s},get location(){return g},createHref:function(n){return"string"==typeof n?n:v(n)},push:function n(t,e){var a=r.Push,u=m(t,e);P(a,u,(function(){n(t,e)}))&&(l+=1,c.splice(l,c.length,u),b(a,u))},replace:function n(t,e){var a=r.Replace,u=m(t,e);P(a,u,(function(){n(t,e)}))&&(c[l]=u,b(a,u))},go:x,back:function(){x(-1)},forward:function(){x(1)},listen:function(n){return k.push(n)},block:function(n){return y.push(n)}};return E}function f(n,t,e){return Math.min(Math.max(n,t),e)}function s(n){n.preventDefault(),n.returnValue=""}function h(){var n=[];return{get length(){return n.length},push:function(t){return n.push(t),function(){n=n.filter((function(n){return n!==t}))}},call:function(t){n.forEach((function(n){return n&&n(t)}))}}}function p(){return Math.random().toString(36).substr(2,8)}function v(n){var t=n.pathname,e=void 0===t?"/":t,r=n.search,a=void 0===r?"":r,u=n.hash,o=void 0===u?"":u;return a&&"?"!==a&&(e+="?"===a.charAt(0)?a:"?"+a),o&&"#"!==o&&(e+="#"===o.charAt(0)?o:"#"+o),e}function d(n){var t={};if(n){var e=n.indexOf("#");e>=0&&(t.hash=n.substr(e),n=n.substr(0,e));var r=n.indexOf("?");r>=0&&(t.search=n.substr(r),n=n.substr(0,r)),n&&(t.pathname=n)}return t}}}]);