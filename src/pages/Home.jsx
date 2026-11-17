import { Link } from "react-router-dom";
import { catalogMeta, collections, globalCinema, hiddenGems } from "../data";
import { useDocumentTitle } from "../hooks";
import { Hero } from "../components/Hero";
import { MediaRow } from "../components/MediaRow";
import { GenreMosaic } from "../components/GenreMosaic";
import { ArrowUpRightIcon } from "../components/icons";

export default function Home() {
  useDocumentTitle(null);

  return (
    <div className="page page--home">
      <Hero items={collections.featured} />

      <div className="container home-sections">
        <MediaRow
          eyebrow="In the conversation"
          title="Trending now"
          description="What people are watching, arguing about and recommending this week."
          items={collections.trending}
          to="/discover"
          actionLabel="Explore discovery"
        />

        <GenreMosaic tiles={collections.genreTiles.slice(0, 8)} />

        <MediaRow
          eyebrow="The canon"
          title="Top ten, ranked"
          description="Ten films and series that have earned their place. Start here if you are new."
          items={collections.topRated}
          ranked
          to="/search?sort=rating"
          actionLabel="See highest rated"
        />

        <MediaRow
          eyebrow="Films"
          title="Modern favourites"
          description="Big-screen stories with something on their mind."
          items={collections.popularMovies}
          to="/movies"
        />

        <MediaRow
          eyebrow="Series"
          title="Prestige television"
          description="Long-form storytelling worth clearing an evening for."
          items={collections.popularSeries}
          to="/tv"
        />

        <MediaRow
          eyebrow="Coming soon"
          title="Upcoming releases"
          description="The next big-screen arrivals in the collection. Trailers are in, ratings will follow."
          items={collections.upcoming}
          to="/movies?year=2026"
          actionLabel="Browse 2026"
        />

        <MediaRow
          eyebrow="Under the radar"
          title="Hidden gems"
          description="Acclaimed titles that deserve a wider audience."
          items={hiddenGems}
          to="/discover"
          actionLabel="More discoveries"
        />

        <MediaRow
          eyebrow="From elsewhere"
          title="Stories from everywhere"
          description="A world beyond Hollywood — subtitles optional, perspective essential."
          items={globalCinema}
          to="/discover"
          actionLabel="Explore world cinema"
        />
      </div>

      <section className="home-manifesto">
        <div className="container home-manifesto__inner">
          <div className="home-manifesto__copy">
            <p className="eyebrow">A watchlist with a memory</p>
            <h2>Less scrolling. More watching.</h2>
            <p>
              Save what catches your eye, mark what you have seen, and come back to a shortlist that
              is actually yours. No account, no algorithm, no noise — just {catalogMeta.total} real
              films and series.
            </p>
            <div className="home-manifesto__actions">
              <Link className="button button--light" to="/watchlist">
                Open your watchlist
              </Link>
              <Link className="button button--ghost" to="/discover">
                Find something new
                <ArrowUpRightIcon size={16} />
              </Link>
            </div>
          </div>

          <dl className="home-stats">
            <div>
              <dt>Films</dt>
              <dd>{catalogMeta.movies}</dd>
            </div>
            <div>
              <dt>Series</dt>
              <dd>{catalogMeta.series}</dd>
            </div>
            <div>
              <dt>Trailers</dt>
              <dd>{catalogMeta.total}</dd>
            </div>
            <div>
              <dt>Years</dt>
              <dd>
                {catalogMeta.firstYear}–{catalogMeta.lastYear}
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </div>
  );
}
