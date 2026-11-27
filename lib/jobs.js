import { getPool } from "./db.js";

const columns = `id, title, slug, location, employment_type, department,
  experience, skills, description, status, closing_date, created_at, updated_at`;

export function mapJob(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    location: row.location,
    employmentType: row.employment_type,
    department: row.department,
    experience: row.experience,
    skills: row.skills,
    description: row.description,
    status: row.status,
    published: row.status === "open",
    closingDate: row.closing_date
      ? String(row.closing_date).slice(0, 10)
      : "",
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

export async function listJobs({ publishedOnly = false } = {}) {
  const pool = getPool();
  const result = publishedOnly
    ? await pool.query(
        `SELECT ${columns} FROM jobs WHERE status = 'open' ORDER BY created_at DESC, title ASC`,
      )
    : await pool.query(
        `SELECT ${columns} FROM jobs ORDER BY created_at DESC, title ASC`,
      );
  return result.rows.map(mapJob);
}

export async function findJobById(id) {
  const result = await getPool().query(
    `SELECT ${columns} FROM jobs WHERE id = $1`,
    [id],
  );
  return mapJob(result.rows[0]);
}

export async function findPublishedJobBySlug(slug) {
  const result = await getPool().query(
    `SELECT ${columns} FROM jobs WHERE slug = $1 AND status = 'open'`,
    [slug],
  );
  return mapJob(result.rows[0]);
}

export async function insertJob(job) {
  const result = await getPool().query(
    `INSERT INTO jobs
      (title, slug, location, employment_type, department, experience, skills, description, status, closing_date)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING ${columns}`,
    [
      job.title,
      job.slug,
      job.location,
      job.employmentType,
      job.department,
      job.experience,
      job.skills,
      job.description,
      job.status,
      job.closingDate,
    ],
  );
  return mapJob(result.rows[0]);
}

export async function updateJob(id, job) {
  const result = await getPool().query(
    `UPDATE jobs SET
      title = $2, slug = $3, location = $4, employment_type = $5,
      department = $6, experience = $7, skills = $8, description = $9,
      status = $10, closing_date = $11, updated_at = now()
     WHERE id = $1
     RETURNING ${columns}`,
    [
      id,
      job.title,
      job.slug,
      job.location,
      job.employmentType,
      job.department,
      job.experience,
      job.skills,
      job.description,
      job.status,
      job.closingDate,
    ],
  );
  return mapJob(result.rows[0]);
}

export async function deleteJob(id) {
  const result = await getPool().query(
    "DELETE FROM jobs WHERE id = $1 RETURNING id",
    [id],
  );
  return result.rowCount > 0;
}
