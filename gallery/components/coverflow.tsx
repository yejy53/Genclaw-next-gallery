"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  assetUrl,
  copy,
  localize,
  type GalleryCase,
  type Locale,
} from "@/lib/gallery";
import {
  ArrowUpRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@/components/icons";

type CoverflowProps = {
  locale: Locale;
  cases: GalleryCase[];
};

// The active card of a web case renders the real page (3D / video), clipped to
// its first screen. Rendered at a desktop width and scaled to the card so the
// homepage hero shows live rather than as a flat screenshot.
function LiveFirstScreen({ src, title }: { src: string; title: string }) {
  const ref = useRef<HTMLDivElement>(null);
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

  const logicalWidth = 1280;
  const logicalHeight = 960;
  const scale = width > 0 ? width / logicalWidth : 0;

  return (
    <div className="coverflow-live" ref={ref}>
      {width > 0 && (
        <iframe
          src={src}
          title={title}
          loading="lazy"
          scrolling="no"
          sandbox="allow-scripts allow-same-origin"
          style={{
            width: logicalWidth,
            height: logicalHeight,
            transform: `scale(${scale})`,
          }}
        />
      )}
    </div>
  );
}

function pose(offset: number) {
  const abs = Math.abs(offset);
  if (abs === 0) {
    return { x: 0, scale: 1, rotate: 0, blur: 0, brightness: 1, z: 40, opacity: 1 };
  }
  const dir = offset > 0 ? 1 : -1;
  if (abs === 1) {
    return {
      x: dir * 60,
      scale: 0.82,
      rotate: dir * -9,
      blur: 3,
      brightness: 0.48,
      z: 30,
      opacity: 1,
    };
  }
  if (abs === 2) {
    return {
      x: dir * 104,
      scale: 0.66,
      rotate: dir * -13,
      blur: 6,
      brightness: 0.3,
      z: 20,
      opacity: 1,
    };
  }
  return {
    x: dir * 140,
    scale: 0.55,
    rotate: dir * -16,
    blur: 8,
    brightness: 0.2,
    z: 10,
    opacity: 0,
  };
}

export function Coverflow({ locale, cases }: CoverflowProps) {
  const t = copy[locale];
  const count = cases.length;
  const hasLive = cases.some((item) => item.category === "web");
  const initial = Math.max(0, cases.findIndex((item) => item.featured));
  const [active, setActive] = useState(initial);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback(
    (dir: number) => setActive((prev) => (prev + dir + count) % count),
    [count]
  );

  useEffect(() => {
    if (paused || count < 2 || hasLive) return;
    timer.current = setInterval(() => {
      setActive((prev) => (prev + 1) % count);
    }, 3800);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [paused, count, hasLive]);

  const current = cases[active];
  const multiple = count > 1;

  return (
    <div className={`coverflow${multiple ? "" : " is-single"}`}>
      <div
        className="coverflow-stage"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {multiple && (
          <button
            type="button"
            className="coverflow-nav coverflow-nav-prev"
            aria-label={t.prev}
            onClick={() => go(-1)}
          >
            <ChevronLeftIcon />
          </button>
        )}

        <div className="coverflow-track">
          {cases.map((item, index) => {
            let offset = index - active;
            if (offset > count / 2) offset -= count;
            if (offset < -count / 2) offset += count;
            const p = pose(offset);
            const isActive = offset === 0;
            const isLiveWeb = isActive && item.category === "web";
            return (
              <div
                key={item.slug}
                className={`coverflow-card${isActive ? " is-active" : ""}${
                  isLiveWeb ? " is-live" : ""
                }`}
                style={
                  {
                    zIndex: p.z,
                    opacity: p.opacity,
                    pointerEvents: p.opacity === 0 ? "none" : "auto",
                    transform: `translate(-50%, -50%) translateX(${p.x}%) scale(${p.scale}) rotateY(${p.rotate}deg)`,
                    filter: `blur(${p.blur}px) brightness(${p.brightness})`,
                  } as React.CSSProperties
                }
                onClick={() => {
                  if (!isActive) setActive(index);
                }}
                role={isActive ? undefined : "button"}
                aria-hidden={!isActive}
              >
                {isLiveWeb ? (
                  <div className="coverflow-card-inner">
                    <LiveFirstScreen
                      src={assetUrl(item.results[0].artifact)}
                      title={localize(item.title, locale)}
                    />
                  </div>
                ) : isActive ? (
                  <Link
                    className="coverflow-card-inner"
                    href={`/${locale}/cases/${item.slug}`}
                  >
                    <Image
                      alt={localize(item.title, locale)}
                      fill
                      sizes="(max-width: 620px) 78vw, 440px"
                      src={assetUrl(item.cover)}
                    />
                  </Link>
                ) : (
                  <div className="coverflow-card-inner">
                    <Image alt="" fill sizes="360px" src={assetUrl(item.cover)} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {multiple && (
          <button
            type="button"
            className="coverflow-nav coverflow-nav-next"
            aria-label={t.next}
            onClick={() => go(1)}
          >
            <ChevronRightIcon />
          </button>
        )}
      </div>

      <div className="coverflow-meta" key={current.slug}>
        <p className="coverflow-meta-kicker">
          {String(active + 1).padStart(2, "0")}
          <span>·</span>
          {t.categories[current.category]}
        </p>
        <h3>{localize(current.title, locale)}</h3>
        <p className="coverflow-meta-summary">
          {localize(current.summary, locale)}
        </p>
        <Link
          className="showcase-link"
          href={`/${locale}/cases/${current.slug}`}
        >
          {t.viewCase}
          <ArrowUpRightIcon size={13} />
        </Link>
      </div>

      {multiple && (
        <div className="coverflow-dots">
          {cases.map((item, index) => (
            <button
              key={item.slug}
              type="button"
              className={index === active ? "is-active" : undefined}
              aria-label={localize(item.title, locale)}
              onClick={() => setActive(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
