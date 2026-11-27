import { getAdminSession, isSameOrigin } from "../../../../lib/admin-auth.js";
import { insertJob, listJobs } from "../../../../lib/jobs.js";
import { JobValidationError, validateJobInput } from "../../../../lib/job-validation.js";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const jsonError = (error, status) =>
  Response.json({ error }, { status, headers: { "Cache-Control": "no-store" } });

export async function GET(request) {
  if (!(await getAdminSession(request))) {
    return jsonError("Sign in to manage jobs.", 401);
  }

  try {
    return Response.json(
      { jobs: await listJobs() },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Could not load admin jobs.", error);
    return jsonError("Jobs are temporarily unavailable.", 503);
  }
}

export async function POST(request) {
  if (!isSameOrigin(request)) return jsonError("Request origin could not be verified.", 403);
  if (!(await getAdminSession(request))) return jsonError("Sign in to manage jobs.", 401);
  if (Number(request.headers.get("content-length") || 0) > 65536) {
    return jsonError("The job details are too large.", 413);
  }

  let job;
  try {
    job = validateJobInput(await request.json());
  } catch (error) {
    if (error instanceof JobValidationError) return jsonError(error.message, 400);
    if (error instanceof SyntaxError) return jsonError("Submit job details as valid JSON.", 400);
    throw error;
  }

  try {
    return Response.json(
      { job: await insertJob(job) },
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    if (error.code === "23505") {
      return jsonError("A job with a matching URL already exists. Edit its title first.", 409);
    }
    console.error("Could not create job.", error);
    return jsonError("The job could not be saved.", 503);
  }
}
