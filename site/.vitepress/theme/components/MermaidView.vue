<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps<{ codeB64?: string }>()
const host = ref<HTMLElement | null>(null)

let uid = 0
let observer: MutationObserver | null = null
let rendering = false
let rerenderQueued = false

function decode(b64?: string): string {
  if (!b64) return ''
  try {
    const bin = atob(b64)
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0))
    return new TextDecoder().decode(bytes)
  } catch {
    return ''
  }
}

async function render() {
  if (rendering) {
    rerenderQueued = true
    return
  }
  if (!host.value) return
  rendering = true
  try {
    const mermaid = (await import('mermaid')).default
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'loose',
      theme: document.documentElement.classList.contains('dark') ? 'dark' : 'default',
      fontFamily: 'inherit',
      flowchart: { curve: 'basis', useMaxWidth: true },
      sequence: { useMaxWidth: true },
      gantt: { useMaxWidth: true }
    })

    const code = decode(props.codeB64)
    const { svg } = await mermaid.render(`mmd-${Date.now()}-${uid++}`, code)
    if (host.value) host.value.innerHTML = svg
  } catch (err) {
    if (host.value) {
      host.value.innerHTML = `<pre class="mermaid-error">Mermaid 渲染失败：${String(err)}</pre>`
    }
  } finally {
    rendering = false
    if (rerenderQueued) {
      rerenderQueued = false
      void render()
    }
  }
}

onMounted(() => {
  void render()
  observer = new MutationObserver(() => void render())
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  })
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div class="mermaid-host" ref="host" role="img" aria-label="Mermaid 图表" />
</template>
