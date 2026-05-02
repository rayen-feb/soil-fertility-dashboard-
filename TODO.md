# Image Display Fix - TODO

## Root Cause
- `js/app.js` uses external `picsum.photos` URLs for crop recommendation card images.
- These fail when offline, blocked by network policies, or when the service is unreachable.
- The `onerror="this.style.display='none'"` handler hides broken images, leaving empty space.

## Fix Plan
- [ ] Replace `unsplash()` function with `generatePlaceholder(name, seed)` that returns inline SVG data URIs.
- [ ] Each SVG will have a unique gradient background and display the crop name for visual identification.
- [ ] Update `initCropDB()` to use the new generator — no external network dependency.
- [ ] Verify crop recommendation cards render placeholders reliably in the Predictor section.

## Verification
- [ ] Open `index.html` → Predictor → enter values → click Predict Soil Fertility.
- [ ] Confirm top 6 crop cards show colorful SVG placeholders with crop names.
