/** Custom properties of the dark variant, used both when the system prefers it and when the map is set dark. */
const darkTokens: string = `
--wmap-accent: #4493f8;
--wmap-foreground: #e6edf3;
--wmap-muted: #9198a1;
--wmap-bar: #151b23;
--wmap-border: #3d444d;
--wmap-hover: rgba(230, 237, 243, 0.1);
--wmap-warning: #d29922;
--wmap-warning-surface: rgba(187, 128, 9, 0.15);
--wmap-stage: #0d1117;
--wmap-frame-mask: rgba(1, 4, 9, 0.5);`.trim();

/**
 * Style sheet of the map and its toolbar, themed through `--wmap-*` custom properties.
 */
export const mapStyleSheet: string = `
.wmap-root {
  --wmap-accent: #2563eb;
  --wmap-foreground: #1f2328;
  --wmap-muted: #59636e;
  --wmap-bar: #f6f8fa;
  --wmap-border: #d1d9e0;
  --wmap-hover: rgba(31, 35, 40, 0.08);
  --wmap-warning: #9a6700;
  --wmap-warning-surface: #fff8c5;
  --wmap-stage: #e9eef2;
  --wmap-frame-mask: rgba(31, 35, 40, 0.35);
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
  container-type: inline-size;
  border: 1px solid var(--wmap-border);
  background: var(--wmap-bar);
  color: var(--wmap-foreground);
  font: 13px/1.4 system-ui, -apple-system, "Segoe UI", sans-serif;
}
/* :where keeps these as specific as .wmap-root alone, so an application's overrides of the properties still apply. */
@media (prefers-color-scheme: dark) {
  .wmap-root:where(:not(.wmap-light)) {
${darkTokens}
  }
}
.wmap-root:where(.wmap-dark) {
${darkTokens}
}
.wmap-stage { position: relative; flex: 1 1 auto; min-height: 120px; background: var(--wmap-stage); }
/* Two classes outrank MapLibre's own .maplibregl-map { position: relative }. */
.wmap-stage > .wmap-canvas { position: absolute; inset: 0; }
/* Below MapLibre's controls (z-index 2), so attribution stays legible and clickable. */
.wmap-extent-frame { position: absolute; inset: 0; z-index: 1; width: 100%; height: 100%; pointer-events: none; }
.wmap-extent-frame > path { fill: var(--wmap-frame-mask); stroke: var(--wmap-accent); stroke-width: 2; }
.wmap-failure {
  position: absolute; inset: 0; display: grid; place-items: center; padding: 16px;
  color: var(--wmap-warning); text-align: center;
}

.wmap-toolbar {
  flex: none; display: flex; flex-wrap: wrap; align-items: center; gap: 4px 6px;
  min-height: 44px; padding: 4px 6px; border-top: 1px solid var(--wmap-border);
}
.wmap-spacer { flex: 1 1 0; min-width: 0; }
.wmap-slot { display: contents; }

.wmap-picker { position: relative; display: inline-flex; min-width: 0; }
.wmap-picker-trigger {
  display: inline-flex; align-items: center; gap: 6px; min-width: 0; max-width: 240px; height: 32px; padding: 0 6px 0 4px;
  border: 1px solid var(--wmap-border); border-radius: 6px;
  background: transparent; color: var(--wmap-foreground); font: inherit; cursor: pointer;
}
.wmap-picker-trigger:hover { background: var(--wmap-hover); }
.wmap-picker-trigger > svg { flex: none; color: var(--wmap-muted); }
.wmap-picker-title { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.wmap-picker-panel {
  position: absolute; left: 0; bottom: calc(100% + 6px); z-index: 10;
  display: grid; grid-template-columns: repeat(auto-fill, 96px); gap: 4px;
  width: 514px; max-width: calc(100cqw - 12px); max-height: 360px; overflow-y: auto;
  padding: 6px; border: 1px solid var(--wmap-border); border-radius: 8px;
  background: var(--wmap-bar); box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
}
.wmap-picker-panel[data-below="true"] { top: calc(100% + 6px); bottom: auto; }
.wmap-option {
  display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 6px 4px;
  border: none; border-radius: 6px; background: transparent; color: var(--wmap-foreground);
  font: inherit; font-size: 12px; line-height: 1.25; text-align: center; cursor: pointer;
}
.wmap-option:hover { background: var(--wmap-hover); }
.wmap-thumbnail {
  display: grid; place-items: center; width: 64px; height: 64px; flex: none; overflow: hidden;
  border: 1px solid var(--wmap-border); border-radius: 6px; background: var(--wmap-stage); color: var(--wmap-muted);
}
.wmap-thumbnail > img { width: 100%; height: 100%; object-fit: cover; display: block; }
.wmap-option[aria-selected="true"] .wmap-thumbnail { outline: 2px solid var(--wmap-accent); outline-offset: 1px; }
.wmap-option[aria-selected="true"] .wmap-option-title { color: var(--wmap-accent); font-weight: 600; }
.wmap-option-title {
  display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden; overflow-wrap: break-word;
}
.wmap-option-restriction { color: var(--wmap-warning); font-size: 11px; }

.wmap-terrain { display: inline-flex; align-items: center; gap: 2px; min-width: 0; }
.wmap-terrain-select {
  min-width: 0; max-width: 200px; height: 32px; padding: 0 4px; border: 1px solid var(--wmap-border); border-radius: 6px;
  background: transparent; color: var(--wmap-foreground); font: inherit; cursor: pointer;
}
.wmap-terrain-select:hover:not(:disabled) { background: var(--wmap-hover); }
.wmap-terrain-select:disabled { opacity: 0.4; cursor: default; }
.wmap-terrain-select > option { background: var(--wmap-bar); color: var(--wmap-foreground); }

.wmap-usage { font-size: 12px; white-space: nowrap; }
.wmap-usage[data-restricted="true"] {
  padding: 2px 8px; border-radius: 999px; text-decoration: none;
  background: var(--wmap-warning-surface); color: var(--wmap-warning);
}
.wmap-usage[data-restricted="true"]:hover { text-decoration: underline; }

.wmap-readout { display: inline-flex; gap: 10px; color: var(--wmap-muted); font-variant-numeric: tabular-nums; white-space: nowrap; }
.wmap-pointer { display: inline-block; min-width: 19ch; text-align: right; }
.wmap-zoom { display: inline-block; min-width: 4.5ch; }

.wmap-status { display: inline-grid; place-items: center; width: 24px; height: 24px; flex: none; }
.wmap-status[data-failed="true"] { color: var(--wmap-warning); }
.wmap-spinner {
  width: 14px; height: 14px; border-radius: 50%;
  border: 2px solid var(--wmap-border); border-top-color: var(--wmap-accent);
  animation: wmap-spin 0.9s linear infinite;
}
@keyframes wmap-spin { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) { .wmap-spinner { animation-duration: 3s; } }

.wmap-button {
  display: inline-grid; place-items: center; width: 32px; height: 32px; flex: none;
  border: none; border-radius: 6px; background: transparent; color: var(--wmap-foreground); cursor: pointer;
}
.wmap-button:hover:not(:disabled) { background: var(--wmap-hover); }
.wmap-button:disabled { opacity: 0.4; cursor: default; }
.wmap-button[aria-pressed="true"] { background: var(--wmap-hover); color: var(--wmap-accent); }
.wmap-button:focus-visible, .wmap-picker-trigger:focus-visible, .wmap-option:focus-visible, .wmap-usage:focus-visible {
  outline: 2px solid var(--wmap-accent); outline-offset: 1px;
}

@container (max-width: 520px) {
  .wmap-pointer { display: none; }
}
`;
