# Nimbus — Session Log

## Session 8 — May 7, 2026

### Summary
Viva tomorrow. Goal: Complete entire backend in 2-3 hours (Models → DAO → Service → Controller → JSP → REST API → Angular). Each layer = viva prep. Update portal with everything after.

### Context
- Darshan wants full project completion, not phase-wise
- JSPs required (HTML files not accepted)
- Angular needed somewhere (at least homepage)
- Portal update on GitHub → Netlify picks it up
- Viva topics: Core Java, Microservices, Servlets, JSPs, Spring, Annotations, REST APIs, Java Editions, Class Relationships

### Layer 1: Model Classes (com.nimbus.model)

**Files to create in Eclipse:**
| File | Package | Purpose |
|------|---------|---------|
| User.java | com.nimbus.model | Maps to tbl_UserProfile — userId, name, email, password, phone, role, createdDate |
| Booking.java | com.nimbus.model | Maps to tbl_Booking — bookingId, userId, senderName, senderAddress, receiverName, receiverAddress, weight, parcelType, status, price, bookingDate |
| Issue.java | com.nimbus.model | Maps to tbl_Issue — issueId, userId, bookingId, description, status, assignedTo, createdDate |

**Viva Q&A from this layer:**
- POJO: Plain Old Java Object — private fields, public getters/setters, constructors. No framework dependency.
- Encapsulation: Fields private, access via getters/setters only. Protects data integrity.
- Two constructors: Default (no-arg) needed by frameworks like Spring/JDBC. Parameterized for manual creation.
- Class Relationships: Booking has-a userId (Association with User). Issue has-a userId + bookingId (Association with both). This is composition/aggregation.
- Java Editions: Models = Java SE. Servlets/JSP = Java EE. Spring Boot wraps Java EE in simpler way.

**Portal pages needed from this layer:**
1. Model classes page — all 3 classes with line-by-line explanation
2. Viva Q&A: POJO, Encapsulation, Constructors, Class Relationships, Java Editions

### Layer 2: DAO Classes (com.nimbus.dao)

**Files to create in Eclipse:**
| File | Package | Methods |
|------|---------|---------|
| UserDAO.java | com.nimbus.dao | login, register, getAllUsers, getUserById, getUsersByRole, updateUser |
| BookingDAO.java | com.nimbus.dao | createBooking, getBookingsByUser, getAllBookings, getBookingById, updateStatus |
| IssueDAO.java | com.nimbus.dao | createIssue, getIssuesByUser, getAllIssues, assignIssue, resolveIssue, getAssignedIssues |

**Key concepts used:** @Repository, @Autowired, JdbcTemplate, RowMapper interface, parameterized queries (?), List<T>

**Viva Q&A from this layer:**
- @Repository: Spring stereotype — marks class as DB-layer bean. Auto-detected by Spring. Translates SQL exceptions.
- @Autowired: Dependency Injection — Spring creates and injects the object. You don't use `new`.
- JdbcTemplate: Simplifies raw JDBC from 7-8 lines to 1 line. Handles connections, statements, cleanup.
- RowMapper: Interface with mapRow() — converts SQL ResultSet row → Java object. Column → field mapping.
- Parameterized queries (?): Prevents SQL injection. Never concatenate user input into SQL.
- List + isEmpty(): query() always returns List. For single-result, check isEmpty() and return first or null.

**Portal pages needed from this layer:**
1. DAO classes page — all 3 classes with line-by-line explanation
2. Viva Q&A: @Repository, @Autowired, JdbcTemplate, RowMapper, SQL injection, JDBC vs JdbcTemplate

### Layer 3: Service Classes (com.nimbus.service)

**Files to create in Eclipse:**
| File | Package | Key Logic |
|------|---------|-----------|
| UserService.java | com.nimbus.service | Smart User ID generation (YYMMDD + initials + seq), login, register, admin operations |
| BookingService.java | com.nimbus.service | Auto booking ID (BK001, BK002...), pricing engine (weight × rate by type), status management |
| IssueService.java | com.nimbus.service | Auto issue ID (ISS001...), raise/assign/resolve workflow |

**Key concepts:** @Service, Dependency Injection, Separation of Concerns, 3-tier architecture, business logic isolation

**Viva Q&A from this layer:**
- @Service: Spring stereotype — marks business-logic bean. Same as @Component but communicates intent.
- Why not put logic in Controller/DAO: Separation of Concerns. Controller=HTTP, Service=business rules, DAO=SQL. Change DB? Only DAO changes.
- @Component vs @Service vs @Repository vs @Controller: All register beans. Difference is intent — generic, business, DB, web.
- Dependency Injection: Spring creates dependencies and injects them. You don't use `new`. @Autowired triggers this. Makes code testable, loosely coupled.
- 3-tier architecture: Controller → Service → DAO → Database. Each layer only talks to the one below it.

**Portal pages needed from this layer:**
1. Service classes page — all 3 with business logic explained
2. Viva Q&A: @Service, DI, 3-tier, stereotypes comparison

### Layer 4: Servlets + JSP Views

**Config file (com.nimbus.config):**
| File | Purpose |
|------|---------|
| ServletConfig.java | @Configuration — registers all 5 servlets with URL mappings via ServletRegistrationBean |

**Servlet files (com.nimbus.servlet):**
| File | URL | GET | POST |
|------|-----|-----|------|
| LoginServlet.java | /servlet/login | Shows login.jsp | Validates credentials → creates HttpSession → redirects to dashboard |
| RegisterServlet.java | /servlet/register | Shows register.jsp | Calls UserService.register() → redirects to login with userId |
| BookingServlet.java | /servlet/booking | Session check → shows booking.jsp | Creates booking via BookingService → shows confirmation |
| TrackingServlet.java | /servlet/tracking | Shows tracking.jsp | Searches by bookingId → shows result |
| DashboardServlet.java | /servlet/dashboard | Session check → forwards to dashboard.jsp | — |

**JSP files (src/main/webapp/WEB-INF/jsp/):**
| File | Shows |
|------|-------|
| login.jsp | Login form + error/success messages + demo credentials |
| register.jsp | Registration form (personal info, address, security) |
| dashboard.jsp | Role-based cards (customer/officer/support) using <c:if> |
| booking.jsp | Sender info + receiver form + parcel options + confirmation |
| tracking.jsp | Search by booking ID + color-coded status display |

**Viva Q&A from this layer:**
- Servlet: Java class that handles HTTP requests. Extends HttpServlet, overrides doGet/doPost. Tomcat calls these.
- Servlet lifecycle: init() → service() → destroy(). You override doGet/doPost.
- JSP: HTML with Java inside. Server compiles JSP → Servlet behind the scenes. Use ${variable} and <c:if>/<c:forEach>.
- Forward vs Redirect: Forward = server-side (same request, URL stays). Redirect = browser gets new URL (new request). POST-Redirect-GET pattern.
- HttpSession: Server-side storage per user. request.getSession() creates it. Persists across page visits.
- Why Servlets can't use @Autowired: Managed by Tomcat, not Spring. Use WebApplicationContextUtils to get Spring beans manually.
- JSTL: <c:if>, <c:forEach>, <c:choose> — logic in JSP without writing Java scriptlets.

### Layer 5: REST API + Full Model Upgrade

**Models upgraded to JPA (com.nimbus.model):**
- User.java — @Entity, 17 fields (firstName, middleName, lastName, fullName, email, mobile, street, zipCode, city, state, country, etc.)
- Booking.java — @Entity, 17 fields (recName, recAddress, parWeightGram, parDeliveryType, parServiceCost, pickupTime, etc.)
- Issue.java — @Entity, 11 fields (subject, description, severity, notes, assignedTo, etc.)

**Repositories (com.nimbus.repository):**
- UserRepository, BookingRepository, IssueRepository — all JpaRepository interfaces

**Services upgraded to use Repositories:**
- UserService — register(), registerAdmin(), validateLogin(), getAllUsers(), getUserById(), deleteUser(), countByRole()
- BookingService — createBooking(10 params), trackBooking(), updateDeliveryStatus(), updatePickupDropoff(), getHistory()
- IssueService — createIssue(), updateIssue(), getAllIssues(), getIssuesByUser(), getAssignedIssues()

**DTOs (com.nimbus.dto):**
- LoginRequest, LoginResponse (with nested UserDTO), RegisterRequest, BookingRequest, ApiResponse

**REST Controllers (com.nimbus.controller):**
- AuthController — POST /api/auth/login, /register, /register-admin, GET /api/auth/users, /user/{id}
- BookingController — POST /api/bookings, GET /history, /{id}, PUT /{id}/delivery-status, /{id}/pickup-drop
- TrackingController — GET /api/bookings/{id}/track
- IssueController — POST /api/issues, GET /api/issues, /user/{id}, /assigned/{id}, PUT /{id}

**Config:**
- CorsConfig.java — allows cross-origin API calls
- schema.sql + data.sql — updated for new models (lowercase table names for H2+Hibernate)
- application.properties — added JPA config, defer-datasource-initialization

**Old DAOs:** @Repository commented out, kept for Sprint 2 viva reference

**App status:** Running on localhost:8080. JSP login + dashboard working. REST APIs live.

### Progress
| # | Layer | Status |
|---|-------|--------|
| 1 | Model classes (User, Booking, Issue) — upgraded to JPA | DONE |
| 2 | DAO layer (kept for reference, not active) | DONE |
| 3 | Service layer — upgraded to use Repositories | DONE |
| 4 | Servlets (5) + JSPs (5) + ServletConfig | DONE |
| 5 | REST APIs (4 controllers) + DTOs (5) + CorsConfig | DONE |
| 6 | Angular homepage / Frontend integration | NOT STARTED |
| 7 | Portal update + Viva cheat sheet | IN PROGRESS |

---

## Session 7 — May 6, 2026

### Summary
Setting up Eclipse backend project from scratch. Walking through step-by-step with Darshan — every action noted for portal update later.

### Decisions Made
1. **System Admin role** added (4th role) — Admin onboards Officers and Support staff
2. **4 new features confirmed:** Status Timeline Tracking, Auto-Pricing Engine, Notification System, Analytics Dashboard
3. **Database:** H2 (embedded, zero setup, same SQL as MySQL)
4. **All 11 packages created at once** — not phase-by-phase (Darshan's preference)
5. **Tech stack confirmed** from TCS requirements — Admin role is actually IN Sprint 3 requirements (`registerAdmin`)
6. **Portal update approach:** Walk through setup live, note everything, update portal with real beginner walkthrough + line-by-line explanations

### Step-by-Step Progress

| # | Action | Status |
|---|--------|--------|
| 1 | Created Maven project `nimbus-backend` (Group: com.nimbus, Artifact: nimbus-backend) | DONE |
| 2 | Verified folder structure — Eclipse split view confused Darshan, clarified it's normal | DONE |
| 3 | Created 11 packages inside `src/main/java` (all at once, not sprint-wise) | DONE |
| 4 | Created resource folders: `resources/static/`, `webapp/WEB-INF/jsp/` | DONE |
| 5 | Created `application.properties` in `src/main/resources` | DONE |
| 6 | Created `schema.sql` in `src/main/resources` (3 tables: UserProfile, Booking, Issue) | DONE |
| 7 | Created `data.sql` in `src/main/resources` (5 seed users: Admin, Darshan, Akhil, Meenal, Kushal) | DONE |
| 8 | Updated `pom.xml` — Spring Boot 3.2.5, JDBC, Web, JSP, H2 (all sprints in one go) | DONE |
| 9 | Created `NimbusApplication.java` in `com.nimbus` — Spring Boot entry point | DONE |
| 10 | **First run — FAILED** — `DB_CLOSE_ON_EXIT` not supported in H2 2.2.224. Removed from URL. | DONE (fixed) |
| 11 | **Second run — SUCCESS** — Spring Boot started in 2.7s, Tomcat on 8080, H2 console working | DONE |
| 12 | Verified H2 console at `localhost:8080/h2-console` — all 3 tables visible, 5 seed users confirmed | DONE |

### Bugs Found & Fixed
| Bug | Cause | Fix |
|-----|-------|-----|
| `pom.xml` warning: "processing instruction target matching [xX][mM][lL] is not allowed" | Blank line or space before `<?xml` on line 1 | Removed blank line — `<?xml` must be at line 1, column 1 |
| `DB_CLOSE_ON_EXIT` syntax error on startup | H2 2.2.224 (bundled with Spring Boot 3.2.5) dropped support for this URL parameter | Removed `DB_CLOSE_ON_EXIT=FALSE` from `application.properties` datasource URL |
| `com.nimbus` package not visible in Eclipse | Eclipse hides empty parent packages — it existed but had no files | Created class directly with package field `com.nimbus` — package appeared after file was added |

### Portal Updates Needed
- Line-by-line explanation for `application.properties` (Darshan requested word-by-word meaning)
- Line-by-line explanation for `schema.sql` (every SQL keyword explained — constraints, foreign keys, defaults)
- Explanation pages linked from setup page (setup stays clean, deep-dives separate)
- H2 vs Derby comparison table
- Complete tech stack table (all sprints)
- Update setup guide to reflect "create all 11 packages at once" approach
- Fix: remove `DB_CLOSE_ON_EXIT=FALSE` from guide's application.properties
- Real beginner walkthrough based on this session

### Files Changed (in Eclipse workspace, not this repo)
- `C:\Users\addar\eclipse-workspace\nimbus-backend\pom.xml`
- `C:\Users\addar\eclipse-workspace\nimbus-backend\src\main\resources\application.properties`
- `C:\Users\addar\eclipse-workspace\nimbus-backend\src\main\resources\schema.sql`
- `C:\Users\addar\eclipse-workspace\nimbus-backend\src\main\resources\data.sql`
- `C:\Users\addar\eclipse-workspace\nimbus-backend\src\main\java\com\nimbus\NimbusApplication.java`

### Next Session — Pick Up Here
- Start writing **Model classes** — `User.java`, `Booking.java`, `Issue.java` in `com.nimbus.model`
- Then **DAO classes** — `UserDAO.java`, `BookingDAO.java`, `IssueDAO.java` in `com.nimbus.dao`
- Then **Service classes** and **Console app**
- Update portal pages after each working block

### Session End: 3:15 AM, May 6, 2026

### Git
- `388ba8e` — Practice IDE: 5 new questions (Q12-Q16) + sidebar nav for M9-M13 (committed at session start, was pending from last session)

---

## Session 6 — Apr 29, 2026

### Summary
Added 5 new PRA questions to Practice IDE from screenshot images, created 5 mock solution pages with full walkthroughs, built a comprehensive beginner exam strategy guide, fixed timer to count up from 0, and deployed everything correctly.

### What Was Done

| Task | Details |
|------|---------|
| 5 new questions in Practice IDE | Subscription Management (Q12), Car Management with inheritance (Q13), Music-Fest composition (Q14), TrainTicket arrays (Q15), Exception Handling Division (Q16). All with hidden test cases. Questions added exactly as they appeared in screenshots — not simplified. |
| 5 new mock solution pages | mock5-q1 (Subscription Mgmt), mock5-q2 (Car Management), mock6-q1 (Music-Fest), mock6-q2 (TrainTicket), mock7-q1 (Division Exception). Each has: question statement, analysis, step-by-step walkthrough, algorithm, complete solution with copy button + line-by-line breakdown, test cases, common mistakes. |
| Exam Strategy Guide | New page `11-exam-strategy.html` — beginner's guide covering: how to read/understand questions, class creation template, traversing nested lists (composition), print in method vs main (with decision table), custom exceptions + try-catch (3 examples), what to do when stuck (emergency protocol), PRA question patterns cheat sheet (7 patterns), Scanner input patterns, equalsIgnoreCase rule, LinkedHashMap for insertion order, exam day checklist. |
| Timer fix | Changed from countdown (75→0) to count-up (0→75). Shows how much time you're taking. Turns red when approaching the limit. |
| Sidebar updates | All 8 existing mock files updated with M9-M13 navigation links |
| Deployment | All 15 files synced to `C:\Users\addar\java-core\` and committed/pushed from repo root correctly. No path prefix issues. |

### Files Changed
- **Modified:** `portal/java-core/practice-ide.html` (5 new questions + timer fix)
- **Modified:** `portal/java-core/mock1-q1.html` through `mock4-q2.html` (sidebar updates — 8 files)
- **Created:** `portal/java-core/mock5-q1.html` (Subscription Management solution)
- **Created:** `portal/java-core/mock5-q2.html` (Car Management solution)
- **Created:** `portal/java-core/mock6-q1.html` (Music-Fest solution)
- **Created:** `portal/java-core/mock6-q2.html` (TrainTicket solution)
- **Created:** `portal/java-core/mock7-q1.html` (Division Exception solution)
- **Created:** `portal/java-core/11-exam-strategy.html` (Beginner exam strategy guide)
- **Synced:** All 15 files to `C:\Users\addar\java-core\` for deployment

### Git
- `cf7dd19` — Practice IDE: 5 new questions + exam strategy guide + count-up timer

### Questions Added (from 20 screenshot images)
1. **Subscription Management** — Customer/Subscription classes, Map<Integer, List<Subscription>>, 5% discount calc, getSubscriptionDetails
2. **Car Management** — Inheritance (Car → PetrolOrDieselCar, SmartHybridCar), getAveragesByType, getMinMileageByBrand
3. **Music-Fest** — Composition (Musician has List<Song>), findSongsByGenre, findAverageDurationByMusician
4. **TrainTicket** — Array of TrainTicket objects, findTicketWithMinPriceForGivenSource, findAveragePriceOfTicketsForTierClass
5. **Exception Handling Division** — try-catch, e.getClass().getSimpleName()

---

## Session 5 — Apr 28, 2026

### Summary
Updated Practice IDE with original HackerRank question text (replacing simplified versions) and added resizable left/right panels. Fixed deployment sync issue again — edits to `portal/java-core/practice-ide.html` must always be copied to `java-core/practice-ide.html` at repo root for GitHub Pages and Netlify to pick them up.

### What Was Done

| Task | Details |
|------|---------|
| Question descriptions | Replaced all 8 question descriptions (Investors, OddEven Exception, CountryLeagueSponsors, Sum of Digits, Author-Book, Area-Perimeter, Mobile Brand Service, Consecutive Vowels) with exact original HackerRank/TCS PRA text from screenshots |
| Resizable panels | Added draggable horizontal resize handle between problem panel (left) and editor panel (right). Grab and drag to resize. Min-widths: 280px left, 360px right. Green highlight + grip dots on hover. |
| Q6 title fix | Changed from "Area-Perimeter Rectangle" to "Minor Calculation of Area-Perimeter of polygons" |
| Deployment sync | Copied updated `practice-ide.html` to `C:\Users\addar\java-core\` (repo root path). Cleaned up wrong commit that created `Desktop/My Workspace/Parcel_Management/java-core/` path. |
| Darshan's code help | Helped debug Investors solution — missing `()` on getter calls, undeclared `found` variable, average not dividing by count |

### Files Changed
- **Modified:** `portal/java-core/practice-ide.html` (descriptions + resizable panels)
- **Synced:** `java-core/practice-ide.html` (root-level copy for deployment)
- **Deleted:** `Desktop/My Workspace/Parcel_Management/java-core/practice-ide.html` (wrongly committed path)

### Git
- `c323230` — Practice IDE: Original HackerRank question text + resizable panels
- `3aaff1b` — Wrong sync path (fixed in next commit)
- `774bab1` — Sync practice-ide.html: correct deploy path at repo root

### CRITICAL REMINDER FOR ALL FUTURE SESSIONS
**Every time `portal/java-core/practice-ide.html` is edited, MUST also copy to `C:\Users\addar\java-core\practice-ide.html`** — that's the actual deployed path. Git root is `C:\Users\addar`, NOT `Parcel_Management/`.

---

## Session 4 — Apr 27, 2026 (Night)

### Summary
Fixed a deployment bug — Practice IDE showing old Piston API version on both GitHub Pages and Netlify despite code being committed. Root cause: git repo root is `C:\Users\addar` (home directory), so last session's commits stored files under `Desktop/My Workspace/Parcel_Management/portal/...` prefix instead of root-level paths. GitHub Pages serves from `/`, so the old `java-core/practice-ide.html` at root was never updated.

### What Was Fixed

| Issue | Root Cause | Fix |
|-------|-----------|-----|
| Practice IDE showing old UI (Piston) on GitHub Pages | File committed at `Desktop/My Workspace/.../portal/java-core/practice-ide.html` but Pages serves `java-core/practice-ide.html` at root | Copied new JDoodle version to root-level path |
| Netlify Functions not working (JDoodle proxy) | `netlify.toml` and `netlify/functions/execute.js` only existed under the wrong prefix path | Copied both files to repo root |

### Key Discovery
- **Git repo root is `C:\Users\addar`** — NOT `Parcel_Management/`. This caused all recent commits to store files under deep `Desktop/My Workspace/Parcel_Management/...` paths that neither GitHub Pages nor Netlify could find.
- Old working files at root-level paths (`java-core/`, `index.html`, etc.) were from earlier sessions and never got updated by recent commits.
- Only `practice-ide.html` had actual content changes (Piston → JDoodle). Other portal files were already in sync.

### Files Changed
- **Modified:** `java-core/practice-ide.html` (synced new JDoodle version to root path)
- **Added:** `netlify.toml`, `netlify/functions/execute.js` (at root level for Netlify)

### Git
- Commit: `2bf0849` — "Fix: Sync practice-ide.html to root path + add Netlify Functions"
- Pushed to `origin/main` (Java_learning repo)

### Warning for Future Sessions
Any portal file changes MUST be synced to root-level paths (`java-core/`, `backend/`, `index.html`, etc.) — not just under `portal/`. The git root being `C:\Users\addar` means commits from `Parcel_Management/` directory store files with the full relative path prefix.

---
