const filterObjWithDefaultObj = (obj, defaultObj, filterKeys = []) => {
  return filterKeys.reduce((prev, key) => {
    return Object.prototype.hasOwnProperty.call(obj, key)
      ? {
        ...prev,
        [key]: obj[key]
      }
      : {
        ...prev,
        [key]: defaultObj[key]
      }
  }, {})
}

export { filterObjWithDefaultObj }
