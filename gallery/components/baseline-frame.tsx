"use client";

import { useEffect, useRef, useState } from "react";

// The comparison column is far narrower than the pages it shows, so the frame
// renders at a desktop width and is scaled down whole. Pointer events stay on
// it, which is what makes the comparison clickable rather than a flat picture;
// the panel header carries a link for interacting at full size.
const LOGICAL_WIDTH = 1280;
const LOGICAL_HEIGHT = 900;

export function BaselineFrame({ src, title }: { src: string; title: string }) {
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

  const scale = width > 0 ? width / LOGICAL_WIDTH : 0;

  return (
    <div
      className="wb-baseline-live"
      ref={ref}
      style={{ height: scale > 0 ? LOGICAL_HEIGHT * scale : undefined }}
    >
      {width > 0 && (
        <iframe
          src={src}
          title={title}
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-popups"
          style={{
            width: LOGICAL_WIDTH,
            height: LOGICAL_HEIGHT,
            transform: `scale(${scale})`,
          }}
        />
      )}
    </div>
  );
}
