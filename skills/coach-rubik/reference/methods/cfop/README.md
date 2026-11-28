# Method: CFOP

The method most speedcubers use: about 55-60 moves per solve. It is LBL with two upgrades: the first two layers are built as corner-edge pairs (F2L) instead of corners then edges, and the last layer is done in two big steps (OLL, PLL).

Orientation: **white cross on the bottom, yellow on top.**

| Stage | Goal | File | Widget section |
|---|---|---|---|
| Cross | White cross on the bottom, sides matching | `cross.md` | Cross |
| F2L | First two layers, one corner-edge pair per slot | `f2l.md` | F2L |
| OLL | Whole top face yellow | `oll.md` | OLL |
| PLL | Top layer pieces in place: solved | `pll.md` | PLL |

## Learning path

1. **Coming from LBL:** the cross and last layer are almost the same. Spend the time on F2L.
2. **New to cubing:** learn LBL first unless the learner insists. If they insist, teach CFOP in this order: cross, F2L with the basic cases, 2-look OLL, 2-look PLL. That is 4 + 6 + 2 + 7 + 6 algorithms or patterns.
3. **After a first full solve:** `advanced.md` (full OLL/PLL, look-ahead, cross on the bottom from the start).

## Hints from the solver

`scripts/solve.py` (or `solve.js`) solves any state stage by stage with this method. Use it to give hints, not to replace practice: give only the next stage, or only its first few moves, unless the learner asks for the whole solution.
