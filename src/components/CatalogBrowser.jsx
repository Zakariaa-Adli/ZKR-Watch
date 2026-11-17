import { useSearchParams } from "react-router-dom";
import { decades, filterTitles, genres, titles, years } from "../data";
import { EmptyState } from "./EmptyState";
import { FilterBar } from "./FilterBar";
import { MediaGrid } from "./MediaGrid";

const VALID_TYPES = new Set(["movie", "series"]);

export function CatalogBrowser({ lockedType = null, showSearch = true }) {
  const [params, setParams] = useSearchParams();

  const typeFromUrl = params.get("type");
  const filters = {
    type: lockedType ?? (VALID_TYPES.has(typeFromUrl) ? typeFromUrl : "all"),
    genre: params.get("genre") || "all",
    year: params.get("year") || "all",
    decade: params.get("decade") || "all",
    sort: params.get("sort") || "popularity",
    query: params.get("q") || "",
  };

  const pool = lockedType ? titles.filter((title) => title.type === lockedType) : titles;
  const results = filterTitles(filters);

  const onChange = (patch) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([key, value]) => {
      const isDefault =
        !value ||
        value === "all" ||
        (key === "sort" && value === "popularity") ||
        (key === "type" && value === "all");
      if (isDefault) next.delete(key);
      else next.set(key, value);
    });
    setParams(next, { replace: true });
  };

  const onReset = () => setParams(new URLSearchParams(), { replace: true });

  return (
    <div className="catalog-browser">
      <FilterBar
        filters={filters}
        onChange={onChange}
        onReset={onReset}
        lockedType={lockedType}
        showSearch={showSearch}
        resultCount={results.length}
        totalCount={pool.length}
        genres={genres}
        years={years}
        decades={decades}
      />

      {results.length ? (
        <MediaGrid items={results} />
      ) : (
        <EmptyState
          icon="search"
          title="No titles match those filters"
          description="Try a different genre or year, or clear the filters to see the full catalogue."
          action="Clear filters"
          onAction={onReset}
        />
      )}
    </div>
  );
}
