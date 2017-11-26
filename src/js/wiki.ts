const DOMPurify = require('dompurify')

// My Imports
import { $, options } from './helper'
import getJSON from './helper/fetch'

export const domElems = {
  $base: <HTMLBaseElement>$('base'),
  $body: <HTMLBodyElement>$('body'),
  $search: <HTMLInputElement>$('#search'),
  $content: <HTMLDivElement>$('#content'),
  $loading: <HTMLDivElement>$('#loading'),
}

// Helpers
function purify(html: string) {
  return DOMPurify.sanitize(html, {
    RETURN_DOM_FRAGMENT: true,
    RETURN_DOM_IMPORT: true,
  })
}

function parseArticle(response, articleName) {
  const [{ text }, ...sections] = response.mobileview.sections
  const fragment = document.createDocumentFragment()

  const $h1 = document.createElement('h1')
  $h1.textContent = response.mobileview.normalizedtitle || articleName.replace(/_/g, ' ')
  fragment.appendChild($h1)
  fragment.appendChild(purify(text))
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
      $body.classList.add('card-body')

      $body.appendChild(content)

      $details.appendChild($body)

      fragment.appendChild($details)
      $target = $body
    } else {
      const level = section.toclevel <= 6 ? section.toclevel : 6
      const $hx = document.createElement(`h${level}`)
      $hx.textContent = title
      $target.appendChild($hx)
      $target.appendChild(content)
    }
  }, false)
  return fragment
}

function urlparse(url) {
  const a = document.createElement('a')
  a.href = url
  return a
}

function switchToLoadingView(article) {
  const {
    $base,
    $body,
    $content,
    $loading,
  } = domElems

  $base.setAttribute('href', `${options.url}wiki/${article}`)
  $content.style.display = 'none'
  $loading.style.display = 'flex'
  $body.classList.add('loading')
  $content.textContent = ''
}

function switchToArticleView(domElement) {
  const {
    $body,
    $content,
    $loading,
  } = domElems
  $body.classList.remove('loading')
  $content.appendChild(domElement)
  $content.style.display = 'block'
  $loading.style.display = 'none'
  scroll(0, 0)
}

function getArticle(article) {
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

function showError(msg) {
  const $div = document.createElement('div')
  $div.classList.add('alert')
  $div.classList.add('alert-danger')
  $div.textContent = msg
  return $div
}

export function viewArticle(article) {
  switchToLoadingView(article)

  getArticle(article)
    .then(response => parseArticle(response, article))
    .catch(showError)
    .then(domElement => switchToArticleView(domElement))
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

  function getName(articleUrl) {
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

export function getAutocompleteSuggestions(query) {
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
