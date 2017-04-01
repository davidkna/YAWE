import DOMPurify from 'dompurify'

// My Imports
import { $, options, fromQueryString } from './helper'
import getJSON from './helper/fetch'

export const domElems = {
  $base: $('base'),
  $body: $('body'),
  $search: $('#search'),
  $content: $('#content'),
  $loading: $('#loading'),
}

// Helpers
function purify(html) {
  return DOMPurify.sanitize(html, {
    RETURN_DOM_FRAGMENT: true,
    RETURN_DOM_IMPORT: true,
  })
}

function displayArticle(response, articleName, show) {
  const [{ text }, ...sections] = response.mobileview.sections
  const { $content } = domElems

  const $h1 = document.createElement('h1')
  $h1.textContent = response.mobileview.normalizedtitle || articleName.replace(/_/g, ' ')
  $content.appendChild($h1)
  $content.appendChild(purify(text))
  show()
  let $target

  sections.forEach((section) => {
    const title = purify(section.line).textContent
    const content = purify(section.text)

    if (section.toclevel === 1) {
      const $details = document.createElement('details')
      const $summary = document.createElement('summary')
      const $h2 = document.createElement('h2')
      const $body = document.createElement('div')

      $h2.textContent = title
      $summary.appendChild($h2)
      $details.appendChild($summary)

      $details.classList.add('card')
      $summary.classList.add('card-header')
      $body.classList.add('card-block')

      $body.appendChild(content)

      $details.appendChild($body)

      $content.appendChild($details)
      $target = $body
    } else {
      const level = section.toclevel <= 6 ? section.toclevel : 6
      const $hx = document.createElement(`h${level}`)
      $hx.textContent = title
      $target.appendChild($hx)
      $target.appendChild(content)
    }
  }, false)
}

function urlparse(url) {
  const a = document.createElement('a')
  a.href = url
  return a
}

// Exports
export function loadFromHash() {
  if (location.hash !== '') {
    const { $search } = domElems
    const hash = fromQueryString(location.hash)
    $search.value = hash.article
    getArticle(hash.article, true) // eslint-disable-line no-use-before-define
  }
}

function prepareRequest(article) {
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
}

function loadArticle(article) {
  // https://en.wikipedia.org/w/api.php?action=help&modules=mobileview
  const wikiOptions = {
    action: 'mobileview',
    format: 'json',
    noheadings: true,
    page: article,
    sections: 'all',
    redirect: 'yes',
  }

  return getJSON(`${options.url}w/api.php`, wikiOptions)
    .then((response) => {
      if (response.error) {
        const error = new Error(response.error.info)
        throw error
      }

      return response
    })
}

function getArticle(article) {
  const {
    $body,
    $content,
    $loading,
  } = domElems

  function show() {
    $content.style.display = 'block'
    $loading.style.display = 'none'
    $body.classList.remove('loading')
    scroll(0, 0)
  }

  function wrapError(msg) {
    const $div = document.createElement('div')
    $div.classList.add('alert')
    $div.classList.add('alert-danger')
    $div.textContent = msg
    return $div
  }

  prepareRequest(article)

  loadArticle(article)
    .then((response) => {
      displayArticle(response, article, show)
    })
    .catch((errorMsg) => {
      show()
      $content.appendChild(wrapError(errorMsg))
    })
}

export function isWikiUrl(testUrl) {
  const parsedUrl = urlparse(testUrl)
  const wikiUrl = urlparse(options.url)

  if (!/^https?:$/.test(parsedUrl.protocol)) return false
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

  function getName() {
    const parsedUrl = urlparse(articleUrl)
    const wikiUrl = urlparse(options.url)

    if (parsedUrl.pathname.startsWith('../wiki/')) {
      return parsedUrl.pathname.substring(8)
    }

    if (wikiUrl.pathname === '/') {
      return parsedUrl.pathname.substring(6)
    }

    return parsedUrl.pathname.substring(wikiUrl.pathname.length + 6)
  }

  return beautify(getName(articleUrl))
}

export function search(query) {
  const ajaxOptions = {
    format: 'json',
    action: 'opensearch',
    search: query,
    suggest: true,
    limit: 10,
  }

  return getJSON(`${options.url}w/api.php`, ajaxOptions)
    .then(response => response[1])
}
