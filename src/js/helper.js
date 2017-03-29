export { toQueryString, fromQueryString } from './helper/query-string'

// Returns first element that matches CSS selector {expr}.
// Querying can optionally be restricted to {container}’s descendants
// Source: http://lea.verou.me/2015/04/jquery-considered-harmful/
export function $(expr, container=document) {
  return container.querySelector(expr)
}

// Finds first parent DOM element that is a link - if it exists
export function findParentLink(el) {
  for (let i = el; i.parentNode; i = i.parentNode) {
    if (i.nodeName.toLowerCase() === 'a') {
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

// Options to use if none set
const defaultOptions = {
  theme: 'custom',
  url: 'https://en.wikipedia.org/',
}

const availableThemes = [
  'cerulean',
  'cosmo',
  'custom',
  'cyborg',
  'darkly',
  'default',
  'flatly',
  'help',
  'journal',
  'litera',
  'lumen',
  'lux',
  'materia',
  'minty',
  'pulse',
  'sandstone',
  'simplex',
  'slate',
  'solar',
  'spacelab',
  'superhero',
  'united',
  'yeti',
]

// Returns user settings from localStorage
function getOptions() {
  const options = localStorage.getItem('settings')
  if (!options) {
    localStorage.setItem('settings', JSON.stringify(defaultOptions))
    return defaultOptions
  } else if (!availableThemes.includes(options.themes)) {
    options.theme = defaultOptions.theme
    localStorage.setItem('settings', JSON.stringify(defaultOptions))
  }

  return JSON.parse(localStorage.getItem('settings'))
}

export const options = getOptions()
