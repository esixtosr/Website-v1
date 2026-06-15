import { css } from 'styled-components';

const variables = css`
  :root {
    /* Dark Mode - Neon Circuit Board */
    --dark-navy: #020617;
    --navy: #020617;
    --light-navy: #151b2f;
    --lightest-navy: #005f73;
    --navy-shadow: rgba(2, 6, 23, 0.7);

    --dark-slate: #4b5563;
    --slate: #94a3b8;
    --light-slate: #cbd5e1;
    --lightest-slate: #e2e8f0;
    --white: #f8fafc;

    --green: #00ffc6;
    --green-tint: rgba(0, 255, 198, 0.12);
    --pink: #f57dff;
    --blue: #00bcd4;

    /* Theme utility vars */
    --background: #020617;
    --background-secondary: #151b2f;
    --border-color: #005f73;
    --text-main: #cbd5e1;
    --text-heading: #e2e8f0;
    --card-bg: #151b2f;

    --font-sans: 'Calibre', 'Inter', 'San Francisco', 'SF Pro Text', -apple-system, system-ui,
      sans-serif;
    --font-mono: 'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace;

    --fz-xxs: 12px;
    --fz-xs: 13px;
    --fz-sm: 14px;
    --fz-md: 16px;
    --fz-lg: 18px;
    --fz-xl: 20px;
    --fz-xxl: 22px;
    --fz-heading: 32px;

    --border-radius: 4px;
    --nav-height: 100px;
    --nav-scroll-height: 70px;

    --tab-height: 42px;
    --tab-width: 120px;

    --easing: cubic-bezier(0.645, 0.045, 0.355, 1);
    --transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);

    --hamburger-width: 30px;

    --ham-before: top 0.1s ease-in 0.25s, opacity 0.1s ease-in;
    --ham-before-active: top 0.1s ease-out, opacity 0.1s ease-out 0.12s;
    --ham-after: bottom 0.1s ease-in 0.25s, transform 0.22s cubic-bezier(0.55, 0.055, 0.675, 0.19);
    --ham-after-active: bottom 0.1s ease-out,
      transform 0.22s cubic-bezier(0.215, 0.61, 0.355, 1) 0.12s;
  }

  html[data-theme='light'] {
    /* Light Mode - White / Black / Grayscale */
    --dark-navy: #d1d5db;
    --navy: #00ffc82a;
    --light-navy: #ffffff;
    --lightest-navy: #94a3b8;
    --navy-shadow: rgba(15, 23, 42, 0.08);

    --dark-slate: #64748b;
    --slate: #475569;
    --light-slate: #334155;
    --lightest-slate: #0f172a;
    --white: #000000;

    /* Keep accent, just tone it a bit */
    --green: #00b894;
    --green-tint: rgba(0, 184, 148, 0.12);
    --pink: #d946ef;
    --blue: #0891b2;

    /* Theme utility vars */
    --background: #f5f5f5;
    --background-secondary: #ffffff;
    --border-color: #cbd5e1;
    --text-main: #334155;
    --text-heading: #0f172a;
    --card-bg: #ffffff;
  }
`;

export default variables;
