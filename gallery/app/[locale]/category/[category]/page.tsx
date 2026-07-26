import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  categoryIds,
  copy,
  getCasesByCategory,
  isCategory,
  isLocale,
  locales,
  type CategoryId,
  type Locale,
} from "@/lib/gallery";
import { GalleryShell } from "@/components/gallery-shell";
import { CaseCard } from "@/components/case-card";
import { ArrowLeftIcon } from "@/components/icons";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    categoryIds.map((category) => ({ locale, category }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}): Promise<Metadata> {
  const { locale, category } = await params;
  if (!isLocale(locale) || !isCategory(category)) return {};
  return { title: copy[locale as Locale].categories[category as CategoryId] };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;
  if (!isLocale(locale) || !isCategory(category)) notFound();
  const typedLocale = locale as Locale;
  const typedCategory = category as CategoryId;
  const t = copy[typedLocale];
  const cases = getCasesByCategory(typedCategory);

  return (
    <GalleryShell locale={typedLocale} active={typedCategory}>
      <section className={`archive-hero archive-hero-${typedCategory}`}>
        <Link className="archive-back" href={`/${typedLocale}`}>
          <ArrowLeftIcon />
          {t.home}
        </Link>
        <p className="eyebrow">{t.archive}</p>
        <h1>{t.categories[typedCategory]}</h1>
        <p>{t.categoryDescriptions[typedCategory]}</p>
      </section>

      <section className="archive-cases">
        {cases.length === 0 ? (
          <div className="empty-state">{t.noCases}</div>
        ) : (
          <div className="case-grid">
            {cases.map((item, index) => (
              <CaseCard
                key={item.slug}
                item={item}
                locale={typedLocale}
                index={index}
                priority={index < 2}
              />
            ))}
          </div>
        )}
      </section>
    </GalleryShell>
  );
}
