/** Thin GA4 wrapper. The gtag snippet lives in index.html; every call is a no-op if it is blocked. */
type Gtag = (...args: unknown[]) => void;
const gtag = (): Gtag | undefined => (window as unknown as { gtag?: Gtag }).gtag;

/** HashRouter changes never reach GA4 as new paths, so report each route as a virtual page. */
export function trackPageView(path: string) {
  gtag()?.('event', 'page_view', {
    page_path: path,
    page_location: `${window.location.origin}${path}`,
    page_title: document.title,
  });
}

export function trackEvent(name: string, params: Record<string, string | number> = {}) {
  gtag()?.('event', name, params);
}
