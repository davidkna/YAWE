// Transforms query string to javascript object
export function fromQueryString(str) {
  return str
    .replace(/^[\?#]/, '')
    .split('&')
    .reduce((result, current) => {
      // jscs:disable disallowArrayDestructuringReturn
      const [key, value] = current.split('=')

      const _result = result
      _result[key] = decodeURIComponent(value)
      return _result
    }, {})
}

// Transforms Javascript Object to query string
export function toQueryString(obj) {
  return Object
    .keys(obj)
    .map(key => `${key}=${encodeURIComponent(obj[key])}`)
    .join('&')
}
