# Oracrestconsulting

# ORACREST Consulting website

Responsive Next.js website based on the supplied ORACREST design. Routes are `/`, `/about`, `/services`, `/careers`, and `/contact`.

## Run locally

1. Install Node.js 20.9 or later.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` and set the business and email-delivery values.
4. Run `npm run dev`, then open `http://localhost:3000`.

## Contact and application delivery

Forms are handled by the Node.js route at `/api/contact` and delivered using Resend's email API. Set `RESEND_API_KEY` and `EMAIL_FROM` to a verified sender in Resend. `CONTACT_EMAIL` can override the delivery recipient; otherwise `ORACREST_EMAIL` is used. Career applications accept PDF, DOC, or DOCX resumes up to 5 MB.

The email credentials must be configured before production forms can send messages. The route returns an explicit service-unavailable error when delivery is not configured; it does not report unsent forms as successful.

## Careers and admin

Job listings are stored in PostgreSQL. Set `DATABASE_URL` to a managed PostgreSQL connection string, then run `npm run db:migrate` before starting the site. The initial migration creates the jobs and login-rate-limit tables and imports the two supplied job listings. Back up the database before applying future migrations.

The admin dashboard is available at `/admin` and is not linked from public navigation. Admin pages and job-management APIs require the signed, HTTP-only session cookie issued at `/admin/login`. Configure `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, and `ADMIN_SESSION_SECRET` in the deployment environment. Generate a password hash with `npm run admin:hash` (use a unique password of at least 14 characters); generate a session secret with:

```sh
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"
```

Keep the password hash and session secret private. Changing the session secret invalidates existing admin sessions. Use HTTPS in production; the session cookie is marked `Secure` automatically in production. Publish a job by setting its status to Open; Draft and Closed jobs are only visible to signed-in admins. Public Careers listings and job detail pages query the database on request, and application submissions confirm that the selected job is still published.

Run database migrations as a release/deployment step, not during application startup. `npm run db:migrate` loads `.env.local` for local work; production must provide the database URL to the migration command and the running application.

## Production

Run `npm run build` and `npm start`, or deploy the project to a Node.js-compatible Next.js host. Configure the environment variables in the host's deployment settings.
