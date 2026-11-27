import { findPublishedJobBySlug } from "../../../../lib/jobs.js";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_request, { params }) {
  const { slug } = await params;
  if (typeof slug !== "string" || slug.length > 180) {
    return Response.json({ error: "Job not found." }, { status: 404, headers: { "Cache-Control": "no-store" } });
  }

  try {
    const job = await findPublishedJobBySlug(slug);
    return job
      ? Response.json({ job }, { headers: { "Cache-Control": "no-store" } })
      : Response.json({ error: "Job not found." }, { status: 404, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Could not load the published job.", error);
    return Response.json(
      { error: "Job details are temporarily unavailable." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
