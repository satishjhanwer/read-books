(window.webpackJsonp=window.webpackJsonp||[]).push([[18],{b3ad72bd5af567609a53:function(e,a,t){"use strict";t.r(a),t.d(a,"AuthorDetails",function(){return R});var r=t("8af190b70a6bc55c6f1b"),o=t.n(r),n=(t("8a2d1b95e05b6a321e74"),t("e95a63b25fb92ed15721")),d=t("d7dd51e1bf6bfc2c9c3d"),c=t("ab4cb61bcb2dc161defb"),s=t("ab039aecd4a1d4fedc0e"),i=t("a28fc3c963a1d4d1a2e5"),l=t("d95b0cf107403b178365"),u=t("adc20f99e57c573c589c"),m=t("7edf83707012a871cdfb"),f="app/AuthorDetails/AUTHOR_INFO_REQUEST",b="app/AuthorDetails/AUTHOR_INFO_SUCCESS",v="app/AuthorDetails/AUTHOR_INFO_FAILURE",p={authorId:"",errorMessage:void 0,authorInfo:void 0},g=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:p,a=arguments.length>1?arguments[1]:void 0;return Object(m.a)(e,function(e){switch(a.type){case f:e.authorId=a.id;break;case b:e.authorInfo=a.authorInfo;break;case v:e.errorMessage=a.message}})},h=function(e){return e.authorDetails||p},w=function(){return Object(i.a)(h,function(e){return e.authorId})},M=t("f363639bc5c3c97af546"),N=t("d782b72bc5b680c7122c");var O=regeneratorRuntime.mark(y),k=regeneratorRuntime.mark(F);function y(){var e,a,t;return regeneratorRuntime.wrap(function(r){for(;;)switch(r.prev=r.next){case 0:return r.next=2,Object(N.select)(w());case 2:return e=r.sent,a="/api/author/".concat(e),r.prev=4,r.next=7,Object(N.call)(M.a,a);case 7:return t=r.sent,r.next=10,Object(N.put)({type:b,authorInfo:t});case 10:r.next=16;break;case 12:return r.prev=12,r.t0=r.catch(4),r.next=16,Object(N.put)((o=r.t0,{type:v,message:o}));case 16:case"end":return r.stop()}var o},O,null,[[4,12]])}function F(){return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Object(N.takeLatest)(f,y);case 2:case"end":return e.stop()}},k)}var I,_="app.containers.AuthorDetails",A=Object(s.defineMessages)({header:{id:"".concat(_,".header"),defaultMessage:"Author Details"},about:{id:"".concat(_,".about"),defaultMessage:"About"},fans:{id:"".concat(_,".fans"),defaultMessage:"Total Fans"},followers:{id:"".concat(_,".followers"),defaultMessage:"Total Followers"},gender:{id:"".concat(_,".gender"),defaultMessage:"Gender"},hometown:{id:"".concat(_,".hometown"),defaultMessage:"Hometown"},born:{id:"".concat(_,".born"),defaultMessage:"Born At"},died:{id:"".concat(_,".died"),defaultMessage:"Died At"},books:{id:"".concat(_,".books"),defaultMessage:"Book Published"}});function j(e,a,t,r){I||(I="function"===typeof Symbol&&Symbol.for&&Symbol.for("react.element")||60103);var o=e&&e.defaultProps,n=arguments.length-3;if(a||0===n||(a={children:void 0}),1===n)a.children=r;else if(n>1){for(var d=new Array(n),c=0;c<n;c++)d[c]=arguments[c+3];a.children=d}if(a&&o)for(var s in o)void 0===a[s]&&(a[s]=o[s]);else a||(a=o||{});return{$$typeof:I,type:e,key:void 0===t?null:""+t,ref:null,props:a,_owner:null}}var E="authorDetails",x=j(o.a.Fragment,{}),D=j("hr",{});function R(e){var a=e.match.params.id,t=e.authorInfo,d=e.fetchAuthorInfo;return Object(l.a)({key:E,reducer:g}),Object(u.a)({key:E,saga:F}),Object(r.useEffect)(function(){a&&d(a)},[]),j(o.a.Fragment,{},void 0,t&&j(o.a.Fragment,{},void 0,j("div",{className:"card"},void 0,j("div",{className:"row"},void 0,j("aside",{className:"col-sm-5 border-right"},void 0,j("article",{className:"gallery-wrap"},void 0,j("div",{className:"img-big-wrap"},void 0,j("img",{src:t.image_url,alt:""})),j("div",{className:"img-small-wrap"},void 0,j("h3",{className:"mb-3",style:{marginTop:"20px"}},void 0,o.a.createElement(s.FormattedMessage,A.books)),t.books&&t.books.length>0?t.books.map(function(e){return j("div",{className:"item-gallery"},e.id,j(n.Link,{to:"/book/".concat(e.id)},void 0,j("img",{src:e.small_image_url,alt:""})))}):x))),j("aside",{className:"col-sm-7"},void 0,j("article",{className:"card-body p-5"},void 0,j("h3",{className:"title mb-3"},void 0,t.name),j("dl",{className:"item-property"},void 0,j("dt",{},void 0,o.a.createElement(s.FormattedMessage,A.about)),j("dd",{},void 0,j("p",{dangerouslySetInnerHTML:{__html:t.about}}))),j("dl",{className:"param param-feature"},void 0,j("dt",{},void 0,o.a.createElement(s.FormattedMessage,A.gender)),j("dd",{},void 0,t.gender)),j("dl",{className:"param param-feature"},void 0,j("dt",{},void 0,o.a.createElement(s.FormattedMessage,A.born)),j("dd",{},void 0,t.born_at)),j("dl",{className:"param param-feature"},void 0,j("dt",{},void 0,o.a.createElement(s.FormattedMessage,A.died)),j("dd",{},void 0,t.died_at)),j("dl",{className:"param param-feature"},void 0,j("dt",{},void 0,o.a.createElement(s.FormattedMessage,A.hometown)),j("dd",{},void 0,t.hometown)),j("dl",{className:"param param-feature"},void 0,j("dt",{},void 0,o.a.createElement(s.FormattedMessage,A.followers)),j("dd",{},void 0,t.author_followers_count)),j("dl",{className:"param param-feature"},void 0,j("dt",{},void 0,o.a.createElement(s.FormattedMessage,A.fans)),j("dd",{},void 0,t.fans_count)),D))))))}var S=Object(i.b)({authorInfo:Object(i.a)(h,function(e){return e.authorInfo})});var T=Object(d.connect)(S,function(e){return{fetchAuthorInfo:function(a){return e(function(e){return{type:f,id:e}}(a))}}});a.default=Object(c.compose)(T,r.memo)(R)}}]);