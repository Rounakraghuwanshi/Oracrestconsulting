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

## Production

Run `npm run build` and `npm start`, or deploy the project to a Node.js-compatible Next.js host. Configure the environment variables in the host's deployment settings.
