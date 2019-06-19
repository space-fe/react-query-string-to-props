export const validateTypes = {
  range: 'range',
  regexp: 'regexp',
  function: 'function'
}

const validateObject = (obj, defaultObj, validator) => {
  const result = { ...obj }
  const defaultValidator = { ...validator }

  Object.entries(defaultValidator).forEach(([key, validates]) => {
    const keyValue = obj[key]
    let isValid = true

    validates.forEach(({ type, value }) => {
      switch (type) {
        case validateTypes.range:
          isValid = value.includes(keyValue)
          break
        case validateTypes.regexp:
          isValid = value.test(keyValue)
          break
        case validateTypes.function:
          isValid = value(keyValue)
          break
        default:
      }
    })

    result[key] = isValid ? obj[key] : defaultObj[key]
  })

  return result
}

export {
  validateObject
}
