# PATENT REWRITE — CHANGES SUMMARY

## Original → Rewritten: What Changed and Why

---

## TITLE
**Original:** "Systems and Methods for Delegated Spending Using Issuer-Side Tokenization and Stateful Authorization Profiles"
**Rewritten:** "Systems and Methods for Cross-Form-Factor Delegated Spending Control Using Issuer-Side Tokenization, Stateful Authorization Profiles, and Atomic Counter Synchronization"
**Why:** Title now explicitly names the core novel elements — "cross-form-factor" and "atomic counter synchronization" — which no prior art covers.

---

## CLAIMS: 10 → 15

### Original Claims → What Happened

| Original | New | Change |
|----------|-----|--------|
| Claim 1 (method) | Claim 1 | **MAJOR REWRITE** — see below |
| Claim 2 (payment message) | Claim 2 | Minor: added "ISO 8583 or network-specific equivalent" |
| Claim 3 (validity window) | Claim 3 | Kept as-is |
| Claim 4 (counter > 0) | Claim 4 | Kept as-is for breadth |
| Claim 5 (compare-and-decrement) | Claim 5 | **STRENGTHENED** — added verification, form factor ID, ledger entry detail |
| Claim 6 (reversal) | Claim 6 | **MAJOR REWRITE** — added cross-form-factor restoration language |
| Claim 7 (pseudo-PAN) | Merged into Claim 1(a) | Folded into independent claim for stronger protection |
| Claim 8 (system) | Claim 11 | **MAJOR REWRITE** — mirrors strengthened Claim 1 |
| Claim 9 (standard controls) | Claim 12 | Consolidated; added validity window to the list |
| Claim 10 (idempotency) | Claim 13 | **REWRITTEN** — now counter-specific, not generic API idempotency |

### New Claims Added

| New Claim | Subject | Why Added |
|-----------|---------|-----------|
| Claim 7 | Counter reset policy | Periodic counter restoration across all form factors — novel, no prior art |
| Claim 8 | Real-time notification | Primary account holder notified per decrement with form factor ID — defensible feature |
| Claim 9 | Dynamic profile modification | Update counter/constraints without re-provisioning — practical and novel |
| Claim 10 | Multi-delegate isolation | Independent counters per delegate on same account — prevents examiner arguing single-delegate limitation |
| Claim 14 | System reversal (mirrors Claim 6) | System claim version of reversal — ensures system claims have reversal coverage |
| Claim 15 | System multi-delegate (mirrors Claim 10) | System claim version of multi-delegate isolation |

---

## INDEPENDENT CLAIM 1 — DETAILED CHANGES

### Added to Claim 1(a) — Credential Generation
- **"bound to a secondary user distinct from the primary account holder"** — Differentiates from ALL Visa/Mastercard tokenization patents that generate tokens for the same cardholder
- **"comprises a pseudo-primary-account-number format identifier"** — Merged from old Claim 7 for stronger position
- **"without transmitting the primary account number to any third-party wallet provider"** — Privacy preservation merged from old Claim 7

### Added to Claim 1(b) — Authorization Profile
- **"mutable"** remaining-usage counter — Distinguishes from static token restrictions (Visa WO2017201301A1)
- **"representing a discrete number of permitted transactions"** — Distinguishes from monetary balance limits
- **"authorization ledger keyed by authorization identifiers"** — Makes the ledger a structural requirement, not just a feature

### Added to Claim 1(c) — Provisioning
- **"plurality of heterogeneous form factors"** — Stronger than "first form factor / second form factor"
- **"all provisioned form factors are bound to the same stateful authorization profile"** — Explicit binding language
- **"such that a transaction on any one form factor mutates the shared profile state"** — THE KEY NOVELTY PHRASE. No prior art claims this.

### Added to Claim 1(e) — Resolution (NEW STEP)
- **"resolving the authorization request to the stateful authorization profile by mapping from a token identifier, delegated credential identifier, or form factor identifier"** — Makes profile resolution explicit (was implicit in original)

### Added to Claim 1(g) — Atomic Operation
- **"compare-and-decrement"** — Specific CAS terminology
- **"records an authorization ledger entry in a single atomic transaction"** — Couples counter decrement with audit trail atomically
- **"preventing double-spend conditions under concurrent authorizations from any of the plurality of form factors"** — Explicitly states the technical problem solved

### Added Claim 1(h) — Response (was 1(g) in original)
- **"whereby a transaction executed via the digital wallet token instance and a transaction executed via the personalized physical payment instrument both update the same remaining-usage counter value"** — Explicitly restates the cross-form-factor synchronization in the final clause

---

## CLAIM 6 — REVERSAL (MAJOR REWRITE)

**Original:** Generic reversal with ledger check
**Rewritten:** Added **"wherein the counter restoration is effective regardless of which form factor originated the original transaction or which form factor may subsequently utilize the restored counter value"** — This ties reversal handling directly to the cross-form-factor novelty, making it much harder to invalidate with general reversal prior art.

---

## SPECIFICATION — KEY ADDITIONS

1. **Background section** now explicitly identifies the cross-form-factor synchronization gap (paragraph about uncoordinated spending states when both digital wallet and physical card are issued to same delegate)

2. **New definitions added:**
   - "Secondary user" — formally defined, referenced throughout
   - "Remaining-usage counter value" — distinguished from account balance
   - "Authorization ledger" — defined as structural component
   - "Form factor" — enumerated examples
   - "Atomic operation" — defined in payment context

3. **New architecture components:**
   - Notification service (supports Claim 8)
   - Profile management interface (supports Claim 9)
   - FormFactorBindings field (supports profile resolution)
   - InitialUsageCounterValue (supports counter reset)
   - SecondaryUserID (supports multi-delegate isolation)

4. **New specification sections:**
   - Section 7: Dynamic Profile Modification
   - Section 8: Counter Reset Policy
   - Section 9: Multi-Delegate Isolation

5. **New figures described:**
   - FIG. 5: Multi-delegate isolation
   - FIG. 6: Dynamic modification and notification flow

---

## RESTRUCTURING TO USPTO FORMAT (Feb 28, 2026)

The patent was restructured from a general markdown format to proper USPTO filing format per 37 CFR 1.77(b):

### Structure Changes
1. **Section order** — Reorganized to exact 37 CFR 1.77(b) order (13 sections)
2. **Missing sections added** — "Statement Regarding Federally Sponsored Research", "Names of Parties to Joint Research Agreement", "Incorporation-by-Reference", "Statement Regarding Prior Disclosures" — all marked "Not Applicable"
3. **Section headings renamed** — "Technical Field" → "Field of the Invention" (under "Background of the Invention"), "Summary" → "Brief Summary of the Invention", "Brief Description of the Drawings" → "Brief Description of the Several Views of the Drawing", "Detailed Description" → "Detailed Description of the Invention", "Abstract" → "Abstract of the Disclosure"
4. **"ADVANTAGES" section removed** — Content folded into paragraph [0071] at end of Detailed Description
5. **"What is claimed is:"** added before claims per USPTO convention
6. **Closing paragraph** [0072] added — Standard scope/variations statement

### Formatting Changes
7. **Paragraph numbering** — Every specification paragraph numbered [0001] through [0072] per MPEP 608.01
8. **Reference numerals added** — 35 unique numerals (100-190) assigned to all system components, data structures, messages, and interfaces throughout the specification
9. **Reference numerals in claims** — Added in parentheses per 37 CFR 1.84(k)(2) to independent claims (1 and 11) for examiner clarity
10. **Reference numeral table** — Included as drafting appendix (not for filing)

### Figure Drawings Created
11. **6 SVG figures created** in `figures/` directory:
    - `FIG1-system-architecture.svg` — Block diagram of system 100 with all components
    - `FIG2-provisioning.svg` — Credential generation and multi-form-factor provisioning flow
    - `FIG3-authorization-flow.svg` — Swim-lane authorization message flow with atomic operation
    - `FIG4-reversal-flow.svg` — Reversal handling with ledger-based idempotency
    - `FIG5-multi-delegate.svg` — Independent profiles per delegate showing isolation
    - `FIG6-dynamic-modification.svg` — Profile modification and notification flows
12. **Figure descriptions for patent illustrator** — Detailed textual instructions included in the document for professional patent drawing creation per 37 CFR 1.84

### Review Fixes Applied
13. **Antecedent basis** — "held by a primary account holder" added in Claims 1(a) and 11(a)
14. **Abstract** — Trimmed to 146 words (limit: 150)

---

## FILES IN THIS DIRECTORY

| File | Description |
|------|-------------|
| `Ayris_Pay_Complete_Patent_Application_Draft (3).docx` | Original patent (10 claims) |
| `Patent_Prior_Art_Analysis.md` | Prior art research report (10 verified patents) |
| `Ayris_Pay_Rewritten_Patent_Application.md` | Final patent — USPTO format (markdown source) |
| `Ayris_Pay_Rewritten_Patent_Application.docx` | Final patent — USPTO format (Word document) |
| `CHANGES_SUMMARY.md` | This file |
| `figures/FIG1-system-architecture.svg` | FIG. 1 — System architecture block diagram |
| `figures/FIG2-provisioning.svg` | FIG. 2 — Provisioning and profile binding |
| `figures/FIG3-authorization-flow.svg` | FIG. 3 — Authorization decisioning flow |
| `figures/FIG4-reversal-flow.svg` | FIG. 4 — Reversal and idempotency flow |
| `figures/FIG5-multi-delegate.svg` | FIG. 5 — Multi-delegate isolation |
| `figures/FIG6-dynamic-modification.svg` | FIG. 6 — Dynamic modification and notification |
| `figures/FIG1-system-architecture.png` | FIG. 1 — PNG (embedded in DOCX) |
| `figures/FIG2-provisioning.png` | FIG. 2 — PNG (embedded in DOCX) |
| `figures/FIG3-authorization-flow.png` | FIG. 3 — PNG (embedded in DOCX) |
| `figures/FIG4-reversal-flow.png` | FIG. 4 — PNG (embedded in DOCX) |
| `figures/FIG5-multi-delegate.png` | FIG. 5 — PNG (embedded in DOCX) |
| `figures/FIG6-dynamic-modification.png` | FIG. 6 — PNG (embedded in DOCX) |
| `generate-patent-docx.js` | Node.js script to regenerate the DOCX |

## FINAL DOCX GENERATION (Mar 1, 2026)

The DOCX was regenerated using docx-js (npm `docx` v9.6.0) for precise formatting control. Pandoc's default output had incorrect fonts (Consolas), wrong spacing (1.15x), and no embedded figures.

### Formatting Applied
1. **Font**: Times New Roman throughout (12pt body, 14pt headings)
2. **Line spacing**: 1.5x (360 twips) per 37 CFR 1.52
3. **Margins**: Top 3/4" (1080 twips), Bottom 3/4" (1080 twips), Left 1" (1440 twips), Right 3/4" (1080 twips)
4. **Page size**: 8.5" x 11" US Letter (12240 x 15840 twips)
5. **Page numbers**: Centered at bottom of every page
6. **Page breaks**: Before Claims section and Abstract section

### Figures Embedded
- All 6 SVG figures converted to PNG via Playwright (headless Chromium screenshots)
- Each figure placed on its own page with caption
- PNG format chosen for maximum Word/PDF compatibility

### Generator Script
- `generate-patent-docx.js` — ~500-line Node.js script, fully self-contained
- Can regenerate the DOCX at any time with: `node generate-patent-docx.js`
- All patent content hardcoded in the script (no external dependencies beyond `docx` npm package and PNG files)

---

## NOTES FOR PATENT ATTORNEY

1. **Figures**: SVGs serve as detailed drafting guides. Professional patent illustrator should create formal drawings per 37 CFR 1.84 (black India ink, proper margins, lead lines). PNG versions are embedded in the DOCX for reference.
2. **Reference numeral table and figure descriptions**: Marked as "not for filing" — remove before submission.
3. **Inventor metadata note at top**: Remove before filing — inventor information goes in ADS per 37 CFR 1.76.
4. **Page breaks**: Already enforced in the DOCX before CLAIMS and ABSTRACT sections.
5. **Font/spacing**: DOCX uses 12pt Times New Roman, 1.5 spacing, USPTO-compliant margins per 37 CFR 1.52.
