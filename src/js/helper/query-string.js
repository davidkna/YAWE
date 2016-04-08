function decode(str) {
  // jscs:disable disallowArrayDestructuringReturn
  const [key, value] = str.split('=').map(decodeURIComponent)

  return { key, value }
}

// Transforms query string to javascript object
export function fromQueryString(str) {
  return str
    .replace(/^[\?#]/, '')
    .split('&')
    .reduce((result, current) => {
      const { key, value } = decode(current)

      result[key] = value // eslint-disable-line no-param-reassign
      return result
    }, {})
}

function encode(k, v) {
  const key = encodeURIComponent(k)
  const value = decodeURIComponent(v)

  return { key, value }
}

// Transforms Javascript Object to query string
export function toQueryString(obj) {
  return Object
    .keys(obj)
    .map(_key => {
      const { key, value } = encode(_key, obj[_key])
      return `${key}=${value}`
    })
    .join('&')
}
