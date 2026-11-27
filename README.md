# coach-me

Claude skills for learning English. Small and focused: each skill does one thing.

## Skills

| Skill | Command | What it does |
|---|---|---|
| [`writing`](./skills/writing) | `/coach-me:writing` | Corrects your English writing like a teacher with a red pen: wrong words are struck through with the fix written above, missing words get a ∧ caret, unclear sentences are crossed out and rewritten. Optional blue suggestions upgrade basic vocabulary, sentence structure, and cohesion. Includes a button to copy the clean version. |

More skills may be added over time. Each one lives in its own folder under `skills/` with its own `SKILL.md`.

## Install

### Claude Code (plugin)

```bash
claude plugin marketplace add quando1910/coach-me
claude plugin install coach-me@coach-me
```

This installs every skill in the repo. Skills only run when you call them or when your request matches, so the ones you don't use stay out of the way.

### Claude app (single skill)

1. Download the folder of the skill you want (for example `skills/writing/`), or just its `SKILL.md`.
2. Add it to Claude as a custom skill. Installation steps can change, so check Anthropic's current documentation on adding custom skills.

You don't need the rest of the repo.

## License

Add a license of your choice (MIT is a common default).
