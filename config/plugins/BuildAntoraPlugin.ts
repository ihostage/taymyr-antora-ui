import type { Compiler } from 'webpack'
import { spawnCommand } from '../helpers/spawnCommand'

export class BuildAntoraPlugin {
  apply(compiler: Compiler) {
    let shouldUpdateAntora = true
    compiler.hooks.done.tap('Build antora', async stats => {
      if (shouldUpdateAntora) {
        await spawnCommand('npm run build-antora')
        shouldUpdateAntora = false
        setTimeout(() => {
          compiler.hooks.done.callAsync(stats, () => {
            return
          })
        }, 500)
      } else {
        shouldUpdateAntora = true
      }
    })
  }
}
