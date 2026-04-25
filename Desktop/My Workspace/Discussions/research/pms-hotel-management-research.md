# PMS (Property Management System) — Research Notes

*Source: Notebook LM research compiled by Darshan*
*Date: 2026-04-25*
*Status: Raw research — needs strategic evaluation*

---

## What Is a PMS?

A comprehensive software platform — the "operating system" for hospitality businesses. Manages operations, guest preferences, room inventory, and rates.

---

## Core Modules (7)

### 1. Reservation & Distribution
- Booking engine + channel manager (walk-in, online, group)
- Real-time sync across hotel website, GDS, OTAs (Booking.com, Expedia)
- Rate & inventory control — flexible pricing, packages, promo codes

### 2. Front Desk Operations
- Check-in/check-out workflows via intuitive dashboard
- Guest mobility — self-service kiosks, mobile check-in, digital keys

### 3. Housekeeping & Maintenance
- Real-time room status (auto-dirty on checkout)
- Task assignment by floor/block, mobile alerts for staff

### 4. Revenue Management & Analytics
- Dynamic pricing — AI-driven rate adjustment based on demand/competition/occupancy
- BI reports — ADR, RevPAR, occupancy rates (daily/weekly/monthly)

### 5. Accounting, Billing & Compliance
- Multi-currency invoicing, deposits, complex tax structures
- GST-compliant e-invoicing (India)
- PCI-DSS compliant payment processing, pre-auth, reconciliation

### 6. Guest Intelligence & CRM
- Centralized guest profiles, stay history, preferences, loyalty
- Automated comms — pre-arrival emails, SMS, post-stay reviews, marketing

### 7. Point of Sale & Back Office
- POS for restaurants, bars, spas — charges to room bill
- ERP capabilities — HR, payroll, material control, procurement

---

## Strategic Architecture Principles (6)

### 1. Mixed Inventory Data Schema
- NOT just rooms/nights/folios
- Treat room, co-working desk, parking, glamping tent as equal "inventory units"
- Sell any space by hour, day, or month
- Mews is the market leader implementing this

### 2. Embedded Finance & Payment Orchestration
- THE most valuable element — control over property's economics
- Native payment processing, tokenized workflows, automated reconciliation
- Track OTA commissions, refunds, adjustments post-checkout
- **PMS without transaction stream control = commercially irrelevant**

### 3. Cloud-Native, API-First Architecture
- Open API + event-based webhooks (not polling)
- Webhooks push data on events (booking, checkout, rate change)
- Benefits: real-time precision, targeted data delivery, instant action
- AWS deployment for speed, security, multi-tenant scalability

### 4. Compliance as Structural Moat
- Hyper-localized compliance engines in code
- EU/India electronic invoicing, GDPR, CCPA, PCI DSS v4.x
- India GST: auto slab switching, ITC reversals (see below)

### 5. Quiet Autopilot AI
- Invisible, practical AI (not chatbots)
- Dynamic rate adjustment, housekeeping scheduling from occupancy forecasts
- Automated night audit elimination
- Addresses global hospitality labor shortage

### 6. Migration Tooling
- Biggest competitor = fear of switching from legacy
- Build: data-export, phased coexistence, event-translation
- Make onboarding "boring, predictable, and reversible"
- **This wins more deals than features**

---

## India GST Architecture (Critical for India Market)

### Current Rules (2025 reforms)
- Tax based on **actual transaction value** (not declared tariff)
- ≤ ₹7,500/night → 5% GST (NO ITC)
- > ₹7,500/night → 18% GST (WITH ITC)
- 13% jump at threshold = pricing trap

### Required System Behaviors

1. **Real-time slab auto-detection** — if dynamic pricing pushes ₹6,000 room to ₹8,500, system auto-switches to 18% GST
2. **Slab-aware pricing** — prevent accidental ₹7,499→₹7,501 jumps that cause disproportionate cost spikes. Warn/restrict marginal crosses.
3. **Multi-department tax separation** — "Specified Premises" rule: if ANY room exceeded ₹7,500 last FY, ALL F&B = 18% with ITC. Separate tax profiles per department within single guest folio.
4. **Auto ITC reversals (CGST Rule 42)** — proportional reversal of shared input tax credits based on turnover. Real-time calculation, no manual spreadsheets.

---

## Key Competitors Mentioned
- **Mews** — Mixed inventory pioneer
- Traditional PMS vendors losing ground to cloud-native solutions

---

## Webhook vs API Polling (Architecture Note)

| Aspect | Traditional API | Webhooks |
|---|---|---|
| Data flow | Pull (request-based) | Push (event-based) |
| Efficiency | Wasteful polling, bulk data | Targeted, specific payloads |
| Speed | Delayed (poll interval) | Near real-time |
| Analogy | "Raking through a haystack" | "Thread leading to the needle" |

---

*Raw research. Strategic evaluation in separate discussion.*
