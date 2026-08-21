# Frontend architect interview prep

Use this as a **spoken script**, not a document to read aloud word-for-word. Fill the `[brackets]` with your real story before the interview.

The coding task for questions 11–12 and 14 lives in `dropdown/`.

---

## 1) Self introduction and background

**Goal:** 60–90 seconds. Role → years → domain → 2 projects with impact → stack → why this role.

**Say something like:**

> I’m [Name], a frontend engineer with [X] years of experience, mostly on [e-commerce / SaaS / enterprise] products.
>
> Recently I’ve been [leading / owning] the UI for [project]: listing, product detail, cart, and checkout. I work with product and backend on API contracts, performance, and how pages are rendered (CSR vs SSR vs SSG).
>
> My core stack is JavaScript, React, [Next.js if true], TypeScript, REST/GraphQL, and I care a lot about data fetching, caching, and not shipping unnecessary JS.
>
> I’m interviewing here because I want to own frontend architecture for a larger commerce surface — not only components, but rendering strategy, caching, and how a 10-person team ships without stepping on each other.

**Have 2 projects ready (STAR, 4 sentences each):**

1. **Performance / architecture:** “PDP was slow under traffic → we [CDN cache / ISR / split APIs] → LCP / TTFB dropped by [n].”
2. **Feature ownership:** “Filters + listing → API-driven filter config, apply on submit, empty/error states → conversion / bounce improved.”

**Skills to name only if you can defend them:** React, JS (closures, promises, abort), HTML/CSS, REST, Next.js rendering, CDN/cache, accessibility, Git, CI.

Do **not** invent years, companies, or metrics. If you don’t have a number, say “we reduced TTFB noticeably” and describe the mechanism.

---

## 2) Architecture experience

They are asking: *Have you made decisions that other people had to live with?*

**If you have led architecture:**

> Yes. I don’t only implement tickets. I’ve owned the frontend architecture for [app]: folder structure, how we talk to APIs (BFF vs browser → backend), rendering per page type, caching, and code-review standards. With a 10-person team I’d split by domain (listing, PDP, cart, account), keep a shared design system, and a thin BFF so the UI doesn’t stitch 12 services.

**If you have influenced but not the title “architect”:**

> I haven’t had the architect title, but I’ve done the work: proposed SSR vs CSR for PDP, introduced a shared data-fetching pattern, and documented how filters and product APIs compose. I’m comfortable owning those decisions with a team.

**Architectural responsibilities (list 5, then stop):**

1. Page-level rendering (CSR / SSR / SSG / ISR)
2. API boundaries (what the browser calls vs BFF)
3. Caching (CDN, HTTP cache, client cache)
4. Consistency (design system, state patterns)
5. Failure modes (partial outage, timeout, empty states)
6. Observability (RUM, Core Web Vitals, error tracking)

---

## 3) Design e-commerce from scratch (10-person team)

**Open with a sequence. Interviewers love order.**

### Week 0–1: discover, don’t code

- Users, locales, catalog size, peak traffic (sale events), SEO need, payments, inventory.
- Constraints: mobile share, time-to-first-value, which backend already exists (SAP / custom / Shopify).

### Then: domain slices (team structure)

| Squad | Owns |
|---|---|
| Discovery | Home, PLP, search, filters |
| PDP | Product, reviews, delivery widget |
| Checkout | Cart, address, pay, order confirm |
| Account | Login, orders, wishlist |
| Platform | Design system, CI, CDN, BFF, observability |

10 people ≈ 4 squads + 1–2 platform. **Don’t** split by “React vs CSS”.

### System shape (say this while drawing)

```
CDN / WAF
    → Web (Next.js or similar)
        → BFF / API gateway
            → Catalog    Inventory    Pricing    Cart    Payments    Search    CMS
    → Auth (IdP)
    → Object storage (images)
```

**Key decisions you’d take on day one:**

1. **Next.js (or equivalent) for storefront** — SEO + mixed rendering. Not a pure CSR SPA for Amazon-like SEO.
2. **BFF** — browser talks to one gateway; catalog/price/inventory stay separate services.
3. **Catalog read-optimized** — listing never hits the inventory write DB directly.
4. **Search** — Elasticsearch / OpenSearch / Algolia, not `LIKE %query%` on SQL.
5. **Cart** — server-side cart for logged-in; guest cart cookie/id; price always revalidated at checkout.
6. **Payments** — PSP (Stripe/Adyen), never store raw cards.
7. **Images** — CDN + responsive `srcset`; never origin every time.
8. **Design system** — one component library so 10 people don’t invent 10 buttons.

### Delivery order (MVP)

Home + PLP + PDP + cart + checkout + order confirmation. Reviews, wishlist, recommendations are phase 2.

---

## 4) Current project architecture (frontend-focused)

**You must replace this with your real system.** Use the drawing pattern below so you don’t freeze at the whiteboard.

### How to draw (5 minutes)

```
[Browser]
   CSR React app  +  CDN static assets
        |
        | HTTPS JSON
        v
[API gateway / BFF]  — auth JWT, rate limit, aggregation
        |
   +----+----+-----+------+
   |         |     |      |
Catalog   User   Cart   CMS
```

**Data flow (memorize this paragraph):**

> User opens PLP. App fetches `/api/products` through the BFF. BFF aggregates catalog + price. React stores the result in a listing view. Filters are **draft** in local state until Submit, then we either re-fetch with query params or filter client-side if the dataset is already loaded. Errors show a retry. Images and JS come from the CDN.

**If they ask “middleware”:**

> At the edge: auth cookie check, geo, A/B. At the BFF: logging, request-id, map 4xx/5xx to UI-safe errors. In React: error boundary for render crashes; fetch errors are data, not exceptions in the tree.

**Practice tonight:** draw *your* app with 6 boxes and arrows. Say where React Query / Redux / Context lives. If you have none, say “server state via fetch + local UI state.”

---

## 5) Amazon-like e-commerce architecture

Same as Q3, but **scale and read-heavy PDP**.

```
User → Route 53 / CDN (CloudFront)
     → Static: JS/CSS/images
     → HTML: SSR/ISR for SEO pages
     → API: BFF

Search cluster (indexing catalog asynchronously)
Recommendation service (not on the critical PDP path)
Checkout: synchronous, strongly consistent price + stock
Event bus: order placed → email, warehouse, analytics
```

**PDP is the hottest read path.** Home and PLP can be stale for minutes. Checkout cannot.

**Split:**

| Concern | Approach |
|---|---|
| Browse (home, PLP, PDP) | Cache aggressively, eventually consistent |
| Search | Dedicated index, facets from search service |
| Cart / checkout | No CDN HTML cache of personalized cart |
| Account | SSR or CSR behind auth |

**Sentence they want:**

> Amazon is not one app. It’s browse (cached), search (indexed), and transact (consistent). I would never cache checkout HTML. I would cache PDP HTML/JSON at the CDN with a short TTL plus stale-while-revalidate.

---

## 6) Typical e-commerce pages

Name them in user order:

1. Home
2. Category / PLP (listing + filters + sort)
3. Search results
4. PDP (gallery, price, variants, delivery, reviews)
5. Cart
6. Checkout (address, shipping, payment)
7. Order confirmation
8. Auth (login / register)
9. Account (orders, addresses, wishlist)
10. Content (FAQ, policy) — SSG
11. Error / empty / 404

Optional: store locator, live chat, compare.

---

## 7) Rendering: SSR vs SSG vs CSR

**Rule:** pick by **personalization, freshness, and SEO**.

| Page | Strategy | Why |
|---|---|---|
| Home | SSG / ISR | SEO, mostly same for everyone, CMS-driven |
| Category PLP | SSR or ISR | SEO + filters; ISR if categories are stable |
| Search | CSR or SSR with noindex | Query-specific; often logged, weak SEO |
| PDP | ISR + on-demand revalidate **or** SSR + CDN cache | SEO + huge read volume |
| Cart | CSR | Personalized, no SEO |
| Checkout | CSR | Security, no cache |
| Account | CSR | Auth |
| Policy / blog | SSG | Rarely changes |

**Definitions (say cleanly):**

- **CSR:** browser gets a shell, then JS fetches data. Fast to deploy, weak first paint/SEO if abused.
- **SSR:** HTML with data on each request. Fresh, costlier, TTFB depends on origin.
- **SSG:** HTML at build time. Fastest, stale until rebuild.
- **ISR:** SSG + revalidate after TTL. Best default for PDP at Amazon scale.

---

## 8) High traffic on one PDP (iPhone) and SSR

**Trap:** “We’ll SSR every request.” That melts the origin.

**Say:**

> If a million users open the same iPhone PDP, I do **not** SSR that page from Node for every hit. The HTML and the product JSON are **identical for almost everyone**. I’d generate once (ISR/SSG), cache at the CDN, and serve from edge. Origin SSR is the fallback on cache miss or revalidation.
>
> Personalized bits (delivery estimate, “buy again”, A/B price tests) are **small client fetches** or edge includes — not the whole document.
>
> Stock and price at **Add to cart / checkout** are live. The browse page can be 30–120 seconds stale.

Impact of naive SSR: Node/CPU saturation, queueing, worse TTFB for everyone, cascading timeouts to catalog.

---

## 9) Caching in that scenario

**Layers (outside → in):**

1. **CDN (HTML + JSON + images)** — cache key: URL + maybe `Accept-Language`. TTL 60s, `stale-while-revalidate`.
2. **Edge worker** — attach geo cookie; don’t put user id in cache key for public PDP.
3. **BFF / Redis** — `product:{id}` for origin misses.
4. **HTTP headers** — `Cache-Control: public, s-maxage=60, stale-while-revalidate=600`.
5. **Browser** — HTTP cache for images/JS; React Query memory cache for in-session navigation.
6. **Not cached:** cart, checkout, payment, `Authorization` responses.

**Never** put `Set-Cookie` user session on the cached PDP response.

**Invalidation:** price/stock job publishes `product.updated` → purge CDN path `/dp/{id}` + revalidate ISR.

---

## 10) Why not hybrid SSG + SSR for PDP?

They may want you to **agree, with a name**.

> That’s the right idea. I wouldn’t SSR every request **or** rebuild the whole site. I’d **ISR**: static HTML at the edge, regenerate in the background after TTL or on catalog webhook. First user after expiry waits once; everyone else hits CDN.
>
> True per-request SSR only for: preview, logged-in price override, or bot-specific experiments.
>
> Hybrid in Next.js terms: static shell + client islands for reviews/delivery, or `revalidate` + `revalidatePath(id)`.

If they say “SSG + SSR”: translate to **ISR / stale-while-revalidate**, not two full pipelines fighting.

---

## 11–12) Coding task (what they asked)

**Requirements:**

- Fetch data from an API
- Populate dropdowns from API
- Show/hide filters from **visibility flags**
- Do **not** filter on every change
- Filter and show results **on Submit**
- Production-ready: loading, error, empty, abort, accessible labels

**Implemented in:** `react-components/dropdown/`

**Architecture to say while coding:**

```
fetch filter config (visibility)  ─┐
fetch products                      ├─ parallel
fetch categories (dropdown options)─┘
        ↓
draft dropdown state (what user is picking)
        ↓
Submit → appliedFilters
        ↓
useMemo: products filtered by appliedFilters
        ↓
render list
```

**Why Submit, not live filter:** that’s what they asked; also matches “Apply” on many commerce UIs and avoids extra work / extra API calls.

**Visibility flags:** config is data, not `if (brand)`. If API sets `visible: false`, that dropdown is not rendered and is not applied.

**Production checklist they watch for:**

- `AbortController` on unmount
- Parallel fetch (`Promise.all`)
- Draft vs applied state (two states)
- Empty “no matches”
- Error + Retry
- `label` + `htmlFor` on selects
- Reset
- Don’t mutate the products array

Walkthrough of the code is in `dropdown/README.md`.

---

## 13) AI tools in the workflow

**Be honest and senior.**

> Yes. I use Cursor / Copilot for boilerplate, CSS, and tests. I still design the data flow myself — state, abort, error, cache keys. I never paste secrets or prod data into a model. I can explain every line I ship. In this round I’ll write the filter logic myself because that’s what you’re evaluating.

If they dislike AI: “I can work without it; it’s a multiplier, not a crutch.”

---

## 14) Same solution in plain JavaScript

**Yes.** React is UI. The model is fetch → state → render.

Vanilla sketch (you should be able to write this on a laptop):

```js
const draft = { category: 'all', brand: 'all' }
let applied = { ...draft }
let products = []

async function load() {
  const [config, data] = await Promise.all([
    fetch('/api/filters').then((r) => r.json()),
    fetch('https://dummyjson.com/products?limit=100').then((r) => r.json()),
  ])
  products = data.products
  renderDropdowns(config)
  // do not render results until submit — or show all with applied defaults
}

function renderDropdowns(config) {
  const root = document.querySelector('#filters')
  root.innerHTML = ''
  config.filters.filter((f) => f.visible).forEach((f) => {
    const select = document.createElement('select')
    select.id = f.key
    select.addEventListener('change', (e) => { draft[f.key] = e.target.value })
    root.appendChild(select)
  })
}

document.querySelector('#submit').addEventListener('click', () => {
  applied = { ...draft }
  renderList(products.filter(matchesApplied))
})
```

**Say:** same two-state model, `createElement` instead of JSX, event listeners instead of `onChange`. I would still abort fetch on `beforeunload` / navigation.

---

## Whiteboard one-pager (memorize)

1. Intro: 90s, two projects, stack.
2. E-comm = browse cached / search indexed / checkout consistent.
3. PDP iPhone: CDN + ISR, not SSR-every-hit.
4. Cache: CDN → Redis → browser; never cart.
5. Hybrid PDP = ISR, not double strategy.
6. Code: parallel fetch, visibility from API, **filter on submit**, production states.

---

## Night before

- Draw Amazon boxes twice from memory.
- Run `dropdown` (`pnpm dev` in that folder): change a dropdown, confirm list **does not** change until Submit.
- Toggle `visible` in `src/api/filter-config.js` and confirm the dropdown appears/disappears.
- Rehearse intro out loud once.
