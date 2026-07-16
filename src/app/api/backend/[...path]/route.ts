// app/api/backend/[...path]/route.ts
//
// Browser  ──(cookie, same-origin)──>  this route  ──(x-user-email, verified)──>  Express
//
// No shared secret. Trust boundary is: Express must NOT be reachable from
// the public internet directly (bind it to localhost, a private network,
// or firewall it so only this Next.js server can reach it). This route is
// the only thing allowed to talk to Express, and it only forwards a request
// after confirming a real Better Auth session exists.
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const EXPRESS_URL = process.env.EXPRESS_API_URL || "http://localhost:8000";

async function handler(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  // Verify the caller's Better Auth session (reads the cookie on this request)
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user?.email) {
    return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
  }

  const { path } = await params;
  const targetPath = path.join("/");
  const targetUrl = `${EXPRESS_URL}/api/${targetPath}${req.nextUrl.search}`;

  const init: RequestInit = {
    method: req.method,
    headers: {
      "Content-Type": req.headers.get("content-type") || "application/json",
      "x-user-email": session.user.email,
    },
  };

  if (!["GET", "HEAD"].includes(req.method)) {
    const bodyText = await req.text();
    if (bodyText) init.body = bodyText;
  }

  try {
    const expressRes = await fetch(targetUrl, init);
    const data = await expressRes.text();
    return new NextResponse(data, {
      status: expressRes.status,
      headers: {
        "Content-Type": expressRes.headers.get("content-type") || "application/json",
      },
    });
  } catch (err: any) {
    console.error("Backend proxy error:", err);
    return NextResponse.json(
      { success: false, message: "Could not reach the API server" },
      { status: 502 }
    );
  }
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as DELETE,
  handler as PATCH,
};