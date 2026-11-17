import { Link } from "react-router-dom";
import { BookmarkIcon, SearchIcon } from "./icons";

export function EmptyState({ icon = "bookmark", title, description, action, to, onAction }) {
  const Icon = icon === "search" ? SearchIcon : BookmarkIcon;

  return (
    <div className="empty-state">
      <span className="empty-state__icon">
        <Icon size={26} />
      </span>
      <h2 className="empty-state__title">{title}</h2>
      {description ? <p className="empty-state__description">{description}</p> : null}
      {action && to ? (
        <Link className="button button--primary" to={to}>
          {action}
        </Link>
      ) : null}
      {action && onAction ? (
        <button type="button" className="button button--primary" onClick={onAction}>
          {action}
        </button>
      ) : null}
    </div>
  );
}
