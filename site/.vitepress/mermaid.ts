import type MarkdownIt from 'markdown-it'

/**
 * 把 ```mermaid 围栏代码块转换成 <Mermaid code-b64="..." /> 组件调用。
 *
 * 之所以用 base64 传参而不是直接内联内容：Mermaid 语法里经常出现空行、
 * 花括号、箭头与引号，直接内联会与 Markdown / Vue 模板解析互相干扰。
 * 围栏代码块本身是被完整保留的，转义一次即可彻底消除歧义。
 */
export function mermaidPlugin(md: MarkdownIt) {
  const defaultFence =
    md.renderer.rules.fence ||
    ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options))

  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    const info = (token.info || '').trim()

    if (info === 'mermaid' || info.startsWith('mermaid ')) {
      const b64 = Buffer.from(token.content, 'utf-8').toString('base64')
      return `<Mermaid code-b64="${b64}" />\n`
    }

    return defaultFence(tokens, idx, options, env, self)
  }
}
