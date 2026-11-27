---
name: writing
description: Correct English writing like a teacher's red pen, marking errors inside the text. Use when the user sends English text and asks to fix, correct, proofread, or check it, in any language.
---

# Teacher-style correction for English writing

## Goal

Learners don't want a "fixed" version without knowing what was wrong. This skill shows them the mistakes **right inside their text**, like a teacher's red pen, with a button to copy the clean version.

## Workflow

1. **Work out what the user wants.**
   - Default: teacher-style correction (steps below).
   - "Just point out the mistakes, I'll fix them myself": underline or highlight the problem spots but **do not** write the correct form.
2. **Find errors and areas to improve**, in two groups. Always preserve the writer's meaning and voice.
   - **Errors (red, must fix):**
     - Grammar: verb tense, subject-verb agreement, articles, prepositions, missing or extra words.
     - Spelling.
     - Wrong word choice: wrong meaning, wrong part of speech, wrong collocation.
     - Unnatural expression: grammatically correct, but a native speaker wouldn't say it.
     - English written with the structure of the writer's first language (word-for-word translation). The first language could be Vietnamese or any other; infer it only from the error patterns, never assume.
   - **Upgrades (blue, optional):**
     - Richer vocabulary: words that are **correct but too basic or repeated** (very good, big, a lot of, thing, nice, get...). Suggest a better word.
     - Complex sentence structure: when there are many short, choppy simple sentences, suggest combining them into complex sentences (relative clauses, although, because...).
     - Cohesion across the text: add linking words or transitions where sentences or paragraphs feel disconnected.
   - For upgrades, pick only the 1-3 most worthwhile spots per short paragraph. Suggestions must keep the meaning, fit the context, and not be rare or showy.
3. **Mark up using the standard symbols** (table below).
4. **Display** with an inline HTML widget (template at the end of this file). If no display tool is available, use the markdown fallback.
5. **Below the widget**, write a short note in prose, without repeating what the widget already shows:
   - Which kind of error the user makes most (verb tense, articles, prepositions...).
   - If errors repeat because of first-language translation, name that pattern in one sentence.
   - One or two errors worth explaining in more detail.
   - Ask whether they want a fuller explanation of each error or another round of practice.

## Symbols

| Situation | How to mark it |
|---|---|
| Wrong word | Strike through the wrong word (red); write the correct word directly above in red italics |
| Missing word | A caret **∧** (the standard proofreading mark) under the gap; the word to insert written above, same size and height as the other corrections |
| Unclear sentence, unnatural expression, or word-for-word translation from the first language | Strike through the whole sentence (or phrase); write the new version on the line above in red italics |
| Extra word | Strike through the extra word; write nothing above it |
| Correct but basic word | Dotted underline (blue); suggested word written above in blue italics. Blue distinguishes it from errors (red): it's only an upgrade suggestion |
| Complex sentence structure (combining sentences) | Dotted blue underline on the sentences to combine; the combined sentence written on the line above in blue italics |
| Cohesion, adding a linking word | A blue **∧** where the link should go (for example, "However,"); the linking word written above in blue italics |

Don't use curved arrows or other invented symbols: they aren't standard and tend to overlap the text.

## Rules

- Tell spelling and grammar apart: **spelling** is a misspelled word (beatiful → beautiful); **grammar** is a missing verb, wrong tense, or broken subject-verb agreement.
- Reply in the language the user is writing in. The corrected text stays in English. The widget legend, the heading, and the copy-button labels should also be in the user's language.
- If a sentence is wrong in only one or two words, fix the words. Strike through a whole sentence (red) only when it's unclear, unnatural, or translated word-for-word from the first language. A correct but choppy sentence gets a suggestion (blue), never a forced rewrite.
- Long text: split into paragraphs, each with its own copy button. You may add one more button that copies the whole text.
- The copy button always copies the **clean version** (no strikethroughs, no symbols). The clean version applies only the **error fixes** and keeps the original wording at upgrade spots, since those are optional.
- Upgrades (blue) are not errors: don't count them in the error total, don't suggest them if the original already works, and don't combine sentences or add linking words just to hit a quota.
- Don't miss errors: reread the text once before displaying.
- Don't give the errors as a table unless the user asks. The point is to see the mistakes inside the text.

## Widget template (inline HTML)

Use the host's CSS variables so it works in dark mode (`--text-danger`, `--text-accent`, `--text-secondary`, `--bg-neutral`). Keep the positioning values below exactly as they are; they were tuned after several rounds of misalignment.

```html
<h2 class="sr-only">English text corrected in teacher style.</h2>
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
<span><s>wrong</s> <b>right</b> : replace word</span>
<span><b>word</b> above ∧ : missing word</span>
<span><s>whole sentence</s> → <b>new sentence</b> : rewrite</span>
<span><u>basic word</u> <b class="u">better word</b> : upgrade suggestion</span>
</div>

<p class="pg">
I want<span class="ins"><b>to</b><svg viewBox="0 0 14 10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 9 L7 1.5 L13 9"/></svg></span>go to the supermarket. My sister <span class="fx">like<b>likes</b></span> fruit, so she eats <span class="up">a lot of<b>plenty of</b></span> apples.
<span class="rw"><i>I don't have much money today.</i><s>Because money I have little today.</s></span>
</p>
<button class="cp" data-t="CLEAN VERSION HERE"><i class="ti ti-copy" aria-hidden="true"></i><span>Copy corrected text</span></button>

<script>
document.querySelectorAll('.cp').forEach(function(btn){
  btn.addEventListener('click',function(){
    var t=btn.getAttribute('data-t');
    var label=btn.querySelector('span');
    function done(){label.textContent='Copied';setTimeout(function(){label.textContent='Copy corrected text'},1500)}
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

Translate the legend text, the `<h2>` summary, and the button labels ("Copy corrected text", "Copied", "Could not copy") into the user's language.

### Technical notes (bugs already hit)

- Position the correction with `bottom:100%` of `.fx`, and `.fx` must have `line-height:1.3`. If `.fx` inherits the paragraph's large line-height, the correction floats too high.
- Don't position the correction text with `em` inside a `<b>` that has its own `font-size`: `em` is relative to its own size, so it ends up misplaced.
- Draw the ∧ as a small SVG (14x10) sitting under the gap between two words. The word to insert sits at the same height as the other corrections.
- The paragraph needs about 24px of `padding-top` and a `line-height` of about 2.7 so corrections on one line don't collide with the line above.
- The copy button uses `navigator.clipboard` with an `execCommand('copy')` fallback, because the widget runs in an iframe. If both fail, give the clean version as plain text so the user can select and copy it themselves.
- Escape `<`, `>`, `&`, and quotes in the user's text properly, especially inside the `data-t` attribute.

## Markdown fallback (no widget)

Use markdown: `~~wrong~~ **right**` for a replaced word; `(∧ **to**)` for a missing word; `~~old sentence~~ → **new sentence**` for a rewrite; `_basic word_ (suggestion: *better word*)` for an upgrade. Then give the clean version in a code block so the user can copy it.

Example: I want (∧ **to**) go to the supermarket. My sister ~~like~~ **likes** fruit, so she eats _a lot of_ (suggestion: *plenty of*) apples.
