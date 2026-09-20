---
id: KI-WEB-SITE-013
area: SITE
title: Reconcile static analysis warnings
theme: site-experience
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-19T19:54:00Z
updated_at: 2026-09-19T19:54:00Z
---

# Reconcile static analysis warnings

## Goal

Decide whether KI Website should remove its remaining CSS specificity overrides and simplify its Knip configuration without changing the rendered site or obscuring intentional build inputs.

## Context

The estate baseline passes the full build, route, type, dependency, Markdown and KI audit gates. Biome still reports seven `noImportantStyles` warnings in `site/src/assets/css/main.css`, while Knip reports six configuration hints covering projected runtime directories, site assets, CSS compilation and dependency suppressions.

These are not current correctness failures. Removing `!important` without checking the generated Tailwind cascade could change header and responsive spacing, and deleting Knip entries mechanically could turn generated or compiled inputs into false positives.

## Boundary

This is unadopted Triage intake. Do not alter visual output, weaken lint rules, broaden ignore patterns or claim unused dependencies until an adopted plan identifies the required browser-width comparisons and the exact Knip inputs that remain necessary.

## Discussion

Promotion should define representative desktop and mobile render checks, compare computed styles before and after any specificity change, and reduce Knip suppressions one at a time while preserving a clean dependency-analysis exit.
