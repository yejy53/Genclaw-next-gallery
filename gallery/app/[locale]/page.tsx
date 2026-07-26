import { notFound } from "next/navigation";
import {
  categoryIds,
  copy,
  galleryCases,
  getCasesByCategory,
  isLocale,
  locales,
  type Locale,
} from "@/lib/gallery";
import { GalleryShell } from "@/components/gallery-shell";
import { Hero } from "@/components/hero";
import { Coverflow } from "@/components/coverflow";
import { Reveal } from "@/components/reveal";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleHome({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const typedLocale = locale as Locale;
  const t = copy[typedLocale];

  const featured = galleryCases.filter((item) => item.featured);
  const heroCases = featured.length > 0 ? featured : galleryCases;

  return (
    <GalleryShell locale={typedLocale} active="home">
      <Hero locale={typedLocale} cases={heroCases} />

      {categoryIds.map((catId, catIndex) => {
        const catCases = getCasesByCategory(catId);
        if (catCases.length === 0) return null;
        return (
          <section
            className={`section category-showcase category-showcase-${catId}`}
            id={`cat-${catId}`}
            key={catId}
          >
            <div className="category-glow" aria-hidden="true" />
            <Reveal className="section-head-center">
              <p className="eyebrow">
                {String(catIndex + 1).padStart(2, "0")} · {t.archive}
              </p>
              <h2>{t.categories[catId]}</h2>
              <p>{t.categoryDescriptions[catId]}</p>
            </Reveal>
            <Reveal delay={80}>
              <Coverflow locale={typedLocale} cases={catCases} />
            </Reveal>
          </section>
        );
      })}
    </GalleryShell>
  );
}
