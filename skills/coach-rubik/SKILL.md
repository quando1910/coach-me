---
name: coach-rubik
description: Coach a learner through solving a 3x3 Rubik's cube with an interactive 3D cube and stage-by-stage CFOP solutions. Use when the user wants to learn, practise, or solve a Rubik's cube, or sends a cube state (a Kociemba facelet string) asking how to solve it.
---

# Rubik's cube coach

## Goal

The learner turns a 3D cube in the chat, then asks the coach how to solve the state they are looking at. The coach answers with the moves for each stage of the chosen method, so the learner can play them back on the cube and see each stage complete.

Only the CFOP method is supported for now.

## Workflow

1. **No cube state in the message** (for example "teach me the Rubik's cube", "/coach-rubik"): read [`reference/widget.md`](reference/widget.md) in this skill's folder and show the widget with the inline HTML widget tool, exactly as written there. Below it, write one or two sentences in the user's language: drag a layer to turn it, drag outside the cube to change the view, and press **Ask coach** to get the solution for the current state.
2. **The message has a cube state.** The widget's Ask coach button sends a message like this:

   ```
   Solve my Rubik's cube with the CFOP method.
   State (Kociemba facelet string, face order U R F D L B):
   UUFUUFUUFRRRRRRLLLFFDFFDUBBBDDBDDBDDLLLLLLRRRUBBUBBFFD
   Centers: U=white, R=red, F=green, D=yellow, L=orange, B=blue
   Solved: no
   Asked at: 23:25:18.296
   ```

   Run the solver from this skill's folder, passing the 54-letter state and the Centers line:

   ```bash
   python3 scripts/solve.py "UUFUUFUUFRRRRRRLLLFFDFFDUBBBDDBDDBDDLLLLLLRRRUBBUBBFFD" --centers "U=white, R=red, F=green, D=yellow, L=orange, B=blue"
   ```

   It prints the answer, already checked by applying every move to the state:

   ```
   CFOP method:
   Cross: { x2 R' }
   F2L: { R U2 R' }
   OLL: -
   PLL: -
   ```

3. **Reply with the solver's output only**, in a plain code block, exactly as printed. Don't add, remove, or reorder moves, and don't add an explanation unless the user asks for one.

## Answer format

```
CFOP method:
Cross: { moves }
F2L: { moves }
OLL: { moves }
PLL: { moves }
```

- Each stage lists its moves in standard notation inside braces.
- A stage that needs no moves shows `-` instead of braces.
- The cross is built on white at the bottom. If white is not at the bottom, the Cross line starts with a whole-cube rotation (`x2`, `x`, `x'`, `z`, `z'`).

## Rules

- Never work out a solution by hand. Moves for a scrambled cube must come from the solver, because one wrong move ruins every stage after it.
- If the solver prints an error (for example the state is impossible on a real cube), tell the user in one sentence that the state couldn't be read, and suggest pressing Reset or Scramble and asking again. Don't guess moves.
- If you can't run code (code execution is turned off), say that the coach needs code execution to solve a cube and ask the user to turn it on. Don't guess moves.
- If the user asks why a stage uses those moves, or what a stage means, explain it in their language after the block: what the stage achieves (Cross: white edges matched with the side centres; F2L: corner and edge pairs fill the first two layers; OLL: the top face becomes one colour; PLL: the top-layer pieces move to their places) and, for a short sequence, what each part does.
- If the user asks for a method other than CFOP, say it isn't supported yet.
- Reply in the user's language. The answer block and the move notation stay as printed.
