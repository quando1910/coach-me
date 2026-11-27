# coach-rubik

Learn to solve a 3x3 Rubik's cube with an interactive 3D cube in the chat. Turn the cube yourself, load sample CFOP cases, and press **Ask coach** to get the moves for each stage of the CFOP method (Cross, F2L, OLL, PLL) for the state you are looking at.

## Use it

**Type `/coach-rubik` to open the cube.**

- Drag a layer to turn it; drag outside the cube to change the view.
- Use the move pad for single turns, Scramble for a random state, and Reset to start over.
- Cross, F2L, OLL, and PLL load a sample case at the start of that stage. Play runs the stage's algorithm; Step runs it one move at a time.
- **Ask coach** sends the current state to Claude, which replies like this:

  ```
  CFOP method:
  Cross: { x2 R' }
  F2L: { R U2 R' }
  OLL: -
  PLL: -
  ```

  A `-` means that stage needs no moves.

## How it solves

The solution comes from [`scripts/solve.py`](scripts/solve.py), a small CFOP solver in plain Python. It builds the white cross at the bottom, inserts the four F2L pairs, then orients and permutes the last layer from a set of standard algorithms. Every solution is applied to the state and checked before it is shown. Solutions follow the CFOP stages rather than being the shortest possible.

The solver runs in Claude's code execution, so code execution must be turned on (it already is if skills work for you).
