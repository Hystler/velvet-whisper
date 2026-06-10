"use server";

import { redirect } from "next/navigation";
import {
  clearAdminSessionCookie,
  setAdminSessionCookie,
  verifyAdminPassword
} from "@/lib/admin-auth";
import { isAdminDemoEnabled } from "@/lib/admin-demo";

type AdminLoginState = {
  message: string;
};

function getSafeAdminRedirect(value: FormDataEntryValue | null) {
  const path = value?.toString() ?? "/admin";

  if (!path.startsWith("/admin") || path.startsWith("/admin/login")) {
    return "/admin";
  }

  return path;
}

export async function loginAdmin(
  _state: AdminLoginState,
  formData: FormData
): Promise<AdminLoginState> {
  if (!isAdminDemoEnabled()) {
    return {
      message: "Демо-админка отключена."
    };
  }

  if (!process.env.ADMIN_PASSWORD) {
    return {
      message: "ADMIN_PASSWORD не настроен."
    };
  }

  const password = formData.get("password")?.toString() ?? "";

  if (!password) {
    return {
      message: "Введите пароль."
    };
  }

  const passwordIsValid = await verifyAdminPassword(password);

  if (!passwordIsValid) {
    return {
      message: "Неверный пароль."
    };
  }

  await setAdminSessionCookie();
  redirect(getSafeAdminRedirect(formData.get("next")));
}

export async function logoutAdmin() {
  await clearAdminSessionCookie();
  redirect("/admin/login");
}

