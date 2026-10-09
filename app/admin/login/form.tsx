"use client";
import { useActionState } from "react";
import { login } from "../actions";
export default function LoginForm() {
  const [state, action, pending] = useActionState(login, { error: "" });
  return <form action={action} className="space-y-5">
    <div><label htmlFor="email" className="block text-sm font-medium mb-2">Email address</label><input id="email" name="email" type="email" autoComplete="username" maxLength={254} required className="w-full rounded-lg border border-stone-300 p-3" /></div>
    <div><label htmlFor="password" className="block text-sm font-medium mb-2">Password</label><input id="password" name="password" type="password" autoComplete="current-password" maxLength={1024} required className="w-full rounded-lg border border-stone-300 p-3" /></div>
    {state.error && <p role="alert" className="text-sm text-red-700">{state.error}</p>}
    <button disabled={pending} className="w-full rounded-lg bg-stone-900 text-white p-3 font-medium disabled:opacity-50">{pending ? "Signing in…" : "Sign in"}</button>
  </form>;
}
