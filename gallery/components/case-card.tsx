import Image from "next/image";
import Link from "next/link";
import {
  assetUrl,
  copy,
  localize,
  type GalleryCase,
  type Locale,
} from "@/lib/gallery";
import { ArrowUpRightIcon } from "@/components/icons";

type CaseCardProps = {
  item: GalleryCase;
  locale: Locale;
  index: number;
  priority?: boolean;
};

export function CaseCard({ item, locale, index, priority }: CaseCardProps) {
  const t = copy[locale];
  const href = `/${locale}/cases/${item.slug}`;
  return (
    <article className="case-card">
      <Link className="case-card-media-link" href={href}>
        <div className={`case-card-media aspect-${item.coverAspect}`}>
          <Image
            alt={localize(item.title, locale)}
            fill
            priority={priority}
            sizes="(max-width: 620px) 100vw, (max-width: 1080px) 50vw, 34vw"
            src={assetUrl(item.cover)}
          />
          <span className="case-card-open">
            <span>{t.viewCase}</span>
            <ArrowUpRightIcon />
          </span>
        </div>
      </Link>
      <div className="case-card-meta">
        <p className="case-card-kicker">
          {String(index + 1).padStart(2, "0")}
          <span>·</span>
          {t.categories[item.category]}
        </p>
        <h3>
          <Link href={href}>{localize(item.title, locale)}</Link>
        </h3>
        <p className="case-card-summary">{localize(item.summary, locale)}</p>
      </div>
    </article>
  );
}
