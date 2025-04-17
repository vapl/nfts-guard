import FingerprintJS from "@fingerprintjs/fingerprintjs";

export const getClientInfo = async () => {
  // Inicializē FingerprintJS
  const fp = await FingerprintJS.load();
  const result = await fp.get();
  const fingerprint = result.visitorId;

  let ip = "";
  try {
    ip = await fetch("/api/user-ip").then((res) => res.text());
  } catch (e) {
    console.error("❌ Failed to fetch IP:", e);
  }

  // Fallback, ja IP ir undefined vai lokāls
  const invalidIps = ["", "::1", "127.0.0.1", "0.0.0.0", "undefined"];
  if (invalidIps.includes(ip)) {
    ip = `anon-${fingerprint}`;
  }

  const userAgent = navigator.userAgent;

  return {
    ip,
    fingerprint,
    userAgent,
  };
};
