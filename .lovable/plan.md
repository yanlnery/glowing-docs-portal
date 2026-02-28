

## Fix: All Images Blank Across Site

### Root Cause

In `OptimizedImage`, the `<img>` starts with `opacity-0` and transitions to `opacity-100` only after `onLoad` fires (`isLoaded` state). When images are cached by the browser, `onLoad` can fire synchronously before React attaches the event handler, so `isLoaded` never becomes `true` and images stay invisible.

There is no ref on the `<img>` element to check `img.complete` as a fallback.

### Fix

**File: `src/components/ui/optimized-image.tsx`**

1. Remove the `opacity-0` / `opacity-100` toggling from the `<img>` className entirely. Images should always be visible once rendered.
2. Keep a simple fade-in using CSS only: use `opacity: 1` always on the img, and let the placeholder div disappear via React state (remove placeholder when loaded).
3. Add a ref directly on the `<img>` element and check `img.complete` on mount to handle cached images.
4. Move `imgRef` from the wrapper div to use two refs: one for IntersectionObserver (wrapper) and one for the img element.

The simplified approach:
- The `<img>` will always have full opacity (no `opacity-0` default)
- The loading placeholder (gray bg) covers it until loaded, then is removed
- `onLoad` and a `useEffect` checking `img.complete` both set `isLoaded = true`

**File: `src/components/home/FeaturedProductCard.tsx`**

- Remove `group-hover:scale-105` from `imgClassName` (causes blur, same issue fixed in catalog)
- Move hover zoom to the wrapper div instead (same pattern as CatalogProductCard)

### Technical Details

```text
Current flow (broken):
  img renders -> opacity-0 -> onLoad fires (maybe missed) -> stays invisible

Fixed flow:
  img renders -> always visible -> placeholder covers until loaded -> placeholder removed on load
```

Changes summary:
- `optimized-image.tsx`: separate refs for container/img, remove opacity toggle, check img.complete
- `FeaturedProductCard.tsx`: move scale from img to wrapper div
