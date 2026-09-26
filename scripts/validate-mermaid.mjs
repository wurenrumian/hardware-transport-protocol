// Mermaid 语法校验：抽取所有 .md 里的 ```mermaid 代码块并用 mermaid.parse 校验。
// 用法：node scripts/validate-mermaid.mjs
import { readFileSync } from 'node:fs'
import { readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { JSDOM } from 'jsdom'

const root = join(process.cwd(), 'site')

function walk(dir) {
  const out = []
  for (const name of readdirSync(dir)) {
    if (name === 'dist' || name === '.vitepress' || name === 'public') continue
    const p = join(dir, name)
    if (statSync(p).isDirectory()) out.push(...walk(p))
    else if (name.endsWith('.md')) out.push(p)
  }
  return out
}

const files = walk(root)

// 建立一个最小的浏览器环境，mermaid 的 parser 需要
const dom = new JSDOM('<!doctype html><html><body></body></html>', { pretendToBeVisual: true })
globalThis.window = dom.window
globalThis.document = dom.window.document
Object.defineProperty(globalThis, 'navigator', {
  value: dom.window.navigator,
  configurable: true,
  writable: true
})
globalThis.DOMPurify = undefined

const mermaid = (await import('mermaid')).default
mermaid.initialize({ startOnLoad: false, securityLevel: 'loose' })

let total = 0
let failed = 0
const errors = []

for (const file of files) {
  const src = readFileSync(file, 'utf8')
  const re = /^```mermaid\s*\n([\s\S]*?)^```/gm
  let m
  let i = 0
  while ((m = re.exec(src))) {
    i++
    total++
    const code = m[1]
    try {
      await mermaid.parse(code)
    } catch (err) {
      failed++
      const line = src.slice(0, m.index).split('\n').length
      errors.push({ file: relative(process.cwd(), file), block: i, line, msg: String(err.message || err).split('\n')[0] })
    }
  }
}

console.log(`检查 ${files.length} 个文件，共 ${total} 个 mermaid 块`)
if (failed === 0) {
  console.log('✅ 全部通过')
} else {
  console.log(`❌ ${failed} 个失败：`)
  for (const e of errors) console.log(`  ${e.file} (块 #${e.block}, 约 ${e.line} 行): ${e.msg.slice(0, 300)}`)
  process.exitCode = 1
}
