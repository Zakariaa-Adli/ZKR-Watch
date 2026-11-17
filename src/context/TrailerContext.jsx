import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { TrailerModal } from "../components/TrailerModal";

const TrailerContext = createContext(null);

export function TrailerProvider({ children }) {
  const [activeTitle, setActiveTitle] = useState(null);

  const openTrailer = useCallback((title) => {
    if (title?.trailer?.id) setActiveTitle(title);
  }, []);

  const closeTrailer = useCallback(() => setActiveTitle(null), []);

  const value = useMemo(() => ({ openTrailer, closeTrailer }), [openTrailer, closeTrailer]);

  return (
    <TrailerContext.Provider value={value}>
      {children}
      <TrailerModal title={activeTitle} onClose={closeTrailer} />
    </TrailerContext.Provider>
  );
}

export function useTrailer() {
  const context = useContext(TrailerContext);
  if (!context) throw new Error("useTrailer must be used inside TrailerProvider");
  return context;
}
