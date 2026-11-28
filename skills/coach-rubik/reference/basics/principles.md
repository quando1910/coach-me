# Lesson 0.3: How solving works

These ideas explain why every method looks the way it does. Teach them in a few sentences each, then come back to them whenever the learner is stuck.

1. **Layer by layer.** Solve the bottom layer, then the middle, then the top. Each step only has to protect what is already done, which keeps every step small. Both LBL and CFOP work this way; the white layer goes on the bottom so the unsolved top is easy to see.
2. **Take out, set up, put back.** To move a piece into a solved layer without breaking it, lift the slot up (e.g. `R`), move the piece into position with the free top layer (`U`), then put the slot back (`R'`). Nearly every first-two-layer move, `R U R'`, `F' U' F`, is this pattern.
3. **The top layer is your workspace.** While the bottom two layers are being built, `U` turns never break anything solved, so use them freely to line pieces up.
4. **Algorithms are tools for the last layer.** Once the first two layers are done, you can't take out and put back without breaking them, so fixed sequences (algorithms) move only a few top pieces and restore everything else. Learn what each algorithm does to the top layer, then recognise when to use it.
5. **Recognise, then act.** Every step is: look at the cube, find which case it is, turn the top layer so the case is in the standard position, then do the moves. Most beginner mistakes are in the "find and position" part, not the moves.
6. **Look ahead (later).** Faster solvers find the next piece while doing the current moves. Beginners should not worry about speed.

## When the learner is lost

- Ask them to press Reset and load the current lesson's case again; practising one case many times builds recognition.
- If they broke a solved part, explain which move took a piece out without putting it back (principle 2).
