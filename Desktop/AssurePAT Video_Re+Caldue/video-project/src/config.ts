// Assure PAT Brand Film — Screenshot-Based Cinematic Video
// Synced to Liam_voiceover.mp3 (157 seconds)
// 30fps × 157s = 4710 total frames
// Each scene has exact start/end frames from voiceover timestamps (MM:SS.cs)

export const VIDEO_CONFIG = {
  fps: 30,
  width: 1920,
  height: 1080,
  totalDurationInFrames: 4710, // 157 seconds
};

export interface SceneConfig {
  id: string;
  label: string;
  startFrame: number;
  durationInFrames: number;
  headline: string;
  subline: string;
  voiceover: string;
  image: string | null; // filename in public/screens/
  platform: "web" | "mobile" | "none";
  textSide: "left" | "right" | "center";
  overlayWords?: string[]; // words that appear one by one (intro/closing)
  zoom: { x: number; y: number; startScale: number; endScale: number };
}

// Helper: convert MM:SS.cs to frame number at 30fps
function toFrame(min: number, sec: number, cs: number): number {
  const totalSeconds = min * 60 + sec + cs / 100;
  return Math.round(totalSeconds * VIDEO_CONFIG.fps);
}

// ═══════════════════════════════════════════════════════════════
// SCENES — 19 scenes with exact start/end frames
// Gaps between scenes show only background (breathing room)
// ═══════════════════════════════════════════════════════════════

const sceneDefs: Array<{
  id: string;
  label: string;
  start: [number, number, number]; // [min, sec, cs]
  end: [number, number, number];
  headline: string;
  subline: string;
  voiceover: string;
  image: string | null;
  platform: "web" | "mobile" | "none";
  textSide: "left" | "right" | "center";
  overlayWords?: string[];
  zoom: { x: number; y: number; startScale: number; endScale: number };
}> = [
  {
    id: "intro",
    label: "Opening",
    start: [0, 0, 0],
    end: [0, 9, 5],
    headline: "Assure PAT",
    subline: "Payment Acceptance Testing",
    voiceover: "In a world where payment testing demands precision, compliance, and speed — Assure Payment Acceptance Testing delivers end-to-end automation.",
    image: null,
    platform: "none",
    textSide: "center",
    overlayWords: ["Precision", "Compliance", "Speed"],
    zoom: { x: 0.5, y: 0.5, startScale: 1, endScale: 1 },
  },
  {
    id: "scene-2",
    label: "Request Lifecycle",
    start: [0, 9, 6],
    end: [0, 18, 0],
    headline: "Full Request Lifecycle",
    subline: "Structured. Governed. Tracked.",
    voiceover: "A fully automated request lifecycle. From request creation to fulfillment — every step is structured, governed, and tracked.",
    image: "request-lifecycle.png",
    platform: "web",
    textSide: "left",
    zoom: { x: 0.5, y: 0.4, startScale: 1.0, endScale: 1.12 },
  },
  {
    id: "scene-3",
    label: "Test Information",
    start: [0, 18, 13],
    end: [0, 35, 25],
    headline: "Define the Request",
    subline: "Objective. Budget. Limits. Location.",
    voiceover: "The Requestor kicks off the process by defining the test objective, setting the start and end dates, allocating budget and individual transaction limits, and specifying Merchant Category Codes and supported countries.",
    image: "testobjective-budget-startENDdate-MCC-Country-IndividualTxnLimit.png",
    platform: "web",
    textSide: "right",
    zoom: { x: 0.5, y: 0.45, startScale: 1.05, endScale: 1.2 },
  },
  {
    id: "scene-4",
    label: "Test Case Configuration",
    start: [0, 36, 4],
    end: [0, 46, 28],
    headline: "Test Case Configuration",
    subline: "Automatic Selection. Zero Manual Setup.",
    voiceover: "Next — Test Case Configuration. The system automatically selects applicable test cases based on the terminal and configuration chosen. No manual setup required.",
    image: "Test-cases-configuration.png",
    platform: "web",
    textSide: "left",
    zoom: { x: 0.5, y: 0.5, startScale: 1.0, endScale: 1.15 },
  },
  {
    id: "scene-5",
    label: "Issuer, Partner & Testers",
    start: [0, 46, 30],
    end: [1, 1, 27],
    headline: "Select & Submit",
    subline: "Issuer. Partner. Testers. Budget.",
    voiceover: "Select card feature, product, and issuer — and the system instantly shows available cards in the vault. Assign a testing partner and tester, you can even control how much a tester can spend, when all done, click submit, that's it.",
    image: "Issuer-testingpartner-testers-controls.png",
    platform: "web",
    textSide: "right",
    zoom: { x: 0.5, y: 0.5, startScale: 1.0, endScale: 1.0 },
  },
  {
    id: "scene-6",
    label: "SME Approval",
    start: [1, 2, 3],
    end: [1, 5, 22],
    headline: "Review & Approve",
    subline: "One-Click Governance",
    voiceover: "The SME reviews and approves the Request Project.",
    image: "approval-window.png",
    platform: "web",
    textSide: "left",
    zoom: { x: 0.5, y: 0.5, startScale: 1.0, endScale: 1.0 },
  },
  {
    id: "scene-7",
    label: "Card Assignment",
    start: [1, 6, 6],
    end: [1, 14, 2],
    headline: "Smart Card Assignment",
    subline: "Intelligent Automation. Full Control.",
    voiceover: "The system auto-selects a card from inventory — with manual override always available. Intelligent automation, full control.",
    image: "card-assignment-window.png",
    platform: "web",
    textSide: "right",
    zoom: { x: 0.5, y: 0.5, startScale: 1.0, endScale: 1.0 },
  },
  {
    id: "scene-8",
    label: "Mobile Dashboard",
    start: [1, 14, 12],
    end: [1, 20, 20],
    headline: "Assure PAT Mobile",
    subline: "Instant Card Delivery",
    voiceover: "Once assigned, the tester instantly receives the card on Assure Payment Acceptance Testing mobile application.",
    image: "dashboard.png",
    platform: "mobile",
    textSide: "left",
    zoom: { x: 0.5, y: 0.5, startScale: 1.0, endScale: 1.0 },
  },
  {
    id: "scene-9",
    label: "Card Listing",
    start: [1, 21, 6],
    end: [1, 28, 19],
    headline: "Cards by Environment",
    subline: "Organized. Visible. Ready.",
    voiceover: "All assigned cards appear immediately — ready to use. Cards are organized by environment with complete visibility at a glance.",
    image: "card-listing.png",
    platform: "mobile",
    textSide: "right",
    zoom: { x: 0.5, y: 0.5, startScale: 1.0, endScale: 1.0 },
  },
  {
    id: "scene-10",
    label: "Card Details",
    start: [1, 29, 5],
    end: [1, 39, 20],
    headline: "Full Card Visibility",
    subline: "Limits. MCC. Balance. Test Cases.",
    voiceover: "Once you open a card, it shows spending and usage limits, supported countries, MCC restrictions, balance, and linked test cases — full transparency.",
    image: "card-details.png",
    platform: "mobile",
    textSide: "left",
    zoom: { x: 0.5, y: 0.5, startScale: 1.0, endScale: 1.0 },
  },
  {
    id: "scene-11",
    label: "Contactless Payment",
    start: [1, 40, 3],
    end: [1, 47, 16],
    headline: "Tap & Pay",
    subline: "Real-Time Execution",
    voiceover: "Tap and Pay. Perform contactless testing on a dedicated POS terminal. Real-time execution.",
    image: "txn-performing.png",
    platform: "mobile",
    textSide: "right",
    zoom: { x: 0.5, y: 0.5, startScale: 1.0, endScale: 1.0 },
  },
  {
    id: "scene-12",
    label: "Transaction Done",
    start: [1, 48, 2],
    end: [1, 51, 27],
    headline: "Payment Confirmed",
    subline: "Upload Receipt. Track History.",
    voiceover: "You can even upload the receipt here or later through transaction history.",
    image: "Transaction-done.png",
    platform: "mobile",
    textSide: "left",
    zoom: { x: 0.5, y: 0.5, startScale: 1.0, endScale: 1.0 },
  },
  {
    id: "scene-13",
    label: "Testing Updates",
    start: [1, 52, 13],
    end: [2, 5, 15],
    headline: "Live Test Monitoring",
    subline: "Pass. Fail. Retry. Real Time.",
    voiceover: "SME can view all the testing, transactions performed for the Request project in real time. They verify the logs, Receipts and can mark the testing as passed, failed or to retry any specific test case.",
    image: "testing-update.png",
    platform: "web",
    textSide: "right",
    zoom: { x: 0.5, y: 0.5, startScale: 1.0, endScale: 1.0 },
  },
  {
    id: "scene-14",
    label: "Remaining Usage Zero",
    start: [2, 6, 7],
    end: [2, 16, 7],
    headline: "Zero Remaining Usage",
    subline: "No Unnecessary Spend",
    voiceover: "Once all the test cases are passed, the remaining usage becomes 0 and the card can not be used to perform any transaction, which removes unnecessary usage of the card.",
    image: "Remaining Usage 0.png",
    platform: "web",
    textSide: "left",
    zoom: { x: 0.5, y: 0.5, startScale: 1.0, endScale: 1.0 },
  },
  {
    id: "scene-15",
    label: "Card Usage History",
    start: [2, 16, 29],
    end: [2, 18, 22],
    headline: "Card Usage History",
    subline: "Complete Audit Trail",
    voiceover: "SME can view the card usage",
    image: "card-usage-history.png",
    platform: "web",
    textSide: "right",
    zoom: { x: 0.5, y: 0.5, startScale: 1.0, endScale: 1.0 },
  },
  {
    id: "scene-16",
    label: "Assignment History",
    start: [2, 19, 9],
    end: [2, 20, 14],
    headline: "Assignment History",
    subline: "Who. When. How Much.",
    voiceover: "card assignment history",
    image: "assignment-history.png",
    platform: "web",
    textSide: "left",
    zoom: { x: 0.5, y: 0.5, startScale: 1.0, endScale: 1.0 },
  },
  {
    id: "scene-17",
    label: "Transaction Detail",
    start: [2, 21, 0],
    end: [2, 23, 8],
    headline: "Audit History",
    subline: "Every Detail. Every Card.",
    voiceover: "And all the Audit history related to any specific card",
    image: "transaction-detail.png",
    platform: "web",
    textSide: "right",
    zoom: { x: 0.5, y: 0.5, startScale: 1.0, endScale: 1.0 },
  },
  {
    id: "scene-18",
    label: "Card Controls",
    start: [2, 23, 40],
    end: [2, 29, 22],
    headline: "Dynamic Card Controls",
    subline: "Modify. Restrict. Release.",
    voiceover: "They can also control the behavior of any assigned card by modifying the controls for any assigned card",
    image: "assigned-card-contro.png",
    platform: "web",
    textSide: "left",
    zoom: { x: 0.5, y: 0.5, startScale: 1.0, endScale: 1.0 },
  },
  {
    id: "closing",
    label: "Closing",
    start: [2, 30, 10],
    end: [2, 36, 29],
    headline: "Assure PAT",
    subline: "Payment Acceptance Testing",
    voiceover: "Automate your payment testing. Gain visibility, Reduce risk and Move faster with confidence.",
    image: null,
    platform: "none",
    textSide: "center",
    overlayWords: ["Gain Visibility", "Reduce Risk", "Move Faster"],
    zoom: { x: 0.5, y: 0.5, startScale: 1, endScale: 1 },
  },
];

// Build SCENES array with computed frame numbers
export const SCENES: SceneConfig[] = sceneDefs.map((def) => {
  const startFrame = toFrame(...def.start);
  const endFrame = toFrame(...def.end);
  return {
    id: def.id,
    label: def.label,
    startFrame,
    durationInFrames: endFrame - startFrame,
    headline: def.headline,
    subline: def.subline,
    voiceover: def.voiceover,
    image: def.image,
    platform: def.platform,
    textSide: def.textSide,
    overlayWords: def.overlayWords,
    zoom: def.zoom,
  };
});
