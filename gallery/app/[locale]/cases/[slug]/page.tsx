import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  assetUrl,
  copy,
  galleryCases,
  getCase,
  isLocale,
  locales,
  localize,
  type Locale,
} from "@/lib/gallery";
import { GalleryShell } from "@/components/gallery-shell";
import { ResultStage } from "@/components/result-viewer";
import { ArrowLeftIcon } from "@/components/icons";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    galleryCases.map((item) => ({ locale, slug: item.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const item = getCase(slug);
  if (!isLocale(locale) || !item) return {};
  return { title: localize(item.title, locale as Locale) };
}

export default async function CasePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const item = getCase(slug);
  if (!isLocale(locale) || !item) notFound();
  const typedLocale = locale as Locale;
  const t = copy[typedLocale];

  const translation = item.prompt ? localize(item.prompt, typedLocale) : null;
  const showTranslation = translation && translation !== item.promptOriginal;
  const baseline = item.baseline;

  return (
    <GalleryShell locale={typedLocale} active={item.category} activeSlug={item.slug}>
      <article className="case-detail">
        <header className="case-detail-head">
          <Link
            className="archive-back"
            href={`/${typedLocale}#cat-${item.category}`}
          >
            <ArrowLeftIcon />
            {t.categories[item.category]}
          </Link>
          <p className="eyebrow">
            {item.year} · {t.categories[item.category]}
          </p>
          <h1>{localize(item.title, typedLocale)}</h1>
          <p>{localize(item.summary, typedLocale)}</p>
        </header>

        <div className="workbench">
          <section className="wb-main" aria-label={t.ourResult}>
            <div className="wb-panel-head">
              <span className="result-status-dot" aria-hidden="true" />
              <h2>{t.ourResult}</h2>
            </div>
            <ResultStage
              results={item.results}
              locale={typedLocale}
              category={item.category}
            />
          </section>

          <aside className="wb-side">
            <section className="wb-panel wb-prompt">
              <div className="wb-panel-head">
                <h2>{t.prompt}</h2>
              </div>
              <div className="wb-prompt-body">
                {item.promptOriginal.trim() ? (
                  <>
                    <p className="wb-prompt-text">{item.promptOriginal}</p>
                    {showTranslation && (
                      <p className="wb-prompt-translation">{translation}</p>
                    )}
                  </>
                ) : (
                  <p className="wb-prompt-empty">{t.noPrompt}</p>
                )}
                <div className="tag-list tag-list-left">
                  {item.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </section>

            <section className="wb-panel wb-baseline">
              <div className="wb-panel-head">
                <h2>{t.codingAgent}</h2>
              </div>
              {baseline ? (
                <div className="wb-baseline-body">
                  {baseline.kind === "html" ? (
                    <iframe
                      className="wb-baseline-frame"
                      src={assetUrl(baseline.artifact)}
                      title={baseline.producer}
                      loading="lazy"
                      sandbox="allow-scripts allow-same-origin"
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      className="wb-baseline-image"
                      alt={baseline.producer}
                      src={assetUrl(baseline.preview ?? baseline.artifact)}
                    />
                  )}
                  {baseline.note && (
                    <p className="wb-baseline-note">
                      {localize(baseline.note, typedLocale)}
                    </p>
                  )}
                </div>
              ) : (
                <div className="wb-baseline-empty">
                  <span className="wb-baseline-empty-mark">/</span>
                  <p>{t.noBaseline}</p>
                </div>
              )}
            </section>
          </aside>
        </div>
      </article>
    </GalleryShell>
  );
}
