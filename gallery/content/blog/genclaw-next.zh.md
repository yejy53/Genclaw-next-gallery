---
title: Towards Rich Visual Code Generation —— Secrets to generate fascinating webs
summary: 我们花了一段时间研究一个具体问题：当模型写出一个网页、一张海报、一页 slide 时，究竟是什么决定了人们觉得它"好看"。
date: 2026-07-29
kicker: 研究
variant: x3
ctaLabel: Gallery
ctaHref: /zh
github: https://github.com/yejy53/GenClaw
arxiv: https://arxiv.org/abs/2605.30248
tags: visual code, agent, 素材生成
---

近年来，大语言模型在代码生成领域取得了突破性进展，尤其是视觉代码生成（Visual Code Generation）展现出了巨大的潜力。以 GPT-5.6 Sol、Claude Fable 5 和 Kimi K3 为代表的最新一代模型，已经能够通过直接生成 HTML、SVG 和 CSS，自动化构建功能完整的网页、动态用户界面（UI）以及交互式的数据可视化图表。这种基于代码的生成方式，为自动化设计与前端开发带来了极大的想象空间。目前针对 Visual Code Generation 的能力评估，主要采用的是 [Design Arena](https://www.designarena.ai/leaderboard) 等策略，进行两两盲测偏好评测。当用户进行选择打分的时候，一般会选择更加好看、规整的结果，那么我们的问题是：如何判断一个前端视觉产物是更加美观的？

> 我们先不做论述，我们先来看看下方的结果，你会选择左右两边哪一个结果？

```case
mode: gallery
aspect: 21/9
item: | /blog/genclaw-next/pizza.mp4
item: | /blog/genclaw-next/music-player.mp4
```

> 如果让你在每一组里挑一个拿去交付，答案几乎不需要犹豫——左边。同一条 prompt、同一个模型，唯一的变量是能不能拿到丰富的视觉素材，观感差距是断层式的。

## 视觉丰富度决定感官

我们会发现左右两边的产物结构，布局，文字和数据的差异并不是非常大，但右边更多是使用简单的几何色块、渐变或 emoji 进行占位，看起来像是一个半成品，而左边具有丰富的视觉素材使得整体观感更上一层楼。模型知道怎么写代码，却跨不过从"结构正确"到"视觉美观"的那道鸿沟。我们通常把"AI 写出来的页面不好看"归因于审美设计，但更直接的解释是：HTML、SVG 和 CSS 极度擅长结构控制与排版，却并不擅长直接手写复杂的视觉素材。电影感背景、3D 主视觉、自然纹理、复杂插画——要求模型用纯代码把这些画出来，成本极高而且效果僵硬。Arena 类型的两两盲测偏好评测，如今已经是衡量模型设计能力最主要的方式之一。但是对于人类的评估而言，**视觉丰富度**的权重高得惊人，一个质感、主视觉与氛围齐备的产物，几乎总能赢过一个只有排版的产物，哪怕后者的结构更规整。

> 所以观感的决定权，很大一部分落在那些代码画不出来的地方，素材获取能力已经在决定排名。

当然，Agent Harness 的设计，能够让我们通过搜索或者生成模型的方式，得到足够多的素材，有助于创作出更加美观的结果。但是如果模型在偏好上就并不倾向于获取素材，而是通过幻觉的 UI 或 SVG 等占位，则很容易在得分偏好上不具优势。

<!-- TODO 待补统计图后一起发：
从下面的统计结果来看，Kimi K3 和 Ops 4.8、GLM 5.2 的图像生成模型调用倾向，明显高于 GPT 5.5、Gemini-3.5-flash 等。

占位：这里要放一张统计图 —— 各模型平均调用生图模型的次数。

当然，如果是针对非 Agentic 的 HTML 生成任务，输出若能稳定引用真实可用的图片资源（例如足够准确的 Unsplash 图片 ID），也可能获得更高的分数。
参考：https://www.designarena.ai/blog/kimi-k3s-design-secret-may-be-in-its-thinking-traces
-->


## Generation fills the asset gap of visual code

我们当然可以通过例如 web 搜索等形式完成素材的获取，但是我们今天更多探讨的是基于多模态生成工具的探索。我们在 [GenClaw-Next](TODO) Harness 中，为 Web-Dev、Poster 生成等任务**挂载了以图像生成模型为核心的素材生成专用工具**，并鼓励 Agent 更主动地调用它。Agent 会自主判断并按需调用图像、3D、视频等生成模型，产出代码难以手绘的局部视觉资产。

> 缺的是素材，那就把素材给它

但是我们也发现，这件事需要被明确地提示。如果只是把工具挂上去，模型往往仍会沿着老习惯走——继续用渐变和色块把版面填完，很少主动去想"这里其实应该有一张图素材"。所以，我们在**设计阶段先生成一份 `design.md`**：在规划网页的功能、内容与布局时，就把哪些区域需要视觉素材明确地分析出来。加上这一步之后，产物的完成度会有一次明显的跃升。


<!-- TODO 占位：这里要放一组「挂载图像生成工具 vs 不挂载」的对照结果。 -->


```case
mode: gallery
aspect: 21/9
item: | /blog/genclaw-next/animation-studio.mp4
item: | /blog/genclaw-next/robot-3d.mp4
```


## Generation as visual imagination

> 在 Coding Agent 统治所有任务的今天，似乎多模态内容生成工具也可以很好地嵌入到视觉内容生成当中，让 LLM 更快迈向生产力工具的生成。

我们可以发现，多模态生成工具的加入，极大的提升了Coding Agent生成Web-Dev的视觉内容丰富度。不过，我们也发现了另外一个问题，就是现有的代码大模型极度缺乏全局视觉把控力：它们精通语法、DOM 树和 Flexbox 布局，但却没有二维的空间感和视觉直觉。直接让模型编写前端代码，往往只能产出高度模板化、干瘪的"大标题、卡片、圆角阴影"三件套。特别是针对于Poster等更需要专业审美设计的任务时，模型知道怎么写代码，却不知道怎么写才"好看"。

纵观当前的视觉生成领域，现有的研究主要沿着两条正交的路径展开，但各自都存在"偏科"现象。一方面是偏向"左脑"的纯代码生成——现有的 Coding Agent 就像是一个只有左脑的系统，精通逻辑与结构，但由于代码本质上是一维的符号序列，模型极度缺乏二维空间感与美学直觉。另一方面是偏向"右脑"的视觉内容生成（如扩散模型），它压缩了人类数百年的美术先验，能够瞬间生成具备顶级构图、光影与质感的画面；但它存在致命的"结构死穴"——缺乏严谨的逻辑，生成的像素图（Raster Image）在文字准确性、多层排版、数据图表和后期可编辑性上天然不可靠，无法作为真实的工程交付物。

受 World Action Model (WAM) 策略的启发，我们将图像生成模型前置为 Coding Agent 的"视觉世界模拟器"，而将 LLM 作为后续 Visual Code 的动作决策者。具体而言，在编写代码前，Agent 会先调用图像模型生成一张概念图，以此确立构图、光影和色彩氛围等美学先验，实现"**先想象，后行动**"。

```case
mode: gallery
aspect: 3/2
item: | /blog/genclaw-next/shanchuan-tea.jpg
item: | /blog/genclaw-next/akari.jpg
```

> "美学"是一种极难用文字量化、却极易被图像具象化的先验知识。让 Agent 先"看见"一个可能的设计方向，再去写真实内容和可编辑结构，比让它闭着眼睛盲写要可靠得多。

从结果来看，视觉想象器还是能够在一定的任务上——例如更偏设计的 poster 等任务——取得一定的优势。值得一提的是，过去多模态领域在密切探索"生成以辅助理解"（Generation for Understanding）时发现，在严谨的数理逻辑任务上，像素生成的噪声往往会产生干扰；但在视觉代码生成领域，图像生成反而有可能对代码的结构理解与布局决策起到反哺作用。


## Visual Code 作为内容创作的新载体

目前，例如基于GPT-Image-2，Seedream等进行创意设计，内容生成已经成为了创作者的日常工具，不过Visual Code Generation有潜力作为内容创作的新载体。回到我们在 [GenClaw](https://github.com/yejy53/GenClaw) 里一直强调的一点：Visual Code 改变的可能不只是"页面好不好看"，还有内容创作的产物形态本身。今天多模态创作的终点大多是一张像素图，交付出去就已经定型；而由 Visual Code 生成的 HTML、PPTX 这类产物本身是可编辑的，文字准确、图层可控，用户拿到的不是一张只能整体重做的图，而是一份可以接着改的稿件。下面这组结果会更直观。

```case
mode: gallery
aspect: 20/17
item: | /blog/genclaw-next/poster-editing.mp4
```

和 GPT-Image-2、Seedream 5 这类直接输出像素的方法相比，GenClaw-Next 产出的视觉产物允许用户自由拖动、改写其中的文字与图像素材，在海报、信息图这类需要反复微调的任务上，这一点尤其重要。如果某块图像素材本身需要换掉，也可以再调一次图像模型做局部替换，而不必把整张作品推翻重来。同时，我们也针对 PPT 这类更依赖人工二次编辑的任务做了优化。


最后关于怎么用。GenClaw-Next 本身是一套 model-agnostic、framework-agnostic 的 agent harness——不绑定特定的 LLM 供应商，也不绑定特定框架。同时我们也把这套能力整理成了 **Skill 形式**，面向 Codex、Claude Code 这类宿主，方便用户直接上手体验。

