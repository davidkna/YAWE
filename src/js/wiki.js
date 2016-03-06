// My Imports
import { $, options, getJSON, fromQueryString, toQueryString } from './helper'

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

function outputResponse(preparedResponse) {
  const { $content } = domElems
  const { articleName, summary, sections } = preparedResponse

  const head =
    `<h1>${articleName}</h1>
    ${summary}`

  const body = sections.reduce((previous, current) =>
    `${previous}
      <details>
        <summary><h2>${current.title}</h2></summary>
        <div class="panel-body">${current.content}</div>
      </details>`, '')

  $content.innerHTML =
    `${head}
     ${body}`
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

  return getJSON(`${options.url}w/api.php?${toQueryString(wikiOptions)}`)
    .then(response => {
      if (response.error) {
        const error = new Error(response.error.info)
        throw error
      }

      return response
    })
}

export function getArticle(article) {
  function wrapError(msg) {
    return `<div class='alert alert-danger'>${msg}</div>`
  }

  const {
    $body,
    $content,
    $loading,
  } = domElems

  function cleanup() {
    $content.style.display = 'block'
    $loading.style.display = 'none'
    $body.classList.remove('loading')
  }

  prepareRequest(article)

  loadArticle(article)
    .then(response => {
      scroll(0, 0)
      const preparedResponse = prepareResponse(response, article)
      outputResponse(preparedResponse)
    }).catch(errorMsg => {
      $content.innerHTML = wrapError(errorMsg)
    })
    .then(cleanup)
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
