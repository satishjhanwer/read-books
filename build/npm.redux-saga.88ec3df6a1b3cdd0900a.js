"use strict";(self.webpackChunkread_books=self.webpackChunkread_books||[]).push([[749],{1666:(n,t,e)=>{e.d(t,{A:()=>N,B:()=>g,C:()=>I,D:()=>m,E:()=>i,F:()=>L,G:()=>D,J:()=>q,K:()=>F,L:()=>G,M:()=>H,N:()=>B,P:()=>j,R:()=>R,S:()=>Z,T:()=>O,Y:()=>K,a:()=>M,a3:()=>J,b:()=>_,d:()=>P,e:()=>w,f:()=>Y,g:()=>X,h:()=>U,i:()=>y,j:()=>k,k:()=>a,l:()=>b,m:()=>E,o:()=>v,p:()=>f,q:()=>p,r:()=>s,s:()=>A,t:()=>u,u:()=>l,v:()=>T,y:()=>C,z:()=>S});var r=e(2470),o=e(272),c=e(2847);var a=function(n){return function(){return n}}(!0),u=function(){};var i=function(n){return n};"function"==typeof Symbol&&Symbol.asyncIterator&&Symbol.asyncIterator;var f=function(n,t){(0,o.Z)(n,t),Object.getOwnPropertySymbols&&Object.getOwnPropertySymbols(t).forEach((function(e){n[e]=t[e]}))},l=function(n,t){var e;return(e=[]).concat.apply(e,t.map(n))};function s(n,t){var e=n.indexOf(t);e>=0&&n.splice(e,1)}function v(n){var t=!1;return function(){t||(t=!0,n())}}var d=function(n){throw n},h=function(n){return{value:n,done:!0}};function p(n,t,e){void 0===t&&(t=d),void 0===e&&(e="iterator");var r={meta:{name:e},next:n,throw:t,return:h,isSagaIterator:!0};return"undefined"!=typeof Symbol&&(r[Symbol.iterator]=function(){return r}),r}function g(n,t){var e=t.sagaStack;console.error(n),console.error(e)}var y=function(n){return new Error("\n  redux-saga: Error checking hooks detected an inconsistent state. This is likely a bug\n  in redux-saga code and not yours. Thanks for reporting this in the project's github repo.\n  Error: "+n+"\n")},E=function(n){return Array.apply(null,new Array(n))},m=function(n){return function(t){return n(Object.defineProperty(t,r.Nm,{value:!0}))}},S=function(n){return n===r.EO},C=function(n){return n===r.Wd},A=function(n){return S(n)||C(n)};function b(n,t){var e=Object.keys(n),r=e.length;var o,a=0,i=(0,c.IX)(n)?E(r):{},f={};return e.forEach((function(n){var e=function(e,c){o||(c||A(e)?(t.cancel(),t(e,c)):(i[n]=e,++a===r&&(o=!0,t(i))))};e.cancel=u,f[n]=e})),t.cancel=function(){o||(o=!0,e.forEach((function(n){return f[n].cancel()})))},f}function k(n){return{name:n.name||"anonymous",location:T(n)}}function T(n){return n[r.b_]}function x(n,t){void 0===n&&(n=10);var e=new Array(n),r=0,o=0,c=0,a=function(t){e[o]=t,o=(o+1)%n,r++},u=function(){if(0!=r){var t=e[c];return e[c]=null,r--,c=(c+1)%n,t}},i=function(){for(var n=[];r;)n.push(u());return n};return{isEmpty:function(){return 0==r},put:function(u){var f;if(r<n)a(u);else switch(t){case 1:throw new Error("Channel's Buffer overflow!");case 3:e[o]=u,c=o=(o+1)%n;break;case 4:f=2*n,e=i(),r=e.length,o=e.length,c=0,e.length=f,n=f,a(u)}},take:u,flush:i}}var w=function(n){return x(n,4)},O="TAKE",j="PUT",N="ALL",R="RACE",I="CALL",M="CPS",L="FORK",q="JOIN",_="CANCEL",Z="SELECT",P="ACTION_CHANNEL",Y="CANCELLED",X="FLUSH",D="GET_CONTEXT",U="SET_CONTEXT",W=function(n,t){var e;return(e={})[r.IO]=!0,e.combinator=!1,e.type=n,e.payload=t,e};function F(n,t){return void 0===n&&(n="*"),(0,c.uj)(n)?W(O,{pattern:n}):(0,c.Om)(n)&&(0,c.d5)(t)&&(0,c.uj)(t)?W(O,{channel:n,pattern:t}):(0,c.CE)(n)?W(O,{channel:n}):void 0}function K(n,t){return(0,c.sR)(t)&&(t=n,n=void 0),W(j,{channel:n,action:t})}function z(n,t){var e,r=null;return(0,c.Yl)(n)?e=n:((0,c.IX)(n)?(r=n[0],e=n[1]):(r=n.context,e=n.fn),r&&(0,c.Z_)(e)&&(0,c.Yl)(r[e])&&(e=r[e])),{context:r,fn:e,args:t}}function B(n){for(var t=arguments.length,e=new Array(t>1?t-1:0),r=1;r<t;r++)e[r-1]=arguments[r];return W(I,z(n,e))}function G(n){for(var t=arguments.length,e=new Array(t>1?t-1:0),r=1;r<t;r++)e[r-1]=arguments[r];return W(L,z(n,e))}function H(n){return void 0===n&&(n=r.sC),W(_,n)}function J(n){void 0===n&&(n=i);for(var t=arguments.length,e=new Array(t>1?t-1:0),r=1;r<t;r++)e[r-1]=arguments[r];return W(Z,{selector:n,args:e})}},2847:(n,t,e)=>{e.d(t,{CE:()=>v,IX:()=>i,MC:()=>f,NA:()=>h,Om:()=>p,Yl:()=>a,Z_:()=>u,d5:()=>c,eR:()=>d,hZ:()=>l,sR:()=>o,uj:()=>s});var r=e(2470),o=function(n){return null==n},c=function(n){return null!=n},a=function(n){return"function"==typeof n},u=function(n){return"string"==typeof n},i=Array.isArray,f=function(n){return n&&a(n.then)},l=function(n){return n&&a(n.next)&&a(n.throw)},s=function n(t){return t&&(u(t)||h(t)||a(t)||i(t)&&t.every(n))},v=function(n){return n&&a(n.take)&&a(n.close)},d=function(n){return a(n)&&n.hasOwnProperty("toString")},h=function(n){return Boolean(n)&&"function"==typeof Symbol&&n.constructor===Symbol&&n!==Symbol.prototype},p=function(n){return v(n)&&n[r.AS]}},2470:(n,t,e)=>{e.d(t,{AS:()=>i,Cs:()=>s,EO:()=>d,IO:()=>a,Nm:()=>f,Wd:()=>v,b_:()=>h,n1:()=>o,sC:()=>l,sZ:()=>c,uq:()=>u});var r=function(n){return"@@redux-saga/"+n},o=r("CANCEL_PROMISE"),c=r("CHANNEL_END"),a=r("IO"),u=r("MATCH"),i=r("MULTICAST"),f=r("SAGA_ACTION"),l=r("SELF_CANCELLATION"),s=r("TASK"),v=r("TASK_CANCEL"),d=r("TERMINATE"),h=r("LOCATION")},8654:(n,t,e)=>{e.d(t,{ZP:()=>G});var r=e(2470),o=e(272),c=e(3366),a=e(2847),u=e(1666),i=(e(7121),function(){return Math.random().toString(36).substring(7).split("").join(".")});i(),i();function f(){for(var n=arguments.length,t=new Array(n),e=0;e<n;e++)t[e]=arguments[e];return 0===t.length?function(n){return n}:1===t.length?t[0]:t.reduce((function(n,t){return function(){return n(t.apply(void 0,arguments))}}))}function l(){var n={};return n.promise=new Promise((function(t,e){n.resolve=t,n.reject=e})),n}const s=l;var v=[],d=0;function h(n){try{y(),n()}finally{E()}}function p(n){v.push(n),d||(y(),m())}function g(n){try{return y(),n()}finally{m()}}function y(){d++}function E(){d--}function m(){var n;for(E();!d&&void 0!==(n=v.shift());)h(n)}var S=function(n){return function(t){return n.some((function(n){return T(n)(t)}))}},C=function(n){return function(t){return n(t)}},A=function(n){return function(t){return t.type===String(n)}},b=function(n){return function(t){return t.type===n}},k=function(){return u.k};function T(n){var t="*"===n?k:(0,a.Z_)(n)?A:(0,a.IX)(n)?S:(0,a.eR)(n)?A:(0,a.Yl)(n)?C:(0,a.NA)(n)?b:null;if(null===t)throw new Error("invalid pattern: "+n);return t(n)}var x={type:r.sZ},w=function(n){return n&&n.type===r.sZ};function O(n){void 0===n&&(n=(0,u.e)());var t=!1,e=[];return{take:function(r){t&&n.isEmpty()?r(x):n.isEmpty()?(e.push(r),r.cancel=function(){(0,u.r)(e,r)}):r(n.take())},put:function(r){if(!t){if(0===e.length)return n.put(r);e.shift()(r)}},flush:function(e){t&&n.isEmpty()?e(x):e(n.flush())},close:function(){if(!t){t=!0;var n=e;e=[];for(var r=0,o=n.length;r<o;r++){(0,n[r])(x)}}}}}function j(){var n,t,e,o,c,a,i=(t=!1,o=e=[],c=function(){o===e&&(o=e.slice())},a=function(){t=!0;var n=e=o;o=[],n.forEach((function(n){n(x)}))},(n={})[r.AS]=!0,n.put=function(n){if(!t)if(w(n))a();else for(var c=e=o,u=0,i=c.length;u<i;u++){var f=c[u];f[r.uq](n)&&(f.cancel(),f(n))}},n.take=function(n,e){void 0===e&&(e=k),t?n(x):(n[r.uq]=e,c(),o.push(n),n.cancel=(0,u.o)((function(){c(),(0,u.r)(o,n)})))},n.close=a,n),f=i.put;return i.put=function(n){n[r.Nm]?f(n):p((function(){f(n)}))},i}function N(n,t){var e=n[r.n1];(0,a.Yl)(e)&&(t.cancel=e),n.then(t,(function(n){t(n,!0)}))}var R,I=0,M=function(){return++I};function L(n){n.isRunning()&&n.cancel()}var q=((R={})[u.T]=function(n,t,e){var o=t.channel,c=void 0===o?n.channel:o,u=t.pattern,i=t.maybe,f=function(n){n instanceof Error?e(n,!0):!w(n)||i?e(n):e(r.EO)};try{c.take(f,(0,a.d5)(u)?T(u):null)}catch(n){return void e(n,!0)}e.cancel=f.cancel},R[u.P]=function(n,t,e){var r=t.channel,o=t.action,c=t.resolve;p((function(){var t;try{t=(r?r.put:n.dispatch)(o)}catch(n){return void e(n,!0)}c&&(0,a.MC)(t)?N(t,e):e(t)}))},R[u.A]=function(n,t,e,r){var o=r.digestEffect,c=I,i=Object.keys(t);if(0!==i.length){var f=(0,u.l)(t,e);i.forEach((function(n){o(t[n],c,f[n],n)}))}else e((0,a.IX)(t)?[]:{})},R[u.R]=function(n,t,e,r){var o=r.digestEffect,c=I,i=Object.keys(t),f=(0,a.IX)(t)?(0,u.m)(i.length):{},l={},s=!1;i.forEach((function(n){var t=function(t,r){s||(r||(0,u.s)(t)?(e.cancel(),e(t,r)):(e.cancel(),s=!0,f[n]=t,e(f)))};t.cancel=u.t,l[n]=t})),e.cancel=function(){s||(s=!0,i.forEach((function(n){return l[n].cancel()})))},i.forEach((function(n){s||o(t[n],c,l[n],n)}))},R[u.C]=function(n,t,e,r){var o=t.context,c=t.fn,i=t.args,f=r.task;try{var l=c.apply(o,i);if((0,a.MC)(l))return void N(l,e);if((0,a.hZ)(l))return void K(n,l,f.context,I,(0,u.j)(c),!1,e);e(l)}catch(n){e(n,!0)}},R[u.a]=function(n,t,e){var r=t.context,o=t.fn,c=t.args;try{var u=function(n,t){(0,a.sR)(n)?e(t):e(n,!0)};o.apply(r,c.concat(u)),u.cancel&&(e.cancel=u.cancel)}catch(n){e(n,!0)}},R[u.F]=function(n,t,e,r){var o=t.context,c=t.fn,i=t.args,f=t.detached,l=r.task,s=function(n){var t=n.context,e=n.fn,r=n.args;try{var o=e.apply(t,r);if((0,a.hZ)(o))return o;var c=!1;return(0,u.q)((function(n){return c?{value:n,done:!0}:(c=!0,{value:o,done:!(0,a.MC)(o)})}))}catch(n){return(0,u.q)((function(){throw n}))}}({context:o,fn:c,args:i}),v=function(n,t){return n.isSagaIterator?{name:n.meta.name}:(0,u.j)(t)}(s,c);g((function(){var t=K(n,s,l.context,I,v,f,void 0);f?e(t):t.isRunning()?(l.queue.addTask(t),e(t)):t.isAborted()?l.queue.abort(t.error()):e(t)}))},R[u.J]=function(n,t,e,r){var o=r.task,c=function(n,t){if(n.isRunning()){var e={task:o,cb:t};t.cancel=function(){n.isRunning()&&(0,u.r)(n.joiners,e)},n.joiners.push(e)}else n.isAborted()?t(n.error(),!0):t(n.result())};if((0,a.IX)(t)){if(0===t.length)return void e([]);var i=(0,u.l)(t,e);t.forEach((function(n,t){c(n,i[t])}))}else c(t,e)},R[u.b]=function(n,t,e,o){var c=o.task;t===r.sC?L(c):(0,a.IX)(t)?t.forEach(L):L(t),e()},R[u.S]=function(n,t,e){var r=t.selector,o=t.args;try{e(r.apply(void 0,[n.getState()].concat(o)))}catch(n){e(n,!0)}},R[u.d]=function(n,t,e){var r=t.pattern,o=O(t.buffer),c=T(r),a=function t(e){w(e)||n.channel.take(t,c),o.put(e)},u=o.close;o.close=function(){a.cancel(),u()},n.channel.take(a,c),e(o)},R[u.f]=function(n,t,e,r){e(r.task.isCancelled())},R[u.g]=function(n,t,e){t.flush(e)},R[u.G]=function(n,t,e,r){e(r.task.context[t])},R[u.h]=function(n,t,e,r){var o=r.task;(0,u.p)(o.context,t),e()},R);function _(n,t){return n+"?"+t}function Z(n){var t=n.name,e=n.location;return e?t+"  "+_(e.fileName,e.lineNumber):t}function P(n){var t=(0,u.u)((function(n){return n.cancelledTasks}),n);return t.length?["Tasks cancelled due to error:"].concat(t).join("\n"):""}var Y=null,X=[],D=function(n){n.crashedEffect=Y,X.push(n)},U=function(){Y=null,X.length=0},W=function(){var n=X[0],t=X.slice(1),e=n.crashedEffect?function(n){var t=(0,u.v)(n);return t?t.code+"  "+_(t.fileName,t.lineNumber):""}(n.crashedEffect):null;return["The above error occurred in task "+Z(n.meta)+(e?" \n when executing effect "+e:"")].concat(t.map((function(n){return"    created by "+Z(n.meta)})),[P(X)]).join("\n")};function F(n,t,e,o,c,a,i){var f;void 0===i&&(i=u.t);var l,v,d=0,h=null,p=[],g=Object.create(e),y=function(n,t,e){var r,o=[],c=!1;function a(n){t(),f(),e(n,!0)}function i(t){o.push(t),t.cont=function(i,f){c||((0,u.r)(o,t),t.cont=u.t,f?a(i):(t===n&&(r=i),o.length||(c=!0,e(r))))}}function f(){c||(c=!0,o.forEach((function(n){n.cont=u.t,n.cancel()})),o=[])}return i(n),{addTask:i,cancelAll:f,abort:a,getTasks:function(){return o}}}(t,(function(){p.push.apply(p,y.getTasks().map((function(n){return n.meta.name})))}),E);function E(t,e){if(e){if(d=2,D({meta:c,cancelledTasks:p}),m.isRoot){var o=W();U(),n.onError(t,{sagaStack:o})}v=t,h&&h.reject(t)}else t===r.Wd?d=1:1!==d&&(d=3),l=t,h&&h.resolve(t);m.cont(t,e),m.joiners.forEach((function(n){n.cb(t,e)})),m.joiners=null}var m=((f={})[r.Cs]=!0,f.id=o,f.meta=c,f.isRoot=a,f.context=g,f.joiners=[],f.queue=y,f.cancel=function(){0===d&&(d=1,y.cancelAll(),E(r.Wd,!1))},f.cont=i,f.end=E,f.setContext=function(n){(0,u.p)(g,n)},f.toPromise=function(){return h||(h=s(),2===d?h.reject(v):0!==d&&h.resolve(l)),h.promise},f.isRunning=function(){return 0===d},f.isCancelled=function(){return 1===d||0===d&&1===t.status},f.isAborted=function(){return 2===d},f.result=function(){return l},f.error=function(){return v},f);return m}function K(n,t,e,o,c,i,f){var l=n.finalizeRunEffect((function(t,e,o){if((0,a.MC)(t))N(t,o);else if((0,a.hZ)(t))K(n,t,v.context,e,c,!1,o);else if(t&&t[r.IO]){(0,q[t.type])(n,t.payload,o,d)}else o(t)}));h.cancel=u.t;var s={meta:c,cancel:function(){0===s.status&&(s.status=1,h(r.Wd))},status:0},v=F(n,s,e,o,c,i,f),d={task:v,digestEffect:p};return f&&(f.cancel=v.cancel),h(),v;function h(n,e){try{var c;e?(c=t.throw(n),U()):(0,u.y)(n)?(s.status=1,h.cancel(),c=(0,a.Yl)(t.return)?t.return(r.Wd):{done:!0,value:r.Wd}):c=(0,u.z)(n)?(0,a.Yl)(t.return)?t.return():{done:!0}:t.next(n),c.done?(1!==s.status&&(s.status=3),s.cont(c.value)):p(c.value,o,h)}catch(n){if(1===s.status)throw n;s.status=2,s.cont(n,!0)}}function p(t,e,r,o){void 0===o&&(o="");var c,a=M();function i(e,o){c||(c=!0,r.cancel=u.t,n.sagaMonitor&&(o?n.sagaMonitor.effectRejected(a,e):n.sagaMonitor.effectResolved(a,e)),o&&function(n){Y=n}(t),r(e,o))}n.sagaMonitor&&n.sagaMonitor.effectTriggered({effectId:a,parentEffectId:e,label:o,effect:t}),i.cancel=u.t,r.cancel=function(){c||(c=!0,i.cancel(),i.cancel=u.t,n.sagaMonitor&&n.sagaMonitor.effectCancelled(a))},l(t,a,i)}}function z(n,t){var e=n.channel,r=void 0===e?j():e,o=n.dispatch,c=n.getState,a=n.context,i=void 0===a?{}:a,l=n.sagaMonitor,s=n.effectMiddlewares,v=n.onError,d=void 0===v?u.B:v;for(var h=arguments.length,p=new Array(h>2?h-2:0),y=2;y<h;y++)p[y-2]=arguments[y];var E=t.apply(void 0,p);var m,S=M();if(l&&(l.rootSagaStarted=l.rootSagaStarted||u.t,l.effectTriggered=l.effectTriggered||u.t,l.effectResolved=l.effectResolved||u.t,l.effectRejected=l.effectRejected||u.t,l.effectCancelled=l.effectCancelled||u.t,l.actionDispatched=l.actionDispatched||u.t,l.rootSagaStarted({effectId:S,saga:t,args:p})),s){var C=f.apply(void 0,s);m=function(n){return function(t,e,r){return C((function(t){return n(t,e,r)}))(t)}}}else m=u.E;var A={channel:r,dispatch:(0,u.D)(o),getState:c,sagaMonitor:l,onError:d,finalizeRunEffect:m};return g((function(){var n=K(A,E,i,S,(0,u.j)(t),!0,void 0);return l&&l.effectResolved(S,n),n}))}const B=function(n){var t,e=void 0===n?{}:n,r=e.context,a=void 0===r?{}:r,i=e.channel,f=void 0===i?j():i,l=e.sagaMonitor,s=(0,c.Z)(e,["context","channel","sagaMonitor"]);function v(n){var e=n.getState,r=n.dispatch;return t=z.bind(null,(0,o.Z)({},s,{context:a,channel:f,dispatch:r,getState:e,sagaMonitor:l})),function(n){return function(t){l&&l.actionDispatched&&l.actionDispatched(t);var e=n(t);return f.put(t),e}}}return v.run=function(){return t.apply(void 0,arguments)},v.setContext=function(n){(0,u.p)(a,n)},v},G=B},4857:(n,t,e)=>{e.d(t,{RE:()=>o.N,gz:()=>o.Y,Ys:()=>o.a3,Fm:()=>l});var r=e(2847),o=e(1666),c=function(n){return{done:!0,value:n}},a={};function u(n){return(0,r.CE)(n)?"channel":(0,r.eR)(n)?String(n):(0,r.Yl)(n)?n.name:String(n)}function i(n,t,e){var r,u,i,f=t;function l(t,e){if(f===a)return c(t);if(e&&!u)throw f=a,e;r&&r(t);var o=e?n[u](e):n[f]();return f=o.nextState,i=o.effect,r=o.stateUpdater,u=o.errorState,f===a?c(t):i}return(0,o.q)(l,(function(n){return l(null,n)}),e)}function f(n,t){for(var e=arguments.length,r=new Array(e>2?e-2:0),c=2;c<e;c++)r[c-2]=arguments[c];var a,f,l={done:!1,value:(0,o.K)(n)},s=function(n){return{done:!1,value:o.L.apply(void 0,[t].concat(r,[n]))}},v=function(n){return{done:!1,value:(0,o.M)(n)}},d=function(n){return a=n},h=function(n){return f=n};return i({q1:function(){return{nextState:"q2",effect:l,stateUpdater:h}},q2:function(){return a?{nextState:"q3",effect:v(a)}:{nextState:"q1",effect:s(f),stateUpdater:d}},q3:function(){return{nextState:"q1",effect:s(f),stateUpdater:d}}},"q1","takeLatest("+u(n)+", "+t.name+")")}function l(n,t){for(var e=arguments.length,r=new Array(e>2?e-2:0),c=2;c<e;c++)r[c-2]=arguments[c];return o.L.apply(void 0,[f,n,t].concat(r))}}}]);