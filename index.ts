import { parseArgs } from './utils'
import { loadSchemas, exportSchema, schemaToMdx } from './libs'
import fs from 'fs'

async function main() {
  const [source, target, ...rest] = process.argv.slice(2)
  const options = parseArgs(rest)
  const schemaMap = await loadSchemas(source, options)

  if (!schemaMap) {
    throw new Error('schema not found')
  }

  const mdxMap = await schemaToMdx(schemaMap)

  if (!fs.existsSync(target)) {
    await fs.promises.mkdir(target)
  }

  await Promise.all(
    Object.entries(mdxMap).map(async ([title, mdx]) => {
      const out = `${target}/${title.toLowerCase()}.mdx`
      await exportSchema(out, mdx)
    })
  )
}

main()
