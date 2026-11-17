import { ChevronDownIcon, CloseIcon, FilterIcon, SearchIcon } from "./icons";

const SORTS = [
  { value: "popularity", label: "Most popular" },
  { value: "rating", label: "Highest rated" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "az", label: "A to Z" },
];

function Select({ label, value, onChange, options, allLabel }) {
  return (
    <label className="select">
      <span className="sr-only">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} aria-label={label}>
        {allLabel ? <option value="all">{allLabel}</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDownIcon size={15} className="select__chevron" />
    </label>
  );
}

export function FilterBar({
  filters,
  onChange,
  onReset,
  lockedType,
  showSearch = true,
  resultCount,
  totalCount,
  genres,
  years,
  decades,
}) {
  const activeFilters =
    Boolean(filters.query) ||
    (filters.genre && filters.genre !== "all") ||
    (filters.year && filters.year !== "all") ||
    (filters.decade && filters.decade !== "all") ||
    (!lockedType && filters.type && filters.type !== "all") ||
    (filters.sort && filters.sort !== "popularity");

  return (
    <div className="filter-bar">
      <div className="filter-bar__main">
        {showSearch ? (
          <label className="filter-search">
            <SearchIcon size={17} className="filter-search__icon" />
            <span className="sr-only">Search the catalogue</span>
            <input
              type="search"
              value={filters.query}
              onChange={(event) => onChange({ query: event.target.value })}
              placeholder="Search titles, people, genres…"
              autoComplete="off"
              spellCheck="false"
            />
            {filters.query ? (
              <button
                type="button"
                className="filter-search__clear"
                onClick={() => onChange({ query: "" })}
                aria-label="Clear search"
              >
                <CloseIcon size={14} />
              </button>
            ) : null}
          </label>
        ) : null}

        {!lockedType ? (
          <div className="segmented" role="group" aria-label="Filter by type">
            {[
              { value: "all", label: "All" },
              { value: "movie", label: "Films" },
              { value: "series", label: "Series" },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                className={filters.type === option.value ? "is-active" : ""}
                aria-pressed={filters.type === option.value}
                onClick={() => onChange({ type: option.value })}
              >
                {option.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="filter-bar__selects">
        <span className="filter-bar__icon" aria-hidden="true">
          <FilterIcon size={15} />
        </span>

        <Select
          label="Filter by genre"
          allLabel="All genres"
          value={filters.genre}
          onChange={(genre) => onChange({ genre })}
          options={genres.map((genre) => ({ value: genre, label: genre }))}
        />

        <Select
          label="Filter by decade"
          allLabel="All decades"
          value={filters.decade}
          onChange={(decade) => onChange({ decade })}
          options={decades.map((entry) => ({ value: String(entry.decade), label: entry.label }))}
        />

        <Select
          label="Filter by year"
          allLabel="All years"
          value={filters.year}
          onChange={(year) => onChange({ year })}
          options={years.map((year) => ({ value: String(year), label: String(year) }))}
        />

        <Select
          label="Sort results"
          value={filters.sort}
          onChange={(sort) => onChange({ sort })}
          options={SORTS}
        />

        {activeFilters ? (
          <button type="button" className="filter-bar__reset" onClick={onReset}>
            <CloseIcon size={13} />
            Clear
          </button>
        ) : null}
      </div>

      <p className="filter-bar__count" aria-live="polite">
        <strong>{resultCount}</strong>
        <span> of {totalCount} titles</span>
      </p>
    </div>
  );
}
