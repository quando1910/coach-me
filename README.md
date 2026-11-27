# coach-me

Claude skills for learning English. Small and focused: each skill does one thing.

## Skills

| Skill | Command | What it does |
|---|---|---|
| [`coach-writing`](./skills/coach-writing) | `/coach-writing` | Corrects your English writing like a teacher with a red pen: wrong words are struck through with the fix written above, missing words get a ∧ caret, unclear sentences are crossed out and rewritten. Optional blue suggestions upgrade basic vocabulary, sentence structure, and cohesion. Includes a button to copy the clean version. |
| [`coach-writing-ielts`](./skills/coach-writing-ielts) | `/coach-writing-ielts` | Corrects an IELTS Writing essay like an IELTS teacher: besides grammar, it replaces everyday words with academic ones, rewrites awkward phrases, and crosses out examples that overlap or don't follow logically. Ends with a band estimate for each of the four IELTS criteria. |

More skills may be added over time. Each one lives in its own folder under `skills/` with its own `SKILL.md`. Files that more than one skill uses live in `reference/`.

## Install

### Claude Code (plugin)

```bash
claude plugin marketplace add quando1910/coach-me
claude plugin install coach-me@coach-me
```

This installs every skill in the repo. Skills only run when you call them or when your request matches, so the ones you don't use stay out of the way.

### Claude app

The skills share files in [`reference/`](./reference) (for example the correction widget in `reference/writing/widget.md`), so a skill folder on its own is not complete. Install the whole repo as a plugin where you can.

If you add a single skill folder by hand as a custom skill, it still works, but it shows corrections as plain markdown instead of the widget.

## License

Add a license of your choice (MIT is a common default).
