"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Minus, Plus, X } from "lucide-react";

interface Props {
  src: string;
  productName: string;
  onClose: () => void;
}

export default function ProductImageViewer({ src, productName, onClose }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const element = dialog.current;
    const previousOverflow = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      element?.close();
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <dialog
      ref={dialog}
      aria-label={`${productName} enlarged image`}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      className="fixed inset-0 m-auto h-[92dvh] max-h-none w-[96vw] max-w-7xl overflow-hidden rounded-xl border border-stone-200 bg-white p-0 shadow-xl backdrop:bg-black/80"
    >
      <div className="flex h-16 items-center justify-between gap-2 border-b px-3">
        <p className="min-w-0 truncate font-semibold">{productName}</p>
        <div className="flex shrink-0 items-center gap-1">
          <button type="button" aria-label="Zoom out" disabled={zoom === 1} onClick={() => setZoom(Math.max(1, zoom - 0.5))} className="rounded-lg p-3 hover:bg-stone-100 disabled:opacity-30"><Minus size={20} /></button>
          <button type="button" aria-label="Reset zoom" onClick={() => setZoom(1)} className="rounded-lg px-2 py-3 text-sm hover:bg-stone-100">{zoom * 100}%</button>
          <button type="button" aria-label="Zoom in" disabled={zoom === 3} onClick={() => setZoom(Math.min(3, zoom + 0.5))} className="rounded-lg p-3 hover:bg-stone-100 disabled:opacity-30"><Plus size={20} /></button>
          <button type="button" aria-label="Close image viewer" onClick={onClose} className="rounded-lg p-3 hover:bg-stone-100"><X size={20} /></button>
        </div>
      </div>
      <div className="h-[calc(100%-4rem)] overflow-auto overscroll-contain bg-[#F3EEE6]" tabIndex={0} aria-label="Image: scroll to explore when zoomed">
        <div className="relative" style={{ width: `${zoom * 100}%`, height: `${zoom * 100}%` }}>
          <Image src={src} alt={productName} fill unoptimized className="object-contain" sizes="100vw" />
        </div>
      </div>
    </dialog>
  );
}
