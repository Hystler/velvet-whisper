"use client";

import { useActionState } from "react";
import { loginAdmin } from "@/app/admin/auth-actions";

const initialState = {
  message: ""
};

export function AdminLoginForm({ nextPath }: { nextPath: string }) {
  const [state, formAction, isPending] = useActionState(
    loginAdmin,
    initialState
  );

  return (
    <form action={formAction} className="mt-8 space-y-5">
      <input type="hidden" name="next" value={nextPath} />
      <label className="block">
        <span className="eyebrow text-taupe">Пароль</span>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          className="input-surface mt-3"
          placeholder="Введите пароль админки"
          required
        />
      </label>
      {state.message ? (
        <p className="border border-[#b58a6c] bg-[#fff8ef] px-4 py-3 text-sm text-brown">
          {state.message}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={isPending}
        className="primary-button w-full disabled:cursor-not-allowed disabled:bg-taupe/50"
      >
        {isPending ? "Проверяем..." : "Войти"}
      </button>
    </form>
  );
}

