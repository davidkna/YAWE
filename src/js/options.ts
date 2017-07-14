import { $, http2https, options } from './helper'
import './navigation'

// get <select> value
function getVal(el) {
  return el.options[el.selectedIndex].getAttribute('value')
}

// set <select> value
function setVal(el, val) {
  for (let i = 0; i < el.options.length; i += 1) {
    if (el.options[i].value === val) {
      el.selectedIndex = i // eslint-disable-line no-param-reassign
      return
    }
  }

  setVal(el, 'custom')
}

const $content = <HTMLDivElement>$('#content')
const $form = <HTMLFormElement>$('form', $content)
const $url = <HTMLInputElement>$('#url', $form)

// Save on submit
$form.addEventListener('submit', (event) => {
  event.preventDefault()
  let url = http2https($url.value)
  const theme = getVal($('#theme'))

  if (url[url.length - 1] !== '/') {
    url += '/'
  }

  if (url === '') {
    url = 'https://en.wikipedia.org/'
  }

  localStorage.setItem('settings', JSON.stringify({
    url,
    theme,
  }))

  location.replace('app.html')
})

// Theme preview
$('#theme').addEventListener('change', () => {
  $('link').setAttribute('href', `themes/${getVal($('#theme'))}/style.css`)
})

// Set initial values
$url.setAttribute('value', options.url)
setVal($('#theme'), options.theme)

// Load theme
$('link').setAttribute('href', `themes/${options.theme}/style.css`)

// fix url to https on blur
$url.addEventListener('blur', (event) => {
  $url.value = http2https($url.value)
})

// New Tab support
$('#newTab').addEventListener('click', (event) => {
  event.preventDefault()
  window.open(location.href, '_newtab')
})
