import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  assetUrl,
  categoryIds,
  copy,
  galleryCases,
  localize,
  type CategoryId,
  type Locale,
} from "@/lib/gallery";
import {
  GalleryIcon,
  HomeIcon,
  MenuIcon,
  SearchIcon,
  categoryIcon,
} from "@/components/icons";
import { LanguageSwitch } from "@/components/language-switch";

type GalleryShellProps = {
  locale: Locale;
  active?: "home" | CategoryId;
  activeSlug?: string;
  children: ReactNode;
};

function NavContent({
  locale,
  active,
  activeSlug,
}: {
  locale: Locale;
  active?: "home" | CategoryId;
  activeSlug?: string;
}) {
  const t = copy[locale];
  return (
    <>
      <nav
        aria-label={locale === "zh" ? "主要导航" : "Primary"}
        className="sidebar-nav"
      >
        <Link
          className={`nav-link${active === "home" ? " is-active" : ""}`}
          href={`/${locale}`}
        >
          <HomeIcon size={15} />
          <span>{t.home}</span>
        </Link>
        <Link className="nav-link" href={`/${locale}#cat-web`}>
          <GalleryIcon size={15} />
          <span>{t.gallery}</span>
        </Link>
      </nav>

      <div className="nav-label">{t.archive}</div>
      <nav aria-label={t.archive} className="sidebar-nav">
        {categoryIds.map((id) => (
          <Link
            key={id}
            className={`nav-link${active === id ? " is-active" : ""}`}
            href={`/${locale}#cat-${id}`}
          >
            <span className={`nav-glyph nav-glyph-${id}`}>{categoryIcon(id)}</span>
            <span>{t.categories[id]}</span>
          </Link>
        ))}
      </nav>

      <div className="nav-label">{t.casesLabel}</div>
      <nav aria-label={t.casesLabel} className="sidebar-nav">
        {categoryIds
          .map(
            (id) =>
              galleryCases.find(
                (item) => item.category === id && item.featured
              ) ?? galleryCases.find((item) => item.category === id)
          )
          .filter((item): item is (typeof galleryCases)[number] => Boolean(item))
          .map((item) => (
            <Link
              key={item.slug}
              className={`nav-link nav-link-case${
                activeSlug === item.slug || active === item.category
                  ? " is-active"
                  : ""
              }`}
              href={`/${locale}/cases/${item.slug}`}
            >
              <span className="nav-thumb">
                <Image alt="" fill sizes="24px" src={assetUrl(item.cover)} />
              </span>
              <span>{localize(item.title, locale)}</span>
            </Link>
          ))}
      </nav>
    </>
  );
}

export function GalleryShell({
  locale,
  active,
  activeSlug,
  children,
}: GalleryShellProps) {
  const t = copy[locale];
  return (
    <div className={`site-shell locale-${locale}`}>
      <aside className="sidebar">
        <Link
          className="wordmark"
          href={`/${locale}`}
          aria-label="GenClaw-Next Visual Archive"
        >
          <span className="wordmark-mark">GN</span>
          <span>
            GenClaw-Next
            <small>Visual Archive</small>
          </span>
        </Link>
        <div className="sidebar-search" aria-hidden="true">
          <SearchIcon />
          <input placeholder={t.searchPlaceholder} disabled />
        </div>
        <div className="sidebar-scroll">
          <NavContent locale={locale} active={active} activeSlug={activeSlug} />
        </div>
        <div className="sidebar-foot">
          <LanguageSwitch locale={locale} />
        </div>
      </aside>

      <header className="mobile-header">
        <Link className="wordmark wordmark-mobile" href={`/${locale}`}>
          <span className="wordmark-mark">GN</span>
          <span>GenClaw-Next</span>
        </Link>
        <details className="mobile-menu">
          <summary aria-label={locale === "zh" ? "打开导航" : "Open navigation"}>
            <MenuIcon />
          </summary>
          <div className="mobile-menu-panel">
            <NavContent locale={locale} active={active} activeSlug={activeSlug} />
            <div className="sidebar-foot">
              <LanguageSwitch locale={locale} />
            </div>
          </div>
        </details>
      </header>

      <main className="site-main">{children}</main>
    </div>
  );
}
