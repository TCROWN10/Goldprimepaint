"use client";

import Image from "next/image";
import { useRef, useState } from "react";

type ImageUploadFieldProps = {
  label: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
};

export function ImageUploadField({
  label,
  value,
  onChange,
  hint = "Choose a photo from your phone or computer.",
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [showLink, setShowLink] = useState(false);

  async function upload(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: form,
      });
      const body = await response.json().catch(() => null);
      if (!response.ok) {
        setError(body?.error || "Could not upload that photo.");
        return;
      }
      onChange(String(body.url || ""));
    } catch {
      setError("Could not upload that photo.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="block">
      <span className="admin-field-label">{label}</span>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl border border-ink/10 bg-cream">
          {value ? (
            <Image
              src={value}
              alt=""
              fill
              unoptimized
              sizes="112px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-2 text-center text-[11px] text-ink-muted">
              No photo
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            onChange={(event) => upload(event.target.files?.[0])}
          />
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              disabled={uploading}
              className="admin-btn-primary w-full justify-center disabled:opacity-60 sm:w-auto"
              onClick={() => inputRef.current?.click()}
            >
              {uploading ? "Uploading…" : value ? "Replace photo" : "Upload from device"}
            </button>
            {value ? (
              <button
                type="button"
                className="admin-btn-outline w-full justify-center sm:w-auto"
                onClick={() => onChange("")}
              >
                Remove
              </button>
            ) : null}
            <button
              type="button"
              className="admin-btn-ghost w-full justify-center sm:w-auto"
              onClick={() => setShowLink((open) => !open)}
            >
              {showLink ? "Hide link" : "Paste link"}
            </button>
          </div>
          <p className="text-xs leading-relaxed text-ink-soft">{hint}</p>
          {error ? <p className="text-xs text-[#9b2c2c]">{error}</p> : null}
          {showLink ? (
            <input
              type="text"
              value={value}
              onChange={(event) => onChange(event.target.value)}
              placeholder="/uploads/photo.jpg or https://…"
              className="admin-field-input"
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

type MultiImageUploadProps = {
  label: string;
  values: string[];
  onChange: (urls: string[]) => void;
  hint?: string;
};

export function MultiImageUpload({
  label,
  values,
  onChange,
  hint = "Upload one or more photos from your device.",
}: MultiImageUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function uploadMany(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setError("");
    const next = [...values];
    try {
      for (const file of Array.from(files)) {
        const form = new FormData();
        form.append("file", file);
        const response = await fetch("/api/admin/upload", {
          method: "POST",
          body: form,
        });
        const body = await response.json().catch(() => null);
        if (!response.ok) {
          setError(body?.error || "Could not upload that photo.");
          break;
        }
        next.push(String(body.url || ""));
      }
      onChange(next.filter(Boolean));
    } catch {
      setError("Could not upload that photo.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="block">
      <span className="admin-field-label">{label}</span>
      <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">{hint}</p>
      <div className="mt-3 flex flex-wrap gap-3">
        {values.map((src, index) => (
          <div
            key={`${src}-${index}`}
            className="relative h-24 w-24 overflow-hidden rounded-xl border border-ink/10 bg-cream"
          >
            <Image src={src} alt="" fill unoptimized sizes="96px" className="object-cover" />
            <button
              type="button"
              aria-label="Remove photo"
              className="absolute right-1 top-1 rounded-full bg-ink/80 px-2 py-0.5 text-[10px] text-cream"
              onClick={() => onChange(values.filter((_, i) => i !== index))}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        className="sr-only"
        onChange={(event) => uploadMany(event.target.files)}
      />
      <button
        type="button"
        disabled={uploading}
        className="admin-btn-outline mt-3 w-full justify-center disabled:opacity-60 sm:w-auto"
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? "Uploading…" : "Upload from device"}
      </button>
      {error ? <p className="mt-2 text-xs text-[#9b2c2c]">{error}</p> : null}
    </div>
  );
}
