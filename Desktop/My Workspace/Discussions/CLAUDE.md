# Project Discussions

The brainstorm room of the Studio. Ideas come here first, get discussed, challenged, validated — then graduate into their own project directories.

## Studio
Global agent framework and standards: `C:\Users\addar\Studio\`
Profile: `C:\Users\addar\Studio\profile\darshan.md`

## What This Project Is

- Pre-project incubation space
- Ideas, builds, money-making strategies, blogs, features — all start here
- Discussions are logged, decisions are captured, actionable items become projects
- Uses Notebook LM for deep research, Claude for targeted execution

## Session Protocol

- `session-log.md` — auto-created and auto-updated by hooks (SessionStart + Stop)
- Every discussion gets logged with: topic, key points, decisions, action items
- When an idea graduates to a project, create an entry in `graduated/` with the decision file

## Structure

```
Discussions/
├── CLAUDE.md           # This file
├── session-log.md      # Auto-logged session history
├── ideas/              # Raw ideas, brainstorms
├── graduated/          # Ideas that became projects (with decision context)
├── research/           # Research notes from Notebook LM + Claude
├── money/              # Income strategies, monetization angles
├── blogs/              # Blog ideas and drafts
└── learning/           # Learning notes from discussions
```

## Rules

1. No idea is too small or too big to discuss
2. Every discussion gets logged automatically (hooks handle this)
3. Challenge ideas before building — Chief of Staff agent pushes back
4. Research before commit — use Notebook LM for deep dives
5. When an idea is ready, it graduates to its own project directory
