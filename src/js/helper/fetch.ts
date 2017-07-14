import { toQueryString } from './query-string'

// Check HTTP status code
function checkStatus(response) {
  const status = response.status
  if (status >= 200 && status < 300) {
    return response
  }

  const error = new Error(`HTTP Error ${status}: ${response.statusText}`)
  throw error
}

// Parse fetched JSON
function parseJSON(response) {
  return response.json()
}

// Returns promise with fetched data from url parsed as JSON
export default function getJSON(url, queryParams = {}) {
  queryParams['origin'] = '*' // eslint-disable-line no-param-reassign
  return fetch(`${url}?${toQueryString(queryParams)}`)
    .then(checkStatus)
    .then(parseJSON)
}
