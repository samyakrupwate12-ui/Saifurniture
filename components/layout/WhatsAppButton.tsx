"use client";

import { usePathname } from "next/navigation";

export default function WhatsAppButton() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <a
      href="https://wa.me/917249228806?text=Hello%20Sai%20Furniture%2C%20I%20would%20like%20to%20enquire%20about%20your%20furniture."
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Sai Furniture on WhatsApp (opens in a new tab)"
      title="Chat on WhatsApp"
      className="fixed right-4 bottom-[calc(5rem+env(safe-area-inset-bottom))] md:right-6 md:bottom-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#128C7E] text-white shadow-lg transition-colors hover:bg-[#075E54] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#128C7E]"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8" aria-hidden="true">
        <path d="M20.52 3.48A11.89 11.89 0 0 0 12.05 0C5.46 0 .1 5.36.1 11.95c0 2.1.55 4.16 1.6 5.98L0 24l6.25-1.64a11.9 11.9 0 0 0 5.8 1.48h.01C18.65 23.84 24 18.48 24 11.9a11.8 11.8 0 0 0-3.48-8.42ZM12.06 21.82a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.71.97.99-3.62-.24-.37a9.88 9.88 0 0 1-1.51-5.26c0-5.48 4.46-9.94 9.94-9.94a9.87 9.87 0 0 1 7.03 2.91 9.87 9.87 0 0 1 2.91 7.03c0 5.48-4.47 9.87-10.01 9.87Zm5.45-7.4c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.88-.78-1.48-1.75-1.65-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49 0 1.47 1.07 2.89 1.22 3.09.15.2 2.1 3.2 5.09 4.49.71.31 1.27.49 1.71.63.72.23 1.37.2 1.89.12.58-.09 1.77-.73 2.02-1.44.25-.72.25-1.34.17-1.47-.07-.13-.27-.2-.57-.35Z" />
      </svg>
    </a>
  );
}
