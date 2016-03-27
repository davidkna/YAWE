// Transforms query string to javascript object
export function fromQueryString(str) {
  const result = {}
  str
    .replace(/^[\?#]/, '')
    .split('&')
    .forEach(n => {
      // jscs:disable disallowArrayDestructuringReturn
      const [key, value] = n.split('=')
      result[key] = decodeURIComponent(value)
    })
  return result
}

// Transforms Javascript Object to query string
export function toQueryString(obj) {
  return Object
    .keys(obj)
    .map(key => `${key}=${encodeURIComponent(obj[key])}`)
    .join('&')
}
