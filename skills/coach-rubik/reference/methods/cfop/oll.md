# CFOP stage 3: OLL (orient the last layer)

Goal: the whole top face yellow. Pieces don't need to be in place yet.

Full OLL has 57 cases (one algorithm each). Beginners use **2-look OLL**: first the yellow edges (cross), then the yellow corners. 2 + 7 algorithms.

## Look 1: yellow cross

Same as LBL step 4.

| Id | Case | Moves |
|---|---|---|
| cfop-oll-line | Line: hold it horizontal | `F R U R' U' F'` |
| cfop-oll-l | L: hold it at back and left | `F U R U' R' F'` |
| (dot) | No yellow edges | do the line case, then the L case |

## Look 2: yellow corners (edges already yellow)

Count the yellow corner stickers on top, then look at the sides.

| Id | Name | How to recognise | Moves |
|---|---|---|---|
| cfop-oll-sune | Sune | 1 corner up; hold it front-left; the front-right corner's yellow faces front | `R U R' U R U2 R'` |
| cfop-oll-antisune | Anti-Sune | 1 corner up; hold it back-right; the front-right corner's yellow faces right | `R U2 R' U' R U' R'` |
| cfop-oll-h | H | 0 up; yellow on left and right, two each | `R U R' U R U' R' U R U2 R'` |
| cfop-oll-pi | Pi | 0 up; yellow on left side twice, one each front/back | `R U2 R2 U' R2 U' R2 U2 R` |
| cfop-oll-headlights | Headlights | 2 up, side by side at the front; the other two show yellow on the back face | `R2 D' R U2 R' D R U2 R` |
| (T) | T | 2 up, side by side; yellow on the two sides facing each other | `r U R' U' r' F R F'` |
| (Bowtie) | Bowtie | 2 up, diagonal | `F' r U R' U' r' F R` |

`r` is a wide move: the right face and the middle slice together (like `R` plus `M'`). The widget can't drag-turn two layers at once, so T and Bowtie have no practice case yet; teach them with LBL's Sune repetition as a fallback (see `lbl.md` step 5).

## Coaching tips

- Load the case, ask the learner to count yellow stickers on top and name the case before doing anything.
- Sune and Anti-Sune solve every corner case by repetition; the other algorithms just do it in one go.
