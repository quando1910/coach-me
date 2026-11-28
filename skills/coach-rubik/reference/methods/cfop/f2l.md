# CFOP stage 2: F2L (first two layers)

Goal: the bottom two layers, built as four corner-edge **pairs**. Each pair is a white corner plus the middle edge that belongs next to it; together they fill one slot (front-right, front-left, back-left, back-right).

## Core idea

Instead of inserting the corner, then the edge (LBL steps 2 and 3), join them in the top layer first, then insert both with one take-out/put-back move. Every case uses principle 2: lift the slot, use `U` to bring the pieces together, put the slot back.

Work on the front-right slot; turn the whole cube (`y`) to bring the next empty slot there.

## Basic cases (learn these first)

In every case below the corner sits in the top layer directly above the front-right slot; what changes is where its white sticker faces and where the edge is.

| Id | Corner's white faces | Edge is at | Moves |
|---|---|---|---|
| cfop-f2l-1 | front | top right | `U R U' R'` |
| cfop-f2l-2 | right | top front | `U' F' U F` |
| cfop-f2l-3 | right | top back | `R U R'` |
| cfop-f2l-4 | front | top left | `F' U' F` |
| cfop-f2l-5 | front | top back | `U' R U R' U2 R U' R'` |
| cfop-f2l-6 | **up** | top right | `R U2 R' U' R U R'` |

Cases 1-4 are the four basic inserts: in 1 and 2 the first `U` move joins corner and edge, then three moves insert the pair; in 3 and 4 the three moves join and insert in one go. Case 5 is a "split" case: the pieces are positioned badly, so the first moves set them up for a basic insert. Case 6 shows how to deal with white facing up.

The ids match the widget's CFOP tab. Load a case, ask the learner to look at where the corner and edge are, then show the moves step by step and narrate what each part does (lift, join, put back).

## Rules of thumb

- If corner and edge touch but their colours don't match, they are the wrong way round: separate them (lift, move one away, put back) and join again.
- If the corner is in its slot but twisted, or the edge is in the wrong slot: lift it into the top layer with the slot's three-move insert (`R U R'`), then solve it as a top-layer case.
- If white faces up on the corner: first turn it sideways with `R U2 R'` (or `F' U2 F`), then it is a basic case.
- Beginners can fall back to LBL here: corner with `R U R' U'` repeats, then edge with the middle-layer algorithms. Slower but always works.

## Coaching tips

- Learning F2L is about seeing the pieces, not memorising. Ask "where is the corner? where is its edge? are they touching?" before giving moves.
- Use the solver's F2L output for hints one pair at a time.
