import { toQueryString } from './query-string'

// Check HTTP status code
function checkStatus(response: Response) {
  const { status } = response
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
export default function getJSON(url: String, queryParams = {}) {
  const params = {
    origin: '*',
    ...queryParams,
  }
  return fetch(`${url}?${toQueryString(params)}`)
    .then(checkStatus)
    .then(parseJSON)
}
