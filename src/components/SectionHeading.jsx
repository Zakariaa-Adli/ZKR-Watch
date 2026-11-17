import { cx } from "../lib/utils";
import { ArrowUpRightIcon } from "./icons";
import { Link } from "react-router-dom";

export function SectionHeading({ eyebrow, title, description, to, actionLabel = "View all", className }) {
  return (
    <div className={cx("section-heading", className)}>
      <div className="section-heading__text">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2 className="section-heading__title">{title}</h2>
        {description ? <p className="section-heading__description">{description}</p> : null}
      </div>
      {to ? (
        <Link className="section-heading__action" to={to}>
          {actionLabel}
          <ArrowUpRightIcon size={16} />
        </Link>
      ) : null}
    </div>
  );
}
