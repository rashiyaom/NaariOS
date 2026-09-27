# Naari OS — SheShield Sentinel Prototype

## Goal
Build an interactive reference prototype inside an exact 410×502px portrait watch display, presenting five glanceable safety states in an Apple Watch-inspired visual language.

## Screens
- Safe watch face with time, date, battery, calm status, and one discreet gesture hint.
- Safety Watch with location sharing, elapsed time, and a calm “I’m safe now” action.
- Emergency with alert confirmation, notified contacts, escalation countdown, silent confirmation, cancellation, and active audio capture.
- Trusted contacts setup with compact contact rows and large controls.
- False-trigger cancellation confirmation with a brief hold-to-confirm interaction.

## Interaction
- Add a compact prototype navigator outside the watch frame to switch between all five screens.
- Make primary in-watch actions work: trigger safety states, enter cancellation, confirm cancellation, manage setup toggles, and return to Safe.
- Keep the watch itself fixed at 410×502px; only the surrounding preview canvas adapts.

## Visual direction
- True-black AMOLED background with cool white typography, restrained mint/cyan status cues, and muted gray surfaces.
- Reserve a softened coral urgency cue for Emergency only.
- Use large rounded touch controls, restrained motion, clear hierarchy, and no attention-grabbing flashing or alarm treatment.
- Brand the interface as Naari OS while keeping the Safe state convincingly watch-like.

## Technical details
- Implement in the existing TanStack React home screen with local prototype state only.
- Extend semantic design tokens in the global stylesheet and use the existing Button component for controls.
- Add route-specific metadata and verify the fixed dimensions, transitions, interactions, and visible layout in the browser.
