import { expiredSessionCookie, isSameOrigin } from "../../../../lib/admin-auth.js";

export async function POST(request) {
  if (!isSameOrigin(request)) {
    return Response.json(
      { error: "The sign-out request origin could not be verified." },
      { status: 403, headers: { "Cache-Control": "no-store" } },
    );
  }

  return new Response(null, {
    status: 204,
    headers: {
      "Cache-Control": "no-store",
      "Set-Cookie": expiredSessionCookie(),
    },
  });
}
