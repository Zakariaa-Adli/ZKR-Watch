import { useEffect, useState } from "react";
import { cx } from "../lib/utils";

function useArtworkSource(title, { poster = false, small = true } = {}) {
  const primary = poster
    ? small
      ? title.posterSmall || title.poster
      : title.poster || title.posterSmall
    : small
      ? title.backdropSmall || title.backdrop
      : title.backdrop || title.backdropSmall;

  const secondary = poster ? title.poster : title.backdrop;

  const [src, setSrc] = useState(primary);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setSrc(primary);
    setFailed(false);
  }, [primary, title.id]);

  const onError = () => {
    if (secondary && src !== secondary) {
      setSrc(secondary);
      return;
    }
    setFailed(true);
  };

  return { src, failed, onError };
}

export function Poster({ title, className, small = true, priority = false }) {
  const { src, failed, onError } = useArtworkSource(title, { poster: true, small });
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={cx("poster", className)}>
      {!failed && src ? (
        <img
          className={cx("poster__img", loaded && "is-loaded")}
          src={src}
          alt={`${title.title} poster`}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={onError}
        />
      ) : (
        <div className="poster__fallback" aria-hidden="true">
          <span>{title.title}</span>
          <small>{title.startYear}</small>
        </div>
      )}
    </div>
  );
}

export function Backdrop({ title, className, small = false, priority = false }) {
  const { src, failed, onError } = useArtworkSource(title, { poster: false, small });
  const [loaded, setLoaded] = useState(false);

  if (failed || !src) {
    return <div className={cx("backdrop", "backdrop--fallback", className)} aria-hidden="true" />;
  }

  return (
    <div className={cx("backdrop", className)}>
      <img
        className={cx("backdrop__img", loaded && "is-loaded")}
        src={src}
        alt=""
        aria-hidden="true"
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={onError}
      />
    </div>
  );
}
