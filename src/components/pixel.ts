/* eslint-disable @typescript-eslint/no-explicit-any */

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: unknown;
  }
}

/** Meta Pixel চালু করে + PageView পাঠায়। ID না বসালে কিছুই করে না। */
export function initPixel(id: string) {
  if (typeof window === "undefined" || window.fbq || !id || id.startsWith("YOUR")) return;
  const w = window as any;
  const n: any = (w.fbq = function (...args: unknown[]) {
    if (n.callMethod) n.callMethod.apply(n, args);
    else n.queue.push(args);
  });
  if (!w._fbq) w._fbq = n;
  n.push = n;
  n.loaded = true;
  n.version = "2.0";
  n.queue = [];
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(s);
  w.fbq("init", id);
  w.fbq("track", "PageView");
}

/** যেকোনো standard event পাঠান: track("Purchase", { value, currency }) */
export function track(event: string, data: Record<string, unknown> = {}, eventID?: string) {
  if (typeof window === "undefined" || !window.fbq) return;
  if (eventID) window.fbq("track", event, data, { eventID });
  else window.fbq("track", event, data);
}