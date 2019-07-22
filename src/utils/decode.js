import QueryPropTypes from '../QueryPropTypes'

export const decodeBoolean = boolStr => {
  return boolStr === 'true'
    ? true
    : (
      boolStr === 'false'
        ? false
        : boolStr
    )
}

export const decodeNumber = (numStr) => {
  if (numStr === null) {
    return undefined
  }

  const result = parseFloat(numStr)

  if (isNaN(result)) {
    return undefined
  }

  return result
}

export const decodeString = str => {
  if (str == null) {
    return undefined
  }

  return String(str)
}

export const decodeNumericArray = (arr = []) => {
  if (!arr) {
    return []
  } else if (!Array.isArray(arr)) {
    return [decodeNumber(arr)]
  }
  return arr.map(item => decodeNumber(item))
}

export const decodeArray = (arr = []) => {
  if (!arr) {
    return []
  } else if (!Array.isArray(arr)) {
    return [arr]
  }

  return arr
}

export const Decoders = {
  [QueryPropTypes.boolean]: decodeBoolean,
  [QueryPropTypes.number]: decodeNumber,
  [QueryPropTypes.string]: decodeString,
  [QueryPropTypes.numericArray]: decodeNumericArray,
  [QueryPropTypes.array]: decodeArray
}

export const decode = (type, encodedValue, defaultValue) => {
  if (typeof type === 'function') {
    return type(encodedValue)
  } else if (Decoders[type]) {
    return Decoders[type](encodedValue)
  }

  return encodedValue
}

export const decodeObj = (obj, objTypes) => {
  return Object.entries(obj).reduce((prev, [key, value]) => {
    return {
      ...prev,
      [key]: decode(objTypes[key], value)
    }
  }, {})
}
