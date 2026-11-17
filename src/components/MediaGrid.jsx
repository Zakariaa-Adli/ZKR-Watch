import { MediaCard } from "./MediaCard";

export function MediaGrid({ items, onToggleWatched, className = "" }) {
  return (
    <div className={`media-grid ${className}`.trim()}>
      {items.map((title, index) => {
        const watchedEntry = title.watched;
        return (
          <MediaCard
            key={title.id}
            title={title}
            watched={watchedEntry}
            onToggleWatched={onToggleWatched}
            priority={index < 6}
          />
        );
      })}
    </div>
  );
}
