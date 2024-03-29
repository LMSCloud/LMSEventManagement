import { css } from "lit";
    export const tailwindStyles = css`/*
! tailwindcss v3.3.5 | MIT License | https://tailwindcss.com
*/

/*
1. Prevent padding and border from affecting element width. (https://github.com/mozdevs/cssremedy/issues/4)
2. Allow adding a border to an element by just adding a border-width. (https://github.com/tailwindcss/tailwindcss/pull/116)
*/

*,
::before,
::after {
  box-sizing: border-box;
  /* 1 */
  border-width: 0;
  /* 2 */
  border-style: solid;
  /* 2 */
  border-color: #e5e7eb;
  /* 2 */
}

::before,
::after {
  --tw-content: '';
}

/*
1. Use a consistent sensible line-height in all browsers.
2. Prevent adjustments of font size after orientation changes in iOS.
3. Use a more readable tab size.
4. Use the user's configured sans font-family by default.
5. Use the user's configured sans font-feature-settings by default.
6. Use the user's configured sans font-variation-settings by default.
*/

html {
  line-height: 1.5;
  /* 1 */
  -webkit-text-size-adjust: 100%;
  /* 2 */
  -moz-tab-size: 4;
  /* 3 */
  -o-tab-size: 4;
     tab-size: 4;
  /* 3 */
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  /* 4 */
  font-feature-settings: normal;
  /* 5 */
  font-variation-settings: normal;
  /* 6 */
}

/*
1. Remove the margin in all browsers.
2. Inherit line-height from html so users can set them as a class directly on the html element.
*/

body {
  margin: 0;
  /* 1 */
  line-height: inherit;
  /* 2 */
}

/*
1. Add the correct height in Firefox.
2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)
3. Ensure horizontal rules are visible by default.
*/

hr {
  height: 0;
  /* 1 */
  color: inherit;
  /* 2 */
  border-top-width: 1px;
  /* 3 */
}

/*
Add the correct text decoration in Chrome, Edge, and Safari.
*/

abbr:where([title]) {
  -webkit-text-decoration: underline dotted;
          text-decoration: underline dotted;
}

/*
Remove the default font size and weight for headings.
*/

h1,
h2,
h3,
h4,
h5,
h6 {
  font-size: inherit;
  font-weight: inherit;
}

/*
Reset links to optimize for opt-in styling instead of opt-out.
*/

a {
  color: inherit;
  text-decoration: inherit;
}

/*
Add the correct font weight in Edge and Safari.
*/

b,
strong {
  font-weight: bolder;
}

/*
1. Use the user's configured mono font family by default.
2. Correct the odd em font sizing in all browsers.
*/

code,
kbd,
samp,
pre {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  /* 1 */
  font-size: 1em;
  /* 2 */
}

/*
Add the correct font size in all browsers.
*/

small {
  font-size: 80%;
}

/*
Prevent sub and sup elements from affecting the line height in all browsers.
*/

sub,
sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}

sub {
  bottom: -0.25em;
}

sup {
  top: -0.5em;
}

/*
1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)
2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)
3. Remove gaps between table borders by default.
*/

table {
  text-indent: 0;
  /* 1 */
  border-color: inherit;
  /* 2 */
  border-collapse: collapse;
  /* 3 */
}

/*
1. Change the font styles in all browsers.
2. Remove the margin in Firefox and Safari.
3. Remove default padding in all browsers.
*/

button,
input,
optgroup,
select,
textarea {
  font-family: inherit;
  /* 1 */
  font-feature-settings: inherit;
  /* 1 */
  font-variation-settings: inherit;
  /* 1 */
  font-size: 100%;
  /* 1 */
  font-weight: inherit;
  /* 1 */
  line-height: inherit;
  /* 1 */
  color: inherit;
  /* 1 */
  margin: 0;
  /* 2 */
  padding: 0;
  /* 3 */
}

/*
Remove the inheritance of text transform in Edge and Firefox.
*/

button,
select {
  text-transform: none;
}

/*
1. Correct the inability to style clickable types in iOS and Safari.
2. Remove default button styles.
*/

button,
[type='button'],
[type='reset'],
[type='submit'] {
  -webkit-appearance: button;
  /* 1 */
  background-color: transparent;
  /* 2 */
  background-image: none;
  /* 2 */
}

/*
Use the modern Firefox focus style for all focusable elements.
*/

:-moz-focusring {
  outline: auto;
}

/*
Remove the additional :invalid styles in Firefox. (https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737)
*/

:-moz-ui-invalid {
  box-shadow: none;
}

/*
Add the correct vertical alignment in Chrome and Firefox.
*/

progress {
  vertical-align: baseline;
}

/*
Correct the cursor style of increment and decrement buttons in Safari.
*/

::-webkit-inner-spin-button,
::-webkit-outer-spin-button {
  height: auto;
}

/*
1. Correct the odd appearance in Chrome and Safari.
2. Correct the outline style in Safari.
*/

[type='search'] {
  -webkit-appearance: textfield;
  /* 1 */
  outline-offset: -2px;
  /* 2 */
}

/*
Remove the inner padding in Chrome and Safari on macOS.
*/

::-webkit-search-decoration {
  -webkit-appearance: none;
}

/*
1. Correct the inability to style clickable types in iOS and Safari.
2. Change font properties to inherit in Safari.
*/

::-webkit-file-upload-button {
  -webkit-appearance: button;
  /* 1 */
  font: inherit;
  /* 2 */
}

/*
Add the correct display in Chrome and Safari.
*/

summary {
  display: list-item;
}

/*
Removes the default spacing and border for appropriate elements.
*/

blockquote,
dl,
dd,
h1,
h2,
h3,
h4,
h5,
h6,
hr,
figure,
p,
pre {
  margin: 0;
}

fieldset {
  margin: 0;
  padding: 0;
}

legend {
  padding: 0;
}

ol,
ul,
menu {
  list-style: none;
  margin: 0;
  padding: 0;
}

/*
Reset default styling for dialogs.
*/

dialog {
  padding: 0;
}

/*
Prevent resizing textareas horizontally by default.
*/

textarea {
  resize: vertical;
}

/*
1. Reset the default placeholder opacity in Firefox. (https://github.com/tailwindlabs/tailwindcss/issues/3300)
2. Set the default placeholder color to the user's configured gray 400 color.
*/

input::-moz-placeholder, textarea::-moz-placeholder {
  opacity: 1;
  /* 1 */
  color: #9ca3af;
  /* 2 */
}

input::placeholder,
textarea::placeholder {
  opacity: 1;
  /* 1 */
  color: #9ca3af;
  /* 2 */
}

/*
Set the default cursor for buttons.
*/

button,
[role="button"] {
  cursor: pointer;
}

/*
Make sure disabled buttons don't get the pointer cursor.
*/

:disabled {
  cursor: default;
}

/*
1. Make replaced elements display: block by default. (https://github.com/mozdevs/cssremedy/issues/14)
2. Add vertical-align: middle to align replaced elements more sensibly by default. (https://github.com/jensimmons/cssremedy/issues/14#issuecomment-634934210)
   This can trigger a poorly considered lint error in some tools but is included by design.
*/

img,
svg,
video,
canvas,
audio,
iframe,
embed,
object {
  display: block;
  /* 1 */
  vertical-align: middle;
  /* 2 */
}

/*
Constrain images and videos to the parent width and preserve their intrinsic aspect ratio. (https://github.com/mozdevs/cssremedy/issues/14)
*/

img,
video {
  max-width: 100%;
  height: auto;
}

/* Make elements with the HTML hidden attribute stay hidden by default */

[hidden] {
  display: none;
}

:host,
[data-theme] {
  background-color: hsl(var(--b1) / var(--tw-bg-opacity, 1));
  color: hsl(var(--bc) / var(--tw-text-opacity, 1));
}

html {
  -webkit-tap-highlight-color: transparent;
}

:host {
  color-scheme: light;
  --pf: 141 50% 53%;
  --sf: 219 96% 53%;
  --af: 10 81% 49%;
  --nf: 219 20% 18%;
  --b2: 0 0% 93%;
  --b3: 0 0% 86%;
  --in: 198 93% 60%;
  --su: 158 64% 52%;
  --wa: 43 96% 56%;
  --er: 0 91% 71%;
  --inc: 198 100% 12%;
  --suc: 158 100% 10%;
  --wac: 43 100% 11%;
  --erc: 0 100% 14%;
  --rounded-box: 1rem;
  --rounded-btn: 0.5rem;
  --rounded-badge: 1.9rem;
  --btn-text-case: uppercase;
  --border-btn: 1px;
  --tab-border: 1px;
  --tab-radius: 0.5rem;
  --p: 141 50% 60%;
  --pc: 151 28% 19%;
  --s: 219 96% 60%;
  --sc: 210 20% 98%;
  --a: 10 81% 56%;
  --ac: 210 20% 98%;
  --n: 219 20% 25%;
  --nc: 210 20% 98%;
  --b1: 0 0% 100%;
  --bc: 219 20% 25%;
  --animation-btn: 0;
  --animation-input: 0;
  --btn-focus-scale: 1;
}

*, ::before, ::after {
  --tw-border-spacing-x: 0;
  --tw-border-spacing-y: 0;
  --tw-translate-x: 0;
  --tw-translate-y: 0;
  --tw-rotate: 0;
  --tw-skew-x: 0;
  --tw-skew-y: 0;
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  --tw-pan-x:  ;
  --tw-pan-y:  ;
  --tw-pinch-zoom:  ;
  --tw-scroll-snap-strictness: proximity;
  --tw-gradient-from-position:  ;
  --tw-gradient-via-position:  ;
  --tw-gradient-to-position:  ;
  --tw-ordinal:  ;
  --tw-slashed-zero:  ;
  --tw-numeric-figure:  ;
  --tw-numeric-spacing:  ;
  --tw-numeric-fraction:  ;
  --tw-ring-inset:  ;
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: rgb(59 130 246 / 0.5);
  --tw-ring-offset-shadow: 0 0 #0000;
  --tw-ring-shadow: 0 0 #0000;
  --tw-shadow: 0 0 #0000;
  --tw-shadow-colored: 0 0 #0000;
  --tw-blur:  ;
  --tw-brightness:  ;
  --tw-contrast:  ;
  --tw-grayscale:  ;
  --tw-hue-rotate:  ;
  --tw-invert:  ;
  --tw-saturate:  ;
  --tw-sepia:  ;
  --tw-drop-shadow:  ;
  --tw-backdrop-blur:  ;
  --tw-backdrop-brightness:  ;
  --tw-backdrop-contrast:  ;
  --tw-backdrop-grayscale:  ;
  --tw-backdrop-hue-rotate:  ;
  --tw-backdrop-invert:  ;
  --tw-backdrop-opacity:  ;
  --tw-backdrop-saturate:  ;
  --tw-backdrop-sepia:  ;
}

::backdrop {
  --tw-border-spacing-x: 0;
  --tw-border-spacing-y: 0;
  --tw-translate-x: 0;
  --tw-translate-y: 0;
  --tw-rotate: 0;
  --tw-skew-x: 0;
  --tw-skew-y: 0;
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  --tw-pan-x:  ;
  --tw-pan-y:  ;
  --tw-pinch-zoom:  ;
  --tw-scroll-snap-strictness: proximity;
  --tw-gradient-from-position:  ;
  --tw-gradient-via-position:  ;
  --tw-gradient-to-position:  ;
  --tw-ordinal:  ;
  --tw-slashed-zero:  ;
  --tw-numeric-figure:  ;
  --tw-numeric-spacing:  ;
  --tw-numeric-fraction:  ;
  --tw-ring-inset:  ;
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: rgb(59 130 246 / 0.5);
  --tw-ring-offset-shadow: 0 0 #0000;
  --tw-ring-shadow: 0 0 #0000;
  --tw-shadow: 0 0 #0000;
  --tw-shadow-colored: 0 0 #0000;
  --tw-blur:  ;
  --tw-brightness:  ;
  --tw-contrast:  ;
  --tw-grayscale:  ;
  --tw-hue-rotate:  ;
  --tw-invert:  ;
  --tw-saturate:  ;
  --tw-sepia:  ;
  --tw-drop-shadow:  ;
  --tw-backdrop-blur:  ;
  --tw-backdrop-brightness:  ;
  --tw-backdrop-contrast:  ;
  --tw-backdrop-grayscale:  ;
  --tw-backdrop-hue-rotate:  ;
  --tw-backdrop-invert:  ;
  --tw-backdrop-opacity:  ;
  --tw-backdrop-saturate:  ;
  --tw-backdrop-sepia:  ;
}

.prose {
  color: var(--tw-prose-body);
  max-width: 65ch;
}

.prose :where(p):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  margin-top: 1.25em;
  margin-bottom: 1.25em;
}

.prose :where([class~="lead"]):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  color: var(--tw-prose-lead);
  font-size: 1.25em;
  line-height: 1.6;
  margin-top: 1.2em;
  margin-bottom: 1.2em;
}

.prose :where(a):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  color: var(--tw-prose-links);
  text-decoration: underline;
  font-weight: 500;
}

.prose :where(strong):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  color: var(--tw-prose-bold);
  font-weight: 600;
}

.prose :where(a strong):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  color: inherit;
}

.prose :where(blockquote strong):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  color: inherit;
}

.prose :where(thead th strong):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  color: inherit;
}

.prose :where(ol):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  list-style-type: decimal;
  margin-top: 1.25em;
  margin-bottom: 1.25em;
  padding-left: 1.625em;
}

.prose :where(ol[type="A"]):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  list-style-type: upper-alpha;
}

.prose :where(ol[type="a"]):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  list-style-type: lower-alpha;
}

.prose :where(ol[type="A" s]):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  list-style-type: upper-alpha;
}

.prose :where(ol[type="a" s]):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  list-style-type: lower-alpha;
}

.prose :where(ol[type="I"]):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  list-style-type: upper-roman;
}

.prose :where(ol[type="i"]):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  list-style-type: lower-roman;
}

.prose :where(ol[type="I" s]):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  list-style-type: upper-roman;
}

.prose :where(ol[type="i" s]):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  list-style-type: lower-roman;
}

.prose :where(ol[type="1"]):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  list-style-type: decimal;
}

.prose :where(ul):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  list-style-type: disc;
  margin-top: 1.25em;
  margin-bottom: 1.25em;
  padding-left: 1.625em;
}

.prose :where(ol > li):not(:where([class~="not-prose"],[class~="not-prose"] *))::marker {
  font-weight: 400;
  color: var(--tw-prose-counters);
}

.prose :where(ul > li):not(:where([class~="not-prose"],[class~="not-prose"] *))::marker {
  color: var(--tw-prose-bullets);
}

.prose :where(dt):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  color: var(--tw-prose-headings);
  font-weight: 600;
  margin-top: 1.25em;
}

.prose :where(hr):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  border-color: var(--tw-prose-hr);
  border-top-width: 1px;
  margin-top: 3em;
  margin-bottom: 3em;
}

.prose :where(blockquote):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  font-weight: 500;
  font-style: italic;
  color: var(--tw-prose-quotes);
  border-left-width: 0.25rem;
  border-left-color: var(--tw-prose-quote-borders);
  quotes: "\\201C""\\201D""\\2018""\\2019";
  margin-top: 1.6em;
  margin-bottom: 1.6em;
  padding-left: 1em;
}

.prose :where(blockquote p:first-of-type):not(:where([class~="not-prose"],[class~="not-prose"] *))::before {
  content: open-quote;
}

.prose :where(blockquote p:last-of-type):not(:where([class~="not-prose"],[class~="not-prose"] *))::after {
  content: close-quote;
}

.prose :where(h1):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  color: var(--tw-prose-headings);
  font-weight: 800;
  font-size: 2.25em;
  margin-top: 0;
  margin-bottom: 0.8888889em;
  line-height: 1.1111111;
}

.prose :where(h1 strong):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  font-weight: 900;
  color: inherit;
}

.prose :where(h2):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  color: var(--tw-prose-headings);
  font-weight: 700;
  font-size: 1.5em;
  margin-top: 2em;
  margin-bottom: 1em;
  line-height: 1.3333333;
}

.prose :where(h2 strong):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  font-weight: 800;
  color: inherit;
}

.prose :where(h3):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  color: var(--tw-prose-headings);
  font-weight: 600;
  font-size: 1.25em;
  margin-top: 1.6em;
  margin-bottom: 0.6em;
  line-height: 1.6;
}

.prose :where(h3 strong):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  font-weight: 700;
  color: inherit;
}

.prose :where(h4):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  color: var(--tw-prose-headings);
  font-weight: 600;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  line-height: 1.5;
}

.prose :where(h4 strong):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  font-weight: 700;
  color: inherit;
}

.prose :where(img):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  margin-top: 2em;
  margin-bottom: 2em;
}

.prose :where(picture):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  display: block;
  margin-top: 2em;
  margin-bottom: 2em;
}

.prose :where(kbd):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  font-weight: 500;
  font-family: inherit;
  color: var(--tw-prose-kbd);
  box-shadow: 0 0 0 1px rgb(var(--tw-prose-kbd-shadows) / 10%), 0 3px 0 rgb(var(--tw-prose-kbd-shadows) / 10%);
  font-size: 0.875em;
  border-radius: 0.3125rem;
  padding-top: 0.1875em;
  padding-right: 0.375em;
  padding-bottom: 0.1875em;
  padding-left: 0.375em;
}

.prose :where(code):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  color: var(--tw-prose-code);
  font-weight: 600;
  font-size: 0.875em;
}

.prose :where(code):not(:where([class~="not-prose"],[class~="not-prose"] *))::before {
  content: "";
}

.prose :where(code):not(:where([class~="not-prose"],[class~="not-prose"] *))::after {
  content: "";
}

.prose :where(a code):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  color: inherit;
}

.prose :where(h1 code):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  color: inherit;
}

.prose :where(h2 code):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  color: inherit;
  font-size: 0.875em;
}

.prose :where(h3 code):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  color: inherit;
  font-size: 0.9em;
}

.prose :where(h4 code):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  color: inherit;
}

.prose :where(blockquote code):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  color: inherit;
}

.prose :where(thead th code):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  color: inherit;
}

.prose :where(pre):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  color: var(--tw-prose-pre-code);
  background-color: var(--tw-prose-pre-bg);
  overflow-x: auto;
  font-weight: 400;
  font-size: 0.875em;
  line-height: 1.7142857;
  margin-top: 1.7142857em;
  margin-bottom: 1.7142857em;
  border-radius: 0.375rem;
  padding-top: 0.8571429em;
  padding-right: 1.1428571em;
  padding-bottom: 0.8571429em;
  padding-left: 1.1428571em;
}

.prose :where(pre code):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  background-color: transparent;
  border-width: 0;
  border-radius: 0;
  padding: 0;
  font-weight: inherit;
  color: inherit;
  font-size: inherit;
  font-family: inherit;
  line-height: inherit;
}

.prose :where(pre code):not(:where([class~="not-prose"],[class~="not-prose"] *))::before {
  content: none;
}

.prose :where(pre code):not(:where([class~="not-prose"],[class~="not-prose"] *))::after {
  content: none;
}

.prose :where(table):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  width: 100%;
  table-layout: auto;
  text-align: left;
  margin-top: 2em;
  margin-bottom: 2em;
  font-size: 0.875em;
  line-height: 1.7142857;
}

.prose :where(thead):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  border-bottom-width: 1px;
  border-bottom-color: var(--tw-prose-th-borders);
}

.prose :where(thead th):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  color: var(--tw-prose-headings);
  font-weight: 600;
  vertical-align: bottom;
  padding-right: 0.5714286em;
  padding-bottom: 0.5714286em;
  padding-left: 0.5714286em;
}

.prose :where(tbody tr):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  border-bottom-width: 1px;
  border-bottom-color: var(--tw-prose-td-borders);
}

.prose :where(tbody tr:last-child):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  border-bottom-width: 0;
}

.prose :where(tbody td):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  vertical-align: baseline;
}

.prose :where(tfoot):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  border-top-width: 1px;
  border-top-color: var(--tw-prose-th-borders);
}

.prose :where(tfoot td):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  vertical-align: top;
}

.prose :where(figure > *):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  margin-top: 0;
  margin-bottom: 0;
}

.prose :where(figcaption):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  color: var(--tw-prose-captions);
  font-size: 0.875em;
  line-height: 1.4285714;
  margin-top: 0.8571429em;
}

.prose {
  --tw-prose-body: #374151;
  --tw-prose-headings: #111827;
  --tw-prose-lead: #4b5563;
  --tw-prose-links: #111827;
  --tw-prose-bold: #111827;
  --tw-prose-counters: #6b7280;
  --tw-prose-bullets: #d1d5db;
  --tw-prose-hr: #e5e7eb;
  --tw-prose-quotes: #111827;
  --tw-prose-quote-borders: #e5e7eb;
  --tw-prose-captions: #6b7280;
  --tw-prose-kbd: #111827;
  --tw-prose-kbd-shadows: 17 24 39;
  --tw-prose-code: #111827;
  --tw-prose-pre-code: #e5e7eb;
  --tw-prose-pre-bg: #1f2937;
  --tw-prose-th-borders: #d1d5db;
  --tw-prose-td-borders: #e5e7eb;
  --tw-prose-invert-body: #d1d5db;
  --tw-prose-invert-headings: #fff;
  --tw-prose-invert-lead: #9ca3af;
  --tw-prose-invert-links: #fff;
  --tw-prose-invert-bold: #fff;
  --tw-prose-invert-counters: #9ca3af;
  --tw-prose-invert-bullets: #4b5563;
  --tw-prose-invert-hr: #374151;
  --tw-prose-invert-quotes: #f3f4f6;
  --tw-prose-invert-quote-borders: #374151;
  --tw-prose-invert-captions: #9ca3af;
  --tw-prose-invert-kbd: #fff;
  --tw-prose-invert-kbd-shadows: 255 255 255;
  --tw-prose-invert-code: #fff;
  --tw-prose-invert-pre-code: #d1d5db;
  --tw-prose-invert-pre-bg: rgb(0 0 0 / 50%);
  --tw-prose-invert-th-borders: #4b5563;
  --tw-prose-invert-td-borders: #374151;
  font-size: 1rem;
  line-height: 1.75;
}

.prose :where(picture > img):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  margin-top: 0;
  margin-bottom: 0;
}

.prose :where(video):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  margin-top: 2em;
  margin-bottom: 2em;
}

.prose :where(li):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

.prose :where(ol > li):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  padding-left: 0.375em;
}

.prose :where(ul > li):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  padding-left: 0.375em;
}

.prose :where(.prose > ul > li p):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  margin-top: 0.75em;
  margin-bottom: 0.75em;
}

.prose :where(.prose > ul > li > *:first-child):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  margin-top: 1.25em;
}

.prose :where(.prose > ul > li > *:last-child):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  margin-bottom: 1.25em;
}

.prose :where(.prose > ol > li > *:first-child):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  margin-top: 1.25em;
}

.prose :where(.prose > ol > li > *:last-child):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  margin-bottom: 1.25em;
}

.prose :where(ul ul, ul ol, ol ul, ol ol):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  margin-top: 0.75em;
  margin-bottom: 0.75em;
}

.prose :where(dl):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  margin-top: 1.25em;
  margin-bottom: 1.25em;
}

.prose :where(dd):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  margin-top: 0.5em;
  padding-left: 1.625em;
}

.prose :where(hr + *):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  margin-top: 0;
}

.prose :where(h2 + *):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  margin-top: 0;
}

.prose :where(h3 + *):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  margin-top: 0;
}

.prose :where(h4 + *):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  margin-top: 0;
}

.prose :where(thead th:first-child):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  padding-left: 0;
}

.prose :where(thead th:last-child):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  padding-right: 0;
}

.prose :where(tbody td, tfoot td):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  padding-top: 0.5714286em;
  padding-right: 0.5714286em;
  padding-bottom: 0.5714286em;
  padding-left: 0.5714286em;
}

.prose :where(tbody td:first-child, tfoot td:first-child):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  padding-left: 0;
}

.prose :where(tbody td:last-child, tfoot td:last-child):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  padding-right: 0;
}

.prose :where(figure):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  margin-top: 2em;
  margin-bottom: 2em;
}

.prose :where(.prose > :first-child):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  margin-top: 0;
}

.prose :where(.prose > :last-child):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
  margin-bottom: 0;
}

.alert {
  display: grid;
  width: 100%;
  grid-auto-flow: row;
  align-content: flex-start;
  align-items: center;
  justify-items: center;
  gap: 1rem;
  text-align: center;
  border-width: 1px;
  --tw-border-opacity: 1;
  border-color: hsl(var(--b2) / var(--tw-border-opacity));
  padding: 1rem;
  --tw-text-opacity: 1;
  color: hsl(var(--bc) / var(--tw-text-opacity));
  border-radius: var(--rounded-box, 1rem);
  --alert-bg: hsl(var(--b2));
  --alert-bg-mix: hsl(var(--b1));
  background-color: var(--alert-bg);
}

@media (min-width: 640px) {
  .alert {
    grid-auto-flow: column;
    grid-template-columns: auto minmax(auto,1fr);
    justify-items: start;
    text-align: left;
  }
}

.avatar.placeholder > div {
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (hover:hover) {
  .link-hover:hover {
    text-decoration-line: underline;
  }

  .label a:hover {
    --tw-text-opacity: 1;
    color: hsl(var(--bc) / var(--tw-text-opacity));
  }

  .link-neutral:hover {
    --tw-text-opacity: 1;
    color: hsl(var(--nf) / var(--tw-text-opacity));
  }

  .menu li > *:not(ul):not(.menu-title):not(details):active,
.menu li > *:not(ul):not(.menu-title):not(details).active,
.menu li > details > summary:active {
    --tw-bg-opacity: 1;
    background-color: hsl(var(--n) / var(--tw-bg-opacity));
    --tw-text-opacity: 1;
    color: hsl(var(--nc) / var(--tw-text-opacity));
  }

  .\\!tab:hover {
    --tw-text-opacity: 1 !important;
  }

  .tab:hover {
    --tw-text-opacity: 1;
  }

  .tabs-boxed .tab-active:not(.tab-disabled):not([disabled]):hover {
    --tw-text-opacity: 1;
    color: hsl(var(--pc) / var(--tw-text-opacity));
  }

  .table tr.hover:hover,
  .table tr.hover:nth-child(even):hover {
    --tw-bg-opacity: 1;
    background-color: hsl(var(--b2) / var(--tw-bg-opacity));
  }
}

.btn {
  display: inline-flex;
  flex-shrink: 0;
  cursor: pointer;
  -webkit-user-select: none;
     -moz-user-select: none;
          user-select: none;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  border-color: transparent;
  border-color: hsl(var(--b2) / var(--tw-border-opacity));
  text-align: center;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-backdrop-filter;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
  transition-duration: 200ms;
  border-radius: var(--rounded-btn, 0.5rem);
  height: 3rem;
  padding-left: 1rem;
  padding-right: 1rem;
  min-height: 3rem;
  font-size: 0.875rem;
  line-height: 1em;
  gap: 0.5rem;
  font-weight: 600;
  text-decoration-line: none;
  border-width: var(--border-btn, 1px);
  animation: button-pop var(--animation-btn, 0.25s) ease-out;
  text-transform: var(--btn-text-case, uppercase);
  --tw-border-opacity: 1;
  --tw-bg-opacity: 1;
  background-color: hsl(var(--b2) / var(--tw-bg-opacity));
  --tw-text-opacity: 1;
  color: hsl(var(--bc) / var(--tw-text-opacity));
  outline-color: hsl(var(--bc) / 1);
}

.btn-disabled,
  .btn[disabled],
  .btn:disabled {
  pointer-events: none;
}

.btn-square {
  height: 3rem;
  width: 3rem;
  padding: 0px;
}

.btn-circle {
  height: 3rem;
  width: 3rem;
  border-radius: 9999px;
  padding: 0px;
}

.btn-group > input[type="radio"].btn {
  -webkit-appearance: none;
     -moz-appearance: none;
          appearance: none;
}

.btn-group > input[type="radio"].btn:before {
  content: attr(data-title);
}

.btn:is(input[type="checkbox"]),
.btn:is(input[type="radio"]) {
  width: auto;
  -webkit-appearance: none;
     -moz-appearance: none;
          appearance: none;
}

.btn:is(input[type="checkbox"]):after,
.btn:is(input[type="radio"]):after {
  --tw-content: attr(aria-label);
  content: var(--tw-content);
}

.card {
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: var(--rounded-box, 1rem);
}

.card:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.card-body {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  padding: var(--padding-card, 2rem);
  gap: 0.5rem;
}

.card-body :where(p) {
  flex-grow: 1;
}

.card-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 0.5rem;
}

.card figure {
  display: flex;
  align-items: center;
  justify-content: center;
}

.card.image-full {
  display: grid;
}

.card.image-full:before {
  position: relative;
  content: "";
  z-index: 10;
  --tw-bg-opacity: 1;
  background-color: hsl(var(--n) / var(--tw-bg-opacity));
  opacity: 0.75;
  border-radius: var(--rounded-box, 1rem);
}

.card.image-full:before,
    .card.image-full > * {
  grid-column-start: 1;
  grid-row-start: 1;
}

.card.image-full > figure img {
  height: 100%;
  -o-object-fit: cover;
     object-fit: cover;
}

.card.image-full > .card-body {
  position: relative;
  z-index: 20;
  --tw-text-opacity: 1;
  color: hsl(var(--nc) / var(--tw-text-opacity));
}

.checkbox {
  flex-shrink: 0;
  --chkbg: var(--bc);
  --chkfg: var(--b1);
  height: 1.5rem;
  width: 1.5rem;
  cursor: pointer;
  -webkit-appearance: none;
     -moz-appearance: none;
          appearance: none;
  border-width: 1px;
  border-color: hsl(var(--bc) / var(--tw-border-opacity));
  --tw-border-opacity: 0.2;
  border-radius: var(--rounded-btn, 0.5rem);
}

.collapse:not(td):not(tr):not(colgroup) {
  visibility: visible;
}

.collapse {
  position: relative;
  display: grid;
  overflow: hidden;
  grid-template-rows: auto 0fr;
  transition: grid-template-rows 0.2s;
  width: 100%;
  border-radius: var(--rounded-box, 1rem);
}

.collapse-title,
.collapse > input[type="checkbox"],
.collapse > input[type="radio"],
.collapse-content {
  grid-column-start: 1;
  grid-row-start: 1;
}

.collapse > input[type="checkbox"],
.collapse > input[type="radio"] {
  -webkit-appearance: none;
     -moz-appearance: none;
          appearance: none;
  opacity: 0;
}

.collapse-content {
  visibility: hidden;
  grid-column-start: 1;
  grid-row-start: 2;
  min-height: 0px;
  transition: visibility 0.2s;
  transition: padding 0.2s ease-out,
    background-color 0.2s ease-out;
  padding-left: 1rem;
  padding-right: 1rem;
  cursor: unset;
}

.collapse[open],
.collapse-open,
.collapse:focus:not(.collapse-close) {
  grid-template-rows: auto 1fr;
}

.collapse:not(.collapse-close):has(> input[type="checkbox"]:checked),
.collapse:not(.collapse-close):has(> input[type="radio"]:checked) {
  grid-template-rows: auto 1fr;
}

.collapse[open] > .collapse-content,
.collapse-open > .collapse-content,
.collapse:focus:not(.collapse-close) > .collapse-content,
.collapse:not(.collapse-close) > input[type="checkbox"]:checked ~ .collapse-content,
.collapse:not(.collapse-close) > input[type="radio"]:checked ~ .collapse-content {
  visibility: visible;
  min-height: -moz-fit-content;
  min-height: fit-content;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown > *:not(summary):focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.dropdown .dropdown-content {
  position: absolute;
}

.dropdown:is(:not(details)) .dropdown-content {
  visibility: hidden;
  opacity: 0;
  transform-origin: top;
  --tw-scale-x: .95;
  --tw-scale-y: .95;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-backdrop-filter;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
  transition-duration: 200ms;
}

.dropdown-end .dropdown-content {
  right: 0px;
}

.dropdown-left .dropdown-content {
  bottom: auto;
  right: 100%;
  top: 0px;
  transform-origin: right;
}

.dropdown-right .dropdown-content {
  bottom: auto;
  left: 100%;
  top: 0px;
  transform-origin: left;
}

.dropdown-bottom .dropdown-content {
  bottom: auto;
  top: 100%;
  transform-origin: top;
}

.dropdown-top .dropdown-content {
  bottom: 100%;
  top: auto;
  transform-origin: bottom;
}

.dropdown-end.dropdown-right .dropdown-content {
  bottom: 0px;
  top: auto;
}

.dropdown-end.dropdown-left .dropdown-content {
  bottom: 0px;
  top: auto;
}

.dropdown.dropdown-open .dropdown-content,
.dropdown:not(.dropdown-hover):focus .dropdown-content,
.dropdown:focus-within .dropdown-content {
  visibility: visible;
  opacity: 1;
}

@media (hover: hover) {
  .dropdown.dropdown-hover:hover .dropdown-content {
    visibility: visible;
    opacity: 1;
  }

  .btm-nav > *.disabled:hover,
      .btm-nav > *[disabled]:hover {
    pointer-events: none;
    --tw-border-opacity: 0;
    background-color: hsl(var(--n) / var(--tw-bg-opacity));
    --tw-bg-opacity: 0.1;
    color: hsl(var(--bc) / var(--tw-text-opacity));
    --tw-text-opacity: 0.2;
  }

  .btn:hover {
    --tw-border-opacity: 1;
    border-color: hsl(var(--b3) / var(--tw-border-opacity));
    --tw-bg-opacity: 1;
    background-color: hsl(var(--b3) / var(--tw-bg-opacity));
  }

  .btn-primary:hover {
    --tw-border-opacity: 1;
    border-color: hsl(var(--pf) / var(--tw-border-opacity));
    --tw-bg-opacity: 1;
    background-color: hsl(var(--pf) / var(--tw-bg-opacity));
  }

  .btn-secondary:hover {
    --tw-border-opacity: 1;
    border-color: hsl(var(--sf) / var(--tw-border-opacity));
    --tw-bg-opacity: 1;
    background-color: hsl(var(--sf) / var(--tw-bg-opacity));
  }

  .btn-accent:hover {
    --tw-border-opacity: 1;
    border-color: hsl(var(--af) / var(--tw-border-opacity));
    --tw-bg-opacity: 1;
    background-color: hsl(var(--af) / var(--tw-bg-opacity));
  }

  .btn-warning:hover {
    --tw-border-opacity: 1;
    border-color: hsl(var(--wa) / var(--tw-border-opacity));
    --tw-bg-opacity: 1;
    background-color: hsl(var(--wa) / var(--tw-bg-opacity));
  }

  .btn.glass:hover {
    --glass-opacity: 25%;
    --glass-border-opacity: 15%;
  }

  .btn-ghost:hover {
    --tw-border-opacity: 0;
    background-color: hsl(var(--bc) / var(--tw-bg-opacity));
    --tw-bg-opacity: 0.2;
  }

  .btn-link:hover {
    border-color: transparent;
    background-color: transparent;
    text-decoration-line: underline;
  }

  .btn-outline:hover {
    --tw-border-opacity: 1;
    border-color: hsl(var(--bc) / var(--tw-border-opacity));
    --tw-bg-opacity: 1;
    background-color: hsl(var(--bc) / var(--tw-bg-opacity));
    --tw-text-opacity: 1;
    color: hsl(var(--b1) / var(--tw-text-opacity));
  }

  .btn-outline.btn-primary:hover {
    --tw-border-opacity: 1;
    border-color: hsl(var(--pf) / var(--tw-border-opacity));
    --tw-bg-opacity: 1;
    background-color: hsl(var(--pf) / var(--tw-bg-opacity));
    --tw-text-opacity: 1;
    color: hsl(var(--pc) / var(--tw-text-opacity));
  }

  .btn-outline.btn-secondary:hover {
    --tw-border-opacity: 1;
    border-color: hsl(var(--sf) / var(--tw-border-opacity));
    --tw-bg-opacity: 1;
    background-color: hsl(var(--sf) / var(--tw-bg-opacity));
    --tw-text-opacity: 1;
    color: hsl(var(--sc) / var(--tw-text-opacity));
  }

  .btn-outline.btn-accent:hover {
    --tw-border-opacity: 1;
    border-color: hsl(var(--af) / var(--tw-border-opacity));
    --tw-bg-opacity: 1;
    background-color: hsl(var(--af) / var(--tw-bg-opacity));
    --tw-text-opacity: 1;
    color: hsl(var(--ac) / var(--tw-text-opacity));
  }

  .btn-outline.btn-success:hover {
    --tw-border-opacity: 1;
    border-color: hsl(var(--su) / var(--tw-border-opacity));
    --tw-bg-opacity: 1;
    background-color: hsl(var(--su) / var(--tw-bg-opacity));
    --tw-text-opacity: 1;
    color: hsl(var(--suc) / var(--tw-text-opacity));
  }

  .btn-outline.btn-info:hover {
    --tw-border-opacity: 1;
    border-color: hsl(var(--in) / var(--tw-border-opacity));
    --tw-bg-opacity: 1;
    background-color: hsl(var(--in) / var(--tw-bg-opacity));
    --tw-text-opacity: 1;
    color: hsl(var(--inc) / var(--tw-text-opacity));
  }

  .btn-outline.btn-warning:hover {
    --tw-border-opacity: 1;
    border-color: hsl(var(--wa) / var(--tw-border-opacity));
    --tw-bg-opacity: 1;
    background-color: hsl(var(--wa) / var(--tw-bg-opacity));
    --tw-text-opacity: 1;
    color: hsl(var(--wac) / var(--tw-text-opacity));
  }

  .btn-outline.btn-error:hover {
    --tw-border-opacity: 1;
    border-color: hsl(var(--er) / var(--tw-border-opacity));
    --tw-bg-opacity: 1;
    background-color: hsl(var(--er) / var(--tw-bg-opacity));
    --tw-text-opacity: 1;
    color: hsl(var(--erc) / var(--tw-text-opacity));
  }

  .btn-disabled:hover,
    .btn[disabled]:hover,
    .btn:disabled:hover {
    --tw-border-opacity: 0;
    background-color: hsl(var(--n) / var(--tw-bg-opacity));
    --tw-bg-opacity: 0.2;
    color: hsl(var(--bc) / var(--tw-text-opacity));
    --tw-text-opacity: 0.2;
  }

  .btn:is(input[type="checkbox"]:checked):hover, .btn:is(input[type="radio"]:checked):hover {
    --tw-border-opacity: 1;
    border-color: hsl(var(--pf) / var(--tw-border-opacity));
    --tw-bg-opacity: 1;
    background-color: hsl(var(--pf) / var(--tw-bg-opacity));
  }

  .dropdown.dropdown-hover:hover .dropdown-content {
    --tw-scale-x: 1;
    --tw-scale-y: 1;
    transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
  }

  :where(.menu li:not(.menu-title):not(.disabled) > *:not(ul):not(details):not(.menu-title)):not(.active):hover, :where(.menu li:not(.menu-title):not(.disabled) > details > summary:not(.menu-title)):not(.active):hover {
    cursor: pointer;
    background-color: hsl(var(--bc) / 0.1);
    --tw-text-opacity: 1;
    color: hsl(var(--bc) / var(--tw-text-opacity));
    outline: 2px solid transparent;
    outline-offset: 2px;
  }

  .\\!tab[disabled],
    .\\!tab[disabled]:hover {
    cursor: not-allowed !important;
    color: hsl(var(--bc) / var(--tw-text-opacity)) !important;
    --tw-text-opacity: 0.2 !important;
  }

  .tab[disabled],
    .tab[disabled]:hover {
    cursor: not-allowed;
    color: hsl(var(--bc) / var(--tw-text-opacity));
    --tw-text-opacity: 0.2;
  }

  .\\!tab[disabled],
    .\\!tab[disabled]:hover {
    cursor: not-allowed !important;
    color: hsl(var(--bc) / var(--tw-text-opacity)) !important;
    --tw-text-opacity: 0.2 !important;
  }
}

.dropdown:is(details) summary::-webkit-details-marker {
  display: none;
}

.footer {
  display: grid;
  width: 100%;
  grid-auto-flow: row;
  place-items: start;
  -moz-column-gap: 1rem;
       column-gap: 1rem;
  row-gap: 2.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.footer > * {
  display: grid;
  place-items: start;
  gap: 0.5rem;
}

@media (min-width: 48rem) {
  .footer {
    grid-auto-flow: column;
  }

  .footer-center {
    grid-auto-flow: row dense;
  }
}

.form-control {
  display: flex;
  flex-direction: column;
}

.label {
  display: flex;
  -webkit-user-select: none;
     -moz-user-select: none;
          user-select: none;
  align-items: center;
  justify-content: space-between;
  padding-left: 0.25rem;
  padding-right: 0.25rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.\\!input {
  flex-shrink: 1 !important;
  height: 3rem !important;
  padding-left: 1rem !important;
  padding-right: 1rem !important;
  font-size: 1rem !important;
  line-height: 2 !important;
  line-height: 1.5rem !important;
  border-width: 1px !important;
  border-color: hsl(var(--bc) / var(--tw-border-opacity)) !important;
  --tw-border-opacity: 0 !important;
  --tw-bg-opacity: 1 !important;
  background-color: hsl(var(--b1) / var(--tw-bg-opacity)) !important;
  border-radius: var(--rounded-btn, 0.5rem) !important;
}

.input {
  flex-shrink: 1;
  height: 3rem;
  padding-left: 1rem;
  padding-right: 1rem;
  font-size: 1rem;
  line-height: 2;
  line-height: 1.5rem;
  border-width: 1px;
  border-color: hsl(var(--bc) / var(--tw-border-opacity));
  --tw-border-opacity: 0;
  --tw-bg-opacity: 1;
  background-color: hsl(var(--b1) / var(--tw-bg-opacity));
  border-radius: var(--rounded-btn, 0.5rem);
}

.input-group > .\\!input {
  isolation: isolate !important;
}

.input-group > .input {
  isolation: isolate;
}


  .input-group > .\\!input {
  border-radius: 0px !important;
}

.input-group > *,
  .input-group > .input,
  .input-group > .textarea,
  .input-group > .select {
  border-radius: 0px;
}

.join {
  display: inline-flex;
  align-items: stretch;
  border-radius: var(--rounded-btn, 0.5rem);
}

.join :where(.join-item) {
  border-start-end-radius: 0;
  border-end-end-radius: 0;
  border-end-start-radius: 0;
  border-start-start-radius: 0;
}

.join .join-item:not(:first-child):not(:last-child),
  .join *:not(:first-child):not(:last-child) .join-item {
  border-start-end-radius: 0;
  border-end-end-radius: 0;
  border-end-start-radius: 0;
  border-start-start-radius: 0;
}

.join .join-item:first-child:not(:last-child),
  .join *:first-child:not(:last-child) .join-item {
  border-start-end-radius: 0;
  border-end-end-radius: 0;
}

.join .dropdown .join-item:first-child:not(:last-child),
  .join *:first-child:not(:last-child) .dropdown .join-item {
  border-start-end-radius: inherit;
  border-end-end-radius: inherit;
}

.join :where(.join-item:first-child:not(:last-child)),
  .join :where(*:first-child:not(:last-child) .join-item) {
  border-end-start-radius: inherit;
  border-start-start-radius: inherit;
}

.join .join-item:last-child:not(:first-child),
  .join *:last-child:not(:first-child) .join-item {
  border-end-start-radius: 0;
  border-start-start-radius: 0;
}

.join :where(.join-item:last-child:not(:first-child)),
  .join :where(*:last-child:not(:first-child) .join-item) {
  border-start-end-radius: inherit;
  border-end-end-radius: inherit;
}

@supports not selector(:has(*)) {
  :where(.join *) {
    border-radius: inherit;
  }
}

@supports selector(:has(*)) {
  :where(.join *:has(.join-item)) {
    border-radius: inherit;
  }
}

.kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: hsl(var(--bc) / var(--tw-border-opacity));
  --tw-border-opacity: 0.2;
  --tw-bg-opacity: 1;
  background-color: hsl(var(--b2) / var(--tw-bg-opacity));
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  border-radius: var(--rounded-btn, 0.5rem);
  border-bottom-width: 2px;
  min-height: 2.2em;
  min-width: 2.2em;
}

.\\!link {
  cursor: pointer !important;
  text-decoration-line: underline !important;
}

.link {
  cursor: pointer;
  text-decoration-line: underline;
}

.link-hover {
  text-decoration-line: none;
}

.menu {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  font-size: 0.875rem;
  line-height: 1.25rem;
  padding: 0.5rem;
}

.menu :where(li ul) {
  position: relative;
  white-space: nowrap;
  margin-left: 1rem;
  padding-left: 0.5rem;
}

.menu :where(li:not(.menu-title) > *:not(ul):not(details):not(.menu-title)),
  .menu :where(li:not(.menu-title) > details > summary:not(.menu-title)) {
  display: grid;
  grid-auto-flow: column;
  align-content: flex-start;
  align-items: center;
  gap: 0.5rem;
  grid-auto-columns: minmax(auto, max-content) auto max-content;
  -webkit-user-select: none;
     -moz-user-select: none;
          user-select: none;
}

.menu li.disabled {
  cursor: not-allowed;
  -webkit-user-select: none;
     -moz-user-select: none;
          user-select: none;
  color: hsl(var(--bc) / 0.3);
}

.menu :where(li > .menu-dropdown:not(.menu-dropdown-show)) {
  display: none;
}

:where(.menu li) {
  position: relative;
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: stretch;
}

:where(.menu li) .badge {
  justify-self: end;
}

.modal {
  pointer-events: none;
  position: fixed;
  inset: 0px;
  margin: 0px;
  display: grid;
  height: 100%;
  max-height: none;
  width: 100%;
  max-width: none;
  justify-items: center;
  padding: 0px;
  opacity: 0;
  overscroll-behavior: contain;
  z-index: 999;
  background-color: transparent;
  color: inherit;
  transition-duration: 200ms;
  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
  transition-property: transform, opacity, visibility;
  overflow-y: hidden;
}

:where(.modal) {
  align-items: center;
}

.modal-box {
  max-height: calc(100vh - 5em);
  grid-column-start: 1;
  grid-row-start: 1;
  width: 91.666667%;
  max-width: 32rem;
  --tw-scale-x: .9;
  --tw-scale-y: .9;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
  --tw-bg-opacity: 1;
  background-color: hsl(var(--b1) / var(--tw-bg-opacity));
  padding: 1.5rem;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-backdrop-filter;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
  transition-duration: 200ms;
  border-top-left-radius: var(--rounded-box, 1rem);
  border-top-right-radius: var(--rounded-box, 1rem);
  border-bottom-left-radius: var(--rounded-box, 1rem);
  border-bottom-right-radius: var(--rounded-box, 1rem);
  box-shadow: rgba(0, 0, 0, 0.25) 0px 25px 50px -12px;
  overflow-y: auto;
  overscroll-behavior: contain;
}

.modal-open,
.modal:target,
.modal-toggle:checked + .modal,
.modal[open] {
  pointer-events: auto;
  visibility: visible;
  opacity: 1;
}

.modal-action {
  display: flex;
  margin-top: 1.5rem;
  justify-content: flex-end;
}

:host:has(:is(.modal-open, .modal:target, .modal-toggle:checked + .modal, .modal[open])) {
  overflow: hidden;
}

.navbar {
  display: flex;
  align-items: center;
  padding: var(--navbar-padding, 0.5rem);
  min-height: 4rem;
  width: 100%;
}

:where(.navbar > *) {
  display: inline-flex;
  align-items: center;
}

.navbar-start {
  width: 50%;
  justify-content: flex-start;
}

.navbar-center {
  flex-shrink: 0;
}

.navbar-end {
  width: 50%;
  justify-content: flex-end;
}

.radio {
  flex-shrink: 0;
  --chkbg: var(--bc);
  height: 1.5rem;
  width: 1.5rem;
  cursor: pointer;
  -webkit-appearance: none;
     -moz-appearance: none;
          appearance: none;
  border-radius: 9999px;
  border-width: 1px;
  border-color: hsl(var(--bc) / var(--tw-border-opacity));
  --tw-border-opacity: 0.2;
}

.range {
  height: 1.5rem;
  width: 100%;
  cursor: pointer;
  -moz-appearance: none;
       appearance: none;
  -webkit-appearance: none;
  --range-shdw: var(--bc);
  overflow: hidden;
  background-color: transparent;
  border-radius: var(--rounded-box, 1rem);
}

.range:focus {
  outline: none;
}

.select {
  display: inline-flex;
  cursor: pointer;
  -webkit-user-select: none;
     -moz-user-select: none;
          user-select: none;
  -webkit-appearance: none;
     -moz-appearance: none;
          appearance: none;
  height: 3rem;
  padding-left: 1rem;
  padding-right: 2.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  line-height: 2;
  min-height: 3rem;
  border-width: 1px;
  border-color: hsl(var(--bc) / var(--tw-border-opacity));
  --tw-border-opacity: 0;
  --tw-bg-opacity: 1;
  background-color: hsl(var(--b1) / var(--tw-bg-opacity));
  border-radius: var(--rounded-btn, 0.5rem);
  background-image: linear-gradient(45deg, transparent 50%, currentColor 50%),
    linear-gradient(135deg, currentColor 50%, transparent 50%);
  background-position: calc(100% - 20px) calc(1px + 50%),
    calc(100% - 16.1px) calc(1px + 50%);
  background-size: 4px 4px,
    4px 4px;
  background-repeat: no-repeat;
}

.select[multiple] {
  height: auto;
}

.steps .step {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  grid-template-columns: auto;
  grid-template-rows: repeat(2, minmax(0, 1fr));
  grid-template-rows: 40px 1fr;
  place-items: center;
  text-align: center;
  min-width: 4rem;
}

.tabs {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
}

.\\!tab {
  position: relative !important;
  display: inline-flex !important;
  cursor: pointer !important;
  -webkit-user-select: none !important;
     -moz-user-select: none !important;
          user-select: none !important;
  flex-wrap: wrap !important;
  align-items: center !important;
  justify-content: center !important;
  text-align: center !important;
  height: 2rem !important;
  font-size: 0.875rem !important;
  line-height: 1.25rem !important;
  line-height: 2 !important;
  --tab-padding: 1rem !important;
  --tw-text-opacity: 0.5 !important;
  --tab-color: hsl(var(--bc) / var(--tw-text-opacity, 1)) !important;
  --tab-bg: hsl(var(--b1) / var(--tw-bg-opacity, 1)) !important;
  --tab-border-color: hsl(var(--b3) / var(--tw-bg-opacity, 1)) !important;
  color: var(--tab-color) !important;
  padding-left: var(--tab-padding, 1rem) !important;
  padding-right: var(--tab-padding, 1rem) !important;
}

.tab {
  position: relative;
  display: inline-flex;
  cursor: pointer;
  -webkit-user-select: none;
     -moz-user-select: none;
          user-select: none;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 2rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  line-height: 2;
  --tab-padding: 1rem;
  --tw-text-opacity: 0.5;
  --tab-color: hsl(var(--bc) / var(--tw-text-opacity, 1));
  --tab-bg: hsl(var(--b1) / var(--tw-bg-opacity, 1));
  --tab-border-color: hsl(var(--b3) / var(--tw-bg-opacity, 1));
  color: var(--tab-color);
  padding-left: var(--tab-padding, 1rem);
  padding-right: var(--tab-padding, 1rem);
}

.table {
  position: relative;
  width: 100%;
  text-align: left;
  font-size: 0.875rem;
  line-height: 1.25rem;
  border-radius: var(--rounded-box, 1rem);
}

.table :where(.table-pin-rows thead tr) {
  position: sticky;
  top: 0px;
  z-index: 1;
  --tw-bg-opacity: 1;
  background-color: hsl(var(--b1) / var(--tw-bg-opacity));
}

.table :where(.table-pin-rows tfoot tr) {
  position: sticky;
  bottom: 0px;
  z-index: 1;
  --tw-bg-opacity: 1;
  background-color: hsl(var(--b1) / var(--tw-bg-opacity));
}

.table :where(.table-pin-cols tr th) {
  position: sticky;
  left: 0px;
  right: 0px;
  --tw-bg-opacity: 1;
  background-color: hsl(var(--b1) / var(--tw-bg-opacity));
}

.textarea {
  flex-shrink: 1;
  min-height: 3rem;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  line-height: 2;
  border-width: 1px;
  border-color: hsl(var(--bc) / var(--tw-border-opacity));
  --tw-border-opacity: 0;
  --tw-bg-opacity: 1;
  background-color: hsl(var(--b1) / var(--tw-bg-opacity));
  border-radius: var(--rounded-btn, 0.5rem);
}

.toast {
  position: fixed;
  display: flex;
  min-width: -moz-fit-content;
  min-width: fit-content;
  flex-direction: column;
  white-space: nowrap;
  gap: 0.5rem;
  padding: 1rem;
}

.toggle {
  flex-shrink: 0;
  --tglbg: hsl(var(--b1));
  --handleoffset: 1.5rem;
  --handleoffsetcalculator: calc(var(--handleoffset) * -1);
  --togglehandleborder: 0 0;
  height: 1.5rem;
  width: 3rem;
  cursor: pointer;
  -webkit-appearance: none;
     -moz-appearance: none;
          appearance: none;
  border-width: 1px;
  border-color: hsl(var(--bc) / var(--tw-border-opacity));
  --tw-border-opacity: 0.2;
  background-color: hsl(var(--bc) / var(--tw-bg-opacity));
  --tw-bg-opacity: 0.5;
  border-radius: var(--rounded-badge, 1.9rem);
  transition: background,
    box-shadow var(--animation-input, 0.2s) ease-out;
  box-shadow: var(--handleoffsetcalculator) 0 0 2px var(--tglbg) inset,
    0 0 0 2px var(--tglbg) inset,
    var(--togglehandleborder);
}

.alert-info {
  border-color: hsl(var(--in) / 0.2);
  --tw-text-opacity: 1;
  color: hsl(var(--inc) / var(--tw-text-opacity));
  --alert-bg: hsl(var(--in));
  --alert-bg-mix: hsl(var(--b1));
}

.alert-error {
  border-color: hsl(var(--er) / 0.2);
  --tw-text-opacity: 1;
  color: hsl(var(--erc) / var(--tw-text-opacity));
  --alert-bg: hsl(var(--er));
  --alert-bg-mix: hsl(var(--b1));
}

.btm-nav > *:where(.active) {
  border-top-width: 2px;
  --tw-bg-opacity: 1;
  background-color: hsl(var(--b1) / var(--tw-bg-opacity));
}

.btm-nav > *.disabled,
    .btm-nav > *[disabled] {
  pointer-events: none;
  --tw-border-opacity: 0;
  background-color: hsl(var(--n) / var(--tw-bg-opacity));
  --tw-bg-opacity: 0.1;
  color: hsl(var(--bc) / var(--tw-text-opacity));
  --tw-text-opacity: 0.2;
}

.btm-nav > * .label {
  font-size: 1rem;
  line-height: 1.5rem;
}

.btn:active:hover,
  .btn:active:focus {
  animation: button-pop 0s ease-out;
  transform: scale(var(--btn-focus-scale, 0.97));
}

.btn:focus-visible {
  outline-style: solid;
  outline-width: 2px;
  outline-offset: 2px;
}

.btn-primary {
  --tw-border-opacity: 1;
  border-color: hsl(var(--p) / var(--tw-border-opacity));
  --tw-bg-opacity: 1;
  background-color: hsl(var(--p) / var(--tw-bg-opacity));
  --tw-text-opacity: 1;
  color: hsl(var(--pc) / var(--tw-text-opacity));
  outline-color: hsl(var(--p) / 1);
}

.btn-primary.btn-active {
  --tw-border-opacity: 1;
  border-color: hsl(var(--pf) / var(--tw-border-opacity));
  --tw-bg-opacity: 1;
  background-color: hsl(var(--pf) / var(--tw-bg-opacity));
}

.btn-secondary {
  --tw-border-opacity: 1;
  border-color: hsl(var(--s) / var(--tw-border-opacity));
  --tw-bg-opacity: 1;
  background-color: hsl(var(--s) / var(--tw-bg-opacity));
  --tw-text-opacity: 1;
  color: hsl(var(--sc) / var(--tw-text-opacity));
  outline-color: hsl(var(--s) / 1);
}

.btn-secondary.btn-active {
  --tw-border-opacity: 1;
  border-color: hsl(var(--sf) / var(--tw-border-opacity));
  --tw-bg-opacity: 1;
  background-color: hsl(var(--sf) / var(--tw-bg-opacity));
}

.btn-accent {
  --tw-border-opacity: 1;
  border-color: hsl(var(--a) / var(--tw-border-opacity));
  --tw-bg-opacity: 1;
  background-color: hsl(var(--a) / var(--tw-bg-opacity));
  --tw-text-opacity: 1;
  color: hsl(var(--ac) / var(--tw-text-opacity));
  outline-color: hsl(var(--a) / 1);
}

.btn-accent.btn-active {
  --tw-border-opacity: 1;
  border-color: hsl(var(--af) / var(--tw-border-opacity));
  --tw-bg-opacity: 1;
  background-color: hsl(var(--af) / var(--tw-bg-opacity));
}

.btn-warning {
  --tw-border-opacity: 1;
  border-color: hsl(var(--wa) / var(--tw-border-opacity));
  --tw-bg-opacity: 1;
  background-color: hsl(var(--wa) / var(--tw-bg-opacity));
  --tw-text-opacity: 1;
  color: hsl(var(--wac) / var(--tw-text-opacity));
  outline-color: hsl(var(--wa) / 1);
}

.btn-warning.btn-active {
  --tw-border-opacity: 1;
  border-color: hsl(var(--wa) / var(--tw-border-opacity));
  --tw-bg-opacity: 1;
  background-color: hsl(var(--wa) / var(--tw-bg-opacity));
}

.btn.glass {
  --tw-shadow: 0 0 #0000;
  --tw-shadow-colored: 0 0 #0000;
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
  outline-color: currentColor;
}

.btn.glass.btn-active {
  --glass-opacity: 25%;
  --glass-border-opacity: 15%;
}

.btn-ghost {
  border-width: 1px;
  border-color: transparent;
  background-color: transparent;
  color: currentColor;
  --tw-shadow: 0 0 #0000;
  --tw-shadow-colored: 0 0 #0000;
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
  outline-color: currentColor;
}

.btn-ghost.btn-active {
  --tw-border-opacity: 0;
  background-color: hsl(var(--bc) / var(--tw-bg-opacity));
  --tw-bg-opacity: 0.2;
}

.btn-link {
  border-color: transparent;
  background-color: transparent;
  --tw-text-opacity: 1;
  color: hsl(var(--p) / var(--tw-text-opacity));
  text-decoration-line: underline;
  --tw-shadow: 0 0 #0000;
  --tw-shadow-colored: 0 0 #0000;
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
  outline-color: currentColor;
}

.btn-link.btn-active {
  border-color: transparent;
  background-color: transparent;
  text-decoration-line: underline;
}

.btn-outline {
  border-color: currentColor;
  background-color: transparent;
  --tw-text-opacity: 1;
  color: hsl(var(--bc) / var(--tw-text-opacity));
  --tw-shadow: 0 0 #0000;
  --tw-shadow-colored: 0 0 #0000;
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.btn-outline.btn-active {
  --tw-border-opacity: 1;
  border-color: hsl(var(--bc) / var(--tw-border-opacity));
  --tw-bg-opacity: 1;
  background-color: hsl(var(--bc) / var(--tw-bg-opacity));
  --tw-text-opacity: 1;
  color: hsl(var(--b1) / var(--tw-text-opacity));
}

.btn-outline.btn-primary {
  --tw-text-opacity: 1;
  color: hsl(var(--p) / var(--tw-text-opacity));
}

.btn-outline.btn-primary.btn-active {
  --tw-border-opacity: 1;
  border-color: hsl(var(--pf) / var(--tw-border-opacity));
  --tw-bg-opacity: 1;
  background-color: hsl(var(--pf) / var(--tw-bg-opacity));
  --tw-text-opacity: 1;
  color: hsl(var(--pc) / var(--tw-text-opacity));
}

.btn-outline.btn-secondary {
  --tw-text-opacity: 1;
  color: hsl(var(--s) / var(--tw-text-opacity));
}

.btn-outline.btn-secondary.btn-active {
  --tw-border-opacity: 1;
  border-color: hsl(var(--sf) / var(--tw-border-opacity));
  --tw-bg-opacity: 1;
  background-color: hsl(var(--sf) / var(--tw-bg-opacity));
  --tw-text-opacity: 1;
  color: hsl(var(--sc) / var(--tw-text-opacity));
}

.btn-outline.btn-accent {
  --tw-text-opacity: 1;
  color: hsl(var(--a) / var(--tw-text-opacity));
}

.btn-outline.btn-accent.btn-active {
  --tw-border-opacity: 1;
  border-color: hsl(var(--af) / var(--tw-border-opacity));
  --tw-bg-opacity: 1;
  background-color: hsl(var(--af) / var(--tw-bg-opacity));
  --tw-text-opacity: 1;
  color: hsl(var(--ac) / var(--tw-text-opacity));
}

.btn-outline.btn-success {
  --tw-text-opacity: 1;
  color: hsl(var(--su) / var(--tw-text-opacity));
}

.btn-outline.btn-success.btn-active {
  --tw-border-opacity: 1;
  border-color: hsl(var(--su) / var(--tw-border-opacity));
  --tw-bg-opacity: 1;
  background-color: hsl(var(--su) / var(--tw-bg-opacity));
  --tw-text-opacity: 1;
  color: hsl(var(--suc) / var(--tw-text-opacity));
}

.btn-outline.btn-info {
  --tw-text-opacity: 1;
  color: hsl(var(--in) / var(--tw-text-opacity));
}

.btn-outline.btn-info.btn-active {
  --tw-border-opacity: 1;
  border-color: hsl(var(--in) / var(--tw-border-opacity));
  --tw-bg-opacity: 1;
  background-color: hsl(var(--in) / var(--tw-bg-opacity));
  --tw-text-opacity: 1;
  color: hsl(var(--inc) / var(--tw-text-opacity));
}

.btn-outline.btn-warning {
  --tw-text-opacity: 1;
  color: hsl(var(--wa) / var(--tw-text-opacity));
}

.btn-outline.btn-warning.btn-active {
  --tw-border-opacity: 1;
  border-color: hsl(var(--wa) / var(--tw-border-opacity));
  --tw-bg-opacity: 1;
  background-color: hsl(var(--wa) / var(--tw-bg-opacity));
  --tw-text-opacity: 1;
  color: hsl(var(--wac) / var(--tw-text-opacity));
}

.btn-outline.btn-error {
  --tw-text-opacity: 1;
  color: hsl(var(--er) / var(--tw-text-opacity));
}

.btn-outline.btn-error.btn-active {
  --tw-border-opacity: 1;
  border-color: hsl(var(--er) / var(--tw-border-opacity));
  --tw-bg-opacity: 1;
  background-color: hsl(var(--er) / var(--tw-bg-opacity));
  --tw-text-opacity: 1;
  color: hsl(var(--erc) / var(--tw-text-opacity));
}

.btn.btn-disabled,
  .btn[disabled],
  .btn:disabled {
  --tw-border-opacity: 0;
  background-color: hsl(var(--n) / var(--tw-bg-opacity));
  --tw-bg-opacity: 0.2;
  color: hsl(var(--bc) / var(--tw-text-opacity));
  --tw-text-opacity: 0.2;
}

.btn-group > input[type="radio"]:checked.btn,
  .btn-group > .btn-active {
  --tw-border-opacity: 1;
  border-color: hsl(var(--p) / var(--tw-border-opacity));
  --tw-bg-opacity: 1;
  background-color: hsl(var(--p) / var(--tw-bg-opacity));
  --tw-text-opacity: 1;
  color: hsl(var(--pc) / var(--tw-text-opacity));
}

.btn-group > input[type="radio"]:checked.btn:focus-visible, .btn-group > .btn-active:focus-visible {
  outline-style: solid;
  outline-width: 2px;
  outline-color: hsl(var(--p) / 1);
}

.btn:is(input[type="checkbox"]:checked),
.btn:is(input[type="radio"]:checked) {
  --tw-border-opacity: 1;
  border-color: hsl(var(--p) / var(--tw-border-opacity));
  --tw-bg-opacity: 1;
  background-color: hsl(var(--p) / var(--tw-bg-opacity));
  --tw-text-opacity: 1;
  color: hsl(var(--pc) / var(--tw-text-opacity));
}

.btn:is(input[type="checkbox"]:checked):focus-visible, .btn:is(input[type="radio"]:checked):focus-visible {
  outline-color: hsl(var(--p) / 1);
}

@keyframes button-pop {
  0% {
    transform: scale(var(--btn-focus-scale, 0.98));
  }

  40% {
    transform: scale(1.02);
  }

  100% {
    transform: scale(1);
  }
}

.card :where(figure:first-child) {
  overflow: hidden;
  border-start-start-radius: inherit;
  border-start-end-radius: inherit;
  border-end-start-radius: unset;
  border-end-end-radius: unset;
}

.card :where(figure:last-child) {
  overflow: hidden;
  border-start-start-radius: unset;
  border-start-end-radius: unset;
  border-end-start-radius: inherit;
  border-end-end-radius: inherit;
}

.card:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

.card.bordered {
  border-width: 1px;
  --tw-border-opacity: 1;
  border-color: hsl(var(--b2) / var(--tw-border-opacity));
}

.card.compact .card-body {
  padding: 1rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  line-height: 1.75rem;
  font-weight: 600;
}

.card.image-full :where(figure) {
  overflow: hidden;
  border-radius: inherit;
}

.checkbox:focus-visible {
  outline-style: solid;
  outline-width: 2px;
  outline-offset: 2px;
  outline-color: hsl(var(--bc) / 1);
}

.checkbox:checked,
  .checkbox[checked="true"],
  .checkbox[aria-checked="true"] {
  --tw-bg-opacity: 1;
  background-color: hsl(var(--bc) / var(--tw-bg-opacity));
  background-repeat: no-repeat;
  animation: checkmark var(--animation-input, 0.2s) ease-out;
  background-image: linear-gradient(-45deg, transparent 65%, hsl(var(--chkbg)) 65.99%),
      linear-gradient(45deg, transparent 75%, hsl(var(--chkbg)) 75.99%),
      linear-gradient(-45deg, hsl(var(--chkbg)) 40%, transparent 40.99%),
      linear-gradient(
        45deg,
        hsl(var(--chkbg)) 30%,
        hsl(var(--chkfg)) 30.99%,
        hsl(var(--chkfg)) 40%,
        transparent 40.99%
      ),
      linear-gradient(-45deg, hsl(var(--chkfg)) 50%, hsl(var(--chkbg)) 50.99%);
}

.checkbox:indeterminate {
  --tw-bg-opacity: 1;
  background-color: hsl(var(--bc) / var(--tw-bg-opacity));
  background-repeat: no-repeat;
  animation: checkmark var(--animation-input, 0.2s) ease-out;
  background-image: linear-gradient(90deg, transparent 80%, hsl(var(--chkbg)) 80%),
      linear-gradient(-90deg, transparent 80%, hsl(var(--chkbg)) 80%),
      linear-gradient(
        0deg,
        hsl(var(--chkbg)) 43%,
        hsl(var(--chkfg)) 43%,
        hsl(var(--chkfg)) 57%,
        hsl(var(--chkbg)) 57%
      );
}

.checkbox:disabled {
  cursor: not-allowed;
  border-color: transparent;
  --tw-bg-opacity: 1;
  background-color: hsl(var(--bc) / var(--tw-bg-opacity));
  opacity: 0.2;
}

@keyframes checkmark {
  0% {
    background-position-y: 5px;
  }

  50% {
    background-position-y: -2px;
  }

  100% {
    background-position-y: 0;
  }
}

[dir="rtl"] .checkbox:checked,
    [dir="rtl"] .checkbox[checked="true"],
    [dir="rtl"] .checkbox[aria-checked="true"] {
  background-image: linear-gradient(45deg, transparent 65%, hsl(var(--chkbg)) 65.99%),
        linear-gradient(-45deg, transparent 75%, hsl(var(--chkbg)) 75.99%),
        linear-gradient(45deg, hsl(var(--chkbg)) 40%, transparent 40.99%),
        linear-gradient(
          -45deg,
          hsl(var(--chkbg)) 30%,
          hsl(var(--chkfg)) 30.99%,
          hsl(var(--chkfg)) 40%,
          transparent 40.99%
        ),
        linear-gradient(45deg, hsl(var(--chkfg)) 50%, hsl(var(--chkbg)) 50.99%);
}

details.collapse {
  width: 100%;
}

details.collapse summary {
  position: relative;
  display: block;
  outline: 2px solid transparent;
  outline-offset: 2px;
}

details.collapse summary::-webkit-details-marker {
  display: none;
}

.collapse:focus-visible {
  outline-style: solid;
  outline-width: 2px;
  outline-offset: 2px;
  outline-color: hsl(var(--bc) / 1);
}

.collapse:has(.collapse-title:focus-visible),
.collapse:has(> input[type="checkbox"]:focus-visible),
.collapse:has(> input[type="radio"]:focus-visible) {
  outline-style: solid;
  outline-width: 2px;
  outline-offset: 2px;
  outline-color: hsl(var(--bc) / 1);
}

.collapse-arrow > .collapse-title:after {
  position: absolute;
  display: block;
  height: 0.5rem;
  width: 0.5rem;
  --tw-translate-y: -100%;
  --tw-rotate: 45deg;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
  transition-duration: 150ms;
  transition-duration: 0.2s;
  top: 50%;
  right: 1.4rem;
  content: "";
  transform-origin: 75% 75%;
  box-shadow: 2px 2px;
  pointer-events: none;
}

[dir="rtl"] .collapse-arrow > .collapse-title:after {
  --tw-rotate: -45deg;
}

.collapse-plus > .collapse-title:after {
  position: absolute;
  display: block;
  height: 0.5rem;
  width: 0.5rem;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
  transition-duration: 300ms;
  top: 0.9rem;
  right: 1.4rem;
  content: "+";
  pointer-events: none;
}

.collapse:not(.collapse-open):not(.collapse-close) > input[type="checkbox"],
.collapse:not(.collapse-open):not(.collapse-close) > input[type="radio"]:not(:checked),
.collapse:not(.collapse-open):not(.collapse-close) > .collapse-title {
  cursor: pointer;
}

.collapse:focus:not(.collapse-open):not(.collapse-close):not(.collapse[open]) > .collapse-title {
  cursor: unset;
}

.collapse-title {
  position: relative;
}

:where(.collapse > input[type="checkbox"]),
:where(.collapse > input[type="radio"]) {
  z-index: 1;
}

.collapse-title,
:where(.collapse > input[type="checkbox"]),
:where(.collapse > input[type="radio"]) {
  width: 100%;
  padding: 1rem;
  padding-right: 3rem;
  min-height: 3.75rem;
  transition: background-color 0.2s ease-out;
}

.collapse[open] > :where(.collapse-content),
.collapse-open > :where(.collapse-content),
.collapse:focus:not(.collapse-close) > :where(.collapse-content),
.collapse:not(.collapse-close) > :where(input[type="checkbox"]:checked ~ .collapse-content),
.collapse:not(.collapse-close) > :where(input[type="radio"]:checked ~ .collapse-content) {
  padding-bottom: 1rem;
  transition: padding 0.2s ease-out,
    background-color 0.2s ease-out;
}

.collapse[open].collapse-arrow > .collapse-title:after,
.collapse-open.collapse-arrow > .collapse-title:after,
.collapse-arrow:focus:not(.collapse-close) > .collapse-title:after,
.collapse-arrow:not(.collapse-close) > input[type="checkbox"]:checked ~ .collapse-title:after,
.collapse-arrow:not(.collapse-close) > input[type="radio"]:checked ~ .collapse-title:after {
  --tw-translate-y: -50%;
  --tw-rotate: 225deg;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

[dir="rtl"] .collapse[open].collapse-arrow > .collapse-title:after,
[dir="rtl"] .collapse-open.collapse-arrow > .collapse-title:after,
[dir="rtl"] .collapse-arrow:focus:not(.collapse-close) .collapse-title:after,
[dir="rtl"]
  .collapse-arrow:not(.collapse-close)
  input[type="checkbox"]:checked
  ~ .collapse-title:after {
  --tw-rotate: 135deg;
}

.collapse[open].collapse-plus > .collapse-title:after,
.collapse-open.collapse-plus > .collapse-title:after,
.collapse-plus:focus:not(.collapse-close) > .collapse-title:after,
.collapse-plus:not(.collapse-close) > input[type="checkbox"]:checked ~ .collapse-title:after,
.collapse-plus:not(.collapse-close) > input[type="radio"]:checked ~ .collapse-title:after {
  content: "−";
}

.dropdown.dropdown-open .dropdown-content,
.dropdown:focus .dropdown-content,
.dropdown:focus-within .dropdown-content {
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.label-text {
  font-size: 0.875rem;
  line-height: 1.25rem;
  --tw-text-opacity: 1;
  color: hsl(var(--bc) / var(--tw-text-opacity));
}

.\\!input input:focus {
  outline: 2px solid transparent !important;
  outline-offset: 2px !important;
}

.input input:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.\\!input[list]::-webkit-calendar-picker-indicator {
  line-height: 1em !important;
}

.input[list]::-webkit-calendar-picker-indicator {
  line-height: 1em;
}

.input-bordered {
  --tw-border-opacity: 0.2;
}

.\\!input:focus,
  .\\!input:focus-within {
  outline-style: solid !important;
  outline-width: 2px !important;
  outline-offset: 2px !important;
  outline-color: hsl(var(--bc) / 0.2) !important;
}

.input:focus,
  .input:focus-within {
  outline-style: solid;
  outline-width: 2px;
  outline-offset: 2px;
  outline-color: hsl(var(--bc) / 0.2);
}

.\\!input:focus,
  .\\!input:focus-within {
  outline-style: solid !important;
  outline-width: 2px !important;
  outline-offset: 2px !important;
  outline-color: hsl(var(--bc) / 0.2) !important;
}


  .\\!input:disabled,
  .\\!input[disabled] {
  cursor: not-allowed !important;
  --tw-border-opacity: 1 !important;
  border-color: hsl(var(--b2) / var(--tw-border-opacity)) !important;
  --tw-bg-opacity: 1 !important;
  background-color: hsl(var(--b2) / var(--tw-bg-opacity)) !important;
  --tw-text-opacity: 0.2 !important;
}

.input-disabled,
  .input:disabled,
  .input[disabled] {
  cursor: not-allowed;
  --tw-border-opacity: 1;
  border-color: hsl(var(--b2) / var(--tw-border-opacity));
  --tw-bg-opacity: 1;
  background-color: hsl(var(--b2) / var(--tw-bg-opacity));
  --tw-text-opacity: 0.2;
}


  .\\!input:disabled,
  .\\!input[disabled] {
  cursor: not-allowed !important;
  --tw-border-opacity: 1 !important;
  border-color: hsl(var(--b2) / var(--tw-border-opacity)) !important;
  --tw-bg-opacity: 1 !important;
  background-color: hsl(var(--b2) / var(--tw-bg-opacity)) !important;
  --tw-text-opacity: 0.2 !important;
}

.\\!input:disabled::-moz-placeholder, .\\!input[disabled]::-moz-placeholder {
  color: hsl(var(--bc) / var(--tw-placeholder-opacity)) !important;
  --tw-placeholder-opacity: 0.2 !important;
}


  .\\!input:disabled::placeholder,
  .\\!input[disabled]::placeholder {
  color: hsl(var(--bc) / var(--tw-placeholder-opacity)) !important;
  --tw-placeholder-opacity: 0.2 !important;
}

.input-disabled::-moz-placeholder, .input:disabled::-moz-placeholder, .input[disabled]::-moz-placeholder {
  color: hsl(var(--bc) / var(--tw-placeholder-opacity));
  --tw-placeholder-opacity: 0.2;
}

.input-disabled::placeholder,
  .input:disabled::placeholder,
  .input[disabled]::placeholder {
  color: hsl(var(--bc) / var(--tw-placeholder-opacity));
  --tw-placeholder-opacity: 0.2;
}

.\\!input:disabled::-moz-placeholder, .\\!input[disabled]::-moz-placeholder {
  color: hsl(var(--bc) / var(--tw-placeholder-opacity)) !important;
  --tw-placeholder-opacity: 0.2 !important;
}


  .\\!input:disabled::placeholder,
  .\\!input[disabled]::placeholder {
  color: hsl(var(--bc) / var(--tw-placeholder-opacity)) !important;
  --tw-placeholder-opacity: 0.2 !important;
}

.join > :where(*:not(:first-child)) {
  margin-top: 0px;
  margin-bottom: 0px;
  margin-left: -1px;
}

.join-item:focus {
  isolation: isolate;
}

.link-neutral {
  --tw-text-opacity: 1;
  color: hsl(var(--n) / var(--tw-text-opacity));
}

.\\!link:focus {
  outline: 2px solid transparent !important;
  outline-offset: 2px !important;
}

.link:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.\\!link:focus-visible {
  outline: 2px solid currentColor !important;
  outline-offset: 2px !important;
}

.link:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

.loading {
  pointer-events: none;
  display: inline-block;
  aspect-ratio: 1 / 1;
  width: 1.5rem;
  background-color: currentColor;
  -webkit-mask-size: 100%;
          mask-size: 100%;
  -webkit-mask-repeat: no-repeat;
          mask-repeat: no-repeat;
  -webkit-mask-position: center;
          mask-position: center;
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg width='24' height='24' stroke='%23000' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cstyle%3E.spinner_V8m1%7Btransform-origin:center;animation:spinner_zKoa 2s linear infinite%7D.spinner_V8m1 circle%7Bstroke-linecap:round;animation:spinner_YpZS 1.5s ease-out infinite%7D%40keyframes spinner_zKoa%7B100%25%7Btransform:rotate(360deg)%7D%7D%40keyframes spinner_YpZS%7B0%25%7Bstroke-dasharray:0 150;stroke-dashoffset:0%7D47.5%25%7Bstroke-dasharray:42 150;stroke-dashoffset:-16%7D95%25%2C100%25%7Bstroke-dasharray:42 150;stroke-dashoffset:-59%7D%7D%3C%2Fstyle%3E%3Cg class='spinner_V8m1'%3E%3Ccircle cx='12' cy='12' r='9.5' fill='none' stroke-width='3'%3E%3C%2Fcircle%3E%3C%2Fg%3E%3C%2Fsvg%3E");
          mask-image: url("data:image/svg+xml,%3Csvg width='24' height='24' stroke='%23000' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cstyle%3E.spinner_V8m1%7Btransform-origin:center;animation:spinner_zKoa 2s linear infinite%7D.spinner_V8m1 circle%7Bstroke-linecap:round;animation:spinner_YpZS 1.5s ease-out infinite%7D%40keyframes spinner_zKoa%7B100%25%7Btransform:rotate(360deg)%7D%7D%40keyframes spinner_YpZS%7B0%25%7Bstroke-dasharray:0 150;stroke-dashoffset:0%7D47.5%25%7Bstroke-dasharray:42 150;stroke-dashoffset:-16%7D95%25%2C100%25%7Bstroke-dasharray:42 150;stroke-dashoffset:-59%7D%7D%3C%2Fstyle%3E%3Cg class='spinner_V8m1'%3E%3Ccircle cx='12' cy='12' r='9.5' fill='none' stroke-width='3'%3E%3C%2Fcircle%3E%3C%2Fg%3E%3C%2Fsvg%3E");
}

.loading-spinner {
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg width='24' height='24' stroke='%23000' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cstyle%3E.spinner_V8m1%7Btransform-origin:center;animation:spinner_zKoa 2s linear infinite%7D.spinner_V8m1 circle%7Bstroke-linecap:round;animation:spinner_YpZS 1.5s ease-out infinite%7D%40keyframes spinner_zKoa%7B100%25%7Btransform:rotate(360deg)%7D%7D%40keyframes spinner_YpZS%7B0%25%7Bstroke-dasharray:0 150;stroke-dashoffset:0%7D47.5%25%7Bstroke-dasharray:42 150;stroke-dashoffset:-16%7D95%25%2C100%25%7Bstroke-dasharray:42 150;stroke-dashoffset:-59%7D%7D%3C%2Fstyle%3E%3Cg class='spinner_V8m1'%3E%3Ccircle cx='12' cy='12' r='9.5' fill='none' stroke-width='3'%3E%3C%2Fcircle%3E%3C%2Fg%3E%3C%2Fsvg%3E");
          mask-image: url("data:image/svg+xml,%3Csvg width='24' height='24' stroke='%23000' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cstyle%3E.spinner_V8m1%7Btransform-origin:center;animation:spinner_zKoa 2s linear infinite%7D.spinner_V8m1 circle%7Bstroke-linecap:round;animation:spinner_YpZS 1.5s ease-out infinite%7D%40keyframes spinner_zKoa%7B100%25%7Btransform:rotate(360deg)%7D%7D%40keyframes spinner_YpZS%7B0%25%7Bstroke-dasharray:0 150;stroke-dashoffset:0%7D47.5%25%7Bstroke-dasharray:42 150;stroke-dashoffset:-16%7D95%25%2C100%25%7Bstroke-dasharray:42 150;stroke-dashoffset:-59%7D%7D%3C%2Fstyle%3E%3Cg class='spinner_V8m1'%3E%3Ccircle cx='12' cy='12' r='9.5' fill='none' stroke-width='3'%3E%3C%2Fcircle%3E%3C%2Fg%3E%3C%2Fsvg%3E");
}

.loading-lg {
  width: 2.5rem;
}

:where(.menu li:empty) {
  background-color: hsl(var(--bc) / 0.1);
  margin: 0.5rem 1rem;
  height: 1px;
}

.menu :where(li ul):before {
  position: absolute;
  bottom: 0.75rem;
  left: 0px;
  top: 0.75rem;
  width: 1px;
  background-color: hsl(var(--bc) / 0.1);
  content: "";
}

.menu :where(li:not(.menu-title) > *:not(ul):not(details):not(.menu-title)),
.menu :where(li:not(.menu-title) > details > summary:not(.menu-title)) {
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  text-align: left;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-backdrop-filter;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
  transition-duration: 200ms;
  border-radius: var(--rounded-btn, 0.5rem);
  text-wrap: balance;
}

:where(.menu li:not(.menu-title):not(.disabled) > *:not(ul):not(details):not(.menu-title)):not(summary):not(.active).focus,
  :where(.menu li:not(.menu-title):not(.disabled) > *:not(ul):not(details):not(.menu-title)):not(summary):not(.active):focus,
  :where(.menu li:not(.menu-title):not(.disabled) > *:not(ul):not(details):not(.menu-title)):is(summary):not(.active):focus-visible,
  :where(.menu li:not(.menu-title):not(.disabled) > details > summary:not(.menu-title)):not(summary):not(.active).focus,
  :where(.menu li:not(.menu-title):not(.disabled) > details > summary:not(.menu-title)):not(summary):not(.active):focus,
  :where(.menu li:not(.menu-title):not(.disabled) > details > summary:not(.menu-title)):is(summary):not(.active):focus-visible {
  cursor: pointer;
  background-color: hsl(var(--bc) / 0.1);
  --tw-text-opacity: 1;
  color: hsl(var(--bc) / var(--tw-text-opacity));
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.menu li > *:not(ul):not(.menu-title):not(details):active,
.menu li > *:not(ul):not(.menu-title):not(details).active,
.menu li > details > summary:active {
  --tw-bg-opacity: 1;
  background-color: hsl(var(--n) / var(--tw-bg-opacity));
  --tw-text-opacity: 1;
  color: hsl(var(--nc) / var(--tw-text-opacity));
}

.menu :where(li > details > summary)::-webkit-details-marker {
  display: none;
}

.menu :where(li > details > summary):after,
.menu :where(li > .menu-dropdown-toggle):after {
  justify-self: end;
  display: block;
  margin-top: -0.5rem;
  height: 0.5rem;
  width: 0.5rem;
  transform: rotate(45deg);
  transition-property: transform, margin-top;
  transition-duration: 0.3s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  content: "";
  transform-origin: 75% 75%;
  box-shadow: 2px 2px;
  pointer-events: none;
}

.menu :where(li > details[open] > summary):after,
.menu :where(li > .menu-dropdown-toggle.menu-dropdown-show):after {
  transform: rotate(225deg);
  margin-top: 0;
}

.mockup-phone .display {
  overflow: hidden;
  border-radius: 40px;
  margin-top: -25px;
}

.mockup-browser .mockup-browser-toolbar .\\!input {
  position: relative !important;
  margin-left: auto !important;
  margin-right: auto !important;
  display: block !important;
  height: 1.75rem !important;
  width: 24rem !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
  --tw-bg-opacity: 1 !important;
  background-color: hsl(var(--b2) / var(--tw-bg-opacity)) !important;
  padding-left: 2rem !important;
}

.mockup-browser .mockup-browser-toolbar .input {
  position: relative;
  margin-left: auto;
  margin-right: auto;
  display: block;
  height: 1.75rem;
  width: 24rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  --tw-bg-opacity: 1;
  background-color: hsl(var(--b2) / var(--tw-bg-opacity));
  padding-left: 2rem;
}

.mockup-browser .mockup-browser-toolbar .\\!input:before {
  content: "" !important;
  position: absolute !important;
  left: 0.5rem !important;
  top: 50% !important;
  aspect-ratio: 1 / 1 !important;
  height: 0.75rem !important;
  --tw-translate-y: -50% !important;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) !important;
  border-radius: 9999px !important;
  border-width: 2px !important;
  border-color: currentColor !important;
  opacity: 0.6 !important;
}

.mockup-browser .mockup-browser-toolbar .input:before {
  content: "";
  position: absolute;
  left: 0.5rem;
  top: 50%;
  aspect-ratio: 1 / 1;
  height: 0.75rem;
  --tw-translate-y: -50%;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
  border-radius: 9999px;
  border-width: 2px;
  border-color: currentColor;
  opacity: 0.6;
}

.mockup-browser .mockup-browser-toolbar .\\!input:after {
  content: "" !important;
  position: absolute !important;
  left: 1.25rem !important;
  top: 50% !important;
  height: 0.5rem !important;
  --tw-translate-y: 25% !important;
  --tw-rotate: -45deg !important;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) !important;
  border-radius: 9999px !important;
  border-width: 1px !important;
  border-color: currentColor !important;
  opacity: 0.6 !important;
}

.mockup-browser .mockup-browser-toolbar .input:after {
  content: "";
  position: absolute;
  left: 1.25rem;
  top: 50%;
  height: 0.5rem;
  --tw-translate-y: 25%;
  --tw-rotate: -45deg;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
  border-radius: 9999px;
  border-width: 1px;
  border-color: currentColor;
  opacity: 0.6;
}

.modal:not(dialog:not(.modal-open)),
  .modal::backdrop {
  background-color: rgba(0, 0, 0, 0.3);
  animation: modal-pop 0.2s ease-out;
}

.modal-open .modal-box,
.modal-toggle:checked + .modal .modal-box,
.modal:target .modal-box,
.modal[open] .modal-box {
  --tw-translate-y: 0px;
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.modal-action > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 0;
  margin-right: calc(0.5rem * var(--tw-space-x-reverse));
  margin-left: calc(0.5rem * calc(1 - var(--tw-space-x-reverse)));
}

@keyframes modal-pop {
  0% {
    opacity: 0;
  }
}

@keyframes progress-loading {
  50% {
    background-position-x: -115%;
  }
}

.radio:focus-visible {
  outline-style: solid;
  outline-width: 2px;
  outline-offset: 2px;
  outline-color: hsl(var(--bc) / 1);
}

.radio:checked,
  .radio[aria-checked="true"] {
  --tw-bg-opacity: 1;
  background-color: hsl(var(--bc) / var(--tw-bg-opacity));
  animation: radiomark var(--animation-input, 0.2s) ease-out;
  box-shadow: 0 0 0 4px hsl(var(--b1)) inset,
      0 0 0 4px hsl(var(--b1)) inset;
}

.radio:disabled {
  cursor: not-allowed;
  opacity: 0.2;
}

@keyframes radiomark {
  0% {
    box-shadow: 0 0 0 12px hsl(var(--b1)) inset,
      0 0 0 12px hsl(var(--b1)) inset;
  }

  50% {
    box-shadow: 0 0 0 3px hsl(var(--b1)) inset,
      0 0 0 3px hsl(var(--b1)) inset;
  }

  100% {
    box-shadow: 0 0 0 4px hsl(var(--b1)) inset,
      0 0 0 4px hsl(var(--b1)) inset;
  }
}

.range:focus-visible::-webkit-slider-thumb {
  --focus-shadow: 0 0 0 6px hsl(var(--b1)) inset, 0 0 0 2rem hsl(var(--range-shdw)) inset;
}

.range:focus-visible::-moz-range-thumb {
  --focus-shadow: 0 0 0 6px hsl(var(--b1)) inset, 0 0 0 2rem hsl(var(--range-shdw)) inset;
}

.range::-webkit-slider-runnable-track {
  height: 0.5rem;
  width: 100%;
  background-color: hsl(var(--bc) / 0.1);
  border-radius: var(--rounded-box, 1rem);
}

.range::-moz-range-track {
  height: 0.5rem;
  width: 100%;
  background-color: hsl(var(--bc) / 0.1);
  border-radius: var(--rounded-box, 1rem);
}

.range::-webkit-slider-thumb {
  position: relative;
  height: 1.5rem;
  width: 1.5rem;
  border-style: none;
  --tw-bg-opacity: 1;
  background-color: hsl(var(--b1) / var(--tw-bg-opacity));
  border-radius: var(--rounded-box, 1rem);
  appearance: none;
  -webkit-appearance: none;
  top: 50%;
  color: hsl(var(--range-shdw));
  transform: translateY(-50%);
  --filler-size: 100rem;
  --filler-offset: 0.6rem;
  box-shadow: 0 0 0 3px hsl(var(--range-shdw)) inset,
      var(--focus-shadow, 0 0),
      calc(var(--filler-size) * -1 - var(--filler-offset)) 0 0 var(--filler-size);
}

.range::-moz-range-thumb {
  position: relative;
  height: 1.5rem;
  width: 1.5rem;
  border-style: none;
  --tw-bg-opacity: 1;
  background-color: hsl(var(--b1) / var(--tw-bg-opacity));
  border-radius: var(--rounded-box, 1rem);
  top: 50%;
  color: hsl(var(--range-shdw));
  --filler-size: 100rem;
  --filler-offset: 0.5rem;
  box-shadow: 0 0 0 3px hsl(var(--range-shdw)) inset,
      var(--focus-shadow, 0 0),
      calc(var(--filler-size) * -1 - var(--filler-offset)) 0 0 var(--filler-size);
}

@keyframes rating-pop {
  0% {
    transform: translateY(-0.125em);
  }

  40% {
    transform: translateY(-0.125em);
  }

  100% {
    transform: translateY(0);
  }
}

.select-bordered {
  --tw-border-opacity: 0.2;
}

.select:focus {
  outline-style: solid;
  outline-width: 2px;
  outline-offset: 2px;
  outline-color: hsl(var(--bc) / 0.2);
}

.select-disabled,
  .select:disabled,
  .select[disabled] {
  cursor: not-allowed;
  --tw-border-opacity: 1;
  border-color: hsl(var(--b2) / var(--tw-border-opacity));
  --tw-bg-opacity: 1;
  background-color: hsl(var(--b2) / var(--tw-bg-opacity));
  --tw-text-opacity: 0.2;
}

.select-disabled::-moz-placeholder, .select:disabled::-moz-placeholder, .select[disabled]::-moz-placeholder {
  color: hsl(var(--bc) / var(--tw-placeholder-opacity));
  --tw-placeholder-opacity: 0.2;
}

.select-disabled::placeholder,
  .select:disabled::placeholder,
  .select[disabled]::placeholder {
  color: hsl(var(--bc) / var(--tw-placeholder-opacity));
  --tw-placeholder-opacity: 0.2;
}

.select-multiple,
  .select[multiple],
  .select[size].select:not([size="1"]) {
  background-image: none;
  padding-right: 1rem;
}

[dir="rtl"] .select {
  background-position: calc(0% + 12px) calc(1px + 50%),
    calc(0% + 16px) calc(1px + 50%);
}

.steps .step:before {
  top: 0px;
  grid-column-start: 1;
  grid-row-start: 1;
  height: 0.5rem;
  width: 100%;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
  --tw-bg-opacity: 1;
  background-color: hsl(var(--b3) / var(--tw-bg-opacity));
  --tw-text-opacity: 1;
  color: hsl(var(--bc) / var(--tw-text-opacity));
  content: "";
  margin-left: -100%;
}

.steps .step:after {
  content: counter(step);
  counter-increment: step;
  z-index: 1;
  position: relative;
  grid-column-start: 1;
  grid-row-start: 1;
  display: grid;
  height: 2rem;
  width: 2rem;
  place-items: center;
  place-self: center;
  border-radius: 9999px;
  --tw-bg-opacity: 1;
  background-color: hsl(var(--b3) / var(--tw-bg-opacity));
  --tw-text-opacity: 1;
  color: hsl(var(--bc) / var(--tw-text-opacity));
}

.steps .step:first-child:before {
  content: none;
}

.steps .step[data-content]:after {
  content: attr(data-content);
}

.\\!tab.tab-active:not(.tab-disabled):not([disabled]) {
  border-color: hsl(var(--bc) / var(--tw-border-opacity)) !important;
  --tw-border-opacity: 1 !important;
  --tw-text-opacity: 1 !important;
}

.tab.tab-active:not(.tab-disabled):not([disabled]) {
  border-color: hsl(var(--bc) / var(--tw-border-opacity));
  --tw-border-opacity: 1;
  --tw-text-opacity: 1;
}

.\\!tab:focus {
  outline: 2px solid transparent !important;
  outline-offset: 2px !important;
}

.tab:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.\\!tab:focus-visible {
  outline: 2px solid currentColor !important;
  outline-offset: -3px !important;
}

.tab:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: -3px;
}

.\\!tab:focus-visible.tab-lifted {
  border-bottom-right-radius: var(--tab-radius, 0.5rem) !important;
  border-bottom-left-radius: var(--tab-radius, 0.5rem) !important;
}

.tab:focus-visible.tab-lifted {
  border-bottom-right-radius: var(--tab-radius, 0.5rem);
  border-bottom-left-radius: var(--tab-radius, 0.5rem);
}


  .\\!tab[disabled] {
  cursor: not-allowed !important;
  color: hsl(var(--bc) / var(--tw-text-opacity)) !important;
  --tw-text-opacity: 0.2 !important;
}

.tab-disabled,
  .tab[disabled] {
  cursor: not-allowed;
  color: hsl(var(--bc) / var(--tw-text-opacity));
  --tw-text-opacity: 0.2;
}

.tab-bordered {
  border-color: hsl(var(--bc) / var(--tw-border-opacity));
  --tw-border-opacity: 0.2;
  border-style: solid;
  border-bottom-width: calc(var(--tab-border, 1px) + 1px);
}

.tab-lifted.tab-active:not(.tab-disabled):not([disabled]) {
  background-color: var(--tab-bg);
  border-width: var(--tab-border, 1px) var(--tab-border, 1px) 0 var(--tab-border, 1px);
  border-left-color: var(--tab-border-color);
  border-right-color: var(--tab-border-color);
  border-top-color: var(--tab-border-color);
  padding-left: calc(var(--tab-padding, 1rem) - var(--tab-border, 1px));
  padding-right: calc(var(--tab-padding, 1rem) - var(--tab-border, 1px));
  padding-bottom: var(--tab-border, 1px);
  padding-top: 0;
}

.tab-lifted.tab-active:not(.tab-disabled):not([disabled]):before,
    .tab-lifted.tab-active:not(.tab-disabled):not([disabled]):after {
  z-index: 1;
  content: "";
  display: block;
  position: absolute;
  width: var(--tab-radius, 0.5rem);
  height: var(--tab-radius, 0.5rem);
  bottom: 0;
  --tab-grad: calc(68% - var(--tab-border, 1px));
  --tab-corner-bg: radial-gradient(
        circle at var(--circle-pos),
        transparent var(--tab-grad),
        var(--tab-border-color) calc(var(--tab-grad) + 0.3px),
        var(--tab-border-color) calc(var(--tab-grad) + var(--tab-border, 1px)),
        var(--tab-bg) calc(var(--tab-grad) + var(--tab-border, 1px) + 0.3px)
      );
}

.tab-lifted.tab-active:not(.tab-disabled):not([disabled]):before {
  left: calc(var(--tab-radius, 0.5rem) * -1);
  --circle-pos: top left;
  background-image: var(--tab-corner-bg);
}

[dir="rtl"] .tab-lifted.tab-active:not(.tab-disabled):not([disabled]):before {
  --circle-pos: top right;
}

.tab-lifted.tab-active:not(.tab-disabled):not([disabled]):after {
  right: calc(var(--tab-radius, 0.5rem) * -1);
  --circle-pos: top right;
  background-image: var(--tab-corner-bg);
}

[dir="rtl"] .tab-lifted.tab-active:not(.tab-disabled):not([disabled]):after {
  --circle-pos: top left;
}

.tab-lifted.tab-active:not(.tab-disabled):not([disabled]):first-child:before {
  background: none;
}

.tab-lifted.tab-active:not(.tab-disabled):not([disabled]):last-child:after {
  background: none;
}

.tab-lifted.tab-active:not(.tab-disabled):not([disabled])
  + .tab-lifted.tab-active:not(.tab-disabled):not([disabled]):before {
  background: none;
}

.tabs-boxed .\\!tab {
  border-radius: var(--rounded-btn, 0.5rem) !important;
}

.tabs-boxed .tab {
  border-radius: var(--rounded-btn, 0.5rem);
}

.tabs-boxed .tab-active:not(.tab-disabled):not([disabled]) {
  --tw-bg-opacity: 1;
  background-color: hsl(var(--p) / var(--tw-bg-opacity));
  --tw-text-opacity: 1;
  color: hsl(var(--pc) / var(--tw-text-opacity));
}

.table :where(th, td) {
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  vertical-align: middle;
}

.table tr.active,
  .table tr.active:nth-child(even),
  .table-zebra tbody tr:nth-child(even) {
  --tw-bg-opacity: 1;
  background-color: hsl(var(--b2) / var(--tw-bg-opacity));
}

.table-zebra tr.active,
    .table-zebra tr.active:nth-child(even),
    .table-zebra-zebra tbody tr:nth-child(even) {
  --tw-bg-opacity: 1;
  background-color: hsl(var(--b3) / var(--tw-bg-opacity));
}

.table :where(thead, tbody) :where(tr:not(:last-child)),
    .table :where(thead, tbody) :where(tr:first-child:last-child) {
  border-bottom-width: 1px;
  --tw-border-opacity: 1;
  border-bottom-color: hsl(var(--b2) / var(--tw-border-opacity));
}

.table :where(thead, tfoot) {
  white-space: nowrap;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 700;
  color: hsl(var(--bc) / 0.6);
}

.textarea:focus {
  outline-style: solid;
  outline-width: 2px;
  outline-offset: 2px;
  outline-color: hsl(var(--bc) / 0.2);
}

.textarea-disabled,
  .textarea:disabled,
  .textarea[disabled] {
  cursor: not-allowed;
  --tw-border-opacity: 1;
  border-color: hsl(var(--b2) / var(--tw-border-opacity));
  --tw-bg-opacity: 1;
  background-color: hsl(var(--b2) / var(--tw-bg-opacity));
  --tw-text-opacity: 0.2;
}

.textarea-disabled::-moz-placeholder, .textarea:disabled::-moz-placeholder, .textarea[disabled]::-moz-placeholder {
  color: hsl(var(--bc) / var(--tw-placeholder-opacity));
  --tw-placeholder-opacity: 0.2;
}

.textarea-disabled::placeholder,
  .textarea:disabled::placeholder,
  .textarea[disabled]::placeholder {
  color: hsl(var(--bc) / var(--tw-placeholder-opacity));
  --tw-placeholder-opacity: 0.2;
}

.toast > * {
  animation: toast-pop 0.25s ease-out;
}

@keyframes toast-pop {
  0% {
    transform: scale(0.9);
    opacity: 0;
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}

[dir="rtl"] .toggle {
  --handleoffsetcalculator: calc(var(--handleoffset) * 1);
}

.toggle:focus-visible {
  outline-style: solid;
  outline-width: 2px;
  outline-offset: 2px;
  outline-color: hsl(var(--bc) / 0.2);
}

.toggle:checked,
  .toggle[checked="true"],
  .toggle[aria-checked="true"] {
  --handleoffsetcalculator: var(--handleoffset);
  --tw-border-opacity: 1;
  --tw-bg-opacity: 1;
}

[dir="rtl"] .toggle:checked, [dir="rtl"] .toggle[checked="true"], [dir="rtl"] .toggle[aria-checked="true"] {
  --handleoffsetcalculator: calc(var(--handleoffset) * -1);
}

.toggle:indeterminate {
  --tw-border-opacity: 1;
  --tw-bg-opacity: 1;
  box-shadow: calc(var(--handleoffset) / 2) 0 0 2px var(--tglbg) inset,
      calc(var(--handleoffset) / -2) 0 0 2px var(--tglbg) inset,
      0 0 0 2px var(--tglbg) inset;
}

[dir="rtl"] .toggle:indeterminate {
  box-shadow: calc(var(--handleoffset) / 2) 0 0 2px var(--tglbg) inset,
        calc(var(--handleoffset) / -2) 0 0 2px var(--tglbg) inset,
        0 0 0 2px var(--tglbg) inset;
}

.toggle:disabled {
  cursor: not-allowed;
  --tw-border-opacity: 1;
  border-color: hsl(var(--bc) / var(--tw-border-opacity));
  background-color: transparent;
  opacity: 0.3;
  --togglehandleborder: 0 0 0 3px hsl(var(--bc)) inset,
      var(--handleoffsetcalculator) 0 0 3px hsl(var(--bc)) inset;
}

:host .prose {
  --tw-prose-body: hsl(var(--bc) / 0.8);
  --tw-prose-headings: hsl(var(--bc));
  --tw-prose-lead: hsl(var(--bc));
  --tw-prose-links: hsl(var(--bc));
  --tw-prose-bold: hsl(var(--bc));
  --tw-prose-counters: hsl(var(--bc));
  --tw-prose-bullets: hsl(var(--bc) / 0.5);
  --tw-prose-hr: hsl(var(--bc) / 0.2);
  --tw-prose-quotes: hsl(var(--bc));
  --tw-prose-quote-borders: hsl(var(--bc) / 0.2);
  --tw-prose-captions: hsl(var(--bc) / 0.5);
  --tw-prose-code: hsl(var(--bc));
  --tw-prose-pre-code: hsl(var(--nc));
  --tw-prose-pre-bg: hsl(var(--n));
  --tw-prose-th-borders: hsl(var(--bc) / 0.5);
  --tw-prose-td-borders: hsl(var(--bc) / 0.2);
}

.prose :where(code):not(:where([class~="not-prose"] *)) {
  padding: 2px 8px;
  border-radius: var(--rounded-badge);
}

.prose code:after,
  .prose code:before {
  content: none;
}

.prose pre code {
  border-radius: 0;
  padding: 0;
}

.prose :where(tbody tr, thead):not(:where([class~="not-prose"] *)) {
  border-bottom-color: hsl(var(--bc) / 20%);
}

.rounded-box {
  border-radius: var(--rounded-box, 1rem);
}

.min-h-12 {
  min-height: 3rem;
}

.btm-nav-xs > *:where(.active) {
  border-top-width: 1px;
}

.btm-nav-sm > *:where(.active) {
  border-top-width: 2px;
}

.btm-nav-md > *:where(.active) {
  border-top-width: 2px;
}

.btm-nav-lg > *:where(.active) {
  border-top-width: 4px;
}

.btn-sm {
  height: 2rem;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  min-height: 2rem;
  font-size: 0.875rem;
}

.btn-square:where(.btn-xs) {
  height: 1.5rem;
  width: 1.5rem;
  padding: 0px;
}

.btn-square:where(.btn-sm) {
  height: 2rem;
  width: 2rem;
  padding: 0px;
}

.btn-square:where(.btn-md) {
  height: 3rem;
  width: 3rem;
  padding: 0px;
}

.btn-square:where(.btn-lg) {
  height: 4rem;
  width: 4rem;
  padding: 0px;
}

.btn-circle:where(.btn-xs) {
  height: 1.5rem;
  width: 1.5rem;
  border-radius: 9999px;
  padding: 0px;
}

.btn-circle:where(.btn-sm) {
  height: 2rem;
  width: 2rem;
  border-radius: 9999px;
  padding: 0px;
}

.btn-circle:where(.btn-md) {
  height: 3rem;
  width: 3rem;
  border-radius: 9999px;
  padding: 0px;
}

.btn-circle:where(.btn-lg) {
  height: 4rem;
  width: 4rem;
  border-radius: 9999px;
  padding: 0px;
}

.input-sm {
  height: 2rem;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  font-size: 0.875rem;
  line-height: 2rem;
}

.join.join-vertical {
  flex-direction: column;
}

.join.join-vertical .join-item:first-child:not(:last-child),
  .join.join-vertical *:first-child:not(:last-child) .join-item {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
}

.join.join-vertical .join-item:last-child:not(:first-child),
  .join.join-vertical *:last-child:not(:first-child) .join-item {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-bottom-left-radius: inherit;
  border-bottom-right-radius: inherit;
}

.join.join-horizontal {
  flex-direction: row;
}

.join.join-horizontal .join-item:first-child:not(:last-child),
  .join.join-horizontal *:first-child:not(:last-child) .join-item {
  border-bottom-right-radius: 0;
  border-top-right-radius: 0;
  border-bottom-left-radius: inherit;
  border-top-left-radius: inherit;
}

.join.join-horizontal .join-item:last-child:not(:first-child),
  .join.join-horizontal *:last-child:not(:first-child) .join-item {
  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
  border-bottom-right-radius: inherit;
  border-top-right-radius: inherit;
}

.kbd-md {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  font-size: 1rem;
  line-height: 1.5rem;
  min-height: 2.2em;
  min-width: 2.2em;
}

.menu-horizontal {
  display: inline-flex;
  flex-direction: row;
}

.menu-horizontal > li:not(.menu-title) > details > ul {
  position: absolute;
}

.modal-bottom {
  place-items: end;
}

.steps-horizontal .step {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  grid-template-rows: repeat(2, minmax(0, 1fr));
  place-items: center;
  text-align: center;
}

.steps-vertical .step {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-template-rows: repeat(1, minmax(0, 1fr));
}

.tab-lg {
  height: 3rem;
  font-size: 1.125rem;
  line-height: 1.75rem;
  line-height: 2;
  --tab-padding: 1.25rem;
}

:where(.toast) {
  bottom: 0px;
  left: auto;
  right: 0px;
  top: auto;
  --tw-translate-x: 0px;
  --tw-translate-y: 0px;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.toast:where(.toast-start) {
  left: 0px;
  right: auto;
  --tw-translate-x: 0px;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.toast:where(.toast-center) {
  left: 50%;
  right: 50%;
  --tw-translate-x: -50%;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.toast:where(.toast-end) {
  left: auto;
  right: 0px;
  --tw-translate-x: 0px;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.toast:where(.toast-bottom) {
  bottom: 0px;
  top: auto;
  --tw-translate-y: 0px;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.toast:where(.toast-middle) {
  bottom: auto;
  top: 50%;
  --tw-translate-y: -50%;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.toast:where(.toast-top) {
  bottom: auto;
  top: 0px;
  --tw-translate-y: 0px;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.tooltip {
  position: relative;
  display: inline-block;
  --tooltip-offset: calc(100% + 1px + var(--tooltip-tail, 0px));
}

.tooltip:before {
  position: absolute;
  pointer-events: none;
  z-index: 1;
  content: var(--tw-content);
  --tw-content: attr(data-tip);
}

.tooltip:before, .tooltip-top:before {
  transform: translateX(-50%);
  top: auto;
  left: 50%;
  right: auto;
  bottom: var(--tooltip-offset);
}

.btn-group .btn:not(:first-child):not(:last-child) {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.btn-group .btn:first-child:not(:last-child) {
  margin-left: -1px;
  margin-top: -0px;
  border-top-left-radius: var(--rounded-btn, 0.5rem);
  border-top-right-radius: 0;
  border-bottom-left-radius: var(--rounded-btn, 0.5rem);
  border-bottom-right-radius: 0;
}

.btn-group .btn:last-child:not(:first-child) {
  border-top-left-radius: 0;
  border-top-right-radius: var(--rounded-btn, 0.5rem);
  border-bottom-left-radius: 0;
  border-bottom-right-radius: var(--rounded-btn, 0.5rem);
}

.btn-group-horizontal .btn:not(:first-child):not(:last-child) {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.btn-group-horizontal .btn:first-child:not(:last-child) {
  margin-left: -1px;
  margin-top: -0px;
  border-top-left-radius: var(--rounded-btn, 0.5rem);
  border-top-right-radius: 0;
  border-bottom-left-radius: var(--rounded-btn, 0.5rem);
  border-bottom-right-radius: 0;
}

.btn-group-horizontal .btn:last-child:not(:first-child) {
  border-top-left-radius: 0;
  border-top-right-radius: var(--rounded-btn, 0.5rem);
  border-bottom-left-radius: 0;
  border-bottom-right-radius: var(--rounded-btn, 0.5rem);
}

.btn-group-vertical .btn:first-child:not(:last-child) {
  margin-left: -0px;
  margin-top: -1px;
  border-top-left-radius: var(--rounded-btn, 0.5rem);
  border-top-right-radius: var(--rounded-btn, 0.5rem);
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.btn-group-vertical .btn:last-child:not(:first-child) {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-bottom-left-radius: var(--rounded-btn, 0.5rem);
  border-bottom-right-radius: var(--rounded-btn, 0.5rem);
}

.card-compact .card-body {
  padding: 1rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.card-compact .card-title {
  margin-bottom: 0.25rem;
}

.card-normal .card-body {
  padding: var(--padding-card, 2rem);
  font-size: 1rem;
  line-height: 1.5rem;
}

.card-normal .card-title {
  margin-bottom: 0.75rem;
}

.join.join-vertical > :where(*:not(:first-child)) {
  margin-left: 0px;
  margin-right: 0px;
  margin-top: -1px;
}

.join.join-horizontal > :where(*:not(:first-child)) {
  margin-top: 0px;
  margin-bottom: 0px;
  margin-left: -1px;
}

.menu-horizontal > li:not(.menu-title) > details > ul {
  margin-left: 0px;
  margin-top: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-right: 0.5rem;
}

.menu-horizontal > li > details > ul:before {
  content: none;
}

:where(.menu-horizontal > li:not(.menu-title) > details > ul) {
  --tw-bg-opacity: 1;
  background-color: hsl(var(--b1) / var(--tw-bg-opacity));
  --tw-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 20px 25px -5px var(--tw-shadow-color), 0 8px 10px -6px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
  border-radius: var(--rounded-box, 1rem);
}

.menu-sm :where(li:not(.menu-title) > *:not(ul):not(details):not(.menu-title)),
  .menu-sm :where(li:not(.menu-title) > details > summary:not(.menu-title)) {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  border-radius: var(--rounded-btn, 0.5rem);
}

.menu-sm .menu-title {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.modal-top :where(.modal-box) {
  width: 100%;
  max-width: none;
  --tw-translate-y: -2.5rem;
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-left-radius: var(--rounded-box, 1rem);
  border-bottom-right-radius: var(--rounded-box, 1rem);
}

.modal-middle :where(.modal-box) {
  width: 91.666667%;
  max-width: 32rem;
  --tw-translate-y: 0px;
  --tw-scale-x: .9;
  --tw-scale-y: .9;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
  border-top-left-radius: var(--rounded-box, 1rem);
  border-top-right-radius: var(--rounded-box, 1rem);
  border-bottom-left-radius: var(--rounded-box, 1rem);
  border-bottom-right-radius: var(--rounded-box, 1rem);
}

.modal-bottom :where(.modal-box) {
  width: 100%;
  max-width: none;
  --tw-translate-y: 2.5rem;
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  border-top-left-radius: var(--rounded-box, 1rem);
  border-top-right-radius: var(--rounded-box, 1rem);
}

.steps-horizontal .step {
  grid-template-rows: 40px 1fr;
  grid-template-columns: auto;
  min-width: 4rem;
}

.steps-horizontal .step:before {
  height: 0.5rem;
  width: 100%;
  --tw-translate-x: 0px;
  --tw-translate-y: 0px;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
  content: "";
  margin-left: -100%;
}

.steps-vertical .step {
  gap: 0.5rem;
  grid-template-columns: 40px 1fr;
  grid-template-rows: auto;
  min-height: 4rem;
  justify-items: start;
}

.steps-vertical .step:before {
  height: 100%;
  width: 0.5rem;
  --tw-translate-x: -50%;
  --tw-translate-y: -50%;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
  margin-left: 50%;
}

[dir="rtl"] .steps-vertical .step:before {
  margin-right: auto;
}

.table-xs :not(thead):not(tfoot) tr {
  font-size: 0.75rem;
  line-height: 1rem;
}

.table-xs :where(th, td) {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}

.table-lg :not(thead):not(tfoot) tr {
  font-size: 1rem;
  line-height: 1.5rem;
}

.table-lg :where(th, td) {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
}

.tooltip {
  position: relative;
  display: inline-block;
  text-align: center;
  --tooltip-tail: 0.1875rem;
  --tooltip-color: hsl(var(--n));
  --tooltip-text-color: hsl(var(--nc));
  --tooltip-tail-offset: calc(100% + 0.0625rem - var(--tooltip-tail));
}

.tooltip:before,
.tooltip:after {
  opacity: 0;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-backdrop-filter;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-backdrop-filter;
  transition-delay: 100ms;
  transition-duration: 200ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.tooltip:after {
  position: absolute;
  content: "";
  border-style: solid;
  border-width: var(--tooltip-tail, 0);
  width: 0;
  height: 0;
  display: block;
}

.tooltip:before {
  max-width: 20rem;
  border-radius: 0.25rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  background-color: var(--tooltip-color);
  color: var(--tooltip-text-color);
  width: -moz-max-content;
  width: max-content;
}

.tooltip.tooltip-open:before,
.tooltip.tooltip-open:after,
.tooltip:hover:before,
.tooltip:hover:after {
  opacity: 1;
  transition-delay: 75ms;
}

.tooltip:has(:focus-visible):after,
.tooltip:has(:focus-visible):before {
  opacity: 1;
  transition-delay: 75ms;
}

.tooltip:not([data-tip]):hover:before,
.tooltip:not([data-tip]):hover:after {
  visibility: hidden;
  opacity: 0;
}

.tooltip:after, .tooltip-top:after {
  transform: translateX(-50%);
  border-color: var(--tooltip-color) transparent transparent transparent;
  top: auto;
  left: 50%;
  right: auto;
  bottom: var(--tooltip-tail-offset);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.pointer-events-none {
  pointer-events: none;
}

.visible {
  visibility: visible;
}

.invisible {
  visibility: hidden;
}

.collapse {
  visibility: collapse;
}

.static {
  position: static;
}

.fixed {
  position: fixed;
}

.absolute {
  position: absolute;
}

.relative {
  position: relative;
}

.sticky {
  position: sticky;
}

.inset-y-0 {
  top: 0px;
  bottom: 0px;
}

.bottom-0 {
  bottom: 0px;
}

.bottom-4 {
  bottom: 1rem;
}

.left-0 {
  left: 0px;
}

.right-0 {
  right: 0px;
}

.right-2 {
  right: 0.5rem;
}

.right-4 {
  right: 1rem;
}

.top-0 {
  top: 0px;
}

.top-2 {
  top: 0.5rem;
}

.z-10 {
  z-index: 10;
}

.z-30 {
  z-index: 30;
}

.z-40 {
  z-index: 40;
}

.z-50 {
  z-index: 50;
}

.z-\\[1050\\] {
  z-index: 1050;
}

.m-2 {
  margin: 0.5rem;
}

.m-3 {
  margin: 0.75rem;
}

.m-4 {
  margin: 1rem;
}

.m-auto {
  margin: auto;
}

.mx-1 {
  margin-left: 0.25rem;
  margin-right: 0.25rem;
}

.mx-4 {
  margin-left: 1rem;
  margin-right: 1rem;
}

.mx-8 {
  margin-left: 2rem;
  margin-right: 2rem;
}

.my-4 {
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.mb-0 {
  margin-bottom: 0px;
}

.mb-12 {
  margin-bottom: 3rem;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

.mb-3 {
  margin-bottom: 0.75rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.mb-8 {
  margin-bottom: 2rem;
}

.mr-1 {
  margin-right: 0.25rem;
}

.mr-2 {
  margin-right: 0.5rem;
}

.mr-3 {
  margin-right: 0.75rem;
}

.mr-auto {
  margin-right: auto;
}

.mt-1 {
  margin-top: 0.25rem;
}

.mt-3 {
  margin-top: 0.75rem;
}

.mt-4 {
  margin-top: 1rem;
}

.block {
  display: block;
}

.inline-block {
  display: inline-block;
}

.\\!flex {
  display: flex !important;
}

.flex {
  display: flex;
}

.table {
  display: table;
}

.grid {
  display: grid;
}

.hidden {
  display: none;
}

.aspect-square {
  aspect-ratio: 1 / 1;
}

.aspect-video {
  aspect-ratio: 16 / 9;
}

.h-12 {
  height: 3rem;
}

.h-20 {
  height: 5rem;
}

.h-24 {
  height: 6rem;
}

.h-4 {
  height: 1rem;
}

.h-8 {
  height: 2rem;
}

.h-auto {
  height: auto;
}

.h-full {
  height: 100%;
}

.h-screen {
  height: 100vh;
}

.min-h-\\[1em\\] {
  min-height: 1em;
}

.min-h-fit {
  min-height: -moz-fit-content;
  min-height: fit-content;
}

.w-0 {
  width: 0px;
}

.w-0\\.5 {
  width: 0.125rem;
}

.w-1\\/2 {
  width: 50%;
}

.w-1\\/4 {
  width: 25%;
}

.w-11\\/12 {
  width: 91.666667%;
}

.w-12 {
  width: 3rem;
}

.w-20 {
  width: 5rem;
}

.w-4 {
  width: 1rem;
}

.w-8 {
  width: 2rem;
}

.w-fit {
  width: -moz-fit-content;
  width: fit-content;
}

.w-full {
  width: 100%;
}

.w-max {
  width: -moz-max-content;
  width: max-content;
}

.w-screen {
  width: 100vw;
}

.min-w-min {
  min-width: -moz-min-content;
  min-width: min-content;
}

.max-w-5xl {
  max-width: 64rem;
}

.max-w-max {
  max-width: -moz-max-content;
  max-width: max-content;
}

.max-w-min {
  max-width: -moz-min-content;
  max-width: min-content;
}

.flex-1 {
  flex: 1 1 0%;
}

.flex-auto {
  flex: 1 1 auto;
}

.rotate-45 {
  --tw-rotate: 45deg;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.transform {
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.cursor-pointer {
  cursor: pointer;
}

.resize {
  resize: both;
}

.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

.flex-col {
  flex-direction: column;
}

.flex-wrap {
  flex-wrap: wrap;
}

.content-end {
  align-content: flex-end;
}

.items-center {
  align-items: center;
}

.justify-start {
  justify-content: flex-start;
}

.justify-end {
  justify-content: flex-end;
}

.justify-center {
  justify-content: center;
}

.gap-2 {
  gap: 0.5rem;
}

.gap-3 {
  gap: 0.75rem;
}

.gap-4 {
  gap: 1rem;
}

.self-stretch {
  align-self: stretch;
}

.overflow-x-auto {
  overflow-x: auto;
}

.overflow-y-clip {
  overflow-y: clip;
}

.overflow-y-scroll {
  overflow-y: scroll;
}

.whitespace-nowrap {
  white-space: nowrap;
}

.rounded {
  border-radius: 0.25rem;
}

.rounded-full {
  border-radius: 9999px;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.rounded-md {
  border-radius: 0.375rem;
}

.rounded-none {
  border-radius: 0px;
}

.rounded-xl {
  border-radius: 0.75rem;
}

.rounded-b-xl {
  border-bottom-right-radius: 0.75rem;
  border-bottom-left-radius: 0.75rem;
}

.rounded-t-xl {
  border-top-left-radius: 0.75rem;
  border-top-right-radius: 0.75rem;
}

.rounded-br-none {
  border-bottom-right-radius: 0px;
}

.rounded-tr-none {
  border-top-right-radius: 0px;
}

.border {
  border-width: 1px;
}

.border-2 {
  border-width: 2px;
}

.border-dashed {
  border-style: dashed;
}

.border-none {
  border-style: none;
}

.border-base-300 {
  --tw-border-opacity: 1;
  border-color: hsl(var(--b3) / var(--tw-border-opacity));
}

.border-gray-400 {
  --tw-border-opacity: 1;
  border-color: rgb(156 163 175 / var(--tw-border-opacity));
}

.border-primary {
  --tw-border-opacity: 1;
  border-color: hsl(var(--p) / var(--tw-border-opacity));
}

.border-secondary {
  --tw-border-opacity: 1;
  border-color: hsl(var(--s) / var(--tw-border-opacity));
}

.border-transparent {
  border-color: transparent;
}

.bg-base-100 {
  --tw-bg-opacity: 1;
  background-color: hsl(var(--b1) / var(--tw-bg-opacity));
}

.bg-base-200 {
  --tw-bg-opacity: 1;
  background-color: hsl(var(--b2) / var(--tw-bg-opacity));
}

.bg-black {
  --tw-bg-opacity: 1;
  background-color: rgb(0 0 0 / var(--tw-bg-opacity));
}

.bg-current {
  background-color: currentColor;
}

.bg-primary {
  --tw-bg-opacity: 1;
  background-color: hsl(var(--p) / var(--tw-bg-opacity));
}

.bg-primary-focus {
  --tw-bg-opacity: 1;
  background-color: hsl(var(--pf) / var(--tw-bg-opacity));
}

.bg-opacity-10 {
  --tw-bg-opacity: 0.1;
}

.bg-cover {
  background-size: cover;
}

.bg-center {
  background-position: center;
}

.object-cover {
  -o-object-fit: cover;
     object-fit: cover;
}

.p-0 {
  padding: 0px;
}

.p-2 {
  padding: 0.5rem;
}

.p-3 {
  padding: 0.75rem;
}

.p-4 {
  padding: 1rem;
}

.p-8 {
  padding: 2rem;
}

.px-1 {
  padding-left: 0.25rem;
  padding-right: 0.25rem;
}

.py-4 {
  padding-top: 1rem;
  padding-bottom: 1rem;
}

.text-left {
  text-align: left;
}

.text-center {
  text-align: center;
}

.align-middle {
  vertical-align: middle;
}

.text-4xl {
  font-size: 2.25rem;
  line-height: 2.5rem;
}

.text-base {
  font-size: 1rem;
  line-height: 1.5rem;
}

.text-lg {
  font-size: 1.125rem;
  line-height: 1.75rem;
}

.text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.text-xl {
  font-size: 1.25rem;
  line-height: 1.75rem;
}

.text-xs {
  font-size: 0.75rem;
  line-height: 1rem;
}

.font-bold {
  font-weight: 700;
}

.font-medium {
  font-weight: 500;
}

.font-semibold {
  font-weight: 600;
}

.font-thin {
  font-weight: 100;
}

.normal-case {
  text-transform: none;
}

.italic {
  font-style: italic;
}

.text-error {
  --tw-text-opacity: 1;
  color: hsl(var(--er) / var(--tw-text-opacity));
}

.text-gray-400 {
  --tw-text-opacity: 1;
  color: rgb(156 163 175 / var(--tw-text-opacity));
}

.text-gray-600 {
  --tw-text-opacity: 1;
  color: rgb(75 85 99 / var(--tw-text-opacity));
}

.underline {
  text-decoration-line: underline;
}

.opacity-0 {
  opacity: 0;
}

.opacity-100 {
  opacity: 1;
}

.shadow {
  --tw-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.shadow-lg {
  --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.shadow-md {
  --tw-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.shadow-xl {
  --tw-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 20px 25px -5px var(--tw-shadow-color), 0 8px 10px -6px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.blur {
  --tw-blur: blur(8px);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.filter {
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.duration-200 {
  transition-duration: 200ms;
}

@media (min-width: 640px) {
  .sm\\:navbar-start {
    width: 50%;
    justify-content: flex-start;
  }

  .sm\\:navbar-center {
    flex-shrink: 0;
  }

  .sm\\:navbar-end {
    width: 50%;
    justify-content: flex-end;
  }

  .sm\\:min-h-16 {
    min-height: 4rem;
  }

  .sm\\:modal-middle {
    place-items: center;
  }

  .sm\\:modal-middle :where(.modal-box) {
    width: 91.666667%;
    max-width: 32rem;
    --tw-translate-y: 0px;
    --tw-scale-x: .9;
    --tw-scale-y: .9;
    transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
    border-top-left-radius: var(--rounded-box, 1rem);
    border-top-right-radius: var(--rounded-box, 1rem);
    border-bottom-left-radius: var(--rounded-box, 1rem);
    border-bottom-right-radius: var(--rounded-box, 1rem);
  }
}

@media (min-width: 1024px) {
  .lg\\:btn-md {
    height: 3rem;
    padding-left: 1rem;
    padding-right: 1rem;
    min-height: 3rem;
    font-size: 0.875rem;
  }

  .btn-square:where(.lg\\:btn-md) {
    height: 3rem;
    width: 3rem;
    padding: 0px;
  }

  .btn-circle:where(.lg\\:btn-md) {
    height: 3rem;
    width: 3rem;
    border-radius: 9999px;
    padding: 0px;
  }
}

.checked\\:bg-primary:checked {
  --tw-bg-opacity: 1;
  background-color: hsl(var(--p) / var(--tw-bg-opacity));
}

.hover\\:relative:hover {
  position: relative;
}

.hover\\:bottom-2:hover {
  bottom: 0.5rem;
}

.hover\\:cursor-pointer:hover {
  cursor: pointer;
}

.hover\\:bg-base-200:hover {
  --tw-bg-opacity: 1;
  background-color: hsl(var(--b2) / var(--tw-bg-opacity));
}

.hover\\:shadow-lg:hover {
  --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.hover\\:shadow-md:hover {
  --tw-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

@media (prefers-color-scheme: dark) {
  .dark\\:opacity-50 {
    opacity: 0.5;
  }
}

@media (min-width: 640px) {
  .sm\\:static {
    position: static;
  }

  .sm\\:mb-4 {
    margin-bottom: 1rem;
  }

  .sm\\:inline {
    display: inline;
  }

  .sm\\:flex {
    display: flex;
  }

  .sm\\:hidden {
    display: none;
  }

  .sm\\:w-1\\/2 {
    width: 50%;
  }

  .sm\\:w-auto {
    width: auto;
  }

  .sm\\:w-full {
    width: 100%;
  }

  .sm\\:max-w-5xl {
    max-width: 64rem;
  }

  .sm\\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .sm\\:flex-row {
    flex-direction: row;
  }

  .sm\\:flex-nowrap {
    flex-wrap: nowrap;
  }

  .sm\\:overflow-y-visible {
    overflow-y: visible;
  }

  .sm\\:rounded-xl {
    border-radius: 0.75rem;
  }

  .sm\\:p-4 {
    padding: 1rem;
  }
}

@media (min-width: 768px) {
  .md\\:w-1\\/2 {
    width: 50%;
  }

  .md\\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .md\\:flex-row {
    flex-direction: row;
  }
}

@media (min-width: 1024px) {
  .lg\\:block {
    display: block;
  }

  .lg\\:inline {
    display: inline;
  }

  .lg\\:flex {
    display: flex;
  }

  .lg\\:hidden {
    display: none;
  }

  .lg\\:w-3\\/4 {
    width: 75%;
  }

  .lg\\:flex-row {
    flex-direction: row;
  }

  .lg\\:justify-start {
    justify-content: flex-start;
  }

  .lg\\:justify-between {
    justify-content: space-between;
  }

  .lg\\:text-base {
    font-size: 1rem;
    line-height: 1.5rem;
  }
}

@media (min-width: 1280px) {
  .xl\\:block {
    display: block;
  }

  .xl\\:hidden {
    display: none;
  }

  .xl\\:w-1\\/2 {
    width: 50%;
  }
}`;