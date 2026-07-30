import casesJson from "@/generated/cases.json";

// The agent that produces the work shown here.
export const codeRepoUrl = "https://github.com/yejy53/GenClaw";

export const locales = ["zh", "en"] as const;
export type Locale = (typeof locales)[number];

export const categoryIds = [
  "web",
  "poster",
  "slide",
  "infographic",
  "svg",
] as const;
export type CategoryId = (typeof categoryIds)[number];

export type LocalizedText = {
  zh: string;
  en: string;
};

export type GalleryResult = {
  id: string;
  producer: string;
  kind: "html" | "image" | "svg";
  preview: string;
  artifact: string;
  model?: string;
  parameters?: Record<string, string | number | boolean>;
  note?: LocalizedText;
};

export type GalleryCase = {
  slug: string;
  category: CategoryId;
  title: LocalizedText;
  summary: LocalizedText;
  promptOriginal: string;
  prompt?: LocalizedText;
  cover: string;
  coverAspect: "landscape" | "portrait" | "square";
  featured: boolean;
  tags: string[];
  year: string;
  results: GalleryResult[];
  baseline?: GalleryResult | null;
};

export const copy = {
  zh: {
    home: "首页",
    gallery: "作品集",
    code: "代码",
    theme: "配色",
    themeDark: "深色",
    themeLight: "浅色",
    archive: "视觉档案",
    casesLabel: "案例",
    heroBadge: "生成式视觉档案 · 2026",
    heroName: "GenClaw-Next",
    tagline: "Towards Rich Visual Code Generation",
    viewGallery: "浏览作品",
    secondaryCta: "看看示例",
    prev: "上一个",
    next: "下一个",
    introEyebrow: "GenClaw-Next · Visual Archive",
    introTitle: "把提示词，转化为可交互的视觉结果。",
    introBody:
      "收录 Web、海报、演示页与信息图案例。每个案例都保留原始提示词、生成方式与冻结结果，便于审阅与横向比较。",
    enterArchive: "进入档案",
    featuredEyebrow: "精选作品",
    selected: "精选案例",
    selectedBody: "从不同媒介中选择的近期实验。",
    collections: "按类型浏览",
    collectionsEyebrow: "档案索引",
    viewCollection: "查看合集",
    viewCase: "查看案例",
    allCases: "全部案例",
    searchPlaceholder: "搜索案例",
    back: "返回",
    prompt: "原始 Prompt",
    results: "结果对比",
    result: "结果",
    ourResult: "当前结果",
    codingAgent: "对比基线",
    noBaseline: "该案例暂未收录对比基线结果。",
    noPrompt: "该案例暂未收录原始 Prompt。",
    model: "模型",
    parameters: "参数",
    noCases: "该分类暂时没有公开案例。",
    noResults: "没有匹配的案例。",
    compare: "并排对比",
    focus: "单项查看",
    openPreview: "单独打开",
    interactive: "交互预览",
    refresh: "刷新",
    zoom: "缩放",
    desktop: "桌面",
    tablet: "平板",
    mobile: "手机",
    footerNote: "生成式视觉实验与可复现案例。",
    categories: {
      web: "Web / HTML",
      poster: "海报",
      slide: "PPT / Slide",
      infographic: "信息图",
      svg: "SVG",
    },
    categoryDescriptions: {
      web: "可直接交互、拖动与改变视口的网页作品。",
      poster: "强调版式、文字准确度与视觉冲击力的平面实验。",
      slide: "面向汇报场景的 16:9 单页演示与数据叙事。",
      infographic: "将结构、流程与数据压缩成清晰的视觉信息。",
      svg: "以矢量输出的图形与图标系统，可无损缩放。",
    },
  },
  en: {
    home: "Home",
    gallery: "Gallery",
    code: "Code",
    theme: "Theme",
    themeDark: "Dark",
    themeLight: "Light",
    archive: "Visual Archive",
    casesLabel: "Cases",
    heroBadge: "Generative Visual Archive · 2026",
    heroName: "GenClaw-Next",
    tagline: "Towards Rich Visual Code Generation",
    viewGallery: "View Gallery",
    secondaryCta: "See an example",
    prev: "Previous",
    next: "Next",
    introEyebrow: "GenClaw-Next · Visual Archive",
    introTitle: "Turning prompts into interactive visual outcomes.",
    introBody:
      "A curated archive of web, poster, slide, and infographic experiments. Each case preserves its original prompt, production method, and frozen outputs for review and comparison.",
    enterArchive: "Enter the archive",
    featuredEyebrow: "Featured Work",
    selected: "Selected Cases",
    selectedBody: "Recent experiments across different visual media.",
    collections: "Browse by Type",
    collectionsEyebrow: "Archive Index",
    viewCollection: "View collection",
    viewCase: "View case",
    allCases: "All cases",
    searchPlaceholder: "Search cases",
    back: "Back",
    prompt: "Original Prompt",
    results: "Result Comparison",
    result: "Result",
    ourResult: "Current Result",
    codingAgent: "Baseline",
    noBaseline: "No comparison baseline has been captured for this case yet.",
    noPrompt: "No original prompt has been recorded for this case yet.",
    model: "Model",
    parameters: "Parameters",
    noCases: "No public cases are available in this category yet.",
    noResults: "No cases match your search.",
    compare: "Compare",
    focus: "Focus",
    openPreview: "Open separately",
    interactive: "Interactive preview",
    refresh: "Refresh",
    zoom: "Zoom",
    desktop: "Desktop",
    tablet: "Tablet",
    mobile: "Mobile",
    footerNote: "Generative visual studies and reproducible cases.",
    categories: {
      web: "Web / HTML",
      poster: "Poster",
      slide: "PPT / Slide",
      infographic: "Infographic",
      svg: "SVG",
    },
    categoryDescriptions: {
      web: "Interactive web pieces with draggable content and responsive viewport previews.",
      poster: "Graphic experiments focused on typography, hierarchy, and visual impact.",
      slide: "16:9 presentation pages designed for concise data storytelling.",
      infographic: "Clear visual systems for structures, processes, and data.",
      svg: "Vector graphics and icon systems that scale losslessly.",
    },
  },
} as const;

// Empty when served from the domain root. On a GitHub Pages project site the
// build lives under "/<repo>", and next/image + raw iframe/img/anchor targets
// are not rewritten by Next, so published asset paths need it applied by hand.
const rawBasePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").trim();
export const basePath = rawBasePath === "/" ? "" : rawBasePath.replace(/\/+$/, "");

export function assetUrl(path: string) {
  return path.startsWith("/") ? `${basePath}${path}` : path;
}

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function isCategory(value: string): value is CategoryId {
  return categoryIds.includes(value as CategoryId);
}

export const galleryCases = casesJson as GalleryCase[];

export function getCase(slug: string) {
  return galleryCases.find((item) => item.slug === slug);
}

export function getCasesByCategory(category: CategoryId) {
  return galleryCases.filter((item) => item.category === category);
}

export function localize(text: LocalizedText, locale: Locale) {
  return text[locale];
}
