# React UI Glitch Mindset (Out-of-the-Box)

## Why this exists
When a UI "teleports" or glitches, the visual bug is often not the animation itself.  
It is usually a **state timing overlap**: old state classes and new state classes coexist for a short frame.

## Core way of thinking
1. Think in **frames**, not only in logic.
2. Ask: "Can two visual states be true in the same render?"
3. Assume `setState` is not immediate; state changes are scheduled.
4. If a class should disappear "now", verify what happens in the **next 1-2 renders**.

## Fast diagnosis checklist
1. Identify all classes that touch the same CSS property (`transform`, `opacity`, etc.).
2. Check if those classes can be active together during a transition.
3. Check if multiple state updates are fired in one event and applied over separate renders.
4. Check if there is class removal + class add in the same click path.
5. Verify if React remount (`key` change) is restarting animation state unexpectedly.

## Practical anti-glitch patterns
1. **One property, one owner per layer**: avoid two systems controlling `transform` on the same node.
2. **Use wrapper separation**: one wrapper for "menu animation", one inner/outer for "play transition".
3. **State phases over booleans**: prefer explicit phases (`idle`, `menu-opening`, `menu-closing`, `playing-enter`) when needed.
4. **Sequence intentionally**: if needed, delay the second transition until first frame/animation end.
5. **Remove race conditions**: avoid "set to 0 + apply new class" in the same tick if this causes overlap.

## Debug questions to ask before fixing
1. What exact class combo is present on the glitch frame?
2. Which state update produced each class?
3. Is the bug from CSS conflict, state timing, or component remount?
4. Does the final position equal another animation endpoint (visual jump illusion)?

## Rule to remember
If behavior looks random but logic looks correct, inspect **render timing and class coexistence** first.
