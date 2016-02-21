// My Imports
import { $, options, getJSON, fromQueryString, toQueryString } from './helper'


// Helpers
function prepareResponse(response, article) {
	const title = response.mobileview.normalizedtitle || article.replace(/_/g, ' ')
	const [first, ...sections] = response.mobileview.sections

	let result = ''

	result += `<h1>${title}</h1>`
	result += first.text

	let i = 0
	while (sections[i]) {
		result += `<details><summary><h2>${sections[i].line}</h2></summary>`
		result += `<div class='panel-body'>${sections[i].text}`
		i++

		while (sections[i] && sections[i].toclevel !== 1) {
			let level = sections[i].toclevel + 1
			if (level > 6) {
				level = 6
			}
			result += `<h${level}>${sections[i].line}</h${level}>`
			result += `${sections[i].text}`
			i++
		}
		result += '</div></details>'
	}
	return result
}

function urlparse(url) {
	const a = document.createElement('a')
	a.href = url
	return a
}

export let domElems = {}

export function initDomElems() {
	domElems = {
		$base: $('base'),
		$body: $('body'),
		$search: $('#search'),
		$content: $('#content'),
		$loading: $('#loading'),
	}
}
// DOM constants

// Exports
export function loadFromHash() {
	if (location.hash !== '') {
		const { $search } = domElems
		const hash = fromQueryString(location.hash)
		$search.value = hash.article
		getArticle(hash.article, true) // eslint-disable-line no-use-before-define
	}
}

export function getArticle(article) {
	function wrapError(msg) {
		return `<div class='alert alert-danger'>${msg}</div>`
	}

	const {
		$base,
		$body,
		$content,
		$loading,
	} = domElems

	$base.setAttribute('href', `${options.url}wiki/${article}`)
	$content.innerHTML = ''
	$content.style.display = 'none'
	$loading.style.display = 'block'
	$body.classList.add('loading')
	if (fromQueryString(location.hash).article !== article) {
		removeEventListener('hashchange', loadFromHash)
		location.hash = toQueryString({
			article,
		})
		addEventListener('hashchange', loadFromHash)
	}

	// https://en.wikipedia.org/w/api.php?action=help&modules=mobileview
	const wikiOptions = {
		action: 'mobileview',
		format: 'json',
		noheadings: true,
		page: article,
		sections: 'all',
		redirect: 'yes',
	}

	getJSON(`${options.url}w/api.php?${toQueryString(wikiOptions)}`)
		.then(response => {
			scroll(0, 0)
			if (response.error) {
				$content.innerHTML = wrapError(response.error.info)
			} else {
				$content.innerHTML = prepareResponse(response, article)
			}
			$content.style.display = 'block'
			$loading.style.display = 'none'
			$body.classList.remove('loading')
		}, errorMsg => {
			$content.innerHTML = wrapError(errorMsg)
			$content.style.display = 'block'
			$loading.style.display = 'none'
			$body.classList.remove('loading')
		})
}

export function isWikiUrl(testUrl) {
	const parsedUrl = urlparse(testUrl)
	const wikiUrl = urlparse(options.url)

	if (! /^https?:$/.test(parsedUrl.protocol)) return false
	if (parsedUrl.host) {
		if (parsedUrl.host !== wikiUrl.host) return false
	}
	if (parsedUrl.pathname.startsWith('../wiki/')) return true

	if (wikiUrl.pathname === '/') {
		return parsedUrl.pathname.substring(0, 6) === '/wiki/'
	}

	const shortPathname = parsedUrl.pathname.substring(0, wikiUrl.pathname.length + 6)
	return shortPathname === `${wikiUrl.pathname}/wiki/`
}

export function articleNameFromUrl(articleUrl) {
	function beautify(name) {
		return decodeURIComponent(name.replace(/_/g, ' '))
	}
	const parsedUrl = urlparse(articleUrl)
	const wikiUrl = urlparse(options.url)

	if (parsedUrl.pathname.startsWith('../wiki/')) {
		return beautify(parsedUrl.pathname.substring(8))
	}

	if (wikiUrl.pathname === '/') {
		return beautify(parsedUrl.pathname.substring(6))
	}

	return beautify(parsedUrl.pathname.substring(wikiUrl.pathname.length + 6))
}

export function search(query, callback) {
	const ajaxOptions = toQueryString({
		format: 'json',
		action: 'opensearch',
		search: query,
		suggest: true,
		limit: 10,
	})

	getJSON(`${options.url}w/api.php?${ajaxOptions}`)
		.then((response) => {
			callback(response[1])
		})
}
