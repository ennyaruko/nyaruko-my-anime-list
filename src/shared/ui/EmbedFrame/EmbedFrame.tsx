import { useRef, useState, useEffect } from "react";

import * as styles from "./EmbedFrame.css";

export function EmbedFrame({
  src,
  title,
  sandbox = "allow-scripts allow-same-origin allow-forms allow-presentation",
}: {
  src: string;
  title: string;
  sandbox?: null | string;
}) {
  const container = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ width: number; height: number }>();
  const needsSize = /:(width|height)\b/.test(src);
  useEffect(() => {
    const element = container.current;
    if (!needsSize || !element) return;
    let timer: ReturnType<typeof setTimeout>;
    const measure = () => {
      const rect = element.getBoundingClientRect();
      const width = Math.round(rect.width);
      const height = Math.round(rect.height);
      if (width && height)
        setSize((previous) =>
          previous?.width === width && previous.height === height
            ? previous
            : { width, height },
        );
    };
    measure();
    const observer = new ResizeObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(measure, 250);
    });
    observer.observe(element);
    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [needsSize]);
  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return null;
  }
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    (typeof location !== "undefined" && url.origin === location.origin)
  )
    return null;
  const resolvedSrc = needsSize
    ? size &&
      src
        .replaceAll(":width", String(size.width))
        .replaceAll(":height", String(size.height))
    : src;
  return (
    <div ref={container} className={styles.container}>
      {resolvedSrc && (
        <iframe
          title={title}
          allowFullScreen
          key={resolvedSrc}
          src={resolvedSrc}
          className={styles.frame}
          sandbox={sandbox ?? undefined}
          referrerPolicy="strict-origin-when-cross-origin"
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
        />
      )}
    </div>
  );
}
