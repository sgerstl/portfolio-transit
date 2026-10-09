# Portfolio site — project context

Astro + Tailwind v4. Published at `ux.scottgerstl.com`. This is a craft artifact and a hiring surface, so the design bar is the point, not an overhead.

**Design standards:** the global `design-standards` skill applies here and is not optional. Canonical source is `~/vaults/Panopticon/Notes/design-practice.md`. This surface is **contemporary product craft** school (Stripe / Linear / Vercel), never data-dense school.

---

## Tokens

Defined in `src/styles/global.css` as a Tailwind v4 `@theme` block. **Use the token, never the raw hex.** If a value has no token, say so rather than inventing one.

| Token | Value | Use |
|---|---|---|
| `--color-bg` | `#f6f6f6` | Page background, the site's signature off-white |
| `--color-text` | `#4B4B4B` | Body text |
| `--color-text-soft` | `#6a6258` | Secondary text, warm grey |
| `--color-rail-blue` | `#009DE0` | The spine's main rail |
| `--color-ring-stroke` | `#555555` | Station ring stroke on the spine |
| `--color-line-pro` | `#DA5A00` | Branch line: Professional Work (CS1). Also the brand orange used for section rules, the hero tile wash, and carried into the resume renderings |
| `--color-line-indie` | `#43AF00` | Branch line: Independent Builds (CS2) |
| `--color-line-pers` | `#896CAE` | Branch line: Personal |
| `--color-board-*` | various | The departure boards: LED amber on near-black, and the hero board's enamel, rim, bezel and yellow housing |

Type: `--font-sans` Inter (body), `--font-condensed` Barlow Condensed (display and headings), `--font-mono` VT323.

Spine geometry lives in `:root` (`--rail-track-w`, `--ring-w/h`, `--ring-radius`, `--arrow-w/h`). The site uses a transit-map metaphor, so rail, ring, branch, and station are the vocabulary. Keep it consistent.

**Cross-artifact note.** `_templates/resume-portfolio-template.html` in the vault carries these same values (`#F6F6F6`, `#4B4B4B`, `#DA5A00`, Inter, Barlow Condensed) as hardcoded hex, because it renders outside this project. Changing a brand value here means changing it there in the same session, or the resume and the site drift apart.

---

## English only

The site is English-only since 2026-10-05. A native German reader reviewed the translation and found that a lot of the nuance wasn't landing, so the layer was removed rather than patched. The bilingual version is preserved at the git tag `bilingual-final`.

- Content in `src/data/cases.ts` and `src/data/lab.ts` is plain strings. UI chrome labels live in `src/lib/ui.ts`.
- `/de` and `/de/*` redirect (307, temporary) to the English equivalents via `vercel.json`, so old links still resolve.
- The departure board's German labels (Linie / Ziel / Lesezeit) are identity, not translation. They stay, marked `lang="de"`.
- **Do not reintroduce German copy without a native reviewer in the loop.** Scott is A2 and cannot validate idiomatic German, and machine German that reads off does more damage with Berlin hiring managers than no German.

---

## Accessibility

WCAG 2.2 AA, per the design-standards skill. This is an EU-facing public site, so `EN 301 549` and the German `BFSG` are the applicable regime. Scott ran an accessibility programme at Brightly, so shipping an inaccessible portfolio would undercut a claim he makes on his own resume.

No a11y tooling is installed in this repo yet. `eslint-plugin-jsx-a11y` does not apply cleanly to `.astro` files; `pa11y` or an axe run against the built site is the right fit. Do not install anything without asking.

---

## Structure

- `src/components/spine/` — the rail navigation (`Spine.astro`, `MobileSpine.astro`)
- `src/components/cases/` — case study sections
- `src/data/cases.ts`, `src/data/lab.ts` — all content
- `src/lib/ui.ts` — UI chrome labels
- `src/pages/` — routes
- `public/resume.pdf` and `public/images/resume/` — generated from the vault's resume hub, never edited here
