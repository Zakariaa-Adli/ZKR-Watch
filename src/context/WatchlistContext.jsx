import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getTitle } from "../data";

const STORAGE_KEY = "zkr-watchlist:v1";
const WatchlistContext = createContext(null);

function readStoredItems() {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    const items = parsed?.items ?? parsed;
    if (!items || typeof items !== "object") return {};

    // Accept a legacy array of ids as well as the current keyed object.
    if (Array.isArray(items)) {
      return Object.fromEntries(
        items
          .filter((id) => getTitle(id))
          .map((id) => [id, { addedAt: new Date().toISOString(), watched: false }]),
      );
    }

    return Object.fromEntries(
      Object.entries(items)
        .filter(([id]) => getTitle(id))
        .map(([id, value]) => [
          id,
          {
            addedAt: value?.addedAt || new Date().toISOString(),
            watched: Boolean(value?.watched),
          },
        ]),
    );
  } catch {
    return {};
  }
}

function persist(items) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, items }));
  } catch {
    /* storage can be unavailable in private mode */
  }
}

export function WatchlistProvider({ children }) {
  const [items, setItems] = useState(readStoredItems);

  useEffect(() => {
    persist(items);
  }, [items]);

  useEffect(() => {
    const onStorage = (event) => {
      if (event.key === STORAGE_KEY) setItems(readStoredItems());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const add = useCallback((id) => {
    if (!getTitle(id)) return;
    setItems((current) => {
      if (current[id]) return current;
      return { ...current, [id]: { addedAt: new Date().toISOString(), watched: false } };
    });
  }, []);

  const remove = useCallback((id) => {
    setItems((current) => {
      if (!current[id]) return current;
      const next = { ...current };
      delete next[id];
      return next;
    });
  }, []);

  const toggle = useCallback(
    (id) => {
      if (!getTitle(id)) return;
      setItems((current) => {
        if (current[id]) {
          const next = { ...current };
          delete next[id];
          return next;
        }
        return { ...current, [id]: { addedAt: new Date().toISOString(), watched: false } };
      });
    },
    [],
  );

  const setWatched = useCallback((id, watched) => {
    setItems((current) => {
      if (!current[id]) return current;
      if (current[id].watched === watched) return current;
      return { ...current, [id]: { ...current[id], watched } };
    });
  }, []);

  const toggleWatched = useCallback((id) => {
    setItems((current) => {
      const entry = current[id];
      if (!entry) return current;
      return { ...current, [id]: { ...entry, watched: !entry.watched } };
    });
  }, []);

  const clear = useCallback(() => setItems({}), []);

  const value = useMemo(() => {
    const entries = Object.entries(items)
      .map(([id, entry]) => ({ id, ...entry, title: getTitle(id) }))
      .filter((entry) => entry.title)
      .sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));

    return {
      entries,
      ids: entries.map((entry) => entry.id),
      count: entries.length,
      watchedCount: entries.filter((entry) => entry.watched).length,
      unwatchedCount: entries.filter((entry) => !entry.watched).length,
      isSaved: (id) => Boolean(items[id]),
      isWatched: (id) => Boolean(items[id]?.watched),
      add,
      remove,
      toggle,
      setWatched,
      toggleWatched,
      clear,
    };
  }, [items, add, remove, toggle, setWatched, toggleWatched, clear]);

  return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>;
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (!context) throw new Error("useWatchlist must be used inside WatchlistProvider");
  return context;
}
