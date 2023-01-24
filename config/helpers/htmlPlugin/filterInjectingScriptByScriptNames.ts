import { IHtmlPluginCreatingOptions } from './types'

export const filterInjectingScriptByScriptNames = (scriptNames: string[]) => {
  const filterByTagNode: IHtmlPluginCreatingOptions['filterByTagNode'] = tagNode => {
    if ('attributes' in tagNode) {
      const { attributes } = tagNode

      if (typeof attributes === 'object' && attributes !== null && 'src' in attributes) {
        const src = attributes.src

        return typeof src === 'string' && scriptNames.some(scriptName => src.endsWith(scriptName))
      }
    }

    return false
  }

  return filterByTagNode
}
