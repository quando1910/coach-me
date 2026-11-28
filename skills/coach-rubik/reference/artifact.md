# Rubik's cube artifact

The cube as a claude.ai Artifact page. This is the default way to show the cube: the page saves the cube to the artifact's database, so you can read the learner's cube yourself and play moves on it. The learner never has to send the state.

It is the same cube as the widget (`widget.md` describes the controls), with two differences: it has no Ask AI button, and it remembers the cube when the page is closed and opened again.

## When to use the widget instead

Use `widget.md` for the rest of the conversation when:

- the learner says the artifact doesn't open, or opens blank. On iPhone, the Claude app needs iOS 26 or later to open artifacts. Tell them updating to iOS 26 fixes it, and show the widget now.
- you have no tool to publish an artifact with a database, or no tool to read that database.

## Show the cube

Use one artifact per learner and keep its link.

1. **Find an existing one.** List the learner's artifacts and look for the title "Rubik Coach". If there is one, read it: when its `coach-rubik-version` meta tag is older than the one in `assets/cube-artifact.html`, or missing, publish the new files to the same URL (step 2). Otherwise give the learner its link as it is; its saved cube is waiting there.
2. **Publish.** The page is `assets/cube-artifact.html`, with `assets/cube.js` as a supporting file published at the path `cube.js`. Declare the capabilities `{"db": {}, "user": {}}`. Don't edit or retype either file: publish them from disk as they are.
3. Give the learner the link in one line ("Open the cube: <link>"), and tell them that you can see the cube there, so they can simply ask.

## Read the cube

Read the document `state` in the collection `cube` (with the `ArtifactData` tool, or `read_db` with a `get`). Fields:

| Field | Meaning |
|---|---|
| `facelets` | Kociemba facelet string, face order U R F D L B (pass it to the solver) |
| `centers` | Which colour each face centre has, e.g. `U=yellow, R=orange, ...` (the solver's `--centers` value) |
| `method` | The open tab: `LBL` or `CFOP` (use it for `--method`) |
| `exercise`, `goal` | The loaded exercise, e.g. `CFOP · F2L · 3 (cfop-f2l-3)`, and its goal; empty in Practice |
| `history` | Moves made since the exercise was loaded |
| `solved` | Whether the whole cube is solved |
| `updatedAt` | When the page last saved |
| `restore`, `lastCommand` | Used by the page itself; ignore them |

Read it again every time the learner asks about the cube: they may have turned it since. If `updatedAt` is much older than you'd expect, the page may not be open; say what you see and ask them to open the link.

The fixed exercises' solutions are in the lesson files under the exercise id. For anything else, run the solver on `facelets` and `centers`.

## Play moves on the cube

Write the document `command` in the collection `cube` with a new `id` each time (e.g. `solve-<time>`) and `moves` (a move string, e.g. `R U R' U'`). The open page plays them with animation. Pass the version you last read when the document already exists. Moves are relative to how the cube is held right now, which is how the solver prints them.
