import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { formatYearRange, getTypeLabel, searchTitles } from "../data";
import { SEARCH_SUGGESTIONS } from "../data/curations";
import { useBodyLock, useEscapeKey } from "../hooks";
import { Poster } from "./Artwork";
import { ArrowUpRightIcon, CloseIcon, SearchIcon } from "./icons";

export function SearchOverlay({ open, onClose }) {
  const inputRef = useRef(null);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  useBodyLock(open);
  useEscapeKey(onClose, open);

  const trimmed = query.trim();
  const results = trimmed ? searchTitles(trimmed).slice(0, 7) : [];
  const total = trimmed ? searchTitles(trimmed).length : 0;

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActiveIndex(0);
    const timer = window.setTimeout(() => inputRef.current?.focus(), 40);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [trimmed]);

  if (!open || typeof document === "undefined") return null;

  const goToTitle = (id) => {
    onClose();
    navigate(`/title/${id}`);
  };

  const goToResults = () => {
    if (!trimmed) return;
    onClose();
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => (results.length ? (current + 1) % results.length : 0));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => (results.length ? (current - 1 + results.length) % results.length : 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (results[activeIndex]) goToTitle(results[activeIndex].id);
      else goToResults();
    }
  };

  return createPortal(
    <div
      className="search-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Search ZKR Watch"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="search-panel">
        <div className="search-panel__input-row">
          <SearchIcon size={22} className="search-panel__icon" />
          <input
            ref={inputRef}
            className="search-panel__input"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search films, series, directors, cast…"
            aria-label="Search films and series"
            autoComplete="off"
            spellCheck="false"
          />
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close search">
            <CloseIcon size={20} />
          </button>
        </div>

        {trimmed ? (
          <div className="search-panel__body">
            {results.length ? (
              <>
                <p className="search-panel__label">
                  {total} result{total === 1 ? "" : "s"}
                </p>
                <ul className="search-results">
                  {results.map((title, index) => (
                    <li key={title.id}>
                      <button
                        type="button"
                        className={`search-result ${index === activeIndex ? "is-active" : ""}`}
                        onClick={() => goToTitle(title.id)}
                        onMouseEnter={() => setActiveIndex(index)}
                      >
                        <Poster title={title} className="search-result__poster" small />
                        <span className="search-result__text">
                          <span className="search-result__title">{title.title}</span>
                          <span className="search-result__meta">
                            {getTypeLabel(title.type)} · {formatYearRange(title)}
                            {title.rating ? ` · ${title.rating}` : ""}
                          </span>
                        </span>
                        <ArrowUpRightIcon size={17} className="search-result__arrow" />
                      </button>
                    </li>
                  ))}
                </ul>
                <button type="button" className="search-panel__all" onClick={goToResults}>
                  See all results for “{trimmed}”
                  <ArrowUpRightIcon size={15} />
                </button>
              </>
            ) : (
              <div className="search-panel__empty">
                <p>No titles match “{trimmed}”.</p>
                <span>Try a genre, a director, or a shorter phrase.</span>
              </div>
            )}
          </div>
        ) : (
          <div className="search-panel__body">
            <p className="search-panel__label">Try searching for</p>
            <div className="search-panel__suggestions">
              {SEARCH_SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  className="chip"
                  onClick={() => setQuery(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
            <p className="search-panel__hint">
              Search by title, genre, cast, director or country. Press <kbd>Esc</kbd> to close.
            </p>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
