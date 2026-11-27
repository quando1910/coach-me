# coach-me

Claude skills for learning English. Small, focused, and made to be used one at a time: take only the ones you want.

## Skills

| Skill | What it does |
|---|---|
| [`english-teacher-correction`](./english-teacher-correction) | Corrects your English writing like a teacher with a red pen: wrong words are struck through with the fix written above, missing words get a ∧ caret, unclear sentences are crossed out and rewritten. Optional blue suggestions upgrade basic vocabulary, sentence structure, and cohesion. Includes a button to copy the clean version. |

More skills may be added over time. Each one lives in its own folder with its own `SKILL.md`, so you can install just one.

## How `english-teacher-correction` looks

Red marks are errors to fix. Blue marks are optional upgrades.

<!-- Add a screenshot of the widget here -->

## Install a single skill

1. Download the folder of the skill you want (for example `english-teacher-correction/`), or just its `SKILL.md`.
2. Add it to Claude as a custom skill. Installation steps can change, so check Anthropic's current documentation on adding custom skills.

You don't need the rest of the repo.

## Use it

Once installed, send Claude some English text and ask it to check or correct it, for example:

> Check my writing: I want go to the supermarket because my sister like fruit.

You can write the request in your own language. Claude replies in that language and keeps the corrected text in English.

## License

Add a license of your choice (MIT is a common default).
