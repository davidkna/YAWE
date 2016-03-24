import { $, findParentLink, options } from './helper'
import {
  articleNameFromUrl,
  domElems,
  getArticle,
  isWikiUrl,
  loadFromHash,
  search,
  initDomElems,
} from './wiki'

import './navigation'

import { default as Awesomplete } from 'awesomplete'

initDomElems()
const { $base, $search, $content } = domElems

// Load theme
$('link').setAttribute('href', `bootswatch/${options.theme}/style.css`)

// Load article directly - base on url
loadFromHash()

// New Tab support
$('#newTab').addEventListener('click', (event) => {
  event.preventDefault()
  window.open(`${options.url}wiki/${$('#search').value}`, '_newtab')
})

// Make options link work properly
$('a[href="options.html"]').addEventListener('click', () => {
  $base.setAttribute('href', '')
})

// Listen to url changes
addEventListener('hashchange', loadFromHash)

// Autocomplete
const awesome = new Awesomplete($('#search'), {
  minChars: 1,
  maxItems: 10,
})
$search.addEventListener('input', () => {
  search($search.value, (response) => {
    awesome.list = response
    awesome.evaluate()
  })
})

// Internal wiki link support
$content.addEventListener('click', (event) => {
  const target = findParentLink(event.target)
  if (target) {
    if (isWikiUrl(target.href)) {
      event.preventDefault()
      const searchTerm = articleNameFromUrl(target.href)

      $search.value = searchTerm
      $content.scrollTop = 0
      getArticle(searchTerm)
    } else {
      if (target.dataset.internal !== '') {
        event.preventDefault()
        window.open(target.href, '_newtab')
      }
    }
  }
})

// Minimal dropdown menu
$('.dropdown .btn').addEventListener('click', (event) => {
  event.preventDefault()
  event.target.classList.toggle('active')

  $('.dropdown-menu').classList.toggle('show')
})

// Load article on submit
$('#search-form').addEventListener('submit', (event) => {
  event.preventDefault()
  getArticle($search.value)
})
