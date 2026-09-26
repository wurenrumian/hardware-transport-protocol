---
layout: home

hero:
  name: I/O 协议图谱
  text: 一次读请求的一生
  tagline: 从 PCIe 的 Posted / Non-Posted 语义出发，把 PCIe、CXL、NVMe、RDMA、GPU 互连与 Chiplet 协议放进同一条主线 —— 请求如何发出、如何完成、以及与在途请求的排序关系。
  actions:
    - theme: brand
      text: 开始阅读导读
      link: /guide/intro
    - theme: alt
      text: 直接看 PCIe
      link: /protocols/pcie
    - theme: alt
      text: 横向对比矩阵
      link: /compare/overview

features:
  - title: 一条主线贯穿
    details: 所有协议都在回答同一组问题：请求是否 posted、完成如何返回、读写能否并行、顺序由谁保证。抓住这条线，协议就不再是零散的名词。
  - title: 20+ 协议详解
    details: PCIe / CXL / CCIX / OpenCAPI、NVMe / NVMe-oF / UFS、IB / RoCE / iWARP / UEC、NVLink / IF / UALink、UCIe / BoW / AIB、VirtIO / CAPI。
  - title: 请求模型对照
    details: 每个协议都给出「请求与完成」清单、posted/一致性语义、以及与主线的关系：读在进行时，写会发生什么。
  - title: 表格 + 时序图
    details: 分层图、事务时序、带宽延迟量级、一致性能力矩阵，全部用可编辑的 Mermaid 与 Markdown 表格表达。
  - title: 面向选型
    details: 从「要解决什么问题」倒推协议，而不是背规格。附选型速查与常见误区。
  - title: 可离线构建
    details: VitePress 静态站点，本地搜索、深色模式、MathJax 公式与 Mermaid 图，一条 npm run build 出静态产物。
---

## 这个站点在讲什么

这份图谱的起点是一个具体的观察：

> 在 PCIe 上完成一次**读请求**的过程中，不会同时存在一条正在进行的**写请求** —— 读要么在等待数据返回，要么已经拿到完成包，而写在这条读事务悬而未决期间并不会与它"并行进行"。

这句话听起来像硬件细节，但它其实是理解整条 I/O 协议谱系的钥匙。它牵出三件事：

1. **PCIe 的读是 Non-Posted 的**：读请求发出后事务并未结束，必须等带数据的 Completion 回来才算完成。写则是 Posted 的，一旦发出去就"完成"，不再需要应答。
2. **请求与响应被拆开了（split transaction）**：总线不再像早期 PCI 那样阻塞式地等数据，而是把一次读拆成"请求 → 若干完成包"两段，中间的时间窗口里，别的请求在排序规则允许时可以穿行。
3. **顺序不是免费的**：一旦允许穿行，就必须回答"谁能超过谁"。PCIe 给出了严格的 Posted / Non-Posted 排序表，而 CXL、NVMe、RDMA、GPU 互连各自在这张表上做加减法。

所以本站不按"名词表"组织，而按**请求生命周期**组织：

```mermaid
flowchart LR
  A["请求者<br/>Requester"] -->|"① 发出请求"| B{"是否 posted?"}
  B -->|"Posted：写"| C["发出即结束<br/>不等完成"]
  B -->|"Non-Posted：读 / 配置"| D["事务挂起<br/>Idle / Outstanding"]
  D -->|"② 目标返回 Completion"| E["完成包带数据"]
  E --> F["③ 事务结束<br/>释放并继续"]
  C --> F
  F -.->|"排序规则决定<br/>谁能超过谁"| A
```

读一读[《为什么读这些协议》](/guide/intro)和[《主线：一次读请求的一生》](/guide/request-lifecycle)，再挑你最关心的那一类协议深入。

## 六大领域

<div class="p-grid">
  <a class="p-card" href="/protocols/pcie">
    <div class="p-title">PCIe 原生与总线扩展</div>
    <div class="p-desc">一切的地基：分层协议栈、TLP 事务、Posted/Non-Posted、SR-IOV、ATS/PASID。</div>
    <div class="p-tag">PCIe · CXL · CCIX · OpenCAPI</div>
  </a>
  <a class="p-card" href="/protocols/nvme">
    <div class="p-title">存储与块设备</div>
    <div class="p-desc">把 PCIe 事务封装成命令与完成队列，用多队列把并行度拉满。</div>
    <div class="p-tag">NVMe · NVMe-oF · UFS</div>
  </a>
  <a class="p-card" href="/protocols/infiniband">
    <div class="p-title">网络与内核绕过</div>
    <div class="p-desc">RDMA 把"读"做成了远端内存的直接搬运，用完成队列替代中断。</div>
    <div class="p-tag">IB · RoCE · iWARP · UEC</div>
  </a>
  <a class="p-card" href="/protocols/nvlink">
    <div class="p-title">GPU 与加速器互连</div>
    <div class="p-desc">从 DMA 语义走向内存语义：GPU 之间像访问本地显存一样访问对方。</div>
    <div class="p-tag">NVLink · Infinity Fabric · UALink</div>
  </a>
  <a class="p-card" href="/protocols/ucie">
    <div class="p-title">封装级 / Chiplet</div>
    <div class="p-desc">Die 与 Die 之间只有几毫米，协议被剥到只剩物理层与适配层。</div>
    <div class="p-tag">UCIe · BoW · AIB</div>
  </a>
  <a class="p-card" href="/protocols/virtio">
    <div class="p-title">虚拟化与系统抽象</div>
    <div class="p-desc">半虚拟化在软件层重建了同一套请求/完成模型，把队列交给共享内存。</div>
    <div class="p-tag">VirtIO · CAPI / PSL</div>
  </a>
</div>

## 怎么用

- **想知道"读为什么慢"**：从 [Posted 与 Non-Posted](/guide/posted-non-posted) 和 [顺序、一致性与屏障](/guide/ordering) 入手。
- **想横向比协议**：去 [总览矩阵](/compare/overview) 与 [请求模型对比](/compare/request-models)。
- **要选型**：看 [选型速查](/compare/choosing)。
- **想确认某个协议细节**：直接在左侧"协议详解"里找，或按 <kbd>/</kbd> 搜索。
