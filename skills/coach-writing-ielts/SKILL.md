---
name: coach-writing-ielts
description: Correct an IELTS Writing essay like an IELTS teacher, fixing grammar, academic vocabulary, and logic inside the text, with band estimates. Use when the user sends IELTS Task 1 or Task 2 writing.
---

# IELTS teacher-style correction

## Goal

An IELTS teacher does more than fix grammar. They replace everyday words with academic ones, rewrite clumsy structures, and cross out examples that don't make sense, because all of that decides the band. This skill marks those changes **right inside the essay**, like a teacher's red pen, then estimates the band for each of the four criteria.

Use `coach-writing` instead for everyday text (emails, messages, posts). There, swapping "taxes" for "taxation" is over-correction; in an IELTS essay it is the point.

## Workflow

1. **Identify the task.**
   - Task 1 Academic (chart, graph, table, map, process), Task 1 General (letter), or Task 2 (essay).
   - For Task 2, name the question type: discuss both views, agree or disagree, advantages and disadvantages, problem and solution, or two-part question.
   - If the user didn't give the prompt, infer it from the introduction and say so in one sentence. Don't stop to ask.
   - If the text is only part of an essay (for example an introduction and one body paragraph), correct what is there and don't penalise length or a missing conclusion.
2. **Find what to fix**, in the five groups below. Always keep the writer's position and argument.
3. **Mark up** with the symbols table.
4. **Display** with the inline HTML widget (see "Widget" below). If no display tool is available, use the markdown fallback.
5. **Below the widget**, write the band estimate and a short note (see "Below the widget").

## What to fix

All five groups are **required fixes (red)** and are applied in the clean version.

### 1. Language errors

Grammar (tense, agreement, articles, prepositions, missing or extra words), spelling, wrong word, wrong collocation, and sentences built on first-language structure. Infer the first language only from the error patterns; never assume it.

### 2. Academic vocabulary

Replace words that are correct but too everyday for an essay with the academic or more precise term.

- taxes → taxation; aid → welfare programmes; careers → employment opportunities; chaos → unrest; under threat → at risk.
- Replace only when the new word means the same thing in this sentence. Don't use rare or showy words: the target is natural band 7-8 language, not a thesaurus.
- Don't replace a word that is already appropriate just to show a synonym.

### 3. Natural collocation over minimal patches

If adding or changing one word makes the sentence grammatical but still awkward, rewrite the phrase.

- "reducing inequality should be focused" → not "should be focused on", but "greater attention should be focused on reducing inequality".
- "should be first prioritized" → "should be the top priority".

### 4. Clear structure

Turn heavy or awkward constructions into a clear clause.

- "Without the governments capable of redistributing resources" → "If governments fail to redistribute resources".
- Combine choppy simple sentences into complex ones where the essay has too few (relative clauses, although, because, which).

### 5. Logic and idea quality

Read each example, reason, and consequence and check it.

- **Overlap:** an item already covered by another in the same list ("theft" inside "illegal activities"). Remove it or merge the two.
- **Wrong cause and effect:** a result that is really a cause or a restatement ("increased poverty rates" given as a result of economic inequality). Replace it with a real consequence ("social resentment and class tensions").
- **Unsupported claim:** a statement with no reason or example after it. Mark it and say what is missing; don't invent the support.
- **Off-topic sentence:** one that doesn't serve the paragraph's main idea.

Replace a flawed idea only with a closely related one the writer could plausibly have meant. Never change their position or add a new argument. Because the markup can't show *why* an idea was replaced, every logic fix must be explained in the note below the widget.

### Repetition

The same word or sentence opener used three or more times in a paragraph ("This can lead to", "social") is a required fix: vary it or rewrite the sentence.

### Optional suggestions (blue)

Use blue only for a change that is a matter of taste, where the original is already at the target level. At most one or two per paragraph. Blue changes are not applied in the clean version.

## Alternatives

Where two or three replacements are equally good, give them separated by " / " so the learner gains vocabulary ("people on low incomes / low-income people"). At most three. The clean version uses the first one, so put the best one first.

## Symbols

| Situation | How to mark it |
|---|---|
| Wrong or too-everyday word | Strike through the word (red); write the replacement directly above in red italics |
| Missing word | A caret **∧** under the gap; the word to insert written above |
| Extra word, or an idea to remove | Strike through; write nothing above it |
| Awkward phrase, clumsy structure, flawed idea, or word-for-word translation | Strike through the whole phrase or sentence; write the new version on the line above in red italics |
| Alternatives | Written above like any replacement, separated by " / " |
| Optional suggestion | Dotted blue underline; suggestion above in blue italics |

A replacement written above a short word must not be much longer than the word itself, or it will overlap its neighbours. If the replacement (with its alternatives) is longer than about 25 characters or clearly wider than the original, use the whole-phrase rewrite form instead of the above-the-word form.

Don't use curved arrows or other invented symbols.

## Below the widget

Write these in the user's language, in this order. Keep it short and don't repeat what the widget already shows.

1. **Band estimate.** One line per criterion with a band and the main reason, then the overall band:
   - Task Response (Task 2) or Task Achievement (Task 1): is every part of the question answered, is the position clear, are the ideas developed and supported.
   - Coherence and Cohesion: paragraphing, topic sentences, logical order, linking words used accurately and not mechanically.
   - Lexical Resource: range, precision, collocation, spelling.
   - Grammatical Range and Accuracy: mix of simple and complex sentences, share of error-free sentences.

   Give half bands where they fit. Say once that this is an estimate, not an official score. For a partial essay, say the estimate covers only the part submitted and that Task Response can't be fully judged.
2. **Logic fixes explained.** One sentence for each idea you removed or replaced, saying why.
3. **The pattern to work on.** The one or two things that would raise the band most (for example article use, everyday vocabulary, undeveloped ideas). If errors repeat because of first-language translation, name the pattern in one sentence.
4. **Structure check**, only if something is wrong: missing thesis or overview, body paragraph without a topic sentence, missing conclusion, or under the word limit (150 for Task 1, 250 for Task 2).
5. Ask whether they want a fuller explanation or a rewrite task to practise.

## Rules

- Reply in the language the user writes their request in. The essay stays in English. Translate the legend, the heading, and the button labels.
- Keep the writer's position, argument, and voice. The corrected essay must still be theirs.
- Correct to about one band above the writer's current level, not to band 9. A correction the learner can't yet produce teaches nothing.
- The copy button copies the **clean version**: all required fixes applied, the first alternative chosen, blue suggestions not applied.
- Long text: one copy button per paragraph, plus one that copies the whole text.
- Be honest about the band. Don't inflate it to encourage, and don't deflate it to seem strict.
- Tell spelling apart from grammar, and vocabulary upgrades apart from errors, when you describe them in the note.
- Reread the essay once before displaying, so no error is missed.
- Don't give the corrections as a table unless the user asks.

## Widget

This skill shares its widget with `coach-writing`. Read [`../coach-writing/reference/widget.md`](../coach-writing/reference/widget.md) (relative to this skill's folder) before building the widget. It holds the HTML template, the markup for each kind of mark, and the technical notes. Use it as written; don't rebuild the styles from memory.

If that file can't be read, the `coach-writing` skill is not installed next to this one. Use the markdown fallback below and tell the user to install both skill folders.

Legend entries for this skill:

```html
<span><s>word</s> <b>better word</b> : replace</span>
<span><s>word</s> alone : remove</span>
<span><b>word</b> above ∧ : missing word</span>
<span><s>phrase</s> → <b>new phrase</b> : rewrite</span>
<span><b>a / b</b> : either works</span>
<span><u>word</u> <b class="u">option</b> : optional</span>
```

Summary for the `<h2>`: "IELTS essay corrected in teacher style." Copy button labels: "Copy corrected paragraph" for a paragraph, "Copy whole corrected essay" for the whole essay.

## Markdown fallback (no widget)

Use markdown: `~~word~~ **better word**` for a replacement; `~~word~~` alone for a removal; `(∧ **word**)` for a missing word; `~~old phrase~~ → **new phrase**` for a rewrite; `**a / b**` for alternatives; `_word_ (optional: *option*)` for a blue suggestion. Then give the clean version in a code block so the user can copy it, followed by the band estimate.

Example: Large economic disparities can cause (∧ **the poor**) to struggle to access education and better ~~careers~~ **employment opportunities**. ~~Without the governments capable of redistributing~~ → **If governments fail to redistribute** resources through ~~taxes~~ **taxation**, social stability will be undermined.
