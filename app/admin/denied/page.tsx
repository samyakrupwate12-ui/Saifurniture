import Link from "next/link";
import { logout } from "../actions";
export default function DeniedPage() {
  return <main className="min-h-screen bg-stone-100 text-stone-900 p-12"><h1 className="text-2xl font-semibold">Administrator access required</h1><p className="my-4">Ask the Sai Furniture owner to enable your administrator account.</p><form action={logout}><button className="underline">Sign out</button></form><Link className="block mt-4 underline" href="/">Back to website</Link></main>;
}
