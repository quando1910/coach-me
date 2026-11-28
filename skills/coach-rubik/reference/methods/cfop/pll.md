# CFOP stage 4: PLL (permute the last layer)

Goal: the top layer pieces in their homes, which solves the cube. The top face is already yellow.

Full PLL has 21 cases. Beginners use **2-look PLL**: corners first, then edges. 2 + 4 algorithms.

## Look 1: corners

Look at each side of the top layer for **headlights**: two corners on the same side with the same colour.

| Id | Case | Hold | Moves |
|---|---|---|---|
| cfop-pll-t | Headlights on one side (two corners swapped next to each other) | headlights on the left | `R U R' U' R' F R2 U' R' U' R U R' F'` (T-perm) |
| cfop-pll-y | No headlights anywhere (two corners swapped diagonally) | any | `F R U' R' U' R U R' F' R U R' U' R' F R F'` (Y-perm) |
| | Headlights on all four sides | - | corners done, go to look 2 |

## Look 2: edges (corners already solved)

| Id | Case | Hold | Moves |
|---|---|---|---|
| cfop-pll-ua | Three edges cycle, one side solved | solved side at the back | `R U' R U R U R U' R' U' R2` (Ua) |
| cfop-pll-ub | Same, cycling the other way | solved side at the back | `R2 U R U R' U' R' U' R' U R'` (Ub) |
| cfop-pll-h | Opposite edges swapped (both pairs) | any | `M2 U M2 U2 M2 U M2` (H) |
| cfop-pll-z | Neighbouring edges swapped (both pairs) | front edge swapped with left, right edge swapped with back | `M' U M2 U M2 U M' U2 M2 U'` (Z) |

Not sure if it's Ua or Ub: do Ua; if the cube isn't solved, do it again.

## Coaching tips

- After each look, turn `U` until the solved parts line up with their centres before judging the case.
- The T-perm and Ua are also used in LBL step 7 and step 6 thinking, so learners coming from LBL already know part of this.
