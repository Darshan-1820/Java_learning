# Claude Code Automation — Complete Learning Guide

*Learned: 2026-04-25 | Project: Discussions | Session: Inaugural*

---

## The Big Picture

Claude Code has **7 automation systems**. Most people use zero of them. Understanding all 7 and combining them is what turns Claude from a chatbot into an autonomous AI team.

```
┌─────────────────────────────────────────────────┐
│           THE 7 AUTOMATION LAYERS                │
│                                                   │
│  1. CLAUDE.md ──── Instructions (always loaded)  │
│  2. Hooks ──────── Auto-triggers on events       │
│  3. Skills ─────── Reusable /commands            │
│  4. Desktop Tasks ─ Scheduled local automation   │
│  5. /loop ──────── Recurring in-session prompts  │
│  6. MCP Servers ── External service connections   │
│  7. Routines ───── Cloud-based scheduled agents  │
│                                                   │
└─────────────────────────────────────────────────┘
```

---

## 1. CLAUDE.md — The Brain's Operating System

**What it is:** A markdown file in your project root that Claude reads at the start of every session. It's Claude's instruction manual for YOUR project.

**Why it matters:** Without this, Claude starts fresh every time. With it, Claude knows your conventions, tools, preferences, and rules from the first message.

**How `/init` works:** Run `/init` in any project. Claude scans your codebase — package.json, configs, folder structure, code patterns — and auto-generates a CLAUDE.md. It writes instructions FOR ITSELF based on what it sees in your code.

**Key insight:** CLAUDE.md is hierarchical:
- `~/.claude/CLAUDE.md` — Global (applies to ALL projects)
- `project/CLAUDE.md` — Project-specific
- `project/.claude/rules/*.md` — Additional rule files

Global CLAUDE.md is where you put things every project should follow (agent system, session logging, commit rules). Project CLAUDE.md is where you put project-specific stuff.

**Real example from our Studio:**
```markdown
# Studio Boot Sequence — MANDATORY
## STEP 1: LOAD IDENTITY
Read darshan.md NOW.
## STEP 2: LOAD OPERATING PROTOCOL
Read for-claude.md NOW.
```
This runs every single session. Claude reads identity + protocol before doing anything.

---

## 2. Hooks — The Nervous System (AUTO-TRIGGERS)

**What it is:** Config entries in `~/.claude/settings.json` that fire automatically on specific events. Claude doesn't decide to run them — the system forces them.

**Why it matters:** This is the difference between "Claude should log sessions" (which it forgets) and "Claude WILL log sessions" (system-enforced).

**Available events (the important ones):**

| Event | When It Fires | Best Use |
|---|---|---|
| `SessionStart` | Session begins | Auto-create files, inject context |
| `Stop` | Claude finishes a response | Auto-log what happened |
| `PostCompact` | Context was compressed | Re-inject critical context |
| `PreToolUse` | Before a tool runs | Validate, warn, block |
| `PostToolUse` | After a tool runs | React to results |
| `SessionEnd` | Session closes | Save state, cleanup |

**Hook types:**

| Type | What It Does |
|---|---|
| `prompt` | Injects text into Claude's brain (most useful for us) |
| `command` | Runs a shell script |
| `agent` | Runs a mini Claude agent to verify something |
| `http` | Sends a webhook to an external URL |

**The correct settings.json format:**
```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "prompt",
            "prompt": "Your instructions here..."
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "prompt",
            "if": "Write(*.pptx)",
            "prompt": "Warning about overwriting PPT files"
          }
        ]
      }
    ]
  }
}
```

**Structure explained:**
- Top level: event name (e.g., `SessionStart`)
- Each event has an array of matcher groups
- Each matcher group has an optional `matcher` (tool name filter) and a `hooks` array
- Each hook has a `type` and its config

**What we built (our actual hooks):**

1. **SessionStart** — Auto-creates session-log.md, reads previous context, activates auto-logging mode
2. **Stop** — Checks if session-log.md was updated this turn, forces update if not
3. **PostCompact** — Re-injects Studio identity, agent system, and logging rules after context compression
4. **PreToolUse (Write *.pptx)** — Warns before overwriting PowerPoint files Darshan may have edited

**Key learning:** Prompt-type hooks are the most powerful for behavior control. They inject instructions directly into Claude's reasoning. Shell command hooks are for running scripts. Agent hooks are for verification tasks.

---

## 3. Skills — Reusable Command Packages

**What it is:** Markdown files that become permanent `/commands`. When you type `/news`, Claude loads the skill file and follows its instructions.

**Why it matters:** Instead of typing "research AI news and give me a briefing" every time, you type `/news` and get a consistent, high-quality output every time.

**Skill file structure:**
```
~/.claude/skills/my-skill/
├── SKILL.md          (required — the instructions)
├── reference.md      (optional — large reference docs)
└── scripts/
    └── helper.sh     (optional — executable scripts)
```

**SKILL.md format:**
```yaml
---
name: my-skill
description: What this does. Use when [trigger phrase].
disable-model-invocation: true     # Only user can invoke with /name
allowed-tools: Bash(git *) Read    # Auto-approve these tools
argument-hint: "[topic]"
---

## Instructions
When invoked with $ARGUMENTS:
1. Step 1
2. Step 2
```

**Dynamic context injection — powerful feature:**
```yaml
---
name: pr-summary
---
## Current PR info
- PR diff: !`gh pr diff`
- Comments: !`gh pr view --comments`

Summarize this PR...
```
Commands in `` !`...` `` backticks run BEFORE Claude sees the skill. The output replaces the placeholder. So Claude gets the actual PR diff injected into its instructions automatically.

**We already have these skills:** /exit, /docx, /pptx, /pdf, /frontend-design, and more.

**Skills we should build:** /news, /ideas, /learn, /discuss, /review-agent

---

## 4. Desktop Scheduled Tasks — Local Cron Jobs

**What it is:** Tasks that run on a schedule while the Claude Code desktop app is open.

**Why it matters:** Daily morning briefings, weekly opportunity scans, automated reports — all running without you typing anything.

**How to create:** Desktop app → Schedule → New task → New local task

**On-disk location:** `~/.claude/scheduled-tasks/<task-name>/SKILL.md`

**Limitations:**
- Machine must be on and desktop app open
- If computer sleeps through a scheduled time, one catch-up run on wake
- Each task can have its own permission mode

**Use cases for us:**
- Daily AI news briefing (9 AM)
- Weekly money opportunity scan (Sunday evening)
- Weekly agent performance review

---

## 5. /loop — In-Session Recurring Prompts

**What it is:** Run a prompt repeatedly on an interval within an active session.

**Examples:**
```
/loop 5m check if build finished       # Every 5 minutes
/loop check the tests                   # Dynamic interval (Claude decides)
/loop                                   # Maintenance mode
```

**Customize default with** `~/.claude/loop.md`

**Best for:** Monitoring builds, polling for changes, watching processes. NOT for long-term automation (session-bound, 7-day expiry).

---

## 6. MCP Servers — External Service Connections

**What it is:** Plugins that give Claude access to external services — Slack, Google Drive, GitHub, databases, etc.

**Config location:** `~/.claude/.mcp.json`

**Format:**
```json
{
  "mcpServers": {
    "slack": {
      "type": "http",
      "url": "https://slack-mcp.example.com",
      "env": { "SLACK_TOKEN": "${SLACK_TOKEN}" }
    }
  }
}
```

**Three connection types:**
- `http` — Remote HTTP server
- `sse` — Server-Sent Events (real-time)
- `stdio` — Local process (runs on your machine)

**For our phone connectivity plan:** We'd set up a Telegram MCP server or Google Drive MCP to sync files between phone and PC.

---

## 7. Routines — Cloud-Based Autonomous Agents

**What it is:** Scheduled agents that run on Anthropic's cloud. They keep running when your laptop is closed.

**Why it matters:** True "set it and forget it" automation. Daily standup generators, PR reviewers, security scanners — all running in the cloud.

**Trigger types:**
- Scheduled (cron expressions)
- API (HTTP POST — can be triggered from phone, webhooks, etc.)
- GitHub events (PR opened, release created, etc.)

**Limitations:** Requires Pro/Max plan. We skip this for now — zero budget rule.

**Create from CLI:**
```
/schedule daily PR review at 9am
/schedule list
/schedule run <routine-name>
```

---

## The Attribution Setting — No More Co-Author Lines

**Discovery:** `settings.json` has an `attribution` field:
```json
{
  "attribution": {
    "commit": "",
    "pr": ""
  }
}
```
Setting both to empty string removes "Co-Authored-By: Claude" from all commits and PRs. This is what we configured — all commits are by "Darshan" only.

---

## Comparison Table

| System | Runs When | Persistent? | Cost | Best For |
|---|---|---|---|---|
| CLAUDE.md | Every session start | Yes (file) | Free | Rules, conventions, identity |
| Hooks | On specific events | Yes (config) | Free | Auto-behaviors, validation |
| Skills | When /invoked | Yes (file) | Free | Reusable workflows |
| Desktop Tasks | On schedule | Yes (file) | Free | Local recurring jobs |
| /loop | In active session | No (session) | Free | Monitoring, polling |
| MCP | When tools used | Yes (config) | Free | External services |
| Routines | On schedule/API | Yes (cloud) | Pro plan | Cloud automation |

---

## What We Built Today

1. **SessionStart hook** — Auto-creates session-log.md, loads context, activates logging
2. **Stop hook** — Forces session-log.md update after every response
3. **PostCompact hook** — Recovers critical context after compression
4. **PreToolUse hook** — Warns before overwriting .pptx files
5. **Attribution config** — Removed Co-Authored-By from all commits/PRs
6. **Discussions project** — CLAUDE.md, directory structure, session-log.md

---

## Blog/Product Potential

This knowledge — combining all 7 automation systems into a cohesive "AI Office" — is rare. Most Claude Code users don't even know hooks exist. This is sellable as:
- Blog series: "Building an Autonomous AI Office with Claude Code"
- Template product: Pre-built Studio setup (hooks + skills + agents + CLAUDE.md)
- Consulting: Setting up Claude Code automation for teams
- YouTube/course: "From Chatbot to AI Team — Claude Code Mastery"

See `money/studio-os-monetization.md` for full breakdown.

---

*Next to learn: Building custom skills (/news, /ideas, /learn), MCP server setup, Desktop scheduled tasks*
