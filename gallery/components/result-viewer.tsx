"use client";

import { useEffect, useRef, useState } from "react";
import {
  assetUrl,
  copy,
  localize,
  type CategoryId,
  type GalleryResult,
  type Locale,
} from "@/lib/gallery";
import { ExpandIcon, RefreshIcon } from "@/components/icons";

// A single desktop format. Slides carry a fixed 16:9 canvas and are shown in
// full ("contain"); every other live page renders at a desktop width and may
// scroll inside its own frame ("page").
type Viewport = { width: number; height: number };

function viewportFor(category: CategoryId): {
  viewport: Viewport;
  mode: "contain" | "page";
} {
  if (category === "slide") {
    return { viewport: { width: 4096, height: 2304 }, mode: "contain" };
  }
  return { viewport: { width: 1280, height: 900 }, mode: "page" };
}

function useContainerWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new ResizeObserver((entries) => {
      setWidth(entries[0].contentRect.width);
    });
    observer.observe(node);
    setWidth(node.clientWidth);
    return () => observer.disconnect();
  }, []);
  return { ref, width };
}

function HtmlResult({
  result,
  locale,
  category,
}: {
  result: GalleryResult;
  locale: Locale;
  category: CategoryId;
}) {
  const t = copy[locale];
  const { viewport, mode } = viewportFor(category);
  const [reloadKey, setReloadKey] = useState(0);
  const { ref, width: stageWidth } = useContainerWidth<HTMLDivElement>();

  const available = Math.max(stageWidth - 2, 240);
  const scale = available / viewport.width;
  const boxWidth = viewport.width * scale;
  const boxHeight = viewport.height * scale;

  return (
    <>
      <div className="viewer-toolbar">
        <span className="viewer-static-label">
          {mode === "contain" ? "16 : 9" : t.desktop}
        </span>
        <div className="viewer-actions">
          <button type="button" onClick={() => setReloadKey((key) => key + 1)}>
            <RefreshIcon />
            {t.refresh}
          </button>
          <a href={assetUrl(result.artifact)} target="_blank" rel="noreferrer">
            <ExpandIcon />
            {t.openPreview}
          </a>
        </div>
      </div>
      <div className={`iframe-stage iframe-stage-${mode}`} ref={ref}>
        <div
          className="iframe-scaled-box"
          style={{ width: boxWidth, height: boxHeight }}
        >
          <iframe
            key={reloadKey}
            src={assetUrl(result.artifact)}
            title={result.producer}
            loading="lazy"
            scrolling={mode === "contain" ? "no" : "auto"}
            sandbox="allow-scripts allow-same-origin"
            style={{
              width: viewport.width,
              height: viewport.height,
              transform: `scale(${scale})`,
            }}
          />
        </div>
      </div>
    </>
  );
}

function ImageResult({ result, locale }: { result: GalleryResult; locale: Locale }) {
  const t = copy[locale];
  return (
    <>
      <div className="viewer-toolbar">
        <span className="viewer-static-label">{t.result}</span>
        <div className="viewer-actions">
          <a href={assetUrl(result.artifact)} target="_blank" rel="noreferrer">
            <ExpandIcon />
            {t.openPreview}
          </a>
        </div>
      </div>
      <div className="image-stage">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt={result.producer} src={assetUrl(result.artifact)} />
      </div>
    </>
  );
}

export function ResultStage({
  results,
  locale,
  category,
}: {
  results: GalleryResult[];
  locale: Locale;
  category: CategoryId;
}) {
  const t = copy[locale];
  const [activeId, setActiveId] = useState(results[0]?.id);
  const current = results.find((item) => item.id === activeId) ?? results[0];

  return (
    <div className="result-stage">
      {results.length > 1 && (
        <div className="stage-tabs">
          {results.map((result) => (
            <button
              key={result.id}
              type="button"
              className={result.id === current.id ? "is-active" : undefined}
              onClick={() => setActiveId(result.id)}
            >
              {result.producer}
            </button>
          ))}
        </div>
      )}
      <div className="result-panel">
        {current.kind === "html" ? (
          <HtmlResult result={current} locale={locale} category={category} />
        ) : (
          <ImageResult result={current} locale={locale} />
        )}
        <div className="result-metadata">
          {current.model && (
            <div>
              <span>{t.model}</span>
              <strong>{current.model}</strong>
            </div>
          )}
          {current.parameters && (
            <div>
              <span>{t.parameters}</span>
              <strong>
                {Object.entries(current.parameters)
                  .map(([key, value]) => `${key}: ${value}`)
                  .join(" · ")}
              </strong>
            </div>
          )}
          {current.note && <p>{localize(current.note, locale)}</p>}
        </div>
      </div>
    </div>
  );
}
