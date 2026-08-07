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
import { BaselineFrame } from "@/components/baseline-frame";
import { ArrowLeftIcon, ExpandIcon } from "@/components/icons";

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
  const hasPrompt = item.promptOriginal.trim().length > 0;
  const hasSide = hasPrompt || Boolean(baseline);

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
          <div className="tag-list tag-list-center">
            {item.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </header>

        <div className={hasSide ? "workbench" : "workbench workbench-solo"}>
          <section className="wb-main" aria-label={t.ourResult}>
            <div className="wb-panel-head">
              <span className="result-status-dot" aria-hidden="true" />
              <h2>{t.ourResult}</h2>
            </div>
            <ResultStage results={item.results} locale={typedLocale} />
          </section>

          {hasSide && (
            <aside className={baseline ? "wb-side" : "wb-side wb-side-compact"}>
              {hasPrompt && (
                <section className="wb-panel wb-prompt">
                  <div className="wb-panel-head">
                    <h2>{t.prompt}</h2>
                  </div>
                  <div className="wb-prompt-body">
                    <p className="wb-prompt-text">{item.promptOriginal}</p>
                    {showTranslation && (
                      <p className="wb-prompt-translation">{translation}</p>
                    )}
                  </div>
                </section>
              )}

              {baseline && (
                <section className="wb-panel wb-baseline">
                  <div className="wb-panel-head">
                    <h2>{t.codingAgent}</h2>
                    <span className="wb-panel-tag">{baseline.producer}</span>
                    {baseline.kind === "html" && (
                      <a
                        className="wb-panel-open"
                        href={assetUrl(baseline.artifact)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <ExpandIcon size={12} />
                        {t.openPreview}
                      </a>
                    )}
                  </div>
                  <div className="wb-baseline-body">
                    {baseline.kind === "html" ? (
                      <BaselineFrame
                        src={assetUrl(baseline.artifact)}
                        title={baseline.producer}
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
                </section>
              )}
            </aside>
          )}
        </div>
      </article>
    </GalleryShell>
  );
}
