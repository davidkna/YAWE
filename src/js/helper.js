// Returns first element that matches CSS selector {expr}.
// Querying can optionally be restricted to {container}’s descendants
// Source: http://lea.verou.me/2015/04/jquery-considered-harmful/
export function $(expr, container) {
	return typeof expr === 'string' ? (container || document).querySelector(expr) : expr || null
}

// Returns all elements that match CSS selector {expr} as an array.
// Querying can optionally be restricted to {container}’s descendants
// Source: http://lea.verou.me/2015/04/jquery-considered-harmful/
export function $$(expr, container) {
	return [].slice.call((container || document).querySelectorAll(expr))
}

export function findParentLink(el) {
	if ((el.nodeName || el.tagName).toLowerCase() === 'a') {
		return el
	}
	if (el.parentNode) {
		return findParentLink(el.parentNode)
	}
	return null
}

export function http2https(url : string) {
	if (!url.match(/^http/)) {
		return `https://${ url }`
	}
	return url.replace(/^http:/, 'https:')
}

// Returns url as JSON
// Source: https://mathiasbynens.be/notes/xhr-responsetype-json
export function getJSON(url: string) {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest()
		xhr.open('get', url, true)
		xhr.responseType = 'json'
		xhr.setRequestHeader( 'Api-User-Agent', 'YAWE/4.0' )
		xhr.addEventListener('load', () => {
			const status = xhr.status
			if (status === 200) {
				resolve(xhr.response)
			} else {
				reject(`${ status }: ${ xhr.statusText}`)
			}
		})
		xhr.send()
	})
}

// Creates timestamp for saves
export function timestamp() : number {
	return Math.floor(Date.now() / 1000)
}

const defaultOptions = {
	theme: 'custom',
	url: 'https://en.wikipedia.org/',
	timestamp: timestamp(),
}

function getOptions() : Object {
	const options = localStorage.getItem('settings')
	if (!options) {
		localStorage.setItem('settings', JSON.stringify(defaultOptions))
		return defaultOptions
	}
	return JSON.parse(localStorage.getItem('settings'))
}

export const options = getOptions()
