# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Networking Buddy** — a job search networking tracker that helps manage contacts, track outreach/follow-ups/thank-you notes, log conversation context, and surface action items driven by configurable networking rules. Built for MPCS 51238 (Design, Build, Ship) Assignment 2.

Data lives in client-side React state only — it resets on page refresh. A database will be added in a future assignment.

## Tech Stack

- Next.js 16.2.2 (App Router, `src/` directory)
- React 19 with Context + useReducer for state management
- TypeScript (strict mode)
- Tailwind CSS 4 (CSS-first config via `@theme inline` in `globals.css` — no `tailwind.config.js`)
- No external dependencies beyond the scaffold

## Commands

- `npm run dev` — start dev server (Turbopack)
- `npm run build` — production build
- `npm run start` — serve production build
- `npm run lint` — ESLint

## Pages & Routes

| Route | Page | Key feature |
|-------|------|-------------|
| `/` | Dashboard | Stats, contacts needing attention, today's actions |
| `/contacts` | Contacts List | Search, filter by status |
| `/contacts/new` | Add Contact | Form with how-we-met dropdown |
| `/contacts/[id]` | Contact Detail | Profile, interaction timeline, inline action management |
| `/actions` | Action Items | Due-date sorted, message templates with copy-to-clipboard |
| `/settings` | Settings | Configurable networking rule thresholds |

## Data Model

Three core entities in `src/lib/types.ts`:

- **Contact** — name, company, role, email, linkedIn, howWeMet (predefined categories), status (lead/warm/hot/active/cold/inactive), tags
- **Interaction** — linked to contact; types: outreach, coffee-chat, follow-up, thank-you, referral, interview, other
- **Action** — linked to contact; types: send-followup, send-thankyou, schedule-chat, send-outreach, apply, other. Includes priority, due date, and a message template with auto-filled placeholders.
- **NetworkingRules** — configurable thresholds: thankYouDeadlineHours (24), followUpNoResponseDays (7), warmContactReengageDays (14), coldContactReengageDays (30)

## State Management

React Context + useReducer in `src/lib/context/`. The `AppProvider` wraps children in the root layout (which stays a Server Component). All page/component files needing state are Client Components (`"use client"`).

## Architecture Decisions

- `useParams()` from `next/navigation` for the dynamic route (`/contacts/[id]`) — Client Component pattern
- `crypto.randomUUID()` for IDs, `Intl.RelativeTimeFormat` for relative dates — no utility libraries
- Logging an interaction auto-creates an action item with a due date based on the networking rules
- Message templates auto-fill placeholders from contact/interaction context; `{___}` marks fields for the user to complete
- Seed data (5 sample contacts) is pre-loaded so the app demonstrates all features on first load

## Design

Clean & minimal — indigo-600 primary, amber-500 accent for urgency, stone-50 background, Geist Sans typography. Status badges are color-coded: lead=slate, cold=blue, warm=amber, hot=red, active=emerald, inactive=stone.
