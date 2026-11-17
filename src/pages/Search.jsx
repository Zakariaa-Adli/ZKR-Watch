import { Link, useSearchParams } from "react-router-dom";
import {
  catalogMeta,
  collections,
  decades,
  filterTitles,
  genres,
  years,
} from "../data";
import { SEARCH_SUGGESTIONS } from "../data/curations";
import { useDocumentTitle } from "../hooks";
import { PageHeader } from "../components/PageHeader";
import { FilterBar } from "../components/FilterBar";
import { MediaGrid } from "../components/MediaGrid";
import { MediaRow } from "../components/MediaRow";
import { EmptyState } from "../components/EmptyState";
import { CloseIcon, SearchIcon } from "../components/icons";

export default function Search() {
  useDocumentTitle("Search");
  const [params, setParams] = useSearchParams();

  const filters = {
    type: params.get("type") || "all",
    genre: params.get("genre") || "all",
    year: params.get("year") || "all",
    decade: params.get("decade") || "all",
    sort: params.get("sort") || "popularity",
    query: params.get("q") || "",
  };

  const hasQuery =
    Boolean(filters.query.trim()) ||
    filters.genre !== "all" ||
    filters.year !== "all" ||
    filters.decade !== "all" ||
    filters.type !== "all" ||
    filters.sort !== "popularity";

  const results = hasQuery ? filterTitles(filters) : [];

  const onChange = (patch) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([key, value]) => {
      const isDefault = !value || value === "all" || (key === "sort" && value === "popularity");
      if (isDefault) next.delete(key);
      else next.set(key, value);
    });
    setParams(next, { replace: true });
  };

  const clearFilters = () => {
    const next = new URLSearchParams();
    if (filters.query.trim()) next.set("q", filters.query.trim());
    setParams(next, { replace: true });
  };

  const resetAll = () => setParams(new URLSearchParams(), { replace: true });

  return (
    <div className="page page--search">
      <PageHeader
        eyebrow="Search & filter"
        title="Search the collection"
        description="Look up a title, a director, a cast member, a genre or a country. Results update as you type."
      />

      <div className="container page__body">
        <form className="search-hero" role="search" onSubmit={(event) => event.preventDefault()}>
          <SearchIcon size={24} className="search-hero__icon" />
          <input
            type="search"
            value={filters.query}
            onChange={(event) => onChange({ q: event.target.value })}
            placeholder="Try “Parasite”, “Nolan”, “Korea” or “Animation”"
            aria-label="Search films and series"
            autoComplete="off"
            spellCheck="false"
          />
          {filters.query ? (
            <button
              type="button"
              className="icon-button"
              onClick={() => onChange({ q: "" })}
              aria-label="Clear search"
            >
              <CloseIcon size={18} />
            </button>
          ) : null}
        </form>

        {hasQuery ? (
          <>
            <FilterBar
              filters={{ ...filters, query: "" }}
              onChange={onChange}
              onReset={clearFilters}
              showSearch={false}
              resultCount={results.length}
              totalCount={catalogMeta.total}
              genres={genres}
              years={years}
              decades={decades}
            />

            {results.length ? (
              <MediaGrid items={results} />
            ) : (
              <EmptyState
                icon="search"
                title="No matches"
                description="Nothing in the collection matches that search. Try a shorter phrase, another spelling or a genre."
                action="Clear search"
                onAction={resetAll}
              />
            )}
          </>
        ) : (
          <div className="search-landing">
            <section className="search-landing__block">
              <p className="eyebrow">Popular searches</p>
              <div className="search-landing__chips">
                {SEARCH_SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    className="chip"
                    onClick={() => onChange({ q: suggestion })}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </section>

            <section className="search-landing__block">
              <p className="eyebrow">Browse by genre</p>
              <div className="search-landing__chips">
                {genres.map((genre) => (
                  <Link key={genre} className="chip chip--link" to={`/search?genre=${encodeURIComponent(genre)}`}>
                    {genre}
                  </Link>
                ))}
              </div>
            </section>

            <MediaRow
              eyebrow="A good place to start"
              title="The highest rated"
              items={collections.topRated}
              to="/search?sort=rating"
              actionLabel="All ratings"
            />
          </div>
        )}
      </div>
    </div>
  );
}
