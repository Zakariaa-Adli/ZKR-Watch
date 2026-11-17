import { useState } from "react";
import { trailerEmbedUrl, trailerThumbnail } from "../lib/utils";
import { PlayIcon } from "./icons";

export function TrailerPlayer({ title }) {
  const [playing, setPlaying] = useState(false);
  const [thumbFailed, setThumbFailed] = useState(false);

  if (!title.trailer?.id) {
    return (
      <div className="trailer-stage trailer-stage--empty">
        <p>No verified trailer is available for this title.</p>
      </div>
    );
  }

  if (playing) {
    return (
      <div className="trailer-stage trailer-stage--playing">
        <iframe
          src={trailerEmbedUrl(title.trailer.id)}
          title={`${title.title} trailer`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      className="trailer-stage trailer-stage--button"
      onClick={() => setPlaying(true)}
      aria-label={`Play trailer for ${title.title}`}
    >
      {!thumbFailed ? (
        <img
          className="trailer-stage__thumb"
          src={trailerThumbnail(title.trailer.id)}
          alt=""
          loading="lazy"
          onError={() => setThumbFailed(true)}
        />
      ) : (
        <span className="trailer-stage__fallback" aria-hidden="true" />
      )}
      <span className="trailer-stage__shade" aria-hidden="true" />
      <span className="trailer-stage__play">
        <span className="trailer-stage__play-icon">
          <PlayIcon size={22} />
        </span>
        <span>
          <strong>Play trailer</strong>
          <small>{title.trailer.channel || "Official trailer"}</small>
        </span>
      </span>
    </button>
  );
}
