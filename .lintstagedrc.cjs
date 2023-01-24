const fs = require('node:fs')

const generateTSConfig = stagedFilenames => {
  return type => {
    const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'))
    if (stagedFilenames.length === 0) return ''

    tsconfig.include = [...stagedFilenames, 'src/**/*.d.ts']
    fs.writeFileSync(`tsconfig.${type}.lint.json`, JSON.stringify(tsconfig))

    return `${type} --skipLibCheck --noEmit --pretty --project tsconfig.${type}.lint.json`
  }
}

const lintTypes = (fileName) => generateTSConfig(fileName)('tsc')

module.exports = {
  'src/**/*.(ts)': [lintTypes],
  'src/**/*.(ts|js)': ['eslint --fix'],
  'config/**/*.(ts)': [lintTypes],
  'config/**/*.(ts|js)': ['eslint --fix'],
  '**/*.(yml|yaml)': ['npx yaml-lint'],
}
