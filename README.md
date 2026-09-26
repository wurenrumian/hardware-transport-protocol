# I/O 协议图谱

一个 VitePress 站点：从 **PCIe 的请求模型**出发，系统讲解高性能硬件互连与 I/O 协议的特性。

主线的起点是一个观察：

> 在 PCIe 上完成一次读请求的过程中，不会同时存在一条正在进行的写请求。

这个观察牵出三个贯穿全站的问题：**请求是否 Posted、谁保证顺序、数据在哪一级一致**。
19 个协议都用同一把尺子衡量：请求单位 / posted 语义 / 完成机制 / 一致性。

## 站点内容

| 目录 | 内容 |
| --- | --- |
| `site/guide/` | 导读、一次读请求的一生、Posted 与 Non-Posted、顺序与一致性、分层地图、阅读指南 |
| `site/protocols/` | 19 个协议详解（PCIe、CXL、NVMe、RDMA、NVLink、UCIe 等） |
| `site/compare/` | 总览矩阵、请求模型对比、一致性与内存语义、延迟与带宽量级、选型速查 |

## 本地运行

```bash
npm install

npm run dev       # 开发服务器（默认 http://localhost:5173）
npm run build     # 构建静态站点到 site/.vitepress/dist
npm run preview   # 预览构建产物
```

## 校验

Mermaid 图在构建期不做渲染，语法错误只会在浏览器里暴露。用下面的脚本提前校验全部图表：

```bash
npm run validate:mermaid
```

## 技术细节

- **文档根目录**：`site/`
- **Mermaid 渲染**：`site/.vitepress/mermaid.ts` 是一个 markdown-it 插件，把 ` ```mermaid ` 围栏转成
  `<Mermaid code-b64="..." />`；`site/.vitepress/theme/components/MermaidView.vue` 在客户端解码并用
  mermaid 渲染，并跟随深色模式重绘。用 base64 传参是为了避开 Mermaid 语法里的空行、括号与箭头对
  Markdown / Vue 模板解析的干扰。
- **自定义主题**：`site/.vitepress/theme/custom.css`（深青强调色、表格与卡片样式、Mermaid 容器）。
- **本地搜索**：VitePress 内置 local search，已配置中文文案。

## 说明

站内涉及的具体数字除明确标注为规格者外，均为**量级**，用于建立直觉，请以官方最新规范为准。
