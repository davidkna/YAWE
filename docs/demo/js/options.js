!function(e){function t(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var n={};t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=35)}({0:function(e,t,n){"use strict";t.a=function(e,t=document){return t.querySelector(e)},t.b=function(e){for(let t=e;t.parentNode;t=t.parentNode)if("a"===t.nodeName.toLowerCase())return t;return null},t.d=function(e){return e.match(/^http/)?e.replace(/^http:/,"https:"):`https://${e}`};var r=n(2);n.d(t,"f",function(){return r.b}),n.d(t,"c",function(){return r.a});const o={theme:"custom",url:"https://en.wikipedia.org/"},a=["cerulean","cosmo","custom","cyborg","darkly","flatly","journal","litera","lumen","lux","materia","minty","pulse","sandstone","simplex","slate","solar","spacelab","superhero","united","yeti"],c=function(){const e=localStorage.getItem("settings");if(!e)return localStorage.setItem("settings",JSON.stringify(o)),o;const t=JSON.parse(e);return a.includes(t.theme)||(t.theme=o.theme,localStorage.setItem("settings",JSON.stringify(t))),t}();t.e=c},2:function(e,t,n){"use strict";t.a=function(e){return e.replace(/^[?#]/,"").split("&").reduce((e,t)=>{const{key:n,value:r}=function(e){const[t,n]=e.split("=").map(decodeURIComponent);return{key:t,value:n}}(t);return e[n]=r,e},{})},t.b=function(e){return Object.keys(e).map(t=>{const{key:n,value:r}=function(e,t){return{key:encodeURIComponent(e),value:encodeURIComponent(t)}}(t,e[t]);return`${n}=${r}`}).join("&")}},35:function(e,t,n){"use strict";function r(e){return e.options[e.selectedIndex].getAttribute("value")}function o(e,t){for(let n=0;n<e.options.length;n+=1)if(e.options[n].value===t)return void(e.selectedIndex=n);o(e,"custom")}Object.defineProperty(t,"__esModule",{value:!0});var a=n(0);n(4);const c=Object(a.a)("#content"),u=Object(a.a)("form",c),s=Object(a.a)("#url",u);u.addEventListener("submit",e=>{e.preventDefault();let t=Object(a.d)(s.value);const n=r(Object(a.a)("#theme"));"/"!==t[t.length-1]&&(t+="/"),""===t&&(t="https://en.wikipedia.org/"),localStorage.setItem("settings",JSON.stringify({url:t,theme:n})),location.replace("app.html")}),Object(a.a)("#theme").addEventListener("change",()=>{Object(a.a)("link").setAttribute("href",`themes/${r(Object(a.a)("#theme"))}/style.css`)}),s.setAttribute("value",a.e.url),o(Object(a.a)("#theme"),a.e.theme),Object(a.a)("link").setAttribute("href",`themes/${a.e.theme}/style.css`),s.addEventListener("blur",e=>{s.value=Object(a.d)(s.value)}),Object(a.a)("#newTab").addEventListener("click",e=>{e.preventDefault(),window.open(location.href,"_newtab")})},4:function(e,t,n){"use strict";var r=n(0);Object(r.a)("#back").addEventListener("click",e=>{e.preventDefault(),history.back()}),Object(r.a)("#forward").addEventListener("click",e=>{e.preventDefault(),history.forward()}),Object(r.a)(".dropdown").addEventListener("click",e=>{e.preventDefault();const t=e.target;t.parentElement.querySelector(".dropdown-menu").classList.toggle("show");const n=!!t.getAttribute("aria-expanded");t.setAttribute("aria-expanded",""+!n),t.classList.toggle("active")})}});