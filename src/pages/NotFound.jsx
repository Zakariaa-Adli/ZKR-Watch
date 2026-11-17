import { Link } from "react-router-dom";
import { useDocumentTitle } from "../hooks";
import { SearchIcon } from "../components/icons";

export default function NotFound({
  title = "This page is off the reel.",
  description = "The address you followed does not point at a page in the collection. It may have been mistyped, or the title may not be included.",
}) {
  useDocumentTitle("Not found");

  return (
    <div className="page page--notfound">
      <div className="container notfound">
        <p className="notfound__code" aria-hidden="true">
          404
        </p>
        <p className="eyebrow">Nothing here</p>
        <h1>{title}</h1>
        <p className="notfound__description">{description}</p>
        <div className="notfound__actions">
          <Link className="button button--primary" to="/">
            Back to home
          </Link>
          <Link className="button button--ghost" to="/discover">
            Discover something
          </Link>
          <Link className="button button--ghost" to="/search">
            <SearchIcon size={16} />
            Search
          </Link>
        </div>
      </div>
    </div>
  );
}
