# Product filter coding task

Interview requirements this app covers:

- Populate dropdowns from API data
- Show/hide filters from visibility flags
- Apply filters only after **Submit**
- Production states: loading, error, empty, abort, accessible labels

## Run

```bash
cd react-components/dropdown
pnpm dev
```

Needs network (DummyJSON).

## Mentor walkthrough (rebuild from memory in this order)

### 1. API layer (`src/api/catalog.js`)

Three sources, fetched in parallel later:

1. `fetchProducts` — DummyJSON product list
2. `fetchCategories` — DummyJSON category list (dropdown options)
3. `fetchFilterConfig` — fake CMS/API with `{ key, label, visible }`

`priceRange` is `visible: false` on purpose. Flip it to `true` to see the third dropdown appear without changing React code.

`matchesFilters` is a pure function. Easy to test; no React inside.

### 2. Two pieces of state (the actual interview trick)

| State | Meaning |
|---|---|
| `draftFilters` | What the dropdowns show while the user is picking |
| `appliedFilters` | What the list uses |

Changing a `<select>` only updates **draft**. Submit copies draft → applied. Until Submit, the grid stays on the last applied set (initially “all”).

This is what they meant by “display results after submit button click.”

### 3. Hook (`src/hooks/useProductFilters.js`)

- `Promise.all` for the three fetches
- `AbortController` in `useEffect` cleanup
- Brand options derived with `useMemo` from products
- `visibleFilters = config.filter(f => f.visible)`
- Hidden filters are ignored when matching (so a hidden price dropdown cannot affect results)

### 4. UI (`filter-demo.jsx`)

- `<form onSubmit={applyFilters}>` — Enter key also submits
- Each select: `label htmlFor` + `id`
- Reset sets both draft and applied back to `all`
- Empty copy when `results.length === 0`

### 5. What to say while coding

> I load config and catalog in parallel. Dropdown options come from the category API and unique brands. Visibility flags decide which selects exist. User edits are draft state. Submit applies. I abort in-flight work on unmount.

## Quick tests

1. Change Category, do **not** click Submit → list must stay the same.
2. Click Submit → list must match the dropdown.
3. Set `priceRange.visible` to `true` in `fetchFilterConfig` → third dropdown appears.
4. Kill network → error + Retry.
5. Filter to something impossible → empty state.
