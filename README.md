# Hammet B2C

The B2C frontend for the Hammet AI Career Platform.

Hammet B2C is the individual learning experience for learners, facilitators, and B2C administrators.

Built with:

* Next.js
* TypeScript
* Tailwind CSS
* React
* FastAPI backend

The B2C frontend communicates with the shared Hammet API rather than accessing the database directly.

```text
Hammet B2C
app.hammetedu.com
       ↓
Hammet API
api.hammetedu.com
       ↓
PostgreSQL
```

---

## Product Architecture

Hammet has separate B2B and B2C product experiences over a shared backend.

### B2C

```text
Frontend: app.hammetedu.com
Scope: b2c
```

### B2B

```text
Frontend: schools.hammetedu.com
Scope: b2b
```

Both products use the shared API:

```text
api.hammetedu.com
```

The frontend determines its product context from the authenticated user's scope.

For B2C:

```text
scope = b2c
```

A user whose scope belongs to another product should not remain inside the B2C application.

---

# Requirements

* Node.js
* npm, pnpm, yarn, or bun
* Access to the Hammet API

Check the project's `package.json` for the expected Node.js version and available scripts.

---

# Getting Started

## 1. Clone the repository

```bash
git clone <repo-url>

cd <repository-directory>
```

## 2. Install dependencies

Using npm:

```bash
npm install
```

Or:

```bash
yarn install
```

```bash
pnpm install
```

```bash
bun install
```

---

# Environment Variables

Create a `.env.local` file in the project root.

The exact variables should match the current frontend configuration.

At minimum, the frontend needs to know which Hammet API environment it should communicate with.

For local development, this will typically point to the local backend.

For shared development, it can point to the development API.

For example:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Do not commit `.env.local`.

Environment-specific values should remain outside the repository.

---

# Running the Development Server

Start the development server:

```bash
npm run dev
```

Or:

```bash
yarn dev
```

```bash
pnpm dev
```

```bash
bun dev
```

Open:

```text
http://localhost:3000
```

The application will automatically update as files are edited.

---

# Backend API

The B2C frontend does not contain the application's core business logic.

API requests are sent to the Hammet backend.

Local development:

```text
http://localhost:8000
```

Shared development API:

```text
<development-api-url>
```

Staging:

```text
<staging-api-url>
```

Production:

```text
api.hammetedu.com
```

The backend is responsible for:

* Authentication
* Authorization
* Business logic
* Database access
* Course data
* Learning data
* Submissions
* Progress
* Administrative permissions
* Other server-side application rules

Do not bypass the API to access application data directly.

---

# Authentication and Authorization

Hammet separates:

```text
Role
Scope
Access
```

Current roles include:

```text
hammet_admin
school_admin
student
facilitator
learner
```

B2C users operate within:

```text
scope = b2c
```

A learner:

```json
{
  "role": "learner",
  "scope": "b2c",
  "access": null
}
```

A facilitator:

```json
{
  "role": "facilitator",
  "scope": "b2c",
  "access": ["courses"]
}
```

A B2C Hammet administrator may have:

```json
{
  "role": "hammet_admin",
  "scope": "b2c",
  "access": ["courses", "admins"]
}
```

The frontend may use these values to determine what should be rendered and which product context the user belongs to.

However:

> Frontend authorization is not a security boundary.

The backend must enforce authorization independently.

---

# Product Routing

The B2C application is intended for users whose authenticated scope is:

```text
b2c
```

When authentication succeeds, the frontend should evaluate the user's scope.

Conceptually:

```text
Login
  ↓
JWT
  ↓
Read scope
  ↓
scope = b2c?
  ├── Yes → remain in B2C
  └── No  → route to the appropriate product
```

For example, a B2B user entering the B2C application should be redirected to:

```text
schools.hammetedu.com
```

Product scope and functional access should not be treated as the same thing.

---

# B2C User Types

## Learner

Learners are the primary B2C learning users.

They use the platform to:

* Discover available learning experiences.
* Access courses.
* Complete modules and lessons.
* Complete activities.
* Submit work.
* Track learning progress.

The exact learning, assessment, portfolio, payment, and entitlement behavior continues to evolve.

Check the current architecture documentation before implementing behavior in an unresolved area.

## Facilitator

Facilitators operate within B2C and have course-related access.

Their current authorization relationship is:

```text
role = facilitator
scope = b2c
access = courses
```

Facilitator functionality should therefore be protected separately from ordinary learner functionality.

## B2C Administrator

B2C Hammet administrators use:

```text
role = hammet_admin
scope = b2c
```

Functional access may include:

```text
courses
admins
```

Administrative functionality must be protected using both product scope and the appropriate functional access.

---

# Frontend Architecture

The frontend is responsible for:

* Rendering pages.
* Managing UI state.
* Handling user interaction.
* Calling the backend API.
* Presenting API responses.
* Managing client-side application state where appropriate.
* Protecting frontend routes from unauthorized product access.
* Providing the B2C user experience.

The backend is responsible for:

* Business rules.
* Data validation.
* Authorization.
* Database operations.
* Persistent state.
* Server-side security.

Do not move backend business rules into React components simply because they are easier to implement there.

---

# UI and Design System

Hammet uses a deliberate interface design system.

Frontend pages should follow the existing visual language rather than introducing unrelated patterns.

Key principles include:

* Strong visual hierarchy.
* Clear primary actions.
* Generous whitespace.
* Clear grouping of related information.
* Rounded surfaces where appropriate.
* Restrained use of color.
* Meaningful visual feedback.
* Minimal unnecessary UI noise.

Hammet follows **Hick's Law** when designing frontend experiences.

Users should not be presented with unnecessary choices when a simpler interaction can accomplish the same goal.

Use existing design tokens and components where available.

Do not introduce arbitrary Tailwind colors or unrelated visual conventions without a reason.

---

# API Development Workflow

The backend generates an OpenAPI specification from FastAPI.

The API development workflow is:

```text
FastAPI
   ↓
OpenAPI
   ↓
Postman Collection
   ↓
Frontend Development
```

The frontend team can use the shared Postman collection to inspect and test API endpoints without running the backend locally.

For local integration, the frontend can point its API environment at the local FastAPI server.

For shared development, point the application at the development API.

---

# Development Environments

The frontend should be able to work against different backend environments.

Conceptually:

```text
Local frontend
      ↓
Local API
```

or:

```text
Local frontend
      ↓
Development API
```

For final integration:

```text
Frontend
      ↓
Staging API
```

Production:

```text
app.hammetedu.com
      ↓
api.hammetedu.com
```

Environment-specific API URLs must be configured through environment variables.

Do not hard-code production API URLs into development code.

---

# Testing

Run the project's test and validation scripts using the commands defined in `package.json`.

Before opening a pull request:

* Run the relevant tests.
* Check the application in the expected states.
* Test authentication behavior when applicable.
* Test the relevant B2C role.
* Test loading and error states.
* Check responsive behavior.
* Check dark mode where applicable.
* Check protected routes.
* Check API failure behavior.

Do not consider a feature complete simply because the happy path works.

---

# Git

Keep commits focused.

Prefer:

```text
Add learner course page
Add facilitator course management
Fix B2C authentication redirect
Update course empty state
Add API error handling
```

over:

```text
stuff
changes
final
final-final
please-work
```

Do not mix unrelated changes into the same commit unless there is a good reason.

---

# Pull Requests

Before opening a PR:

* Run the relevant checks.
* Check your own diff.
* Remove debugging code.
* Remove unnecessary changes.
* Confirm the feature works in expected states.
* Check mobile and desktop layouts where relevant.
* Check dark mode.
* Update documentation when necessary.
* Confirm API changes are compatible with the current backend contract.

A PR should explain:

### What changed?

Briefly describe the implementation.

### Why?

Explain the problem being solved.

### What should reviewers pay attention to?

Call out anything unusual, risky, or architecturally important.

### How was it tested?

Explain what you actually tested.

Do not write "tested" if you only confirmed that the application builds.

---

# Code Quality

Prefer code that is:

* Readable.
* Predictable.
* Reusable where reuse is meaningful.
* Easy to understand.
* Easy to test.
* Consistent with the existing architecture.

Avoid unnecessary:

* Abstractions.
* Dependencies.
* Component complexity.
* State management.
* Premature optimization.

Keep components focused.

Avoid components that simultaneously handle large amounts of:

* Data fetching.
* Business logic.
* State management.
* API interaction.
* UI rendering.

Follow the existing project structure before introducing new patterns.

---

# AI-Assisted Development

AI development tools are allowed and encouraged when they improve productivity.

You may use tools such as:

* ChatGPT
* Claude
* Cursor
* GitHub Copilot
* Other appropriate development tools

AI-generated code is still your responsibility once committed.

You should understand:

* What the code does.
* Why it works.
* What assumptions it makes.
* What could go wrong.
* How to debug it.

Do not commit code simply because an AI tool generated it.

---

# What We Do Not Do

We do not:

* Blindly copy AI-generated code.
* Rewrite stable systems for fun.
* Introduce dependencies without reason.
* Move backend business logic into the frontend.
* Hide API errors behind misleading UI.
* Make architectural changes silently.
* Introduce unrelated design conventions.
* Optimize prematurely.
* Ignore accessibility or responsive behavior.
* Sacrifice maintainability for short-term speed.

---

# Documentation

If you discover that existing documentation is wrong, update it.

Important documentation includes:

* Architecture.
* API behavior.
* Authentication.
* Authorization.
* Product routing.
* Component conventions.
* Design system conventions.
* Development setup.
* Environment configuration.

Documentation is part of the implementation.

---

# Technical Disagreements

Developers are encouraged to challenge technical decisions.

When proposing an alternative, bring:

* Reasoning.
* Evidence.
* Trade-offs.
* Relevant constraints.

Do not argue purely from personal preference.

If a change materially affects the architecture, document the decision appropriately before implementation.

---

# Ownership

When you take responsibility for a feature, you are responsible for more than making the page render.

You should understand:

* What problem the feature solves.
* Which API endpoints it depends on.
* Which user roles can access it.
* How it behaves when the API fails.
* How it behaves in different application states.
* What could break.
* How it should be tested.
* Whether documentation needs updating.

Ownership does not mean knowing everything.

It means thinking beyond the component you are currently editing.

---

# The Rule Behind All of This

There is no perfect development process.

Hammet is still growing, and our engineering practices will evolve as the company grows.

The principles behind our current process are simple:

**Move quickly.**

**Keep the interface understandable.**

**Keep the frontend and backend boundaries clear.**

**Follow the API contract.**

**Experiment where failure is cheap.**

**Protect the systems where failure is expensive.**

**Take ownership.**

**Communicate early.**

**Challenge decisions with reasoning.**

**Learn continuously.**

**Leave the codebase better than you found it.**
