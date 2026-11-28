# Rubik's cube widget

An interactive 3D cube for the inline HTML widget tool. Show the loader below exactly as written; don't rebuild the cube from memory and don't translate the labels (the UI is English on purpose).

The cube's code lives in [`../assets/cube.js`](../assets/cube.js) and the browser loads it from jsDelivr, so you only type a few lines into the chat.

## What it does

- **Cube area:** drag a layer to turn it; drag a centre label to rotate the whole cube (x, y, z); drag outside the cube to change the view. The exercise title (or "Practice · LBL" / "Practice · CFOP") sits in the top-left corner, Solved / Not solved in the top-right (kept clear of the chat's widget menu), Scramble and Reset in the bottom-left, Answer and Explain in the bottom-right. These four are icon buttons (shuffle, reset arrow, light bulb, speech bubble with a question mark) with a tooltip.
- **Face letters:** each centre carries a raised label with the name of the face it is on (U, D, L, R, F, B). Labels are renamed and turned upright after every move.
- **History:** every move made (drag or Play). The back and forward buttons step through it one move at a time, with the current move highlighted and undone moves dimmed. Turning the cube after stepping back drops the undone moves and records the new one.
- **Moves input:** type an algorithm (or press Answer), then the Play button (a play icon, which turns into a stop icon while playing): the input clears and the moves play one after another. Pressing Play again with an empty input resumes after a stop.
- **Method tabs (LBL, CFOP):** each tab lists the method's steps with practice cases, plus a shuffle button per step that makes a random case for that step: everything the earlier steps solve stays solved (e.g. a random F2L case keeps the white cross), and the step itself is never already done. Clicking a case resets the cube, turns white to the bottom, and sets up exactly that case (it is built by playing the case's solution backwards, so the solution always works). A case may have a fourth field, a "mix" played first that scrambles parts the lesson doesn't cover; then the solution finishes the lesson's step but the cube isn't fully solved.
- **Exercise title and goal:** the loaded case shows in the top-left of the cube area, e.g. "Exercise: CFOP · Cross · Random", with the step's goal underneath ("Goal: Build the white cross on the bottom, each edge matching its side centre."); with no exercise loaded it says "Practice · LBL" or "Practice · CFOP", following the open tab.
- **Answer** (bottom-right): puts the moves that finish the exercise's step into the input; Play runs them. A fixed case uses its stored solution; a random case, or a cube with no exercise loaded, uses the built-in solver (the same code as `scripts/solve.js`) with the method of the current tab: Layer by Layer on the LBL tab, CFOP on the CFOP tab. It solves up to the exercise's step, or the whole cube in Practice.
- **Explain** (bottom-right): sends this message to the chat, so Claude explains why those moves work:

  ```
  Explain this exercise: CFOP · F2L · 3 (cfop-f2l-3).
  Answer: R U R'
  State (Kociemba facelet string, face order U R F D L B):
  <54 letters>
  Centers: U=yellow, R=orange, F=green, D=white, L=red, B=blue
  Asked at: 23:25:18.296
  ```

  Without an exercise the first line is "Explain how to solve my cube from here (CFOP method)." "Asked at" makes every message different, because the chat ignores a widget message identical to the previous one.

Colour scheme: white opposite yellow, green opposite blue, red opposite orange. Move notation is standard (x follows R, y follows U, z follows F; M follows L, E follows D, S follows F).

Case ids match the lesson files in `methods/`. To add a method, add an entry to `METHODS` in `assets/cube.js` (tab name, steps, cases as `[id, label, solution]`) and a lesson file.

## Widget code

```html
<h2 class="sr-only">Interactive 3D Rubik's cube for learning to solve it, with practice exercises for the Layer by Layer and CFOP methods, an Answer button that shows the moves, and an Explain button that asks Claude why those moves work.</h2>
<div id="coach-rubik" style="min-height:420px;font-size:14px;color:var(--text-secondary)">Loading the cube…</div>
<script src="https://cdn.jsdelivr.net/gh/quando1910/coach-me@v1.0.2/skills/coach-rubik/assets/cube.js" onerror="document.getElementById('coach-rubik').textContent='Could not load the cube from cdn.jsdelivr.net. Check your connection, then ask Claude to show the cube again.'"></script>
```

If the widget shows the "Could not load" message, tell the user the cube couldn't be loaded and continue teaching in text; the lesson files and the solver still work.

## Releasing a new version

1. Change the UI in `assets/cube.js`. If you changed `scripts/solve.js`, run `python3 scripts/build_cube.py` to copy the solver into `assets/cube.js`.
2. Commit, then create and push a new tag (`v1.0.1`, ...).
3. Update the version in the script URL above to that tag. The URL is pinned to a tag on purpose: jsDelivr caches branch URLs such as `@main` for up to a week.
