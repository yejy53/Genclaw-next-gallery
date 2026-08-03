---
title: Towards Rich Visual Code Generation —— Secrets to generate fascinating webs
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

In recent years, large language models have made breakthrough progress in code generation, and visual code generation in particular has shown enormous potential. Models of the latest generation—represented by GPT-5.6 Sol, Claude Fable 5, and Kimi K3—can already generate HTML, SVG, and CSS directly to automate the construction of fully functional webpages, dynamic user interfaces (UI), and interactive data visualizations. This code-based generation path opens up a large imaginative space for automated design and front-end development. Today, capability evaluation for Visual Code Generation mainly relies on approaches such as [Design Arena](https://www.designarena.ai/leaderboard), which run pairwise blind preference tests. When users pick and score, they generally choose the result that looks better and more orderly. So our question is: how do we tell when a front-end visual artifact is more aesthetically pleasing?

> Before making any argument, take a look at the results below—which side would you pick?

```case
mode: gallery
aspect: 21/9
item: | /blog/genclaw-next/pizza.mp4
item: | /blog/genclaw-next/music-player.mp4
```

> If you had to pick one from each pair to ship, the answer would barely need hesitation—the left side. Same prompt, same model: the only variable is whether rich visual assets are available, and the gap in look and feel is discontinuous.

## Visual richness decides the impression

Looking at the two sides, the structure, layout, text, and data do not differ all that much. But the right side mostly fills space with simple geometric blocks, gradients, or emoji, and looks like a half-finished product, while the left side has rich visual assets that lift the whole impression to another level. The model knows how to write code, yet it cannot cross the gulf from "structurally correct" to "visually pleasing." We usually blame "AI-written pages looking bad" on aesthetic design, but a more direct explanation is this: HTML, SVG, and CSS are excellent at structural control and typography, yet poor at hand-drawing complex visual assets. Cinematic backgrounds, 3D hero visuals, natural textures, intricate illustration—asking a model to paint these in pure code is extremely costly and usually stiff. Arena-style pairwise blind preference tests are now one of the main ways to measure a model's design ability. For human judges, though, the weight of **visual richness** is strikingly high: an artifact with material quality, a strong hero visual, and atmosphere almost always beats one that has layout alone, even when the latter is more orderly in structure.

> So a large part of what decides look and feel sits in the places code cannot draw; the ability to obtain assets is already deciding the ranking.

Of course, an Agent Harness can help us obtain enough assets through search or generative models, which helps produce more aesthetically pleasing results. But if a model is not inclined, in its preferences, to fetch assets—and instead fills space with hallucinated UI or SVG placeholders—it will easily lose out on preference scores.

<!-- TODO ship together with the statistics figure:
From the statistics below, Kimi K3, Ops 4.8, and GLM 5.2 show a clearly higher
tendency to call image generation models than GPT 5.5, Gemini-3.5-flash, and others.

Placeholder: a chart here — average number of image-model calls per model.

And for non-agentic HTML generation tasks, outputs that stably cite real, usable
image resources (for example, sufficiently accurate Unsplash image IDs) may also score higher.
Reference: https://www.designarena.ai/blog/kimi-k3s-design-secret-may-be-in-its-thinking-traces
-->


## Generation fills the asset gap of visual code

We can of course obtain assets through means such as web search, but today we focus more on exploring multimodal generative tools. In the [GenClaw-Next](TODO) Harness, for tasks such as Web-Dev and poster generation, we **mount a dedicated asset-generation tool built around image generation models**, and we encourage the agent to reach for it more actively. The agent decides on its own when to call image, 3D, video, and other generative models, producing local visual assets that are hard to hand-draw in code.

> What's missing is assets—so give it assets.

We also found that this needs to be prompted explicitly. If the tools are only attached, the model often keeps its old habits—continuing to fill the page with gradients and color blocks, rarely pausing to think "this region should actually be an image asset." So we **first produce a `design.md` during the design stage**: while planning the page's features, content, and layout, the agent spells out which regions need visual assets. With that step added, the finish of the output jumps noticeably.


<!-- TODO placeholder: a side-by-side result for "with vs. without the image generation tool" goes here. -->


```case
mode: gallery
aspect: 21/9
item: | /blog/genclaw-next/animation-studio.mp4
item: | /blog/genclaw-next/robot-3d.mp4
```


## Generation as visual imagination

> In a world where Coding Agents dominate nearly every task, multimodal content-generation tools seem able to embed cleanly into visual content creation as well, helping LLMs move faster toward becoming productive generative tools.

Adding multimodal generative tools clearly raises the visual richness of the Web-Dev output a Coding Agent produces. But we ran into another problem: today's code LLMs badly lack global visual control. They are fluent in syntax, the DOM tree, and Flexbox layout, yet they have no two-dimensional spatial sense or visual intuition. Asking a model to write front-end code directly often yields highly templated, thin "big headline + cards + rounded shadows" kits. This shows up most on tasks like posters that demand professional aesthetic design: the model knows how to write code, but not how to write something that looks good.

Looking across visual generation today, research mainly follows two orthogonal paths, each with its own "lopsided" weakness. On one side is "left-brain" pure code generation—today's Coding Agent is like a system with only a left hemisphere: strong on logic and structure, yet because code is essentially a one-dimensional symbol sequence, the model lacks two-dimensional spatial sense and aesthetic prior. On the other side is "right-brain" visual content generation (e.g. diffusion models), which compresses centuries of artistic prior and can instantly produce frames with top-tier composition, light, and material quality; but it has a fatal structural blind spot—without rigorous logic, the generated raster image is inherently unreliable for text accuracy, multi-layer layout, data charts, and later editability, and cannot serve as a real engineering deliverable.

Inspired by the World Action Model (WAM) strategy, we place an image generation model upstream as the Coding Agent's "visual world simulator," and treat the LLM as the later action decision-maker for Visual Code. Concretely, before writing code, the agent first calls an image model to produce a concept image, establishing aesthetic priors for composition, lighting, and color atmosphere—**imagine first, then act**.

```case
mode: gallery
aspect: 3/2
item: | /blog/genclaw-next/shanchuan-tea.jpg
item: | /blog/genclaw-next/akari.jpg
```

> "Aesthetics" is a prior that is extremely hard to quantify in words, yet easy to make concrete in an image. Letting the agent first "see" a possible design direction, then write real content and editable structure, is far more reliable than asking it to write blindfolded.

In results so far, the visual imaginer does gain an edge on certain tasks—more design-oriented poster work, for example. It is worth noting that when multimodal research closely explored "generation for understanding," pixel-generation noise often interfered on rigorous math and logic tasks; in visual code generation, by contrast, image generation may feed back into the model's structural understanding and layout decisions.


## Visual Code as a new medium for content creation

Today, creative design and content generation with tools such as GPT-Image-2 and Seedream have already become part of creators' daily toolkit, yet Visual Code Generation has the potential to serve as a new carrier for content creation. This brings us back to a point we have long emphasized in [GenClaw](https://github.com/yejy53/GenClaw): what Visual Code changes may not only be whether a page looks good, but the form of the creative deliverable itself. For most multimodal creation today, the endpoint is a raster image that is already fixed once delivered. Artifacts produced by Visual Code—HTML, PPTX, and the like—are editable by nature: text can be accurate, layers can be controlled, and what users receive is not an image that can only be remade as a whole, but a draft they can continue to revise. The results below make this clearer.

```case
mode: gallery
aspect: 20/17
item: | /blog/genclaw-next/poster-editing.mp4
```

Compared with methods that emit pixels directly, such as GPT-Image-2 and Seedream 5, the visual artifacts GenClaw-Next produces let users freely drag and rewrite the text and image assets inside them—especially important for posters, infographics, and other tasks that need repeated fine-tuning. If a particular image asset itself needs to be replaced, one can call an image model again for a local swap, without having to scrap the entire piece and start over. We have also tuned for tasks like PPT, which lean even more on manual second-pass editing.


Finally, on how to use it. GenClaw-Next is itself a model-agnostic, framework-agnostic agent harness—it is not tied to a particular LLM provider, nor to a particular framework. We have also packaged the same capability **as a Skill**, aimed at hosts such as Codex and Claude Code, so users can try it out directly.
