// My Imports
import { $, options, getJSON } from './helper'

// Vendor Imports
import url from 'url'
import qs from 'query-string'


// Helpers
function prepareResponse(response, article) {
	const sections = response.mobileview.sections
	const title = response.mobileview.normalizedtitle || article.replace(/_/g, ' ')
	let result = ''

	result += `<h1>${ title }</h1>`
	result += sections[0].text

	let i = 1
	while (sections[i]) {
		result += `<details><summary><h2>${ sections[i].line }</h2></summary>`
		result += `<div class='panel-body'>${ sections[i].text }`
		i++

		while (sections[i] && sections[i].toclevel !== 1) {
			let level = sections[i].toclevel + 1
			if (level > 6) {
				level = 6
			}
			result += `<h${ level }>${ sections[i].line }</h${ level }>`
			result += `${ sections[i].text }`
			i++
		}
		result += '</div></details>'
	}
	return result
}

// Exports
export function getArticle(article) {
	function wrapError(msg) {
		return `<div class='alert alert-danger'>${ msg }</div>`
	}

	$('base').setAttribute('href', options.url + 'wiki/' + article)
	$('#content').innerHTML = ''
	$('#content').style.display = 'none'
	$('#loading').style.display = 'block'
	$('body').classList.add('loading')
	if (qs.parse(location.hash).article !== article) {
		location.hash = qs.stringify({
			article: article,
		})
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

	getJSON(`${ options.url }w/api.php?${ qs.stringify(wikiOptions) }`)
		.then(response => {
			if (response.error) {
				$('#content').innerHTML = wrapError(response.error.info)
			} else {
				$('#content').innerHTML = prepareResponse(response, article)
			}
			$('#content').style.display = 'block'
			$('#loading').style.display = 'none'
			$('body').classList.remove('loading')
		}, errorMsg => {
			$('#content').innerHTML = wrapError(errorMsg)
			$('#content').style.display = 'block'
			$('#loading').style.display = 'none'
			$('body').classList.remove('loading')
		})
}

export function isWikiUrl(testUrl) {
	const parsedUrl = url.parse(testUrl)
	const wikiUrl   = url.parse(options.url)

	if (! /^https?:$/.test(parsedUrl.protocol)) return false
	if (parsedUrl.host) {
		if (parsedUrl.host !== wikiUrl.host) return false
	}
	if (parsedUrl.pathname.startsWith('../wiki/')) return true

	if (wikiUrl.pathname === '/') {
		return parsedUrl.pathname.substring(0, 6) === '/wiki/'
	}

	return parsedUrl.pathname.substring(0, wikiUrl.pathname.length + 6) === wikiUrl.pathname + '/wiki/'
}

export function articleNameFromUrl(articleUrl) {
	const parsedUrl = url.parse(articleUrl)
	const wikiUrl   = url.parse(options.url)

	if (parsedUrl.pathname.startsWith('../wiki/')) {
		return decodeURIComponent(parsedUrl.pathname.substring(8))
	}

	if (wikiUrl.pathname === '/') {
		return decodeURIComponent(parsedUrl.pathname.substring(6))
	}

	return decodeURIComponent(parsedUrl.pathname.substring(wikiUrl.pathname.length + 6))
}

export function loadFromHash() {
	if (location.hash !== '') {
		const hash = qs.parse(location.hash)
		$('#search').setAttribute('value', hash.article)
		getArticle(hash.article, true)
	}
}

export function search(query, callback) {
	const ajaxOptions = qs.stringify({
		format: 'json',
		action: 'opensearch',
		search: query,
		suggest: true,
		limit: 10,
	})

	getJSON(`${ options.url }w/api.php?${ ajaxOptions }`)
		.then((response) => {
			callback(response[1])
		})
}
