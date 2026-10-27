import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, verifyAdminSession } from "@/lib/admin-auth";
import { getSiteContent, saveSiteContent, type SiteContent } from "@/lib/content";

export const runtime = "nodejs";

async function authorized() {
  const jar = await cookies();
  return verifyAdminSession(jar.get(ADMIN_COOKIE)?.value);
}

export async function GET() {
  if (!(await authorized())) {
    return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  }
  return NextResponse.json(await getSiteContent());
}

export async function PUT(request: Request) {
  if (!(await authorized())) {
    return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  }
  const body = (await request.json().catch(() => null)) as Partial<SiteContent> | null;
  if (!body) {
    return NextResponse.json({ error: "Nothing to save." }, { status: 400 });
  }
  try {
    const content = await saveSiteContent(body);
    return NextResponse.json(content);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not save.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
