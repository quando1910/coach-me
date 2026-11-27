# Correction widget (shared)

The inline HTML widget that shows corrections inside the text. `coach-writing` and `coach-writing-ielts` both use it. Each skill's `SKILL.md` gives its own legend entries and button labels; everything else comes from this file. It lives inside the `coach-writing` skill folder because some hosts (claude.ai on the web) only load files that are inside a skill folder; `coach-writing-ielts` reaches it as `../coach-writing/reference/widget.md`.

Use the host's CSS variables so it works in dark mode (`--text-danger`, `--text-accent`, `--text-secondary`, `--bg-neutral`). Keep the positioning values below exactly as they are; they were tuned after several rounds of misalignment.

## Template

```html
<h2 class="sr-only">ONE-SENTENCE SUMMARY HERE</h2>
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
LEGEND ENTRIES FROM THE SKILL HERE
</div>

<p class="pg">
I want<span class="ins"><b>to</b><svg viewBox="0 0 14 10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 9 L7 1.5 L13 9"/></svg></span>go to the supermarket. My sister <span class="fx">like<b>likes</b></span> fruit, so she eats <span class="fx">very</span> <span class="up">a lot of<b>plenty of</b></span> apples.
<span class="rw"><i>I don't have much money today.</i><s>Because money I have little today.</s></span>
</p>
<button class="cp" data-t="CLEAN PARAGRAPH HERE"><i class="ti ti-copy" aria-hidden="true"></i><span>Copy corrected text</span></button>

<div style="margin-top:1rem">
<button class="cp" data-all="1"><i class="ti ti-copy" aria-hidden="true"></i><span>Copy whole corrected text</span></button>
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

## Building blocks

| Mark | Markup |
|---|---|
| Replace a word (red) | `<span class="fx">wrong<b>right</b></span>` |
| Remove a word (red) | `<span class="fx">extra</span>` with no `<b>` |
| Insert a missing word (red) | `<span class="ins"><b>word</b><svg ...caret.../></span>` placed in the gap, with no spaces around it |
| Rewrite a phrase or sentence (red) | `<span class="rw"><i>new version</i><s>old version</s></span>` |
| Optional word suggestion (blue) | `<span class="up">word<b>suggestion</b></span>` |
| Optional insert (blue) | `<span class="ins u">...</span>` |
| Optional rewrite or combined sentence (blue) | `<span class="rw u">...</span>` |

## Usage

- One `<p class="pg">` and one copy button per paragraph. Each button's `data-t` holds that paragraph's clean version.
- The whole-text button (`data-all="1"`) joins every paragraph's `data-t`. Omit it when there is only one paragraph.
- Translate the `<h2>` summary, the legend text, and the button labels ("Copied", "Could not copy", and the skill's own copy labels) into the user's language.
- A correction above a word is `white-space:nowrap` and centred, so a long one overlaps the words beside it. If the replacement is longer than about 25 characters or clearly wider than the original, use the `.rw` rewrite form instead.

## Technical notes (bugs already hit)

- Position the correction with `bottom:100%` of `.fx`, and `.fx` must have `line-height:1.3`. If `.fx` inherits the paragraph's large line-height, the correction floats too high.
- Don't position the correction text with `em` inside a `<b>` that has its own `font-size`: `em` is relative to its own size, so it ends up misplaced.
- Draw the ∧ as a small SVG (14x10) sitting under the gap between two words. The word to insert sits at the same height as the other corrections.
- The paragraph needs about 24px of `padding-top` and a `line-height` of about 2.7 so corrections on one line don't collide with the line above.
- The copy button uses `navigator.clipboard` with an `execCommand('copy')` fallback, because the widget runs in an iframe. If both fail, give the clean version as plain text so the user can select and copy it themselves.
- Escape `<`, `>`, `&`, and quotes in the user's text properly, especially inside the `data-t` attribute.
