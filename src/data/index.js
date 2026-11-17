import catalog from "./catalog.json";
import {
  FEATURED,
  POPULAR_MOVIES,
  POPULAR_SERIES,
  TRENDING,
  UPCOMING,
  GENRE_TILES,
} from "./curations";

export const titles = catalog.titles;
export const catalogMeta = {
  generatedAt: catalog.generatedAt,
  sources: catalog.sources,
  total: titles.length,
  movies: titles.filter((title) => title.type === "movie").length,
  series: titles.filter((title) => title.type === "series").length,
  firstYear: Math.min(...titles.map((title) => title.startYear)),
  lastYear: Math.max(...titles.map((title) => title.startYear)),
};

const byId = new Map(titles.map((title) => [title.id, title]));

export function getTitle(id) {
  return byId.get(id) ?? null;
}

export function getTitles(ids) {
  return ids.map(getTitle).filter(Boolean);
}

export const genres = [...new Set(titles.flatMap((title) => title.genres))].sort((a, b) =>
  a.localeCompare(b),
);

export const years = [...new Set(titles.map((title) => title.startYear).filter(Boolean))].sort(
  (a, b) => b - a,
);

function normalize(value = "") {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const searchIndex = new Map(
  titles.map((title) => [
    title.id,
    normalize(
      [
        title.title,
        title.originalTitle,
        title.year,
        title.genres.join(" "),
        title.overview,
        title.cast.map((member) => member.name).join(" "),
        title.director.join(" "),
        title.creators.join(" "),
        title.country,
        title.network,
      ]
        .filter(Boolean)
        .join(" "),
    ),
  ]),
);

export function searchTitles(query, options = {}) {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return filterTitles(options);

  const tokens = normalizedQuery.split(" ").filter(Boolean);
  return filterTitles(options).filter((title) => {
    const haystack = searchIndex.get(title.id) || "";
    return tokens.every((token) => haystack.includes(token));
  });
}

const SORTERS = {
  popularity: (a, b) => b.popularity - a.popularity || (b.rating || 0) - (a.rating || 0),
  rating: (a, b) => (b.rating || 0) - (a.rating || 0) || b.popularity - a.popularity,
  newest: (a, b) => new Date(b.releaseDate || 0) - new Date(a.releaseDate || 0),
  oldest: (a, b) => new Date(a.releaseDate || 0) - new Date(b.releaseDate || 0),
  az: (a, b) => a.title.localeCompare(b.title),
};

export function filterTitles({
  type = "all",
  genre = "all",
  year = "all",
  decade = "all",
  sort = "popularity",
  query = "",
} = {}) {
  let result = titles;

  if (type !== "all") result = result.filter((title) => title.type === type);
  if (genre !== "all") result = result.filter((title) => title.genres.includes(genre));
  if (year !== "all") result = result.filter((title) => String(title.startYear) === String(year));
  if (decade !== "all") {
    const start = Number(decade);
    result = result.filter((title) => title.startYear >= start && title.startYear <= start + 9);
  }
  if (query) {
    const normalizedQuery = normalize(query);
    const tokens = normalizedQuery.split(" ").filter(Boolean);
    result = result.filter((title) => {
      const haystack = searchIndex.get(title.id) || "";
      return tokens.every((token) => haystack.includes(token));
    });
  }

  return [...result].sort(SORTERS[sort] || SORTERS.popularity);
}

const topRated = [...titles]
  .filter((title) => title.rating)
  .sort((a, b) => b.rating - a.rating || b.popularity - a.popularity)
  .slice(0, 10);

export const collections = {
  featured: getTitles(FEATURED),
  trending: getTitles(TRENDING),
  popularMovies: getTitles(POPULAR_MOVIES),
  popularSeries: getTitles(POPULAR_SERIES),
  topRated,
  upcoming: getTitles(UPCOMING),
  genreTiles: GENRE_TILES.map((tile) => {
    const title = getTitle(tile.titleId);
    return title ? { ...tile, title } : null;
  }).filter(Boolean),
};

export function getSimilar(title, limit = 8) {
  if (!title) return [];
  return titles
    .filter((candidate) => candidate.id !== title.id)
    .map((candidate) => {
      const shared = candidate.genres.filter((genre) => title.genres.includes(genre)).length;
      const ratingDelta = Math.abs((candidate.rating || 0) - (title.rating || 0));
      return { candidate, score: shared * 12 - ratingDelta + candidate.popularity / 100 };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || b.candidate.popularity - a.candidate.popularity)
    .slice(0, limit)
    .map((entry) => entry.candidate);
}

export function getTypeLabel(type) {
  return type === "series" ? "Series" : "Film";
}

export function formatRuntime(minutes) {
  if (!minutes) return null;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest}m`;
  return rest ? `${hours}h ${rest}m` : `${hours}h`;
}

export function formatYearRange(title) {
  if (!title) return "";
  if (title.type === "series") {
    return title.endYear ? `${title.startYear}–${title.endYear}` : `${title.startYear}–`;
  }
  return String(title.startYear ?? title.year ?? "");
}

export function formatRating(rating) {
  if (!rating) return "—";
  return Number(rating).toFixed(1);
}

export const genreCounts = genres.map((genre) => ({
  genre,
  count: titles.filter((title) => title.genres.includes(genre)).length,
}));

export const decades = [...new Set(titles.map((title) => Math.floor(title.startYear / 10) * 10))]
  .filter(Boolean)
  .sort((a, b) => b - a)
  .map((decade) => ({
    decade,
    label: `${decade}s`,
    count: titles.filter(
      (title) => title.startYear >= decade && title.startYear <= decade + 9,
    ).length,
  }));

export const hiddenGems = [...titles]
  .filter(
    (title) => (title.rating || 0) >= 8 && title.popularity < 0.7 && title.startYear < 2020,
  )
  .sort((a, b) => b.rating - a.rating || a.popularity - b.popularity)
  .slice(0, 12);

export const globalCinema = titles
  .filter((title) => title.country && !/United States|United Kingdom/.test(title.country))
  .sort((a, b) => b.rating - a.rating || b.popularity - a.popularity)
  .slice(0, 14);

export function getTitlesByDecade(decade) {
  return titles
    .filter((title) => title.startYear >= decade && title.startYear <= decade + 9)
    .sort((a, b) => b.popularity - a.popularity);
}

export function getRandomTitle(pool = titles) {
  if (!pool.length) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}
