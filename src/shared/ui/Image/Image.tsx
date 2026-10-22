import { useRef, useState, useEffect } from "react";
import type { CSSProperties, HTMLAttributes } from "react";

import clsx from "clsx";

import { skeletonAnimation } from "@/shared/styles";

import * as styles from "./Image.css";

export type ImageSource = {
  url: string;
  width?: number;
  height?: number;
};

export type ImageProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "onLoad" | "onError" | "children"
> & {
  alt?: string;
  image: ImageSource;
  preview?: ImageSource;
  onLoad?: VoidFunction;
  onError?: VoidFunction;
  imageClassName?: string;
  loading?: "lazy" | "eager";
};

type ImageStatus = "error" | "loaded" | "preview" | "loading";

export function Image({
  image,
  style,
  onLoad,
  preview,
  onError,
  alt = "",
  className,
  imageClassName,
  loading = "lazy",
  ...props
}: ImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onLoadRef = useRef(onLoad);
  const onErrorRef = useRef(onError);
  const imageUrl = image.url;
  const previewUrl = preview?.url ?? "";
  const [isNearViewport, setIsNearViewport] = useState(loading === "eager");
  const [status, setStatus] = useState<ImageStatus>(
    previewUrl ? "preview" : "loading",
  );

  useEffect(() => {
    onLoadRef.current = onLoad;
    onErrorRef.current = onError;
  }, [onError, onLoad]);

  useEffect(() => {
    setStatus(previewUrl ? "preview" : "loading");
    setIsNearViewport(loading === "eager");
  }, [imageUrl, loading, previewUrl]);

  useEffect(() => {
    if (isNearViewport || loading === "eager") {
      return;
    }

    const element = containerRef.current;

    if (!element) {
      return;
    }

    if (!("IntersectionObserver" in window)) {
      setIsNearViewport(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [isNearViewport, loading]);

  useEffect(() => {
    if (!isNearViewport || !imageUrl) {
      return;
    }

    let cancelled = false;
    const preloadImage = new window.Image();
    setStatus("loading");

    const handleLoad = () => {
      if (cancelled) {
        return;
      }

      setStatus("loaded");
      onLoadRef.current?.();
    };
    const handleError = () => {
      if (cancelled) {
        return;
      }

      setStatus("error");
      onErrorRef.current?.();
    };

    preloadImage.onload = handleLoad;
    preloadImage.onerror = handleError;
    preloadImage.src = imageUrl;

    if (preloadImage.complete) {
      if (preloadImage.naturalWidth > 0) {
        handleLoad();
      } else {
        handleError();
      }
    }

    return () => {
      cancelled = true;
      preloadImage.onload = null;
      preloadImage.onerror = null;
    };
  }, [imageUrl, isNearViewport]);

  const displayedUrl =
    status === "loaded"
      ? imageUrl
      : previewUrl || (status === "error" || !isNearViewport ? "" : imageUrl);
  const width = image.width ?? preview?.width;
  const height = image.height ?? preview?.height;
  const imageStyle: CSSProperties = {
    ...style,
    aspectRatio: width && height ? `${width} / ${height}` : style?.aspectRatio,
  };

  return (
    <div
      {...props}
      ref={containerRef}
      style={imageStyle}
      className={clsx(styles.root, className)}
    >
      {displayedUrl && (
        <img
          alt={alt}
          width={width}
          height={height}
          decoding="async"
          loading={loading}
          src={displayedUrl}
          className={clsx(styles.image, imageClassName, {
            [styles.previewImage]: status !== "loaded",
          })}
        />
      )}
      {status === "loading" && !previewUrl && (
        <div className={clsx(styles.loading, skeletonAnimation)} />
      )}
    </div>
  );
}
