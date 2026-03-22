(async function normalizeAuthOrigin() {
  const { hostname, pathname, search, hash, protocol, port } = window.location;
  const isLocalHost = hostname === "localhost" || hostname === "127.0.0.1";

  if (!isLocalHost) return;
  if (hostname === "localhost" && port === "8000") return;

  try {
    await fetch("http://localhost:8000/__naamin-auth-ready", {
      mode: "no-cors",
      cache: "no-store"
    });

    const nextUrl = `${protocol}//localhost:8000${pathname}${search}${hash}`;
    window.location.replace(nextUrl);
  } catch (error) {
    // Stay on the current origin if the dedicated auth server is not running.
  }
})();
