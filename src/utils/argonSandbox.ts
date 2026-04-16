/**
 * Argon2 サンドボックス iframe との postMessage を、同一拡張 origin のみに限定する。
 */
export function postMessageToArgonSandbox<TResponse>(
  iframe: HTMLIFrameElement,
  message: Record<string, unknown>
): Promise<TResponse> {
  const targetOrigin = window.location.origin;
  return new Promise((resolve, reject) => {
    const timeoutMs = 120_000;
    const timer = window.setTimeout(() => {
      window.removeEventListener("message", onMessage);
      reject(new Error("argon-sandbox timeout"));
    }, timeoutMs);

    const onMessage = (event: MessageEvent) => {
      if (event.source !== iframe.contentWindow) {
        return;
      }
      if (event.origin !== targetOrigin) {
        return;
      }
      if (!event.data || typeof event.data !== "object") {
        return;
      }
      if (!Object.prototype.hasOwnProperty.call(event.data, "response")) {
        return;
      }
      window.clearTimeout(timer);
      window.removeEventListener("message", onMessage);
      resolve((event.data as { response: TResponse }).response);
    };

    window.addEventListener("message", onMessage);
    iframe.contentWindow!.postMessage(message, targetOrigin);
  });
}
