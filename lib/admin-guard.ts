import { redirect } from "next/navigation";
import { getAdminAccessState } from "@/lib/admin-auth";

export async function requireAdminAccess() {
  const state = await getAdminAccessState();

  if (!state.enabled) {
    return "disabled" as const;
  }

  if (!state.passwordConfigured) {
    return "password-missing" as const;
  }

  if (!state.authenticated) {
    redirect("/admin/login");
  }

  return "granted" as const;
}

