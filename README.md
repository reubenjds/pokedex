# pokedex

A static, all-generation Pokédex built with Nuxt. The site has no backend: Pokémon data is prebuilt into JSON assets and deployed as static files.

## Stack

- [Nuxt 4.5](https://nuxt.com/) with source under `app/`
- [Vue 3.5](https://vuejs.org/) and TypeScript
- [Vite 8](https://vite.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/) with CSS-first config
- [Nuxt UI 4](https://ui.nuxt.com/) (`@nuxt/ui`), which bundles `@nuxt/icon`, `@nuxt/fonts` and `@nuxtjs/color-mode`; fonts are Geist and Geist Mono
- [pnpm](https://pnpm.io/)

The app is dark-mode only.

## Routes and features

- `/` - landing page
- `/pokemon` - searchable Pokédex list
- `/pokemon/[slug]` - detail page, for example `/pokemon/charizard` or `/pokemon/charizard-mega-x`

Detail routes are slug-based because National Dex numbers are not unique once alternate forms are included. Charizard, Mega Charizard X, Mega Charizard Y and Gigantamax Charizard all share dex number 6.

The list page loads `public/pokedex/index.json` and filters entirely in memory. Filters are mirrored into the URL query so filtered views can be shared:

- name search, with prefix matches ranked above substring matches
- 18-type multi-select with AND semantics
- generation multi-select for I-IX
- legendary-only and mythical-only toggles
- include alternate forms toggle, off by default
- sort by dex number, name A-Z or base stat total
- reset action, result count and 24-per-page pagination

Stats use the modern six-stat spread: `hp`, `attack`, `defense`, `spAtk`, `spDef` and `speed`. Each stat also has a `maxStats` value calculated for level 100 with 31 IVs, 252 EVs and a beneficial nature. Type matchups use the modern 18-type chart; `strongAgainst` and `weakAgainst` are defensive damage-taken matchups.

## Data pipeline

The app covers all 9 generations: 1,351 entries total, made from 1,025 species plus 326 alternate forms such as regional forms, Mega Evolutions and Gigantamax forms.

Data comes from [PokéAPI](https://pokeapi.co). Sprites are served from PokéAPI's GitHub-hosted sprite CDN.

### Source data

Run this only when the committed Pokédex source data needs to be refreshed from PokéAPI:

```bash
pnpm build:data
```

This runs `scripts/build-pokedex.mjs`, fetches PokéAPI data, and writes one pretty-printed, tab-indented file per generation:

```text
data/gen-1.json
...
data/gen-9.json
```

Those 9 files are the committed source of truth. Raw projected API responses are cached in `scripts/.cache/` so re-runs are cheap; a cold run is about 2,900 requests.

### Static assets

`pnpm dev`, `pnpm build` and `pnpm generate` all run `scripts/build-assets.mjs` first. It expands `data/gen-*.json` into gitignored static assets:

```text
public/pokedex/index.json
public/pokedex/<slug>.json
```

`index.json` is a light record for the list and filters. Each `<slug>.json` file contains the full detail payload for one entry. `public/pokedex/` is generated build output, not committed source. A fresh clone does not need `pnpm build:data`: `data/gen-*.json` is committed, and these static assets are rebuilt automatically by `pnpm dev`, `pnpm build` and `pnpm generate`.

## Local development

1. Clone the repository:

```bash
git clone https://github.com/reubenjds/pokedex
cd pokedex
```

2. Install dependencies:

```bash
pnpm install
```

3. Start the dev server:

```bash
pnpm dev
```

4. Build for production:

```bash
pnpm build
```

5. Generate the static site:

```bash
pnpm generate
```

6. Preview the generated/build output:

```bash
pnpm preview
```

## Deployment

Deployment is static. Cloudflare Pages runs:

```bash
pnpm generate
```

Nuxt writes the static output to `.output/public`, which Cloudflare Pages serves directly. There is no Express server, MongoDB database or public API to deploy.

## Accessibility

Every text/background pair in the UI meets WCAG AAA (7:1). Graphical elements such as the stat bars meet the 3:1 requirement of WCAG 1.4.11.

The 18 Pokémon type colours are not the official hues used verbatim. Each is the most saturated version of the official hue whose contrast against the near-black label printed on it still clears 7:1, derived by raising OKLCH lightness while preserving hue and only reducing chroma when the result would fall outside the sRGB gamut. Every type chip carries near-identical contrast (7.04–7.11:1).

Nuxt UI's stock dark text ramp bottoms out at zinc-500, which is only 3.1:1 on an elevated surface. `app/app.css` overrides `--ui-text-dimmed`, `--ui-text-muted`, `--ui-text-toned` and `--ui-text` with lighter values that all clear 7:1, and raises `--ui-primary` to a red that clears 7:1 both as text and as the background behind a solid button label.

## Credits

Pokémon data is provided by [PokéAPI](https://pokeapi.co), and sprites are loaded from PokéAPI's GitHub-hosted sprite CDN.
