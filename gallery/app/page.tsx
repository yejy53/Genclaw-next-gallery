import { basePath } from "@/lib/gallery";

// A static export cannot rely on redirect(), which only resolves client-side
// and drops the base path. A meta refresh keeps the root entry working on
// GitHub Pages, including without JavaScript.
const target = `${basePath}/zh/`;

export default function Home() {
  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=${target}`} />
      <div className="root-redirect">
        <a href={target}>GenClaw-Next →</a>
      </div>
    </>
  );
}
