# ConnectPath Website

Static multi-page site. No build step, no dependencies. Deploys to Vercel as-is.

## Deploy to Vercel

Option A (dashboard): go to vercel.com/new, drag this folder in, deploy. Done.

Option B (CLI):
    npm i -g vercel
    cd connectpath
    vercel --prod

`vercel.json` enables clean URLs, so /about, /roles, /hiring, /contact all work
without the .html extension (the .html links still work too).

## Before launch (3 quick swaps)

1. CALENDAR (required): in `index.html`, find the comment "LAUNCH STEP" inside
   the #book section and replace the iframe src with your live scheduler link
   (Calendly, Cal.com, or your GoHighLevel calendar embed URL). Every button on
   the site routes to this one calendar.

2. FORMS (optional but recommended): in `script.js`, set FORM_ENDPOINT to your
   GoHighLevel inbound webhook or Formspree URL. Until you do, form submissions
   still route the visitor straight to the calendar so no lead dead-ends.

3. SOCIAL LINKS: the footer and contact page have LinkedIn / X / Instagram
   links set to "#". Search for `rel="noopener"` and drop in the real URLs.

## Files

    index.html      Home + the #book calendar section (the funnel's center)
    about.html      Story, process, mechanism, founder
    roles.html      Roles placed + pricing/economics comparison
    hiring.html     Fit check, value stack, bonuses, qualifier form
    contact.html    Contact form + socials
    styles.css      Full design system (navy accent, flowing dark grey bg)
    script.js       Mobile nav, scroll reveals, form handling
    assets/founder.png   Aland Ali headshot
