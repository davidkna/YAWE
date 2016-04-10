import DOMPurify from 'dompurify'

// My Imports
import { $, options, fromQueryString, toQueryString } from './helper'
import getJSON from 'helper/ajax'

export let domElems = {}

// Helpers
function prepareResponse(response, articleName) {
  const [first, ...responseSections] = response.mobileview.sections

  const sections = responseSections.reduce((prev, current) => {
    const result = prev
    if (current.toclevel === 1) {
      result.push({
        title: current.line,
        content: current.text,
      })
    } else {
      const level = current.toclevel <= 6 ? current.toclevel : 6
      result[result.length - 1].content +=
        `<h${level}>${current.line}</h${level}>
        ${current.text}`
    }

    return result
  }, [])

  return {
    articleName: response.mobileview.normalizedtitle || articleName.replace(/_/g, ' '),
    summary: first.text,
    sections,
  }
}

function purify(html) {
  return DOMPurify.sanitize(html, {
    RETURN_DOM_FRAGMENT: true,
    RETURN_DOM_IMPORT: true,
  })
}

function outputResponse(preparedResponse) {
  const { $content } = domElems
  const { articleName, summary, sections } = preparedResponse

  const h1 = document.createElement('h1')
  h1.innerText = articleName
  $content.appendChild(h1)
  $content.appendChild(purify(summary))

  sections.forEach(section => {
    const { title, content } = section
    const $details = document.createElement('details')
    const $summary = document.createElement('summary')
    const $h2 = document.createElement('h2')

    $h2.innerText = title

    $summary.appendChild($h2)
    $details.appendChild($summary)

    const $body = document.createElement('div')
    $body.classList.add('panel-body')
    $body.appendChild(purify(content))

    $details.appendChild($body)

    $content.appendChild($details)
  })
}

function urlparse(url) {
  const a = document.createElement('a')
  a.href = url
  return a
}

export function initDomElems() {
  domElems = {
    $base: $('base'),
    $body: $('body'),
    $search: $('#search'),
    $content: $('#content'),
    $loading: $('#loading'),
  }
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
  if (fromQueryString(location.hash).article !== article) {
    removeEventListener('hashchange', loadFromHash)
    location.hash = toQueryString({
      article,
    })
    addEventListener('hashchange', loadFromHash)
  }
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
    .then(response => {
      if (response.error) {
        const error = new Error(response.error.info)
        throw error
      }

      return response
    })
}

export function getArticle(article) {
  const {
    $body,
    $content,
    $loading,
  } = domElems

  function show() {
    $content.style.display = 'block'
    $loading.style.display = 'none'
    $body.classList.remove('loading')
  }
  function wrapError(msg) {
    const div = document.createElement('div')
    div.classList.add('alert')
    div.classList.add('alert-danger')
    div.innerText = msg
    return div
  }
  prepareRequest(article)

  loadArticle(article)
    .then(response => {
      scroll(0, 0)
      const preparedResponse = prepareResponse(response, article)
      show()
      outputResponse(preparedResponse)
    })
    .catch(errorMsg => {
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

export function search(query, callback) {
  const ajaxOptions = {
    format: 'json',
    action: 'opensearch',
    search: query,
    suggest: true,
    limit: 10,
  }

  getJSON(`${options.url}w/api.php`, ajaxOptions)
    .then((response) => {
      callback(response[1])
    })
}
