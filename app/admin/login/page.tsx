import Link from "next/link";
import LoginForm from "./form";
export default function LoginPage() {
  return <main className="min-h-screen bg-stone-100 text-stone-900 flex items-center justify-center p-6"><section className="w-full max-w-md rounded-2xl bg-white border border-stone-200 p-8 shadow-sm">
    <p className="text-xs uppercase tracking-[.2em] text-stone-500">Sai Furniture · Administration</p>
    <h1 className="text-3xl font-semibold mt-3 mb-2">Welcome back</h1><p className="text-stone-600 mb-8">Sign in to manage your furniture business.</p>
    <LoginForm /><Link href="/" className="block text-center text-sm mt-6 underline">Back to website</Link>
  </section></main>;
}
