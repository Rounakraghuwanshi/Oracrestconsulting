import { siteConfig } from "../../../lib/site-config.js";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_REQUEST_SIZE = MAX_FILE_SIZE + 100 * 1024;
const acceptedResumeTypes = new Map([
  [".pdf", ["application/pdf"]],
  [".doc", ["application/msword", "application/octet-stream"]],
  [
    ".docx",
    [
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/octet-stream",
    ],
  ],
]);

function text(form, key, maxLength = 4000) {
  const value = form.get(key);
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

function emailHtml(kind, fields) {
  const rows = Object.entries(fields)
    .filter(([, value]) => value)
    .map(
      ([label, value]) =>
        `<tr><th align="left" style="padding:8px 12px;border-bottom:1px solid #e2e6ec">${escapeHtml(label)}</th><td style="padding:8px 12px;border-bottom:1px solid #e2e6ec">${escapeHtml(value).replace(/\n/g, "<br>")}</td></tr>`,
    )
    .join("");

  return `<div style="font-family:Arial,sans-serif;color:#121826"><h2>ORACREST website ${kind === "application" ? "job application" : "enquiry"}</h2><table style="border-collapse:collapse;width:100%;max-width:680px">${rows}</table></div>`;
}

function jsonError(message, status) {
  return Response.json({ error: message }, { status });
}

export async function POST(request) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_REQUEST_SIZE) {
    return jsonError("The submitted form is too large.", 413);
  }

  let form;
  try {
    form = await request.formData();
  } catch {
    return jsonError("Please submit the form using the website.", 400);
  }

  const kind = text(form, "kind", 20);
  if (kind !== "application" && kind !== "enquiry") {
    return jsonError("The form type is invalid.", 400);
  }

  const fields = {
    "Full name": text(form, "name", 160),
    Email: text(form, "email", 254),
    Phone: text(form, "phone", 80),
    ...(kind === "application"
      ? {
          Location: text(form, "location", 160),
          Experience: text(form, "experience", 120),
          Expertise: text(form, "expertise", 120),
          "LinkedIn profile": text(form, "linkedin", 500),
        }
      : {
          Company: text(form, "company", 200),
          Service: text(form, "service", 160),
        }),
    Message: text(form, "message", 4000),
  };

  if (!fields["Full name"] || !fields.Email) {
    return jsonError("Please provide your name and email address.", 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.Email)) {
    return jsonError("Please provide a valid email address.", 400);
  }
  if (fields["LinkedIn profile"]) {
    try {
      const profile = new URL(fields["LinkedIn profile"]);
      if (profile.protocol !== "https:" || profile.hostname !== "www.linkedin.com" && profile.hostname !== "linkedin.com") {
        return jsonError("Please provide a valid LinkedIn profile URL.", 400);
      }
    } catch {
      return jsonError("Please provide a valid LinkedIn profile URL.", 400);
    }
  }

  const attachments = [];
  if (kind === "application") {
    const resume = form.get("resume");
    if (resume instanceof File && resume.size > 0) {
      const extension = resume.name.slice(resume.name.lastIndexOf(".")).toLowerCase();
      const supportedTypes = acceptedResumeTypes.get(extension);
      if (!supportedTypes || !supportedTypes.includes(resume.type)) {
        return jsonError("Upload a PDF, DOC, or DOCX resume.", 400);
      }
      if (resume.size > MAX_FILE_SIZE) {
        return jsonError("Resume files must be 5 MB or smaller.", 413);
      }
      attachments.push({
        filename: resume.name.replace(/[^\w.-]/g, "_").slice(0, 120),
        content: Buffer.from(await resume.arrayBuffer()).toString("base64"),
      });
    }
  }

  const recipient = process.env.CONTACT_EMAIL || siteConfig.email;
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) {
    console.error("Form delivery is unavailable: RESEND_API_KEY and EMAIL_FROM must be configured.");
    return jsonError("Form delivery is temporarily unavailable. Please try again later.", 503);
  }

  const payload = {
    from: process.env.EMAIL_FROM,
    to: [recipient],
    reply_to: fields.Email,
    subject: kind === "application"
      ? "ORACREST career application"
      : "ORACREST website enquiry",
    html: emailHtml(kind, fields),
    ...(attachments.length ? { attachments } : {}),
  };

  let delivery;
  try {
    delivery = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000),
      cache: "no-store",
    });
  } catch (error) {
    console.error("Email provider request failed.", error);
    return jsonError("We could not send your message. Please try again later.", 502);
  }

  if (!delivery.ok) {
    console.error(`Email provider rejected form submission with status ${delivery.status}.`);
    return jsonError("We could not send your message. Please try again later.", 502);
  }

  return Response.json({
    message: kind === "application"
      ? "Your application has been sent. Thank you for your interest."
      : "Your enquiry has been sent. We’ll be in touch soon.",
  });
}
