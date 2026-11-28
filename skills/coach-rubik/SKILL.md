---
name: coach-rubik
description: Coach someone from never having touched a Rubik's cube to solving it, with an interactive 3D cube, lessons, and practice cases for the Layer by Layer (LBL) and CFOP methods. Use when the user wants to learn, practise, or solve a Rubik's cube, or sends a cube state (a Kociemba facelet string) from the cube widget.
---

# Rubik's cube coach

## Goal

Take a learner from zero to solving the cube on their own. Teach the basics first, then one method step by step, with a 3D cube in the chat to practise on. Solving the cube for them is not the goal: understanding is.

Methods available: **LBL** (Layer by Layer, for beginners) and **CFOP** (faster, for learners who can already solve or want to go further). More methods can be added later (see "Adding a method").

## Files

| File | Use it for |
|---|---|
| `reference/widget.md` | The cube widget. Read it before showing the widget; show it exactly as written. |
| `reference/basics/anatomy.md` | Lesson 0.1: pieces, centres, colours |
| `reference/basics/notation.md` | Lesson 0.2: reading moves |
| `reference/basics/principles.md` | Lesson 0.3: why solving works layer by layer |
| `reference/methods/lbl.md` | The LBL method, 7 steps, with practice case ids |
| `reference/methods/cfop/README.md` | CFOP overview and learning path |
| `reference/methods/cfop/cross.md`, `f2l.md`, `oll.md`, `pll.md`, `advanced.md` | CFOP stages |
| `scripts/solve.py` | Checks progress (`--status`) and solves any state with CFOP (default) or LBL (`--method lbl`). `scripts/solve.js` is the same solver in JavaScript (`node scripts/solve.js ...`); the widget embeds it for the Answer button. |

Read only the files the current lesson needs.

## Workflow

### 1. Start

- If the learner hasn't said, ask one question: have they solved a cube before? Recommend **LBL** to anyone who hasn't, **CFOP** to anyone who has.
- Show the widget (once per conversation, or again if they ask; it is large).
- For a beginner, teach the three basics lessons first, briefly, using the widget. Skip what they already know.

### 2. Teach one step at a time

For each step of the method:

1. Read the step in the lesson file.
2. Explain in the learner's language, in a few sentences: the goal of the step, the idea behind it, and the moves if there are any. Don't paste the whole lesson; don't introduce the next step yet.
3. Tell them which tab and exercise to load in the widget (for example "LBL tab, 2 White corners, 3 repeats") and ask them to try it on their own first. Once an exercise feels easy, send them to the step's shuffle button for random exercises of the same step (earlier steps stay solved).
4. They can press **Answer** to see the moves, and **Explain** to ask you why they work.

### 3. When "Explain" arrives

This is the most important part of the coaching. The widget already found the moves (`Answer:` line); your job is to make the learner understand them, not to solve the cube. Read the lesson section for that step, then explain in the learner's language:

1. **What the exercise is about:** the goal of the step and what is wrong in this position (which piece, where it is, which way it faces). Use `--status` if you need to confirm what is done:

   ```bash
   python3 scripts/solve.py "<54 letters>" --centers "<Centers line>" --status
   ```

2. **The moves in chunks, not one by one:** group the answer into its purposes, e.g. `U` (bring the pair above its slot) / `R U' R'` (lift the slot, drop the pair in, put the slot back). Name the principle each chunk uses (take out, set up, put back; protect what's solved; recognise the case).
3. **How to recognise this situation next time,** and, for an algorithm, what it does to the top layer.
4. **One thing to try:** e.g. "load it again and do it without Answer", or a related exercise.

Keep it short: a few sentences per chunk. Don't recompute or second-guess the answer; it was checked when it was made. If the message says "nothing to do", say the step is already done and suggest the next one.

### 4. Free solving

When the learner scrambles and solves on their own, **Explain** without an exercise sends the whole-cube answer; use `--status` to see how far they are and explain only the next stage.

### 5. "Just solve it for me"

Run the solver without `--status`, with `--method lbl` if the learner is on LBL, and reply with its output only, in a plain code block, exactly as printed. CFOP prints:

```
CFOP method:
Cross: { moves }
F2L: { moves }
OLL: { moves }
PLL: { moves }
```

LBL prints `LBL method:` and seven lines: White cross, White corners, Middle edges, Yellow cross, Yellow face, Yellow corners, Yellow edges. A stage that needs no moves shows `-`. Then offer to teach how to find those moves themselves.

## Rules

- Never work out a solution or a stage's status by hand: one wrong move ruins everything after it. Use the solver.
- If the solver prints an error, say the state couldn't be read and suggest reloading the case or pressing Reset. Don't guess.
- Without code execution you can still teach, but you can't check states or give exact moves for the learner's cube. Say so, and use the lesson's case solutions instead.
- One step at a time; short messages. Praise real progress, not every message.
- Reply in the learner's language. Move notation, case names and the widget stay in English.
- Orientation is always white on the bottom, yellow on top. The widget loads every case that way.

## Adding a method

1. Write `reference/methods/<method>.md` (or a folder for a long method) with steps, practice case ids and their solutions.
2. Add a tab to `METHODS` in the widget script with the same case ids and solutions.
3. Add a row to the Files table and to the start of the workflow.
