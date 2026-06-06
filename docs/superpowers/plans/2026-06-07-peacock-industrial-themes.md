# Peacock and Industrial Themes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the light and color theme palettes while preserving the dark theme and all application behavior.

**Architecture:** Update the centralized CSS custom properties and the theme-specific component overrides in the existing single-file SPA. Keep all JavaScript, routes, storage, and API code unchanged.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript.

---

### Task 1: Update theme tokens

**Files:**
- Modify: `index.html`

- [ ] Replace light theme tokens with the Peacock Feather palette.
- [ ] Replace color theme tokens with the Industrial Poster palette.
- [ ] Leave the complete dark theme block byte-for-byte unchanged.

### Task 2: Align component surfaces

**Files:**
- Modify: `index.html`

- [ ] Update light theme backgrounds, controls, selected states, and note gradients.
- [ ] Update color theme backgrounds, controls, selected states, and note gradients.
- [ ] Rename the theme menu descriptions to identify the new palettes.

### Task 3: Verify

**Files:**
- Test: `index.html`

- [ ] Parse every inline script with Node.
- [ ] Verify light, color, and dark themes in the NVDA detail route.
- [ ] Confirm desktop and mobile layout, no horizontal overflow, and no console errors.
- [ ] Run `git diff --check`.
