import { copyFile } from 'fs'

const copyToDist = (source: string, destination: string) => {
  copyFile(source, destination, (err) => {
    if (err) throw err
    console.log(`${source} copied to dist`)
  })
}

copyToDist('scripts/script-package.json', 'dist/package.json')
copyToDist('README.md', 'dist/README.md')
copyToDist('LICENSE', 'dist/LICENSE')
