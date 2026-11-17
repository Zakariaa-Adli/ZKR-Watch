import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useBodyLock } from "../hooks";
import { useWatchlist } from "../context/WatchlistContext";
import { SearchOverlay } from "./SearchOverlay";
import {
  BookmarkIcon,
  CompassIcon,
  FilmIcon,
  HomeIcon,
  LogoMark,
  MenuIcon,
  CloseIcon,
  SearchIcon,
  TvIcon,
} from "./icons";

const IS_MAC =
  typeof navigator !== "undefined" && /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent);
const SHORTCUT = IS_MAC ? "⌘K" : "Ctrl K";

const LINKS = [
  { to: "/", label: "Home", icon: HomeIcon, end: true },
  { to: "/movies", label: "Movies", icon: FilmIcon },
  { to: "/tv", label: "TV Shows", icon: TvIcon },
  { to: "/discover", label: "Discover", icon: CompassIcon },
  { to: "/watchlist", label: "Watchlist", icon: BookmarkIcon },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { pathname } = useLocation();
  const { count } = useWatchlist();
  useBodyLock(menuOpen);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKeyDown = (event) => {
      const target = event.target;
      const typing =
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen((current) => !current);
      } else if (event.key === "/" && !typing) {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const solid = scrolled || pathname !== "/" || menuOpen;

  return (
    <>
      <header className={`site-header ${solid ? "is-solid" : ""}`}>
        <div className="container site-header__inner">
          <Link to="/" className="brand" aria-label="ZKR Watch home">
            <LogoMark size={34} />
            <span className="brand__text">
              <span className="brand__name">ZKR</span>
              <span className="brand__sub">Watch</span>
            </span>
          </Link>

          <nav className="site-nav" aria-label="Primary">
            {LINKS.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) => `site-nav__link ${isActive ? "is-active" : ""}`}
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="site-header__actions">
            <button
              type="button"
              className="search-trigger"
              onClick={() => setSearchOpen(true)}
              aria-label="Search the catalogue"
            >
              <SearchIcon size={17} />
              <span>Search</span>
              <kbd>{SHORTCUT}</kbd>
            </button>

            <Link to="/watchlist" className="watchlist-trigger" aria-label={`Watchlist, ${count} saved`}>
              <BookmarkIcon size={18} />
              {count > 0 ? <span className="watchlist-trigger__count">{count}</span> : null}
            </Link>

            <button
              type="button"
              className="menu-trigger"
              onClick={() => setMenuOpen((current) => !current)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
            </button>
          </div>
        </div>

        <div id="mobile-menu" className={`mobile-menu ${menuOpen ? "is-open" : ""}`} hidden={!menuOpen}>
          <nav className="mobile-menu__nav" aria-label="Mobile">
            {LINKS.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) => `mobile-menu__link ${isActive ? "is-active" : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                <Icon size={19} />
                <span>{label}</span>
                {to === "/watchlist" && count > 0 ? (
                  <span className="mobile-menu__count">{count}</span>
                ) : null}
              </NavLink>
            ))}
          </nav>
          <button
            type="button"
            className="mobile-menu__search"
            onClick={() => {
              setMenuOpen(false);
              setSearchOpen(true);
            }}
          >
            <SearchIcon size={18} />
            Search films and series
          </button>
        </div>
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
