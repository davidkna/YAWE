// Returns first element that matches CSS selector {expr}.
// Querying can optionally be restricted to {container}’s descendants
// Source: http://lea.verou.me/2015/04/jquery-considered-harmful/
export function $(expr, container) {
	return typeof expr === 'string' ? (container || document).querySelector(expr) : expr || null
}

export function findParentLink(el) {
	for (let i = el; i.parentNode; i = i.parentNode) {
		if ((i.nodeName || i.tagName).toLowerCase() === 'a') {
			return i
		}
	}

	return null
}

export function http2https(url) {
	if (!url.match(/^http/)) {
		return `https://${url}`
	}
	return url.replace(/^http:/, 'https:')
}

// Check HTTP status code
function checkStatus(response) {
	const status = response.status
	if (status >= 200 && status < 300) {
		return response
	}

	const error = new Error(`HTTP Error ${status}: ${response.statusText}`)
	throw error
}

// Parse fetched JSON
function parseJSON(response) {
	return response.json()
}

// Returns promise with fetched data from url parsed as JSON
export function getJSON(url) {
	return fetch(url)
		.then(checkStatus)
		.then(parseJSON)
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

// Transforms query string to Map
export function fromQueryString(str) {
	const result = {}
	str
		.replace(/^[\?#]/, '')
		.split('&')
		.forEach(n => {
			const [key, value] = n.split('=')
			result[key] = decodeURIComponent(value)
		})
	return result
}

export function toQueryString(obj) {
	return Object
		.keys(obj)
		.map(key => `${key}=${encodeURIComponent(obj[key])}`)
		.join('&')
}

export const options = getOptions()
