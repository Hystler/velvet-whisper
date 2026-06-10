export const ADMIN_COOKIE_NAME = "velvet_whisper_admin";
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24;

function getNowInSeconds() {
  return Math.floor(Date.now() / 1000);
}

function encodeBase64Url(bytes: Uint8Array) {
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function decodeBase64Url(value: string) {
  const normalized = value.replaceAll("-", "+").replaceAll("_", "/");
  const padded = normalized.padEnd(
    normalized.length + ((4 - (normalized.length % 4)) % 4),
    "="
  );
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

async function importSigningKey(secret: string) {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    {
      name: "HMAC",
      hash: "SHA-256"
    },
    false,
    ["sign", "verify"]
  );
}

async function signPayload(payload: string, secret: string) {
  const key = await importSigningKey(secret);
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload)
  );

  return encodeBase64Url(new Uint8Array(signature));
}

export async function createAdminSessionToken(secret: string) {
  const issuedAt = getNowInSeconds();
  const payload = `admin:${issuedAt}`;
  const signature = await signPayload(payload, secret);

  return `${issuedAt}.${signature}`;
}

export async function verifyAdminSessionToken(
  token: string | undefined,
  secret: string
) {
  if (!token) {
    return false;
  }

  const [issuedAtValue, signatureValue] = token.split(".");
  const issuedAt = Number(issuedAtValue);
  const now = getNowInSeconds();

  if (
    !Number.isInteger(issuedAt) ||
    !signatureValue ||
    issuedAt > now ||
    now - issuedAt > ADMIN_SESSION_MAX_AGE
  ) {
    return false;
  }

  try {
    const key = await importSigningKey(secret);

    return crypto.subtle.verify(
      "HMAC",
      key,
      decodeBase64Url(signatureValue),
      new TextEncoder().encode(`admin:${issuedAt}`)
    );
  } catch {
    return false;
  }
}

