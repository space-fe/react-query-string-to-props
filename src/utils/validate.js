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
    const validResult = Array(validates.length).fill(true)

    validates.forEach(({ type, value }, index) => {
      switch (type) {
        case validateTypes.range:
          validResult[index] = value.includes(keyValue)
          break
        case validateTypes.regexp:
          validResult[index] = value.test(keyValue)
          break
        case validateTypes.function:
          validResult[index] = value(keyValue)
          break
        default:
      }
    })

    const hasInvalid = validResult.filter(item => !item).length
    result[key] = hasInvalid ? defaultObj[key] : obj[key]
  })

  return result
}

export {
  validateObject
}
