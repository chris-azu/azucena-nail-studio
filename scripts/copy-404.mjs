import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const dist = resolve(process.cwd(), 'dist')
const index = await readFile(resolve(dist, 'index.html'), 'utf8')
await writeFile(resolve(dist, '404.html'), index)
