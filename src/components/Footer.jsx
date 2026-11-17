import { Link } from "react-router-dom";
import { catalogMeta } from "../data";
import { ArrowUpRightIcon, LogoMark } from "./icons";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/movies", label: "Movies" },
  { to: "/tv", label: "TV Shows" },
  { to: "/discover", label: "Discover" },
  { to: "/watchlist", label: "Watchlist" },
  { to: "/search", label: "Search" },
];

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__top">
        <div className="site-footer__brand">
          <Link to="/" className="brand" aria-label="ZKR Watch home">
            <LogoMark size={38} />
            <span className="brand__text">
              <span className="brand__name">ZKR</span>
              <span className="brand__sub">Watch</span>
            </span>
          </Link>
          <p className="site-footer__tagline">
            A quieter way to find something to watch. {catalogMeta.total} films and series,
            hand-picked and properly documented.
          </p>
        </div>

        <nav className="site-footer__nav" aria-label="Footer">
          <p className="eyebrow">Browse</p>
          <ul>
            {NAV.map((item) => (
              <li key={item.to}>
                <Link to={item.to}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-footer__note">
          <p className="eyebrow">About the data</p>
          <p>
            Metadata and artwork are sourced from IMDb by way of Cinemeta, TVMaze, Wikipedia and
            Wikidata. Trailers are verified official uploads embedded from YouTube. ZKR Watch is an
            independent project and is not affiliated with any of these services.
          </p>
          <a
            className="text-link"
            href="https://www.imdb.com/"
            target="_blank"
            rel="noreferrer noopener"
          >
            Metadata on IMDb
            <ArrowUpRightIcon size={14} />
          </a>
        </div>
      </div>

      <div className="container site-footer__bottom">
        <p>© {new Date().getFullYear()} ZKR Watch. Built with React.</p>
        <p className="site-footer__privacy">
          No accounts. Your watchlist lives in this browser.
        </p>
        <button
          type="button"
          className="site-footer__top-link"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          Back to top
          <ArrowUpRightIcon size={14} />
        </button>
      </div>
    </footer>
  );
}
