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
  return arr.map(item => decodeNumber(item))
}

export const Decoders = {
  [QueryPropTypes.boolean]: decodeBoolean,
  [QueryPropTypes.number]: decodeNumber,
  [QueryPropTypes.string]: decodeString,
  [QueryPropTypes.numericArray]: decodeNumericArray
}

export const decode = (type, encodedValue, defaultValue) => {
  return Decoders[type] ? Decoders[type](encodedValue) : encodedValue
}

export const decodeObj = (obj, objTypes) => {
  return Object.entries(obj).reduce((prev, [key, value]) => {
    return {
      ...prev,
      [key]: decode(objTypes[key], value)
    }
  }, {})
}
