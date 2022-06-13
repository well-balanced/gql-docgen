import path from 'path'
import fs from 'fs/promises'

export async function readdirRecursive(parent: string): Promise<string[]> {
  const childs = await fs.readdir(parent)
  return childs
    .map((child) => path.join(parent, child))
    .reduce(async (prev, curr) => {
      const stat = await fs.stat(curr)
      const resolved = await prev.then()
      return Promise.resolve([
        ...resolved,
        ...(stat.isDirectory() ? await readdirRecursive(curr) : [curr]),
      ])
    }, Promise.resolve([]))
}
