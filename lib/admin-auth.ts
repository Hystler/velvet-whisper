import { cookies } from "next/headers";
import {
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_MAX_AGE,
  createAdminSessionToken,
  verifyAdminSessionToken
} from "@/lib/admin-session";
import { isAdminDemoEnabled } from "@/lib/admin-demo";

export type AdminAccessState = {
  enabled: boolean;
  passwordConfigured: boolean;
  authenticated: boolean;
};

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD;
}

export function isAdminPasswordConfigured() {
  return Boolean(getAdminPassword());
}

async function digestPassword(value: string) {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value)
  );

  return new Uint8Array(digest);
}

function equalBytes(first: Uint8Array, second: Uint8Array) {
  if (first.length !== second.length) {
    return false;
  }

  let diff = 0;

  for (let index = 0; index < first.length; index += 1) {
    diff |= first[index] ^ second[index];
  }

  return diff === 0;
}

export async function verifyAdminPassword(candidate: string) {
  const password = getAdminPassword();

  if (!password) {
    return false;
  }

  const [candidateDigest, passwordDigest] = await Promise.all([
    digestPassword(candidate),
    digestPassword(password)
  ]);

  return equalBytes(candidateDigest, passwordDigest);
}

export async function isAdminAuthenticated() {
  const password = getAdminPassword();

  if (!isAdminDemoEnabled() || !password) {
    return false;
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  return verifyAdminSessionToken(token, password);
}

export async function getAdminAccessState(): Promise<AdminAccessState> {
  const enabled = isAdminDemoEnabled();
  const passwordConfigured = isAdminPasswordConfigured();
  const authenticated =
    enabled && passwordConfigured ? await isAdminAuthenticated() : false;

  return {
    enabled,
    passwordConfigured,
    authenticated
  };
}

export async function setAdminSessionCookie() {
  const password = getAdminPassword();

  if (!password) {
    return;
  }

  const cookieStore = await cookies();
  const token = await createAdminSessionToken(password);

  cookieStore.set({
    name: ADMIN_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: ADMIN_SESSION_MAX_AGE,
    path: "/admin"
  });
}

export async function clearAdminSessionCookie() {
  const cookieStore = await cookies();

  cookieStore.set({
    name: ADMIN_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/admin"
  });
}

