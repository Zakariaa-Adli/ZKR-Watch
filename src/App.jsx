import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Layout } from "./components/Layout";
import { PageLoader } from "./components/PageLoader";
import Home from "./pages/Home";

const Movies = lazy(() => import("./pages/Movies"));
const TVShows = lazy(() => import("./pages/TVShows"));
const Discover = lazy(() => import("./pages/Discover"));
const Watchlist = lazy(() => import("./pages/Watchlist"));
const Search = lazy(() => import("./pages/Search"));
const Details = lazy(() => import("./pages/Details"));
const NotFound = lazy(() => import("./pages/NotFound"));

function Suspended({ children }) {
  return (
    <Suspense
      fallback={
        <div className="container route-loader">
          <PageLoader />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route
            path="movies"
            element={
              <Suspended>
                <Movies />
              </Suspended>
            }
          />
          <Route
            path="tv"
            element={
              <Suspended>
                <TVShows />
              </Suspended>
            }
          />
          <Route
            path="discover"
            element={
              <Suspended>
                <Discover />
              </Suspended>
            }
          />
          <Route
            path="watchlist"
            element={
              <Suspended>
                <Watchlist />
              </Suspended>
            }
          />
          <Route
            path="search"
            element={
              <Suspended>
                <Search />
              </Suspended>
            }
          />
          <Route
            path="title/:id"
            element={
              <Suspended>
                <Details />
              </Suspended>
            }
          />
          <Route
            path="*"
            element={
              <Suspended>
                <NotFound />
              </Suspended>
            }
          />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}
