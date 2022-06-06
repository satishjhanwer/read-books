"use strict";(self.webpackChunkread_books=self.webpackChunkread_books||[]).push([[109],{829:(e,t,r)=>{r.d(t,{Qc:()=>A});var n=r(655),a=r(2419),i=/(?:[Eec]{1,6}|G{1,5}|[Qq]{1,5}|(?:[yYur]+|U{1,5})|[ML]{1,5}|d{1,2}|D{1,3}|F{1}|[abB]{1,5}|[hkHK]{1,2}|w{1,2}|W{1}|m{1,2}|s{1,2}|[zZOvVxX]{1,4})(?=([^']*'[^']*')*[^']*$)/g;var u=/^\.(?:(0+)(\*)?|(#+)|(0+)(#+))$/g,o=/^(@+)?(\+|#+)?$/g,c=/(\*)(0+)|(#+)(0+)|(0+)/g,s=/^(0+)$/;function l(e){var t={};return e.replace(o,(function(e,r,n){return"string"!=typeof n?(t.minimumSignificantDigits=r.length,t.maximumSignificantDigits=r.length):"+"===n?t.minimumSignificantDigits=r.length:"#"===r[0]?t.maximumSignificantDigits=r.length:(t.minimumSignificantDigits=r.length,t.maximumSignificantDigits=r.length+("string"==typeof n?n.length:0)),""})),t}function p(e){switch(e){case"sign-auto":return{signDisplay:"auto"};case"sign-accounting":case"()":return{currencySign:"accounting"};case"sign-always":case"+!":return{signDisplay:"always"};case"sign-accounting-always":case"()!":return{signDisplay:"always",currencySign:"accounting"};case"sign-except-zero":case"+?":return{signDisplay:"exceptZero"};case"sign-accounting-except-zero":case"()?":return{signDisplay:"exceptZero",currencySign:"accounting"};case"sign-never":case"+_":return{signDisplay:"never"}}}function f(e){var t;if("E"===e[0]&&"E"===e[1]?(t={notation:"engineering"},e=e.slice(2)):"E"===e[0]&&(t={notation:"scientific"},e=e.slice(1)),t){var r=e.slice(0,2);if("+!"===r?(t.signDisplay="always",e=e.slice(2)):"+?"===r&&(t.signDisplay="exceptZero",e=e.slice(2)),!s.test(e))throw new Error("Malformed concise eng/scientific notation");t.minimumIntegerDigits=e.length}return t}function h(e){var t=p(e);return t||{}}function g(e){for(var t={},r=0,a=e;r<a.length;r++){var i=a[r];switch(i.stem){case"percent":case"%":t.style="percent";continue;case"%x100":t.style="percent",t.scale=100;continue;case"currency":t.style="currency",t.currency=i.options[0];continue;case"group-off":case",_":t.useGrouping=!1;continue;case"precision-integer":case".":t.maximumFractionDigits=0;continue;case"measure-unit":case"unit":t.style="unit",t.unit=i.options[0].replace(/^(.*?)-/,"");continue;case"compact-short":case"K":t.notation="compact",t.compactDisplay="short";continue;case"compact-long":case"KK":t.notation="compact",t.compactDisplay="long";continue;case"scientific":t=(0,n.pi)((0,n.pi)((0,n.pi)({},t),{notation:"scientific"}),i.options.reduce((function(e,t){return(0,n.pi)((0,n.pi)({},e),h(t))}),{}));continue;case"engineering":t=(0,n.pi)((0,n.pi)((0,n.pi)({},t),{notation:"engineering"}),i.options.reduce((function(e,t){return(0,n.pi)((0,n.pi)({},e),h(t))}),{}));continue;case"notation-simple":t.notation="standard";continue;case"unit-width-narrow":t.currencyDisplay="narrowSymbol",t.unitDisplay="narrow";continue;case"unit-width-short":t.currencyDisplay="code",t.unitDisplay="short";continue;case"unit-width-full-name":t.currencyDisplay="name",t.unitDisplay="long";continue;case"unit-width-iso-code":t.currencyDisplay="symbol";continue;case"scale":t.scale=parseFloat(i.options[0]);continue;case"integer-width":if(i.options.length>1)throw new RangeError("integer-width stems only accept a single optional option");i.options[0].replace(c,(function(e,r,n,a,i,u){if(r)t.minimumIntegerDigits=n.length;else{if(a&&i)throw new Error("We currently do not support maximum integer digits");if(u)throw new Error("We currently do not support exact integer digits")}return""}));continue}if(s.test(i.stem))t.minimumIntegerDigits=i.stem.length;else if(u.test(i.stem)){if(i.options.length>1)throw new RangeError("Fraction-precision stems only accept a single optional option");i.stem.replace(u,(function(e,r,n,a,i,u){return"*"===n?t.minimumFractionDigits=r.length:a&&"#"===a[0]?t.maximumFractionDigits=a.length:i&&u?(t.minimumFractionDigits=i.length,t.maximumFractionDigits=i.length+u.length):(t.minimumFractionDigits=r.length,t.maximumFractionDigits=r.length),""})),i.options.length&&(t=(0,n.pi)((0,n.pi)({},t),l(i.options[0])))}else if(o.test(i.stem))t=(0,n.pi)((0,n.pi)({},t),l(i.stem));else{var g=p(i.stem);g&&(t=(0,n.pi)((0,n.pi)({},t),g));var d=f(i.stem);d&&(t=(0,n.pi)((0,n.pi)({},t),d))}}return t}var d=function(e){function t(r,n,a,i){var u=e.call(this)||this;return u.message=r,u.expected=n,u.found=a,u.location=i,u.name="SyntaxError","function"==typeof Error.captureStackTrace&&Error.captureStackTrace(u,t),u}return(0,n.ZT)(t,e),t.buildMessage=function(e,t){function r(e){return e.charCodeAt(0).toString(16).toUpperCase()}function n(e){return e.replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/\0/g,"\\0").replace(/\t/g,"\\t").replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/[\x00-\x0F]/g,(function(e){return"\\x0"+r(e)})).replace(/[\x10-\x1F\x7F-\x9F]/g,(function(e){return"\\x"+r(e)}))}function a(e){return e.replace(/\\/g,"\\\\").replace(/\]/g,"\\]").replace(/\^/g,"\\^").replace(/-/g,"\\-").replace(/\0/g,"\\0").replace(/\t/g,"\\t").replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/[\x00-\x0F]/g,(function(e){return"\\x0"+r(e)})).replace(/[\x10-\x1F\x7F-\x9F]/g,(function(e){return"\\x"+r(e)}))}function i(e){switch(e.type){case"literal":return'"'+n(e.text)+'"';case"class":var t=e.parts.map((function(e){return Array.isArray(e)?a(e[0])+"-"+a(e[1]):a(e)}));return"["+(e.inverted?"^":"")+t+"]";case"any":return"any character";case"end":return"end of input";case"other":return e.description}}return"Expected "+function(e){var t,r,n=e.map(i);if(n.sort(),n.length>0){for(t=1,r=1;t<n.length;t++)n[t-1]!==n[t]&&(n[r]=n[t],r++);n.length=r}switch(n.length){case 1:return n[0];case 2:return n[0]+" or "+n[1];default:return n.slice(0,-1).join(", ")+", or "+n[n.length-1]}}(e)+" but "+(((u=t)?'"'+n(u)+'"':"end of input")+" found.");var u},t}(Error);var m=function(e,t){t=void 0!==t?t:{};var r,u={},o={start:Pe},c=Pe,s="<",l=Ke("<",!1),p=function(e){return e.join("")},f=Ke("#",!1),h=Ne("tagElement"),m=Ke("/>",!1),v=Ke(">",!1),y=Ke("</",!1),A=Ne("argumentElement"),w="{",b=Ke("{",!1),x="}",C=Ke("}",!1),D=Ne("numberSkeletonId"),k=/^['\/{}]/,E=Me(["'","/","{","}"],!1,!1),F={type:"any"},S=Ne("numberSkeletonTokenOption"),R=Ke("/",!1),T=Ne("numberSkeletonToken"),Z="::",z=Ke("::",!1),B=function(e){return At.pop(),e.replace(/\s*$/,"")},O=",",j=Ke(",",!1),I="number",W=Ke("number",!1),V=function(e,t,r){return(0,n.pi)({type:"number"===t?a.wD.number:"date"===t?a.wD.date:a.wD.time,style:r&&r[2],value:e},bt())},H="'",K=Ke("'",!1),M=/^[^']/,N=Me(["'"],!0,!1),$=/^[^a-zA-Z'{}]/,q=Me([["a","z"],["A","Z"],"'","{","}"],!0,!1),G=/^[a-zA-Z]/,J=Me([["a","z"],["A","Z"]],!1,!1),P="date",Q=Ke("date",!1),U="time",_=Ke("time",!1),L="plural",X=Ke("plural",!1),Y="selectordinal",ee=Ke("selectordinal",!1),te="offset:",re=Ke("offset:",!1),ne="select",ae=Ke("select",!1),ie=Ke("=",!1),ue=Ne("whitespace"),oe=/^[\t-\r \x85\xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/,ce=Me([["\t","\r"]," ",""," "," ",[" "," "],"\u2028","\u2029"," "," ","　"],!1,!1),se=Ne("syntax pattern"),le=/^[!-\/:-@[-\^`{-~\xA1-\xA7\xA9\xAB\xAC\xAE\xB0\xB1\xB6\xBB\xBF\xD7\xF7\u2010-\u2027\u2030-\u203E\u2041-\u2053\u2055-\u205E\u2190-\u245F\u2500-\u2775\u2794-\u2BFF\u2E00-\u2E7F\u3001-\u3003\u3008-\u3020\u3030\uFD3E\uFD3F\uFE45\uFE46]/,pe=Me([["!","/"],[":","@"],["[","^"],"`",["{","~"],["¡","§"],"©","«","¬","®","°","±","¶","»","¿","×","÷",["‐","‧"],["‰","‾"],["⁁","⁓"],["⁕","⁞"],["←","⑟"],["─","❵"],["➔","⯿"],["⸀","⹿"],["、","〃"],["〈","〠"],"〰","﴾","﴿","﹅","﹆"],!1,!1),fe=Ne("optional whitespace"),he=Ne("number"),ge="-",de=Ke("-",!1),me=(Ne("apostrophe"),Ne("double apostrophes")),ve="''",ye=Ke("''",!1),Ae=function(e){return!("<"===e||"{"===e||wt()&&"#"===e||At.length>1&&"}"===e)},we=Ke("\n",!1),be=Ne("argNameOrNumber"),xe=Ne("validTag"),Ce=Ne("argNumber"),De=Ke("0",!1),ke=/^[1-9]/,Ee=Me([["1","9"]],!1,!1),Fe=/^[0-9]/,Se=Me([["0","9"]],!1,!1),Re=Ne("argName"),Te=Ne("tagName"),Ze=0,ze=0,Be=[{line:1,column:1}],Oe=0,je=[],Ie=0;if(void 0!==t.startRule){if(!(t.startRule in o))throw new Error("Can't start parsing from rule \""+t.startRule+'".');c=o[t.startRule]}function We(){return e.substring(ze,Ze)}function Ve(){return qe(ze,Ze)}function He(e,t){throw function(e,t){return new d(e,[],"",t)}(e,t=void 0!==t?t:qe(ze,Ze))}function Ke(e,t){return{type:"literal",text:e,ignoreCase:t}}function Me(e,t,r){return{type:"class",parts:e,inverted:t,ignoreCase:r}}function Ne(e){return{type:"other",description:e}}function $e(t){var r,n=Be[t];if(n)return n;for(r=t-1;!Be[r];)r--;for(n={line:(n=Be[r]).line,column:n.column};r<t;)10===e.charCodeAt(r)?(n.line++,n.column=1):n.column++,r++;return Be[t]=n,n}function qe(e,t){var r=$e(e),n=$e(t);return{start:{offset:e,line:r.line,column:r.column},end:{offset:t,line:n.line,column:n.column}}}function Ge(e){Ze<Oe||(Ze>Oe&&(Oe=Ze,je=[]),je.push(e))}function Je(e,t,r){return new d(d.buildMessage(e,t),e,t,r)}function Pe(){return Qe()}function Qe(){var e,t;for(e=[],t=Ue();t!==u;)e.push(t),t=Ue();return e}function Ue(){var t,r;return t=Ze,ze=Ze,(!xt?void 0:u)!==u?(r=function(){var e,t,r,i;Ie++,(e=Xe())===u&&(e=Ze,(t=Ye())!==u&&(r=Qe())!==u&&(i=et())!==u?(ze=e,c=r,(o=t)!==(s=i)&&He('Mismatch tag "'+o+'" !== "'+s+'"',Ve()),e=t=(0,n.pi)({type:a.wD.tag,value:o,children:c},bt())):(Ze=e,e=u));var o,c,s;Ie--,e===u&&(t=u,0===Ie&&Ge(h));return e}(),r!==u?(ze=t,t=r):(Ze=t,t=u)):(Ze=t,t=u),t===u&&(t=function(){var e,t;e=Ze,(t=_e())!==u&&(ze=e,r=t,t=(0,n.pi)({type:a.wD.literal,value:r},bt()));var r;return e=t}(),t===u&&(t=function(){var t,r,i,o;Ie++,t=Ze,123===e.charCodeAt(Ze)?(r=w,Ze++):(r=u,0===Ie&&Ge(b));r!==u&&lt()!==u&&(i=dt())!==u&&lt()!==u?(125===e.charCodeAt(Ze)?(o=x,Ze++):(o=u,0===Ie&&Ge(C)),o!==u?(ze=t,c=i,t=r=(0,n.pi)({type:a.wD.argument,value:c},bt())):(Ze=t,t=u)):(Ze=t,t=u);var c;Ie--,t===u&&(r=u,0===Ie&&Ge(A));return t}(),t===u&&(t=function(){var t;t=function(){var t,r,i,o,c,s,l,p,f;t=Ze,123===e.charCodeAt(Ze)?(r=w,Ze++):(r=u,0===Ie&&Ge(b));r!==u&&lt()!==u&&(i=dt())!==u&&lt()!==u?(44===e.charCodeAt(Ze)?(o=O,Ze++):(o=u,0===Ie&&Ge(j)),o!==u&&lt()!==u?(e.substr(Ze,6)===I?(c=I,Ze+=6):(c=u,0===Ie&&Ge(W)),c!==u&&lt()!==u?(s=Ze,44===e.charCodeAt(Ze)?(l=O,Ze++):(l=u,0===Ie&&Ge(j)),l!==u&&(p=lt())!==u?(f=function(){var t,r,i;t=Ze,e.substr(Ze,2)===Z?(r=Z,Ze+=2):(r=u,0===Ie&&Ge(z));r!==u?(i=function(){var e,t,r;if(e=Ze,t=[],(r=nt())!==u)for(;r!==u;)t.push(r),r=nt();else t=u;t!==u&&(ze=e,i=t,t=(0,n.pi)({type:a.aV.number,tokens:i,parsedOptions:Ct?g(i):{}},bt()));var i;return e=t}(),i!==u?(ze=t,t=r=i):(Ze=t,t=u)):(Ze=t,t=u);t===u&&(t=Ze,ze=Ze,At.push("numberArgStyle"),(r=(r=!0)?void 0:u)!==u&&(i=_e())!==u?(ze=t,t=r=B(i)):(Ze=t,t=u));return t}(),f!==u?s=l=[l,p,f]:(Ze=s,s=u)):(Ze=s,s=u),s===u&&(s=null),s!==u&&(l=lt())!==u?(125===e.charCodeAt(Ze)?(p=x,Ze++):(p=u,0===Ie&&Ge(C)),p!==u?(ze=t,t=r=V(i,c,s)):(Ze=t,t=u)):(Ze=t,t=u)):(Ze=t,t=u)):(Ze=t,t=u)):(Ze=t,t=u);return t}(),t===u&&(t=function(){var t,r,o,c,s,l,p,f,h;t=Ze,123===e.charCodeAt(Ze)?(r=w,Ze++):(r=u,0===Ie&&Ge(b));r!==u&&lt()!==u&&(o=dt())!==u&&lt()!==u?(44===e.charCodeAt(Ze)?(c=O,Ze++):(c=u,0===Ie&&Ge(j)),c!==u&&lt()!==u?(e.substr(Ze,4)===P?(s=P,Ze+=4):(s=u,0===Ie&&Ge(Q)),s===u&&(e.substr(Ze,4)===U?(s=U,Ze+=4):(s=u,0===Ie&&Ge(_))),s!==u&&lt()!==u?(l=Ze,44===e.charCodeAt(Ze)?(p=O,Ze++):(p=u,0===Ie&&Ge(j)),p!==u&&(f=lt())!==u?(h=function(){var t,r,o;t=Ze,e.substr(Ze,2)===Z?(r=Z,Ze+=2):(r=u,0===Ie&&Ge(z));r!==u?(o=function(){var t,r,o,c;t=Ze,r=Ze,o=[],(c=at())===u&&(c=it());if(c!==u)for(;c!==u;)o.push(c),(c=at())===u&&(c=it());else o=u;r=o!==u?e.substring(r,Ze):o;r!==u&&(ze=t,s=r,r=(0,n.pi)({type:a.aV.dateTime,pattern:s,parsedOptions:Ct?(l=s,p={},l.replace(i,(function(e){var t=e.length;switch(e[0]){case"G":p.era=4===t?"long":5===t?"narrow":"short";break;case"y":p.year=2===t?"2-digit":"numeric";break;case"Y":case"u":case"U":case"r":throw new RangeError("`Y/u/U/r` (year) patterns are not supported, use `y` instead");case"q":case"Q":throw new RangeError("`q/Q` (quarter) patterns are not supported");case"M":case"L":p.month=["numeric","2-digit","short","long","narrow"][t-1];break;case"w":case"W":throw new RangeError("`w/W` (week) patterns are not supported");case"d":p.day=["numeric","2-digit"][t-1];break;case"D":case"F":case"g":throw new RangeError("`D/F/g` (day) patterns are not supported, use `d` instead");case"E":p.weekday=4===t?"short":5===t?"narrow":"short";break;case"e":if(t<4)throw new RangeError("`e..eee` (weekday) patterns are not supported");p.weekday=["short","long","narrow","short"][t-4];break;case"c":if(t<4)throw new RangeError("`c..ccc` (weekday) patterns are not supported");p.weekday=["short","long","narrow","short"][t-4];break;case"a":p.hour12=!0;break;case"b":case"B":throw new RangeError("`b/B` (period) patterns are not supported, use `a` instead");case"h":p.hourCycle="h12",p.hour=["numeric","2-digit"][t-1];break;case"H":p.hourCycle="h23",p.hour=["numeric","2-digit"][t-1];break;case"K":p.hourCycle="h11",p.hour=["numeric","2-digit"][t-1];break;case"k":p.hourCycle="h24",p.hour=["numeric","2-digit"][t-1];break;case"j":case"J":case"C":throw new RangeError("`j/J/C` (hour) patterns are not supported, use `h/H/K/k` instead");case"m":p.minute=["numeric","2-digit"][t-1];break;case"s":p.second=["numeric","2-digit"][t-1];break;case"S":case"A":throw new RangeError("`S/A` (second) patterns are not supported, use `s` instead");case"z":p.timeZoneName=t<4?"short":"long";break;case"Z":case"O":case"v":case"V":case"X":case"x":throw new RangeError("`Z/O/v/V/X/x` (timeZone) patterns are not supported, use `z` instead")}return""})),p):{}},bt()));var s,l,p;return t=r}(),o!==u?(ze=t,t=r=o):(Ze=t,t=u)):(Ze=t,t=u);t===u&&(t=Ze,ze=Ze,At.push("dateOrTimeArgStyle"),(r=(r=!0)?void 0:u)!==u&&(o=_e())!==u?(ze=t,t=r=B(o)):(Ze=t,t=u));return t}(),h!==u?l=p=[p,f,h]:(Ze=l,l=u)):(Ze=l,l=u),l===u&&(l=null),l!==u&&(p=lt())!==u?(125===e.charCodeAt(Ze)?(f=x,Ze++):(f=u,0===Ie&&Ge(C)),f!==u?(ze=t,t=r=V(o,s,l)):(Ze=t,t=u)):(Ze=t,t=u)):(Ze=t,t=u)):(Ze=t,t=u)):(Ze=t,t=u);return t}());return t}(),t===u&&(t=function(){var t,r,i,o,c,s,l,p,f,h,g;t=Ze,123===e.charCodeAt(Ze)?(r=w,Ze++):(r=u,0===Ie&&Ge(b));if(r!==u)if(lt()!==u)if((i=dt())!==u)if(lt()!==u)if(44===e.charCodeAt(Ze)?(o=O,Ze++):(o=u,0===Ie&&Ge(j)),o!==u)if(lt()!==u)if(e.substr(Ze,6)===L?(c=L,Ze+=6):(c=u,0===Ie&&Ge(X)),c===u&&(e.substr(Ze,13)===Y?(c=Y,Ze+=13):(c=u,0===Ie&&Ge(ee))),c!==u)if(lt()!==u)if(44===e.charCodeAt(Ze)?(s=O,Ze++):(s=u,0===Ie&&Ge(j)),s!==u)if(lt()!==u)if(l=Ze,e.substr(Ze,7)===te?(p=te,Ze+=7):(p=u,0===Ie&&Ge(re)),p!==u&&(f=lt())!==u&&(h=pt())!==u?l=p=[p,f,h]:(Ze=l,l=u),l===u&&(l=null),l!==u)if((p=lt())!==u){if(f=[],(h=ot())!==u)for(;h!==u;)f.push(h),h=ot();else f=u;f!==u&&(h=lt())!==u?(125===e.charCodeAt(Ze)?(g=x,Ze++):(g=u,0===Ie&&Ge(C)),g!==u?(ze=t,r=function(e,t,r,i){return(0,n.pi)({type:a.wD.plural,pluralType:"plural"===t?"cardinal":"ordinal",value:e,offset:r?r[2]:0,options:i.reduce((function(e,t){var r=t.id,n=t.value,a=t.location;return r in e&&He('Duplicate option "'+r+'" in plural element: "'+We()+'"',Ve()),e[r]={value:n,location:a},e}),{})},bt())}(i,c,l,f),t=r):(Ze=t,t=u)):(Ze=t,t=u)}else Ze=t,t=u;else Ze=t,t=u;else Ze=t,t=u;else Ze=t,t=u;else Ze=t,t=u;else Ze=t,t=u;else Ze=t,t=u;else Ze=t,t=u;else Ze=t,t=u;else Ze=t,t=u;else Ze=t,t=u;else Ze=t,t=u;return t}(),t===u&&(t=function(){var t,r,i,o,c,s,l,p,f;t=Ze,123===e.charCodeAt(Ze)?(r=w,Ze++):(r=u,0===Ie&&Ge(b));if(r!==u)if(lt()!==u)if((i=dt())!==u)if(lt()!==u)if(44===e.charCodeAt(Ze)?(o=O,Ze++):(o=u,0===Ie&&Ge(j)),o!==u)if(lt()!==u)if(e.substr(Ze,6)===ne?(c=ne,Ze+=6):(c=u,0===Ie&&Ge(ae)),c!==u)if(lt()!==u)if(44===e.charCodeAt(Ze)?(s=O,Ze++):(s=u,0===Ie&&Ge(j)),s!==u)if(lt()!==u){if(l=[],(p=ut())!==u)for(;p!==u;)l.push(p),p=ut();else l=u;l!==u&&(p=lt())!==u?(125===e.charCodeAt(Ze)?(f=x,Ze++):(f=u,0===Ie&&Ge(C)),f!==u?(ze=t,r=function(e,t){return(0,n.pi)({type:a.wD.select,value:e,options:t.reduce((function(e,t){var r=t.id,n=t.value,a=t.location;return r in e&&He('Duplicate option "'+r+'" in select element: "'+We()+'"',Ve()),e[r]={value:n,location:a},e}),{})},bt())}(i,l),t=r):(Ze=t,t=u)):(Ze=t,t=u)}else Ze=t,t=u;else Ze=t,t=u;else Ze=t,t=u;else Ze=t,t=u;else Ze=t,t=u;else Ze=t,t=u;else Ze=t,t=u;else Ze=t,t=u;else Ze=t,t=u;else Ze=t,t=u;return t}(),t===u&&(t=function(){var t,r;t=Ze,35===e.charCodeAt(Ze)?(r="#",Ze++):(r=u,0===Ie&&Ge(f));r!==u&&(ze=t,r=(0,n.pi)({type:a.wD.pound},bt()));return t=r}())))))),t}function _e(){var t,r,n,a;if(t=Ze,ze=Ze,(r=(r=xt)?void 0:u)!==u){if(n=[],(a=ft())===u&&(a=ht())===u&&(a=gt())===u&&(60===e.charCodeAt(Ze)?(a=s,Ze++):(a=u,0===Ie&&Ge(l))),a!==u)for(;a!==u;)n.push(a),(a=ft())===u&&(a=ht())===u&&(a=gt())===u&&(60===e.charCodeAt(Ze)?(a=s,Ze++):(a=u,0===Ie&&Ge(l)));else n=u;n!==u?(ze=t,t=r=p(n)):(Ze=t,t=u)}else Ze=t,t=u;if(t===u){if(t=Ze,r=[],(n=ft())===u&&(n=ht())===u&&(n=gt())===u&&(n=Le()),n!==u)for(;n!==u;)r.push(n),(n=ft())===u&&(n=ht())===u&&(n=gt())===u&&(n=Le());else r=u;r!==u&&(ze=t,r=p(r)),t=r}return t}function Le(){var t,r,n;return t=Ze,r=Ze,Ie++,(n=Ye())===u&&(n=et())===u&&(n=Xe()),Ie--,n===u?r=void 0:(Ze=r,r=u),r!==u?(60===e.charCodeAt(Ze)?(n=s,Ze++):(n=u,0===Ie&&Ge(l)),n!==u?(ze=t,t=r="<"):(Ze=t,t=u)):(Ze=t,t=u),t}function Xe(){var t,r,i,o,c,p,f;return t=Ze,r=Ze,60===e.charCodeAt(Ze)?(i=s,Ze++):(i=u,0===Ie&&Ge(l)),i!==u&&(o=mt())!==u&&(c=lt())!==u?("/>"===e.substr(Ze,2)?(p="/>",Ze+=2):(p=u,0===Ie&&Ge(m)),p!==u?r=i=[i,o,c,p]:(Ze=r,r=u)):(Ze=r,r=u),r!==u&&(ze=t,f=r,r=(0,n.pi)({type:a.wD.literal,value:f.join("")},bt())),t=r}function Ye(){var t,r,n,a;return t=Ze,60===e.charCodeAt(Ze)?(r=s,Ze++):(r=u,0===Ie&&Ge(l)),r!==u&&(n=mt())!==u?(62===e.charCodeAt(Ze)?(a=">",Ze++):(a=u,0===Ie&&Ge(v)),a!==u?(ze=t,t=r=n):(Ze=t,t=u)):(Ze=t,t=u),t}function et(){var t,r,n,a;return t=Ze,"</"===e.substr(Ze,2)?(r="</",Ze+=2):(r=u,0===Ie&&Ge(y)),r!==u&&(n=mt())!==u?(62===e.charCodeAt(Ze)?(a=">",Ze++):(a=u,0===Ie&&Ge(v)),a!==u?(ze=t,t=r=n):(Ze=t,t=u)):(Ze=t,t=u),t}function tt(){var t,r,n,a,i;if(Ie++,t=Ze,r=[],n=Ze,a=Ze,Ie++,(i=ct())===u&&(k.test(e.charAt(Ze))?(i=e.charAt(Ze),Ze++):(i=u,0===Ie&&Ge(E))),Ie--,i===u?a=void 0:(Ze=a,a=u),a!==u?(e.length>Ze?(i=e.charAt(Ze),Ze++):(i=u,0===Ie&&Ge(F)),i!==u?n=a=[a,i]:(Ze=n,n=u)):(Ze=n,n=u),n!==u)for(;n!==u;)r.push(n),n=Ze,a=Ze,Ie++,(i=ct())===u&&(k.test(e.charAt(Ze))?(i=e.charAt(Ze),Ze++):(i=u,0===Ie&&Ge(E))),Ie--,i===u?a=void 0:(Ze=a,a=u),a!==u?(e.length>Ze?(i=e.charAt(Ze),Ze++):(i=u,0===Ie&&Ge(F)),i!==u?n=a=[a,i]:(Ze=n,n=u)):(Ze=n,n=u);else r=u;return t=r!==u?e.substring(t,Ze):r,Ie--,t===u&&(r=u,0===Ie&&Ge(D)),t}function rt(){var t,r,n;return Ie++,t=Ze,47===e.charCodeAt(Ze)?(r="/",Ze++):(r=u,0===Ie&&Ge(R)),r!==u&&(n=tt())!==u?(ze=t,t=r=n):(Ze=t,t=u),Ie--,t===u&&(r=u,0===Ie&&Ge(S)),t}function nt(){var e,t,r,n,a;if(Ie++,e=Ze,(t=lt())!==u)if((r=tt())!==u){for(n=[],a=rt();a!==u;)n.push(a),a=rt();n!==u?(ze=e,t=function(e,t){return{stem:e,options:t}}(r,n),e=t):(Ze=e,e=u)}else Ze=e,e=u;else Ze=e,e=u;return Ie--,e===u&&(t=u,0===Ie&&Ge(T)),e}function at(){var t,r,n,a;if(t=Ze,39===e.charCodeAt(Ze)?(r=H,Ze++):(r=u,0===Ie&&Ge(K)),r!==u){if(n=[],(a=ft())===u&&(M.test(e.charAt(Ze))?(a=e.charAt(Ze),Ze++):(a=u,0===Ie&&Ge(N))),a!==u)for(;a!==u;)n.push(a),(a=ft())===u&&(M.test(e.charAt(Ze))?(a=e.charAt(Ze),Ze++):(a=u,0===Ie&&Ge(N)));else n=u;n!==u?(39===e.charCodeAt(Ze)?(a=H,Ze++):(a=u,0===Ie&&Ge(K)),a!==u?t=r=[r,n,a]:(Ze=t,t=u)):(Ze=t,t=u)}else Ze=t,t=u;if(t===u)if(t=[],(r=ft())===u&&($.test(e.charAt(Ze))?(r=e.charAt(Ze),Ze++):(r=u,0===Ie&&Ge(q))),r!==u)for(;r!==u;)t.push(r),(r=ft())===u&&($.test(e.charAt(Ze))?(r=e.charAt(Ze),Ze++):(r=u,0===Ie&&Ge(q)));else t=u;return t}function it(){var t,r;if(t=[],G.test(e.charAt(Ze))?(r=e.charAt(Ze),Ze++):(r=u,0===Ie&&Ge(J)),r!==u)for(;r!==u;)t.push(r),G.test(e.charAt(Ze))?(r=e.charAt(Ze),Ze++):(r=u,0===Ie&&Ge(J));else t=u;return t}function ut(){var t,r,a,i,o,c,s;return t=Ze,lt()!==u&&(r=yt())!==u&&lt()!==u?(123===e.charCodeAt(Ze)?(a=w,Ze++):(a=u,0===Ie&&Ge(b)),a!==u?(ze=Ze,At.push("select"),(!0?void 0:u)!==u&&(i=Qe())!==u?(125===e.charCodeAt(Ze)?(o=x,Ze++):(o=u,0===Ie&&Ge(C)),o!==u?(ze=t,c=r,s=i,At.pop(),t=(0,n.pi)({id:c,value:s},bt())):(Ze=t,t=u)):(Ze=t,t=u)):(Ze=t,t=u)):(Ze=t,t=u),t}function ot(){var t,r,a,i,o,c,s;return t=Ze,lt()!==u?(r=function(){var t,r,n,a;return t=Ze,r=Ze,61===e.charCodeAt(Ze)?(n="=",Ze++):(n=u,0===Ie&&Ge(ie)),n!==u&&(a=pt())!==u?r=n=[n,a]:(Ze=r,r=u),(t=r!==u?e.substring(t,Ze):r)===u&&(t=yt()),t}(),r!==u&&lt()!==u?(123===e.charCodeAt(Ze)?(a=w,Ze++):(a=u,0===Ie&&Ge(b)),a!==u?(ze=Ze,At.push("plural"),(!0?void 0:u)!==u&&(i=Qe())!==u?(125===e.charCodeAt(Ze)?(o=x,Ze++):(o=u,0===Ie&&Ge(C)),o!==u?(ze=t,c=r,s=i,At.pop(),t=(0,n.pi)({id:c,value:s},bt())):(Ze=t,t=u)):(Ze=t,t=u)):(Ze=t,t=u)):(Ze=t,t=u)):(Ze=t,t=u),t}function ct(){var t;return Ie++,oe.test(e.charAt(Ze))?(t=e.charAt(Ze),Ze++):(t=u,0===Ie&&Ge(ce)),Ie--,t===u&&(u,0===Ie&&Ge(ue)),t}function st(){var t;return Ie++,le.test(e.charAt(Ze))?(t=e.charAt(Ze),Ze++):(t=u,0===Ie&&Ge(pe)),Ie--,t===u&&(u,0===Ie&&Ge(se)),t}function lt(){var t,r,n;for(Ie++,t=Ze,r=[],n=ct();n!==u;)r.push(n),n=ct();return t=r!==u?e.substring(t,Ze):r,Ie--,t===u&&(r=u,0===Ie&&Ge(fe)),t}function pt(){var t,r,n,a,i;return Ie++,t=Ze,45===e.charCodeAt(Ze)?(r="-",Ze++):(r=u,0===Ie&&Ge(de)),r===u&&(r=null),r!==u&&(n=vt())!==u?(ze=t,a=r,t=r=(i=n)?a?-i:i:0):(Ze=t,t=u),Ie--,t===u&&(r=u,0===Ie&&Ge(he)),t}function ft(){var t,r;return Ie++,t=Ze,e.substr(Ze,2)===ve?(r=ve,Ze+=2):(r=u,0===Ie&&Ge(ye)),r!==u&&(ze=t,r="'"),Ie--,(t=r)===u&&(r=u,0===Ie&&Ge(me)),t}function ht(){var t,r,n,a,i,o;if(t=Ze,39===e.charCodeAt(Ze)?(r=H,Ze++):(r=u,0===Ie&&Ge(K)),r!==u)if(n=function(){var t,r,n,a;t=Ze,r=Ze,e.length>Ze?(n=e.charAt(Ze),Ze++):(n=u,0===Ie&&Ge(F));n!==u?(ze=Ze,(a=(a="<"===(i=n)||">"===i||"{"===i||"}"===i||wt()&&"#"===i)?void 0:u)!==u?r=n=[n,a]:(Ze=r,r=u)):(Ze=r,r=u);var i;t=r!==u?e.substring(t,Ze):r;return t}(),n!==u){for(a=Ze,i=[],e.substr(Ze,2)===ve?(o=ve,Ze+=2):(o=u,0===Ie&&Ge(ye)),o===u&&(M.test(e.charAt(Ze))?(o=e.charAt(Ze),Ze++):(o=u,0===Ie&&Ge(N)));o!==u;)i.push(o),e.substr(Ze,2)===ve?(o=ve,Ze+=2):(o=u,0===Ie&&Ge(ye)),o===u&&(M.test(e.charAt(Ze))?(o=e.charAt(Ze),Ze++):(o=u,0===Ie&&Ge(N)));(a=i!==u?e.substring(a,Ze):i)!==u?(39===e.charCodeAt(Ze)?(i=H,Ze++):(i=u,0===Ie&&Ge(K)),i===u&&(i=null),i!==u?(ze=t,t=r=n+a.replace("''","'")):(Ze=t,t=u)):(Ze=t,t=u)}else Ze=t,t=u;else Ze=t,t=u;return t}function gt(){var t,r,n,a;return t=Ze,r=Ze,e.length>Ze?(n=e.charAt(Ze),Ze++):(n=u,0===Ie&&Ge(F)),n!==u?(ze=Ze,(a=(a=Ae(n))?void 0:u)!==u?r=n=[n,a]:(Ze=r,r=u)):(Ze=r,r=u),r===u&&(10===e.charCodeAt(Ze)?(r="\n",Ze++):(r=u,0===Ie&&Ge(we))),t=r!==u?e.substring(t,Ze):r}function dt(){var t,r;return Ie++,t=Ze,(r=vt())===u&&(r=yt()),t=r!==u?e.substring(t,Ze):r,Ie--,t===u&&(r=u,0===Ie&&Ge(be)),t}function mt(){var t,r;return Ie++,t=Ze,(r=vt())===u&&(r=function(){var t,r,n,a,i;Ie++,t=Ze,r=[],45===e.charCodeAt(Ze)?(n=ge,Ze++):(n=u,0===Ie&&Ge(de));n===u&&(n=Ze,a=Ze,Ie++,(i=ct())===u&&(i=st()),Ie--,i===u?a=void 0:(Ze=a,a=u),a!==u?(e.length>Ze?(i=e.charAt(Ze),Ze++):(i=u,0===Ie&&Ge(F)),i!==u?n=a=[a,i]:(Ze=n,n=u)):(Ze=n,n=u));if(n!==u)for(;n!==u;)r.push(n),45===e.charCodeAt(Ze)?(n=ge,Ze++):(n=u,0===Ie&&Ge(de)),n===u&&(n=Ze,a=Ze,Ie++,(i=ct())===u&&(i=st()),Ie--,i===u?a=void 0:(Ze=a,a=u),a!==u?(e.length>Ze?(i=e.charAt(Ze),Ze++):(i=u,0===Ie&&Ge(F)),i!==u?n=a=[a,i]:(Ze=n,n=u)):(Ze=n,n=u));else r=u;t=r!==u?e.substring(t,Ze):r;Ie--,t===u&&(r=u,0===Ie&&Ge(Te));return t}()),t=r!==u?e.substring(t,Ze):r,Ie--,t===u&&(r=u,0===Ie&&Ge(xe)),t}function vt(){var t,r,n,a,i;if(Ie++,t=Ze,48===e.charCodeAt(Ze)?(r="0",Ze++):(r=u,0===Ie&&Ge(De)),r!==u&&(ze=t,r=0),(t=r)===u){if(t=Ze,r=Ze,ke.test(e.charAt(Ze))?(n=e.charAt(Ze),Ze++):(n=u,0===Ie&&Ge(Ee)),n!==u){for(a=[],Fe.test(e.charAt(Ze))?(i=e.charAt(Ze),Ze++):(i=u,0===Ie&&Ge(Se));i!==u;)a.push(i),Fe.test(e.charAt(Ze))?(i=e.charAt(Ze),Ze++):(i=u,0===Ie&&Ge(Se));a!==u?r=n=[n,a]:(Ze=r,r=u)}else Ze=r,r=u;r!==u&&(ze=t,r=parseInt(r.join(""),10)),t=r}return Ie--,t===u&&(r=u,0===Ie&&Ge(Ce)),t}function yt(){var t,r,n,a,i;if(Ie++,t=Ze,r=[],n=Ze,a=Ze,Ie++,(i=ct())===u&&(i=st()),Ie--,i===u?a=void 0:(Ze=a,a=u),a!==u?(e.length>Ze?(i=e.charAt(Ze),Ze++):(i=u,0===Ie&&Ge(F)),i!==u?n=a=[a,i]:(Ze=n,n=u)):(Ze=n,n=u),n!==u)for(;n!==u;)r.push(n),n=Ze,a=Ze,Ie++,(i=ct())===u&&(i=st()),Ie--,i===u?a=void 0:(Ze=a,a=u),a!==u?(e.length>Ze?(i=e.charAt(Ze),Ze++):(i=u,0===Ie&&Ge(F)),i!==u?n=a=[a,i]:(Ze=n,n=u)):(Ze=n,n=u);else r=u;return t=r!==u?e.substring(t,Ze):r,Ie--,t===u&&(r=u,0===Ie&&Ge(Re)),t}var At=["root"];function wt(){return"plural"===At[At.length-1]}function bt(){return t&&t.captureLocation?{location:Ve()}:{}}var xt=t&&t.ignoreTag,Ct=t&&t.shouldParseSkeleton;if((r=c())!==u&&Ze===e.length)return r;throw r!==u&&Ze<e.length&&Ge({type:"end"}),Je(je,Oe<e.length?e.charAt(Oe):null,Oe<e.length?qe(Oe,Oe+1):qe(Oe,Oe))},v=/(^|[^\\])#/g;function y(e){e.forEach((function(e){((0,a.Jo)(e)||(0,a.Wi)(e))&&Object.keys(e.options).forEach((function(t){for(var r,i=e.options[t],u=-1,o=void 0,c=0;c<i.value.length;c++){var s=i.value[c];if((0,a.O4)(s)&&v.test(s.value)){u=c,o=s;break}}if(o){var l=o.value.replace(v,"$1{"+e.value+", number}"),p=m(l);(r=i.value).splice.apply(r,(0,n.ev)([u,1],p))}y(i.value)}))}))}function A(e,t){t=(0,n.pi)({normalizeHashtagInPlural:!0,shouldParseSkeleton:!0},t||{});var r=m(e,t);return t.normalizeHashtagInPlural&&y(r),r}},2419:(e,t,r)=>{var n,a;function i(e){return e.type===n.literal}function u(e){return e.type===n.argument}function o(e){return e.type===n.number}function c(e){return e.type===n.date}function s(e){return e.type===n.time}function l(e){return e.type===n.select}function p(e){return e.type===n.plural}function f(e){return e.type===n.pound}function h(e){return e.type===n.tag}function g(e){return!(!e||"object"!=typeof e||e.type!==a.number)}function d(e){return!(!e||"object"!=typeof e||e.type!==a.dateTime)}r.d(t,{HI:()=>h,Ii:()=>d,Jo:()=>p,O4:()=>i,VG:()=>u,Wh:()=>g,Wi:()=>l,aV:()=>a,pe:()=>s,rp:()=>c,uf:()=>o,wD:()=>n,yx:()=>f}),function(e){e[e.literal=0]="literal",e[e.argument=1]="argument",e[e.number=2]="number",e[e.date=3]="date",e[e.time=4]="time",e[e.select=5]="select",e[e.plural=6]="plural",e[e.pound=7]="pound",e[e.tag=8]="tag"}(n||(n={})),function(e){e[e.number=0]="number",e[e.dateTime=1]="dateTime"}(a||(a={}))}}]);