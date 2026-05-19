# OPAC Theming

The OPAC-facing surface of LMSEventManagement exposes a small set of opt-in CSS
custom properties so site CSS (typically the `OPACUserCSS` system preference, or
an entry under Tools → HTML Customizations on recent Koha versions) can restyle
the components without piercing the shadow DOM.

## Scope and non-goals

This contract is intentionally narrower than the one shipped by LMSRoomReservations.
The events components do **not** expose a `::part` API and **do not support
layout reordering** — the sticky filter bar, the optional sidebar, and the card
grid are positioned together as a system and rely on their relative arrangement
to work. The tokens documented below cover what can be adjusted *without*
breaking that arrangement.

The three theming surfaces are:

| Element | Theming surface |
|---|---|
| `<lms-events-view>` | Sidebar sticky offsets (when the compact upcoming-events list is enabled). |
| `<lms-card>`, `<lms-card-details-modal>` | Image cropping geometry (only active when the `opac_image_crop_enabled` setting is on). |
| `<lms-opac-events-widget>` | Full design-token set for the homepage widget. |

## `<lms-events-view>` — sidebar sticky offsets

When `opac_compact_list_enabled` is on and the user has not collapsed the
sidebar, an upcoming-events list renders as a sticky `<aside>` next to the card
grid at `≥1024px`. Its top offset must clear the sticky filter bar's rendered
height; the filter bar grows by one row when chips are present.

| Property | Default | Effect |
|---|---|---|
| `--lms-events-sidebar-top-without-chips` | `11rem` | Sidebar top offset when no filter chips are rendered. |
| `--lms-events-sidebar-top-with-chips` | `14rem` | Sidebar top offset when chips are present. |
| `--lms-events-sidebar-top` | (computed) | Resolved value applied to the sidebar's `top` / `max-height` and to `grid-auto-rows`. Override directly only if both states should use the same offset. |

Selection between the two is driven by a reflected `has-active-filters` boolean
attribute on `<lms-events-filter>` — the matching `:not([has-active-filters])` /
`[has-active-filters]` rules inside the shadow DOM swap the resolved
`--lms-events-sidebar-top` automatically.

### Recipe: taller filter bar

If a Koha branding stack adds extra padding around the filter (e.g. a wider
search row), bump both knobs in lockstep:

```css
lms-events-view {
    --lms-events-sidebar-top-without-chips: 13rem;
    --lms-events-sidebar-top-with-chips: 16rem;
}
```

## `<lms-card>` and `<lms-card-details-modal>` — image cropping

Image cropping is gated by the **OPAC → Layout → "Crop event images"** plugin
setting (`opac_image_crop_enabled`). When the setting is on, both the card deck
and the details modal receive a reflected `crop-images` attribute and apply the
following geometry:

| Property | Default | Effect |
|---|---|---|
| `--lms-card-image-aspect-ratio` | `16 / 9` | Aspect ratio enforced on the card figure and the modal hero image. |
| `--lms-card-image-object-fit` | `cover` | `object-fit` for the same images. |
| `--lms-card-image-object-position` | `center` | `object-position` for the same images. |

The variables have no effect when `crop-images` is absent — the components fall
back to their natural sizing. This is by design: setting the variables globally
is safe, and they only "wake up" once an admin opts in via the plugin setting.

### Recipe: square thumbnails focused on the upper half

Useful for posters where the most relevant content sits in the top portion:

```css
lms-card[crop-images],
lms-card-details-modal[crop-images] {
    --lms-card-image-aspect-ratio: 1 / 1;
    --lms-card-image-object-position: center 25%;
}
```

## `<lms-opac-events-widget>` — homepage widget tokens

The widget exposes a richer design-token surface because it is intended to
blend into arbitrary OPAC themes. Defaults pull from Koha's Bootstrap CSS
variables (`--bs-*`), so on Koha 25.11 (Bootstrap 5) the widget inherits the
theme's accent colours automatically; on 22.11 (Bootstrap 4, no `--bs-*`) the
hex fallbacks apply.

### Layout and spacing

| Property | Default |
|---|---|
| `--widget-bg-color` | `var(--bs-body-bg, transparent)` |
| `--widget-border-color` | `var(--bs-border-color, #ddd)` |
| `--widget-border-width` | `1px` |
| `--widget-border-radius` | `var(--bs-border-radius, 3px)` |
| `--widget-padding` | `1rem` |
| `--widget-spacing` | `1rem` |
| `--widget-spacing-sm` | `0.5rem` |
| `--widget-spacing-xs` | `0.25rem` |
| `--widget-spacing-lg` | `2rem` |

### Header

| Property | Default |
|---|---|
| `--header-font-size` | `1.4rem` |
| `--header-font-weight` | `600` |
| `--header-line-height` | `1.2` |
| `--header-text-color` | `var(--bs-heading-color, var(--bs-body-color, #727272))` |

### Accent and text

| Property | Default |
|---|---|
| `--accent-color` | `var(--bs-link-color, #0074ad)` |
| `--accent-color-hover` | `var(--bs-link-hover-color, #005580)` |
| `--text-color` | `var(--bs-body-color, inherit)` |
| `--text-color-muted` | `var(--bs-secondary-color, #727272)` |
| `--text-color-on-accent` | `#fff` |

### Event items

| Property | Default |
|---|---|
| `--event-bg-color` | `var(--bs-tertiary-bg, #f3f3f3)` |
| `--event-bg-color-hover` | `var(--bs-secondary-bg, #dddddd)` |
| `--event-border-color` | `var(--accent-color)` |
| `--event-border-width` | `2px` |
| `--event-padding` | `0.75rem` |
| `--event-min-width-horizontal` | `250px` |

### Buttons and inputs

| Property | Default |
|---|---|
| `--button-bg-color` | `#548300` (Koha's green action colour) |
| `--button-bg-color-hover` | `#436900` |
| `--button-text-color` | `var(--text-color-on-accent)` |
| `--button-padding-y` | `0.5rem` |
| `--button-padding-x` | `1.25rem` |
| `--button-font-weight` | `500` |
| `--button-border-radius` | `var(--widget-border-radius)` |
| `--input-padding` | `0.5rem` |
| `--input-font-size` | `0.9rem` |
| `--input-border-radius` | `var(--widget-border-radius)` |

### Status, spinner, transitions

| Property | Default |
|---|---|
| `--error-color` | `var(--bs-danger, #d32f2f)` |
| `--spinner-size` | `32px` |
| `--spinner-border-width` | `2px` |
| `--spinner-bg-color` | `var(--bs-secondary-bg, #f3f3f3)` |
| `--transition-duration` | `0.15s` |

### Recipe: tighter widget with a brand-red accent

```css
lms-opac-events-widget {
    --accent-color: #b22222;
    --accent-color-hover: #8b1a1a;
    --header-text-color: #222;
    --event-bg-color: #f7f7f7;
    --event-padding: 0.5rem;
    --widget-padding: 0.75rem;
}
```

## Browser support

- CSS custom properties — universal in supported Koha browsers.
- Reflected boolean attributes (`has-active-filters`, `crop-images`) — universal;
  selectors like `lms-card[crop-images]` are standard attribute selectors.
- The components themselves require shadow DOM and custom-elements v1, which
  are required by Koha's OPAC stack already; no additional baseline is implied.
