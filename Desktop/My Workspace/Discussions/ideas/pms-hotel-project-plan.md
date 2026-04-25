# PMS Hotel Project — Plan

*Date: 2026-04-26*
*Status: Discussion stage — not yet started*
*Client: Darshan's friend (family hotel business)*

---

## Client Profile
- Single hotel, medium level, stay only (no restaurant)
- Family-owned business
- Currently paying ~₹30K/month for PMS (unconfirmed)
- Unknown current PMS — friend is the tech-aware family member
- Key pain point: Invoicing (GST flexibility, discounts, product selection)

---

## Requirements (9 items → 3 products)

### Product 1: Core PMS (Phase 1)
1. Room Management — room status, types, pricing, availability
2. Booking Management — online + walk-in, booking ID generation
3. Booking Engine — guest-facing website with search, rooms, booking flow
4. Invoices — flexible GST slab selection (not fixed), product-wise and invoice-level discounts (% or fixed amount), select any product
5. FAQs — admin-editable

### Product 2: Business Operations (Phase 2)
6. Staff Management — profiles, roles, shifts
7. Expense Management — categories, tracking, reports
8. Payroll Management — salary tracking (basic), attendance

### Product 3: Channel Manager (Phase 3)
9. Partner Bookings — MakeMyTrip, GoIbibo integration

---

## Phased Build Plan

### Phase 1: Core PMS — 4-5 weeks
**Goal:** Replace his current PMS for daily operations

| Module | Time | Details |
|---|---|---|
| Project setup (Next.js, PostgreSQL, auth) | 3-4 days | Tech stack, schema design, RBAC |
| Room Management | 3-4 days | CRUD, status tracking (available/occupied/maintenance/cleaning), room types, pricing |
| Booking — Walk-in | 3-4 days | Front desk form → room assignment → booking ID |
| Booking — Online | 1 week | Guest-facing flow, date picker, availability, confirmation |
| Booking Engine (website) | 1-2 weeks | Public site — hotel info, room showcase, search, book, payment |
| Invoices | 1-2 weeks | Product selection, flexible GST slabs, dual discount system (product-wise + invoice-level, % or fixed), PDF generation |
| Admin Dashboard | 1 week | Overview, occupancy, revenue, quick actions |
| FAQs | 1 day | Admin-editable FAQ page |
| Razorpay integration | 3-4 days | Online payment for bookings |
| **Total** | **4-5 weeks** | |

**Deliverable:** Working PMS + guest-facing booking website. Hotel can operate daily on this.

### Phase 2: Business Operations — 3-4 weeks
**Goal:** Replace spreadsheets/manual tracking for staff and expenses

| Module | Time | Details |
|---|---|---|
| Staff Management | 3-4 days | Profiles, roles, contact, shifts, basic attendance |
| Expense Management | 1 week | Categories, entry, receipts, monthly reports, approvals |
| Payroll (basic) | 1-2 weeks | Salary tracking, attendance-based calculation, salary slips. NOT full PF/ESI/TDS compliance yet. |
| Reports & Analytics | 1 week | Occupancy trends, revenue reports, expense summaries, staff overview |
| **Total** | **3-4 weeks** | |

**Deliverable:** Complete hotel operations platform — rooms + bookings + staff + money tracking.

### Phase 3: Channel Manager — 3-4 weeks
**Goal:** Sync with OTAs for more bookings

| Module | Time | Details |
|---|---|---|
| Research OTA partner APIs | 1 week | MakeMyTrip/GoIbibo partner registration, API docs, approval process |
| Build integration layer | 2-3 weeks | Rate sync, availability sync, booking import, webhook handling |
| **OR** integrate existing CM | 1-2 weeks | Use SiteMinder/ChannelManager.com API instead of direct OTA integration |
| **Total** | **3-4 weeks** | |

**Note:** Direct OTA integration requires partner registration + approval. Could take weeks for approval alone. Using an existing channel manager API is faster but adds monthly cost.

---

## Tech Stack (Proposed)
- **Frontend:** Next.js 14 (App Router, TypeScript, Tailwind CSS)
- **Backend:** Next.js API routes (or FastAPI if heavy backend needed)
- **Database:** PostgreSQL (Supabase free tier to start)
- **Payments:** Razorpay
- **Auth:** NextAuth.js or custom JWT
- **Hosting:** Netlify/Vercel (frontend) + Supabase (DB) — zero cost to start
- **PDF invoices:** react-pdf or jsPDF

---

## Pricing Strategy (Discussion)

| Model | Amount | Pitch |
|---|---|---|
| One-time build | ₹1-1.5L | "Save ₹2L+ in first year vs current PMS" |
| Monthly SaaS | ₹8-10K/month | "₹20K less than current. Cancel anytime." |
| Friend deal (one-time) | ₹50-80K | "Market rate is ₹2L+. You're my first client." |
| Free + code ownership | ₹0 | You own the code, build SaaS from it. LinkedIn showcase. |
| Revenue share | ₹0 upfront + % of savings | Complex, hard to enforce |

**Decision needed:** Which pricing model?

---

## Key Decisions Pending

1. **Pricing model** — needs honest conversation with friend
2. **Current PMS name** — what are we replacing? Need to know features to match/beat
3. **Hotel details** — exact room count, room types, pricing range, location
4. **Staff count** — how many people use the system daily?
5. **Invoice volume** — how many invoices/month? What products beyond room stay?
6. **OTA dependency** — what % of bookings come from MakeMyTrip/GoIbibo vs direct?
7. **Timeline pressure** — does he need this ASAP or is he exploring?

---

## Monetization Beyond This Client

This codebase becomes a SaaS product:
- India: ₹5-15K/month per hotel
- Target: Budget/mid-range hotels (10-50 rooms) frustrated with expensive PMS
- First 5 clients from friend's referrals + LinkedIn content
- Same code, multi-tenant, each hotel is a tenant

---

*This plan graduates to its own project directory when building starts.*
