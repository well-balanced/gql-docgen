import fs from 'fs/promises'

export async function exportSchema(out: string, content: string) {
  await fs.writeFile(out, content)
}
