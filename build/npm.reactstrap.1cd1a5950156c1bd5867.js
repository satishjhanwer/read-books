(self.webpackChunkread_books=self.webpackChunkread_books||[]).push([[67],{7975:(e,t,n)=>{"use strict";n.d(t,{Z:()=>b});var o=n(272),s=n(3366),r=n(7326),i=n(1721),a=n(7294),l=n(865),c=n.n(l),u=n(4184),d=n.n(u),f=n(3663),p={active:c().bool,"aria-label":c().string,block:c().bool,color:c().string,disabled:c().bool,outline:c().bool,tag:f.iC,innerRef:c().oneOfType([c().object,c().func,c().string]),onClick:c().func,size:c().string,children:c().node,className:c().string,cssModule:c().object,close:c().bool},g=function(e){function t(t){var n;return(n=e.call(this,t)||this).onClick=n.onClick.bind((0,r.Z)(n)),n}(0,i.Z)(t,e);var n=t.prototype;return n.onClick=function(e){if(!this.props.disabled)return this.props.onClick?this.props.onClick(e):void 0;e.preventDefault()},n.render=function(){var e=this.props,t=e.active,n=e["aria-label"],r=e.block,i=e.className,l=e.close,c=e.cssModule,u=e.color,p=e.outline,g=e.size,b=e.tag,m=e.innerRef,h=(0,s.Z)(e,["active","aria-label","block","className","close","cssModule","color","outline","size","tag","innerRef"]);l&&void 0===h.children&&(h.children=a.createElement("span",{"aria-hidden":!0},"×"));var v="btn"+(p?"-outline":"")+"-"+u,y=(0,f.mx)(d()(i,{close:l},l||"btn",l||v,!!g&&"btn-"+g,!!r&&"btn-block",{active:t,disabled:this.props.disabled}),c);h.href&&"button"===b&&(b="a");var E=l?"Close":null;return a.createElement(b,(0,o.Z)({type:"button"===b&&h.onClick?"button":void 0},h,{className:y,ref:m,onClick:this.onClick,"aria-label":n||E}))},t}(a.Component);g.propTypes=p,g.defaultProps={color:"secondary",tag:"button"};const b=g},1252:(e,t,n)=>{"use strict";n.d(t,{Z:()=>h});var o=n(272),s=n(3366),r=n(7294),i=n(865),a=n.n(i),l=n(4184),c=n.n(l),u=n(3663),d=a().oneOfType([a().number,a().string]),f=a().oneOfType([a().bool,a().number,a().string,a().shape({size:a().oneOfType([a().bool,a().number,a().string]),order:d,offset:d})]),p={tag:u.iC,xs:f,sm:f,md:f,lg:f,xl:f,className:a().string,cssModule:a().object,widths:a().array},g={tag:"div",widths:["xs","sm","md","lg","xl"]},b=function(e,t,n){return!0===n||""===n?e?"col":"col-"+t:"auto"===n?e?"col-auto":"col-"+t+"-auto":e?"col-"+n:"col-"+t+"-"+n},m=function(e){var t=e.className,n=e.cssModule,i=e.widths,a=e.tag,l=(0,s.Z)(e,["className","cssModule","widths","tag"]),d=[];i.forEach((function(t,o){var s=e[t];if(delete l[t],s||""===s){var r=!o;if((0,u.Kn)(s)){var i,a=r?"-":"-"+t+"-",f=b(r,t,s.size);d.push((0,u.mx)(c()(((i={})[f]=s.size||""===s.size,i["order"+a+s.order]=s.order||0===s.order,i["offset"+a+s.offset]=s.offset||0===s.offset,i)),n))}else{var p=b(r,t,s);d.push(p)}}})),d.length||d.push("col");var f=(0,u.mx)(c()(t,d),n);return r.createElement(a,(0,o.Z)({},l,{className:f}))};m.propTypes=p,m.defaultProps=g;const h=m},627:(e,t,n)=>{"use strict";n.d(t,{Z:()=>O});var o,s=n(272),r=n(3366),i=n(7326),a=n(1721),l=n(4942),c=n(7294),u=n(865),d=n.n(u),f=n(4184),p=n.n(f),g=n(4317),b=n(3663);function m(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function h(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?m(Object(n),!0).forEach((function(t){(0,l.Z)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):m(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var v=h(h({},g.Transition.propTypes),{},{isOpen:d().bool,children:d().oneOfType([d().arrayOf(d().node),d().node]),tag:b.iC,className:d().node,navbar:d().bool,cssModule:d().object,innerRef:d().oneOfType([d().func,d().string,d().object])}),y=h(h({},g.Transition.defaultProps),{},{isOpen:!1,appear:!1,enter:!0,exit:!0,tag:"div",timeout:b.wF.Collapse}),E=((o={})[b.E5.ENTERING]="collapsing",o[b.E5.ENTERED]="collapse show",o[b.E5.EXITING]="collapsing",o[b.E5.EXITED]="collapse",o);function x(e){return e.scrollHeight}var N=function(e){function t(t){var n;return(n=e.call(this,t)||this).state={height:null},["onEntering","onEntered","onExit","onExiting","onExited"].forEach((function(e){n[e]=n[e].bind((0,i.Z)(n))})),n}(0,a.Z)(t,e);var n=t.prototype;return n.onEntering=function(e,t){this.setState({height:x(e)}),this.props.onEntering(e,t)},n.onEntered=function(e,t){this.setState({height:null}),this.props.onEntered(e,t)},n.onExit=function(e){this.setState({height:x(e)}),this.props.onExit(e)},n.onExiting=function(e){e.offsetHeight;this.setState({height:0}),this.props.onExiting(e)},n.onExited=function(e){this.setState({height:null}),this.props.onExited(e)},n.render=function(){var e=this,t=this.props,n=t.tag,o=t.isOpen,i=t.className,a=t.navbar,l=t.cssModule,u=t.children,d=(t.innerRef,(0,r.Z)(t,["tag","isOpen","className","navbar","cssModule","children","innerRef"])),f=this.state.height,m=(0,b.ei)(d,b.rb),v=(0,b.CE)(d,b.rb);return c.createElement(g.Transition,(0,s.Z)({},m,{in:o,onEntering:this.onEntering,onEntered:this.onEntered,onExit:this.onExit,onExiting:this.onExiting,onExited:this.onExited}),(function(t){var o=function(e){return E[e]||"collapse"}(t),r=(0,b.mx)(p()(i,o,a&&"navbar-collapse"),l),d=null===f?null:{height:f};return c.createElement(n,(0,s.Z)({},v,{style:h(h({},v.style),d),className:r,ref:e.props.innerRef}),u)}))},t}(c.Component);N.propTypes=v,N.defaultProps=y;const O=N},3703:(e,t,n)=>{"use strict";n.d(t,{Z:()=>p});var o=n(272),s=n(3366),r=n(7294),i=n(865),a=n.n(i),l=n(4184),c=n.n(l),u=n(3663),d={tag:u.iC,fluid:a().oneOfType([a().bool,a().string]),className:a().string,cssModule:a().object},f=function(e){var t=e.className,n=e.cssModule,i=e.fluid,a=e.tag,l=(0,s.Z)(e,["className","cssModule","fluid","tag"]),d="container";!0===i?d="container-fluid":i&&(d="container-"+i);var f=(0,u.mx)(c()(t,d),n);return r.createElement(a,(0,o.Z)({},l,{className:f}))};f.propTypes=d,f.defaultProps={tag:"div"};const p=f},5538:(e,t,n)=>{"use strict";n.d(t,{Z:()=>b});var o=n(272),s=n(3366),r=n(7326),i=n(1721),a=n(7294),l=n(865),c=n.n(l),u=n(4184),d=n.n(u),f=n(3663),p={children:c().node,inline:c().bool,tag:f.iC,innerRef:c().oneOfType([c().object,c().func,c().string]),className:c().string,cssModule:c().object},g=function(e){function t(t){var n;return(n=e.call(this,t)||this).getRef=n.getRef.bind((0,r.Z)(n)),n.submit=n.submit.bind((0,r.Z)(n)),n}(0,i.Z)(t,e);var n=t.prototype;return n.getRef=function(e){this.props.innerRef&&this.props.innerRef(e),this.ref=e},n.submit=function(){this.ref&&this.ref.submit()},n.render=function(){var e=this.props,t=e.className,n=e.cssModule,r=e.inline,i=e.tag,l=e.innerRef,c=(0,s.Z)(e,["className","cssModule","inline","tag","innerRef"]),u=(0,f.mx)(d()(t,!!r&&"form-inline"),n);return a.createElement(i,(0,o.Z)({},c,{ref:l,className:u}))},t}(a.Component);g.propTypes=p,g.defaultProps={tag:"form"};const b=g},2669:(e,t,n)=>{"use strict";n.d(t,{Z:()=>p});var o=n(272),s=n(3366),r=n(7294),i=n(865),a=n.n(i),l=n(4184),c=n.n(l),u=n(3663),d={children:a().node,row:a().bool,check:a().bool,inline:a().bool,disabled:a().bool,tag:u.iC,className:a().string,cssModule:a().object},f=function(e){var t=e.className,n=e.cssModule,i=e.row,a=e.disabled,l=e.check,d=e.inline,f=e.tag,p=(0,s.Z)(e,["className","cssModule","row","disabled","check","inline","tag"]),g=(0,u.mx)(c()(t,!!i&&"row",l?"form-check":"form-group",!(!l||!d)&&"form-check-inline",!(!l||!a)&&"disabled"),n);return"fieldset"===f&&(p.disabled=a),r.createElement(f,(0,o.Z)({},p,{className:g}))};f.propTypes=d,f.defaultProps={tag:"div"};const p=f},4670:(e,t,n)=>{"use strict";n.d(t,{Z:()=>b});var o=n(272),s=n(3366),r=n(7326),i=n(1721),a=n(7294),l=n(865),c=n.n(l),u=n(4184),d=n.n(u),f=n(3663),p={children:c().node,type:c().string,size:c().oneOfType([c().number,c().string]),bsSize:c().string,valid:c().bool,invalid:c().bool,tag:f.iC,innerRef:c().oneOfType([c().object,c().func,c().string]),plaintext:c().bool,addon:c().bool,className:c().string,cssModule:c().object},g=function(e){function t(t){var n;return(n=e.call(this,t)||this).getRef=n.getRef.bind((0,r.Z)(n)),n.focus=n.focus.bind((0,r.Z)(n)),n}(0,i.Z)(t,e);var n=t.prototype;return n.getRef=function(e){this.props.innerRef&&this.props.innerRef(e),this.ref=e},n.focus=function(){this.ref&&this.ref.focus()},n.render=function(){var e=this.props,t=e.className,n=e.cssModule,r=e.type,i=e.bsSize,l=e.valid,c=e.invalid,u=e.tag,p=e.addon,g=e.plaintext,b=e.innerRef,m=(0,s.Z)(e,["className","cssModule","type","bsSize","valid","invalid","tag","addon","plaintext","innerRef"]),h=["radio","checkbox"].indexOf(r)>-1,v=new RegExp("\\D","g"),y=u||("select"===r||"textarea"===r?r:"input"),E="form-control";g?(E+="-plaintext",y=u||"input"):"file"===r?E+="-file":"range"===r?E+="-range":h&&(E=p?null:"form-check-input"),m.size&&v.test(m.size)&&((0,f.O4)('Please use the prop "bsSize" instead of the "size" to bootstrap\'s input sizing.'),i=m.size,delete m.size);var x=(0,f.mx)(d()(t,c&&"is-invalid",l&&"is-valid",!!i&&"form-control-"+i,E),n);return("input"===y||u&&"function"==typeof u)&&(m.type=r),m.children&&!g&&"select"!==r&&"string"==typeof y&&"select"!==y&&((0,f.O4)('Input with a type of "'+r+'" cannot have children. Please use "value"/"defaultValue" instead.'),delete m.children),a.createElement(y,(0,o.Z)({},m,{ref:b,className:x,"aria-invalid":c}))},t}(a.Component);g.propTypes=p,g.defaultProps={type:"text"};const b=g},7954:(e,t,n)=>{"use strict";n.d(t,{Z:()=>h});var o=n(272),s=n(3366),r=n(7294),i=n(865),a=n.n(i),l=n(4184),c=n.n(l),u=n(3663),d=a().oneOfType([a().number,a().string]),f=a().oneOfType([a().bool,a().string,a().number,a().shape({size:d,order:d,offset:d})]),p={children:a().node,hidden:a().bool,check:a().bool,size:a().string,for:a().string,tag:u.iC,className:a().string,cssModule:a().object,xs:f,sm:f,md:f,lg:f,xl:f,widths:a().array},g={tag:"label",widths:["xs","sm","md","lg","xl"]},b=function(e,t,n){return!0===n||""===n?e?"col":"col-"+t:"auto"===n?e?"col-auto":"col-"+t+"-auto":e?"col-"+n:"col-"+t+"-"+n},m=function(e){var t=e.className,n=e.cssModule,i=e.hidden,a=e.widths,l=e.tag,d=e.check,f=e.size,p=e.for,g=(0,s.Z)(e,["className","cssModule","hidden","widths","tag","check","size","for"]),m=[];a.forEach((function(t,o){var s=e[t];if(delete g[t],s||""===s){var r,i=!o;if((0,u.Kn)(s)){var a,l=i?"-":"-"+t+"-";r=b(i,t,s.size),m.push((0,u.mx)(c()(((a={})[r]=s.size||""===s.size,a["order"+l+s.order]=s.order||0===s.order,a["offset"+l+s.offset]=s.offset||0===s.offset,a))),n)}else r=b(i,t,s),m.push(r)}}));var h=(0,u.mx)(c()(t,!!i&&"sr-only",!!d&&"form-check-label",!!f&&"col-form-label-"+f,m,!!m.length&&"col-form-label"),n);return r.createElement(l,(0,o.Z)({htmlFor:p},g,{className:h}))};m.propTypes=p,m.defaultProps=g;const h=m},7243:(e,t,n)=>{"use strict";n.d(t,{Z:()=>p});var o=n(272),s=n(3366),r=n(7294),i=n(865),a=n.n(i),l=n(4184),c=n.n(l),u=n(3663),d={tabs:a().bool,pills:a().bool,vertical:a().oneOfType([a().bool,a().string]),horizontal:a().string,justified:a().bool,fill:a().bool,navbar:a().bool,card:a().bool,tag:u.iC,className:a().string,cssModule:a().object},f=function(e){var t=e.className,n=e.cssModule,i=e.tabs,a=e.pills,l=e.vertical,d=e.horizontal,f=e.justified,p=e.fill,g=e.navbar,b=e.card,m=e.tag,h=(0,s.Z)(e,["className","cssModule","tabs","pills","vertical","horizontal","justified","fill","navbar","card","tag"]),v=(0,u.mx)(c()(t,g?"navbar-nav":"nav",!!d&&"justify-content-"+d,function(e){return!1!==e&&(!0===e||"xs"===e?"flex-column":"flex-"+e+"-column")}(l),{"nav-tabs":i,"card-header-tabs":b&&i,"nav-pills":a,"card-header-pills":b&&a,"nav-justified":f,"nav-fill":p}),n);return r.createElement(m,(0,o.Z)({},h,{className:v}))};f.propTypes=d,f.defaultProps={tag:"ul",vertical:!1};const p=f},3999:(e,t,n)=>{"use strict";n.d(t,{Z:()=>p});var o=n(272),s=n(3366),r=n(7294),i=n(865),a=n.n(i),l=n(4184),c=n.n(l),u=n(3663),d={tag:u.iC,active:a().bool,className:a().string,cssModule:a().object},f=function(e){var t=e.className,n=e.cssModule,i=e.active,a=e.tag,l=(0,s.Z)(e,["className","cssModule","active","tag"]),d=(0,u.mx)(c()(t,"nav-item",!!i&&"active"),n);return r.createElement(a,(0,o.Z)({},l,{className:d}))};f.propTypes=d,f.defaultProps={tag:"li"};const p=f},8008:(e,t,n)=>{"use strict";n.d(t,{Z:()=>b});var o=n(272),s=n(3366),r=n(7326),i=n(1721),a=n(7294),l=n(865),c=n.n(l),u=n(4184),d=n.n(u),f=n(3663),p={tag:f.iC,innerRef:c().oneOfType([c().object,c().func,c().string]),disabled:c().bool,active:c().bool,className:c().string,cssModule:c().object,onClick:c().func,href:c().any},g=function(e){function t(t){var n;return(n=e.call(this,t)||this).onClick=n.onClick.bind((0,r.Z)(n)),n}(0,i.Z)(t,e);var n=t.prototype;return n.onClick=function(e){this.props.disabled?e.preventDefault():("#"===this.props.href&&e.preventDefault(),this.props.onClick&&this.props.onClick(e))},n.render=function(){var e=this.props,t=e.className,n=e.cssModule,r=e.active,i=e.tag,l=e.innerRef,c=(0,s.Z)(e,["className","cssModule","active","tag","innerRef"]),u=(0,f.mx)(d()(t,"nav-link",{disabled:c.disabled,active:r}),n);return a.createElement(i,(0,o.Z)({},c,{ref:l,onClick:this.onClick,className:u}))},t}(a.Component);g.propTypes=p,g.defaultProps={tag:"a"};const b=g},9544:(e,t,n)=>{"use strict";n.d(t,{Z:()=>p});var o=n(272),s=n(3366),r=n(7294),i=n(865),a=n.n(i),l=n(4184),c=n.n(l),u=n(3663),d={light:a().bool,dark:a().bool,full:a().bool,fixed:a().string,sticky:a().string,color:a().string,role:a().string,tag:u.iC,className:a().string,cssModule:a().object,expand:a().oneOfType([a().bool,a().string])},f=function(e){var t,n=e.expand,i=e.className,a=e.cssModule,l=e.light,d=e.dark,f=e.fixed,p=e.sticky,g=e.color,b=e.tag,m=(0,s.Z)(e,["expand","className","cssModule","light","dark","fixed","sticky","color","tag"]),h=(0,u.mx)(c()(i,"navbar",function(e){return!1!==e&&(!0===e||"xs"===e?"navbar-expand":"navbar-expand-"+e)}(n),((t={"navbar-light":l,"navbar-dark":d})["bg-"+g]=g,t["fixed-"+f]=f,t["sticky-"+p]=p,t)),a);return r.createElement(b,(0,o.Z)({},m,{className:h}))};f.propTypes=d,f.defaultProps={tag:"nav",expand:!1};const p=f},6992:(e,t,n)=>{"use strict";n.d(t,{Z:()=>p});var o=n(272),s=n(3366),r=n(7294),i=n(865),a=n.n(i),l=n(4184),c=n.n(l),u=n(3663),d={tag:u.iC,className:a().string,cssModule:a().object},f=function(e){var t=e.className,n=e.cssModule,i=e.tag,a=(0,s.Z)(e,["className","cssModule","tag"]),l=(0,u.mx)(c()(t,"navbar-brand"),n);return r.createElement(i,(0,o.Z)({},a,{className:l}))};f.propTypes=d,f.defaultProps={tag:"a"};const p=f},5614:(e,t,n)=>{"use strict";n.d(t,{Z:()=>p});var o=n(272),s=n(3366),r=n(7294),i=n(865),a=n.n(i),l=n(4184),c=n.n(l),u=n(3663),d={tag:u.iC,type:a().string,className:a().string,cssModule:a().object,children:a().node},f=function(e){var t=e.className,n=e.cssModule,i=e.children,a=e.tag,l=(0,s.Z)(e,["className","cssModule","children","tag"]),d=(0,u.mx)(c()(t,"navbar-toggler"),n);return r.createElement(a,(0,o.Z)({"aria-label":"Toggle navigation"},l,{className:d}),i||r.createElement("span",{className:(0,u.mx)("navbar-toggler-icon",n)}))};f.propTypes=d,f.defaultProps={tag:"button",type:"button"};const p=f},267:(e,t,n)=>{"use strict";n.d(t,{Z:()=>b});var o=n(272),s=n(3366),r=n(7294),i=n(865),a=n.n(i),l=n(4184),c=n.n(l),u=n(3663),d=a().oneOfType([a().number,a().string]),f={tag:u.iC,noGutters:a().bool,className:a().string,cssModule:a().object,form:a().bool,xs:d,sm:d,md:d,lg:d,xl:d},p={tag:"div",widths:["xs","sm","md","lg","xl"]},g=function(e){var t=e.className,n=e.cssModule,i=e.noGutters,a=e.tag,l=e.form,d=e.widths,f=(0,s.Z)(e,["className","cssModule","noGutters","tag","form","widths"]),p=[];d.forEach((function(t,n){var o=e[t];if(delete f[t],o){var s=!n;p.push(s?"row-cols-"+o:"row-cols-"+t+"-"+o)}}));var g=(0,u.mx)(c()(t,i?"no-gutters":null,l?"form-row":"row",p),n);return r.createElement(a,(0,o.Z)({},f,{className:g}))};g.propTypes=f,g.defaultProps=p;const b=g},3663:(e,t,n)=>{"use strict";n.d(t,{CE:()=>a,E5:()=>b,Kn:()=>m,O4:()=>u,ei:()=>l,iC:()=>f,mx:()=>i,rb:()=>g,wF:()=>p});var o,s=n(865),r=n.n(s);function i(e,t){return void 0===e&&(e=""),void 0===t&&(t=o),t?e.split(" ").map((function(e){return t[e]||e})).join(" "):e}function a(e,t){var n={};return Object.keys(e).forEach((function(o){-1===t.indexOf(o)&&(n[o]=e[o])})),n}function l(e,t){for(var n,o=Array.isArray(t)?t:[t],s=o.length,r={};s>0;)r[n=o[s-=1]]=e[n];return r}var c={};function u(e){c[e]||("undefined"!=typeof console&&console.error(e),c[e]=!0)}var d="object"==typeof window&&window.Element||function(){};r().oneOfType([r().string,r().func,function(e,t,n){if(!(e[t]instanceof d))return new Error("Invalid prop `"+t+"` supplied to `"+n+"`. Expected prop to be an instance of Element. Validation failed.")},r().shape({current:r().any})]);var f=r().oneOfType([r().func,r().string,r().shape({$$typeof:r().symbol,render:r().func}),r().arrayOf(r().oneOfType([r().func,r().string,r().shape({$$typeof:r().symbol,render:r().func})]))]),p={Fade:150,Collapse:350,Modal:300,Carousel:600},g=["in","mountOnEnter","unmountOnExit","appear","enter","exit","timeout","onEnter","onEntering","onEntered","onExit","onExiting","onExited"],b={ENTERING:"entering",ENTERED:"entered",EXITING:"exiting",EXITED:"exited"};"undefined"==typeof window||!window.document||window.document.createElement;function m(e){var t=typeof e;return null!=e&&("object"===t||"function"===t)}},1132:(e,t,n)=>{"use strict";var o=n(3209);function s(){}function r(){}r.resetWarningCache=s,e.exports=function(){function e(e,t,n,s,r,i){if(i!==o){var a=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw a.name="Invariant Violation",a}}function t(){return e}e.isRequired=e;var n={array:e,bool:e,func:e,number:e,object:e,string:e,symbol:e,any:e,arrayOf:t,element:e,elementType:e,instanceOf:t,node:e,objectOf:t,oneOf:t,oneOfType:t,shape:t,exact:t,checkPropTypes:r,resetWarningCache:s};return n.PropTypes=n,n}},865:(e,t,n)=>{e.exports=n(1132)()},3209:e=>{"use strict";e.exports="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED"}}]);