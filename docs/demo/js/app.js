function e(e){return function(t){return null==e?void 0:e[t]}}function t(e,t){for(var n=-1,i=null==e?0:e.length,o=Array(i);++n<i;)o[n]=t(e[n],n,e);return o}function n(e){var t=Q.call(e,ee),n=e[ee];try{e[ee]=void 0}catch(e){}var i=X.call(e);return t?e[ee]=n:delete e[ee],i}function i(e){return ne.call(e)}function o(e){return null==e?void 0===e?oe:ie:re&&re in Object(e)?n(e):i(e)}function r(e){return null!=e&&"object"==typeof e}function a(e){return"symbol"==typeof e||r(e)&&o(e)==ae}function s(e){if("string"==typeof e)return e;if(Y(e))return t(e,s)+"";if(a(e))return ce?ce.call(e):"";var n=e+"";return"0"==n&&1/e==-se?"-0":n}function l(e){return null==e?"":s(e)}function c(e){return(e=l(e))&&e.replace(ue,P).replace(ge,"")}function u(e){return e=l(e),e&&ye.test(e)?e.replace(be,"\\$&"):e}function d(e,t){for(var n=-1,i=t.length,o=e.length;++n<i;)e[o+n]=t[n];return e}function f(e){return r(e)&&o(e)==ve}function p(e){return Y(e)||Ae(e)||!!(we&&e&&e[we])}function h(e,t,n,i,o){var r=-1,a=e.length;for(n||(n=p),o||(o=[]);++r<a;){var s=e[r];t>0&&n(s)?t>1?h(s,t-1,n,i,o):d(o,s):i||(o[o.length]=s)}return o}function m(e){return(null==e?0:e.length)?h(e,1):[]}function g(e){return e.match(Le)||[]}function b(e){return Se.test(e)}function y(e){return e.match(pt)||[]}function v(e,t,n){return e=l(e),t=n?void 0:t,void 0===t?b(e)?y(e):g(e):e.match(t)||[]}function x(e,t){if(1===e.length)return e[0];const n=m(e).sort(([e],[t])=>e-t),i=[n[0]];for(let e=1;e<n.length;e+=1){const o=n[e],r=i[i.length-1];o[0]<=r[1]||/^\s*$/.test(t.slice(r[1],o[0]))?r[1]=Math.max(o[1],r[1]):i.push(o)}return i}function E(e,t){const n=c(e);return x(t.map(e=>{const t=new RegExp(u(c(e)),"gi");const i=[];let o;for(;o=t.exec(n);)i.push([o.index,t.lastIndex]);return i}),n)}function T(e,t,n){const i=E(t,v(n));ke(t,i).forEach(t=>{if(t.highlight){const n=document.createElement("mark");n.textContent=t.text,e.appendChild(n)}else{const n=document.createTextNode(t.text);e.appendChild(n)}})}function A(e){const[t,n]=e.split("=").map(decodeURIComponent);return{key:t,value:n}}function w(e){return e.replace(/^[?#]/,"").split("&").reduce((e,t)=>{const{key:key,value:value}=A(t);e[key]=value;return e},{})}function k(e,t){return{key:encodeURIComponent(e),value:encodeURIComponent(t)}}function L(e){return Object.keys(e).map(t=>{const{key:key,value:value}=k(t,e[t]);return`${key}=${value}`}).join("&")}function S(e,t=document){return t.querySelector(e)}function O(e){for(let t=e;t.parentNode;t=t.parentNode)if("a"===t.nodeName.toLowerCase())return t;return null}function C(){const e=localStorage.getItem("settings");if(!e)return localStorage.setItem("settings",JSON.stringify(mt)),mt;const t=JSON.parse(e);return gt.includes(t.theme)||(t.theme=mt.theme,localStorage.setItem("settings",JSON.stringify(t))),t}function N(e,t){return t={exports:{}},e(t,t.exports),t.exports}function D(e){const t=e.status;if(t>=200&&t<300)return e;throw new Error(`HTTP Error ${t}: ${e.statusText}`)}function M(e){return e.json()}function R(e,t={}){return t.origin="*",fetch(`${e}?${L(t)}`).then(D).then(M)}function _(e){return yt.sanitize(e,{RETURN_DOM_FRAGMENT:!0,RETURN_DOM_IMPORT:!0})}function j(e,t,n){const[{text:text},...i]=e.mobileview.sections,{$content:$content}=vt,o=document.createElement("h1");o.textContent=e.mobileview.normalizedtitle||t.replace(/_/g," "),$content.appendChild(o),$content.appendChild(_(text)),n();let r;i.forEach(e=>{const t=_(e.line).textContent;const n=_(e.text);if(1===e.toclevel){const e=document.createElement("details"),i=document.createElement("summary"),o=document.createElement("h2"),a=document.createElement("div");o.textContent=t,i.appendChild(o),e.appendChild(i),e.classList.add("card"),i.classList.add("card-header"),a.classList.add("card-block"),a.appendChild(n),e.appendChild(a),$content.appendChild(e),r=a}else{const i=e.toclevel<=6?e.toclevel:6,o=document.createElement(`h${i}`);o.textContent=t,r.appendChild(o),r.appendChild(n)}},!1)}function z(e){const t=document.createElement("a");return t.href=e,t}function I(){if(""!==location.hash){const{$search:$search}=vt,e=w(location.hash);$search.value=e.article,U(e.article,!0)}}function H(e){const{$base:$base,$body:$body,$content:$content,$loading:$loading}=vt;$base.setAttribute("href",`${bt.url}wiki/${e}`),$content.innerHTML="",$content.style.display="none",$loading.style.display="block",$body.classList.add("loading")}function F(e){const t={action:"mobileview",format:"json",noheadings:!0,page:e,sections:"all",redirect:"yes"};return R(`${bt.url}w/api.php`,t).then(e=>{if(e.error){const t=new Error(e.error.info);throw t}return e})}function U(e){function t(){$content.style.display="block",$loading.style.display="none",$body.classList.remove("loading"),scroll(0,0)}function n(e){const t=document.createElement("div");return t.classList.add("alert"),t.classList.add("alert-danger"),t.textContent=e,t}const{$body:$body,$content:$content,$loading:$loading}=vt;H(e),F(e).then(n=>{j(n,e,t)}).catch(e=>{t();$content.appendChild(n(e))})}function $(e){const t=z(e),n=z(bt.url);return!!/^https?:$/.test(t.protocol)&&((!t.host||t.host===n.host)&&(!!t.pathname.startsWith("../wiki/")||("/"===n.pathname?"/wiki/"===t.pathname.substring(0,6):t.pathname.substring(0,n.pathname.length+6)===`${n.pathname}/wiki/`)))}function G(e){return function(e){return decodeURIComponent(e.replace(/_/g," "))}(function(){const t=z(e),n=z(bt.url);return t.pathname.startsWith("../wiki/")?t.pathname.substring(8):"/"===n.pathname?t.pathname.substring(6):t.pathname.substring(n.pathname.length+6)}())}function W(e){const t={format:"json",action:"opensearch",search:e,suggest:!0,limit:10};return R(`${bt.url}w/api.php`,t).then(e=>e[1])}var B={"À":"A","Á":"A","Â":"A","Ã":"A","Ä":"A","Å":"A","à":"a","á":"a","â":"a","ã":"a","ä":"a","å":"a","Ç":"C","ç":"c","Ð":"D","ð":"d","È":"E","É":"E","Ê":"E","Ë":"E","è":"e","é":"e","ê":"e","ë":"e","Ì":"I","Í":"I","Î":"I","Ï":"I","ì":"i","í":"i","î":"i","ï":"i","Ñ":"N","ñ":"n","Ò":"O","Ó":"O","Ô":"O","Õ":"O","Ö":"O","Ø":"O","ò":"o","ó":"o","ô":"o","õ":"o","ö":"o","ø":"o","Ù":"U","Ú":"U","Û":"U","Ü":"U","ù":"u","ú":"u","û":"u","ü":"u","Ý":"Y","ý":"y","ÿ":"y","Æ":"Ae","æ":"ae","Þ":"Th","þ":"th","ß":"ss","Ā":"A","Ă":"A","Ą":"A","ā":"a","ă":"a","ą":"a","Ć":"C","Ĉ":"C","Ċ":"C","Č":"C","ć":"c","ĉ":"c","ċ":"c","č":"c","Ď":"D","Đ":"D","ď":"d","đ":"d","Ē":"E","Ĕ":"E","Ė":"E","Ę":"E","Ě":"E","ē":"e","ĕ":"e","ė":"e","ę":"e","ě":"e","Ĝ":"G","Ğ":"G","Ġ":"G","Ģ":"G","ĝ":"g","ğ":"g","ġ":"g","ģ":"g","Ĥ":"H","Ħ":"H","ĥ":"h","ħ":"h","Ĩ":"I","Ī":"I","Ĭ":"I","Į":"I","İ":"I","ĩ":"i","ī":"i","ĭ":"i","į":"i","ı":"i","Ĵ":"J","ĵ":"j","Ķ":"K","ķ":"k","ĸ":"k","Ĺ":"L","Ļ":"L","Ľ":"L","Ŀ":"L","Ł":"L","ĺ":"l","ļ":"l","ľ":"l","ŀ":"l","ł":"l","Ń":"N","Ņ":"N","Ň":"N","Ŋ":"N","ń":"n","ņ":"n","ň":"n","ŋ":"n","Ō":"O","Ŏ":"O","Ő":"O","ō":"o","ŏ":"o","ő":"o","Ŕ":"R","Ŗ":"R","Ř":"R","ŕ":"r","ŗ":"r","ř":"r","Ś":"S","Ŝ":"S","Ş":"S","Š":"S","ś":"s","ŝ":"s","ş":"s","š":"s","Ţ":"T","Ť":"T","Ŧ":"T","ţ":"t","ť":"t","ŧ":"t","Ũ":"U","Ū":"U","Ŭ":"U","Ů":"U","Ű":"U","Ų":"U","ũ":"u","ū":"u","ŭ":"u","ů":"u","ű":"u","ų":"u","Ŵ":"W","ŵ":"w","Ŷ":"Y","ŷ":"y","Ÿ":"Y","Ź":"Z","Ż":"Z","Ž":"Z","ź":"z","ż":"z","ž":"z","Ĳ":"IJ","ĳ":"ij","Œ":"Oe","œ":"oe","ŉ":"'n","ſ":"s"},P=e(B),Z="object"==typeof global&&global&&global.Object===Object&&global,q="object"==typeof self&&self&&self.Object===Object&&self,V=Z||q||Function("return this")(),J=V.Symbol,Y=Array.isArray,K=Object.prototype,Q=K.hasOwnProperty,X=K.toString,ee=J?J.toStringTag:void 0,te=Object.prototype,ne=te.toString,ie="[object Null]",oe="[object Undefined]",re=J?J.toStringTag:void 0,ae="[object Symbol]",se=1/0,le=J?J.prototype:void 0,ce=le?le.toString:void 0,ue=/[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g,de="\\u0300-\\u036f",fe="\\ufe20-\\ufe2f",pe="\\u20d0-\\u20ff",he=de+fe+pe,me="["+he+"]",ge=RegExp(me,"g"),be=/[\\^$.*+?()[\]{}|]/g,ye=RegExp(be.source),ve="[object Arguments]",xe=Object.prototype,Ee=xe.hasOwnProperty,Te=xe.propertyIsEnumerable,Ae=f(function(){return arguments}())?f:function(e){return r(e)&&Ee.call(e,"callee")&&!Te.call(e,"callee")},we=J?J.isConcatSpreadable:void 0,ke=function(e,t){var n=[];return 0===t.length?n.push({text:e,highlight:!1}):t[0][0]>0&&n.push({text:e.slice(0,t[0][0]),highlight:!1}),t.forEach(function(i,o){var r=i[0],a=i[1];n.push({text:e.slice(r,a),highlight:!0}),o===t.length-1?a<e.length&&n.push({text:e.slice(a,e.length),highlight:!1}):a<t[o+1][0]&&n.push({text:e.slice(a,t[o+1][0]),highlight:!1})}),n},Le=/[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g,Se=/[a-z][A-Z]|[A-Z]{2,}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/,Oe="\\ud800-\\udfff",Ce="\\u0300-\\u036f",Ne="\\ufe20-\\ufe2f",De="\\u20d0-\\u20ff",Me=Ce+Ne+De,Re="\\u2700-\\u27bf",_e="a-z\\xdf-\\xf6\\xf8-\\xff",je="\\xac\\xb1\\xd7\\xf7",ze="\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf",Ie="\\u2000-\\u206f",He=" \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000",Fe="A-Z\\xc0-\\xd6\\xd8-\\xde",Ue="\\ufe0e\\ufe0f",$e=je+ze+Ie+He,Ge="['’]",We="["+$e+"]",Be="["+Me+"]",Pe="\\d+",Ze="["+Re+"]",qe="["+_e+"]",Ve="[^"+Oe+$e+Pe+Re+_e+Fe+"]",Je="\\ud83c[\\udffb-\\udfff]",Ye="(?:"+Be+"|"+Je+")",Ke="[^"+Oe+"]",Qe="(?:\\ud83c[\\udde6-\\uddff]){2}",Xe="[\\ud800-\\udbff][\\udc00-\\udfff]",et="["+Fe+"]",tt="\\u200d",nt="(?:"+qe+"|"+Ve+")",it="(?:"+et+"|"+Ve+")",ot="(?:"+Ge+"(?:d|ll|m|re|s|t|ve))?",rt="(?:"+Ge+"(?:D|LL|M|RE|S|T|VE))?",at=Ye+"?",st="["+Ue+"]?",lt="(?:"+tt+"(?:"+[Ke,Qe,Xe].join("|")+")"+st+at+")*",ct="\\d*(?:(?:1st|2nd|3rd|(?![123])\\dth)\\b)",ut="\\d*(?:(?:1ST|2ND|3RD|(?![123])\\dTH)\\b)",dt=st+at+lt,ft="(?:"+[Ze,Qe,Xe].join("|")+")"+dt,pt=RegExp([et+"?"+qe+"+"+ot+"(?="+[We,et,"$"].join("|")+")",it+"+"+rt+"(?="+[We,et+nt,"$"].join("|")+")",et+"?"+nt+"+"+ot,et+"+"+rt,ut,ct,Pe,ft].join("|"),"g");class ht{constructor(e,t){this.input=e,this.getCompletion=t,this.input.setAttribute("aria-autocomplete","list"),this.index=-1,this.typedValue=this.input.value,this.container=this.input.parentElement,this.ul=this.input.nextElementSibling,this.input.addEventListener("input",this.refresh.bind(this)),this.input.addEventListener("blur",this.close.bind(this)),this.input.addEventListener("keydown",e=>{const t=e.key;this.ul.hasAttribute("hidden")||("Enter"!==t&&"Tab"!==t||this.index===-1?"Escape"===t?this.close():"ArrowUp"!==t&&"ArrowDown"!==t||(e.preventDefault(),this["ArrowUp"===t?"previous":"next"]()):("Tab"===t&&e.preventDefault(),this.input.value=this.list[this.index],this.close()))}),this.input.form.addEventListener("submit",this.close.bind(this)),this.ul.addEventListener("click",e=>{let t=e.target;if(t!==this){for(;t&&!/li/i.test(t.nodeName);)t=t.parentNode;if(!t)return;e.preventDefault(),this.li.input=t.innerText,this.close()}})}close(){this.ul.setAttribute("hidden",""),this.index=-1}open(){this.ul.removeAttribute("hidden")}next(){const e=this.list.length;this.goto(this.index<e-1?this.index+1:-1)}previous(){const e=this.list.length;this.goto(this.index!==-1?this.index-1:e-1)}goto(e){const t=this.ul.children;this.index!==-1&&t[this.index].setAttribute("aria-selected","false"),this.index=e,t.length>0&&(e>-1?(t[e].setAttribute("aria-selected","true"),this.input.value=t[e].textContent):this.input.value=this.typedValue)}refresh(){this.index=-1;const e=this.typedValue=this.input.value;0!==this.input.value.length?this.getCompletion(this.input.value).then(t=>{e===this.typedValue&&(this.list=t,this.showCompletions())}):this.close()}showCompletions(){if(0===this.list.length)return void this.close();const e=this.ul.children;if(this.list.length<e.length)for(let t=this.list.length;t<e.length;t+=1)this.ul.removeChild(e[t]);this.list.forEach((t,n)=>{if(!e[n]){const e=document.createElement("li");this.ul.appendChild(e)}const i=e[n];i.innerHTML="";T(i,t,this.input.value);i.setAttribute("aria-selected","false")}),this.open()}}const mt={theme:"custom",url:"https://en.wikipedia.org/"},gt=["cerulean","cosmo","custom","cyborg","darkly","flatly","journal","litera","lumen","lux","materia","minty","pulse","sandstone","simplex","slate","solar","spacelab","superhero","united","yeti"],bt=C();var yt=N(function(e){!function(t){"use strict";var n="undefined"==typeof window?null:window;e.exports=t(n)}(function e(t){"use strict";var n=function(t){return e(t)};if(n.version="0.8.5",n.removed=[],!t||!t.document||9!==t.document.nodeType)return n.isSupported=!1,n;var i=t.document,o=i,r=t.DocumentFragment,a=t.HTMLTemplateElement,s=t.Node,l=t.NodeFilter,c=t.NamedNodeMap||t.MozNamedAttrMap,u=t.Text,d=t.Comment,f=t.DOMParser;if("function"==typeof a){var p=i.createElement("template");p.content&&p.content.ownerDocument&&(i=p.content.ownerDocument)}var h=i.implementation,m=i.createNodeIterator,g=i.getElementsByTagName,b=i.createDocumentFragment,y=o.importNode,v={};n.isSupported=void 0!==h.createHTMLDocument&&9!==i.documentMode;var x=function(e,t){for(var n=t.length;n--;)"string"==typeof t[n]&&(t[n]=t[n].toLowerCase()),e[t[n]]=!0;return e},E=function(e){var t,n={};for(t in e)e.hasOwnProperty(t)&&(n[t]=e[t]);return n},T=null,A=x({},["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","pre","progress","q","rp","rt","ruby","s","samp","section","select","shadow","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr","svg","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","filter","font","g","glyph","glyphref","hkern","image","line","lineargradient","marker","mask","metadata","mpath","path","pattern","polygon","polyline","radialgradient","rect","stop","switch","symbol","text","textpath","title","tref","tspan","view","vkern","feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feMerge","feMergeNode","feMorphology","feOffset","feSpecularLighting","feTile","feTurbulence","math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmuliscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mpspace","msqrt","mystyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover","#text"]),w=null,k=x({},["accept","action","align","alt","autocomplete","background","bgcolor","border","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","coords","datetime","default","dir","disabled","download","enctype","face","for","headers","height","hidden","high","href","hreflang","id","ismap","label","lang","list","loop","low","max","maxlength","media","method","min","multiple","name","noshade","novalidate","nowrap","open","optimum","pattern","placeholder","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","rows","rowspan","spellcheck","scope","selected","shape","size","span","srclang","start","src","step","style","summary","tabindex","title","type","usemap","valign","value","width","xmlns","accent-height","accumulate","additivive","alignment-baseline","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","clip","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dur","edgemode","elevation","end","fill","fill-opacity","fill-rule","filter","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","image-rendering","in","in2","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","mode","min","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","points","preservealpha","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","specularconstant","specularexponent","spreadmethod","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","surfacescale","targetx","targety","transform","text-anchor","text-decoration","text-rendering","textlength","u1","u2","unicode","values","viewbox","visibility","vert-adv-y","vert-origin-x","vert-origin-y","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","y","y1","y2","z","zoomandpan","accent","accentunder","bevelled","close","columnsalign","columnlines","columnspan","denomalign","depth","display","displaystyle","fence","frame","largeop","length","linethickness","lspace","lquote","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),L=null,S=null,O=!0,C=!1,N=!1,D=!1,M=!1,R=!1,_=!1,j=!1,z=!0,I=!0,H=x({},["audio","head","math","script","style","svg","video"]),F=x({},["audio","video","img","source"]),U=x({},["alt","class","for","id","label","name","pattern","placeholder","summary","title","value","style","xmlns"]),$=null,G=i.createElement("form"),W=function(e){"object"!=typeof e&&(e={}),T="ALLOWED_TAGS"in e?x({},e.ALLOWED_TAGS):A,w="ALLOWED_ATTR"in e?x({},e.ALLOWED_ATTR):k,L="FORBID_TAGS"in e?x({},e.FORBID_TAGS):{},S="FORBID_ATTR"in e?x({},e.FORBID_ATTR):{},O=e.ALLOW_DATA_ATTR!==!1,C=e.ALLOW_UNKNOWN_PROTOCOLS||!1,N=e.SAFE_FOR_JQUERY||!1,D=e.SAFE_FOR_TEMPLATES||!1,M=e.WHOLE_DOCUMENT||!1,R=e.RETURN_DOM||!1,_=e.RETURN_DOM_FRAGMENT||!1,j=e.RETURN_DOM_IMPORT||!1,z=e.SANITIZE_DOM!==!1,I=e.KEEP_CONTENT!==!1,D&&(O=!1),_&&(R=!0),e.ADD_TAGS&&(T===A&&(T=E(T)),x(T,e.ADD_TAGS)),e.ADD_ATTR&&(w===k&&(w=E(w)),x(w,e.ADD_ATTR)),e.ADD_URI_SAFE_ATTR&&x(U,e.ADD_URI_SAFE_ATTR),I&&(T["#text"]=!0),Object&&"freeze"in Object&&Object.freeze(e),$=e},B=function(e){n.removed.push({element:e});try{e.parentNode.removeChild(e)}catch(t){e.outerHTML=""}},P=function(e,t){n.removed.push({attribute:t.getAttributeNode(e),from:t}),t.removeAttribute(e)},Z=function(e){var t,n;try{t=(new f).parseFromString(e,"text/html")}catch(e){}return t&&t.documentElement||(t=h.createHTMLDocument(""),n=t.body,n.parentNode.removeChild(n.parentNode.firstElementChild),n.outerHTML=e),"function"==typeof t.getElementsByTagName?t.getElementsByTagName(M?"html":"body")[0]:g.call(t,M?"html":"body")[0]},q=function(e){return m.call(e.ownerDocument||e,e,l.SHOW_ELEMENT|l.SHOW_COMMENT|l.SHOW_TEXT,function(){return l.FILTER_ACCEPT},!1)},V=function(e){return!(e instanceof u||e instanceof d)&&!("string"==typeof e.nodeName&&"string"==typeof e.textContent&&"function"==typeof e.removeChild&&e.attributes instanceof c&&"function"==typeof e.removeAttribute&&"function"==typeof e.setAttribute)},J=function(e){return"object"==typeof s?e instanceof s:e&&"object"==typeof e&&"number"==typeof e.nodeType&&"string"==typeof e.nodeName},Y=function(e){var t,i;if(ie("beforeSanitizeElements",e,null),V(e))return B(e),!0;if(t=e.nodeName.toLowerCase(),ie("uponSanitizeElement",e,{tagName:t,allowedTags:T}),!T[t]||L[t]){if(I&&!H[t]&&"function"==typeof e.insertAdjacentHTML)try{e.insertAdjacentHTML("AfterEnd",e.innerHTML)}catch(e){}return B(e),!0}return!N||e.firstElementChild||e.content&&e.content.firstElementChild||!/</g.test(e.textContent)||(n.removed.push({element:e.cloneNode()}),e.innerHTML=e.textContent.replace(/</g,"&lt;")),D&&3===e.nodeType&&(i=e.textContent,i=i.replace(/\{\{[\s\S]*|[\s\S]*\}\}/gm," "),i=i.replace(/<%[\s\S]*|[\s\S]*%>/gm," "),e.textContent!==i&&(n.removed.push({element:e.cloneNode()}),e.textContent=i)),ie("afterSanitizeElements",e,null),!1},K=/^data-[\-\w.\u00B7-\uFFFF]/,Q=/^(?:(?:(?:f|ht)tps?|mailto|tel):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,X=/^(?:\w+script|data):/i,ee=/[\x00-\x20\xA0\u1680\u180E\u2000-\u2029\u205f\u3000]/g,te=function(e){var o,r,a,s,l,c,u,d;if(ie("beforeSanitizeAttributes",e,null),c=e.attributes){for(u={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:w},d=c.length;d--;)if(o=c[d],r=o.name,a=o.value.trim(),s=r.toLowerCase(),u.attrName=s,u.attrValue=a,u.keepAttr=!0,ie("uponSanitizeAttribute",e,u),a=u.attrValue,"name"===s&&"IMG"===e.nodeName&&c.id?(l=c.id,c=Array.prototype.slice.apply(c),P("id",e),P(r,e),c.indexOf(l)>d&&e.setAttribute("id",l.value)):("id"===r&&e.setAttribute(r,""),P(r,e)),u.keepAttr&&(!z||"id"!==s&&"name"!==s||!(a in t||a in i||a in G))){if(D&&(a=a.replace(/\{\{[\s\S]*|[\s\S]*\}\}/gm," "),a=a.replace(/<%[\s\S]*|[\s\S]*%>/gm," ")),O&&K.test(s));else{if(!w[s]||S[s])continue;if(U[s]);else if(Q.test(a.replace(ee,"")));else if("src"===s&&0===a.indexOf("data:")&&F[e.nodeName.toLowerCase()]);else if(C&&!X.test(a.replace(ee,"")));else if(a)continue}try{e.setAttribute(r,a),n.removed.pop()}catch(e){}}ie("afterSanitizeAttributes",e,null)}},ne=function(e){var t,n=q(e);for(ie("beforeSanitizeShadowDOM",e,null);t=n.nextNode();)ie("uponSanitizeShadowNode",t,null),Y(t)||(t.content instanceof r&&ne(t.content),te(t));ie("afterSanitizeShadowDOM",e,null)},ie=function(e,t,i){v[e]&&v[e].forEach(function(e){e.call(n,t,i,$)})};return n.sanitize=function(e,i){var a,l,c,u,d,f;if(e||(e="<!-->"),"string"!=typeof e&&!J(e)){if("function"!=typeof e.toString)throw new TypeError("toString is not a function");e=e.toString()}if(!n.isSupported){if("object"==typeof t.toStaticHTML||"function"==typeof t.toStaticHTML){if("string"==typeof e)return t.toStaticHTML(e);if(J(e))return t.toStaticHTML(e.outerHTML)}return e}if(W(i),n.removed=[],e instanceof s)a=Z("<!-->"),l=a.ownerDocument.importNode(e,!0),1===l.nodeType&&"BODY"===l.nodeName?a=l:a.appendChild(l);else{if(!R&&!M&&e.indexOf("<")===-1)return e;if(!(a=Z(e)))return R?null:""}for(d=q(a);c=d.nextNode();)3===c.nodeType&&c===u||Y(c)||(c.content instanceof r&&ne(c.content),te(c),u=c);if(R){if(_)for(f=b.call(a.ownerDocument);a.firstChild;)f.appendChild(a.firstChild);else f=a;return j&&(f=y.call(o,f,!0)),f}return M?a.outerHTML:a.innerHTML},n.addHook=function(e,t){"function"==typeof t&&(v[e]=v[e]||[],v[e].push(t))},n.removeHook=function(e){v[e]&&v[e].pop()},n.removeHooks=function(e){v[e]&&(v[e]=[])},n.removeAllHooks=function(){v={}},n})});const vt={$base:S("base"),$body:S("body"),$search:S("#search"),$content:S("#content"),$loading:S("#loading")};S("#back").addEventListener("click",e=>{e.preventDefault();history.back()}),S("#forward").addEventListener("click",e=>{e.preventDefault();history.forward()}),S(".dropdown").addEventListener("click",e=>{e.preventDefault();e.target.parentNode.classList.toggle("show");const t=Boolean(e.target.getAttribute("aria-expanded"));e.target.setAttribute("aria-expanded",(!t).toString());e.target.classList.toggle("active")});const{$base:$base,$search:$search,$content:$content}=vt;S("link").setAttribute("href",`bootswatch/${bt.theme}/style.css`),I(),S("#newTab").addEventListener("click",e=>{e.preventDefault();window.open(`${bt.url}wiki/${S("#search").value}`,"_newtab")}),S('a[href="options.html"]',S(".dropdown-menu")).addEventListener("click",()=>{$base.setAttribute("href","");location.href="options.html"}),addEventListener("hashchange",I),new ht(S("#search"),W),$content.addEventListener("click",e=>{const t=O(e.target);if(t)if($(t.href)){e.preventDefault();const n=G(t.href);$search.value=n,$content.scrollTop=0,location.hash=L({article:n})}else""!==t.dataset.internal&&(e.preventDefault(),window.open(t.href,"_newtab"))}),S("#search-form").addEventListener("submit",e=>{e.preventDefault();location.hash=L({article:$search.value})});
