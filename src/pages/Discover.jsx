import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  catalogMeta,
  collections,
  decades,
  getRandomTitle,
  getTitlesByDecade,
  globalCinema,
  hiddenGems,
} from "../data";
import { useDocumentTitle } from "../hooks";
import { PageHeader } from "../components/PageHeader";
import { GenreMosaic } from "../components/GenreMosaic";
import { MediaGrid } from "../components/MediaGrid";
import { MediaRow } from "../components/MediaRow";
import { ArrowUpRightIcon, ShuffleIcon } from "../components/icons";

export default function Discover() {
  useDocumentTitle("Discover");
  const navigate = useNavigate();
  const [decade, setDecade] = useState(2010);

  const decadeTitles = getTitlesByDecade(decade).slice(0, 12);
  const decadeMeta = decades.find((entry) => entry.decade === decade);

  return (
    <div className="page page--discover">
      <PageHeader
        eyebrow="Discovery"
        title="Find your next obsession."
        description={`${catalogMeta.total} films and series, organised by feeling, era and reputation. No endless feed — just a finite, considered collection.`}
      >
        <button
          type="button"
          className="button button--ghost button--shuffle"
          onClick={() => {
            const pick = getRandomTitle();
            if (pick) navigate(`/title/${pick.id}`);
          }}
        >
          <ShuffleIcon size={17} />
          Surprise me
        </button>
      </PageHeader>

      <div className="container page__body discover-body">
        <GenreMosaic tiles={collections.genreTiles} eyebrow="Start with a genre" title="Pick a mood" />

        <section className="decade-section" aria-labelledby="decade-heading">
          <div className="decade-section__head">
            <div>
              <p className="eyebrow">Through the decades</p>
              <h2 id="decade-heading" className="section-heading__title">
                Cinema has a timeline
              </h2>
            </div>
            <Link className="section-heading__action" to={`/movies?decade=${decade}`}>
              Browse the {decade}s
              <ArrowUpRightIcon size={16} />
            </Link>
          </div>

          <div className="decade-strip" role="group" aria-label="Filter by decade">
            {decades.map((entry) => (
              <button
                key={entry.decade}
                type="button"
                className={`decade-chip ${entry.decade === decade ? "is-active" : ""}`}
                onClick={() => setDecade(entry.decade)}
                aria-pressed={entry.decade === decade}
              >
                <span className="decade-chip__label">{entry.label}</span>
                <span className="decade-chip__count">{entry.count} titles</span>
              </button>
            ))}
          </div>

          <p className="decade-section__note">
            Showing {decadeTitles.length} of {decadeMeta?.count ?? 0} titles from the {decade}s,
            ordered by popularity.
          </p>

          <MediaGrid items={decadeTitles} />
        </section>

        <div className="discover-rows">
          <MediaRow
            eyebrow="Critics' corner"
            title="Hidden gems"
            description="High praise, quieter reputations. These are the ones worth seeking out."
            items={hiddenGems}
            to="/search?sort=rating"
            actionLabel="Highest rated"
          />

          <MediaRow
            eyebrow="Beyond Hollywood"
            title="Stories from everywhere"
            description="Non-English-language and international favourites from the collection."
            items={globalCinema}
            to="/movies?genre=Drama"
            actionLabel="Browse drama"
          />
        </div>

        <section className="discover-cta">
          <div>
            <p className="eyebrow">Keep the thread</p>
            <h2>Found something worth remembering?</h2>
            <p>
              Add it to your watchlist. It stays in this browser, survives refreshes and is waiting
              the next time you cannot decide.
            </p>
          </div>
          <Link className="button button--light" to="/watchlist">
            Go to watchlist
            <ArrowUpRightIcon size={16} />
          </Link>
        </section>
      </div>
    </div>
  );
}
