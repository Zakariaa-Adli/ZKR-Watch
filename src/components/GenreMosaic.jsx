import { Link } from "react-router-dom";
import { genreCounts } from "../data";
import { Backdrop } from "./Artwork";
import { ArrowUpRightIcon } from "./icons";

export function GenreMosaic({ tiles, eyebrow = "Browse by feeling", title = "Every kind of story" }) {
  if (!tiles?.length) return null;

  return (
    <section className="genre-section" aria-labelledby="genre-heading">
      <div className="genre-section__head">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2 id="genre-heading" className="section-heading__title">
            {title}
          </h2>
        </div>
        <Link className="section-heading__action" to="/discover">
          Explore discovery
          <ArrowUpRightIcon size={16} />
        </Link>
      </div>

      <div className="genre-mosaic">
        {tiles.map((tile, index) => {
          const count = genreCounts.find((entry) => entry.genre === tile.genre)?.count ?? 0;
          return (
            <Link
              key={tile.genre}
              to={`/search?genre=${encodeURIComponent(tile.genre)}`}
              className={`genre-tile genre-tile--${index + 1}`}
            >
              <Backdrop title={tile.title} small />
              <span className="genre-tile__shade" aria-hidden="true" />
              <span className="genre-tile__content">
                <span className="genre-tile__name">{tile.genre}</span>
                <span className="genre-tile__count">{count} titles</span>
              </span>
              <span className="genre-tile__arrow" aria-hidden="true">
                <ArrowUpRightIcon size={18} />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
