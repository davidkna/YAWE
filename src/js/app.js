import Autocomplete from 'yawe-autocomplete'

import { $, findParentLink, options, toQueryString, fromQueryString } from './helper'
import {
  articleNameFromUrl,
  domElems,
  isWikiUrl,
  viewArticle,
  getAutocompleteSuggestions,
} from './wiki'

import './navigation'

const { $base, $search, $content } = domElems

// Load theme
$('link').setAttribute('href', `themes/${options.theme}/style.css`)

// Load article directly - base on url
function loadFromHash() {
  if (location.hash !== '') {
    const hash = fromQueryString(location.hash)
    $search.value = hash.article
    viewArticle(hash.article) // eslint-disable-line no-use-before-define
  }
}
loadFromHash()

// New Tab support
$('#newTab').addEventListener('click', (event) => {
  event.preventDefault()
  window.open(`${options.url}wiki/${$('#search').value}`, '_newtab')
})

// Make options link work properly
$('a[href="options.html"]', $('.dropdown-menu')).addEventListener('click', () => {
  $base.setAttribute('href', '')
  location.href = 'options.html'
})

// Listen to url changes
addEventListener('hashchange', loadFromHash)

// Autocomplete
new Autocomplete($('#search'), getAutocompleteSuggestions) // eslint-disable-line  no-new

// Internal wiki link support
$content.addEventListener('click', (event) => {
  const target = findParentLink(event.target)
  if (target) {
    if (isWikiUrl(target.href)) {
      event.preventDefault()
      const searchTerm = articleNameFromUrl(target.href)

      $search.value = searchTerm
      $content.scrollTop = 0
      location.hash = toQueryString({
        article: searchTerm,
      })
    } else if (target.dataset.internal !== '') {
      event.preventDefault()
      window.open(target.href, '_newtab')
    }
  }
})

// Load article on submit
$('#search-form').addEventListener('submit', (event) => {
  event.preventDefault()
  location.hash = toQueryString({
    article: $search.value,
  })
})
