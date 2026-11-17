import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDocumentTitle } from "../hooks";
import { useWatchlist } from "../context/WatchlistContext";
import { PageHeader } from "../components/PageHeader";
import { MediaGrid } from "../components/MediaGrid";
import { EmptyState } from "../components/EmptyState";
import { ChevronDownIcon, TrashIcon } from "../components/icons";
import { pluralize } from "../lib/utils";

const STATUS_OPTIONS = [
  { value: "all", label: "All saved" },
  { value: "unwatched", label: "To watch" },
  { value: "watched", label: "Watched" },
];

export default function Watchlist() {
  useDocumentTitle("Watchlist");
  const { entries, count, watchedCount, unwatchedCount, toggleWatched, clear } = useWatchlist();
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const [sort, setSort] = useState("added");
  const [confirmingClear, setConfirmingClear] = useState(false);

  useEffect(() => {
    if (!confirmingClear) return undefined;
    const timer = window.setTimeout(() => setConfirmingClear(false), 5000);
    return () => window.clearTimeout(timer);
  }, [confirmingClear]);

  const visible = useMemo(() => {
    let list = entries.map((entry) => ({ ...entry.title, watched: entry.watched, addedAt: entry.addedAt }));

    if (status === "watched") list = list.filter((title) => title.watched);
    if (status === "unwatched") list = list.filter((title) => !title.watched);
    if (type !== "all") list = list.filter((title) => title.type === type);

    return list.sort((a, b) => {
      if (sort === "rating") return (b.rating || 0) - (a.rating || 0);
      if (sort === "title") return a.title.localeCompare(b.title);
      if (sort === "year") return b.startYear - a.startYear;
      return new Date(b.addedAt) - new Date(a.addedAt);
    });
  }, [entries, status, type, sort]);

  const progress = count ? Math.round((watchedCount / count) * 100) : 0;
  const hasFilters = status !== "all" || type !== "all";

  return (
    <div className="page">
      <PageHeader
        eyebrow="Your collection"
        title="Watchlist"
        description={
          count
            ? `${pluralize(count, "title")} saved in this browser. Mark things as watched as you go — nothing is sent anywhere.`
            : "Save films and series as you browse, then come back when you are ready to choose. No account needed."
        }
      >
        {count ? (
          <div className="watchlist-progress">
            <div className="watchlist-progress__numbers">
              <strong>{watchedCount}</strong>
              <span>of {count} watched</span>
            </div>
            <div
              className="watchlist-progress__bar"
              role="progressbar"
              aria-valuenow={watchedCount}
              aria-valuemin={0}
              aria-valuemax={count}
              aria-label="Watchlist completion"
            >
              <span style={{ width: `${progress}%` }} />
            </div>
          </div>
        ) : null}
      </PageHeader>

      <div className="container page__body">
        {!count ? (
          <EmptyState
            title="Your watchlist is empty"
            description="Use the bookmark button on any film or series to save it here. Your list will be waiting after a refresh."
            action="Browse films"
            to="/movies"
          />
        ) : (
          <>
            <div className="watchlist-toolbar">
              <div className="segmented" role="group" aria-label="Filter by watch status">
                {STATUS_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={status === option.value ? "is-active" : ""}
                    aria-pressed={status === option.value}
                    onClick={() => setStatus(option.value)}
                  >
                    {option.label}
                    <span className="segmented__count">
                      {option.value === "all" ? count : option.value === "watched" ? watchedCount : unwatchedCount}
                    </span>
                  </button>
                ))}
              </div>

              <div className="watchlist-toolbar__right">
                <label className="select">
                  <span className="sr-only">Filter by type</span>
                  <select value={type} onChange={(event) => setType(event.target.value)} aria-label="Filter by type">
                    <option value="all">All types</option>
                    <option value="movie">Films</option>
                    <option value="series">Series</option>
                  </select>
                  <ChevronDownIcon size={15} className="select__chevron" />
                </label>

                <label className="select">
                  <span className="sr-only">Sort watchlist</span>
                  <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort watchlist">
                    <option value="added">Recently added</option>
                    <option value="title">A to Z</option>
                    <option value="rating">Highest rated</option>
                    <option value="year">Newest release</option>
                  </select>
                  <ChevronDownIcon size={15} className="select__chevron" />
                </label>

                <button
                  type="button"
                  className={`watchlist-clear ${confirmingClear ? "is-confirming" : ""}`}
                  onClick={() => {
                    if (confirmingClear) {
                      clear();
                      setConfirmingClear(false);
                    } else {
                      setConfirmingClear(true);
                    }
                  }}
                >
                  <TrashIcon size={15} />
                  {confirmingClear ? "Confirm clear" : "Clear list"}
                </button>
              </div>
            </div>

            <p className="watchlist-count" aria-live="polite">
              Showing {visible.length} of {count} saved titles
            </p>

            {visible.length ? (
              <MediaGrid items={visible} onToggleWatched={toggleWatched} />
            ) : (
              <EmptyState
                title="Nothing in this view"
                description="Your watchlist has titles, but none match this status and type combination."
                action="Reset filters"
                onAction={() => {
                  setStatus("all");
                  setType("all");
                }}
              />
            )}

            <div className="watchlist-footnote">
              <p>
                Not sure what to start? <Link to="/discover">Let us suggest something</Link> or{" "}
                <Link to="/search?sort=rating">see the highest-rated titles</Link>.
              </p>
              {hasFilters ? (
                <button
                  type="button"
                  className="text-link"
                  onClick={() => {
                    setStatus("all");
                    setType("all");
                  }}
                >
                  Clear filters
                </button>
              ) : null}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
