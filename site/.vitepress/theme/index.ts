import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import MermaidView from './components/MermaidView.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('Mermaid', MermaidView)
  }
} satisfies Theme
