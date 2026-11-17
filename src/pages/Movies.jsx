import { catalogMeta } from "../data";
import { useDocumentTitle } from "../hooks";
import { PageHeader } from "../components/PageHeader";
import { CatalogBrowser } from "../components/CatalogBrowser";

export default function Movies() {
  useDocumentTitle("Films");

  return (
    <div className="page">
      <PageHeader
        eyebrow="The collection"
        title="Films"
        description="From black-and-white classics to this year's most anticipated releases. Filter by genre, era or rating, then save what you want to see."
      >
        <div className="page-header__stat">
          <strong>{catalogMeta.movies}</strong>
          <span>films</span>
        </div>
      </PageHeader>

      <div className="container page__body">
        <CatalogBrowser lockedType="movie" showSearch />
      </div>
    </div>
  );
}
