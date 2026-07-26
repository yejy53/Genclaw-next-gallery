"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  assetUrl,
  copy,
  localize,
  type GalleryCase,
  type Locale,
} from "@/lib/gallery";
import { ArrowUpRightIcon } from "@/components/icons";

type HeroProps = {
  locale: Locale;
  cases: GalleryCase[];
};

// Right-anchored fan: leftmost card sits furthest back and most rotated,
// the rightmost card is upright and on top.
const FAN = [
  { x: -300, y: 46, rot: -15, scale: 0.9, z: 1 },
  { x: -150, y: 16, rot: -8, scale: 0.95, z: 2 },
  { x: 14, y: 2, rot: 1, scale: 1, z: 3 },
  { x: 176, y: 22, rot: 10, scale: 0.97, z: 4 },
];

export function Hero({ locale, cases }: HeroProps) {
  const t = copy[locale];
  const [mounted, setMounted] = useState(false);
  const fanCases = cases.slice(0, 4);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <section className={`home-hero${mounted ? " is-in" : ""}`}>
      <div className="hero-rays" aria-hidden="true" />
      <div className="hero-inner">
        <p className="hero-badge reveal-item" style={{ transitionDelay: "40ms" }}>
          <span className="hero-badge-dot" />
          {t.heroBadge}
        </p>
        <h1 className="hero-name reveal-item" style={{ transitionDelay: "120ms" }}>
          {t.heroName}
        </h1>
        <p
          className="hero-subtitle reveal-item"
          style={{ transitionDelay: "200ms" }}
        >
          {t.heroSubtitle}
        </p>
        <div className="hero-actions reveal-item" style={{ transitionDelay: "280ms" }}>
          <Link className="btn btn-primary" href={`/${locale}#cat-web`}>
            {t.viewGallery}
          </Link>
          {fanCases[0] && (
            <Link
              className="btn btn-ghost"
              href={`/${locale}/cases/${fanCases[0].slug}`}
            >
              {t.secondaryCta}
            </Link>
          )}
        </div>
      </div>

      <div className="hero-fan" role="list">
        {fanCases.map((item, index) => {
          const pose = FAN[index] ?? FAN[FAN.length - 1];
          return (
            <Link
              key={item.slug}
              role="listitem"
              className="fan-card"
              href={`/${locale}/cases/${item.slug}`}
              style={
                {
                  zIndex: pose.z,
                  transitionDelay: `${360 + index * 90}ms`,
                  "--fx": `${pose.x}px`,
                  "--fy": `${pose.y}px`,
                  "--fr": `${pose.rot}deg`,
                  "--fs": pose.scale,
                } as React.CSSProperties
              }
            >
              <div className="fan-card-inner">
                <Image
                  alt={localize(item.title, locale)}
                  fill
                  priority={index >= 2}
                  sizes="320px"
                  src={assetUrl(item.cover)}
                />
                <span className="fan-card-tag">
                  {t.categories[item.category]}
                  <ArrowUpRightIcon size={12} />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
