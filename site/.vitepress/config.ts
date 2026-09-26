import { defineConfig } from 'vitepress'
import { mermaidPlugin } from './mermaid'

export default defineConfig({
  lang: 'zh-CN',
  title: 'I/O 协议图谱',
  description:
    '从 PCIe 请求模型出发，系统梳理高性能硬件互连与 I/O 协议的特性、语义与取舍',

  head: [
    ['link', { rel: 'icon', href: '/logo.svg', type: 'image/svg+xml' }],
    ['meta', { name: 'theme-color', content: '#0b7285' }],
    ['meta', { name: 'author', content: 'I/O Protocols Atlas' }],
    [
      'meta',
      {
        name: 'description',
        content:
          '从 PCIe 请求模型出发，系统讲解 PCIe / CXL / NVMe / RDMA / GPU 互连 / Chiplet 等 I/O 协议的特性'
      }
    ]
  ],

  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    },
    lineNumbers: true,
    math: true,
    config(md) {
      md.use(mermaidPlugin)
    }
  },

  themeConfig: {
    logo: '/logo.svg',

    nav: [
      { text: '首页', link: '/' },
      { text: '导读', link: '/guide/intro', activeMatch: '/guide/' },
      {
        text: '协议详解',
        link: '/protocols/pcie',
        activeMatch: '/protocols/'
      },
      { text: '横向对比', link: '/compare/overview', activeMatch: '/compare/' }
    ],

    sidebar: {
      '/guide/': [
        {
          text: '导读',
          items: [
            { text: '为什么读这些协议', link: '/guide/intro' },
            { text: '主线：一次读请求的一生', link: '/guide/request-lifecycle' },
            { text: 'Posted 与 Non-Posted', link: '/guide/posted-non-posted' },
            { text: '顺序、一致性与屏障', link: '/guide/ordering' },
            { text: '六大领域与分层地图', link: '/guide/taxonomy' },
            { text: '如何阅读本图谱', link: '/guide/how-to-read' }
          ]
        }
      ],
      '/protocols/': [
        {
          text: '一、PCIe 原生与总线扩展',
          collapsed: false,
          items: [
            { text: 'PCIe', link: '/protocols/pcie' },
            { text: 'CXL', link: '/protocols/cxl' },
            { text: 'CCIX', link: '/protocols/ccix' },
            { text: 'OpenCAPI', link: '/protocols/opencapi' }
          ]
        },
        {
          text: '二、存储与块设备',
          collapsed: false,
          items: [
            { text: 'NVMe', link: '/protocols/nvme' },
            { text: 'NVMe-oF', link: '/protocols/nvme-of' },
            { text: 'UFS', link: '/protocols/ufs' }
          ]
        },
        {
          text: '三、网络与内核绕过',
          collapsed: false,
          items: [
            { text: 'InfiniBand', link: '/protocols/infiniband' },
            { text: 'RoCE', link: '/protocols/roce' },
            { text: 'iWARP', link: '/protocols/iwarp' },
            { text: 'UEC', link: '/protocols/uec' }
          ]
        },
        {
          text: '四、GPU 与加速器互连',
          collapsed: false,
          items: [
            { text: 'NVLink / NVSwitch', link: '/protocols/nvlink' },
            { text: 'Infinity Fabric', link: '/protocols/infinity-fabric' },
            { text: 'UALink', link: '/protocols/ualink' }
          ]
        },
        {
          text: '五、封装级 / Chiplet',
          collapsed: false,
          items: [
            { text: 'UCIe', link: '/protocols/ucie' },
            { text: 'BoW', link: '/protocols/bow' },
            { text: 'AIB', link: '/protocols/aib' }
          ]
        },
        {
          text: '六、虚拟化与系统 I/O 抽象',
          collapsed: false,
          items: [
            { text: 'VirtIO', link: '/protocols/virtio' },
            { text: 'CAPI / PSL', link: '/protocols/capi-psl' }
          ]
        }
      ],
      '/compare/': [
        {
          text: '横向对比',
          items: [
            { text: '总览矩阵', link: '/compare/overview' },
            { text: '请求模型对比', link: '/compare/request-models' },
            { text: '一致性与内存语义', link: '/compare/coherency' },
            { text: '延迟与带宽量级', link: '/compare/latency-bandwidth' },
            { text: '选型速查', link: '/compare/choosing' }
          ]
        }
      ]
    },

    outline: { level: [2, 3], label: '本页目录' },
    docFooter: { prev: '上一篇', next: '下一篇' },
    lastUpdated: { text: '最后更新' },

    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档'
          },
          modal: {
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭'
            }
          }
        }
      }
    },

    socialLinks: [],

    footer: {
      message: '以请求生命周期为主线，串联 PCIe / CXL / NVMe / RDMA / GPU 互连 / Chiplet',
      copyright: '仅供学习与研究使用'
    },

    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '目录',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式'
  }
})
