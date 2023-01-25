export interface IHtmlPluginCreatingOptions {
  fileName: string
  filterKey: string
  filterValue: string
  filterByTagNode?: (tagNode: Record<string, unknown>) => boolean
}
