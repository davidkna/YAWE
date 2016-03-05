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

import { default as Awesomplete } from 'awesomplete'

document.addEventListener('DOMContentLoaded', () => {
  initDomElems()
  const { $base, $search, $content } = domElems

  $('link').setAttribute('href', `bootswatch/${options.theme}/style.css`)
  loadFromHash()


  $('#back').addEventListener('click', (event) => {
    event.preventDefault()
    history.back()
  })
  $('#forward').addEventListener('click', (event) => {
    event.preventDefault()
    history.forward()
  })
  $('#newTab').addEventListener('click', (event) => {
    event.preventDefault()
    window.open(`${options.url}wiki/${$('#search').value}`, '_newtab')
  })

  addEventListener('hashchange', loadFromHash)

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

  $('a[href="options.html"]').addEventListener('click', () => {
    $base.setAttribute('href', '')
  })

  $('.dropdown .btn').addEventListener('click', (event) => {
    event.preventDefault()
    event.target.classList.toggle('active')

    $('.dropdown-menu').classList.toggle('show')
  })

  $('#search-form').addEventListener('submit', (event) => {
    event.preventDefault()
    getArticle($search.value)
  })
})
