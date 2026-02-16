# Assure PAT Video — Progress Diary

## Project Overview
- **Product**: Assure PAT (Payment Acceptance Testing) by Ayris Global
- **Goal**: Create a cinematic product walkthrough video using real screenshots
- **Tech Stack**: Remotion 4.0.421, React 19, TypeScript 5.9, Bun
- **Video Specs**: 1920x1080, 30fps, 157 seconds (4710 frames)
- **Audio**: Liam voiceover (ElevenLabs male voice) + ambient BGM

---

## Phase 1 — Initial Setup (Abandoned)

### What was done
- Built an animated UI mockup approach with 16 design-system components and 22 scene files
- Created device frames (laptop/phone) with stylized animated representations of product screens
- This approach was fully implemented and rendered

### Why it was abandoned
- The animated mockups looked generic and didn't represent the actual product
- User wanted to show the real product using actual screenshots
- All design-system/ and scenes/ directories were deleted

---

## Phase 2 — Screenshot-Based Cinematic Video (Current)

### Step 1: Audio Analysis
- **Liam_voiceover.mp3**: 2:37 duration (157 seconds), 128kbps, mono, 44100Hz
- **bgm.wav**: 11.5MB ambient background music pad
- Total frames needed: 157s x 30fps = 4710 frames

### Step 2: Script Parsing & Timestamp Conversion
Script.md provides end-time timestamps in `MM:SS.ms` format. Converted to frame durations:

| Scene | End Time | Cumulative Frames | Duration (frames) | Duration (seconds) |
|-------|----------|-------------------|-------------------|-------------------|
| Intro | — | 120 | 120 | 4.0s |
| Scene 1 | 00:09.17 | 275 | 155 | 5.17s |
| Scene 2 | 00:18.23 | 547 | 272 | 9.07s |
| Scene 3 | 00:36.05 | 1082 | 535 | 17.83s |
| Scene 4 | 01:01.25 | 1838 | 756 | 25.20s |
| Scene 5 | 01:05.20 | 1956 | 118 | 3.93s |
| Scene 6 | 01:14.24 | 2227 | 271 | 9.03s |
| Scene 7 | 01:21.00 | 2430 | 203 | 6.77s |
| Scene 8 | 01:29.00 | 2670 | 240 | 8.00s |
| Scene 9 | 01:40.00 | 3000 | 330 | 11.00s |
| Scene 10 | 01:48.00 | 3240 | 240 | 8.00s |
| Scene 11 | 01:52.12 | 3364 | 124 | 4.13s |
| Scene 12 | 02:06.05 | 3782 | 418 | 13.93s |
| Scene 13 | 02:15.26 | 4058 | 276 | 9.20s |
| Scene 14 | 02:18.25 | 4148 | 90 | 3.00s |
| Scene 15 | 02:19.26 | 4178 | 30 | 1.00s |
| Scene 16 | 02:23.18 | 4295 | 117 | 3.90s |
| Scene 17 | 02:29.22 | 4477 | 182 | 6.07s |
| Closing | 02:37.00 | 4710 | 233 | 7.77s |

**Total: 4710 frames = 157 seconds** (matches voiceover duration)

### Step 3: Image Collection
Copied 16 screenshots from source directories to `public/screens/`:

**From `assure-web/` (11 images):**
1. `request-lifecycle.png` — 10-stage request workflow overview
2. `testobjective-budget-startENDdate-MCC-Country-IndividualTxnLimit.png` — Test info form
3. `Test-cases-configuration.png` — Terminal/test case selection
4. `Issuer-testingpartner-testers-controls.png` — Issuer, partner, tester assignment
5. `approval-window.png` — SME approval dialog
6. `card-assignment-window.png` — Card assignment interface
7. `testing-update.png` — Live test monitoring dashboard
8. `assigned-card-contro.png` — Card controls panel (name truncated on disk)
9. `card-usage-history.png` — Card usage history table
10. `assignment-history.png` — Assignment history table
11. `transaction-detail.png` — Transaction audit detail view

**From `assurePATmobile/` (5 images):**
12. `dashboard.png` — Mobile app dashboard
13. `card-listing.png` — Mobile card listing by environment
14. `card-details.png` — Mobile card detail view
15. `txn-performing.png` — Mobile contactless payment screen
16. `Transaction-done.png` — Mobile transaction confirmation

### Known Issue: "Remaining Usage 0.png"
- Script.md references "Remaining Usage 0.png" but this file does NOT exist
- **Workaround**: Scene 13 uses `assigned-card-contro.png` with a tight zoom targeting the Remaining Usage field area (x: 0.72, y: 0.18, scale: 1.2 → 1.8)

### Step 4: Config Rewrite (`config.ts`)
- Defined `SceneConfig` interface with fields: id, label, durationInFrames, headline, subline, voiceover, image, platform, zoom
- `zoom` object per scene: `{ x, y, startScale, endScale }` for Ken Burns targeting
- Zoom targets chosen based on visual analysis of screenshots (e.g., scene 4 zooms to y:0.7 to focus on tester table at bottom)
- Platform field distinguishes web (laptop-sized display) from mobile (phone-sized display)
- Runtime verification: sum of all scene durations checked against totalDurationInFrames

### Step 5: Composition Rewrite (`Composition.tsx`)

**BackgroundCards component:**
- Discover card: blue gradient (#00A4C7 → #0088A8 → #006680), top-right, ~6% opacity
- Diners card: grey gradient (#4A4A5A → #3A3A48 → #2A2A36), bottom-left, ~5% opacity
- Third echo card: subtle center element at 2.5% opacity
- All cards drift slowly using `frame / durationInFrames` for linear movement and `Math.sin(frame * 0.003)` for gentle sway
- Creates cinematic depth without distracting from content

**SceneImage component:**
- Ken Burns zoom: `interpolate(frame, [0, durationInFrames], [startScale, endScale])` with clamp
- Transform origin set from scene's zoom.x/y coordinates
- Entrance: spring animation (damping: 200, mass: 1.2) with fade + slide up
- Exit: 12-frame fade out at scene end
- Mobile scenes: 380x680px container with 24px border radius
- Web scenes: 1340x740px container with 12px border radius
- Shadow: `0 20px 80px rgba(0,0,0,0.5)` for depth
- Subtle teal glow behind image container

**TextOverlay component:**
- Headline: immediately appears via fast spring (damping: 200, mass: 0.8)
- Subline: 5-frame delay after headline
- Intro/Closing: centered layout with "Assure PAT" branding (PAT in orange #FF6B35)
- Regular scenes: bottom-left positioning with dark gradient scrim for readability
- Exit: 15-frame fade out

**Main Composition:**
- `<Series>` wrapping all scenes for sequential playback
- `<Sequence from={0}>` for both audio tracks
- Voiceover at full volume
- BGM with interpolated volume envelope: 0 → 0.08 (fade in over 2s) → 0.08 → 0 (fade out over 3s)
- Progress bar at bottom: orange-to-teal gradient, width based on frame/totalFrames

### Step 6: Root.tsx Update
- Points to `AssurePATWalkthrough` component
- Uses `VIDEO_CONFIG.totalDurationInFrames` (4710)

### Step 7: Package.json Update
- Changed all scripts from `remotion` CLI to `bunx remotion` for bun compatibility
- Scripts: `studio`, `render`, `render:fast`

### Step 8: TypeScript Verification
- `npx tsc --noEmit` — **PASSED** (zero errors)

---

## File Structure

```
video-project/
  src/
    index.ts          — Remotion entry point (registerRoot)
    Root.tsx          — Composition registration
    config.ts         — 19 scenes, timings, zoom targets
    Composition.tsx   — BackgroundCards, SceneImage, TextOverlay, Scene, main composition
  public/
    audio/
      Liam_voiceover.mp3   — 157s ElevenLabs male voiceover
      bgm.wav              — Ambient background music
      voiceover.mp3        — Old edge-tts voice (unused)
    screens/
      (16 PNG screenshots)
  out/
    assurepat-walkthrough.mp4  — Rendered output
  package.json
  tsconfig.json
```

---

## Design Decisions

1. **Screenshots over mockups**: Real product screenshots preserve authenticity and show exactly what the product looks like, unlike animated mockups or abstract geometry.

2. **Ken Burns over static display**: Slow zoom/pan keeps screenshots visually interesting over 5-15 second scenes and draws attention to the feature being discussed in voiceover.

3. **Immediate text appearance**: Text overlays appear at scene start (not delayed) to maintain sync with voiceover, which starts narrating immediately.

4. **Background card motif**: Discover (blue) and Diners (grey) card silhouettes at very low opacity (5-6%) create thematic depth without competing with foreground screenshots.

5. **Platform-aware sizing**: Mobile screenshots displayed in portrait-style containers (380x680), web screenshots in landscape (1340x740) — matching their natural aspect ratios.

6. **Scene 13 zoom workaround**: Missing "Remaining Usage 0.png" handled by zooming into the Remaining Usage area of `assigned-card-contro.png` at 1.2x-1.8x scale.

---

## Phase 3 — Corrections (Timing, Layout, BGM)

### Corrections Applied

1. **Timestamps are START times (not end times)**
   - Previously interpreted as end times, causing intro to be only 4s (120 frames)
   - With start times: intro = 0→9.17s = 275 frames (9.17s) — matches voiceover duration
   - All scene durations recalculated: duration = next scene start - current scene start
   - Scene 17 (card controls) now 204 frames, closing auto-calculates to fill remaining (29 frames)

2. **Removed black background from mobile phone mockups**
   - Mobile screenshots no longer have `boxShadow` or dark `border`
   - Clean transparent look, image displays directly on the cinematic background

3. **Text overlays moved to left/right sides (alternating)**
   - Added `textSide` field to SceneConfig: `"left" | "right" | "center"`
   - Intro/closing: centered (as before)
   - Regular scenes: text panel (420px wide) on the specified side
   - Dark gradient scrim behind text fades toward center for readability
   - Headline slides in from the edge with spring animation
   - Orange-to-teal accent line under headline
   - Alternating pattern: scene 1 left, scene 2 right, scene 3 left, etc.

4. **New BGM file**
   - Changed from `bgm.wav` to `new_bgm.mp3`
   - Same volume envelope: fade in over 2s (0→0.08), sustain, fade out over 3s

### Updated Duration Table (Start Times)

| Scene | Starts at | Duration | Frames |
|-------|-----------|----------|--------|
| Intro | 0:00 | 9.17s | 275 |
| Scene 1 | 0:09.17 | 9.06s | 272 |
| Scene 2 | 0:18.23 | 17.82s | 535 |
| Scene 3 | 0:36.05 | 25.20s | 756 |
| Scene 4 | 1:01.25 | 3.95s | 118 |
| Scene 5 | 1:05.20 | 9.04s | 271 |
| Scene 6 | 1:14.24 | 6.76s | 203 |
| Scene 7 | 1:21.00 | 8.00s | 240 |
| Scene 8 | 1:29.00 | 11.00s | 330 |
| Scene 9 | 1:40.00 | 8.00s | 240 |
| Scene 10 | 1:48.00 | 4.12s | 124 |
| Scene 11 | 1:52.12 | 13.93s | 418 |
| Scene 12 | 2:06.05 | 9.21s | 276 |
| Scene 13 | 2:15.26 | 2.99s | 90 |
| Scene 14 | 2:18.25 | 1.01s | 30 |
| Scene 15 | 2:19.26 | 3.92s | 117 |
| Scene 16 | 2:23.18 | 6.04s | 182 |
| Scene 17 | 2:29.22 | 6.80s | 204 |
| Closing | 2:36.04 | auto | 29 |
| **Total** | | **157s** | **4710** |

---

## Phase 4 — Precision Timing Overhaul

### What Changed

User provided a complete revised script with **exact start AND end times** for all 19 scenes (MM:SS.cs format). Major architectural changes:

1. **`<Series>` → `<Sequence from={startFrame}>`**
   - Switched from sequential `Series` playback to absolute-positioned `Sequence` components
   - Each scene placed at its exact start frame with exact duration
   - Gaps between scenes show only the background cards (breathing room during voiceover pauses)

2. **Assure PAT logo integration**
   - Logo file: `public/Assure-pat-logo/assure-logo.png` (orange "A" icon)
   - Reference: `how to put logo and text.png` shows layout: icon + "Assure" + subtitle
   - Used in intro and closing scenes with spring entrance animation

3. **Word-by-word overlay effects**
   - Intro: "Precision", "Compliance", "Speed" appear one by one with bouncy spring
   - Closing: "Gain Visibility", "Reduce Risk", "Move Faster" appear one by one
   - Each word in a bordered pill/badge with staggered timing

4. **Image offset based on text side**
   - Text left → image shifts 120px right
   - Text right → image shifts 120px left
   - Creates visual balance instead of both being centered

5. **Config architecture rewrite**
   - `sceneDefs` array with raw `[min, sec, cs]` tuples for start/end
   - `toFrame()` helper converts to frame numbers at 30fps
   - `SCENES` computed from sceneDefs with startFrame + durationInFrames

### Scene Timing Table (Exact Start/End)

| # | Scene | Start | End | Frames |
|---|-------|-------|-----|--------|
| 1 | Intro | 0:00.00 | 0:09.05 | 272 |
| 2 | Request Lifecycle | 0:09.06 | 0:18.00 | 268 |
| 3 | Test Information | 0:18.13 | 0:35.25 | 514 |
| 4 | Test Case Config | 0:36.04 | 0:46.28 | 307 |
| 5 | Issuer/Testers | 0:46.30 | 1:01.27 | 449 |
| 6 | SME Approval | 1:02.03 | 1:05.22 | 96 |
| 7 | Card Assignment | 1:06.06 | 1:14.02 | 239 |
| 8 | Mobile Dashboard | 1:14.12 | 1:20.20 | 182 |
| 9 | Card Listing | 1:21.06 | 1:28.19 | 214 |
| 10 | Card Details | 1:29.05 | 1:39.20 | 304 |
| 11 | Tap & Pay | 1:40.03 | 1:47.16 | 214 |
| 12 | Transaction Done | 1:48.02 | 1:51.27 | 97 |
| 13 | Test Monitoring | 1:52.13 | 2:05.15 | 391 |
| 14 | Remaining Usage | 2:06.07 | 2:16.07 | 300 |
| 15 | Card Usage History | 2:16.29 | 2:18.22 | 58 |
| 16 | Assignment History | 2:19.09 | 2:20.14 | 31 |
| 17 | Audit History | 2:21.00 | 2:23.08 | 62 |
| 18 | Card Controls | 2:23.40 | 2:29.22 | 175 |
| 19 | Closing | 2:30.10 | 2:36.29 | 186 |

---

## Pending
- [ ] Verify voiceover sync in Remotion Studio
- [ ] Confirm "Remaining Usage 0.png" workaround is acceptable
