# Method: Layer by Layer (LBL)

The beginner's method: few, short algorithms, about 100-150 moves per solve. Recommend it to anyone who has never solved a cube. After LBL, CFOP mostly means learning F2L (see `cfop/README.md`).

Orientation used throughout: **white on the bottom, yellow on top.** In the widget, a freshly loaded case already has white on the bottom.

The widget's **LBL** tab has one section per step below, each with practice cases and a shuffle button for random ones. Case ids in brackets match the widget. `scripts/solve.py --method lbl` solves any state with exactly these steps and algorithms (corner trigger `R U R' U'` from each slot: `R`, `B`, `L` or `F` version).

## Step 1: White cross (the daisy)

Goal: four white edges on the bottom, each side sticker matching its side centre.

1. **Daisy:** bring the four white edges to the top, around the yellow centre, white facing up. Find a white edge anywhere and turn its side so the white sticker comes up next to the yellow centre. If that top spot already has a white edge, turn `U` first so you don't knock it out.
2. **Drop each petal:** turn `U` until a petal's side sticker matches the centre below it, then turn that face twice (`F2` if it is in front). Repeat for all four.

Practice: [lbl-cross-1] one edge, `F2`. [lbl-cross-2] one edge that needs a `U` first, `U' R2`.

Check: the learner turns the cube upside down (drag a centre label) and sees a white plus whose arms match the side centres.

## Step 2: White corners (first layer)

Goal: the whole white layer, sides matching.

1. Find a corner with white in the top layer. Turn `U` until it sits directly above its home (its two side colours match the two centres around the slot below).
2. Turn the cube (`y`) so that slot is front-right. Repeat `R U R' U'` until the corner drops in correctly: it takes 1, 3 or 5 repeats.
3. A white corner stuck in the bottom layer in the wrong place or twisted: hold it front-right and do `R U R' U'` once to lift it into the top layer, then go back to 1.

Practice: [lbl-corner-1] needs `R U R' U'` once. [lbl-corner-3] three times. [lbl-corner-5] five times.

Why it works: principle 2, take out (`R`), move (`U`), put back (`R'`), undo the U (`U'`). It only ever disturbs the front-right slot and the top layer.

## Step 3: Middle layer edges

Goal: first two layers done.

1. Find a top-layer edge with no yellow. Turn `U` until its front sticker matches the front centre (an upside-down T).
2. If its top colour matches the **right** centre: `U R U' R' U' F' U F`.
3. If it matches the **left** centre: `U' L' U L U F U' F'`.
4. An edge stuck in the middle layer the wrong way round: put any top edge into that slot with step 2 or 3 to push it out, then insert it properly.

Practice: [lbl-edge-right] edge goes right. [lbl-edge-left] edge goes left.

## Step 4: Yellow cross

Goal: a yellow plus on top (corners don't matter yet).

Algorithm: `F R U R' U' F'`.

- **Dot** (no yellow edges up): do it once, you get an L.
- **L:** turn `U` so the L points to the back and the left (top-left corner of the face as you look down), do it once, you get a line.
- **Line:** turn `U` so the line is horizontal (left to right), do it once, you get the cross.

Practice: [lbl-ycross-line] line case. [lbl-ycross-l] L case, solved with `F U R U' R' F'` (same idea, mirrored inner moves).

## Step 5: Yellow face

Goal: the whole top yellow.

Algorithm (Sune): `R U R' U R U2 R'`.

- **One yellow corner up (a fish):** put it front-left, do Sune. Done, or you get another case.
- **No yellow corners up:** turn `U` until the front-left corner has its yellow sticker facing **left**, do Sune.
- **Two yellow corners up:** turn `U` until the front-left corner has its yellow sticker facing **front**, do Sune.

Repeat until the face is yellow (at most three Sunes).

Practice: [lbl-yface-sune] one corner up.

## Step 6: Yellow corners in place

Goal: each top corner in its home (sides matching both centres).

Algorithm: `R' F R' B2 R F' R' B2 R2`. It keeps the **front-left** corner where it is and cycles the other three.

1. Find a corner already in its home and hold it front-left. Do the algorithm, then check; do it again if needed.
2. No corner in place: do it once from anywhere, then step 1.

Practice: [lbl-corners] one cycle.

## Step 7: Yellow edges in place (finished)

Algorithms (they keep the **back** edge in place):

- `R U' R U R U R U' R' U' R2` (Ua)
- `R2 U R U R' U' R' U' R' U R'` (Ub, the reverse)

1. Find a solved edge (side sticker matches its centre) and hold it at the back. Do Ua; if it isn't solved, do it again (or do Ub).
2. No edge solved: do Ua once from anywhere, then step 1.

Practice: [lbl-edges-ua], [lbl-edges-ub].
