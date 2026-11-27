CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(160) NOT NULL,
  slug VARCHAR(180) NOT NULL UNIQUE,
  location VARCHAR(160) NOT NULL,
  employment_type VARCHAR(40) NOT NULL,
  department VARCHAR(100) NOT NULL DEFAULT 'Consulting',
  experience VARCHAR(120) NOT NULL DEFAULT '',
  skills TEXT[] NOT NULL DEFAULT '{}',
  description TEXT NOT NULL DEFAULT '',
  status VARCHAR(16) NOT NULL DEFAULT 'draft'
    CHECK (status IN ('open', 'draft', 'closed')),
  closing_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX jobs_published_created_idx
  ON jobs (created_at DESC)
  WHERE status = 'open';

CREATE TABLE admin_login_attempts (
  ip_hash CHAR(64) NOT NULL,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX admin_login_attempts_recent_idx
  ON admin_login_attempts (ip_hash, attempted_at DESC);

INSERT INTO jobs
  (title, slug, location, employment_type, department, skills, status)
VALUES
  (
    'Oracle Fusion HCM Functional Consultant',
    'oracle-fusion-hcm-functional-consultant',
    'India',
    'Full Time',
    'Consulting',
    ARRAY['Core HR', 'Compensation', 'Benefits', 'Talent Management', 'HCM Business Processes'],
    'open'
  ),
  (
    'Oracle Fusion HCM Consultant — Compensation & Benefits',
    'oracle-fusion-hcm-consultant-compensation-benefits',
    'India',
    'Full Time',
    'Consulting',
    ARRAY['Workforce Compensation', 'Individual Compensation', 'Salary', 'Compensation Plans', 'Benefits', 'Oracle HCM Cloud'],
    'open'
  );
