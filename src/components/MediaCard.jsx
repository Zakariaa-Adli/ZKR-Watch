import { Link } from "react-router-dom";
import { formatRating, formatYearRange, getTypeLabel } from "../data";
import { cx } from "../lib/utils";
import { useTrailer } from "../context/TrailerContext";
import { useWatchlist } from "../context/WatchlistContext";
import { Poster } from "./Artwork";
import { BookmarkIcon, CheckIcon, PlayIcon } from "./icons";

export function MediaCard({ title, rank, watched, onToggleWatched, className, priority = false }) {
  const { isSaved, toggle } = useWatchlist();
  const { openTrailer } = useTrailer();
  const saved = isSaved(title.id);
  const isWatched = watched ?? false;
  const meta = [getTypeLabel(title.type), formatYearRange(title)].filter(Boolean).join(" · ");

  return (
    <article className={cx("media-card", className)}>
      <div className="media-card__art">
        <Link
          to={`/title/${title.id}`}
          className="media-card__poster-link"
          aria-label={`${title.title} (${formatYearRange(title)})`}
        >
          <Poster title={title} priority={priority} />
          {rank ? <span className="media-card__rank">{String(rank).padStart(2, "0")}</span> : null}
          {isWatched ? <span className="media-card__watched">Watched</span> : null}
        </Link>

        <div className="media-card__overlay">
          {title.trailer?.id ? (
            <button
              type="button"
              className="icon-button icon-button--solid"
              onClick={() => openTrailer(title)}
              aria-label={`Play trailer for ${title.title}`}
              title="Play trailer"
            >
              <PlayIcon size={16} />
            </button>
          ) : null}
          <button
            type="button"
            className={cx("icon-button", saved && "is-active")}
            onClick={() => toggle(title.id)}
            aria-label={saved ? `Remove ${title.title} from watchlist` : `Add ${title.title} to watchlist`}
            aria-pressed={saved}
            title={saved ? "In your watchlist" : "Add to watchlist"}
          >
            <BookmarkIcon size={16} filled={saved} />
          </button>
          {onToggleWatched ? (
            <button
              type="button"
              className={cx("icon-button", isWatched && "is-active")}
              onClick={() => onToggleWatched(title.id)}
              aria-label={isWatched ? `Mark ${title.title} as unwatched` : `Mark ${title.title} as watched`}
              aria-pressed={isWatched}
              title={isWatched ? "Watched" : "Mark watched"}
            >
              <CheckIcon size={16} />
            </button>
          ) : null}
        </div>
      </div>

      <div className="media-card__body">
        <Link to={`/title/${title.id}`} className="media-card__title">
          {title.title}
        </Link>
        <p className="media-card__meta">
          <span>{meta}</span>
          {title.rating ? (
            <>
              <span className="media-card__dot" aria-hidden="true" />
              <span className="media-card__rating">{formatRating(title.rating)}</span>
            </>
          ) : null}
        </p>
      </div>
    </article>
  );
}
