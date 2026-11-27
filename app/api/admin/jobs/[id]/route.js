import { getAdminSession, isSameOrigin } from "../../../../../lib/admin-auth.js";
import {
  deleteJob,
  findJobById,
  updateJob,
} from "../../../../../lib/jobs.js";
import {
  JobValidationError,
  validateJobInput,
} from "../../../../../lib/job-validation.js";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const jsonError = (error, status) =>
  Response.json({ error }, { status, headers: { "Cache-Control": "no-store" } });
const validId = (id) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);

async function authorize(request) {
  if (!isSameOrigin(request)) return jsonError("Request origin could not be verified.", 403);
  if (!(await getAdminSession(request))) return jsonError("Sign in to manage jobs.", 401);
  return null;
}

export async function GET(request, { params }) {
  if (!(await getAdminSession(request))) return jsonError("Sign in to manage jobs.", 401);
  const { id } = await params;
  if (!validId(id)) return jsonError("Job not found.", 404);

  try {
    const job = await findJobById(id);
    return job
      ? Response.json({ job }, { headers: { "Cache-Control": "no-store" } })
      : jsonError("Job not found.", 404);
  } catch (error) {
    console.error("Could not load admin job.", error);
    return jsonError("Job details are temporarily unavailable.", 503);
  }
}

export async function PATCH(request, { params }) {
  const authorizationError = await authorize(request);
  if (authorizationError) return authorizationError;
  const { id } = await params;
  if (!validId(id)) return jsonError("Job not found.", 404);
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
    const updated = await updateJob(id, job);
    return updated
      ? Response.json({ job: updated }, { headers: { "Cache-Control": "no-store" } })
      : jsonError("Job not found.", 404);
  } catch (error) {
    if (error.code === "23505") {
      return jsonError("A job with a matching URL already exists. Edit its title first.", 409);
    }
    console.error("Could not update job.", error);
    return jsonError("The job could not be updated.", 503);
  }
}

export async function DELETE(request, { params }) {
  const authorizationError = await authorize(request);
  if (authorizationError) return authorizationError;
  const { id } = await params;
  if (!validId(id)) return jsonError("Job not found.", 404);

  try {
    if (!(await deleteJob(id))) return jsonError("Job not found.", 404);
    return new Response(null, {
      status: 204,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Could not delete job.", error);
    return jsonError("The job could not be deleted.", 503);
  }
}
