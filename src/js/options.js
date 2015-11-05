import { $, http2https, options, timestamp } from './helper'

(() => {
	function getVal(el) : string {
		return el.options[el.selectedIndex].getAttribute('value')
	}

	function setVal(el, val : string) {
		for (let i = 0; i < el.options.length; i++ ) {
			if (el.options[i].value === val) {
				el.selectedIndex = i
				return
			}
		}
		setVal(el, 'custom')
	}

	$('form', $('#content')).addEventListener('submit', (event) => {
		event.preventDefault()
		let url = http2https($('#url').value)
		const theme = getVal($('#theme'))

		if (url[-1] !== '/') {
			url.concat('/')
		}

		if (url === '') {
			url = 'https://en.wikipedia.org/'
		}

		localStorage.setItem('settings', JSON.stringify({
			url: url,
			theme: theme,
			timestamp: timestamp,
		}))

		location.replace('app.html')
	})

	$('#theme').addEventListener('change', () => {
		$('link').setAttribute('href', `bootswatch/${ getVal($('#theme')) }/style.css`)
	})

	$('#url').setAttribute('value', options.url)
	setVal($('#theme'), options.theme)
	$('link').setAttribute('href', `bootswatch/${ options.theme }/style.css`)

	$('.icon-left-open').addEventListener('click', (event) => {
		event.preventDefault()
		history.back()
	})
	$('#url').addEventListener('blur', (event) => {
		event.target.value = http2https(event.target.value)
	})
})()
