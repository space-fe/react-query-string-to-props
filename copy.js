const fs = require('fs-extra')
const path = require('path')

const targetDir = path.resolve(__dirname, './example/src/src')

fs.copy(path.resolve(__dirname, './src'), targetDir)
  .then(() => console.log('copy success!'))
  .catch(err => console.error(err))
