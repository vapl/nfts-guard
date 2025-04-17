import FingerprintJS from "@fingerprintjs/fingerprintjs";

export const getClientInfo = async () => {
  const fp = await FingerprintJS.load();
  const result = await fp.get();
  const ip = await fetch("/api/user-ip").then((res) => res.text());
  const userAgent = navigator.userAgent;

  return {
    ip,
    fingerprint: result.visitorId,
    userAgent,
  };
};
