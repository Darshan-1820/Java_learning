# Assure PAT 120s Demo Video — Session Notes

## Project Location
`C:\Users\addar\Desktop\AssurePAT Video_Re+Caldue\video-project`

## What Was Done (Session: Feb 13, 2026)

### 1. Screen Assets (COMPLETED)
- Copied 19 screen PNGs from `assure-web/` (12) and `assurePATmobile/` (8) into `video-project/public/screens/` as `1.png` through `19.png`
- Mapping:
  - 1-4: Requestor flow (lifecycle, test info, test config, issuer/partner/testers)
  - 5-7: SME flow (fulfillment dashboard, approval, card assignment)
  - 8-14: Tester mobile flow (dashboard, card listing, card details, NFC pay, payment success, issue mgmt, issue details)
  - 15-19: SME monitoring (testing updates, txn details, card controls, usage history, assignment history)

### 2. Config (COMPLETED)
- `src/config.ts` — 23 scenes, 3600 frames (120s @ 30fps)
- Added `roleLabel` field (REQUESTOR/SME/TESTER) with color-coded badges
- Scene breakdown: intro(4s) + 4 requestor + 3 SME + transition(2.5s) + 7 mobile + transition(1.5s) + 5 SME monitoring + closing(6s)

### 3. Components (COMPLETED)
- `ScreenScene.tsx` — Added role label badges (orange=REQUESTOR, purple=SME, green=TESTER)
- `TransitionScene.tsx` — Added `variant` prop: "mobile" (phone icon) and "web" (monitor icon)
- `Composition.tsx` — Updated to pass variant to TransitionScene based on scene id
- All type-checks pass (`npx tsc --noEmit` clean)

### 4. Voiceover (COMPLETED)
- ElevenLabs API failed (free tier blocked)
- Used **edge-tts** (Microsoft Azure AriaNeural voice) as fallback
- Script trimmed for pacing, generated at +50% rate
- Duration: **124s** (4s over, naturally ends during closing fade)
- File: `public/audio/voiceover.mp3` (726 KB)
- Generator: `generate-voiceover-fallback.py`

### 5. Background Music (COMPLETED)
- Regenerated ambient pad to 130s (from old 90s)
- File: `public/audio/bgm.wav`
- Generator: `generate-bgm.py`

### 6. Video Render (COMPLETED)
- Output: `out/assurepat-demo-120s.mp4` (42.7 MB, 1920x1080, 30fps, H.264)
- Old video still exists: `out/assurepat-walkthrough.mp4` (26.9 MB, 96s)

---

## What Might Need Improvement Next Session

### Voiceover Quality
- Current: edge-tts AriaNeural at +50% speed — functional but fast
- Better options:
  - Fix ElevenLabs (paid plan or different API key)
  - Try `en-US-JennyNeural` or `en-GB-SoniaNeural` voices
  - Generate at slower rate (+20%) and extend video to ~140s
  - Use the script from `generate-audio.py` lines 10-34 (user highlighted) as alternative shorter script

### Video Timing
- Voiceover is 124s vs video 120s — last 4s of audio gets cut
- Could extend closing scene by 4s (add 120 frames) to let full VO play

### Visual Polish
- Could add Ayris Global logo to intro/closing
- Could add scene number indicators
- Could enhance mobile phone frame (currently uses rounded corners, could add device bezel)

### Alternative Script
The user highlighted a shorter script in `generate-audio.py` (lines 10-34) — 14 paragraphs vs current 23. Could be used for a tighter 90s version.

---

## Key Commands

```bash
# Navigate to project
cd "C:\Users\addar\Desktop\AssurePAT Video_Re+Caldue\video-project"

# Preview in Remotion Studio (interactive)
npm run studio

# Render video
npx remotion render src/index.ts AssurePATWalkthrough out/assurepat-demo-120s.mp4 --concurrency=4

# Regenerate voiceover
python generate-voiceover-fallback.py

# Regenerate BGM
python generate-bgm.py

# Type-check
npx tsc --noEmit
```

## Tech Stack
- Remotion 4.0.421, React 19, TypeScript 5.9
- edge-tts (Microsoft Azure free neural TTS)
- Python for audio generation

## File Structure
```
video-project/
├── src/
│   ├── config.ts           ← Scene definitions (23 scenes, 3600 frames)
│   ├── Composition.tsx     ← Main video composition
│   ├── Root.tsx            ← Remotion entry
│   ├── components/
│   │   ├── IntroScene.tsx
│   │   ├── ScreenScene.tsx ← Shows screenshots with on-screen text
│   │   ├── TransitionScene.tsx ← Mobile/Web transition variants
│   │   └── ClosingScene.tsx
├── public/
│   ├── screens/1-19.png    ← All screenshots
│   ├── audio/voiceover.mp3 ← Neural TTS voiceover
│   └── audio/bgm.wav       ← Ambient background music
├── out/
│   ├── assurepat-demo-120s.mp4  ← NEW (42.7 MB, 120s)
│   └── assurepat-walkthrough.mp4 ← OLD (26.9 MB, 96s)
├── generate-voiceover.mjs       ← ElevenLabs (broken)
├── generate-voiceover-fallback.py ← edge-tts (working)
└── generate-bgm.py              ← Ambient pad generator
```
