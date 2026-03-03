// Koha staff-interface daisyUI theme overrides.
// HSL values sourced from Koha's _variables.scss / Bootstrap defaults.

const kohaStaffTheme = new CSSStyleSheet();
kohaStaffTheme.replaceSync(/* css */ `
  :host {
    /* Primary – golden yellow (#FFC32B) */
    --p: 43 100% 58%;
    --pc: 210 11% 15%;
    --pf: 43 100% 51%;

    /* Secondary – Bootstrap gray-600 (#6c757d) */
    --s: 208 7% 46%;
    --sc: 0 0% 100%;
    --sf: 208 7% 39%;

    /* Accent – Koha brand green (#408540) */
    --a: 120 36% 39%;
    --ac: 0 0% 100%;
    --af: 120 36% 32%;

    /* Neutral – dark brown (#352c2e) */
    --n: 347 9% 19%;
    --nc: 180 5% 95%;
    --nf: 347 9% 12%;

    /* Base surfaces */
    --b1: 0 0% 100%;       /* content bg */
    --b2: 180 5% 95%;      /* page bg */
    --b3: 210 14% 89%;     /* borders */
    --bc: 210 11% 15%;     /* body text */

    /* Info (#84c1f3) */
    --in: 207 83% 74%;
    --inc: 207 80% 16%;

    /* Success – same green (#408540) */
    --su: 120 36% 39%;
    --suc: 0 0% 100%;

    /* Warning (#ffc107) */
    --wa: 45 100% 51%;
    --wac: 210 11% 15%;

    /* Error (#dc3545) */
    --er: 354 70% 54%;
    --erc: 0 0% 100%;

    /* Shape tokens */
    --rounded-box: 0.375rem;
    --rounded-btn: 0.31rem;
    --btn-text-case: none;
    --border-btn: 1px;
    --tab-radius: 0.375rem;
    --animation-btn: 0;
    --animation-input: 0;
  }
`);

export { kohaStaffTheme };
