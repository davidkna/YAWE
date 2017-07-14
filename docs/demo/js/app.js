function e(e,t){for(var n=-1,r=null==e?0:e.length,i=Array(r);++n<r;)i[n]=t(e[n],n,e);return i}function t(e){var t=B.call(e,J),n=e[J];try{e[J]=void 0;var r=!0}catch(e){}var i=V.call(e);return r&&(t?e[J]=n:delete e[J]),i}function n(e){return Y.call(e)}function r(e){return null==e?void 0===e?X:K:Q&&Q in Object(e)?t(e):n(e)}function i(e){return null!=e&&"object"==typeof e}function o(e){return"symbol"==typeof e||i(e)&&r(e)==ee}function a(t){if("string"==typeof t)return t;if(q(t))return e(t,a)+"";if(o(t))return re?re.call(t):"";var n=t+"";return"0"==n&&1/t==-te?"-0":n}function s(e){return null==e?"":a(e)}function l(e){return(e=s(e))&&e.replace(ie,U).replace(oe,"")}function u(e){return(e=s(e))&&se.test(e)?e.replace(ae,"\\$&"):e}function c(e,t){for(var n=-1,r=t.length,i=e.length;++n<r;)e[i+n]=t[n];return e}function d(e){return i(e)&&r(e)==le}function f(e){return q(e)||fe(e)||!!(pe&&e&&e[pe])}function p(e,t,n,r,i){var o=-1,a=e.length;for(n||(n=f),i||(i=[]);++o<a;){var s=e[o];t>0&&n(s)?t>1?p(s,t-1,n,r,i):c(i,s):r||(i[i.length]=s)}return i}function h(e){return(null==e?0:e.length)?p(e,1):[]}function m(e){return e.match(me)||[]}function x(e){return xe.test(e)}function g(e){return e.match(ge)||[]}function b(e,t,n){return e=s(e),void 0===(t=n?void 0:t)?x(e)?g(e):m(e):e.match(t)||[]}function y(e,t){const n=[e[0]];for(let r=1;r<e.length;r+=1){const i=e[r],o=n[n.length-1];i[0]<=o[1]||/^\s*$/.test(t.slice(o[1],i[0]))?o[1]=Math.max(i[1],o[1]):n.push(i)}return n}function v(e,t){return e[0]-t[0]}function A(e,t){const n=l(e),r=t.map(e=>{const t=RegExp(u(l(e)),"gi"),r=[];let i;for(;i=t.exec(n);)r.push([i.index,t.lastIndex]);return r});return 1===t.length?r[0]:y(h(r).sort(v),n)}function E(e,t){const n=A(e,b(t)),r=he(e,n),i=document.createDocumentFragment();return r.forEach(e=>{if(e.highlight){const t=document.createElement("mark");t.textContent=e.text,i.appendChild(t)}else{const t=document.createTextNode(e.text);i.appendChild(t)}}),i}function T(e){const[t,n]=e.split("=").map(decodeURIComponent);return{key:t,value:n}}function w(e){return e.replace(/^[?#]/,"").split("&").reduce((e,t)=>{const{key:n,value:r}=T(t);return e[n]=r,e},{})}function k(e,t){return{key:encodeURIComponent(e),value:encodeURIComponent(t)}}function C(e){return Object.keys(e).map(t=>{const{key:n,value:r}=k(t,e[t]);return`${n}=${r}`}).join("&")}function L(e,t=document){return t.querySelector(e)}function O(e){for(let t=e;t.parentNode;t=t.parentNode)if("a"===t.nodeName.toLowerCase())return t;return null}function S(e){const t=e.status;if(t>=200&&t<300)return e;throw Error(`HTTP Error ${t}: ${e.statusText}`)}function N(e){return e.json()}function D(e,t={}){return t.origin="*",fetch(`${e}?${C(t)}`).then(S).then(N)}function R(e){return Ee.sanitize(e,{RETURN_DOM_FRAGMENT:!0,RETURN_DOM_IMPORT:!0})}function M(e,t,n){const[{text:r},...i]=e.mobileview.sections,{$content:o}=Te,a=document.createElement("h1");a.textContent=e.mobileview.normalizedtitle||t.replace(/_/g," "),o.appendChild(a),o.appendChild(R(r)),n();let s;i.forEach(e=>{const t=R(e.line).textContent,n=R(e.text);if(1===e.toclevel){const e=document.createElement("details"),r=document.createElement("summary"),i=document.createElement("h2"),a=document.createElement("div");i.textContent=t,r.appendChild(i),e.appendChild(r),e.classList.add("card"),r.classList.add("card-header"),a.classList.add("card-block"),a.appendChild(n),e.appendChild(a),o.appendChild(e),s=a}else{const r=e.toclevel<=6?e.toclevel:6,i=document.createElement(`h${r}`);i.textContent=t,s.appendChild(i),s.appendChild(n)}},!1)}function _(e){const t=document.createElement("a");return t.href=e,t}function z(){if(""!==location.hash){const{$search:e}=Te,t=w(location.hash);e.value=t.article,I(t.article)}}function $(e){const{$base:t,$body:n,$content:r,$loading:i}=Te;t.setAttribute("href",`${Ae.url}wiki/${e}`),r.textContent="",r.style.display="none",i.style.display="block",n.classList.add("loading")}function j(e){const t={action:"mobileview",format:"json",noheadings:!0,page:e,sections:"all",redirect:"yes"};return D(`${Ae.url}w/api.php`,t).then(e=>{if(e.error){const t=Error(e.error.info);throw t}return e})}function I(e){function t(){i.style.display="block",o.style.display="none",r.classList.remove("loading"),scroll(0,0)}function n(e){const t=document.createElement("div");return t.classList.add("alert"),t.classList.add("alert-danger"),t.textContent=e,t}const{$body:r,$content:i,$loading:o}=Te;$(e),j(e).then(n=>{M(n,e,t)}).catch(e=>{t(),i.appendChild(n(e))})}function F(e){const t=_(e),n=_(Ae.url);return!(!/^https?:$/.test(t.protocol)||t.host&&t.host!==n.host||!t.pathname.startsWith("../wiki/")&&("/"===n.pathname?"/wiki/"!==t.pathname.substring(0,6):t.pathname.substring(0,n.pathname.length+6)!==`${n.pathname}/wiki/`))}function H(e){return(e=>decodeURIComponent(e.replace(/_/g," ")))((()=>{const t=_(e),n=_(Ae.url);return t.pathname.startsWith("../wiki/")?t.pathname.substring(8):"/"===n.pathname?t.pathname.substring(6):t.pathname.substring(n.pathname.length+6)})())}var U=(e=>t=>e[t])({"À":"A","Á":"A","Â":"A","Ã":"A","Ä":"A","Å":"A","à":"a","á":"a","â":"a","ã":"a","ä":"a","å":"a","Ç":"C","ç":"c","Ð":"D","ð":"d","È":"E","É":"E","Ê":"E","Ë":"E","è":"e","é":"e","ê":"e","ë":"e","Ì":"I","Í":"I","Î":"I","Ï":"I","ì":"i","í":"i","î":"i","ï":"i","Ñ":"N","ñ":"n","Ò":"O","Ó":"O","Ô":"O","Õ":"O","Ö":"O","Ø":"O","ò":"o","ó":"o","ô":"o","õ":"o","ö":"o","ø":"o","Ù":"U","Ú":"U","Û":"U","Ü":"U","ù":"u","ú":"u","û":"u","ü":"u","Ý":"Y","ý":"y","ÿ":"y","Æ":"Ae","æ":"ae","Þ":"Th","þ":"th","ß":"ss","Ā":"A","Ă":"A","Ą":"A","ā":"a","ă":"a","ą":"a","Ć":"C","Ĉ":"C","Ċ":"C","Č":"C","ć":"c","ĉ":"c","ċ":"c","č":"c","Ď":"D","Đ":"D","ď":"d","đ":"d","Ē":"E","Ĕ":"E","Ė":"E","Ę":"E","Ě":"E","ē":"e","ĕ":"e","ė":"e","ę":"e","ě":"e","Ĝ":"G","Ğ":"G","Ġ":"G","Ģ":"G","ĝ":"g","ğ":"g","ġ":"g","ģ":"g","Ĥ":"H","Ħ":"H","ĥ":"h","ħ":"h","Ĩ":"I","Ī":"I","Ĭ":"I","Į":"I","İ":"I","ĩ":"i","ī":"i","ĭ":"i","į":"i","ı":"i","Ĵ":"J","ĵ":"j","Ķ":"K","ķ":"k","ĸ":"k","Ĺ":"L","Ļ":"L","Ľ":"L","Ŀ":"L","Ł":"L","ĺ":"l","ļ":"l","ľ":"l","ŀ":"l","ł":"l","Ń":"N","Ņ":"N","Ň":"N","Ŋ":"N","ń":"n","ņ":"n","ň":"n","ŋ":"n","Ō":"O","Ŏ":"O","Ő":"O","ō":"o","ŏ":"o","ő":"o","Ŕ":"R","Ŗ":"R","Ř":"R","ŕ":"r","ŗ":"r","ř":"r","Ś":"S","Ŝ":"S","Ş":"S","Š":"S","ś":"s","ŝ":"s","ş":"s","š":"s","Ţ":"T","Ť":"T","Ŧ":"T","ţ":"t","ť":"t","ŧ":"t","Ũ":"U","Ū":"U","Ŭ":"U","Ů":"U","Ű":"U","Ų":"U","ũ":"u","ū":"u","ŭ":"u","ů":"u","ű":"u","ų":"u","Ŵ":"W","ŵ":"w","Ŷ":"Y","ŷ":"y","Ÿ":"Y","Ź":"Z","Ż":"Z","Ž":"Z","ź":"z","ż":"z","ž":"z","Ĳ":"IJ","ĳ":"ij","Œ":"Oe","œ":"oe","ŉ":"'n","ſ":"s"}),Z="object"==typeof global&&global&&global.Object===Object&&global,G="object"==typeof self&&self&&self.Object===Object&&self,W=(Z||G||Function("return this")()).Symbol,q=Array.isArray,P=Object.prototype,B=P.hasOwnProperty,V=P.toString,J=W?W.toStringTag:void 0,Y=Object.prototype.toString,K="[object Null]",X="[object Undefined]",Q=W?W.toStringTag:void 0,ee="[object Symbol]",te=1/0,ne=W?W.prototype:void 0,re=ne?ne.toString:void 0,ie=/[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g,oe=RegExp("[\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff]","g"),ae=/[\\^$.*+?()[\]{}|]/g,se=RegExp(ae.source),le="[object Arguments]",ue=Object.prototype,ce=ue.hasOwnProperty,de=ue.propertyIsEnumerable,fe=d(function(){return arguments}())?d:e=>i(e)&&ce.call(e,"callee")&&!de.call(e,"callee"),pe=W?W.isConcatSpreadable:void 0,he=(e,t)=>{var n=[];return 0===t.length?n.push({text:e,highlight:!1}):t[0][0]>0&&n.push({text:e.slice(0,t[0][0]),highlight:!1}),t.forEach((r,i)=>{var o=r[0],a=r[1];n.push({text:e.slice(o,a),highlight:!0}),i===t.length-1?a<e.length&&n.push({text:e.slice(a,e.length),highlight:!1}):a<t[i+1][0]&&n.push({text:e.slice(a,t[i+1][0]),highlight:!1})}),n},me=/[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g,xe=/[a-z][A-Z]|[A-Z]{2,}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/,ge=RegExp("[A-Z\\xc0-\\xd6\\xd8-\\xde]?[a-z\\xdf-\\xf6\\xf8-\\xff]+(?:['’](?:d|ll|m|re|s|t|ve))?(?=[\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000]|[A-Z\\xc0-\\xd6\\xd8-\\xde]|$)|(?:[A-Z\\xc0-\\xd6\\xd8-\\xde]|[^\\ud800-\\udfff\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000\\d+\\u2700-\\u27bfa-z\\xdf-\\xf6\\xf8-\\xffA-Z\\xc0-\\xd6\\xd8-\\xde])+(?:['’](?:D|LL|M|RE|S|T|VE))?(?=[\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000]|[A-Z\\xc0-\\xd6\\xd8-\\xde](?:[a-z\\xdf-\\xf6\\xf8-\\xff]|[^\\ud800-\\udfff\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000\\d+\\u2700-\\u27bfa-z\\xdf-\\xf6\\xf8-\\xffA-Z\\xc0-\\xd6\\xd8-\\xde])|$)|[A-Z\\xc0-\\xd6\\xd8-\\xde]?(?:[a-z\\xdf-\\xf6\\xf8-\\xff]|[^\\ud800-\\udfff\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000\\d+\\u2700-\\u27bfa-z\\xdf-\\xf6\\xf8-\\xffA-Z\\xc0-\\xd6\\xd8-\\xde])+(?:['’](?:d|ll|m|re|s|t|ve))?|[A-Z\\xc0-\\xd6\\xd8-\\xde]+(?:['’](?:D|LL|M|RE|S|T|VE))?|\\d*(?:(?:1ST|2ND|3RD|(?![123])\\dTH)\\b)|\\d*(?:(?:1st|2nd|3rd|(?![123])\\dth)\\b)|\\d+|(?:[\\u2700-\\u27bf]|(?:\\ud83c[\\udde6-\\uddff]){2}|[\\ud800-\\udbff][\\udc00-\\udfff])[\\ufe0e\\ufe0f]?(?:[\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff]|\\ud83c[\\udffb-\\udfff])?(?:\\u200d(?:[^\\ud800-\\udfff]|(?:\\ud83c[\\udde6-\\uddff]){2}|[\\ud800-\\udbff][\\udc00-\\udfff])[\\ufe0e\\ufe0f]?(?:[\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff]|\\ud83c[\\udffb-\\udfff])?)*","g");class be{constructor(e,t){this.input=e,this.getCompletion=t,this.input.setAttribute("aria-autocomplete","list"),this.index=-1,this.typedValue=this.input.value,this.container=this.input.parentElement,this.ul=this.input.nextElementSibling,this.input.addEventListener("input",this.refresh.bind(this)),this.input.addEventListener("blur",this.close.bind(this)),this.input.addEventListener("keydown",e=>{const t=e.key;this.ul.hasAttribute("hidden")||("Enter"!==t&&"Tab"!==t||-1===this.index?"Escape"===t?this.close():"ArrowUp"!==t&&"ArrowDown"!==t||(e.preventDefault(),this["ArrowUp"===t?"previous":"next"]()):("Tab"===t&&e.preventDefault(),this.input.value=this.list[this.index],this.close()))}),this.input.form.addEventListener("submit",this.close.bind(this)),this.ul.addEventListener("click",e=>{let t=e.target;if(t!==this.ul){for(;t&&"li"===t.nodeName.toLowerCase();)t=t.parentNode;if(!t)return;e.preventDefault(),this.input.value=t.textContent,this.close()}})}close(){this.ul.setAttribute("hidden",""),this.index=-1}open(){this.ul.removeAttribute("hidden")}next(){const e=this.list.length;this.goto(this.index<e-1?this.index+1:-1)}previous(){const e=this.list.length;this.goto(-1!==this.index?this.index-1:e-1)}goto(e){const t=this.ul.children;-1!==this.index&&t[this.index].setAttribute("aria-selected","false"),this.index=e,t.length>0&&(e>-1?(t[e].setAttribute("aria-selected","true"),this.input.value=t[e].textContent):this.input.value=this.typedValue)}refresh(){if(this.index=-1,this.typedValue=this.input.value,0!==this.input.value.length){const e=this.typedValue;this.getCompletion(this.input.value).then(t=>{e===this.typedValue&&(this.list=t,this.showCompletions())})}else this.close()}showCompletions(){if(0===this.list.length)return void this.close();const e=this.ul.children;if(this.list.length<e.length)for(let t=this.list.length;t<e.length;t+=1)this.ul.removeChild(e[t]);this.list.forEach((t,n)=>{if(!e[n]){const e=document.createElement("li");this.ul.appendChild(e)}const r=e[n];r.textContent="",r.appendChild(E(t,this.input.value)),r.setAttribute("aria-selected","false")}),this.open()}}const ye={theme:"custom",url:"https://en.wikipedia.org/"},ve=["cerulean","cosmo","custom","cyborg","darkly","flatly","journal","litera","lumen","lux","materia","minty","pulse","sandstone","simplex","slate","solar","spacelab","superhero","united","yeti"],Ae=(()=>{const e=localStorage.getItem("settings");if(!e)return localStorage.setItem("settings",JSON.stringify(ye)),ye;const t=JSON.parse(e);return ve.includes(t.theme)||(t.theme=ye.theme,localStorage.setItem("settings",JSON.stringify(t))),t})();var Ee=((e,t)=>(t={exports:{}},e(t),t.exports))(e=>{(t=>{"use strict";var n="undefined"==typeof window?null:window;e.exports=t(n)})(function e(t){"use strict";var n=t=>e(t);if(n.version="0.9.0",n.removed=[],!t||!t.document||9!==t.document.nodeType)return n.isSupported=!1,n;var r=t.document,i=r,o=t.DocumentFragment,a=t.HTMLTemplateElement,s=t.Node,l=t.NodeFilter,u=t.NamedNodeMap||t.MozNamedAttrMap,c=t.Text,d=t.Comment,f=t.DOMParser,p=t.XMLHttpRequest,h=t.encodeURI,m=!1,x=!1;if("function"==typeof a){var g=r.createElement("template");g.content&&g.content.ownerDocument&&(r=g.content.ownerDocument)}var b=r.implementation,y=r.createNodeIterator,v=r.getElementsByTagName,A=r.createDocumentFragment,E=i.importNode,T={};n.isSupported=void 0!==b.createHTMLDocument&&9!==r.documentMode;var w=(e,t)=>{for(var n=t.length;n--;)"string"==typeof t[n]&&(t[n]=t[n].toLowerCase()),e[t[n]]=!0;return e},k=e=>{var t,n={};for(t in e)e.hasOwnProperty(t)&&(n[t]=e[t]);return n},C=null,L=w({},["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","pre","progress","q","rp","rt","ruby","s","samp","section","select","shadow","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr","svg","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","filter","font","g","glyph","glyphref","hkern","image","line","lineargradient","marker","mask","metadata","mpath","path","pattern","polygon","polyline","radialgradient","rect","stop","switch","symbol","text","textpath","title","tref","tspan","view","vkern","feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feMerge","feMergeNode","feMorphology","feOffset","feSpecularLighting","feTile","feTurbulence","math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmuliscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mpspace","msqrt","mystyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover","#text"]),O=null,S=w({},["accept","action","align","alt","autocomplete","background","bgcolor","border","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","coords","datetime","default","dir","disabled","download","enctype","face","for","headers","height","hidden","high","href","hreflang","id","ismap","label","lang","list","loop","low","max","maxlength","media","method","min","multiple","name","noshade","novalidate","nowrap","open","optimum","pattern","placeholder","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","span","srclang","start","src","step","style","summary","tabindex","title","type","usemap","valign","value","width","xmlns","accent-height","accumulate","additivive","alignment-baseline","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","clip","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dur","edgemode","elevation","end","fill","fill-opacity","fill-rule","filter","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","image-rendering","in","in2","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","mode","min","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","points","preservealpha","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","specularconstant","specularexponent","spreadmethod","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","surfacescale","targetx","targety","transform","text-anchor","text-decoration","text-rendering","textlength","u1","u2","unicode","values","viewbox","visibility","vert-adv-y","vert-origin-x","vert-origin-y","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","y","y1","y2","z","zoomandpan","accent","accentunder","bevelled","close","columnsalign","columnlines","columnspan","denomalign","depth","display","displaystyle","fence","frame","largeop","length","linethickness","lspace","lquote","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),N=null,D=null,R=!0,M=!0,_=!1,z=!1,$=!1,j=/\{\{[\s\S]*|[\s\S]*\}\}/gm,I=/<%[\s\S]*|[\s\S]*%>/gm,F=!1,H=!1,U=!1,Z=!1,G=!1,W=!1,q=!0,P=!0,B=w({},["audio","head","math","script","style","template","svg","video"]),V=w({},["audio","video","img","source","image"]),J=w({},["alt","class","for","id","label","name","pattern","placeholder","summary","title","value","style","xmlns"]),Y=null,K=r.createElement("form"),X=e=>{"object"!=typeof e&&(e={}),C="ALLOWED_TAGS"in e?w({},e.ALLOWED_TAGS):L,O="ALLOWED_ATTR"in e?w({},e.ALLOWED_ATTR):S,N="FORBID_TAGS"in e?w({},e.FORBID_TAGS):{},D="FORBID_ATTR"in e?w({},e.FORBID_ATTR):{},R=!1!==e.ALLOW_ARIA_ATTR,M=!1!==e.ALLOW_DATA_ATTR,_=e.ALLOW_UNKNOWN_PROTOCOLS||!1,z=e.SAFE_FOR_JQUERY||!1,$=e.SAFE_FOR_TEMPLATES||!1,F=e.WHOLE_DOCUMENT||!1,Z=e.RETURN_DOM||!1,G=e.RETURN_DOM_FRAGMENT||!1,W=e.RETURN_DOM_IMPORT||!1,U=e.FORCE_BODY||!1,q=!1!==e.SANITIZE_DOM,P=!1!==e.KEEP_CONTENT,$&&(M=!1),G&&(Z=!0),e.ADD_TAGS&&(C===L&&(C=k(C)),w(C,e.ADD_TAGS)),e.ADD_ATTR&&(O===S&&(O=k(O)),w(O,e.ADD_ATTR)),e.ADD_URI_SAFE_ATTR&&w(J,e.ADD_URI_SAFE_ATTR),P&&(C["#text"]=!0),Object&&"freeze"in Object&&Object.freeze(e),Y=e},Q=e=>{n.removed.push({element:e});try{e.parentNode.removeChild(e)}catch(t){e.outerHTML=""}},ee=(e,t)=>{n.removed.push({attribute:t.getAttributeNode(e),from:t}),t.removeAttribute(e)},te=e=>{var t,n;if(U&&(e="<remove></remove>"+e),m){try{e=h(e)}catch(e){}var r=new p;r.responseType="document",r.open("GET","data:text/html;charset=utf-8,"+e,!1),r.send(null),t=r.response}if(x)try{t=(new f).parseFromString(e,"text/html")}catch(e){}return t&&t.documentElement||((n=(t=b.createHTMLDocument("")).body).parentNode.removeChild(n.parentNode.firstElementChild),n.outerHTML=e),v.call(t,F?"html":"body")[0]};n.isSupported&&(()=>{var e=te('<svg><g onload="this.parentNode.remove()"></g></svg>');e.querySelector("svg")||(m=!0),(e=te('<svg><p><style><img src="</style><img src=x onerror=alert(1)//">')).querySelector("svg img")&&(x=!0)})();var ne=e=>y.call(e.ownerDocument||e,e,l.SHOW_ELEMENT|l.SHOW_COMMENT|l.SHOW_TEXT,()=>l.FILTER_ACCEPT,!1),re=e=>!(e instanceof c||e instanceof d||"string"==typeof e.nodeName&&"string"==typeof e.textContent&&"function"==typeof e.removeChild&&e.attributes instanceof u&&"function"==typeof e.removeAttribute&&"function"==typeof e.setAttribute),ie=e=>"object"==typeof s?e instanceof s:e&&"object"==typeof e&&"number"==typeof e.nodeType&&"string"==typeof e.nodeName,oe=e=>{var t,r;if(pe("beforeSanitizeElements",e,null),re(e))return Q(e),!0;if(t=e.nodeName.toLowerCase(),pe("uponSanitizeElement",e,{tagName:t,allowedTags:C}),!C[t]||N[t]){if(P&&!B[t]&&"function"==typeof e.insertAdjacentHTML)try{e.insertAdjacentHTML("AfterEnd",e.innerHTML)}catch(e){}return Q(e),!0}return!z||e.firstElementChild||e.content&&e.content.firstElementChild||!/</g.test(e.textContent)||(n.removed.push({element:e.cloneNode()}),e.innerHTML=e.textContent.replace(/</g,"&lt;")),$&&3===e.nodeType&&(r=(r=(r=e.textContent).replace(j," ")).replace(I," "),e.textContent!==r&&(n.removed.push({element:e.cloneNode()}),e.textContent=r)),pe("afterSanitizeElements",e,null),!1},ae=/^data-[\-\w.\u00B7-\uFFFF]/,se=/^aria-[\-\w]+$/,le=/^(?:(?:(?:f|ht)tps?|mailto|tel):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,ue=/^(?:\w+script|data):/i,ce=/[\x00-\x20\xA0\u1680\u180E\u2000-\u2029\u205f\u3000]/g,de=e=>{var i,o,a,s,l,u,c,d;if(pe("beforeSanitizeAttributes",e,null),u=e.attributes){for(c={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:O},d=u.length;d--;){if(i=u[d],o=i.name,a=i.value.trim(),s=o.toLowerCase(),c.attrName=s,c.attrValue=a,c.keepAttr=!0,pe("uponSanitizeAttribute",e,c),a=c.attrValue,"name"===s&&"IMG"===e.nodeName&&u.id)l=u.id,u=Array.prototype.slice.apply(u),ee("id",e),ee(o,e),u.indexOf(l)>d&&e.setAttribute("id",l.value);else{if("INPUT"===e.nodeName&&"type"===s&&"file"===a&&(O[s]||!D[s]))continue;"id"===o&&e.setAttribute(o,""),ee(o,e)}if(c.keepAttr&&(!q||"id"!==s&&"name"!==s||!(a in t||a in r||a in K))){if($&&(a=(a=a.replace(j," ")).replace(I," ")),M&&ae.test(s));else if(R&&se.test(s));else{if(!O[s]||D[s])continue;if(J[s]);else if(le.test(a.replace(ce,"")));else if("src"!==s&&"xlink:href"!==s||0!==a.indexOf("data:")||!V[e.nodeName.toLowerCase()])if(_&&!ue.test(a.replace(ce,"")));else if(a)continue}try{e.setAttribute(o,a),n.removed.pop()}catch(e){}}}pe("afterSanitizeAttributes",e,null)}},fe=e=>{var t,n=ne(e);for(pe("beforeSanitizeShadowDOM",e,null);t=n.nextNode();)pe("uponSanitizeShadowNode",t,null),oe(t)||(t.content instanceof o&&fe(t.content),de(t));pe("afterSanitizeShadowDOM",e,null)},pe=(e,t,r)=>{T[e]&&T[e].forEach(e=>{e.call(n,t,r,Y)})};return n.sanitize=((e,r)=>{var a,l,u,c,d,f;if(e||(e="\x3c!--\x3e"),"string"!=typeof e&&!ie(e)){if("function"!=typeof e.toString)throw new TypeError("toString is not a function");e=""+e}if(!n.isSupported){if("object"==typeof t.toStaticHTML||"function"==typeof t.toStaticHTML){if("string"==typeof e)return t.toStaticHTML(e);if(ie(e))return t.toStaticHTML(e.outerHTML)}return e}if(H||X(r),n.removed=[],e instanceof s)1===(l=(a=te("\x3c!--\x3e")).ownerDocument.importNode(e,!0)).nodeType&&"BODY"===l.nodeName?a=l:a.appendChild(l);else{if(!Z&&!F&&-1===e.indexOf("<"))return e;if(!(a=te(e)))return Z?null:""}for(U&&Q(a.firstChild),d=ne(a);u=d.nextNode();)3===u.nodeType&&u===c||oe(u)||(u.content instanceof o&&fe(u.content),de(u),c=u);if(Z){if(G)for(f=A.call(a.ownerDocument);a.firstChild;)f.appendChild(a.firstChild);else f=a;return W&&(f=E.call(i,f,!0)),f}return F?a.outerHTML:a.innerHTML}),n.setConfig=(e=>{X(e),H=!0}),n.clearConfig=(()=>{Y=null,H=!1}),n.addHook=((e,t)=>{"function"==typeof t&&(T[e]=T[e]||[],T[e].push(t))}),n.removeHook=(e=>{T[e]&&T[e].pop()}),n.removeHooks=(e=>{T[e]&&(T[e]=[])}),n.removeAllHooks=(()=>{T={}}),n})});const Te={$base:L("base"),$body:L("body"),$search:L("#search"),$content:L("#content"),$loading:L("#loading")};L("#back").addEventListener("click",e=>{e.preventDefault(),history.back()}),L("#forward").addEventListener("click",e=>{e.preventDefault(),history.forward()}),L(".dropdown").addEventListener("click",e=>{e.preventDefault(),e.target.parentNode.classList.toggle("show");const t=!!e.target.getAttribute("aria-expanded");e.target.setAttribute("aria-expanded",""+!t),e.target.classList.toggle("active")});const{$base:we,$search:ke,$content:Ce}=Te;L("link").setAttribute("href",`themes/${Ae.theme}/style.css`),z(),L("#newTab").addEventListener("click",e=>{e.preventDefault(),window.open(`${Ae.url}wiki/${L("#search").value}`,"_newtab")}),L('a[href="options.html"]',L(".dropdown-menu")).addEventListener("click",()=>{we.setAttribute("href",""),location.href="options.html"}),addEventListener("hashchange",z),new be(L("#search"),e=>{const t={format:"json",action:"opensearch",search:e,suggest:!0,limit:10};return D(`${Ae.url}w/api.php`,t).then(e=>e[1])}),Ce.addEventListener("click",e=>{const t=O(e.target);if(t)if(F(t.href)){e.preventDefault();const n=H(t.href);ke.value=n,Ce.scrollTop=0,location.hash=C({article:n})}else""!==t.dataset.internal&&(e.preventDefault(),window.open(t.href,"_newtab"))}),L("#search-form").addEventListener("submit",e=>{e.preventDefault(),location.hash=C({article:ke.value})});
