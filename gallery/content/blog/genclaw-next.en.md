---
title: Towards Rich Visual Code Generation
subtitle: What Makes Generated Websites Fascinating?
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

The question first came out of our own observations of Visual Code Generation evaluation. In recent years, large language models have made breakthrough progress in code generation, and visual code generation in particular has shown enormous potential. Models of the latest generation—represented by GPT-5.6 Sol, Claude Fable 5, and Kimi K3—can already generate HTML, SVG, and CSS directly to automate the construction of fully functional webpages, dynamic user interfaces (UI), and interactive data visualizations. This code-based generation path opens up a large imaginative space for automated design and front-end development.

Today, capability evaluation for Visual Code Generation mainly relies on pairwise blind preference tests such as [Design Arena](https://www.designarena.ai/leaderboard): one prompt produces two results, and users pick the one they prefer. In practice, they lean toward whichever looks better and more finished.

But what exactly decides "looks better"?

Before making any argument, take a look at the results below—which side would you pick?

```case
mode: gallery
aspect: 21/9
item: | /blog/genclaw-next/pizza.mp4
item: | /blog/genclaw-next/music-player.mp4
```

> If you had to pick one from each pair to ship, the answer would barely need hesitation—the left side. Same prompt, same model: the only variable is whether rich visual assets are available, and the gap in look and feel is discontinuous.

## Visual richness may matter more than we assumed

Look closely at the two sides and you will find the structure, layout, text, and data barely differ. What really opens the gap is that the right side leans on simple geometric blocks, gradients, and emoji as filler, so it still reads as a half-finished product; the left side, with richer visual assets, has a complete hero image, material quality, and atmosphere.

The model knows how to write code, but struggles to cross the gulf from "structurally correct" to "visually pleasing."


We usually attribute "AI-written pages looking bad" to the model lacking taste, but a more direct explanation is this: HTML, SVG, and CSS are good at structural control and typography, yet not at hand-drawing complex visual assets. Cinematic backgrounds, 3D hero visuals, natural textures, intricate illustration—asking a model to paint these in code alone is not only expensive, it does not close the capability gap either.


Arena-style pairwise blind tests are now one of the main ways to measure a model's design ability. For a human's first impression, the weight of **visual richness** may be higher than we assumed. A result with fairly complete material quality, hero visual, and atmosphere tends to beat one that has layout alone, even when the latter is more orderly in structure. To scale that "first impression" up to something measurable, we use a VLM to stand in for an ordinary user in pairwise blind tests. The prompt is simple:

```text
Act as an ordinary user seeing two anonymous web designs. Based on your first
impression, choose the result you prefer based on which looks better, feels
clearer, and is more appealing to use. Choose A or B, and use tie only when
you genuinely have no meaningful preference.
```

![Arena score against average image-generation calls per model](/blog/genclaw-next/elo-vs-imagecalls.png "Arena score for each model, alongside how often it called an image generation model across the same batch of tasks")

> So a large part of what decides look and feel sits in the places code cannot draw. The ability to obtain assets has already begun to shape the final ranking in Visual Code Generation.

The outcome tracks closely with how willing a model is to fetch assets. The top three—Kimi K3, Claude Opus 4.8, and GLM 5.2—call an image model 5 to 8 times per task on average, while GPT-5.5 and DeepSeek V4 Pro preview average only 1.1 times. An Agent Harness can of course let a model gather enough assets through search or generative models, and thus produce a more complete result. But if the model's behavioral preference is not to fetch assets in the first place—if it habitually reaches for hallucinated UI, abstract SVG, or color-block filler—then even with the tools mounted, it will easily [fall behind](https://www.designarena.ai/blog/kimi-k3s-design-secret-may-be-in-its-thinking-traces) in preference tests.



## Generation fills the asset gap of visual code

We can of course obtain assets through means such as web search, but today we want to discuss another path: using multimodal generative tools to directly fill in the visual content that Visual Code is missing.

In the [GenClaw-Next](TODO) Harness, for tasks such as Web-Dev and poster generation, we **mount a dedicated asset-generation tool built around image generation models**, and we encourage the agent to reach for it more actively. The agent decides on its own when to call image, 3D, video, and other generative models, producing local visual assets that are hard to hand-draw in code.

> What's missing is assets—so give it assets.

But we quickly found that mounting the tool does not mean the model will actually use it. It tends to keep working the way it always has—finish the structure first, then fill the page with gradients, shadows, and color blocks. It rarely stops to think, "this region should actually be an image." So we added a step to the design stage: first produce a `design.md`. While the agent plans the page's features, content, and layout, it must also analyze which regions need a hero visual, background, illustration, texture, or other visual assets. Only once those needs are explicit does it move on to code generation and asset generation.

It looks like a small change, but it actually reorders how the agent creates: first work out what the picture needs, then decide how to realize it. With that step added, the finish of the output improved noticeably. Most importantly, the agent became far more willing to call image generation models. In the results below, models that had previously shown little interest in image tools—GPT-5.5 and DeepSeek V4 Pro preview among them—reached a higher win rate under the same prompts.

![Head-to-head outcomes before and after adding design.md](/blog/genclaw-next/design-md-ablation.png "Head-to-head outcomes on the same batch of prompts, before and after adding design.md, alongside the change in average image-generation calls")


```case
mode: gallery
aspect: 21/9
item: | /blog/genclaw-next/animation-studio.mp4
item: | /blog/genclaw-next/robot-3d.mp4
```


## Generation as visual imagination

> In a world where Coding Agents dominate nearly every task, multimodal content-generation tools seem able to embed cleanly into visual content creation as well, helping LLMs move faster toward becoming productive generative tools.

Adding multimodal tools did raise the visual richness of the Web-Dev content a Coding Agent produces. But we ran into another problem: today's code models still badly lack control over the picture as a whole.

They are fluent in syntax, the DOM tree, and Flexbox, yet they have no stable two-dimensional spatial sense or visual intuition. Asking a model to write front-end code directly tends to yield the highly templated "big headline, cards, rounded shadows" kit. This shows up most on tasks like posters that lean on professional design: the model knows how the code should be written, but not how the picture should look.

Looking across visual generation today, research mainly follows two orthogonal paths, each with its own "lopsided" weakness. On one side is "left-brain" pure code generation—today's Coding Agent is like a system with only a left hemisphere: strong on logic and structure, yet because code is essentially a one-dimensional symbol sequence, the model lacks two-dimensional spatial sense and aesthetic prior. On the other side is "right-brain" visual content generation (e.g. diffusion models), which compresses centuries of artistic prior and can instantly produce frames with top-tier composition, light, and material quality; but it has a fatal structural blind spot—without rigorous logic, the generated raster image is inherently unreliable for text accuracy, multi-layer layout, data charts, and later editability, and cannot serve as a real engineering deliverable.

Inspired by the World Action Model (WAM) strategy, we place an image generation model upstream as the Coding Agent's "visual world simulator," and treat the LLM as the later action decision-maker for Visual Code. Concretely, before writing code, the agent first calls an image model to produce a concept image, establishing aesthetic priors for composition, lighting, and color atmosphere—"**imagine first, then act**."

```case
mode: gallery
aspect: 3/2
item: | /blog/genclaw-next/shanchuan-tea.jpg
item: | /blog/genclaw-next/akari.jpg
```

> "Aesthetics" is a prior that is extremely hard to quantify in words, yet easy to make concrete in an image. Letting the agent first "see" a possible design direction, then write real content and editable structure, is far more reliable than asking it to write blindfolded.

From the results below, the visual imaginer does gain an edge on a subset of tasks, especially posters and other work with a stronger design character. In this ablation, every model's "with visual reference" variant ranks ahead of its own "without" variant. On poster design tasks, the Arena head-to-head win rate with versus without the visual imagination strategy is 63% vs 37%.

![Results with and without a visual reference](/blog/genclaw-next/imaginer-ablation.png "Arena scores for the same models under two settings: with a visual reference (solid) and without one (outlined)")

There is an interesting contrast here. In the past, when multimodal research explored "generation for understanding," pixel-generation noise often interfered on rigorous math and logic tasks; in Visual Code Generation, by contrast, image generation may feed back into the model's structural understanding and layout decisions. In other words, the image here is not only a final asset—it can also become part of how the model thinks through a design.


## Visual Code as a new medium for content creation

Today, creative design and content generation with models such as GPT-Image-2 and Seedream have already become a daily workflow for many creators. But we think Visual Code Generation also has the potential to become a new medium for content creation.

This brings us back to a point we have long emphasized in [GenClaw](https://github.com/yejy53/GenClaw): what Visual Code changes may not only be whether a page looks good, but the form of the creative deliverable itself. Today, most multimodal creation ends at a raster image. Once that image is delivered, its text, layers, and layout are essentially fixed. Artifacts produced by Visual Code—HTML, PPTX, and the like—are editable by nature: text is accurate, layers stay under control, and what users receive is not an image that can only be remade as a whole, but a draft they can keep revising.

The results below make this clearer:

```case
mode: gallery
aspect: 9/8
item: | /blog/genclaw-next/poster-editing.mp4
item: | /blog/genclaw-next/dragon-year-poster.mp4
```

Compared with methods that emit pixels directly, such as GPT-Image-2 and Seedream 5, the visual content GenClaw-Next produces lets users freely drag elements, rewrite text, and replace image assets. For posters, infographics, and other tasks that need repeated fine-tuning, this matters a great deal. If one image asset needs replacing, a single image-model call can swap it locally, without scrapping the whole piece and starting over. We have also made some optimizations for tasks like PPT, which lean even more on manual second-pass editing.

Finally, on how to use it. GenClaw-Next is itself a model-agnostic, framework-agnostic Agent Harness—not tied to a particular LLM provider, nor to a particular framework. We have also packaged the same capability **as a Skill**, aimed at hosts such as Codex and Claude Code, so anyone can try it out directly.
