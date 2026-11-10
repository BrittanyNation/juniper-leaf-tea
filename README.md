# Juniper & Leaf Tea Co. — Small-Batch Teas, Blended Fresh in Clarksville

**Live site:** https://brittanynation.github.io/juniper-leaf-tea/

A fully functional website for **Juniper & Leaf Tea Co.**, a fictional small-batch tea merchant in Clarksville, Tennessee: browse 12 teas rendered from data, filter by tea family, search, sort, open a tea to choose a tin size (Taster 1 oz / Classic 4 oz / Pantry 8 oz) that reprices live, save a wishlist, fill a basket that persists between visits, and check out with full validation, a working promo code, and a real confirmation. The visit page adds shop hours, tea-blending workshops with weekday-checked RSVP, FAQ accordions, and a duplicate-aware newsletter. Every interactive element works — no dead buttons, no placeholder links.

This is an original portfolio concept by Brittany Nation. No affiliation with any real business is claimed. Design workflow: Sketch / Webflow for layout thinking, built with HTML, CSS and JavaScript.

## Course track: complete — combined-skills build

The daily projects followed Dr. Angela Yu's *Full-Stack Web Development Bootcamp* (Udemy) one skill at a time: live APIs + async JavaScript (Solstice Skies), Node.js + Express (Willow Bend Paddle Co.), databases + REST API design (Tinker Commons), authentication (Haven Desk Collective), and React (Saffron & Sage Kitchen, deepened by Fieldnotes Studio). With all five steps complete, this build combines the front-end patterns from across the course in plain JavaScript, with the code commented as study material:

- **Data-driven rendering** — the shelf is an array of objects in `shop.js`; cards, counts and the empty state are all built from data.
- **State + persistence** — basket and wishlist are saved to localStorage on every change and restored on load, so they survive page changes and reloads.
- **Derived state** — the visible list (tea family + search + sort) and every total (subtotal, promo, delivery, 7% tax) are computed from state, never stored.
- **Option-driven pricing** — the detail modal's tin-size selector reprices live: Taster is $5 under Classic, Pantry is $12 over Classic.
- **Validated checkout** — recipient, date (no past dates, no Sundays, same-day delivery closes at 2 PM), name, email, 16-digit card, future MM/YY expiry and CVC are all validated inline before a `JL-XXXXXX` confirmation is generated, the order saved, and the basket cleared.

## What works on the site

- **Shop** — 12 teas from data; tea-family chips (Green / Black / Herbal / Oolong / White / Rooibos), live search, four sort orders, live result count and an honest empty state; detail modal with tin-size pricing and quantity; wishlist hearts persisted in localStorage.
- **Basket** — slide-in drawer with quantity increase/decrease and remove; the same basket powers the checkout page and persists in localStorage across pages.
- **Checkout** — promo code `TEA10` takes 10% off; delivery is $6.95 and free once the discounted subtotal reaches $60; pickup is free; gift message with a 200-character counter; tax is 7% as its own line; full inline validation ends in a confirmation with a generated `JL-XXXXXX` reference.
- **Visit & Workshops** — hours table with today highlighted, two blending workshops with a validated RSVP form that checks the date against the workshop's weekday (Saturdays for Blend Your Own Chai, Wednesdays for the Oolong Tasting Flight) and subtracts seats live, ending in a `JL-R-XXXXX` reference, working FAQ accordions, and a validated The Steeping Letter newsletter signup that recognises repeat subscribers.

## Verified

Automated DOM checks against the built files (see the run log in the goal workspace): 12 cards render from data, the Green filter narrows 12 to 2 and All restores 12, search narrows to 1, the modal Pantry price is $12 over Classic, adding to the basket updates the count and persists it, checkout math is exact (Sencha Green $12.00 + Masala Chai $13.00 = $25.00 subtotal; TEA10 −$2.50; delivery $6.95; tax $2.06; total $31.51), an invalid submit shows field errors, a Sunday date is rejected, a valid submit shows a `JL-XXXXXX` confirmation and clears the basket, the RSVP rejects a wrong weekday and confirms a right one, and the newsletter signup succeeds and recognises a duplicate.

## Palette

Deep pine `#1B3A32`, jade `#2E7D6B`, honey `#E0A458`, sand `#E9E2D0`, cream `#FAF6EE`, ink `#23201C`, matcha `#A8C686`.

## Files

- `index.html` — shop page shell with Open Graph tags
- `shop.js` — catalogue data, filtering/search/sort, modal, wishlist and basket drawer, commented as study code
- `cart.html` — basket and checkout page
- `cart.js` — derived totals, promo, checkout validation and confirmation, commented as study code
- `visit.html` — visit, workshops, RSVP, FAQs and newsletter
- `visit.js` — hours highlight, workshop RSVP, FAQ accordion, newsletter, commented as study code
- `styles.css` — design system (deep pine / jade / honey)
- `images/` — 15 real Pexels photographs (hero, shop, workshop, 12 teas)
- `og-image.png` — branded social preview image, 1200×627
