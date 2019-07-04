const fs = require('fs-extra')

fs.copy('./src/', './example/src/src/', err => {
  if (err) return console.error(err)
  console.log('success!')
})
