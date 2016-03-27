export { toQueryString, fromQueryString } from './helper/query-string'
export { getJSON } from './helper/ajax'


// Returns first element that matches CSS selector {expr}.
// Querying can optionally be restricted to {container}’s descendants
// Source: http://lea.verou.me/2015/04/jquery-considered-harmful/
export function $(expr, container) {
  return typeof expr === 'string' ? (container || document).querySelector(expr) : expr || null
}

// Finds first parent DOM element that is a link - if it exists
export function findParentLink(el) {
  for (let i = el; i.parentNode; i = i.parentNode) {
    if ((i.nodeName || i.tagName).toLowerCase() === 'a') {
      return i
    }
  }

  return null
}

// Transforms http or plain url to https
export function http2https(url) {
  if (!url.match(/^http/)) {
    return `https://${url}`
  }

  return url.replace(/^http:/, 'https:')
}

// Creates timestamp for saves
export function timestamp() {
  return Math.floor(Date.now() / 1000)
}

// Options to use if none set
const defaultOptions = {
  theme: 'custom',
  url: 'https://en.wikipedia.org/',
  timestamp: timestamp(),
}

// Returns user settings from localStorage
function getOptions() {
  const options = localStorage.getItem('settings')
  if (!options) {
    localStorage.setItem('settings', JSON.stringify(defaultOptions))
    return defaultOptions
  }

  return JSON.parse(localStorage.getItem('settings'))
}

// jscs:disable disallowSemicolons
export const options = getOptions(); // eslint-disable-line semi
