import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { formatYearRange, getTypeLabel } from "../data";
import { trailerEmbedUrl } from "../lib/utils";
import { useBodyLock, useEscapeKey } from "../hooks";
import { CloseIcon, ExternalIcon } from "./icons";

export function TrailerModal({ title, onClose }) {
  const closeRef = useRef(null);
  const isOpen = Boolean(title?.trailer?.id);
  useBodyLock(isOpen);
  useEscapeKey(onClose, isOpen);

  useEffect(() => {
    if (!isOpen) return undefined;
    const previouslyFocused = document.activeElement;
    closeRef.current?.focus();
    return () => {
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [isOpen, title?.id]);

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="modal"
      role="dialog"
      aria-modal="true"
      aria-label={`${title.title} trailer`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="modal__panel trailer-modal">
        <div className="modal__head">
          <div>
            <p className="eyebrow">
              {getTypeLabel(title.type)} · {formatYearRange(title)}
            </p>
            <h2 className="modal__title">{title.title}</h2>
          </div>
          <button
            type="button"
            className="icon-button modal__close"
            onClick={onClose}
            aria-label="Close trailer"
            ref={closeRef}
          >
            <CloseIcon size={20} />
          </button>
        </div>

        <div className="trailer-modal__frame">
          <iframe
            src={trailerEmbedUrl(title.trailer.id)}
            title={`${title.title} trailer`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        <div className="modal__foot">
          <p className="trailer-modal__credit">
            <span>{title.trailer.title}</span>
            {title.trailer.channel ? <span className="muted"> · {title.trailer.channel}</span> : null}
          </p>
          <a
            className="text-link"
            href={`https://www.youtube.com/watch?v=${title.trailer.id}`}
            target="_blank"
            rel="noreferrer noopener"
          >
            Watch on YouTube
            <ExternalIcon size={14} />
          </a>
        </div>
      </div>
    </div>,
    document.body,
  );
}
