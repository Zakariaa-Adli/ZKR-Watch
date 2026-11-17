import { useCallback, useEffect, useRef, useState } from "react";
import { SectionHeading } from "./SectionHeading";
import { MediaCard } from "./MediaCard";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons";

export function MediaRow({ title, eyebrow, description, items, to, actionLabel, ranked = false }) {
  const trackRef = useRef(null);
  const [edges, setEdges] = useState({ left: false, right: false });

  const updateEdges = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const maxScroll = track.scrollWidth - track.clientWidth;
    setEdges({
      left: track.scrollLeft > 8,
      right: maxScroll > 8 && track.scrollLeft < maxScroll - 8,
    });
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    updateEdges();
    const observer = new ResizeObserver(updateEdges);
    observer.observe(track);
    track.addEventListener("scroll", updateEdges, { passive: true });
    return () => {
      observer.disconnect();
      track.removeEventListener("scroll", updateEdges);
    };
  }, [updateEdges, items.length]);

  const scrollBy = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.82, behavior: "smooth" });
  };

  if (!items?.length) return null;

  return (
    <section className="media-row" aria-label={title}>
      <SectionHeading
        eyebrow={eyebrow}
        title={title}
        description={description}
        to={to}
        actionLabel={actionLabel}
      />
      <div className="media-row__viewport">
        <button
          type="button"
          className="media-row__arrow media-row__arrow--left"
          onClick={() => scrollBy(-1)}
          disabled={!edges.left}
          aria-label={`Scroll ${title} left`}
        >
          <ChevronLeftIcon size={20} />
        </button>

        <div className="media-row__track" ref={trackRef}>
          {items.map((item, index) => (
            <MediaCard key={item.id} title={item} rank={ranked ? index + 1 : undefined} />
          ))}
        </div>

        <button
          type="button"
          className="media-row__arrow media-row__arrow--right"
          onClick={() => scrollBy(1)}
          disabled={!edges.right}
          aria-label={`Scroll ${title} right`}
        >
          <ChevronRightIcon size={20} />
        </button>
      </div>
    </section>
  );
}
