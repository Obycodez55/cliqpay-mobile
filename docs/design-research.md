# Design Research — Reference Apps

Raw findings from studying reference apps, feeding into [design-system.md](design-system.md) once we actually decide on tokens/components. This file is notes and sourcing, not decisions — treat it as input, not spec.

**Sources used:**
- Mobbin (free tier) — real screens for Cash App, Venmo, Revolut. Free tier shows onboarding/home/marketing screens; the actual send/pay flow screens are Pro-gated on every app checked, so those are described from direct knowledge of the apps below, not a Mobbin screenshot.
- Apple Human Interface Guidelines (Wallet) — public docs.
- Dribbble — concept/speculative UI, not shipped product. Useful for visual/layout ideas (color, card treatments, composition), not validated UX — flag anything pulled from here as "aesthetic reference" not "proven pattern."
- Kuda, Opay, Moniepoint — not indexed on Mobbin at all; notes below are from direct product knowledge, worth spot-checking against the live apps before committing to anything specific.

## Cash App

- **Visual identity:** Neon green (`#00D64F`-ish) as the dominant brand color, black secondary screens, bold rounded sans-serif type, big numerals for balance.
- **Home screen:** Balance is the single largest element on screen — "Cash balance" label, then a huge dollar figure. Two pill-shaped buttons directly below: "Add money" / "Withdraw". Savings and "Pools" (shared savings) as secondary cards further down.
- **Tab bar:** icon-only, no labels — $ (home), a card icon, a clock (activity).
- **Card screen:** Physical debit card rendered as a large visual element, "Lock" toggle and "Copy" (card number) as primary actions — leans into the card being an object you interact with, not just data.
- **Takeaway for us:** balance-first hierarchy, minimal-chrome tab bar, treating "add money" as equally prominent as balance itself.

## Venmo

- **Visual identity:** Blue-on-white, playful hand-drawn illustration style during onboarding (cash, pizza, lightning bolt motifs) — very different tone from Cash App's stark boldness. Signals "casual, social" rather than "serious banking."
- **Onboarding:** asks "How will you use Venmo?" (Personal / Teen / Business) as an early branch — tailors the rest of onboarding per use case.
- **Social layer:** Venmo's defining trait is the public/friends activity feed of payments (with emoji reactions) — deliberately not private-only. Not something we'd copy directly (privacy expectations differ for a Nigerian wallet), but worth naming explicitly as a pattern we're *not* adopting, so it doesn't creep in by default.
- **Takeaway for us:** onboarding can branch by use-case; illustration style is a legitimate alternative to Cash App's starkness if we want warmer tone — worth deciding deliberately rather than defaulting to "serious fintech" chrome.

## Revolut

- **Visual identity:** Dark navy/black as the default theme (not just a dark-mode option — it's the primary brand feel), high-contrast white numerals, small color accents per currency/product.
- **Home screen:** Card carousel at top (physical/virtual card previews, swipeable), quick actions row (Add money / Move / Details / More icons), then a merged activity list ("SGD → USD" style entries showing both legs of an FX conversion inline).
- **Send money flow (confirmed via Dribbble, official Revolut shot):** avatar row of recent recipients at the top, large numeric amount readout in the middle, native numeric keypad, one full-width "Send" button pinned to the bottom. This exact pattern (avatar picker → big number → keypad → single CTA) shows up as the de facto standard across the category — worth treating as close to a default rather than a Revolut-specific choice.
- **Tab bar:** Home / Invest / Payments / Crypto / Lifestyle — five items, labeled, reflecting how many products Revolut bundles. Ours will likely need far fewer tabs at launch (wallet, transfers/activity, requests, profile), which is fine — five tabs is Revolut's problem to have, not a bar we should aim to fill.
- **Takeaway for us:** the send-money screen pattern (avatars → amount → keypad → CTA) is close to an industry default and a strong starting point for our own send flow. Dark-navy-as-primary-theme is a legitimate stylistic direction, not just "supports dark mode."

## Kuda / Opay / Moniepoint (Nigerian market — from product knowledge, not Mobbin)

These three define what Nigerian users already expect from a P2P/wallet app, which matters more for us than any US/EU app:

- **Speed-to-transfer is the core value prop**, not social/lifestyle framing — the send-money action is usually one or two taps from the home screen (a prominent "Transfer" button, not buried in a menu).
- **Bank-account-number-style transfers** are still the dominant mental model even for wallet-to-wallet transfers — recipient lookup by account number/username/phone number needs to feel as fast as typing a 10-digit NUBAN, since that's the muscle memory Nigerian users already have from bank apps.
- **Airtime/data top-up and bill payment sit right on the home screen** as first-class actions alongside transfers — bills/utility payment is not a secondary feature in this market the way it might be in a US wallet app.
- **Heavier use of color-coded transaction states and receipts** — a shareable/downloadable transaction receipt (screenshot-friendly) is something users actively rely on for proof of payment, more than in Cash App/Venmo where the activity feed itself is considered sufficient proof.
- **Network conditions matter**: these apps are visibly built to tolerate flaky connections — explicit loading/pending/retry states get more UI weight than in the US apps studied, rather than being treated as edge cases.
- **Recommendation:** before finalizing any transfer/receipt/home-screen decisions, actually install and use Kuda/Opay/Moniepoint side-by-side rather than relying on this summary — these notes are directional, not a substitute for direct observation of the current apps.

## Apple Wallet / HIG

- The Wallet HIG page is about integrating with Apple's own Wallet passes (boarding passes, loyalty cards) — not directly about how to design a money-transfer screen, so it's less applicable than expected going in.
- Useful pattern that *does* transfer: Apple's guidance on **permission/purpose strings** — one direct, specific sentence explaining exactly why an action needs an identity/permission grant, sentence case, no passive voice. Directly applicable to our own KYC/permission moments (BVN/NIN verification, notification permissions, etc.).
- General HIG ethos (uncluttered layouts, essential info in the header/collapsed state, strong contrast) is consistent with what we're already seeing in Cash App/Revolut — reinforces rather than adds new direction.

## Dribbble (aesthetic reference only — concept work, not shipped product)

- Recurring visual motifs across popular fintech-wallet concept shots: dark or near-black backgrounds with a single saturated accent color, oversized balance numerals, rounded-rect cards with soft gradients, circular recipient avatars in a horizontal scroll row for "recent contacts."
- These are consistent enough across many independent designers' concepts that they read as "current fintech visual language" rather than one designer's idiosyncratic choice — reasonable to draw on for color/layout inspiration.
- Caveat: concept shots optimize for looking good in a static screenshot, not for animation, accessibility, or real data (empty states, long names, error states). Don't lift a Dribbble layout wholesale — use it for palette/composition ideas, then design the real states ourselves.

## Cross-app patterns worth carrying into our design system

1. **Balance-first home screen** — the account balance is always the single largest, highest-contrast element on the home screen, full stop.
2. **Send-money flow shape**: recipient (avatar/recent contacts or lookup) → amount (big numerals + numeric keypad) → confirm → single full-width CTA. This is close to a solved problem across the category — low risk to follow it closely for our first version.
3. **Icon-only or minimally-labeled tab bar**, 3-5 items max, matching how many core products we actually ship (not Revolut's five — we don't have that many yet).
4. **Shareable transaction receipts** matter more in our market than in the US apps studied — worth prioritizing over polish on the social/activity-feed side.
5. **Explicit network/pending states** deserve real design attention, not afterthought treatment, given the Nigerian market's connectivity reality.
6. **Dark-navy-as-primary vs. light-first** is a real fork to decide deliberately (Revolut goes dark-primary, Cash App/Venmo/Kuda-style apps lean light) — not something to default into either direction without discussing it.
