import { randomBytes } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { list, put } from "@vercel/blob";

const CONTENT_PATH = "goldprime/site-content.json";
const LOCAL_CONTENT = path.join(process.cwd(), "data", "site-content.json");
const LOCAL_UPLOADS = path.join(process.cwd(), "public", "uploads");

const IMAGE_EXT = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/gif", ".gif"],
]);

function useBlobStorage() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function onVercel() {
  return process.env.VERCEL === "1";
}

export function storageReady() {
  if (useBlobStorage()) return true;
  return !onVercel();
}

export function storageSetupMessage() {
  return "Cloud storage is not connected. Add a Vercel Blob store (BLOB_READ_WRITE_TOKEN) so admin changes can save on the live site.";
}

export async function readContentJson(): Promise<string | null> {
  if (useBlobStorage()) {
    const { blobs } = await list({ prefix: CONTENT_PATH, limit: 10 });
    const blob =
      blobs.find((item) => item.pathname === CONTENT_PATH) ?? blobs[0];
    if (!blob?.url) return null;
    const response = await fetch(blob.url, { cache: "no-store" });
    if (!response.ok) return null;
    return response.text();
  }

  try {
    return await fs.readFile(LOCAL_CONTENT, "utf8");
  } catch {
    return null;
  }
}

export async function writeContentJson(json: string) {
  if (useBlobStorage()) {
    await put(CONTENT_PATH, json, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
      cacheControlMaxAge: 60,
    });
    return;
  }

  if (onVercel()) {
    throw new Error(storageSetupMessage());
  }

  await fs.mkdir(path.dirname(LOCAL_CONTENT), { recursive: true });
  await fs.writeFile(LOCAL_CONTENT, json);
}

export async function saveUploadedImage(file: File) {
  const ext = IMAGE_EXT.get(file.type);
  if (!ext) {
    throw new Error("Use a JPG, PNG, WEBP, or GIF photo.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const name = `${Date.now()}-${randomBytes(4).toString("hex")}${ext}`;

  if (useBlobStorage()) {
    const blob = await put(`goldprime/uploads/${name}`, buffer, {
      access: "public",
      contentType: file.type,
      addRandomSuffix: false,
    });
    return blob.url;
  }

  if (onVercel()) {
    throw new Error(storageSetupMessage());
  }

  await fs.mkdir(LOCAL_UPLOADS, { recursive: true });
  await fs.writeFile(path.join(LOCAL_UPLOADS, name), buffer);
  return `/uploads/${name}`;
}
