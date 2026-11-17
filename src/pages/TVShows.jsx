import { catalogMeta } from "../data";
import { useDocumentTitle } from "../hooks";
import { PageHeader } from "../components/PageHeader";
import { CatalogBrowser } from "../components/CatalogBrowser";

export default function TVShows() {
  useDocumentTitle("TV Shows");

  return (
    <div className="page">
      <PageHeader
        eyebrow="The collection"
        title="TV Shows"
        description="Limited series, long-running favourites and the shows everyone keeps telling you to start. Every entry includes season and cast details."
      >
        <div className="page-header__stat">
          <strong>{catalogMeta.series}</strong>
          <span>series</span>
        </div>
      </PageHeader>

      <div className="container page__body">
        <CatalogBrowser lockedType="series" showSearch />
      </div>
    </div>
  );
}
