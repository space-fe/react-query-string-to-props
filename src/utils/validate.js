import { ValidateTypes } from '../ValidateTypes'

const validateMethods = {
  [ValidateTypes.range]: (value, validatorVal) => validatorVal.includes(value),
  [ValidateTypes.regexp]: (value, validatorVal) => validatorVal.test(value),
  [ValidateTypes.function]: (value, validatorVal) => validatorVal(value)
}

const validateObject = (obj, defaultObj, validator) => {
  const result = { ...obj }
  const defaultValidator = { ...validator }

  Object.entries(defaultValidator).forEach(([key, validators]) => {
    const keyValue = obj[key]
    const validateResult = Array(validators.length).fill(true)

    validators.forEach(({ type, value: validatorVal }, index) => {
      const validateMethod = validateMethods[type]
      validateResult[index] = validateMethod ? validateMethod(keyValue, validatorVal) : false
    })

    const hasInvalidValidation = validateResult.filter(item => !item).length
    result[key] = hasInvalidValidation ? defaultObj[key] : obj[key]
  })

  return result
}

export { validateObject }
