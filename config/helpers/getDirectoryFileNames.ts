import fs from 'node:fs'
import path from 'node:path'

export const getDirectoryFileNames = (dirPath: string): string[] => {
  const files = fs.readdirSync(dirPath, { withFileTypes: true }).map(dirent => {
    const fullPath = path.join(dirPath, dirent.name)

    return dirent.isDirectory() ? getDirectoryFileNames(fullPath) : fullPath
  })

  return files.flat()
}
