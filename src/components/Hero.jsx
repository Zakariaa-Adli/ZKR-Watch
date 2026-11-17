import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatRating, formatRuntime, formatYearRange, getTypeLabel } from "../data";
import { useTrailer } from "../context/TrailerContext";
import { useWatchlist } from "../context/WatchlistContext";
import { Backdrop } from "./Artwork";
import { BookmarkIcon, PlayIcon, StarIcon } from "./icons";

export function Hero({ items }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const { openTrailer } = useTrailer();
  const { isSaved, toggle } = useWatchlist();

  const item = items[index] ?? items[0];

  useEffect(() => {
    if (items.length < 2 || paused) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % items.length);
    }, 9000);
    return () => window.clearInterval(timer);
  }, [items.length, paused, index]);

  if (!item) return null;

  const saved = isSaved(item.id);
  const runtime = formatRuntime(item.runtime);
  const meta = [
    getTypeLabel(item.type),
    formatYearRange(item),
    item.type === "series" ? `${item.seasons} season${item.seasons === 1 ? "" : "s"}` : runtime,
  ].filter(Boolean);

  return (
    <section
      className="hero"
      aria-roledescription="carousel"
      aria-label="Featured titles"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="hero__media" key={item.id}>
        <Backdrop title={item} priority />
      </div>
      <div className="hero__scrim" aria-hidden="true" />

      <div className="container hero__inner">
        <div className="hero__content" key={`${item.id}-content`}>
          <p className="hero__eyebrow">
            <span className="hero__eyebrow-rule" aria-hidden="true" />
            Featured {item.type === "series" ? "series" : "film"}
          </p>
          <h1 className="hero__title">{item.title}</h1>

          <div className="hero__meta">
            {item.rating ? (
              <span className="hero__rating">
                <StarIcon size={14} />
                {formatRating(item.rating)}
              </span>
            ) : null}
            {meta.map((part) => (
              <span key={part} className="hero__meta-item">
                {part}
              </span>
            ))}
            {item.genres.slice(0, 2).map((genre) => (
              <span key={genre} className="hero__meta-item">
                {genre}
              </span>
            ))}
          </div>

          <p className="hero__overview">{item.overview}</p>

          <div className="hero__actions">
            {item.trailer?.id ? (
              <button
                type="button"
                className="button button--light"
                onClick={() => openTrailer(item)}
              >
                <PlayIcon size={17} />
                Watch trailer
              </button>
            ) : null}
            <Link className="button button--ghost" to={`/title/${item.id}`}>
              View details
            </Link>
            <button
              type="button"
              className={`icon-button icon-button--large ${saved ? "is-active" : ""}`}
              onClick={() => toggle(item.id)}
              aria-pressed={saved}
              aria-label={saved ? `Remove ${item.title} from watchlist` : `Add ${item.title} to watchlist`}
              title={saved ? "In your watchlist" : "Add to watchlist"}
            >
              <BookmarkIcon size={19} filled={saved} />
            </button>
          </div>
        </div>
      </div>

      <div className="container hero__footer">
        <div className="hero__dots" role="tablist" aria-label="Featured titles">
          {items.map((entry, entryIndex) => (
            <button
              key={entry.id}
              type="button"
              role="tab"
              aria-selected={entryIndex === index}
              aria-label={`Show ${entry.title}`}
              className={`hero__dot ${entryIndex === index ? "is-active" : ""}`}
              onClick={() => setIndex(entryIndex)}
            >
              <span className="hero__dot-fill" />
            </button>
          ))}
        </div>
        <p className="hero__counter" aria-live="polite">
          <span>{String(index + 1).padStart(2, "0")}</span>
          <span className="hero__counter-divider">/</span>
          <span className="muted">{String(items.length).padStart(2, "0")}</span>
        </p>
      </div>
    </section>
  );
}
