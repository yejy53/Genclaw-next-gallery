---
title: Towards Rich Visual Code Generation
subtitle: What Makes Generated Websites Fascinating?
summary: 我们花了一段时间研究一个具体问题：当模型写出一个网页、一张海报、一页 slide 时，究竟是什么决定了人们觉得它“好看”。
date: 2026-07-29
kicker: 研究
variant: x3
ctaLabel: Gallery
ctaHref: /zh
github: https://github.com/yejy53/GenClaw
arxiv: https://arxiv.org/abs/2605.30248
tags: visual code, agent, 素材生成
---

这个问题最初来自我们对 Visual Code Generation 评测的观察。近年来，大语言模型在代码生成领域取得了突破性进展，尤其是视觉代码生成（Visual Code Generation）展现出了巨大的潜力。以 GPT-5.6 Sol、Claude Fable 5 和 Kimi K3 为代表的最新一代模型，已经能够通过直接生成 HTML、SVG 和 CSS，自动化构建功能完整的网页、动态用户界面（UI）以及交互式的数据可视化图表。这种基于代码的生成方式，为自动化设计与前端开发带来了极大的想象空间。

目前，Visual Code Generation 的能力评估主要采用 [Design Arena](https://www.designarena.ai/leaderboard) 这类两两盲测的偏好评测：同一个 prompt 生成两个结果，再由用户选出更喜欢的一个。实际选择时，用户通常会倾向于那个看起来更好看、更完整的结果。

但“更好看”究竟是由什么决定的？

我们先不做论述，我们先来看看下方的结果，你会选择左右两边哪一个结果？

```case
mode: gallery
aspect: 21/9
item: | /blog/genclaw-next/pizza.mp4
item: | /blog/genclaw-next/music-player.mp4
```

> 如果让你在每一组里挑一个拿去交付，答案几乎不需要犹豫——左边。同一条 prompt、同一个模型，唯一的变量是能不能拿到丰富的视觉素材，观感差距是断层式的。

## 视觉丰富度，可能比我们想象中更重要

仔细看左右两边的产物，会发现它们在结构、布局、文字和数据上并没有非常大的差异。真正拉开观感的，是右边更多使用简单的几何色块、渐变或 emoji 占位，看起来仍然像一个半成品；而左边因为有更丰富的视觉素材，主视觉、质感和氛围都完整了起来。

模型知道怎么写代码，却很难跨过从“结构正确”到“视觉美观”的那道鸿沟。


我们通常会把“AI 写出来的页面不好看”归因于模型缺乏审美，但一个更直接的解释是：HTML、SVG 和 CSS 很擅长结构控制与排版，却不擅长直接手写复杂的视觉素材。电影感背景、3D 主视觉、自然纹理、复杂插画——如果要求模型只用代码把这些画出来，不仅成本很高，也无法逾越能力的鸿沟。


Arena 类型的两两盲测如今已经是衡量模型设计能力的主要方式之一。对于人类的第一眼判断而言，**视觉丰富度**的权重可能比我们想象中更高。一个质感、主视觉与氛围都比较完整的结果，往往会赢过一个只有排版的结果，哪怕后者的结构更加规整。

> 所以，观感的决定权有很大一部分落在那些代码画不出来的地方。素材获取能力，已经开始影响 Visual Code Generation 的最终排名。

当然，Agent Harness 可以让模型通过搜索或生成模型获得足够多的素材，从而创作出更完整的结果。但如果模型在行为偏好上就不倾向于获取素材，而是习惯使用幻觉式 UI、抽象 SVG 或色块占位，那么即使工具已经挂载，它也很容易在偏好评测中落于下风。

<!-- TODO 待补统计图后一起发：
从下面的统计结果来看，Kimi K3 和 Ops 4.8、GLM 5.2 的图像生成模型调用倾向，明显高于 GPT 5.5、Gemini-3.5-flash 等。

占位：这里要放一张统计图 —— 各模型平均调用生图模型的次数。

当然，如果是针对非 Agentic 的 HTML 生成任务，输出若能稳定引用真实可用的图片资源（例如足够准确的 Unsplash 图片 ID），也可能获得更高的分数。
参考：https://www.designarena.ai/blog/kimi-k3s-design-secret-may-be-in-its-thinking-traces
-->


## Generation fills the asset gap of visual code

我们当然可以通过 Web 搜索等方式获取素材，但今天想更多讨论另一条路径：使用多模态生成工具，直接补上 Visual Code 中缺失的那部分视觉内容。

我们在 [GenClaw-Next](TODO) Harness 中，为 Web-Dev、Poster 生成等任务**挂载了以图像生成模型为核心的素材生成专用工具**，并鼓励 Agent 更主动地调用它。Agent 会自主判断并按需调用图像、3D、视频等生成模型，产出代码难以手绘的局部视觉资产。

> 缺的是素材，那就把素材给它

但我们也很快发现：只是把工具挂上去，并不代表模型真的会用。模型往往仍会沿着过去的习惯继续工作——先把结构写完，再用渐变、阴影和色块填满版面。它很少主动停下来想：“这里其实应该有一张图。” 所以，我们在设计阶段增加了一步：先生成一份 `design.md`。Agent 在规划网页的功能、内容与布局时，也要同时分析哪些区域需要主视觉、背景、插画、纹理或其他视觉素材。等这些需求明确之后，再进入代码生成和素材生成阶段。

这是一个看起来很小的变化，但它实际上改变了 Agent 的创作顺序：先想清楚画面需要什么，再决定用什么方式把它实现出来。加上这一步之后，产物的完成度有了比较明显的提升。最主要的是，Agent开始更愿意调用图像生成模型了。



<!-- TODO 占位：这里要放一组「挂载图像生成工具 vs 不挂载」的对照结果。 -->


```case
mode: gallery
aspect: 21/9
item: | /blog/genclaw-next/animation-studio.mp4
item: | /blog/genclaw-next/robot-3d.mp4
```


## Generation as visual imagination

> 在 Coding Agent 统治所有任务的今天，似乎多模态内容生成工具也可以很好地嵌入到视觉内容生成当中，让 LLM 更快迈向生产力工具的生成。

多模态工具的加入，确实极大地提升了 Coding Agent 生成 Web-Dev 内容时的视觉丰富度。不过，我们也发现了另一个问题：现有的代码模型仍然非常缺乏对整体画面的把控。

它们精通语法、DOM 树和 Flexbox，却没有稳定的二维空间感和视觉直觉。直接让模型编写前端代码，产物很容易变成高度模板化的“大标题、卡片、圆角阴影”三件套。特别是在 Poster 这类更依赖专业设计的任务中，模型知道代码应该怎么写，却不知道画面应该怎么长才好看。

纵观当前的视觉生成领域，现有的研究主要沿着两条正交的路径展开，但各自都存在“偏科”现象。一方面是偏向“左脑”的纯代码生成——现有的 Coding Agent 就像是一个只有左脑的系统，精通逻辑与结构，但由于代码本质上是一维的符号序列，模型极度缺乏二维空间感与美学直觉。另一方面是偏向“右脑”的视觉内容生成（如扩散模型），它压缩了人类数百年的美术先验，能够瞬间生成具备顶级构图、光影与质感的画面；但它存在致命的“结构死穴”——缺乏严谨的逻辑，生成的像素图（Raster Image）在文字准确性、多层排版、数据图表和后期可编辑性上天然不可靠，无法作为真实的工程交付物。

受 World Action Model (WAM) 策略的启发，我们将图像生成模型前置为 Coding Agent 的“视觉世界模拟器”，而将 LLM 作为后续 Visual Code 的动作决策者。具体而言，在编写代码前，Agent 会先调用图像模型生成一张概念图，以此确立构图、光影和色彩氛围等美学先验，实现“**先想象，后行动**”。

```case
mode: gallery
aspect: 3/2
item: | /blog/genclaw-next/shanchuan-tea.jpg
item: | /blog/genclaw-next/akari.jpg
```

> “美学”是一种极难用文字量化、却极易被图像具象化的先验知识。让 Agent 先“看见”一个可能的设计方向，再去写真实内容和可编辑结构，比让它闭着眼睛盲写要可靠得多。

从目前的结果看，视觉想象器确实能在一部分任务上取得优势，尤其是 Poster 这类设计属性更强的任务。这里还有一个很有意思的反差。过去，多模态领域在探索“生成以辅助理解”（Generation for Understanding）时发现，在严谨的数理逻辑任务中，像素生成带来的噪声往往会产生干扰；但在 Visual Code Generation 中，图像生成反而可能对代码的结构理解与布局决策起到反哺作用。换句话说，图像在这里不只是一种最终素材，也可能成为模型思考设计的中间过程。


## Visual Code 作为内容创作的新载体

目前，基于 GPT-Image-2、Seedream 等模型进行创意设计和内容生成，已经成为很多创作者的日常工作流。但我们觉得，Visual Code Generation 也有潜力成为一种新的内容创作载体。

回到我们在 [GenClaw](https://github.com/yejy53/GenClaw) 里一直强调的一点：Visual Code 改变的可能不只是“页面好不好看”，还有内容创作的产物形态本身。今天，多模态创作的终点大多是一张像素图。图片一旦交付，文字、图层和布局基本也就定型了。而由 Visual Code 生成的 HTML、PPTX 等产物本身是可编辑的：文字准确、图层可控，用户拿到的不是一张只能整体重做的图片，而是一份可以继续修改的稿件。

下面这组结果会更直观：

```case
mode: gallery
aspect: 20/17
item: | /blog/genclaw-next/poster-editing.mp4
```

和 GPT-Image-2、Seedream 5 这类直接输出像素的方法相比，GenClaw-Next 产出的视觉内容允许用户自由拖动元素、修改文字和替换图像素材。在海报、信息图这类需要反复微调的任务中，这一点尤其重要。如果某块图像素材需要更换，也可以只调用一次图像模型做局部替换，而不必把整张作品推翻重来。我们也针对 PPT 这类更依赖人工二次编辑的任务做了一些优化。

最后说说怎么用。GenClaw-Next 本身是一套 model-agnostic、framework-agnostic 的 Agent Harness——不绑定特定的 LLM 供应商，也不绑定特定框架。我们也把这套能力整理成了 **Skill 形式**，面向 Codex、Claude Code 这类宿主，方便大家直接上手体验。

