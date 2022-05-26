import { parseArgs } from './utils'
import { loadSchema, schemaToMdx } from './libs'
import fs from 'fs/promises'

async function main() {
  const [source, target, ...rest] = process.argv.slice(2)
  const options = parseArgs(rest)
  const schema = await loadSchema(source, options)

  if (!schema) {
    throw new Error('schema not found')
  }

  const mdx = schemaToMdx(schema)
}

main()
