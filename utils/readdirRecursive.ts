import path from 'path'
import fs from 'fs/promises'
import { reduceSeries } from './reduceSeries'

export async function readdirRecursive(parent: string): Promise<string[]> {
  const childs = await fs.readdir(parent)
  const paths = childs.map((child) => path.join(parent, child))
  return reduceSeries(
    paths,
    async (prev, curr) => {
      const stat = await fs.stat(curr)
      return [
        ...prev,
        ...(stat.isDirectory() ? await readdirRecursive(curr) : [curr]),
      ]
    },
    []
  )
}
