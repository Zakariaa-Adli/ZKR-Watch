import { Link, useParams } from "react-router-dom";
import {
  formatRating,
  formatRuntime,
  formatYearRange,
  getSimilar,
  getTitle,
  getTypeLabel,
} from "../data";
import { useDocumentTitle } from "../hooks";
import { useTrailer } from "../context/TrailerContext";
import { useWatchlist } from "../context/WatchlistContext";
import { Backdrop, Poster } from "../components/Artwork";
import { MediaRow } from "../components/MediaRow";
import { TrailerPlayer } from "../components/TrailerPlayer";
import { BookmarkIcon, CheckIcon, ExternalIcon, PlayIcon, StarIcon } from "../components/icons";
import { pluralize, formatDate } from "../lib/utils";
import NotFound from "./NotFound";

function Fact({ label, children }) {
  if (!children) return null;
  return (
    <div className="fact">
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

export default function Details() {
  const { id } = useParams();
  const title = getTitle(id);
  useDocumentTitle(title?.title ?? "Title not found");

  const { openTrailer } = useTrailer();
  const { isSaved, isWatched, toggle, toggleWatched, add, setWatched } = useWatchlist();

  if (!title) {
    return (
      <NotFound
        title="That title is not in the collection."
        description="The film or series you asked for is not part of ZKR Watch. Browse the collection or search for something else."
      />
    );
  }

  const saved = isSaved(title.id);
  const watched = isWatched(title.id);
  const similar = getSimilar(title, 10);
  const typeLabel = getTypeLabel(title.type);
  const browsePath = title.type === "series" ? "/tv" : "/movies";
  const hasDifferentOriginal =
    title.originalTitle && title.originalTitle.toLowerCase() !== title.title.toLowerCase();

  const cast = title.cast?.slice(0, 10) ?? [];
  const creditLabel = title.type === "series" ? "Created by" : "Director";
  const credit = title.type === "series" ? title.creators : title.director;

  const handleWatched = () => {
    if (saved) {
      toggleWatched(title.id);
      return;
    }
    add(title.id);
    setWatched(title.id, true);
  };

  return (
    <div className="page page--detail">
      <header className="detail-hero">
        <div className="detail-hero__media">
          <Backdrop title={title} priority />
        </div>
        <div className="detail-hero__scrim" aria-hidden="true" />

        <div className="container detail-hero__inner">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link to={browsePath}>{typeLabel === "Series" ? "TV Shows" : "Movies"}</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{title.title}</span>
          </nav>

          <div className="detail-hero__grid">
            <div className="detail-poster">
              <Poster title={title} small={false} priority />
            </div>

            <div className="detail-hero__content">
              <p className="eyebrow">
                {typeLabel} · {formatYearRange(title)}
                {title.status && title.status !== "Released" ? ` · ${title.status}` : ""}
              </p>
              <h1 className="detail-title">{title.title}</h1>
              {hasDifferentOriginal ? (
                <p className="detail-original">{title.originalTitle}</p>
              ) : null}

              <div className="detail-meta">
                {title.rating ? (
                  <span className="detail-rating">
                    <StarIcon size={16} />
                    <strong>{formatRating(title.rating)}</strong>
                    <span>/10</span>
                  </span>
                ) : null}
                <span>{formatYearRange(title)}</span>
                {title.type === "series" ? (
                  <span>
                    {title.seasons} season{title.seasons === 1 ? "" : "s"}
                    {title.episodes ? ` · ${title.episodes} episodes` : ""}
                  </span>
                ) : title.runtime ? (
                  <span>{formatRuntime(title.runtime)}</span>
                ) : null}
                {title.country ? <span>{title.country}</span> : null}
              </div>

              <div className="chip-row">
                {title.genres.map((genre) => (
                  <Link key={genre} className="chip chip--link" to={`/search?genre=${encodeURIComponent(genre)}`}>
                    {genre}
                  </Link>
                ))}
              </div>

              <p className="detail-overview">{title.overview}</p>

              <div className="detail-actions">
                {title.trailer?.id ? (
                  <button type="button" className="button button--light" onClick={() => openTrailer(title)}>
                    <PlayIcon size={17} />
                    Watch trailer
                  </button>
                ) : null}
                <button
                  type="button"
                  className={`button ${saved ? "button--accent" : "button--ghost"}`}
                  onClick={() => toggle(title.id)}
                  aria-pressed={saved}
                >
                  <BookmarkIcon size={17} filled={saved} />
                  {saved ? "In your watchlist" : "Add to watchlist"}
                </button>
                <button
                  type="button"
                  className={`button button--quiet ${watched ? "is-active" : ""}`}
                  onClick={handleWatched}
                  aria-pressed={watched}
                  title={!saved ? "Saves it and marks it as watched" : undefined}
                >
                  <CheckIcon size={17} />
                  {watched ? "Watched" : "Mark as watched"}
                </button>
              </div>

              {credit?.length ? (
                <p className="detail-credit">
                  <span>{creditLabel}</span> {credit.join(", ")}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      <div className="container detail-body">
        <div className="detail-main">
          {title.trailer?.id ? (
            <section className="detail-section" aria-labelledby="trailer-heading">
              <div className="detail-section__head">
                <div>
                  <p className="eyebrow">Official trailer</p>
                  <h2 id="trailer-heading">See it in motion</h2>
                </div>
                <span className="detail-section__source">{title.trailer.channel}</span>
              </div>
              <TrailerPlayer title={title} />
            </section>
          ) : null}

          {cast.length ? (
            <section className="detail-section" aria-labelledby="cast-heading">
              <div className="detail-section__head">
                <div>
                  <p className="eyebrow">Principal cast</p>
                  <h2 id="cast-heading">Who is in it</h2>
                </div>
              </div>
              <ul className="cast-grid">
                {cast.map((member) => (
                  <li key={`${member.name}-${member.character ?? ""}`} className="cast-member">
                    <span className="cast-member__avatar" aria-hidden="true">
                      {member.name
                        .split(" ")
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((part) => part[0])
                        .join("")}
                    </span>
                    <span className="cast-member__text">
                      <strong>{member.name}</strong>
                      {member.character ? <span>{member.character}</span> : null}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {title.awards ? (
            <section className="detail-section" aria-labelledby="awards-heading">
              <div className="detail-section__head">
                <div>
                  <p className="eyebrow">Recognition</p>
                  <h2 id="awards-heading">Awards & nominations</h2>
                </div>
              </div>
              <p className="detail-awards">{title.awards}</p>
            </section>
          ) : null}

          <section className="detail-section detail-section--note" aria-labelledby="about-heading">
            <div className="detail-section__head">
              <div>
                <p className="eyebrow">Provenance</p>
                <h2 id="about-heading">About this entry</h2>
              </div>
            </div>
            <p>
              Metadata for this {typeLabel.toLowerCase()} comes from IMDb by way of Cinemeta
              {title.type === "series" ? ", TVMaze" : " and Wikipedia / Wikidata"}, with artwork
              served through Metahub. The trailer is an official upload verified at the time the
              catalogue was generated. Availability can change on YouTube.
            </p>
          </section>
        </div>

        <aside className="detail-sidebar" aria-label="Title facts">
          <div className="fact-panel">
            <p className="eyebrow">At a glance</p>
            <dl className="fact-list">
              <Fact label={creditLabel}>{credit?.join(", ")}</Fact>
              <Fact label="Release">
                {title.type === "series"
                  ? title.endYear
                    ? `${title.startYear}–${title.endYear}`
                    : `${title.startYear}–present`
                  : formatDate(title.releaseDate) || title.year}
              </Fact>
              <Fact label={title.type === "series" ? "Seasons" : "Runtime"}>
                {title.type === "series"
                  ? `${pluralize(title.seasons ?? 0, "season")}${
                      title.episodes ? ` · ${pluralize(title.episodes, "episode")}` : ""
                    }`
                  : formatRuntime(title.runtime)}
              </Fact>
              <Fact label="Country">{title.country}</Fact>
              <Fact label="Language">{title.language}</Fact>
              <Fact label="Network">{title.network}</Fact>
              <Fact label="Status">{title.status}</Fact>
              <Fact label="Genres">{title.genres.join(", ")}</Fact>
            </dl>

            <a
              className="button button--ghost button--full"
              href={title.imdbUrl}
              target="_blank"
              rel="noreferrer noopener"
            >
              View on IMDb
              <ExternalIcon size={15} />
            </a>
          </div>

          <div className="sidebar-note">
            <p className="eyebrow">Keep it</p>
            <p>Saved titles stay in this browser. No account, no sync, no tracking.</p>
            <Link className="text-link" to="/watchlist">
              Open your watchlist
            </Link>
          </div>
        </aside>
      </div>

      {similar.length ? (
        <div className="container detail-similar">
          <MediaRow
            eyebrow="If you liked this"
            title="More like this"
            items={similar}
            to={`/search?genre=${encodeURIComponent(title.genres[0] || "")}`}
            actionLabel="More in this genre"
          />
        </div>
      ) : null}
    </div>
  );
}
