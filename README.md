# Makao Realty

A responsive real-estate website for showcasing property in Kenya. Built with Next.js 16, TypeScript, Tailwind CSS, Prisma and PostgreSQL.

## What’s included

- Responsive homepage, property search and category browsing.
- Persistent light/dark theme toggle, respecting the visitor’s system preference by default.
- Customer registration, sign-in and account page with enquiry history.
- Property detail pages with enquiry forms, related listings and WhatsApp links.
- About and contact pages using configurable contact placeholders.
- Demo listings, marked as illustrative, plus an optional database-backed listing source.
- PostgreSQL schema and seed script for customer accounts, listings, gallery images and enquiries.
- Admin sign-in, property creation/publication/feature controls, deletion and enquiry status management.
- Server-side validation, scrypt-hashed customer passwords, HTTP-only signed sessions, a honeypot and basic per-process throttling for account and enquiry requests.
- Search metadata, Open Graph metadata, sitemap and robots rules.

The included property photos and sample testimonials are illustrative content. Replace them with approved company material before launch. No ownership, legal approval, availability or verification claims are made. Confirm property information independently.

## Requirements

- Node.js 20.9 or later
- npm
- PostgreSQL server running locally

## Local setup (PowerShell)

```powershell
npm install
Copy-Item .env.example .env
```

Edit `.env` and set:

- `DATABASE_URL` to your local PostgreSQL connection string.
- `AUTH_SECRET` to a unique random secret of at least 32 characters.
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and a unique `ADMIN_JWT_SECRET` of at least 32 characters.
- Confirmed business contact details and `NEXT_PUBLIC_SITE_URL`.
- `IMAGE_HOSTNAME` to the exact hostname used by the property image service. The default supports the included Unsplash demo imagery.

Generate a secure local signing secret in PowerShell:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Use a cryptographically secure secret generator for production; do not deploy the sample values.

Generate the Prisma client and apply the database schema:

```powershell
npm run db:generate
npm run db:migrate -- --name init
npm run db:seed
```

Start PostgreSQL locally, then run the website:

```powershell
npm run dev
```

Visit `http://localhost:3000`. Customers can register at `/register`, sign in at `/login`, and review their enquiries at `/account`. Staff can sign in at `/admin/login` using the credentials configured in `.env`. Do not use example credentials in production.

If `DATABASE_URL` is unset, public pages use the clearly identified in-code demo listings; customer accounts, enquiry persistence and the admin dashboard require a database. Database connection errors are reported rather than replaced with demo data.

## Production

1. Provision managed PostgreSQL and configure production environment variables in your hosting provider.
2. Run `npm run db:generate` and `npx prisma migrate deploy` as part of deployment. Seed the demo content only if it is appropriate for the live site.
3. Configure `IMAGE_HOSTNAME` to your image service’s hostname and update property image URLs to use that service.
4. Set the real phone, email, WhatsApp number, office address and canonical website URL. The contact page intentionally does not invent business information.
5. Build and run:

   ```powershell
   npm run build
   npm start
   ```

   For Vercel, connect the repository, set the same environment variables and use the default Next.js build settings. Use a managed PostgreSQL provider reachable from the Vercel deployment.

## Admin and API notes

- Admin login uses a configured single administrator account and an eight-hour, HTTP-only, same-site JWT cookie. Keep the JWT secret private and rotate it if exposed.
- Admin listing APIs validate all fields server-side. New listings can be saved as drafts or published. Image uploads are not built in; provide HTTPS image URLs from the configured image host or integrate a managed image-storage provider.
- Customer passwords are hashed with Node.js scrypt and sessions are signed, HTTP-only, same-site cookies. Password recovery and email verification are not included in this MVP; add them before enabling account recovery or handling sensitive customer workflows.
- Enquiry submissions are stored in PostgreSQL with an optional link to a published listing. The admin view supports new, contacted and closed statuses.
- The in-memory enquiry throttle is a small deployment-level safeguard, not a substitute for a shared rate limiter, CAPTCHA or WAF in a multi-instance production deployment.
- The admin dashboard is for trusted staff only. Use HTTPS and strong unique credentials in production.

## Project structure

```text
src/
  app/                 Next.js pages and route handlers
  components/          Shared UI, forms and admin dashboard
  lib/                 Demo data, database access and authentication
prisma/
  schema.prisma        PostgreSQL data model
  seed.ts              Illustrative demo listing seed
```

## Quality checks

```powershell
npm run build
```
