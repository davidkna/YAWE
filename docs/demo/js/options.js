!function(e){function t(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var n={};t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=38)}({0:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(2);t.toQueryString=r.toQueryString,t.fromQueryString=r.fromQueryString,t.$=function(e,t=document){return t.querySelector(e)},t.findParentLink=function(e){for(let t=e;t.parentNode;t=t.parentNode)if("a"===t.nodeName.toLowerCase())return t;return null},t.http2https=function(e){return e.match(/^http/)?e.replace(/^http:/,"https:"):`https://${e}`};const o={theme:"custom",url:"https://en.wikipedia.org/"},s=["cerulean","cosmo","custom","cyborg","darkly","flatly","journal","litera","lumen","lux","materia","minty","pulse","sandstone","simplex","slate","solar","spacelab","superhero","united","yeti"];t.options=function(){const e=localStorage.getItem("settings");if(!e)return localStorage.setItem("settings",JSON.stringify(o)),o;const t=JSON.parse(e);return s.includes(t.theme)||(t.theme=o.theme,localStorage.setItem("settings",JSON.stringify(t))),t}()},2:function(e,t,n){"use strict";function r(e){const[t,n]=e.split("=").map(decodeURIComponent);return{key:t,value:n}}function o(e,t){return{key:encodeURIComponent(e),value:encodeURIComponent(t)}}Object.defineProperty(t,"__esModule",{value:!0}),t.fromQueryString=function(e){return e.replace(/^[?#]/,"").split("&").reduce((e,t)=>{const{key:n,value:o}=r(t);return e[n]=o,e},{})},t.toQueryString=function(e){return Object.keys(e).map(t=>{const{key:n,value:r}=o(t,e[t]);return`${n}=${r}`}).join("&")}},38:function(e,t,n){"use strict";function r(e){return e.options[e.selectedIndex].getAttribute("value")}function o(e,t){for(let n=0;n<e.options.length;n+=1)if(e.options[n].value===t)return void(e.selectedIndex=n);o(e,"custom")}Object.defineProperty(t,"__esModule",{value:!0});const s=n(0);n(5);const i=s.$("#content"),u=s.$("form",i),a=s.$("#url",u);u.addEventListener("submit",e=>{e.preventDefault();let t=s.http2https(a.value);const n=r(s.$("#theme"));"/"!==t[t.length-1]&&(t+="/"),""===t&&(t="https://en.wikipedia.org/"),localStorage.setItem("settings",JSON.stringify({url:t,theme:n})),location.replace("app.html")}),s.$("#theme").addEventListener("change",()=>{s.$("link").setAttribute("href",`themes/${r(s.$("#theme"))}/style.css`)}),a.setAttribute("value",s.options.url),o(s.$("#theme"),s.options.theme),s.$("link").setAttribute("href",`themes/${s.options.theme}/style.css`),a.addEventListener("blur",e=>{a.value=s.http2https(a.value)}),s.$("#newTab").addEventListener("click",e=>{e.preventDefault(),window.open(location.href,"_newtab")})},5:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const r=n(0);r.$("#back").addEventListener("click",e=>{e.preventDefault(),history.back()}),r.$("#forward").addEventListener("click",e=>{e.preventDefault(),history.forward()}),r.$(".dropdown").addEventListener("click",e=>{e.preventDefault();const t=e.target;t.parentNode.classList.toggle("show");const n=!!t.getAttribute("aria-expanded");t.setAttribute("aria-expanded",""+!n),t.classList.toggle("active")})}});