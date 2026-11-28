# coach-rubik

Learn to solve a 3x3 Rubik's cube from zero, with a coach and a 3D cube in the chat. Claude teaches the basics (pieces, notation, how solving works), then a method step by step: **Layer by Layer** for beginners, **CFOP** for going faster. Each step has practice cases you load onto the cube, try, and send back to the coach for feedback.

## Use it

**Type `/coach-rubik` to start a lesson.**

- Tell Claude whether you have solved a cube before; it picks the method and starts teaching.
- On the cube: drag a layer to turn it, drag a centre label to rotate the whole cube, drag outside the cube to change the view. Scramble and Reset are the icons in the bottom-left corner.
- The **LBL** and **CFOP** tabs list each step's exercises, plus a shuffle button for a random exercise of that step. Click one to set it up on the cube and try to solve it.
- **Answer** (light bulb, bottom-right of the cube) shows the moves, solved with the method of the tab you are on; **Explain** (speech bubble) asks Claude why those moves work, which is where the coaching happens.
- Type moves in the input and press Play to watch them. The History row has back and forward buttons to replay your moves one at a time.
- Ask "just solve it" and Claude replies with the moves for each CFOP stage:

  ```
  CFOP method:
  Cross: { x2 R' }
  F2L: { R U2 R' }
  OLL: -
  PLL: -
  ```

## How it checks your cube

[`scripts/solve.py`](scripts/solve.py) reads the cube state, reports which stages are done (`--status`), and solves any state with CFOP or, with `--method lbl`, Layer by Layer. [`scripts/solve.js`](scripts/solve.js) is the same solver in JavaScript and gives identical answers. Every solution is applied to the state and checked before it is shown.

The checks run in Claude's code execution, so it must be turned on (it already is if skills work for you). The cube itself ([`assets/cube.js`](assets/cube.js)) loads from jsDelivr, so the chat needs internet access to show it.
