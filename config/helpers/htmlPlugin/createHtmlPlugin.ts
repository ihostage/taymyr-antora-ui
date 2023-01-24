import HtmlWebpackPlugin from 'html-webpack-plugin'
import get from 'lodash/get'

interface IHtmlPluginCreatingOptions {
  fileName: string
  filterKey: string
  filterValue: string
  filterByTagNode?: (tagNode: Record<string, unknown>) => boolean
}

export const createHtmlPlugin = (config: IHtmlPluginCreatingOptions) => {
  const { fileName, filterKey, filterValue, filterByTagNode = () => true } = config

  const getTemplateContent: HtmlWebpackPlugin.Options['templateContent'] = htmlWebpackPlugin => {
    return (
      htmlWebpackPlugin.tags.headTags
        .filter(
          (tagNode: Record<string, unknown>) =>
            get(tagNode, filterKey) === filterValue && filterByTagNode(tagNode),
        )
        .join('')
        // It must be Handlebars template with root path as variable
        .replaceAll('uiRootPath', '{{{uiRootPath}}}')
    )
  }

  return new HtmlWebpackPlugin({
    publicPath: 'uiRootPath',
    templateContent: ({ htmlWebpackPlugin }) => `${getTemplateContent(htmlWebpackPlugin)}`,
    filename: fileName,
    inject: false,
  })
}
