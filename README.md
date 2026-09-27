# Naari OS: Safe Watch

Design a UI prototype for a wrist-worn safety device called "SheShield Sentinel".

This is a REFERENCE PROTOTYPE for a 410x502px portrait AMOLED touchscreen watch
(this will be rebuilt in embedded LVGL later — build it as a fixed 410x502 frame,
not responsive web layout).

Three states to design as full screens:
1. SAFE (idle/home screen): time, date, battery, a calm status indicator, and a
   single clear affordance hinting at the discreet trigger gesture (don't over-
   explain it on screen — this is meant to look like a normal watch face).
2. SAFETY WATCH (triggered discreetly): a subdued, non-alarming state showing
   "Safety Watch Active", live location sharing indicator, elapsed time, and a
   clear but not-urgent "I'm safe now / cancel" action.
3. EMERGENCY (triggered): high-urgency but NOT panic-inducing visual state —
   confirms alert sent, shows contacts notified, shows a countdown/confirmation
   window before it escalates (silent vibration confirmation, cancel option),
   and status of evidence capture (audio recording active).

Also include:
4. A brief settings/setup screen for configuring trusted emergency contacts.
5. A confirmation micro-interaction screen for the false-trigger cancellation flow.

Dark theme (AMOLED - true blacks save power), high contrast, large touch targets
(minimum ~44px), minimal text, glanceable at a distance, designed to be operated
without looking closely or while moving. Avoid loud reds/alarms in the SAFE and
WATCH states — reserve the strongest visual urgency cues for EMERGENCY only, and
even then avoid anything that would draw attention if someone else glances at the
wearer's wrist.

It shoudl strictly follow apple watch like desing language

And brand it as Naari OS


## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
