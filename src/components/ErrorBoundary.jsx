import { Component } from "react";

export class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("ZKR Watch crashed:", error, info);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="fatal-error">
        <div className="container fatal-error__inner">
          <p className="eyebrow">Something went wrong</p>
          <h1>The reel stopped.</h1>
          <p>
            An unexpected error interrupted the page. Reloading usually fixes it — your watchlist
            is stored safely in this browser.
          </p>
          <div className="fatal-error__actions">
            <button type="button" className="button button--primary" onClick={() => window.location.reload()}>
              Reload the page
            </button>
            <a className="button button--ghost" href="/">
              Back to home
            </a>
          </div>
          {process.env.NODE_ENV !== "production" ? (
            <pre className="fatal-error__detail">{String(this.state.error?.stack || this.state.error)}</pre>
          ) : null}
        </div>
      </div>
    );
  }
}
