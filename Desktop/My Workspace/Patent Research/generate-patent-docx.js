/**
 * Ayris Pay Patent Application — DOCX Generator
 * Generates a properly formatted USPTO patent application using docx-js.
 *
 * Formatting per:
 * - 37 CFR 1.52 (paper, margins, font, spacing)
 * - 37 CFR 1.77 (section order)
 * - 37 CFR 1.84 (drawings)
 * - MPEP 608.01 (paragraph numbering)
 */

const {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, PageBreak, ImageRun, TabStopPosition,
  TabStopType, Header, Footer, PageNumber, NumberFormat,
  SectionType, convertInchesToTwip, BorderStyle
} = require("docx");
const fs = require("fs");
const path = require("path");

// ============================================================
// CONFIGURATION — USPTO FORMATTING
// ============================================================
const FONT = "Times New Roman";
const FONT_SIZE = 24; // half-points (12pt = 24)
const HEADING_SIZE = 28; // 14pt for section headings
const TITLE_SIZE = 28; // 14pt for title
const LINE_SPACING = 360; // twips: 360 = 1.5x spacing (240 = single)
const MARGINS = {
  top: convertInchesToTwip(0.75),
  bottom: convertInchesToTwip(0.75),
  left: convertInchesToTwip(1.0),
  right: convertInchesToTwip(0.75),
};
const PAGE_WIDTH = convertInchesToTwip(8.5);
const PAGE_HEIGHT = convertInchesToTwip(11);

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/** Create a section heading (UPPERCASE, bold) */
function sectionHeading(text) {
  return new Paragraph({
    spacing: { before: 400, after: 200, line: LINE_SPACING },
    children: [
      new TextRun({
        text: text.toUpperCase(),
        font: FONT,
        size: HEADING_SIZE,
        bold: true,
      }),
    ],
  });
}

/** Create a sub-section heading */
function subHeading(text) {
  return new Paragraph({
    spacing: { before: 300, after: 150, line: LINE_SPACING },
    children: [
      new TextRun({
        text: text,
        font: FONT,
        size: FONT_SIZE,
        bold: true,
        italics: true,
      }),
    ],
  });
}

/** Create a numbered paragraph [XXXX] with body text */
function numberedPara(num, text) {
  const padded = String(num).padStart(4, "0");
  return new Paragraph({
    spacing: { after: 120, line: LINE_SPACING },
    indent: { firstLine: convertInchesToTwip(0.5) },
    children: [
      new TextRun({
        text: `[${padded}]`,
        font: FONT,
        size: FONT_SIZE,
        bold: true,
      }),
      new TextRun({
        text: `    ${text}`,
        font: FONT,
        size: FONT_SIZE,
      }),
    ],
  });
}

/** Create a plain body paragraph (no number) */
function bodyPara(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 120, line: LINE_SPACING },
    indent: opts.indent ? { left: convertInchesToTwip(opts.indent) } : undefined,
    alignment: opts.center ? AlignmentType.CENTER : AlignmentType.LEFT,
    children: [
      new TextRun({
        text,
        font: FONT,
        size: FONT_SIZE,
        bold: opts.bold || false,
        italics: opts.italics || false,
      }),
    ],
  });
}

/** Create a claim paragraph */
function claimPara(num, text, indent = 0) {
  const children = [];
  if (num !== null) {
    children.push(
      new TextRun({
        text: `${num}. `,
        font: FONT,
        size: FONT_SIZE,
        bold: true,
      })
    );
  }
  children.push(
    new TextRun({
      text,
      font: FONT,
      size: FONT_SIZE,
    })
  );
  return new Paragraph({
    spacing: { after: 100, line: LINE_SPACING },
    indent: { left: convertInchesToTwip(indent) },
    children,
  });
}

/** Sub-element of a claim (indented) */
function claimSub(text, indent = 0.5) {
  return new Paragraph({
    spacing: { after: 80, line: LINE_SPACING },
    indent: { left: convertInchesToTwip(indent) },
    children: [
      new TextRun({
        text,
        font: FONT,
        size: FONT_SIZE,
      }),
    ],
  });
}

/** Page break paragraph */
function pageBreakPara() {
  return new Paragraph({
    children: [new PageBreak()],
  });
}

/** Create an image paragraph from a PNG file */
function figurePara(filename, caption, widthInches, heightInches) {
  const imgPath = path.resolve(__dirname, "figures", filename);
  const imgBuffer = fs.readFileSync(imgPath);

  const elements = [];

  // Figure image
  elements.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 100 },
      children: [
        new ImageRun({
          data: imgBuffer,
          transformation: {
            width: convertInchesToTwip(widthInches) / 20, // ImageRun uses points not twips
            height: convertInchesToTwip(heightInches) / 20,
          },
          type: "png",
        }),
      ],
    })
  );

  // Caption
  elements.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: caption,
          font: FONT,
          size: FONT_SIZE,
          bold: true,
        }),
      ],
    })
  );

  return elements;
}

/** Empty line */
function emptyLine() {
  return new Paragraph({
    spacing: { after: 100, line: LINE_SPACING },
    children: [new TextRun({ text: "", font: FONT, size: FONT_SIZE })],
  });
}

// ============================================================
// DOCUMENT CONTENT
// ============================================================

function buildDocument() {
  const children = [];

  // ---- TITLE OF THE INVENTION ----
  children.push(sectionHeading("TITLE OF THE INVENTION"));
  children.push(emptyLine());
  children.push(bodyPara("Systems and Methods for Cross-Form-Factor Delegated Spending Control Using Issuer-Side Tokenization, Stateful Authorization Profiles, and Atomic Counter Synchronization", { center: true, bold: true }));
  children.push(emptyLine());
  children.push(bodyPara("Inventors: Krishna Mohan; Rishabh Mohan; Darshan Anand; Kuldeep; Jay", { center: true }));
  children.push(emptyLine());

  // ---- CROSS-REFERENCE ----
  children.push(sectionHeading("CROSS-REFERENCE TO RELATED APPLICATIONS"));
  children.push(numberedPara(1, "This application claims priority to U.S. Provisional Patent Application filed on February 6, 2026, titled \"System and Method for Delegated Digital Spending Utilizing Composite Control Profiles and Discrete Usage Counters\" (application number to be supplied). The entire contents of the provisional application are incorporated herein by reference."));

  // ---- FEDERALLY SPONSORED ----
  children.push(sectionHeading("STATEMENT REGARDING FEDERALLY SPONSORED RESEARCH OR DEVELOPMENT"));
  children.push(bodyPara("Not Applicable."));

  // ---- JOINT RESEARCH ----
  children.push(sectionHeading("THE NAMES OF PARTIES TO A JOINT RESEARCH AGREEMENT"));
  children.push(bodyPara("Not Applicable."));

  // ---- INCORPORATION BY REFERENCE ----
  children.push(sectionHeading("INCORPORATION-BY-REFERENCE OF MATERIAL SUBMITTED ON A READ-ONLY OPTICAL DISC, AS A TEXT FILE OR AN XML FILE VIA THE PATENT ELECTRONIC SYSTEM"));
  children.push(bodyPara("Not Applicable."));

  // ---- PRIOR DISCLOSURES ----
  children.push(sectionHeading("STATEMENT REGARDING PRIOR DISCLOSURES BY THE INVENTOR OR A JOINT INVENTOR"));
  children.push(bodyPara("Not Applicable."));

  // ---- BACKGROUND OF THE INVENTION ----
  children.push(sectionHeading("BACKGROUND OF THE INVENTION"));
  children.push(subHeading("Field of the Invention"));
  children.push(numberedPara(2, "The present disclosure relates to electronic payment systems and, more particularly, to systems and methods for delegating spending authority from a primary account holder to one or more secondary users through issuer-side tokenized credentials that share a mutable authorization profile\u2014including discrete usage counters\u2014across heterogeneous payment form factors such as digital wallet tokens and personalized physical payment instruments."));

  children.push(subHeading("Description of Related Art"));
  children.push(numberedPara(3, "Consumers and enterprises frequently need to delegate limited spending authority to secondary users (e.g., family members, employees, contractors). Conventional solutions typically rely on (i) issuing additional cards linked to the primary account with coarse controls, (ii) creating separate funded accounts, or (iii) using single-use or virtual numbers with limited interoperability. These approaches suffer from several deficiencies."));
  children.push(numberedPara(4, "First, existing delegation mechanisms generally enforce spending constraints at the account or card level, treating each issued payment instrument independently. When a primary account holder issues both a digital wallet token and a personalized physical card to the same delegate, existing systems maintain separate and uncoordinated spending states for each instrument. A delegate who has been authorized for five transactions may, in practice, execute five transactions on the digital wallet token and an additional five transactions on the physical card, because no mechanism synchronizes the usage state across form factors."));
  children.push(numberedPara(5, "Second, conventional authorization systems that enforce spending limits typically rely on balance-based controls or coarse velocity limits evaluated at the processor level. These systems do not maintain a discrete, server-side usage counter representing an exact number of permitted transactions that is atomically decremented under concurrent authorization conditions and consistently applied across heterogeneous form factors."));
  children.push(numberedPara(6, "Third, when authorization reversals or timeouts occur in multi-form-factor scenarios, existing systems lack mechanisms to restore usage counters in an idempotent manner that correctly accounts for which form factor originated the transaction while making the restored capacity available to all form factors."));
  children.push(numberedPara(7, "Fourth, conventional delegation approaches often require exposing the primary account number to third-party wallet providers during provisioning, reducing primary account privacy."));
  children.push(numberedPara(8, "Accordingly, there exists a need for systems and methods that enable delegated spending with fine-grained, stateful controls\u2014including discrete usage counters\u2014that are consistently enforced across multiple heterogeneous payment form factors through atomic state operations, with correct handling of reversals and concurrent authorizations."));

  // ---- BRIEF SUMMARY ----
  children.push(sectionHeading("BRIEF SUMMARY OF THE INVENTION"));
  children.push(numberedPara(9, "Disclosed herein are systems and methods that enable cross-form-factor delegated spending control using issuer-side tokenization, stateful authorization profiles, and atomic counter synchronization."));
  children.push(numberedPara(10, "In embodiments, a primary payment account 120 is associated with one or more delegated credential identifiers 130, each bound to a secondary user distinct from the primary account holder and each associated with an independently configurable stateful authorization profile 140. The stateful authorization profile 140 includes at least a mutable remaining-usage counter value 142 representing a discrete number of permitted transactions, together with optional monetary, temporal, merchant-category, and geographic constraints 146, and an authorization ledger 144 for tracking individual authorization events."));
  children.push(numberedPara(11, "The delegated credential identifier 130 is provisioned to a plurality of heterogeneous form factors\u2014such as a digital wallet token instance 160 and a personalized physical payment instrument 162\u2014such that all provisioned form factors are bound to the same stateful authorization profile 140. A transaction executed on any one form factor mutates the shared profile state, including the remaining-usage counter value 142, so that the counter reflects cumulative usage across all form factors."));
  children.push(numberedPara(12, "A stateful authorization engine 106 evaluates payment authorization requests 180 in real time by resolving each request to the applicable stateful authorization profile 140 and applying a composite rule set. Upon approval, the engine 106 executes an atomic compare-and-decrement operation that decrements the remaining-usage counter value 142 and records an authorization ledger entry 190 in a single atomic transaction, thereby preventing double-spend conditions under concurrent authorizations originating from any form factor."));
  children.push(numberedPara(13, "The disclosure further describes idempotent reversal handling wherein a reversal message 184 triggers atomic counter restoration via ledger-based verification, dynamic profile modification by the primary account holder without re-provisioning, periodic counter reset policies applied simultaneously across all form factors, real-time notification 186 to the primary account holder upon each counter decrement, and multi-delegate isolation ensuring independent counter state per delegated credential identifier 130."));

  // ---- BRIEF DESCRIPTION OF DRAWINGS ----
  children.push(sectionHeading("BRIEF DESCRIPTION OF THE SEVERAL VIEWS OF THE DRAWING"));
  children.push(numberedPara(14, "The accompanying drawings, where like reference numerals indicate like components, illustrate embodiments of the disclosure and, together with the description, serve to explain principles of operation. The drawings are illustrative and not limiting."));
  children.push(numberedPara(15, "FIG. 1 is a block diagram of a system 100 for cross-form-factor delegated spending control, illustrating an issuer tokenization service 102, a profile store 104, a stateful authorization engine 106, a provisioning subsystem 108, a notification service 110, and a profile management interface 112, showing cross-form-factor profile binding to a digital wallet token instance 160 and a personalized physical payment instrument 162 according to an embodiment of the present disclosure."));
  children.push(numberedPara(16, "FIG. 2 is a diagram illustrating provisioning of a delegated credential identifier 130 to a digital wallet token instance 160 and to a personalized physical payment instrument 162, both bound to a common stateful authorization profile 140 via form factor bindings 150, according to an embodiment of the present disclosure."));
  children.push(numberedPara(17, "FIG. 3 is a message-flow diagram showing an authorization request 180 received by the stateful authorization engine 106, profile resolution, constraint evaluation, atomic decrement of the remaining-usage counter value 142, recording of an authorization ledger entry 190, and generation of an authorization response 182, according to an embodiment of the present disclosure."));
  children.push(numberedPara(18, "FIG. 4 is a message-flow diagram showing receipt of a reversal message 184, ledger-based verification via the authorization ledger 144, idempotent counter restoration of the remaining-usage counter value 142, and reversal recording, according to an embodiment of the present disclosure."));
  children.push(numberedPara(19, "FIG. 5 is a diagram illustrating multi-delegate isolation, showing a primary payment account 120 associated with multiple delegated credential identifiers 130a, 130b, each having independent stateful authorization profiles 140a, 140b with independent remaining-usage counter values 142a, 142b, according to an embodiment of the present disclosure."));
  children.push(numberedPara(20, "FIG. 6 is a diagram illustrating dynamic profile modification via a profile modification request 188 from the primary account holder through the profile management interface 112, and real-time notification 186 flow via the notification service 110 upon counter decrement events, according to an embodiment of the present disclosure."));

  // ---- DETAILED DESCRIPTION ----
  children.push(sectionHeading("DETAILED DESCRIPTION OF THE INVENTION"));
  children.push(numberedPara(21, "The following description is presented to enable any person skilled in the art to make and use the invention. Various modifications will be readily apparent to those skilled in the art, and the general principles described herein may be applied to other embodiments and applications without departing from the spirit and scope of the present disclosure. The present disclosure is not intended to be limited to the embodiments shown but is to be accorded the widest scope consistent with the principles and features described herein."));

  // Definitions
  children.push(subHeading("Definitions"));
  children.push(numberedPara(22, "Unless the context indicates otherwise, the following terms have the meanings set forth below."));
  children.push(numberedPara(23, "\u201CPrimary account\u201D or \u201Cprimary payment account\u201D 120 refers to an underlying funding account (e.g., credit, debit, prepaid) held by a primary user or entity (the \u201Cprimary account holder\u201D)."));
  children.push(numberedPara(24, "\u201CSecondary user\u201D refers to a user who is distinct from the primary account holder and to whom limited spending authority is delegated. A secondary user may be a family member, employee, contractor, dependent, or other authorized individual."));
  children.push(numberedPara(25, "\u201CDelegated credential\u201D or \u201Cdelegated credential identifier\u201D 130 refers to a payment credential derived from the primary payment account 120 and delegated to a secondary user. A delegated credential identifier 130 may be represented as a pseudo-primary-account-number (pseudo-PAN), token, or other network-compatible identifier accepted by payment networks and merchants. The delegated credential identifier 130 is generated within an issuer security domain 124 without transmitting the primary account number to any third-party wallet provider."));
  children.push(numberedPara(26, "\u201CStateful authorization profile\u201D 140 (also referred to herein as a \u201Ccomposite control profile\u201D) refers to a persistent data structure bound to a delegated credential identifier 130 and used to evaluate authorization requests 180. A stateful authorization profile 140 includes at least a mutable remaining-usage counter value 142 representing a discrete number of permitted transactions, and may further include monetary constraints, temporal constraints, merchant-category constraints, geographic constraints, per-transaction amount caps, periodic amount caps, a counter reset policy 148, and an authorization ledger 144 keyed by authorization identifiers."));
  children.push(numberedPara(27, "\u201CRemaining-usage counter value\u201D 142 refers to a mutable integer value maintained server-side that represents the number of additional transactions that may be approved for a delegated credential identifier 130. The remaining-usage counter value 142 is decremented upon each approved authorization and may be restored upon reversal. The remaining-usage counter value 142 is distinct from an account balance; it represents a discrete count of permitted transaction events rather than a monetary amount."));
  children.push(numberedPara(28, "\u201CStateful authorization engine\u201D 106 refers to an issuer-side service that maintains persistent state for one or more stateful authorization profiles 140 and evaluates authorization requests 180 by applying profile rules, executing atomic state updates, and recording authorization events in the authorization ledger 144."));
  children.push(numberedPara(29, "\u201CAuthorization ledger\u201D 144 refers to an append-only or write-once record of authorization events associated with a stateful authorization profile 140, keyed by authorization identifiers, used for idempotent processing of authorizations, reversals, and duplicate detection."));
  children.push(numberedPara(30, "\u201CForm factor\u201D refers to a distinct physical or digital presentation of a payment credential at a merchant terminal 172, including but not limited to a digital wallet token instance 160 (e.g., NFC-enabled mobile wallet, in-app payment, wearable device token) and a personalized physical payment instrument 162 (e.g., plastic card with EMV chip, contactless card)."));
  children.push(numberedPara(31, "\u201CAtomic operation\u201D in the context of this disclosure refers to an operation that completes entirely or not at all with respect to concurrent operations on the same profile state, ensuring that no intermediate state is observable and that concurrent authorization requests 180 cannot both observe a pre-decrement counter value."));
  children.push(numberedPara(32, "In embodiments, the issuer generates and maintains delegated credential identifiers 130 within the issuer security domain 124 (issuer-side tokenization). The delegated credential identifier 130 is generated without transmitting the primary account number to any third-party wallet provider, thereby preserving primary account privacy. The issuer provisions the delegated credential identifier 130 to one or more digital wallet token instances 160 and/or to one or more personalized physical payment instruments 162. All provisioned form factors are bound to the same stateful authorization profile 140, enabling consistent enforcement regardless of how the delegated credential is presented at a merchant terminal 172. A transaction executed on any one form factor mutates the shared profile state\u2014including the remaining-usage counter value 142\u2014so that the counter reflects cumulative usage across all form factors."));

  // System Architecture
  children.push(subHeading("System Architecture (FIG. 1)"));
  children.push(numberedPara(33, "FIG. 1 illustrates an example system 100 for cross-form-factor delegated spending control according to an embodiment of the present disclosure. The system 100 comprises the following components."));
  children.push(numberedPara(34, "An issuer tokenization service 102 is configured to generate a delegated credential identifier 130 within the issuer security domain 124 and bind it to a primary payment account 120. The issuer tokenization service 102 generates a pseudo-primary-account-number format identifier and maintains a credential-to-account mapping 134 between the pseudo-PAN and an issuer-internal reference to the primary payment account 120 without transmitting the primary account number to any third-party wallet provider."));
  children.push(numberedPara(35, "A profile store 104 persists stateful authorization profiles 140. Each stateful authorization profile 140 includes mutable state variables (remaining-usage counter value 142, remaining monetary budget, validity timestamps), immutable configuration (constraint parameters 146, counter reset policy 148), and an authorization ledger 144. The profile store 104 supports atomic read-modify-write operations on profile state."));
  children.push(numberedPara(36, "A stateful authorization engine 106 receives payment authorization requests 180, resolves each request to a stateful authorization profile 140, evaluates a composite rule set, executes atomic state updates upon approval, and returns authorization responses 182. The stateful authorization engine 106 may be deployed within, or logically controlled by, the issuer or an issuer-authorized processor."));
  children.push(numberedPara(37, "A provisioning subsystem 108 is configured to provision the delegated credential identifier 130 to (i) one or more digital wallet token instances 160 and/or (ii) one or more personalized physical payment instruments 162. Provisioning to multiple form factors may produce multiple token instances that are cryptographically distinct (e.g., device-bound wallet tokens) while sharing a common ProfileID. Alternatively, provisioning may associate multiple form-factor identifiers to a single delegated credential identifier 130. In either case, authorization requests 180 for any associated form factor are resolved to the same stateful authorization profile 140, thereby implementing cross-form-factor synchronization of usage counters and other constraints."));
  children.push(numberedPara(38, "A notification service 110 is configured to transmit real-time notifications 186 to a device 122 associated with the primary account holder upon each atomic decrement of the remaining-usage counter value 142. Notifications 186 may identify the form factor used, the transaction amount, the merchant, and the updated remaining-usage counter value 142."));
  children.push(numberedPara(39, "A profile management interface 112 is configured to receive profile modification requests 188 from the primary account holder, enabling dynamic updates to the remaining-usage counter value 142, constraint parameters 146, and counter reset policy 148 while the delegated credential identifier 130 remains active and provisioned. Modifications take effect for subsequent authorization requests 180 on all provisioned form factors without requiring re-provisioning."));
  children.push(numberedPara(40, "Optional analytics, audit logging, and enterprise policy-management interfaces 114 may be provided for the primary user or enterprise administrator."));
  children.push(numberedPara(41, "Authorization requests 180 may be received in a standard payment-message format such as ISO 8583 or a network-specific equivalent from a payment network 170. The stateful authorization engine 106 resolves a stateful authorization profile key from one or more identifiers present in the authorization request 180 (e.g., delegated credential identifier 130, token identifier, device identifier)."));

  // Profile Data Model
  children.push(subHeading("Stateful Authorization Profile Data Model"));
  children.push(numberedPara(42, "A stateful authorization profile 140 may include one or more of the following fields (non-limiting examples). ProfileID is a unique identifier for the stateful authorization profile 140. DelegatedCredentialID is the identifier of the delegated credential identifier 130 bound to this profile. SecondaryUserID is the identifier of the secondary user to whom the credential is delegated. PrimaryAccountReference is an issuer-internal reference to the primary payment account 120."));
  children.push(numberedPara(43, "RemainingUsageCounterValue 142 is a mutable integer representing the discrete number of additional transactions permitted, decremented atomically upon each approved authorization. InitialUsageCounterValue 152 is the counter value set at profile creation or most recent reset, used for reset operations. UsageCounterResetPolicy 148 is optional and specifies periodic restoration of the remaining-usage counter value 142 (e.g., daily reset to initial value, weekly reset, monthly reset, no reset). When present, a reset operation restores the remaining-usage counter value 142 to the initial usage counter value 152 and is applied to the shared profile state, affecting all provisioned form factors simultaneously."));
  children.push(numberedPara(44, "MonetaryBudgetRemaining is an optional remaining monetary budget in a specified currency. ValidFrom and ValidUntil are timestamps defining the validity window. MerchantCategoryAllowList and MerchantCategoryDenyList are optional merchant-category constraint lists. GeographicAllowList and GeographicDenyList are optional geographic constraint lists. PerTransactionAmountCap is an optional maximum amount per individual transaction. PerDayAmountCap is an optional maximum aggregate amount per calendar day."));
  children.push(numberedPara(45, "AuthorizationLedger 144 is an ordered collection of authorization ledger entries 190, each keyed by an authorization identifier, recording the event type (approval, decline, reversal), timestamp, form factor identifier, transaction amount, and counter state change, supporting idempotent processing. IdempotencyWindow is a duration within which duplicate authorization messages are detected. LastAuthorizationKeys is a set of recently processed authorization identifiers for concurrency-safe replay protection. FormFactorBindings 150 is a list of form factor identifiers (token identifiers, device identifiers, card identifiers) bound to this stateful authorization profile 140, such that authorization requests 180 bearing any of these identifiers are resolved to this profile."));

  // Tokenization & Provisioning
  children.push(subHeading("Issuer-Side Tokenization and Provisioning (FIG. 2)"));
  children.push(numberedPara(46, "Referring now to FIG. 2, in issuer-side tokenization embodiments, the issuer tokenization service 102 generates a network-compatible delegated credential identifier 130 (pseudo-PAN) within the issuer security domain 124 for a secondary user who is distinct from the primary account holder. The issuer tokenization service 102 stores a credential-to-account mapping 134 between the delegated credential identifier 130 and the underlying primary account reference within its secure environment. The primary account number is not transmitted to any third-party wallet provider during provisioning, thereby preserving primary account privacy."));
  children.push(numberedPara(47, "The delegated credential identifier 130 may be provisioned by the provisioning subsystem 108 to a plurality of heterogeneous form factors including at least a digital wallet token instance 160 and a personalized physical payment instrument 162 using secure channel procedures (e.g., issuer-initiated push provisioning, token requestor-initiated provisioning with issuer approval)."));
  children.push(numberedPara(48, "All provisioned form factors are bound to the same stateful authorization profile 140 by association through the ProfileID or DelegatedCredentialID. The form factor bindings 150 in the stateful authorization profile 140 record each provisioned form factor identifier. When an authorization request 180 arrives bearing any bound form factor identifier, the stateful authorization engine 106 resolves it to the shared stateful authorization profile 140. Consequently, a transaction on the digital wallet token instance 160 and a transaction on the personalized physical payment instrument 162 both update the same remaining-usage counter value 142 maintained in the stateful authorization profile 140."));

  // Authorization Flow
  children.push(subHeading("Authorization Decisioning and Atomic State Updates (FIG. 3)"));
  children.push(numberedPara(49, "Referring now to FIG. 3, upon receipt of an authorization request 180, the stateful authorization engine 106 performs operations including the following."));
  children.push(numberedPara(50, "(a) Extraction. The stateful authorization engine 106 extracts transaction attributes from the authorization request 180, including amount, merchant category code, merchant identifier, transaction timestamp, country code, and entry mode. In embodiments where the authorization request 180 is formatted as an ISO 8583 message received from the payment network 170, the stateful authorization engine 106 extracts relevant data elements from standard message fields."));
  children.push(numberedPara(51, "(b) Profile Resolution. The stateful authorization engine 106 resolves the authorization request 180 to a ProfileID by mapping from a token identifier, delegated credential identifier 130, or form factor identifier present in the authorization request 180 to the form factor bindings 150 recorded in the profile store 104."));
  children.push(numberedPara(52, "(c) Temporal Validation. The stateful authorization engine 106 validates that the transaction timestamp falls within the validity window defined by ValidFrom and ValidUntil in the stateful authorization profile 140. If the timestamp is outside the window, the stateful authorization engine 106 declines the authorization."));
  children.push(numberedPara(53, "(d) Constraint Evaluation. The stateful authorization engine 106 evaluates merchant-category constraints (AllowList/DenyList), geographic constraints (AllowList/DenyList), per-transaction amount cap, and per-day amount cap as defined in the constraint parameters 146. If any constraint is violated, the stateful authorization engine 106 declines the authorization."));
  children.push(numberedPara(54, "(e) Usage Counter Evaluation. The stateful authorization engine 106 determines whether the remaining-usage counter value 142 satisfies a usage condition. In embodiments, the usage condition is that the remaining-usage counter value 142 is greater than zero."));
  children.push(numberedPara(55, "(f) Monetary Budget Evaluation. If a monetary budget constraint is present in the stateful authorization profile 140, the stateful authorization engine 106 determines whether the remaining monetary budget is sufficient for the transaction amount."));
  children.push(numberedPara(56, "(g) Atomic State Update. If all evaluations pass and the authorization is approved, the stateful authorization engine 106 executes an atomic compare-and-decrement operation comprising: (i) verifying that the remaining-usage counter value 142 observed during evaluation has not been modified by a concurrent operation (compare), (ii) decrementing the remaining-usage counter value 142 by one to produce an updated value (decrement), and (iii) recording an authorization ledger entry 190 in the authorization ledger 144 containing the authorization identifier, event type (approval), timestamp, form factor identifier, transaction amount, and the updated remaining-usage counter value 142\u2014all within a single atomic transaction. If the compare step fails (indicating a concurrent modification), the stateful authorization engine 106 may retry the evaluation or decline the authorization, depending on implementation."));
  children.push(numberedPara(57, "Atomicity may be implemented using transactional database semantics (e.g., serializable isolation), optimistic concurrency control with version fields, compare-and-swap (CAS) primitives, or distributed locking. The atomic operation ensures that concurrent authorization requests 180\u2014whether originating from the digital wallet token instance 160, the personalized physical payment instrument 162, or any other bound form factor\u2014cannot both observe a pre-decrement counter value, thereby preventing double-spend conditions."));
  children.push(numberedPara(58, "(h) Response. The stateful authorization engine 106 generates and returns an authorization response 182 to the payment network 170 indicating approval, decline, or partial approval. Upon approval, the authorization response 182 may include the updated remaining-usage counter value 142 for informational purposes."));
  children.push(numberedPara(59, "(i) Notification. Upon each atomic decrement, the notification service 110 transmits a real-time notification 186 to a device 122 associated with the primary account holder. The notification 186 identifies the form factor used (e.g., \u201Cdigital wallet\u201D or \u201Cphysical card\u201D), the transaction amount, the merchant, and the updated remaining-usage counter value 142, enabling the primary account holder to monitor delegated spending in real time."));

  // Reversals
  children.push(subHeading("Reversals, Timeouts, and Idempotency (FIG. 4)"));
  children.push(numberedPara(60, "Referring now to FIG. 4, payment networks may send reversal messages 184 or advice messages when an authorization is canceled, times out, or is otherwise not completed. To maintain correct profile state, the stateful authorization engine 106 implements idempotent counter restoration via the authorization ledger 144."));
  children.push(numberedPara(61, "Upon receiving a reversal message 184 referencing a previously approved authorization identifier, the stateful authorization engine 106 performs an idempotent counter restoration operation comprising: (i) querying the authorization ledger 144 to verify that the authorization identifier corresponds to an approved authorization that has not been previously reversed and that the reversal is within a defined reversal window; (ii) atomically incrementing the remaining-usage counter value 142 by one (restoring one permitted transaction) and recording a reversal event as an authorization ledger entry 190 in the authorization ledger 144 with the authorization identifier, event type (reversal), timestamp, and updated counter value\u2014all within a single atomic transaction; and (iii) the reversal recording in the authorization ledger 144 prevents duplicate restorations: if a second reversal message 184 arrives for the same authorization identifier, the ledger query in step (i) detects that the reversal has already been applied and suppresses the duplicate restoration."));
  children.push(numberedPara(62, "The counter restoration is effective regardless of which form factor originated the original transaction. After restoration, the restored counter capacity is available to any provisioned form factor for subsequent transactions. For example, if a transaction on the personalized physical payment instrument 162 is reversed, the restored counter permits an additional transaction on either the personalized physical payment instrument 162 or the digital wallet token instance 160."));
  children.push(numberedPara(63, "Duplicate authorization messages (retries) are detected using idempotency keys derived from network-standard fields (e.g., Systems Trace Audit Number, retrieval reference number, timestamp) and the authorization ledger 144. When a second authorization request 180 bears an idempotency key matching a previously processed authorization for the same delegated credential identifier 130, the stateful authorization engine 106 suppresses a second decrement of the remaining-usage counter value 142 and returns a consistent authorization response 182 matching the original decision, thereby preventing counter corruption from duplicate network messages across any of the provisioned form factors."));

  // Dynamic Modification
  children.push(subHeading("Dynamic Profile Modification (FIG. 6)"));
  children.push(numberedPara(64, "Referring now to FIG. 6, the primary account holder may modify the stateful authorization profile 140 of an active delegated credential identifier 130 without requiring re-provisioning of any form factor. The primary account holder submits a profile modification request 188 through the profile management interface 112."));
  children.push(numberedPara(65, "Modifications may include: updating the remaining-usage counter value 142 (e.g., adding more permitted transactions or reducing the remaining count); modifying monetary constraints, temporal constraints, merchant-category constraints, or geographic constraints within the constraint parameters 146; changing the counter reset policy 148; and suspending or reactivating the delegated credential identifier 130."));
  children.push(numberedPara(66, "Upon receiving the profile modification request 188 from the primary account holder (authenticated via the profile management interface 112), the stateful authorization engine 106 updates the relevant fields in the stateful authorization profile 140 atomically. The modification takes effect for subsequent authorization requests 180 on all provisioned form factors without requiring re-provisioning of any digital wallet token instance 160 or personalized physical payment instrument 162."));

  // Counter Reset
  children.push(subHeading("Counter Reset Policy"));
  children.push(numberedPara(67, "When a stateful authorization profile 140 includes a usage counter reset policy 148 specifying periodic restoration (e.g., daily, weekly, monthly), a scheduled process or the stateful authorization engine 106 itself restores the remaining-usage counter value 142 to the initial usage counter value 152 according to the defined schedule. The reset is applied to the shared profile state, affecting all provisioned form factors simultaneously. For example, a weekly reset restores five permitted transactions each Monday at 00:00 UTC, and the restored remaining-usage counter value 142 is available to both the digital wallet token instance 160 and the personalized physical payment instrument 162."));

  // Multi-Delegate
  children.push(subHeading("Multi-Delegate Isolation (FIG. 5)"));
  children.push(numberedPara(68, "Referring now to FIG. 5, a primary account holder may delegate spending authority to multiple secondary users simultaneously. The issuer tokenization service 102 generates a plurality of delegated credential identifiers 130a, 130b, each associated with the same primary payment account 120 and each bound to a respective distinct secondary user. Each delegated credential identifier 130a, 130b has an independent stateful authorization profile 140a, 140b with an independent remaining-usage counter value 142a, 142b. Counter decrements for one delegated credential identifier do not affect the remaining-usage counter value of any other delegated credential identifier. This isolation ensures that each secondary user's spending is tracked and limited independently, while all delegated credential identifiers ultimately draw from the same primary payment account 120 for settlement."));

  // Use Cases
  children.push(subHeading("Example Use Cases"));
  children.push(numberedPara(69, "Family delegation example. A parent (primary account holder) delegates a credential to a child (secondary user) with a remaining-usage counter value 142 of five, a per-transaction amount cap of $50, and a ValidUntil timestamp of the end of the month. The delegated credential identifier 130 is provisioned to the child\u2019s phone wallet (digital wallet token instance 160) and a personalized physical payment instrument 162. Each approved purchase on either the digital wallet token instance 160 or the personalized physical payment instrument 162 atomically decrements the shared remaining-usage counter value 142. After three purchases on the digital wallet token instance 160, the remaining-usage counter value 142 reads two\u2014and the child may make at most two more purchases on either form factor. The parent receives a real-time notification 186 after each purchase identifying which form factor was used. If the parent wishes to grant additional transactions, the parent updates the remaining-usage counter value 142 via the profile management interface 112 without re-provisioning."));
  children.push(numberedPara(70, "Enterprise delegation example. An administrator delegates a credential to a contractor with a counter reset policy 148 specifying a daily reset of three transactions, a MerchantCategoryAllowList limited to office supply merchants, and a per-transaction amount cap of $200. The contractor uses a digital wallet token instance 160. Each day, the remaining-usage counter value 142 resets to three. If a transaction is reversed, the remaining-usage counter value 142 is atomically restored. The authorization ledger 144 provides reconciliation detail including form factor identifier, timestamp, merchant, amount, and counter state for each authorization ledger entry 190."));

  // Closing
  children.push(numberedPara(71, "The embodiments described herein provide, among other benefits: (i) issuer-controlled delegated credentials compatible with merchant acceptance infrastructure, generated without exposing the primary account number to third-party wallet providers; (ii) fine-grained, stateful controls including discrete usage counters representing exact counts of permitted transactions, distinct from monetary balance limits; (iii) consistent enforcement across multiple heterogeneous form factors using shared profile state, such that a transaction on any form factor mutates the same remaining-usage counter value 142; (iv) atomic compare-and-decrement operations preventing double-spend conditions under concurrent authorizations from different form factors; (v) idempotent reversal handling with ledger-based counter restoration effective across form factors; (vi) dynamic profile modification by the primary account holder without requiring re-provisioning; and (vii) multi-delegate isolation with independent counter state per delegated credential identifier 130."));
  children.push(numberedPara(72, "It will be appreciated by those skilled in the art that modifications and variations of the embodiments described herein may be practiced without departing from the spirit and scope of the present disclosure. The specific embodiments described are offered by way of example and not limitation. The scope of the present disclosure is defined by the claims appended hereto."));

  // ==============================================================
  // CLAIMS (new page)
  // ==============================================================
  children.push(pageBreakPara());
  children.push(sectionHeading("CLAIMS"));
  children.push(emptyLine());
  children.push(bodyPara("What is claimed is:", { bold: true }));
  children.push(emptyLine());

  // Claim 1
  children.push(claimPara(1, "A computer-implemented method for cross-form-factor delegated spending control, comprising:"));
  children.push(claimSub("(a) generating, by an issuer-side tokenization service (102) operating within an issuer security domain (124), a delegated credential identifier (130) associated with a primary payment account (120) held by a primary account holder and bound to a secondary user distinct from the primary account holder, wherein the delegated credential identifier (130) comprises a pseudo-primary-account-number format identifier and is generated without transmitting the primary account number to any third-party wallet provider;"));
  children.push(claimSub("(b) instantiating, in a profile store (104), a stateful authorization profile (140) bound to the delegated credential identifier (130), the stateful authorization profile (140) comprising:"));
  children.push(claimSub("(i) a mutable remaining-usage counter value (142) representing a discrete number of permitted transactions,", 1.0));
  children.push(claimSub("(ii) one or more additional constraints (146) selected from a monetary constraint, a temporal constraint, a merchant-category constraint, and a geographic constraint, and", 1.0));
  children.push(claimSub("(iii) an authorization ledger (144) keyed by authorization identifiers;", 1.0));
  children.push(claimSub("(c) provisioning the delegated credential identifier (130) to a plurality of heterogeneous form factors including at least a digital wallet token instance (160) and a personalized physical payment instrument (162), wherein all provisioned form factors are bound to the same stateful authorization profile (140) such that a transaction on any one form factor mutates the shared profile state;"));
  children.push(claimSub("(d) receiving, by a stateful authorization engine (106), an authorization request (180) for a transaction initiated via any of the plurality of form factors, the authorization request (180) referencing the delegated credential identifier (130) or a token derived therefrom;"));
  children.push(claimSub("(e) resolving the authorization request (180) to the stateful authorization profile (140) by mapping from a token identifier, delegated credential identifier (130), or form factor identifier present in the authorization request (180) to the stateful authorization profile (140);"));
  children.push(claimSub("(f) evaluating the authorization request (180) against the stateful authorization profile (140) by:"));
  children.push(claimSub("(i) validating one or more of the additional constraints (146), and", 1.0));
  children.push(claimSub("(ii) determining that the remaining-usage counter value (142) satisfies a usage condition;", 1.0));
  children.push(claimSub("(g) upon approval, executing an atomic compare-and-decrement operation that decrements the remaining-usage counter value (142) and records an authorization ledger entry (190) in the authorization ledger (144) in a single atomic transaction, thereby preventing double-spend conditions under concurrent authorizations from any of the plurality of form factors; and"));
  children.push(claimSub("(h) returning an authorization response (182) indicating approval or decline, whereby a transaction executed via the digital wallet token instance (160) and a transaction executed via the personalized physical payment instrument (162) both update the same remaining-usage counter value (142) maintained in the stateful authorization profile (140)."));

  // Claims 2-10
  children.push(emptyLine());
  children.push(claimPara(2, "The method of claim 1, wherein receiving the authorization request comprises receiving a payment-message formatted authorization request conforming to ISO 8583 or a network-specific equivalent, and wherein evaluating comprises extracting a transaction amount and a merchant category code from the authorization request to evaluate a monetary constraint and a merchant-category constraint, respectively."));
  children.push(claimPara(3, "The method of claim 1, wherein the stateful authorization profile comprises a validity window defined by a valid-from timestamp and a valid-until timestamp, and evaluating comprises declining the authorization request when a transaction timestamp falls outside the validity window."));
  children.push(claimPara(4, "The method of claim 1, wherein the usage condition comprises the remaining-usage counter value being greater than zero."));
  children.push(claimPara(5, "The method of claim 1, wherein the atomic compare-and-decrement operation comprises: verifying that the remaining-usage counter value observed during evaluation has not been modified by a concurrent operation; decrementing the remaining-usage counter value by one only when the verification succeeds; and recording the authorization ledger entry comprising the authorization identifier, a form factor identifier, and the updated remaining-usage counter value within the same atomic transaction."));

  // Claim 6
  children.push(claimPara(6, "The method of claim 1, further comprising:"));
  children.push(claimSub("upon receiving a reversal message referencing a previously approved authorization identifier, performing an idempotent counter restoration operation comprising:"));
  children.push(claimSub("(i) querying the authorization ledger to verify the authorization identifier corresponds to an approved authorization that has not been previously reversed,", 1.0));
  children.push(claimSub("(ii) atomically incrementing the remaining-usage counter value by one, and", 1.0));
  children.push(claimSub("(iii) recording the reversal in the authorization ledger with the authorization identifier to prevent duplicate restorations,", 1.0));
  children.push(claimSub("wherein the counter restoration is effective regardless of which form factor originated the original transaction or which form factor may subsequently utilize the restored counter value."));

  children.push(claimPara(7, "The method of claim 1, wherein the stateful authorization profile further comprises a usage counter reset policy specifying periodic restoration of the remaining-usage counter value to an initial value according to a defined schedule, and wherein the reset is applied to the shared profile state affecting all provisioned form factors simultaneously."));
  children.push(claimPara(8, "The method of claim 1, further comprising transmitting, to a device associated with the primary account holder, a real-time notification upon each atomic decrement of the remaining-usage counter value, the notification identifying the form factor used, the transaction amount, and the updated remaining-usage counter value."));
  children.push(claimPara(9, "The method of claim 1, further comprising receiving, from the primary account holder, a profile modification request to update the remaining-usage counter value or one or more of the additional constraints of the stateful authorization profile while the delegated credential identifier remains active, wherein the modification takes effect for subsequent authorization requests on all provisioned form factors without requiring re-provisioning of any digital wallet token instance or personalized physical payment instrument."));
  children.push(claimPara(10, "The method of claim 1, further comprising generating a plurality of delegated credential identifiers each associated with the same primary payment account and each bound to a respective distinct secondary user, each delegated credential identifier having an independent stateful authorization profile with an independent remaining-usage counter value, such that counter decrements for one delegated credential do not affect the remaining-usage counter value of any other delegated credential."));

  // Claim 11 (System)
  children.push(emptyLine());
  children.push(claimPara(11, "A system for cross-form-factor delegated spending control, comprising:"));
  children.push(claimSub("one or more processors; and"));
  children.push(claimSub("non-transitory memory storing instructions that, when executed by the one or more processors, cause the system to:"));
  children.push(claimSub("(a) generate a delegated credential identifier (130) associated with a primary payment account (120) held by a primary account holder and bound to a secondary user distinct from the primary account holder, within an issuer security domain (124), without transmitting the primary account number to any third-party wallet provider;"));
  children.push(claimSub("(b) instantiate a stateful authorization profile (140) bound to the delegated credential identifier (130), the stateful authorization profile (140) comprising at least a mutable remaining-usage counter value (142) representing a discrete number of permitted transactions and an authorization ledger (144) keyed by authorization identifiers;"));
  children.push(claimSub("(c) provision the delegated credential identifier (130) to a plurality of heterogeneous form factors including at least a digital wallet token instance (160) and a personalized physical payment instrument (162), wherein all provisioned form factors are bound to the same stateful authorization profile (140) such that a transaction on any one form factor mutates the shared profile state;"));
  children.push(claimSub("(d) receive an authorization request (180) referencing the delegated credential identifier (130) or a token derived therefrom;"));
  children.push(claimSub("(e) resolve the authorization request (180) to the stateful authorization profile (140);"));
  children.push(claimSub("(f) evaluate the authorization request (180) by applying a usage condition based on the remaining-usage counter value (142);"));
  children.push(claimSub("(g) upon approving the authorization request (180), execute an atomic compare-and-decrement operation that decrements the remaining-usage counter value (142) and records an authorization ledger entry (190) in the authorization ledger (144) in a single atomic transaction, preventing double-spend conditions under concurrent authorizations from any of the plurality of form factors; and"));
  children.push(claimSub("(h) transmit an authorization response (182) to a payment network (170)."));

  // Claims 12-15
  children.push(emptyLine());
  children.push(claimPara(12, "The system of claim 11, wherein the instructions further cause the system to enforce at least one of: a per-transaction amount cap, a daily amount cap, a merchant-category allow list, a geographic allow list, and a validity window defined by a valid-from timestamp and a valid-until timestamp."));
  children.push(claimPara(13, "The system of claim 11, wherein the instructions further cause the system to, upon receiving a second authorization request bearing an idempotency key matching a previously processed authorization request for the same delegated credential identifier, suppress a second decrement of the remaining-usage counter value while returning a consistent authorization response matching the original decision, thereby preventing counter corruption from duplicate network messages across any of the provisioned form factors."));
  children.push(claimPara(14, "The system of claim 11, wherein the instructions further cause the system to, upon receiving a reversal message referencing a previously approved authorization identifier, perform an idempotent counter restoration operation comprising querying the authorization ledger to verify the authorization identifier corresponds to an approved authorization not previously reversed, atomically incrementing the remaining-usage counter value by one, and recording the reversal in the authorization ledger to prevent duplicate restorations, wherein the counter restoration is available to all provisioned form factors regardless of which form factor originated the original transaction."));
  children.push(claimPara(15, "The system of claim 11, wherein the instructions further cause the system to generate a plurality of delegated credential identifiers each associated with the same primary payment account and each bound to a respective distinct secondary user with an independent stateful authorization profile, such that counter decrements for one delegated credential do not affect the remaining-usage counter value of any other delegated credential."));

  // ==============================================================
  // ABSTRACT (new page)
  // ==============================================================
  children.push(pageBreakPara());
  children.push(sectionHeading("ABSTRACT OF THE DISCLOSURE"));
  children.push(emptyLine());
  children.push(bodyPara("Systems and methods for cross-form-factor delegated spending control are disclosed. An issuer-side tokenization service generates a delegated credential identifier associated with a primary payment account and bound to a secondary user. The credential is bound to a stateful authorization profile comprising a mutable remaining-usage counter value representing a discrete number of permitted transactions and an authorization ledger. The credential is provisioned to heterogeneous form factors including a digital wallet token instance and a personalized physical payment instrument, all bound to the same profile. A stateful authorization engine evaluates authorization requests and upon approval executes an atomic compare-and-decrement operation on the remaining-usage counter value in a single atomic transaction that also records a ledger entry, preventing double-spend under concurrent authorizations. A transaction on any form factor updates the shared counter. Idempotent reversal handling restores counter state via ledger-based verification, with restored capacity available across all form factors."));

  // ==============================================================
  // FIGURES (new pages, one per figure)
  // ==============================================================
  const figures = [
    { file: "FIG1-system-architecture.png", caption: "FIG. 1", w: 7.0, h: 4.77 },
    { file: "FIG2-provisioning.png", caption: "FIG. 2", w: 6.5, h: 4.69 },
    { file: "FIG3-authorization-flow.png", caption: "FIG. 3", w: 6.5, h: 5.47 },
    { file: "FIG4-reversal-flow.png", caption: "FIG. 4", w: 6.5, h: 4.47 },
    { file: "FIG5-multi-delegate.png", caption: "FIG. 5", w: 6.5, h: 4.47 },
    { file: "FIG6-dynamic-modification.png", caption: "FIG. 6", w: 6.5, h: 3.61 },
  ];

  for (const fig of figures) {
    children.push(pageBreakPara());
    const figElements = figurePara(fig.file, fig.caption, fig.w, fig.h);
    children.push(...figElements);
  }

  return children;
}

// ============================================================
// GENERATE DOCUMENT
// ============================================================

async function main() {
  const children = buildDocument();

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: {
              width: PAGE_WIDTH,
              height: PAGE_HEIGHT,
            },
            margin: MARGINS,
          },
        },
        headers: {
          default: new Header({
            children: [],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    font: FONT,
                    size: 20,
                  }),
                ],
              }),
            ],
          }),
        },
        children,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const outputPath = path.resolve(
    __dirname,
    "Ayris_Pay_Rewritten_Patent_Application.docx"
  );
  fs.writeFileSync(outputPath, buffer);
  console.log("Patent DOCX generated:", outputPath);
  console.log("Pages estimated from content length");
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
