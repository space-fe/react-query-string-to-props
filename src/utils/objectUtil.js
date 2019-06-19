const booleanConverter = (v) => v === 'true'
  ? true
  : (
    v === 'false'
      ? false
      : v
  )

const filterObjWithDefaultObj = (obj, defaultObj) => {
  return Object.entries(defaultObj).reduce((prev, [key, defaultValue]) => {
    return Object.prototype.hasOwnProperty.call(obj, key)
      ? {
        ...prev,
        [key]: booleanConverter(obj[key])
      }
      : {
        ...prev,
        [key]: defaultValue
      }
  }, {})
}

export { filterObjWithDefaultObj }
