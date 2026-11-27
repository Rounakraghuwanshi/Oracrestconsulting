"use client";

import { useState } from "react";

const careerFields = [
  { label: "Full Name", name: "name", type: "text", required: true },
  { label: "Email Address", name: "email", type: "email", required: true },
  { label: "Phone Number", name: "phone", type: "tel" },
  { label: "Current Location", name: "location", type: "text" },
  {
    label: "Experience",
    name: "experience",
    type: "text",
    placeholder: "e.g. 3 years",
  },
  {
    label: "Primary Expertise",
    name: "expertise",
    type: "select",
    options: [
      "Core HR",
      "Compensation",
      "Benefits",
      "Talent",
      "Learning",
      "Performance",
      "Recruiting",
      "Technical",
      "Other",
    ],
  },
  {
    label: "Resume (PDF, DOC or DOCX)",
    name: "resume",
    type: "file",
    accept: ".pdf,.doc,.docx",
  },
  { label: "LinkedIn Profile", name: "linkedin", type: "url" },
  { label: "Message", name: "message", type: "textarea", full: true },
];

const enquiryFields = [
  { label: "Full Name", name: "name", type: "text", required: true },
  { label: "Business Email", name: "email", type: "email", required: true },
  { label: "Company", name: "company", type: "text" },
  { label: "Phone Number", name: "phone", type: "tel" },
  {
    label: "Service Required",
    name: "service",
    type: "select",
    full: true,
    options: [
      "Oracle HCM Consulting",
      "HCM Implementation",
      "Compensation & Benefits",
      "HCM Support",
      "HCM Training",
      "Other",
    ],
  },
  { label: "Message", name: "message", type: "textarea", full: true },
];

function Field({ field }) {
  const className = field.full ? "full" : "";
  const common = {
    id: field.name,
    name: field.name,
    required: field.required,
  };

  return (
    <label className={className} htmlFor={field.name}>
      {field.label}
      {field.type === "select" ? (
        <select {...common} defaultValue={field.options[0]}>
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : field.type === "textarea" ? (
        <textarea {...common} rows={4} />
      ) : (
        <input
          {...common}
          type={field.type}
          placeholder={field.placeholder}
          accept={field.accept}
        />
      )}
    </label>
  );
}

export default function ContactForm({ kind }) {
  const [status, setStatus] = useState({ kind: "", message: "" });
  const isApplication = kind === "application";
  const fields = isApplication ? careerFields : enquiryFields;

  async function submitForm(event) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus({ kind: "pending", message: "Sending your message..." });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: new FormData(form),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Your message could not be sent.");

      form.reset();
      setStatus({ kind: "success", message: result.message });
    } catch (error) {
      setStatus({
        kind: "error",
        message: error.message || "A network error prevented the message from being sent.",
      });
    }
  }

  return (
    <form className="form" onSubmit={submitForm}>
      <input type="hidden" name="kind" value={kind} />
      {fields.map((field) => (
        <Field field={field} key={field.name} />
      ))}
      <div className="full">
        <button className="btn" type="submit" disabled={status.kind === "pending"}>
          {isApplication ? "Submit Application" : "Send Enquiry"}
        </button>
        <p
          className={`note${status.kind ? ` ${status.kind}` : ""}`}
          role="status"
          aria-live="polite"
        >
          {status.message}
        </p>
      </div>
    </form>
  );
}
