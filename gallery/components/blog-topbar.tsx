import Link from "next/link";
import { copy, type Locale } from "@/lib/gallery";
import { LanguageSwitch } from "@/components/language-switch";

export function BlogTopBar({
  locale,
  active,
}: {
  locale: Locale;
  active?: "research";
}) {
  const t = copy[locale];
  return (
    <header className="blog-topbar">
      <div className="blog-topbar-inner">
        <Link className="blog-wordmark" href={`/${locale}`}>
          <span className="blog-wordmark-mark">GN</span>
          <span>GenClaw-Next</span>
        </Link>
        <nav className="blog-topbar-links" aria-label={t.research}>
          <Link
            className={active === "research" ? "is-active" : undefined}
            href={`/${locale}/blog`}
          >
            {t.research}
          </Link>
          <Link href={`/${locale}`}>{t.archive}</Link>
          <LanguageSwitch locale={locale} />
        </nav>
      </div>
    </header>
  );
}
