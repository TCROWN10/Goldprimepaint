import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, verifyAdminSession } from "@/lib/admin-auth";
import { saveUploadedImage, storageReady, storageSetupMessage } from "@/lib/site-storage";

export const runtime = "nodejs";

const MAX_BYTES = 8 * 1024 * 1024;

async function authorized() {
  const jar = await cookies();
  return verifyAdminSession(jar.get(ADMIN_COOKIE)?.value);
}

export async function POST(request: Request) {
  if (!(await authorized())) {
    return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  }

  if (!storageReady()) {
    return NextResponse.json({ error: storageSetupMessage() }, { status: 503 });
  }

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Choose a photo from your device." }, { status: 400 });
  }

  if (file.size <= 0 || file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Photo must be under 8MB." }, { status: 400 });
  }

  try {
    const url = await saveUploadedImage(file);
    return NextResponse.json({ url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not upload photo.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
