/**
 * Refreshes src/data/catalog.json from public, key-free sources:
 *  - Cinemeta (IMDb metadata, artwork, trailer candidates)
 *  - TVMaze (series cast, seasons, summaries)
 *  - Wikipedia / Wikidata (principal film cast)
 *  - YouTube oEmbed + search (trailer verification)
 *
 * No API keys are required. Responses are cached in scripts/.cache so the
 * script can be re-run cheaply. The app never calls these APIs at runtime.
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  MOVIES,
  SERIES,
  TRAILER_OVERRIDES,
  OFFICIAL_CHANNELS,
  TRUSTED_TRAILER_CHANNELS,
  REJECTED_TRAILER_TERMS,
} from "./catalog-seed.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CACHE_DIR = path.join(ROOT, "scripts", ".cache", "http");
const REPORT_PATH = path.join(ROOT, "scripts", ".cache", "catalog-report.json");
const OUTPUT_PATH = path.join(ROOT, "src", "data", "catalog.json");
const USER_AGENT = "ZKRWatch/1.0 (portfolio project; metadata refresh)";
const CACHE_TTL = 1000 * 60 * 60 * 24 * 7;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function ensureDirs() {
  await mkdir(CACHE_DIR, { recursive: true });
}

function cachePath(url) {
  const hash = createHash("sha1").update(url).digest("hex");
  return path.join(CACHE_DIR, `${hash}.json`);
}

async function cachedFetch(url, { headers = {}, ttl = CACHE_TTL, validate } = {}) {
  const file = cachePath(url);
  try {
    const cached = JSON.parse(await readFile(file, "utf8"));
    if (cached.url === url && Date.now() - cached.at < ttl && (!validate || validate(cached.body))) {
      return cached.body;
    }
  } catch {
    /* cache miss */
  }

  let lastError;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: {
          "user-agent": USER_AGENT,
          accept: "*/*",
          ...headers,
        },
        redirect: "follow",
        signal: AbortSignal.timeout(30000),
      });
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`HTTP ${response.status} for ${url}`);
      }
      const body = await response.text();
      if (validate && !validate(body)) {
        throw new Error(`Unexpected response body for ${url}`);
      }
      await writeFile(file, JSON.stringify({ url, at: Date.now(), body }), "utf8");
      return body;
    } catch (error) {
      lastError = error;
      await sleep(600 * (attempt + 1));
    }
  }
  throw lastError;
}

async function fetchJson(url, options) {
  const body = await cachedFetch(url, options);
  return body ? JSON.parse(body) : null;
}

async function mapLimit(items, limit, mapper) {
  const results = new Array(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await mapper(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

function normalize(value = "") {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function normalizeChannel(value = "") {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/\s+/g, " ")
    .trim();
}

function stripHtml(html = "") {
  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/p>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&ndash;/g, "–")
    .replace(/&mdash;/g, "—")
    .replace(/&hellip;/g, "…")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(text, max = 1100) {
  if (!text || text.length <= max) return text;
  const slice = text.slice(0, max);
  const boundary = Math.max(slice.lastIndexOf(". "), slice.lastIndexOf("! "), slice.lastIndexOf("? "));
  return `${slice.slice(0, boundary > 500 ? boundary + 1 : max).trim()}…`;
}

function parseRuntime(value) {
  if (!value) return null;
  const match = String(value).match(/\d+/);
  return match ? Number(match[0]) : null;
}

function yearFrom(value) {
  const match = String(value || "").match(/\b(18|19|20)\d{2}\b/);
  return match ? Number(match[0]) : null;
}

function extractStarring(wikitext = "") {
  const match = wikitext.match(
    /\|\s*starring\s*=\s*([\s\S]*?)(?=\n\s*\|\s*[a-zA-Z0-9_ ]+\s*=|\n\}\})/i,
  );
  if (!match) return [];

  let raw = match[1]
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<ref[^>]*>[\s\S]*?<\/ref>/gi, "")
    .replace(/<ref[^>]*\/>/gi, "")
    .replace(/\{\{efn[\s\S]*?\}\}/gi, "")
    .replace(/\{\{sfn[\s\S]*?\}\}/gi, "")
    .replace(/\{\{(?:plainlist|plain list|unbulleted list|ubl|flatlist)\s*\|/gi, "")
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, "$2")
    .replace(/\[\[([^\]]+)\]\]/g, "$1")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\{\{[^{}]*\}\}/g, "")
    .replace(/\}\}/g, "")
    .replace(/''+/g, "");

  let parts = raw
    .split(/\n|•|·|;/)
    .map((part) => part.replace(/^[\s*|:]+/, "").replace(/\s+/g, " ").trim())
    .filter(Boolean);

  if (parts.length < 2) {
    parts = raw
      .split(/,| and /i)
      .map((part) => part.replace(/^[\s*|:]+/, "").replace(/\s+/g, " ").trim())
      .filter(Boolean);
  }

  return [...new Set(parts)]
    .filter(
      (name) =>
        name.length > 1 &&
        name.length < 80 &&
        !/[={}]/.test(name) &&
        !/starring|plainlist|unbulleted|flatlist/i.test(name),
    )
    .slice(0, 8);
}

async function fetchCinemeta(seed, type) {
  const data = await fetchJson(`https://v3-cinemeta.strem.io/meta/${type}/${seed.id}.json`);
  if (!data?.meta) throw new Error(`No Cinemeta metadata for ${seed.id}`);
  return data.meta;
}

async function fetchWikipediaStarring(movieIds) {
  const articles = new Map();
  for (let index = 0; index < movieIds.length; index += 45) {
    const chunk = movieIds.slice(index, index + 45);
    const values = chunk.map((id) => `"${id}"`).join(" ");
    const query = `SELECT ?imdb ?article WHERE { VALUES ?imdb { ${values} } ?film wdt:P345 ?imdb . ?article schema:about ?film; schema:isPartOf <https://en.wikipedia.org/>. }`;
    const data = await fetchJson(
      `https://query.wikidata.org/sparql?format=json&query=${encodeURIComponent(query)}`,
      { headers: { accept: "application/sparql-results+json" } },
    );
    for (const binding of data?.results?.bindings || []) {
      const articleUrl = binding.article.value;
      const title = decodeURIComponent(articleUrl.split("/wiki/")[1] || "").replace(/_/g, " ");
      if (title) articles.set(binding.imdb.value, title);
    }
  }

  const castById = new Map();
  await mapLimit([...articles.entries()], 4, async ([imdbId, page]) => {
    try {
      const data = await fetchJson(
        `https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(page)}&prop=wikitext&section=0&format=json&redirects=1&origin=*`,
      );
      const wikitext = data?.parse?.wikitext?.["*"] || "";
      const cast = extractStarring(wikitext);
      if (cast.length) castById.set(imdbId, cast);
    } catch {
      /* fall back to Cinemeta's top billed cast */
    }
    await sleep(60);
  });
  return castById;
}

async function fetchTvMaze(imdbId) {
  try {
    const lookup = await fetchJson(`https://api.tvmaze.com/lookup/shows?imdb=${imdbId}`);
    if (!lookup?.id) return null;
    const show = await fetchJson(
      `https://api.tvmaze.com/shows/${lookup.id}?embed[]=cast&embed[]=seasons`,
    );
    if (!show) return null;
    const seasons = (show._embedded?.seasons || []).filter((season) => season.number > 0);
    const episodes = seasons.reduce((total, season) => total + (season.episodeOrder || 0), 0);
    const cast = (show._embedded?.cast || [])
      .slice(0, 8)
      .map((member) => ({
        name: member.person?.name,
        character: member.character?.name || null,
      }))
      .filter((member) => member.name);
    return {
      status: show.status || null,
      language: show.language || null,
      premiereDate: show.premiered || null,
      network: show.network?.name || show.webChannel?.name || null,
      country: show.network?.country?.name || null,
      summary: stripHtml(show.summary || ""),
      seasons: seasons.length || null,
      episodes: episodes || null,
      cast,
      image: show.image?.original || show.image?.medium || null,
      rating: show.rating?.average ?? null,
    };
  } catch {
    return null;
  }
}

async function imageWorks(url) {
  if (!url) return false;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(url, {
        method: "HEAD",
        headers: { "user-agent": USER_AGENT },
        redirect: "follow",
        signal: AbortSignal.timeout(20000),
      });
      if (response.ok) {
        const type = response.headers.get("content-type") || "";
        return type.startsWith("image/");
      }
      if (response.status === 404 || response.status === 410) return false;
      // A throttled or transient response is not proof of a broken image.
      if (response.status === 429 || response.status >= 500) {
        await sleep(500 * (attempt + 1));
        continue;
      }
      return false;
    } catch {
      await sleep(400 * (attempt + 1));
    }
  }
  // Assume the CDN URL is valid rather than dropping artwork on a transient error.
  return true;
}

function parseYouTubeDuration(text = "") {
  const parts = text.split(":").map(Number);
  if (parts.some((part) => Number.isNaN(part))) return 0;
  return parts.reduce((total, part) => total * 60 + part, 0);
}

function parseYouTubeSearch(html) {
  const match = html.match(/var ytInitialData = (\{.*?\});<\/script>/s);
  if (!match) return [];
  let data;
  try {
    data = JSON.parse(match[1]);
  } catch {
    return [];
  }

  const videos = [];
  const seen = new Set();
  function walk(node) {
    if (!node || typeof node !== "object") return;
    if (node.videoRenderer?.videoId && !seen.has(node.videoRenderer.videoId)) {
      const video = node.videoRenderer;
      seen.add(video.videoId);
      videos.push({
        id: video.videoId,
        title: video.title?.runs?.map((run) => run.text).join("") || "",
        channel: video.ownerText?.runs?.[0]?.text || "",
        duration: parseYouTubeDuration(video.lengthText?.simpleText || ""),
        views: Number((video.viewCountText?.simpleText || "").replace(/[^\d]/g, "")) || 0,
      });
    }
    for (const key of Object.keys(node)) walk(node[key]);
  }
  walk(data);
  return videos;
}

async function searchYouTube(query) {
  try {
    const html = await cachedFetch(
      `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}&hl=en&gl=US`,
      {
        headers: {
          "accept-language": "en-US,en;q=0.9",
          cookie: "CONSENT=YES+1; SOCS=CAI;",
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36",
        },
        validate: (body) => body.includes("var ytInitialData"),
      },
    );
    return html ? parseYouTubeSearch(html) : [];
  } catch (error) {
    console.warn(`  ! YouTube search unavailable for "${query}": ${error.message}`);
    return [];
  }
}

async function verifyYouTube(id) {
  if (!id) return null;
  try {
    const data = await fetchJson(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)}&format=json`,
    );
    if (!data?.title || !data?.author_name) return null;
    return { id, title: data.title, channel: data.author_name };
  } catch {
    return null;
  }
}

function isRejected(videoTitle) {
  const normalized = normalize(videoTitle);
  return REJECTED_TRAILER_TERMS.some((term) => normalized.includes(normalize(term)));
}

const TRAILER_TYPE_PATTERN = /\b(trailer|teaser|special look|sneak peek|first look|official preview)\b/;

const TRAILER_FILLER = new Set([
  "a",
  "an",
  "and",
  "apple",
  "at",
  "atmos",
  "bbc",
  "channel",
  "coming",
  "disney",
  "dolby",
  "english",
  "film",
  "final",
  "first",
  "full",
  "fx",
  "hd",
  "hbo",
  "hulu",
  "imax",
  "in",
  "launch",
  "limited",
  "look",
  "main",
  "max",
  "movie",
  "netflix",
  "new",
  "now",
  "of",
  "official",
  "on",
  "one",
  "only",
  "original",
  "paramount",
  "peek",
  "preview",
  "season",
  "series",
  "sneak",
  "soon",
  "special",
  "stan",
  "streaming",
  "the",
  "theaters",
  "theatres",
  "tv",
  "uk",
  "us",
  "usa",
  "video",
  "watch",
  "youtube",
  "4k",
  "8k",
  "1",
]);

const SERIES_FILLER = new Set([
  ...TRAILER_FILLER,
  "blu",
  "collection",
  "complete",
  "edition",
  "installment",
  "installments",
  "ray",
  "seasons",
  "volume",
  "volumes",
  "amc",
  "showtime",
  "starz",
]);

const SERIES_NUMBER = /^(?:[1-9]|1\d|20|21|22|23|24|25)$/;

const MONTHS = new Set([
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
]);

/**
 * A candidate must contain the title (or an alias) before the first
 * trailer-style keyword, with no leftover title words. This prevents
 * sequels/spin-offs such as "The Matrix Resurrections" from matching
 * "The Matrix". Series may include season/collection qualifiers.
 */
function analyzeTitleMatch(videoTitle, title, aliases = [], type = "movie") {
  const normalized = normalize(videoTitle);
  const typeMatch = normalized.match(TRAILER_TYPE_PATTERN);
  if (!typeMatch) return { ok: false, normalized };

  const region = normalized.slice(0, typeMatch.index).trim();
  const needles = [...new Set([title, ...aliases].map(normalize).filter(Boolean))].sort(
    (a, b) => b.length - a.length,
  );

  let match = null;
  for (const needle of needles) {
    const index = region.indexOf(needle);
    if (index >= 0) {
      match = { needle, index };
      break;
    }
  }
  if (!match) return { ok: false, normalized };

  const rest = region.slice(match.index + match.needle.length);
  const tokens = rest
    .replace(/\b(18|19|20)\d{2}\b/g, " ")
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
    .filter((token) => !MONTHS.has(token))
    .filter((token) => !(type === "series" ? SERIES_FILLER : TRAILER_FILLER).has(token))
    .filter((token) => !(type === "series" && SERIES_NUMBER.test(token)));

  return { ok: tokens.length === 0, normalized, extra: tokens };
}

function scoreTrailer(candidate, title, aliases, releaseYear, type = "movie") {
  const match = analyzeTitleMatch(candidate.title, title, aliases, type);
  if (!match.ok) return -1;

  const normalizedTitle = match.normalized;
  if (isRejected(candidate.title)) return -1;

  const channel = normalizeChannel(candidate.channel);
  const official = OFFICIAL_CHANNELS.find((name) => channel.includes(name));
  const trusted = TRUSTED_TRAILER_CHANNELS.find((name) => channel.includes(name));
  const saysOfficial = /\bofficial\b/.test(normalizedTitle);
  if (!official && !trusted && !saysOfficial) return -1;

  let score = 40;
  score += official ? 55 : 0;
  score += trusted ? 22 : 0;
  score += saysOfficial ? 8 : 0;
  score += /official trailer/.test(normalizedTitle) ? 12 : 0;
  score += releaseYear && normalizedTitle.includes(String(releaseYear)) ? 5 : 0;
  score += candidate.duration >= 45 && candidate.duration <= 420 ? 4 : 0;
  score += Math.min(candidate.views / 5_000_000, 5);

  const years = [...normalizedTitle.matchAll(/\b(18|19|20)\d{2}\b/g)].map((entry) => Number(entry[0]));
  if (releaseYear && years.length && !years.includes(releaseYear)) score -= 30;

  return score;
}

async function resolveTrailer(meta, seed, type) {
  const title = seed.titleOverride || meta.name;
  const aliases = seed.aliases || [];
  const releaseYear = yearFrom(meta.releaseInfo || meta.released);

  if (TRAILER_OVERRIDES[seed.id]) {
    const override = TRAILER_OVERRIDES[seed.id];
    const overrideId = typeof override === "string" ? override : override.id;
    const verified = await verifyYouTube(overrideId);
    if (
      verified &&
      (override.force || analyzeTitleMatch(verified.title, title, aliases, type).ok) &&
      !isRejected(verified.title)
    ) {
      return verified;
    }
    console.warn(`  ! trailer override failed for ${title}`);
  }

  const query =
    seed.query ||
    `${meta.name} ${releaseYear || ""} ${type === "series" ? "series" : ""} official trailer`.trim();
  const searchResults = await searchYouTube(query);

  const ranked = [];
  for (const candidate of searchResults) {
    const score = scoreTrailer(candidate, title, aliases, releaseYear, type);
    if (score > 0) ranked.push({ ...candidate, score });
  }
  ranked.sort((a, b) => b.score - a.score || b.views - a.views);

  for (const candidate of ranked.slice(0, 6)) {
    const verified = await verifyYouTube(candidate.id);
    if (!verified) continue;
    if (!analyzeTitleMatch(verified.title, title, aliases, type).ok || isRejected(verified.title)) continue;
    return verified;
  }

  // Fall back to trailer ids supplied by Cinemeta when search has no usable hit.
  const fallbackCandidates = [];
  for (const trailer of meta.trailers || []) {
    if (trailer?.source) fallbackCandidates.push(trailer.source);
  }
  for (const stream of meta.trailerStreams || []) {
    if (stream?.ytId) fallbackCandidates.push(stream.ytId);
  }

  for (const id of [...new Set(fallbackCandidates)].slice(0, 8)) {
    const verified = await verifyYouTube(id);
    if (!verified) continue;
    if (!analyzeTitleMatch(verified.title, title, aliases, type).ok || isRejected(verified.title)) continue;
    if (!scoreTrailer({ ...verified, title: verified.title, channel: verified.channel }, title, aliases, releaseYear, type)) {
      continue;
    }
    return verified;
  }

  return null;
}

function buildRecord(meta, seed, type, context) {
  const { movieCast, tvmaze, poster, posterSmall, backdrop, backdropSmall } = context;
  const releaseDate = meta.released || (tvmaze?.premiereDate ? `${tvmaze.premiereDate}T00:00:00.000Z` : null);
  const startYear =
    yearFrom(meta.releaseInfo) || yearFrom(releaseDate) || null;
  const endYear = type === "series" ? yearFrom(meta.year?.split("–")?.[1]) : null;
  const yearLabel =
    type === "series"
      ? meta.releaseInfo || (startYear ? `${startYear}${endYear ? `–${endYear}` : "–"}` : null)
      : startYear
        ? String(startYear)
        : meta.releaseInfo || null;

  const metaCast = (meta.cast || []).filter(Boolean);
  const cast =
    type === "series" && tvmaze?.cast?.length
      ? tvmaze.cast
      : (movieCast?.length ? movieCast : metaCast).map((name) => ({ name, character: null }));

  const summary =
    type === "series" && tvmaze?.summary && tvmaze.summary.length > (meta.description || "").length
      ? tvmaze.summary
      : meta.description || tvmaze?.summary || "";

  return {
    id: seed.id,
    type,
    title: seed.titleOverride || meta.name,
    originalTitle: seed.originalTitle || null,
    year: yearLabel,
    startYear,
    endYear,
    releaseDate: releaseDate ? new Date(releaseDate).toISOString() : null,
    rating: Number.parseFloat(meta.imdbRating) || tvmaze?.rating || null,
    genres: meta.genres || meta.genre || [],
    overview: truncate(summary, 1100),
    runtime: parseRuntime(meta.runtime) || tvmaze?.runtime || null,
    seasons: type === "series" ? tvmaze?.seasons || null : null,
    episodes: type === "series" ? tvmaze?.episodes || null : null,
    status: type === "series" ? tvmaze?.status || meta.status || null : null,
    language: tvmaze?.language || null,
    country: tvmaze?.country || meta.country || null,
    network: tvmaze?.network || null,
    director: type === "movie" ? meta.director || [] : [],
    creators: type === "series" ? (meta.writer || []).slice(0, 4) : [],
    cast,
    awards: meta.awards || null,
    popularity: Number(meta.popularity) || 0,
    poster,
    posterSmall,
    backdrop,
    backdropSmall,
    trailer: null,
    imdbId: seed.id,
    imdbUrl: `https://www.imdb.com/title/${seed.id}/`,
  };
}

async function main() {
  await ensureDirs();
  const startedAt = Date.now();

  const seeds = [
    ...MOVIES.map((seed) => ({ ...seed, type: "movie" })),
    ...SERIES.map((seed) => ({ ...seed, type: "series" })),
  ];

  console.log(`Resolving ${seeds.length} titles…`);

  console.log("• Fetching IMDb/Cinemeta metadata");
  const metas = await mapLimit(seeds, 5, async (seed) => {
    const meta = await fetchCinemeta(seed, seed.type);
    return { seed, meta };
  });

  console.log("• Fetching principal film cast from Wikipedia");
  const movieCast = await fetchWikipediaStarring(MOVIES.map((movie) => movie.id));

  console.log("• Fetching series details from TVMaze");
  const tvMaze = new Map();
  await mapLimit(SERIES, 4, async (seed) => {
    tvMaze.set(seed.id, await fetchTvMaze(seed.id));
    await sleep(80);
  });

  console.log("• Validating artwork");
  const artwork = new Map();
  await mapLimit(seeds, 6, async (seed) => {
    const poster = `https://images.metahub.space/poster/medium/${seed.id}/img`;
    const posterSmall = `https://images.metahub.space/poster/small/${seed.id}/img`;
    const backdrop = `https://images.metahub.space/background/medium/${seed.id}/img`;
    const backdropSmall = `https://images.metahub.space/background/small/${seed.id}/img`;
    const [posterOk, backdropOk] = await Promise.all([imageWorks(poster), imageWorks(backdrop)]);
    const fallbackPoster = tvMaze.get(seed.id)?.image || null;
    artwork.set(seed.id, {
      poster: posterOk ? poster : fallbackPoster,
      posterSmall: posterOk ? posterSmall : fallbackPoster,
      backdrop: backdropOk ? backdrop : null,
      backdropSmall: backdropOk ? backdropSmall : null,
    });
  });

  console.log("• Verifying trailers");
  const trailers = new Map();
  await mapLimit(seeds, 2, async (seed) => {
    const meta = metas.find((entry) => entry.seed.id === seed.id)?.meta;
    if (!meta) return;
    trailers.set(seed.id, await resolveTrailer(meta, seed, seed.type));
    await sleep(120);
  });

  const titles = metas.map(({ seed, meta }) => {
    const record = buildRecord(meta, seed, seed.type, {
      movieCast: movieCast.get(seed.id),
      tvmaze: tvMaze.get(seed.id),
      ...artwork.get(seed.id),
    });
    record.trailer = trailers.get(seed.id) || null;
    return record;
  });

  titles.sort((a, b) => a.title.localeCompare(b.title));

  const report = titles.map((title) => ({
    id: title.id,
    title: title.title,
    type: title.type,
    poster: Boolean(title.poster),
    backdrop: Boolean(title.backdrop),
    cast: title.cast.length,
    overviewLength: title.overview.length,
    trailer: title.trailer ? `${title.trailer.channel} — ${title.trailer.title}` : null,
  }));

  await mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(
    OUTPUT_PATH,
    `${JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        sources: [
          "Cinemeta / IMDb",
          "TVMaze",
          "Wikipedia / Wikidata",
          "YouTube",
        ],
        titles,
      },
      null,
      2,
    )}\n`,
    "utf8",
  );
  await writeFile(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  const missingArt = report.filter((entry) => !entry.poster || !entry.backdrop);
  const missingTrailers = report.filter((entry) => !entry.trailer);
  console.log(`\nWrote ${titles.length} titles to ${path.relative(ROOT, OUTPUT_PATH)}`);
  console.log(`Missing artwork: ${missingArt.length}`);
  if (missingArt.length) console.log(missingArt.map((entry) => `  - ${entry.title} (${entry.id})`).join("\n"));
  console.log(`Missing verified trailers: ${missingTrailers.length}`);
  if (missingTrailers.length) console.log(missingTrailers.map((entry) => `  - ${entry.title} (${entry.id})`).join("\n"));
  console.log(`Finished in ${((Date.now() - startedAt) / 1000).toFixed(1)}s`);
}

main().catch((error) => {
  console.error("\nCatalog refresh failed:");
  console.error(error);
  process.exitCode = 1;
});
