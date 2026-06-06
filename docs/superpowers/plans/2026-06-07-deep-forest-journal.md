# Deep Forest Stock Journal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the existing stock journal as a mobile-first deep-sea and forest-green investment notebook without changing behavior or persisted data.

**Architecture:** Add a final, centralized CSS layer to the existing single-file SPA so current behavior and in-progress functionality remain intact. Make only small semantic copy or class changes when CSS alone cannot establish the required hierarchy.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, Vercel serverless APIs, localStorage.

---

### Task 1: Global visual system

**Files:**
- Modify: `index.html`

- [ ] Replace the default color tokens with navy, emerald, lime, mint, cyan, and lavender tokens.
- [ ] Add atmospheric CSS-only background lighting and subtle grid texture.
- [ ] Normalize radii, shadows, focus states, and touch target sizing.
- [ ] Verify the document still parses and no JavaScript was changed.

### Task 2: Navigation and home

**Files:**
- Modify: `index.html`

- [ ] Restyle the top bar as a floating utility surface.
- [ ] Recompose hero typography and CTA hierarchy.
- [ ] Convert the aggregate stats bar into separated rounded cards.
- [ ] Give journal cards controlled palette variation while preserving generated markup.
- [ ] Verify desktop and 390px layouts.

### Task 3: Wizard and detail views

**Files:**
- Modify: `index.html`

- [ ] Restyle wizard progress, action types, ticker search, questions, and result.
- [ ] Restyle stock header, stats, thesis entries, notes, and state timeline.
- [ ] Restyle search, settings, palette menu, and note modal.
- [ ] Verify existing routes and controls remain clickable.

### Task 4: Browser verification

**Files:**
- Test: `index.html`

- [ ] Start a local static server.
- [ ] Open the app in the in-app browser.
- [ ] Check desktop layout, mobile layout, home, new-entry route, and one stock detail route.
- [ ] Confirm zero console errors and no horizontal overflow.
- [ ] Run `git diff --check`.

