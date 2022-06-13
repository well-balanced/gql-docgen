import { JsonGraphQLSchemaMap } from '@types'
import { MarkdownRenderer } from './renderer'
import { SchemaManager } from './schemaManager'
import { classifyAllByType, classifyByType } from './classification'

export async function schemaToMdx(schemaMap: JsonGraphQLSchemaMap) {
  const globalTypeMap = classifyAllByType(schemaMap)
  const schemaManager = new SchemaManager(globalTypeMap)

  return Object.entries(schemaMap).reduce((prev, [title, schema]) => {
    const classified = classifyByType(schema)
    const renderer = new MarkdownRenderer(schemaManager)
    const mdx = renderer.renderDocument(classified, title)
    return { ...prev, [title]: mdx }
  }, {} as Record<string, string>)
}
