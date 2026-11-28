# CFOP stage 1: Cross

Goal: four white edges on the bottom, each side sticker matching its side centre.

Same goal as LBL step 1, but solved directly on the bottom instead of via the daisy, in 8 moves or fewer.

## How to think about it

- Solve one edge at a time, but keep the ones already placed: after `F2` puts an edge in, use `U` or `D` turns to line up the next one, not turns that would lift the first one out.
- An edge in the top layer, white facing up: turn `U` until it is above its centre, then turn that face twice (`F2`).
- An edge in the top layer, white facing out: turn `U` so it is above a neighbour of its home, then bring it down sideways, e.g. `U' R' F R` style: lift the side (`R'`), place (`F`), restore (`R`).
- An edge in the middle layer: one quarter turn of its side face drops it to the bottom; fix its position with `D` turns, then restore anything you moved.
- An edge in the bottom layer but wrong: lift it out with a half turn of its side, then treat it as a top-layer edge.
- Relative position matters, not absolute: two cross edges that are correct relative to each other can be fixed together with one `D` turn at the end.

## Practice in the widget

The CFOP tab has two cross cases and a random one.

Cases 1-2: the white plus is already on the bottom, but two edges are swapped, so their side stickers don't match the centres. A common beginner trap: the plus looks done but isn't. The first-layer corners are mixed into the top layer, so the bottom shows only the plus, as it would right after building it. Both solutions are 5 moves, the shortest possible; they finish the cross, not the whole cube, so the widget will still say "Not solved" (check with `--status`).

- [cfop-cross-1] Two **neighbouring** edges swapped (front and right): `F2 U' R2 U F2`. Lift the front edge to the top (`F2`), move it above the right slot (`U'`), swap it with the right edge (`R2`), bring that one back above the front (`U`), put it down (`F2`).
- [cfop-cross-2] Two **opposite** edges swapped (front and back): `L2 R2 D2 L2 R2`. Lift both side layers (`L2 R2`), turn the bottom half a turn (`D2`), put them back.

The shuffle button next to Cross makes a random cross to practise: the whole cube is scrambled and the cross is never already done. Ask the learner to build the cross, then check with `--status` and compare with the solver's cross for the same state.

For cases 1-2, first ask the learner to turn `D` and notice that it never fixes both swapped edges: two edges must be taken out.

Simple one-edge cases are in the LBL tab (lbl-cross-1, lbl-cross-2) for warming up.

## Coaching tips

- Let the learner look at the cross from below (drag outside the cube) after each edge.
- If they need more than about 12 moves, show the solver's cross for the same state and point out the move they could have saved.
