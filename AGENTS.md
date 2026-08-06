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
| `--color-line-ai` | `#43AF00` | Branch line: AI work |
| `--color-line-ent` | `#DA5A00` | Branch line: enterprise work. Also the orange used for section rules and carried into the resume renderings |
| `--color-line-pers` | `#896CAE` | Branch line: personal work |

Type: `--font-sans` Inter (body), `--font-condensed` Barlow Condensed (display and headings), `--font-mono` VT323.

Spine geometry lives in `:root` (`--rail-track-w`, `--ring-w/h`, `--ring-radius`, `--arrow-w/h`). The site uses a transit-map metaphor, so rail, ring, branch, and station are the vocabulary. Keep it consistent.

**Cross-artifact note.** `_templates/resume-portfolio-template.html` in the vault carries these same values (`#F6F6F6`, `#4B4B4B`, `#DA5A00`, Inter, Barlow Condensed) as hardcoded hex, because it renders outside this project. Changing a brand value here means changing it there in the same session, or the resume and the site drift apart.

---

## Bilingual, and it is load-bearing

Every translatable string in `src/data/cases.ts` and `src/data/lab.ts` is wrapped with `t(en, de)` from `src/lib/i18n.ts`. Use `L(en, de)` for non-string values. The site publishes `/` and `/de/`.

**A missing German argument renders as `[DE] <english>` in production.** Never ship a `t()` call with one argument on a live page.

**Scott is A2 in German and cannot validate idiomatic copy.** Generated German is a known standing risk on this repo, flagged in `Projects/Dev/Portfolio Site/pqdr-confidence-addition-2026-08-05.md`. When adding German, say plainly that it is unvalidated rather than presenting it as finished.

---

## Accessibility

WCAG 2.2 AA, per the design-standards skill. This is an EU-facing public site, so `EN 301 549` and the German `BFSG` are the applicable regime. Scott ran an accessibility programme at Brightly, so shipping an inaccessible portfolio would undercut a claim he makes on his own resume.

No a11y tooling is installed in this repo yet. `eslint-plugin-jsx-a11y` does not apply cleanly to `.astro` files; `pa11y` or an axe run against the built site is the right fit. Do not install anything without asking.

---

## Structure

- `src/components/spine/` — the rail navigation (`Spine.astro`, `MobileSpine.astro`)
- `src/components/cases/` — case study sections
- `src/data/cases.ts`, `src/data/lab.ts` — all content, bilingual
- `src/pages/` and `src/pages/de/` — routes, mirrored per locale
- `public/resume.pdf` and `public/images/resume/` — generated from the vault's resume hub, never edited here
