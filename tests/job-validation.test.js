import assert from "node:assert/strict";
import test from "node:test";
import { JobValidationError, slugify, validateJobInput } from "../lib/job-validation.js";

test("job slugs are URL-safe and retain meaningful Unicode letters", () => {
  assert.equal(slugify("  Oracle HCM — Consultant  "), "oracle-hcm-consultant");
  assert.equal(slugify("Café & Benefits"), "cafe-benefits");
  assert.equal(slugify("你好"), "");
});

test("job validation normalizes input and keeps publication status explicit", () => {
  const job = validateJobInput({
    title: " Oracle HCM Consultant ",
    location: " Noida ",
    employmentType: "Full Time",
    skills: ["Core HR", "Core HR", " Compensation "],
    status: "open",
    closingDate: "2028-02-29",
  });

  assert.deepEqual(job, {
    title: "Oracle HCM Consultant",
    slug: "oracle-hcm-consultant",
    location: "Noida",
    employmentType: "Full Time",
    department: "Consulting",
    experience: "",
    description: "",
    skills: ["Core HR", "Compensation"],
    status: "open",
    closingDate: "2028-02-29",
  });
});

test("job validation rejects invalid status, skills, and calendar dates", () => {
  const base = {
    title: "Oracle HCM Consultant",
    location: "Noida",
    employmentType: "Full Time",
    skills: [],
  };

  for (const input of [
    { ...base, status: "published" },
    { ...base, status: null },
    { ...base, skills: "Core HR" },
    { ...base, closingDate: "2027-02-29" },
    { ...base, closingDate: false },
    { ...base, title: "Oracle\u0000HCM" },
  ]) {
    assert.throws(() => validateJobInput(input), JobValidationError);
  }
});
