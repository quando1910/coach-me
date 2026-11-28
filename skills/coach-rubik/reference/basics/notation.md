# Lesson 0.2: Reading moves (notation)

Every algorithm in every method is written this way. The widget's face labels (U, D, L, R, F, B) help the learner match letters to faces.

## Face turns

Hold the cube with one face pointing at you. Each letter turns one outer layer **clockwise as seen when looking straight at that face**.

| Letter | Face | Clockwise means (from the learner's view) |
|---|---|---|
| U | Up (top) | front stickers move to the left |
| D | Down (bottom) | front stickers move to the right |
| R | Right | front stickers move up |
| L | Left | front stickers move down |
| F | Front | top stickers move to the right |
| B | Back | top stickers move to the left |

- `'` (prime) means counter-clockwise: `R'` moves the right layer's front stickers down.
- `2` means a half turn (180°); direction doesn't matter: `U2`.

## Slices and whole-cube turns

- `M`: middle layer between L and R, turns like `L`.
- `E`: middle layer between U and D, turns like `D`.
- `S`: middle layer between F and B, turns like `F`.
- `x`, `y`, `z`: turn the whole cube like `R`, `U`, `F`. The cube doesn't change; you only look at it from another side.

In the widget, dragging a layer turns it; dragging a centre label turns the whole cube (x, y or z).

## Reading an algorithm

`R U R' U'` means: right clockwise, top clockwise, right counter-clockwise, top counter-clockwise. Read left to right, keep the cube still unless the algorithm says x, y or z.

The reverse of an algorithm undoes it: reverse the order and flip each direction. The reverse of `R U R' U'` is `U R U' R'`.

## Practice

1. Reset, then type `R U R' U'` in the input and press Step four times, saying each move aloud.
2. Ask the learner to type the reverse and press Play. The cube should be solved again.
3. Repeat `R U R' U'` six times with Play: the cube comes back to solved. This is a good first "algorithm".
