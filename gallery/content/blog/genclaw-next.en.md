---
title: Towards Rich Visual Code Generation
summary: We spent some time on a concrete question: when a model writes a webpage, a poster, or a slide, what actually decides whether people find it "good-looking"?
date: 2026-07-29
kicker: Research
variant: x3
ctaLabel: Gallery
ctaHref: /en
github: https://github.com/yejy53/GenClaw
arxiv: https://arxiv.org/abs/2605.30248
tags: visual code, agent, asset generation
---

In recent years, large language models have made breakthrough progress in code generation, and visual code generation in particular has shown enormous potential. Models of the latest generation—represented by GPT-5.6 Sol, Claude Fable 5, and Kimi K3—can already generate HTML, SVG, and CSS directly to automate the construction of fully functional webpages, dynamic user interfaces (UI), and interactive data visualizations. This code-based generation path opens up a large imaginative space for automated design and front-end development. Today, though, capability evaluation for Visual Code Generation mainly relies on pairwise blind preference tests on [Design Arena](https://www.designarena.ai/leaderboard). When users choose and score, they generally prefer results that look better and more orderly. So our question is: how do we tell when a front-end visual artifact is more aesthetically pleasing?

We will skip the argument for now and look at the comparisons below.

```case
mode: gallery
aspect: 21/9
item: | /blog/genclaw-next/pizza.mp4
item: | /blog/genclaw-next/music-player.mp4
```

## The Gap in Look and Feel Is Discontinuous

> If you had to pick one from each pair to ship, the answer would barely need hesitation—the left side. Same prompt, same model: the only variable is whether rich visual assets are available, and the gap in look and feel is discontinuous.

And this is not "slightly better looking." These are two different levels of finish. On the right, the structure is correct, the layout is fine, and the text and data are accurate—but the page can only fill space with simple geometric blocks, gradients, or emoji, and ends up looking like a half-finished product. The model knows how to write code, yet it cannot cross the gulf from "structurally correct" to "visually pleasing." Arena-style pairwise blind preference tests are now one of the main ways to measure a model's design ability. For human judges, though, the weight of **visual richness** is strikingly high: an artifact with material quality, a strong hero visual, and atmosphere almost always beats one that has layout alone, even when the latter is more orderly in structure.

We usually blame "AI-written pages looking bad" on aesthetic design. A more direct explanation is that HTML, SVG, and CSS are excellent at structural control and typography, but poor at hand-drawing complex visual assets. Cinematic backgrounds, 3D hero visuals, natural textures, intricate illustration—asking a model to paint these in pure code is extremely costly and usually stiff.

> So a large part of what decides look and feel sits in the places code cannot draw; the ability to obtain assets is already deciding the ranking.

Of course, an Agent Harness can help us obtain enough assets through search or generative models, which helps produce more aesthetically pleasing results. But if a model is not inclined, in its preferences, to fetch assets—and instead fills space with hallucinated UI or SVG placeholders—it will easily lose out on preference scores. And for non-agentic HTML generation tasks, outputs that stably cite real, usable image resources (for example, sufficiently accurate Unsplash image IDs) may also score higher. [A public analysis](https://www.designarena.ai/blog/kimi-k3s-design-secret-may-be-in-its-thinking-traces) has discussed the role of asset selection and citation in high-scoring traces; the reminder is gentle but clear: the gap in look and feel is often not only "can you write layout," but "did you put the right assets into the page."

## Multimodal Content Generation for Visual Code Generation

We can of course obtain assets through means such as web search, but today we focus more on analysis and exploration based on multimodal generative tools; more detail can be found in [GenClaw-Next](TODO).

> What's missing is assets—so give it assets.

In GenClaw-Next, generative models act as a "local asset generator." The agent decides on its own when to call image, 3D, video, and other generative models, producing local visual assets that are hard to hand-draw in code. Text, layout, data, and charts remain fully owned by code. We also found that this needs to be prompted explicitly. If the tools are only attached, the model often keeps its old habits—continuing to fill the page with gradients and color blocks, rarely pausing to think "this region should actually be an image asset." Once the instructions explicitly ask it to prioritize asset generation and to judge which regions are better served by assets, the finish of the output jumps noticeably.

```case
mode: gallery
aspect: 21/9
item: | /blog/genclaw-next/animation-studio.mp4
item: | /blog/genclaw-next/robot-3d.mp4
```

At the same time, we also have some reflections on multimodal content generation and Visual Code generation. In a world where Coding Agents dominate nearly every task, multimodal content-generation tools seem able to embed cleanly into visual content creation as well, helping LLMs move faster toward becoming productive generative tools.

> When visual code generation tries to move toward production-grade design, it hits aesthetic intuition and asset bottlenecks that are extremely hard to break through. Existing code LLMs lack global visual control: they are fluent in syntax, the DOM tree, and Flexbox layout, yet they have little two-dimensional spatial sense or visual intuition. Asking a model to write front-end code directly often yields highly templated, thin "big headline + cards + rounded shadows" kits. The model knows how to write code, but not how to write something that looks good. A second bottleneck is the assets themselves—HTML, SVG, and CSS excel at structure and layout, but asking a model to hand-draw complex visual materials in pure code (cinematic backgrounds, 3D hero visuals, natural textures, intricate illustration) is costly and stiff, so the result often falls back to geometric blocks, gradients, or emoji placeholders and reads as unfinished.
>
> Looking across visual generation today, research mainly follows two orthogonal paths, each with its own "lopsided" weakness. On one side is "left-brain" pure code generation—today's Coding Agent is like a system with only a left hemisphere: strong on logic and structure, yet because code is essentially a one-dimensional symbol sequence, the model lacks two-dimensional spatial sense and aesthetic prior. On the other side is "right-brain" visual content generation (e.g. diffusion models), which compresses centuries of artistic prior and can instantly produce frames with top-tier composition, light, and material quality; but it has a fatal structural blind spot—without rigorous logic, the generated raster image is inherently unreliable for text accuracy, multi-layer layout, data charts, and later editability, and cannot serve as a real engineering deliverable.
>
> Inspired by the World Action Model (WAM) strategy, we place an image generation model upstream as the Coding Agent's "visual world simulator," and treat the LLM as the later action decision-maker for Visual Code. Concretely, before writing code, the agent first calls an image model to produce a concept image, establishing aesthetic priors for composition, lighting, and color atmosphere—imagine first, then act. At the same time, during code execution, generative models also serve as a "local asset generator": the agent decides on its own when to call image, 3D, video, and other models to produce local visual assets that are hard to hand-draw in code (atmospheric backgrounds, illustrations, 3D hero visuals, animated video backdrops, and so on), then embeds them seamlessly as material layers into the HTML/SVG/CSS structure.
>
> — GenClaw-Next technical report ([arXiv:2605.30248](https://arxiv.org/abs/2605.30248), forthcoming update)

```case
mode: gallery
aspect: 16/10
item: | /blog/genclaw-next/shanchuan-tea.jpg
item: | /blog/genclaw-next/akari.jpg
```

> "Aesthetics" is a prior that is extremely hard to quantify in words, yet easy to make concrete in an image. Letting the agent first "see" a possible design direction, then write real content and editable structure, is far more reliable than asking it to write blindfolded.

In results so far, the visual imaginer can still gain an edge on certain tasks—for example more design-oriented poster work. Of course, on many tasks a visual imaginer may not be needed at all; the raw strength of a Coding Agent is already enough. It is worth noting that when multimodal research closely explored "generation for understanding," pixel-generation noise often interfered on rigorous math and logic tasks; in visual code generation, by contrast, image generation may feed back into the model's structural understanding and layout decisions.

Finally, as we emphasize in the [GenClaw](https://github.com/yejy53/GenClaw) discussion: in the future, the final deliverable of some multimodal content creation may not be limited to a final raster image. Editable visual artifacts produced via Visual Code generation also show strong potential for text accuracy and layered edit control, helping users continue content creation and production. The result below further shows the clear advantage of visual content generation over pure pixel image generation alone.

```case
mode: gallery
aspect: 16/15
item: | /blog/genclaw-next/shanyou-guanyin.mp4
```
