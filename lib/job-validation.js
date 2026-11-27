const employmentTypes = new Set(["Full Time", "Part Time", "Contract", "Internship"]);
const statuses = new Set(["open", "draft", "closed"]);

export class JobValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "JobValidationError";
  }
}

export function slugify(title) {
  return title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 180)
    .replace(/-+$/g, "");
}

function requiredText(value, label, maxLength) {
  if (typeof value !== "string") {
    throw new JobValidationError(`${label} is required.`);
  }
  const result = value.trim();
  if (!result) throw new JobValidationError(`${label} is required.`);
  if (result.length > maxLength) {
    throw new JobValidationError(`${label} must be ${maxLength} characters or fewer.`);
  }
  if (result.includes("\0")) throw new JobValidationError(`${label} contains an unsupported character.`);
  return result;
}

function optionalText(value, label, maxLength) {
  if (value === undefined || value === null) return "";
  if (typeof value !== "string" || value.length > maxLength) {
    throw new JobValidationError(`${label} must be ${maxLength} characters or fewer.`);
  }
  if (value.includes("\0")) throw new JobValidationError(`${label} contains an unsupported character.`);
  return value.trim();
}

export function validateJobInput(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new JobValidationError("Provide the job details as a JSON object.");
  }

  const title = requiredText(input.title, "Job title", 160);
  const slug = slugify(title);
  if (!slug) throw new JobValidationError("The job title must contain letters or numbers.");

  const location = requiredText(input.location, "Location", 160);
  const employmentType = requiredText(input.employmentType, "Employment type", 40);
  if (!employmentTypes.has(employmentType)) {
    throw new JobValidationError("Select a supported employment type.");
  }

  const department = optionalText(input.department, "Department", 100) || "Consulting";
  const experience = optionalText(input.experience, "Experience", 120);
  const description = optionalText(input.description, "Description", 20000);
  const status = input.status === undefined ? "draft" : input.status;
  if (typeof status !== "string" || !statuses.has(status)) {
    throw new JobValidationError("Select Open, Draft, or Closed for the job status.");
  }

  if (!Array.isArray(input.skills) || input.skills.length > 30) {
    throw new JobValidationError("Provide up to 30 job skills.");
  }
  const skills = [...new Set(input.skills.map((skill) => {
    if (typeof skill !== "string" || skill.trim().length > 80) {
      throw new JobValidationError("Each skill must be 80 characters or fewer.");
    }
    if (skill.includes("\0")) {
      throw new JobValidationError("Skills cannot contain unsupported characters.");
    }
    return skill.trim();
  }).filter(Boolean))];

  let closingDate = null;
  if (
    input.closingDate !== undefined &&
    input.closingDate !== null &&
    input.closingDate !== ""
  ) {
    if (typeof input.closingDate !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(input.closingDate)) {
      throw new JobValidationError("Provide a valid closing date.");
    }
    const parsedDate = new Date(`${input.closingDate}T00:00:00.000Z`);
    if (Number.isNaN(parsedDate.valueOf()) || parsedDate.toISOString().slice(0, 10) !== input.closingDate) {
      throw new JobValidationError("Provide a valid closing date.");
    }
    closingDate = input.closingDate;
  }

  return {
    title,
    slug,
    location,
    employmentType,
    department,
    experience,
    description,
    skills,
    status,
    closingDate,
  };
}
