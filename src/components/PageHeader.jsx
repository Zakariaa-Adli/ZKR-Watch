export function PageHeader({ eyebrow, title, description, children, withBackdrop = false }) {
  return (
    <header className={`page-header ${withBackdrop ? "page-header--art" : ""}`}>
      <div className="container">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <div className="page-header__row">
          <h1 className="page-header__title">{title}</h1>
          {children ? <div className="page-header__aside">{children}</div> : null}
        </div>
        {description ? <p className="page-header__description">{description}</p> : null}
      </div>
    </header>
  );
}
