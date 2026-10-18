# VVS Models — Luxury Talent & Staffing Agency

Static website for **VVS Models** (vvsmodels.com) — premiere promotional modeling, event staffing and talent agency serving Reno, Tahoe, Sacramento, Los Angeles, Las Vegas and more.

## Stack
Plain HTML / CSS / JS — no build step. Deploys to Vercel as-is.

## Deploy on Vercel
1. Vercel → **Add New → Project** → import this GitHub repo.
2. Framework preset: **Other**. Build command: *(none)*. Output directory: *(root)*.
3. Deploy.

## Contact forms
Both forms (Book Talent / Apply as Model) post to [FormSubmit](https://formsubmit.co) and arrive at **info@vvsmodels.com**.
The **first** submission triggers a one-time activation email to that inbox — click *Activate Form* and every submission after that is delivered.
To change the destination, edit `FORM_EMAIL` at the top of `script.js`.

## Structure
- `index.html` — all sections
- `styles.css` — design system (onyx + champagne gold)
- `script.js` — reel controls, gallery + lightbox (‹ › arrows, keyboard, swipe), tabs, form submission
- `assets/video/vvs-showcase.mp4` — combined showcase reel (looping)
- `assets/video/casting-call-2026.mp4` — Spring 2026 casting call loop
- `assets/img/` — logo + gallery photos
