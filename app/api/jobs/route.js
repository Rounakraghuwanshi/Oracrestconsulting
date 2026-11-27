import { listJobs } from "../../../lib/jobs.js";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    return Response.json(
      { jobs: await listJobs({ publishedOnly: true }) },
      {
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch (error) {
    console.error("Could not load published jobs.", error);
    return Response.json(
      { error: "Job listings are temporarily unavailable." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
