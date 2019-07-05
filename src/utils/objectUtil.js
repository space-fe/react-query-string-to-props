const booleanConverter = (v) => v === 'true'
  ? true
  : (
    v === 'false'
      ? false
      : v
  )

const filterObjWithDefaultObj = (obj, defaultObj, filterKeys = []) => {
  return filterKeys.reduce((prev, key) => {
    return Object.prototype.hasOwnProperty.call(obj, key)
      ? {
        ...prev,
        [key]: booleanConverter(obj[key])
      }
      : {
        ...prev,
        [key]: defaultObj[key]
      }
  }, {})
}

export { filterObjWithDefaultObj }
