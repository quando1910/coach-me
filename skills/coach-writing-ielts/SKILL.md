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
4. **Display** with the inline HTML widget (template at the end). If no display tool is available, use the markdown fallback.
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

## Widget template (inline HTML)

Use the host's CSS variables so it works in dark mode (`--text-danger`, `--text-accent`, `--text-secondary`, `--bg-neutral`). Keep the positioning values below exactly as they are; they were tuned after several rounds of misalignment.

```html
<h2 class="sr-only">IELTS essay corrected in teacher style.</h2>
<style>
.pg{line-height:2.7;font-size:17px;margin:0;padding:24px 0 0}
.fx{position:relative;display:inline-block;line-height:1.3;text-decoration:line-through;text-decoration-color:var(--text-danger);text-decoration-thickness:1.5px}
.fx b,.ins b,.up b{position:absolute;left:50%;transform:translateX(-50%);bottom:100%;line-height:1;margin-bottom:1px;color:var(--text-danger);font-weight:500;font-style:italic;white-space:nowrap;text-decoration:none;font-size:16px}
.ins{position:relative;display:inline-block;line-height:1.3;width:1.5em;height:1em;vertical-align:baseline}
.ins svg{position:absolute;left:50%;transform:translateX(-50%);bottom:-7px;width:14px;height:10px;color:var(--text-danger)}
.rw{display:inline-block;vertical-align:top;line-height:1.6;margin-top:6px}
.rw i{display:block;color:var(--text-danger);font-weight:500;font-style:italic}
.rw s{display:block;text-decoration-color:var(--text-danger);text-decoration-thickness:1.5px}
.up{position:relative;display:inline-block;line-height:1.3;text-decoration:underline dotted var(--text-accent);text-underline-offset:3px}
.up b{color:var(--text-accent);text-decoration:none}
.ins.u b,.ins.u svg,.rw.u i{color:var(--text-accent)}
.rw.u s{text-decoration:underline dotted var(--text-accent);text-underline-offset:3px}
.lg u{text-decoration:underline dotted var(--text-accent);text-underline-offset:3px}
.lg b.u{color:var(--text-accent)}
.lg{display:flex;flex-wrap:wrap;gap:8px 20px;font-size:13px;color:var(--text-secondary);padding:10px 14px;background:var(--bg-neutral);border-radius:var(--radius);margin:0 0 1rem}
.lg b{color:var(--text-danger);font-weight:500;font-style:italic}
.lg s{text-decoration-color:var(--text-danger)}
.cp{margin-top:8px;font-size:13px;display:inline-flex;align-items:center;gap:6px}
</style>

<div class="lg">
<span><s>word</s> <b>better word</b> : replace</span>
<span><s>word</s> alone : remove</span>
<span><b>word</b> above ∧ : missing word</span>
<span><s>phrase</s> → <b>new phrase</b> : rewrite</span>
<span><b>a / b</b> : either works</span>
<span><u>word</u> <b class="u">option</b> : optional</span>
</div>

<p class="pg">
<span class="fx">The</span> large economic disparities can cause<span class="ins"><b>the poor</b><svg viewBox="0 0 14 10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 9 L7 1.5 L13 9"/></svg></span>to struggle to access education and better <span class="fx">careers<b>employment opportunities</b></span>. This can lead to social issues such as <span class="fx">theft,</span> illegal activities and
<span class="rw"><i>social resentment and class tensions.</i><s>increased poverty rates.</s></span>
<span class="rw"><i>If governments fail to redistribute resources through taxation,</i><s>Without the governments capable of redistributing resources through taxes,</s></span>
social stability will be undermined.
</p>
<button class="cp" data-t="CLEAN PARAGRAPH HERE"><i class="ti ti-copy" aria-hidden="true"></i><span>Copy corrected paragraph</span></button>

<div style="margin-top:1rem">
<button class="cp" data-all="1"><i class="ti ti-copy" aria-hidden="true"></i><span>Copy whole corrected essay</span></button>
</div>

<script>
document.querySelectorAll('.cp').forEach(function(btn){
  var label=btn.querySelector('span');
  var orig=label.textContent;
  btn.addEventListener('click',function(){
    var t=btn.getAttribute('data-t');
    if(btn.getAttribute('data-all')){
      t=Array.prototype.map.call(document.querySelectorAll('.cp[data-t]'),function(b){return b.getAttribute('data-t')}).join('\n\n');
    }
    function done(){label.textContent='Copied';setTimeout(function(){label.textContent=orig},1500)}
    function fallback(){
      var ta=document.createElement('textarea');ta.value=t;ta.style.position='absolute';ta.style.left='-9999px';
      document.body.appendChild(ta);ta.select();
      try{document.execCommand('copy');done()}catch(e){label.textContent='Could not copy'}
      document.body.removeChild(ta);
    }
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(done,fallback)}else{fallback()}
  });
});
</script>
```

Translate the legend text, the `<h2>` summary, and the button labels ("Copy corrected paragraph", "Copy whole corrected essay", "Copied", "Could not copy") into the user's language. Omit the whole-essay button when there is only one paragraph.

### Technical notes (bugs already hit)

- Position the correction with `bottom:100%` of `.fx`, and `.fx` must have `line-height:1.3`. If `.fx` inherits the paragraph's large line-height, the correction floats too high.
- Don't position the correction text with `em` inside a `<b>` that has its own `font-size`: `em` is relative to its own size, so it ends up misplaced.
- Draw the ∧ as a small SVG (14x10) sitting under the gap between two words. The word to insert sits at the same height as the other corrections.
- The paragraph needs about 24px of `padding-top` and a `line-height` of about 2.7 so corrections on one line don't collide with the line above.
- A correction above a word is `white-space:nowrap` and centred, so a long one overlaps the words beside it. Use the `.rw` rewrite form for anything long (see "Symbols").
- The copy button uses `navigator.clipboard` with an `execCommand('copy')` fallback, because the widget runs in an iframe. If both fail, give the clean version as plain text so the user can select and copy it themselves.
- Escape `<`, `>`, `&`, and quotes in the user's text properly, especially inside the `data-t` attribute.

## Markdown fallback (no widget)

Use markdown: `~~word~~ **better word**` for a replacement; `~~word~~` alone for a removal; `(∧ **word**)` for a missing word; `~~old phrase~~ → **new phrase**` for a rewrite; `**a / b**` for alternatives; `_word_ (optional: *option*)` for a blue suggestion. Then give the clean version in a code block so the user can copy it, followed by the band estimate.

Example: Large economic disparities can cause (∧ **the poor**) to struggle to access education and better ~~careers~~ **employment opportunities**. ~~Without the governments capable of redistributing~~ → **If governments fail to redistribute** resources through ~~taxes~~ **taxation**, social stability will be undermined.
