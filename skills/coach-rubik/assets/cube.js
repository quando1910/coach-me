/*
 * coach-rubik cube widget: an interactive 3D Rubik's cube with LBL and CFOP exercises.
 * Loaded by reference/widget.md from jsDelivr, so Claude doesn't have to type ~50 KB of code
 * into the chat each time. Mounts into <div id="coach-rubik"></div>.
 *
 * The solver between the SOLVER markers is a copy of scripts/solve.js;
 * run `python3 scripts/build_cube.py` after changing solve.js to refresh it.
 */
(function () {
  var mount = document.getElementById("coach-rubik");
  if (!mount) return;
  var style = document.createElement("style");
  style.textContent = ".rbw{font-size:14px;line-height:1.5}\n.rbw button{font-size:14px;line-height:1.3;padding:6px 12px;border-radius:var(--radius);min-height:0}\n.rbw .rb-nav{padding:6px 8px}\n.rbw .rb-tabs .rb-tab{border:0;border-bottom:2px solid transparent;border-radius:0;background:none;padding:8px 14px;font-weight:500;color:var(--text-secondary)}\n.rbw .rb-tabs .rb-tab.sel{color:var(--text-primary);border-bottom-color:var(--text-accent)}\n.rbw .rb-case{font-size:13px;padding:4px 10px}\n.rbw .rb-rand{padding:4px 7px}\n.rbw{container-type:inline-size}\n.rb-top{position:relative;display:flex;flex-direction:column;background:var(--bg-neutral);border-radius:var(--radius);margin:0 0 10px}\n.rb-scene{height:280px;overscroll-behavior:contain;-webkit-user-select:none;-webkit-touch-callout:none;perspective:900px;display:flex;align-items:center;justify-content:center;touch-action:none;cursor:grab;user-select:none}\n.rb-cube{position:relative;width:0;height:0;transform-style:preserve-3d}\n.rb-c{position:absolute;width:48px;height:48px;left:-24px;top:-24px;transform-style:preserve-3d}\n.rb-f{position:absolute;inset:0;background:#141414;display:flex;align-items:center;justify-content:center;backface-visibility:hidden}\n.rb-f i{display:block;width:42px;height:42px;border-radius:6px;pointer-events:none}\n.rb-f.st{cursor:pointer}\n.rb-lbl{position:absolute;left:50%;top:50%;width:24px;height:24px;display:flex;align-items:center;justify-content:center;background:rgba(10,14,20,.78);color:#fff;font-weight:500;font-size:14px;border-radius:6px;box-shadow:0 2px 5px rgba(0,0,0,.55),inset 0 1px 0 rgba(255,255,255,.12);pointer-events:none}\n.rb-hd{display:flex;align-items:flex-start;gap:12px;padding:12px 14px 0}\n.rb-ft{display:flex;justify-content:space-between;padding:0 10px 10px}\n.rb-tl,.rb-br{display:flex;gap:6px}\n.rb-status{margin-right:42px;font-size:14px;font-weight:500;white-space:nowrap}\n.rb-row{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:0 0 10px}\n.rb-lb{font-size:13px;color:var(--text-secondary);min-width:64px}\n.rb-nav{padding:4px 7px;line-height:0}\n.rb-nav svg{width:18px;height:18px}\n.rb-tl .rb-nav,.rb-br .rb-nav{padding:7px 9px}\n.rb-nav:disabled{opacity:.35;cursor:default}\n.rb-hist span{display:inline-block;width:26px;text-align:center;padding:1px 0;border-radius:5px}\n.rb-hist span.on{background:var(--bg-accent);color:var(--text-accent)}\n.rb-hist span.fut{opacity:.4}\n.rb-hist{font-family:var(--font-mono);font-size:13px;color:var(--text-secondary);word-break:break-word;flex:1;min-width:0}\n.rb-tabs{display:flex;gap:4px;border-bottom:1px solid var(--border);margin:6px 0 10px}\n.rb-tab{border:0;border-bottom:2px solid transparent;border-radius:0;background:none;padding:8px 14px;font-weight:500;color:var(--text-secondary)}\n.rb-tab.sel{color:var(--text-primary);border-bottom-color:var(--text-accent)}\n.rb-steps{display:grid;gap:8px}\n.rb-steps{gap:10px}\n.rb-step{display:grid;grid-template-columns:150px 1fr;gap:4px 8px;align-items:start}\n.rb-step span{font-size:13px;color:var(--text-secondary);padding-top:5px}\n.rb-btns{display:flex;flex-wrap:wrap;gap:6px}\n@container (max-width:480px){.rb-step{grid-template-columns:1fr}.rb-step span{padding-top:0}.rb-scene{height:250px}.rb-status{margin-right:0}}\n.rb-case{font-size:13px;padding:4px 10px}\n.rb-rand{padding:4px 7px;line-height:0;color:var(--text-secondary)}\n.rb-rand svg{width:16px;height:16px}\n.rb-rand.sel{border-color:var(--border-accent);color:var(--text-accent);background:var(--bg-accent)}\n.rb-case.sel{border-color:var(--border-accent);color:var(--text-accent);background:var(--bg-accent)}\n.rb-ex{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}\n.rb-ex b{font-size:14px;font-weight:500}\n.rb-ex span{font-size:13px;color:var(--text-secondary)}\n#rbErr{font-size:13px;color:var(--text-danger);margin:0 0 10px}\n#rbErr:empty{display:none}";
  document.head.appendChild(style);
  mount.innerHTML = "<div class=\"rbw\">\n<div class=\"rb-top\">\n<div class=\"rb-hd\"><div class=\"rb-ex\" id=\"rbEx\"></div><span class=\"rb-status\" id=\"rbStatus\"></span></div>\n<div class=\"rb-scene\" id=\"rbScene\"><div class=\"rb-cube\" id=\"rbCube\"></div></div>\n<div class=\"rb-ft\"><div class=\"rb-tl\"><button class=\"rb-nav\" id=\"rbScr\" title=\"Scramble\" aria-label=\"Scramble\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22\"/><path d=\"m18 2 4 4-4 4\"/><path d=\"M2 6h1.9c1.5 0 2.9.9 3.6 2.2\"/><path d=\"M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8\"/><path d=\"m18 14 4 4-4 4\"/></svg></button><button class=\"rb-nav\" id=\"rbReset\" title=\"Reset\" aria-label=\"Reset\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M3 12a9 9 0 1 0 3-6.7L3 8\"/><path d=\"M3 3v5h5\"/></svg></button></div>\n<div class=\"rb-br\"><button class=\"rb-nav\" id=\"rbAnswer\" title=\"Answer: show the moves\" aria-label=\"Answer: show the moves\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M9 18h6\"/><path d=\"M10 22h4\"/><path d=\"M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0 0 12 2z\"/></svg></button><button class=\"rb-nav\" id=\"rbAsk\" title=\"Ask AI: send this cube to Claude\" aria-label=\"Ask AI: send this cube to Claude\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M7.9 20A9 9 0 1 0 4 16.1L2 22z\"/><path d=\"M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3\"/><path d=\"M12 17h.01\"/></svg></button></div></div>\n</div>\n\n<div class=\"rb-row\">\n<span class=\"rb-lb\">History</span>\n<button class=\"rb-nav\" id=\"rbBack\" title=\"Step back\" aria-label=\"Step back\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M6 5v14\"/><path d=\"M18 5 9 12l9 7z\"/></svg></button>\n<button class=\"rb-nav\" id=\"rbFwd\" title=\"Step forward\" aria-label=\"Step forward\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M18 5v14\"/><path d=\"M6 5l9 7-9 7z\"/></svg></button>\n</div>\n<div class=\"rb-hist\" id=\"rbHist\" style=\"margin:-4px 0 10px;display:flex;flex-wrap:wrap;gap:4px\"></div>\n\n<div class=\"rb-row\">\n<input id=\"rbAlg\" type=\"text\" aria-label=\"Moves\" placeholder=\"Moves, e.g. R U R' U'\" style=\"flex:1;min-width:200px;font-family:var(--font-mono)\">\n<button class=\"rb-nav\" id=\"rbPlay\" title=\"Play\" aria-label=\"Play\"><svg viewBox=\"0 0 24 24\" fill=\"currentColor\" aria-hidden=\"true\"><path d=\"M7 4.5v15l13-7.5z\"/></svg></button>\n</div>\n<div id=\"rbErr\"></div>\n\n<div class=\"rb-tabs\" id=\"rbTabs\" role=\"tablist\"></div>\n<div class=\"rb-steps\" id=\"rbSteps\"></div>\n\n</div>";
})();
/* SOLVER START */
/*
 * Solve a 3x3 Rubik's cube stage by stage with the CFOP method.
 * JavaScript port of solve.py: same model, same search order, same output.
 *
 * Input: a Kociemba facelet string (54 letters, face order U R F D L B; each
 * face read row by row as seen from outside). Each letter names the face
 * whose centre has that colour.
 *
 * Browser: load this file, then call
 *   CubeSolver.solve(facelets, crossLetter, method)  ->  [{name, moves:[...]}, ...]
 * method is "cfop" (default, 4 stages) or "lbl" (Layer by Layer, 7 stages).
 * where crossLetter is the face letter whose centre has the cross colour.
 *
 * Node:
 *   node solve.js FACELETS [--centers "U=white, R=red, ..."] [--cross white] [--method cfop|lbl]
 * prints:
 *   CFOP method:
 *   Cross: { ... }   (or "-" when a stage needs no moves)
 *   ...
 *
 * Every solution is applied to the input and checked before it is returned.
 * No dependencies.
 */
(function (root) {
  "use strict";
  var FACES = "URFDLB";
  var NRM = { U: [0, -1, 0], R: [1, 0, 0], F: [0, 0, 1], D: [0, 1, 0], L: [-1, 0, 0], B: [0, 0, -1] };
  // Coordinates: x to the right, y down, z towards the viewer.
  var AT = {
    U: function (r, c) { return [c, -1, r]; },
    R: function (r, c) { return [1, r, -c]; },
    F: function (r, c) { return [c, r, 1]; },
    D: function (r, c) { return [c, 1, -r]; },
    L: function (r, c) { return [-1, r, c]; },
    B: function (r, c) { return [-c, r, -1]; }
  };
  // axis, layer (null = whole cube), turn direction sign
  var DEF = { U: [1, -1, -1], D: [1, 1, 1], R: [0, 1, 1], L: [0, -1, -1], F: [2, 1, 1], B: [2, -1, -1],
    M: [0, 0, -1], E: [1, 0, 1], S: [2, 0, 1], x: [0, null, 1], y: [1, null, -1], z: [2, null, 1] };

  function k3(v) { return v[0] + "," + v[1] + "," + v[2]; }
  var STICKERS = [], INDEX = {}, AT_POS = {};
  FACES.split("").forEach(function (f) {
    [-1, 0, 1].forEach(function (r) {
      [-1, 0, 1].forEach(function (c) {
        var p = AT[f](r, c), i = STICKERS.length;
        STICKERS.push([p, NRM[f], f]);
        INDEX[k3(p) + "|" + k3(NRM[f])] = i;
        (AT_POS[k3(p)] = AT_POS[k3(p)] || []).push(i);
      });
    });
  });
  function idx(p, n) { return INDEX[k3(p) + "|" + k3(n)]; }

  function rot(axis, quarter) {
    var q = ((quarter % 4) + 4) % 4, cs = [[1, 0], [0, 1], [-1, 0], [0, -1]][q], c = cs[0], s = cs[1];
    return [[[1, 0, 0], [0, c, -s], [0, s, c]],
      [[c, 0, s], [0, 1, 0], [-s, 0, c]],
      [[c, -s, 0], [s, c, 0], [0, 0, 1]]][axis];
  }
  function mv(m, v) {
    return [m[0][0] * v[0] + m[0][1] * v[1] + m[0][2] * v[2],
      m[1][0] * v[0] + m[1][1] * v[1] + m[1][2] * v[2],
      m[2][0] * v[0] + m[2][1] * v[1] + m[2][2] * v[2]];
  }
  function parseTok(t) {
    var f = t[0], n = t.slice(1);
    if (!DEF[f] || ["", "'", "’", "2"].indexOf(n) < 0) throw new Error("bad move " + t);
    return [f, n === "2" ? 2 : (n === "'" || n === "’") ? -1 : 1];
  }
  // dest[i] = index the sticker at i moves to.
  function moveDest(token) {
    var ft = parseTok(token), d = DEF[ft[0]], axis = d[0], layer = d[1], m = rot(axis, d[2] * ft[1]);
    return STICKERS.map(function (st) {
      var p = st[0], n = st[1];
      return (layer === null || p[axis] === layer) ? idx(mv(m, p), mv(m, n)) : idx(p, n);
    });
  }
  var CACHE = {};
  function split(alg) { return alg.split(/\s+/).filter(Boolean); }
  function seqDest(alg) {
    if (!CACHE[alg]) {
      var out = []; for (var i = 0; i < 54; i++) out.push(i);
      split(alg).forEach(function (t) { var d = moveDest(t); out = out.map(function (i) { return d[i]; }); });
      CACHE[alg] = out;
    }
    return CACHE[alg];
  }
  function apply(state, alg) {
    var dest = seqDest(alg), src = new Array(54);
    for (var i = 0; i < 54; i++) src[dest[i]] = i;
    var o = ""; for (var j = 0; j < 54; j++) o += state[src[j]];
    return o;
  }

  // ---------------------------------------------------------------- checks
  function center(s, f) { return s[idx(NRM[f], NRM[f])]; }
  function pieceOk(s, pos) {
    var ids = AT_POS[k3(pos)];
    for (var i = 0; i < ids.length; i++) {
      var st = STICKERS[ids[i]];
      if (s[ids[i]] !== center(s, st[2])) return false;
    }
    return true;
  }
  var CROSS_POS = [[0, 1, 1], [1, 1, 0], [0, 1, -1], [-1, 1, 0]];
  var SLOTS = [[1, 1], [-1, 1], [-1, -1], [1, -1]]; // (x, z): FR, FL, BL, BR
  function crossOk(s) { return CROSS_POS.every(function (p) { return pieceOk(s, p); }); }
  function slotOk(s, sl) { return pieceOk(s, [sl[0], 1, sl[1]]) && pieceOk(s, [sl[0], 0, sl[1]]); }
  function f2lOk(s) { return crossOk(s) && SLOTS.every(function (sl) { return slotOk(s, sl); }); }
  function ollOk(s) {
    if (!f2lOk(s)) return false;
    var u = center(s, "U");
    for (var r = -1; r <= 1; r++) for (var c = -1; c <= 1; c++) if (s[idx(AT.U(r, c), NRM.U)] !== u) return false;
    return true;
  }
  function solved(s) {
    for (var k = 0; k < 6; k++) for (var i = 9 * k; i < 9 * k + 9; i++) if (s[i] !== s[9 * k + 4]) return false;
    return true;
  }

  // ---------------------------------------------------------------- pieces
  var EDGE_POS = [], CORNER_POS = [];
  Object.keys(AT_POS).forEach(function (k) {
    var p = k.split(",").map(Number), n = Math.abs(p[0]) + Math.abs(p[1]) + Math.abs(p[2]);
    if (n === 2) EDGE_POS.push(p); else if (n === 3) CORNER_POS.push(p);
  });
  function findSticker(s, positions, colors, want) {
    var target = colors.slice().sort().join("");
    for (var i = 0; i < positions.length; i++) {
      var ids = AT_POS[k3(positions[i])];
      if (ids.map(function (j) { return s[j]; }).sort().join("") === target) {
        for (var j = 0; j < ids.length; j++) if (s[ids[j]] === want) return ids[j];
      }
    }
    throw new Error("piece with colours " + colors.join("") + " not found");
  }
  function encode(keyArr) { var v = 0; for (var i = 0; i < keyArr.length; i++) v = v * 54 + keyArr[i]; return v; }
  // Distance table from `start` (array of sticker indices) under `moves` (dest arrays).
  function bfsTable(start, moves) {
    var size = Math.pow(54, start.length), dist = new Int8Array(size).fill(-1);
    var q = [start], head = 0;
    dist[encode(start)] = 0;
    while (head < q.length) {
      var k = q[head++], d = dist[encode(k)] + 1;
      for (var m = 0; m < moves.length; m++) {
        var mvd = moves[m], nk = k.map(function (i) { return mvd[i]; }), e = encode(nk);
        if (dist[e] < 0) { dist[e] = d; q.push(nk); }
      }
    }
    return dist;
  }
  var FACE_MOVES = [];
  "UDRLFB".split("").forEach(function (f) { ["", "'", "2"].forEach(function (s) { FACE_MOVES.push(f + s); }); });

  // ---------------------------------------------------------------- cross
  var CROSS_TABLE = null;
  function solveCross(s) {
    var d = center(s, "D");
    var key = ["F", "R", "B", "L"].map(function (f) { var c = center(s, f); return findSticker(s, EDGE_POS, [d, c], d); });
    var moves = FACE_MOVES.map(seqDest);
    if (!CROSS_TABLE) CROSS_TABLE = bfsTable(CROSS_POS.map(function (p) { return idx(p, NRM.D); }), moves);
    var dist = CROSS_TABLE;
    if (dist[encode(key)] < 0) throw new Error("cross edges are in an impossible position");
    var out = [];
    while (dist[encode(key)] > 0) {
      var cur = dist[encode(key)];
      for (var m = 0; m < moves.length; m++) {
        var mvd = moves[m], nk = key.map(function (i) { return mvd[i]; });
        if (dist[encode(nk)] === cur - 1) { out.push(FACE_MOVES[m]); key = nk; break; }
      }
    }
    return out;
  }

  // ---------------------------------------------------------------- F2L
  var SIDE = { "1": "R", "-1": "L" }, FRONT = { "1": "F", "-1": "B" };
  function invTok(t) { return t.slice(-1) === "'" ? t[0] : t.slice(-1) === "2" ? t : t + "'"; }
  var F2L_MACROS = [["U"], ["U'"], ["U2"]];
  "RLFB".split("").forEach(function (X) {
    [X, X + "'"].forEach(function (x) {
      ["U", "U'", "U2"].forEach(function (u) { F2L_MACROS.push([x, u, invTok(x)]); });
    });
  });
  var F2L_MACRO_ALG = F2L_MACROS.map(function (m) { return m.join(" "); });
  var F2L_MACRO_DEST = F2L_MACRO_ALG.map(seqDest);
  var PAIR_TABLES = {};
  function pairKey(s, sl) {
    var cx = center(s, SIDE[sl[0]]), cz = center(s, FRONT[sl[1]]), d = center(s, "D");
    return [findSticker(s, CORNER_POS, [d, cx, cz], d), findSticker(s, EDGE_POS, [cx, cz], cx)];
  }
  function pairTable(sl) {
    var k = sl.join(",");
    if (!PAIR_TABLES[k]) {
      var goal = [idx([sl[0], 1, sl[1]], NRM.D), idx([sl[0], 0, sl[1]], NRM[SIDE[sl[0]]])];
      PAIR_TABLES[k] = bfsTable(goal, F2L_MACRO_DEST);
    }
    return PAIR_TABLES[k];
  }
  function solvePair(state, sl, keep, maxDepth) {
    var table = pairTable(sl), start = pairKey(state, sl);
    if (table[encode(start)] < 0) throw new Error("F2L pair in an impossible position");
    function dfs(s, key, g, bound, path, prev) {
      var h = table[encode(key)];
      if (g + h > bound) return null;
      if (h === 0 && keep.every(function (k) { return slotOk(s, k); })) return path;
      for (var mi = 0; mi < F2L_MACROS.length; mi++) {
        var m = F2L_MACROS[mi];
        if (prev !== null) {
          var pm = F2L_MACROS[prev];
          if (m.length === 1 && pm.length === 1) continue;
          if (m.length === 3 && pm.length === 3 && m[0][0] === pm[0][0]) continue;
        }
        var dest = F2L_MACRO_DEST[mi];
        var r = dfs(apply(s, F2L_MACRO_ALG[mi]), key.map(function (i) { return dest[i]; }), g + 1, bound, path.concat([mi]), mi);
        if (r) return r;
      }
      return null;
    }
    for (var bound = table[encode(start)]; bound <= maxDepth; bound++) {
      var r = dfs(state, start, 0, bound, [], null);
      if (r) { var out = []; r.forEach(function (mi) { out = out.concat(F2L_MACROS[mi]); }); return out; }
    }
    return null;
  }
  function solveF2L(state) {
    var out = [], done = SLOTS.filter(function (sl) { return slotOk(state, sl); });
    while (done.length < 4) {
      var best = null;
      SLOTS.forEach(function (sl) {
        if (done.indexOf(sl) >= 0) return;
        var sol = solvePair(state, sl, done, 8);
        if (sol && (!best || sol.length < best[1].length)) best = [sl, sol];
      });
      if (!best) throw new Error("could not solve an F2L pair");
      if (best[1].length) state = apply(state, best[1].join(" "));
      out = out.concat(best[1]);
      done.push(best[0]);
    }
    return out;
  }

  // ---------------------------------------------------------------- last layer
  var OLL_ALGS = [
    "F R U R' U' F'",
    "F U R U' R' F'",
    "R U R' U R U2 R'",
    "R U2 R' U' R U' R'",
    "R U R' U' R' F R F'",
    "R U2 R2 U' R2 U' R2 U2 R",
    "R2 D' R U2 R' D R U2 R"
  ];
  var PLL_ALGS = [
    "R U R' U' R' F R2 U' R' U' R U R' F'",
    "R U' R U R U R U' R' U' R2",
    "R2 U R U R' U' R' U' R' U R'",
    "R U R' F' R U R' U' R' F R2 U' R'",
    "F R U' R' U' R U R' F' R U R' U' R' F R F'",
    "M2 U M2 U2 M2 U M2",
    "M' U M2 U M2 U M' U2 M2",
    "x R' U R' D2 R U' R' D2 R2 x'",
    "x R2 D2 R U R' D2 R U' R x'",
    "L' U' L F L' U' L U L F' L2 U L",
    "R U' R' U' R U R D R' U' R D' R' U2 R'",
    "R' U' F' R U R' U' R' F R2 U' R' U' R U R' U R",
    "x' R U' R' D R U R' D' R U R' D R U' R' D' x"
  ];
  var AUF = ["U", "U'", "U2"];
  var LL_IDS = [];
  STICKERS.forEach(function (st, i) {
    var p = st[0];
    if (p[1] === -1 && Math.abs(p[0]) + Math.abs(p[1]) + Math.abs(p[2]) >= 2) LL_IDS.push(i);
  });
  function lastLayer(state, algs, keyFn, goalFn) {
    var start = keyFn(state), seen = new Map([[start, null]]), q = [[state, start]], head = 0, macros = AUF.concat(algs);
    while (head < q.length) {
      var item = q[head++], s = item[0], k = item[1];
      if (goalFn(s)) {
        var path = [];
        while (seen.get(k) !== null) { var e = seen.get(k); path.push(e[1]); k = e[0]; }
        var out = [];
        path.reverse().forEach(function (m) { out = out.concat(split(m)); });
        return out;
      }
      for (var i = 0; i < macros.length; i++) {
        var ns = apply(s, macros[i]), nk = keyFn(ns);
        if (!seen.has(nk)) { seen.set(nk, [k, macros[i]]); q.push([ns, nk]); }
      }
    }
    return null;
  }
  function solveOLL(state) {
    var u = center(state, "U");
    return lastLayer(state, OLL_ALGS, function (s) { return LL_IDS.map(function (i) { return s[i] === u ? 1 : 0; }).join(""); }, ollOk);
  }
  function solvePLL(state) {
    return lastLayer(state, PLL_ALGS, function (s) { return LL_IDS.map(function (i) { return s[i]; }).join(""); }, solved);
  }

  // ---------------------------------------------------------------- LBL (layer by layer)
  // Same steps and algorithms as reference/methods/lbl.md. Each slot's corner
  // trigger is "R U R' U'" seen from that slot, so the cube never needs turning.
  var LBL_CORNER_MACROS = AUF.concat(["R U R' U'", "B U B' U'", "L U L' U'", "F U F' U'"]);
  var LBL_EDGE_MACROS = AUF.concat([
    "U R U' R' U' F' U F", "U B U' B' U' R' U R", "U L U' L' U' B' U B", "U F U' F' U' L' U L",
    "U' L' U L U F U' F'", "U' F' U F U R U' R'", "U' R' U R U B U' B'", "U' B' U B U L U' L'"]);
  var PIECE_TABLES = {};
  function cornersOk(s) { return crossOk(s) && SLOTS.every(function (sl) { return pieceOk(s, [sl[0], 1, sl[1]]); }); }
  function yellowCrossOk(s) {
    var u = center(s, "U");
    return f2lOk(s) && [[0, -1, 1], [1, -1, 0], [0, -1, -1], [-1, -1, 0]].every(function (p) { return s[idx(p, NRM.U)] === u; });
  }
  function placed(s, pos) {
    var want = FACES.split("").filter(function (f) { var v = NRM[f]; return [0, 1, 2].some(function (k) { return v[k] !== 0 && v[k] === pos[k]; }); })
      .map(function (f) { return center(s, f); }).sort().join("");
    return AT_POS[k3(pos)].map(function (i) { return s[i]; }).sort().join("") === want;
  }
  function cornersPlacedOk(s) {
    return ollOk(s) && [[1, -1, 1], [-1, -1, 1], [1, -1, -1], [-1, -1, -1]].every(function (p) { return placed(s, p); });
  }
  function insertPieces(state, keyFn, goalFn, macros, tag, keepFn, maxDepth) {
    var dests = macros.map(seqDest), out = [];
    var done = SLOTS.filter(function (sl) { return keyFn(state, sl) === goalFn(sl) && keepFn(state, [sl]); });
    while (done.length < SLOTS.length) {
      var best = null;
      SLOTS.forEach(function (sl) {
        if (done.indexOf(sl) >= 0) return;
        var tk = tag + ":" + goalFn(sl);
        if (!PIECE_TABLES[tk]) PIECE_TABLES[tk] = bfsTable([goalFn(sl)], dests);
        var table = PIECE_TABLES[tk], start = keyFn(state, sl), want = done.concat([sl]);
        function dfs(s, key, g, bound, path, prev) {
          var h = table[key];
          if (g + h > bound) return null;
          if (h === 0 && keepFn(s, want)) return path;
          for (var mi = 0; mi < macros.length; mi++) {
            if (prev !== null && mi < 3 && prev < 3) continue;
            var r = dfs(apply(s, macros[mi]), dests[mi][key], g + 1, bound, path.concat([mi]), mi);
            if (r) return r;
          }
          return null;
        }
        var sol = null;
        for (var bound = table[start]; bound <= maxDepth; bound++) { sol = dfs(state, start, 0, bound, [], null); if (sol) break; }
        if (sol) {
          var moves = [];
          sol.forEach(function (mi) { moves = moves.concat(split(macros[mi])); });
          if (!best || moves.length < best[1].length) best = [sl, moves];
        }
      });
      if (!best) throw new Error("could not insert a piece");
      if (best[1].length) state = apply(state, best[1].join(" "));
      out = out.concat(best[1]);
      done.push(best[0]);
    }
    return out;
  }
  function lblCornerKey(s, sl) { var d = center(s, "D"); return findSticker(s, CORNER_POS, [d, center(s, SIDE[sl[0]]), center(s, FRONT[sl[1]])], d); }
  function lblEdgeKey(s, sl) { var cx = center(s, SIDE[sl[0]]); return findSticker(s, EDGE_POS, [cx, center(s, FRONT[sl[1]])], cx); }
  function solveLblCorners(state) {
    return insertPieces(state, lblCornerKey, function (sl) { return idx([sl[0], 1, sl[1]], NRM.D); }, LBL_CORNER_MACROS, "c",
      function (s, sls) { return crossOk(s) && sls.every(function (q) { return pieceOk(s, [q[0], 1, q[1]]); }); }, 9);
  }
  function solveLblEdges(state) {
    return insertPieces(state, lblEdgeKey, function (sl) { return idx([sl[0], 0, sl[1]], NRM[SIDE[sl[0]]]); }, LBL_EDGE_MACROS, "e",
      function (s, sls) { return cornersOk(s) && sls.every(function (q) { return pieceOk(s, [q[0], 0, q[1]]); }); }, 6);
  }
  function orientKey(s) { var u = center(s, "U"); return LL_IDS.map(function (i) { return s[i] === u ? 1 : 0; }).join(""); }
  function permKey(s) { return LL_IDS.map(function (i) { return s[i]; }).join(""); }
  function solveLblYCross(state) { return lastLayer(state, ["F R U R' U' F'"], orientKey, yellowCrossOk); }
  function solveLblYFace(state) { return lastLayer(state, ["R U R' U R U2 R'"], orientKey, ollOk); }
  function solveLblYCorners(state) { return lastLayer(state, ["R' F R' B2 R F' R' B2 R2"], permKey, cornersPlacedOk); }
  function solveLblYEdges(state) { return lastLayer(state, ["R U' R U R U R U' R' U' R2", "R2 U R U R' U' R' U' R' U R'"], permKey, solved); }

  // ---------------------------------------------------------------- output
  function simplify(moves) {
    var out = [];
    moves.forEach(function (t) {
      var n = { "": 1, "'": 3, "2": 2 }[t.slice(1)];
      if (out.length && out[out.length - 1][0] === t[0]) {
        var m = (out.pop()[1] + n) % 4;
        if (m) out.push([t[0], m]);
      } else out.push([t[0], n]);
    });
    return out.map(function (fm) { return fm[0] + { 1: "", 2: "2", 3: "'" }[fm[1]]; });
  }
  function checkInput(s) {
    if (s.length !== 54 || /[^URFDLB]/.test(s)) throw new Error("expected 54 letters from U R F D L B");
    FACES.split("").forEach(function (f) {
      var n = s.split(f).length - 1;
      if (n !== 9) throw new Error("expected 9 stickers of " + f + ", found " + n);
    });
    for (var k = 0; k < 6; k++) if (s[9 * k + 4] !== FACES[k]) throw new Error("each centre must carry its own face letter");
  }
  var METHODS = {
    cfop: [["Cross", solveCross, crossOk], ["F2L", solveF2L, f2lOk], ["OLL", solveOLL, ollOk], ["PLL", solvePLL, solved]],
    lbl: [["White cross", solveCross, crossOk], ["White corners", solveLblCorners, cornersOk], ["Middle edges", solveLblEdges, f2lOk],
      ["Yellow cross", solveLblYCross, yellowCrossOk], ["Yellow face", solveLblYFace, ollOk],
      ["Yellow corners", solveLblYCorners, cornersPlacedOk], ["Yellow edges", solveLblYEdges, solved]]
  };
  var TITLES = { cfop: "CFOP method:", lbl: "LBL method:" };
  function solve(state, crossLetter, method) {
    var STAGES = METHODS[method || "cfop"];
    if (!STAGES) throw new Error("unknown method " + method);
    state = String(state).trim().toUpperCase();
    checkInput(state);
    var original = state;
    if (solved(state)) return STAGES.map(function (st) { return { name: st[0], moves: [] }; });
    var rotation = [];
    var rots = ["", "x", "x'", "x2", "z", "z'"];
    for (var i = 0; i < rots.length; i++) {
      if (center(apply(state, rots[i]), "D") === (crossLetter || "U")) { rotation = split(rots[i]); state = apply(state, rots[i]); break; }
    }
    var stages = STAGES.map(function (st) {
      var moves = st[1](state);
      if (moves === null) throw new Error(st[0] + " could not be solved; the state may not be reachable on a real cube");
      moves = simplify(moves);
      if (moves.length) state = apply(state, moves.join(" "));
      if (!st[2](state)) throw new Error(st[0] + " check failed");
      return { name: st[0], moves: moves };
    });
    stages[0].moves = rotation.concat(stages[0].moves);
    var all = [];
    stages.forEach(function (st) { all = all.concat(st.moves); });
    if (!solved(apply(original, all.join(" ")))) throw new Error("final check failed");
    return stages;
  }
  function format(stages, method) {
    return TITLES[method || "cfop"] + "\n" + stages.map(function (st) {
      return st.name + ": " + (st.moves.length ? "{ " + st.moves.join(" ") + " }" : "-");
    }).join("\n");
  }

  var api = { solve: solve, format: format, apply: apply, solved: solved, crossOk: crossOk, f2lOk: f2lOk, ollOk: ollOk };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.CubeSolver = api;

  if (typeof require !== "undefined" && typeof module !== "undefined" && require.main === module) {
    var args = process.argv.slice(2), facelets = null, centers = "", cross = "white", method = "cfop";
    for (var a = 0; a < args.length; a++) {
      if (args[a] === "--centers") centers = args[++a] || "";
      else if (args[a] === "--cross") cross = args[++a] || "white";
      else if (args[a] === "--method") method = (args[++a] || "cfop").toLowerCase();
      else facelets = args[a];
    }
    try {
      if (!facelets) throw new Error("usage: node solve.js FACELETS [--centers \"U=white, ...\"] [--cross white]");
      var letter = "U";
      if (centers) {
        var names = {};
        centers.split(",").forEach(function (part) {
          var kv = part.split("=");
          if (kv.length === 2) names[kv[1].trim().toLowerCase()] = kv[0].trim().toUpperCase();
        });
        if (!names[cross.toLowerCase()]) throw new Error("no centre has colour " + cross);
        letter = names[cross.toLowerCase()];
      }
      console.log(format(solve(facelets, letter, method), method));
    } catch (e) {
      console.error("error: " + e.message);
      process.exit(1);
    }
  }
})(typeof window !== "undefined" ? window : this);
/* SOLVER END */
(function(){
var S=48,AX=['X','Y','Z'];
var COL={U:'#f4f4f4',D:'#f5d000',F:'#1faa4b',B:'#1e63d0',R:'#d62f2f',L:'#f08a1c'};
var CNAME={U:'white',D:'yellow',F:'green',B:'blue',R:'red',L:'orange'};
var FACES=[
['F','translateZ(24px)',[0,0,1]],
['B','rotateY(180deg) translateZ(24px)',[0,0,-1]],
['R','rotateY(90deg) translateZ(24px)',[1,0,0]],
['L','rotateY(-90deg) translateZ(24px)',[-1,0,0]],
['U','rotateX(90deg) translateZ(24px)',[0,-1,0]],
['D','rotateX(-90deg) translateZ(24px)',[0,1,0]]];
var DEF={U:[1,-1,-1],D:[1,1,1],R:[0,1,1],L:[0,-1,-1],F:[2,1,1],B:[2,-1,-1],M:[0,0,-1],E:[1,0,1],S:[2,0,1],x:[0,null,1],y:[1,null,-1],z:[2,null,1]};
var SEXY="R U R' U' ";
var MIX="L U L' F U' F' B U B' R U' R'"; // lifts the first-layer corners out without touching the cross
var METHODS=[
 ['LBL',[
  ['1 White cross',[['lbl-cross-1','Edge A','F2'],['lbl-cross-2','Edge B',"U' R2"]],['any','cross'],"Build the white cross on the bottom, each edge matching its side centre."],
  ['2 White corners',[['lbl-corner-1','1 repeat',SEXY.trim()],['lbl-corner-3','3 repeats',(SEXY+SEXY+SEXY).trim()],['lbl-corner-5','5 repeats',(SEXY+SEXY+SEXY+SEXY+SEXY).trim()]],['cross','cornersD'],"Finish the white layer by putting the four white corners in place."],
  ['3 Middle edges',[['lbl-edge-right','Goes right',"U R U' R' U' F' U F"],['lbl-edge-left','Goes left',"U' L' U L U F U' F'"]],['layer1','f2l'],"Finish the first two layers by inserting the middle-layer edges."],
  ['4 Yellow cross',[['lbl-ycross-line','Line',"F R U R' U' F'"],['lbl-ycross-l','L shape',"F U R U' R' F'"]],['f2l','eo'],"Make a yellow cross on top."],
  ['5 Yellow face',[['lbl-yface-sune','Fish',"R U R' U R U2 R'"]],['eo','oll'],"Turn the whole top face yellow."],
  ['6 Yellow corners',[['lbl-corners','Cycle',"R' F R' B2 R F' R' B2 R2"]],['oll','cp'],"Move each yellow corner to its own spot."],
  ['7 Yellow edges',[['lbl-edges-ua','Ua',"R U' R U R U R U' R' U' R2"],['lbl-edges-ub','Ub',"R2 U R U R' U' R' U' R' U R'"]],['cp','solved'],"Move the yellow edges into place to solve the cube."]
 ]],
 ['CFOP',[
  ['Cross',[['cfop-cross-1','1',"F2 U' R2 U F2",MIX],['cfop-cross-2','2',"L2 R2 D2 L2 R2",MIX]],['any','cross'],"Build the white cross on the bottom, each edge matching its side centre."],
  ['F2L',[['cfop-f2l-1','1',"U R U' R'"],['cfop-f2l-2','2',"U' F' U F"],['cfop-f2l-3','3',"R U R'"],['cfop-f2l-4','4',"F' U' F"],['cfop-f2l-5','5',"U' R U R' U2 R U' R'"],['cfop-f2l-6','6',"R U2 R' U' R U R'"]],['cross','f2l'],"Finish the first two layers by inserting the corner-edge pairs."],
  ['OLL',[['cfop-oll-line','Line',"F R U R' U' F'"],['cfop-oll-l','L shape',"F U R U' R' F'"],['cfop-oll-sune','Sune',"R U R' U R U2 R'"],['cfop-oll-antisune','Anti-Sune',"R U2 R' U' R U' R'"],['cfop-oll-h','H',"R U R' U R U' R' U R U2 R'"],['cfop-oll-pi','Pi',"R U2 R2 U' R2 U' R2 U2 R"],['cfop-oll-headlights','Headlights',"R2 D' R U2 R' D R U2 R"]],['f2l','oll'],"Turn the whole top face yellow."],
  ['PLL',[['cfop-pll-t','T',"R U R' U' R' F R2 U' R' U' R U R' F'"],['cfop-pll-y','Y',"F R U' R' U' R U R' F' R U R' U' R' F R F'"],['cfop-pll-ua','Ua',"R U' R U R U R U' R' U' R2"],['cfop-pll-ub','Ub',"R2 U R U R' U' R' U' R' U R'"],['cfop-pll-h','H',"M2 U M2 U2 M2 U M2"],['cfop-pll-z','Z',"M' U M2 U M2 U M' U2 M2 U'"]],['oll','solved'],"Move the top-layer pieces into place to solve the cube."]
 ]]
];
var cubeEl=document.getElementById('rbCube'),scene=document.getElementById('rbScene');
var stEl=document.getElementById('rbStatus'),histEl=document.getElementById('rbHist');
var inp=document.getElementById('rbAlg'),errEl=document.getElementById('rbErr');
var playBtn=document.getElementById('rbPlay'),caseEl=document.getElementById('rbEx');
var cubies=[],busy=false,playing=false,list=[],listStr='',idx=0,hist=[],hpos=0;
var tab=0,current=null;
var rx=-28,ry=-38;

function I(){return [[1,0,0],[0,1,0],[0,0,1]]}
function rotF(a,deg){
  var r=deg*Math.PI/180,c=Math.cos(r),s=Math.sin(r);
  if(a===0)return [[1,0,0],[0,c,-s],[0,s,c]];
  if(a===1)return [[c,0,s],[0,1,0],[-s,0,c]];
  return [[c,-s,0],[s,c,0],[0,0,1]];
}
function rot(a,deg){return rotF(a,deg).map(function(r){return r.map(function(v){return Math.round(v)})})}
function mm(A,B){var o=[[0,0,0],[0,0,0],[0,0,0]];for(var i=0;i<3;i++)for(var j=0;j<3;j++)for(var k=0;k<3;k++)o[i][j]+=A[i][k]*B[k][j];return o}
function mv3(A,v){return [A[0][0]*v[0]+A[0][1]*v[1]+A[0][2]*v[2],A[1][0]*v[0]+A[1][1]*v[1]+A[1][2]*v[2],A[2][0]*v[0]+A[2][1]*v[1]+A[2][2]*v[2]]}
function unit(i){var v=[0,0,0];v[i]=1;return v}
function cross(a,b){return [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]]}
function base(c){var m=c.m,p=c.p;return 'matrix3d('+[m[0][0],m[1][0],m[2][0],0,m[0][1],m[1][1],m[2][1],0,m[0][2],m[1][2],m[2][2],0,p[0]*S,p[1]*S,p[2]*S,1].join(',')+')'}

var LUP={F:[0,-1,0],B:[0,-1,0],R:[0,-1,0],L:[0,-1,0],U:[0,0,-1],D:[0,0,1]},LRT={F:[1,0,0],B:[-1,0,0],R:[0,0,-1],L:[0,0,1],U:[1,0,0],D:[1,0,0]};
for(var x=-1;x<=1;x++)for(var y=-1;y<=1;y++)for(var z=-1;z<=1;z++){
  (function(home){
    var el=document.createElement('div');el.className='rb-c';
    var c={el:el,home:home,p:home.slice(),m:I()};
    FACES.forEach(function(f){
      var fe=document.createElement('div');fe.className='rb-f';fe.style.transform=f[1];
      var n=f[2],a=n[0]?0:(n[1]?1:2);
      if(home[a]===n[a]){var st=document.createElement('i');st.style.background=COL[f[0]];fe.appendChild(st);fe.className='rb-f st';fe._c=c;fe._n=n;
        if(Math.abs(home[0])+Math.abs(home[1])+Math.abs(home[2])===1){var lb=document.createElement('b');lb.className='rb-lbl';fe.appendChild(lb);c.lbl=lb;c.u0=LUP[f[0]];c.x0=LRT[f[0]]}}
      el.appendChild(fe);
    });
    cubeEl.appendChild(el);el.style.transform=base(c);cubies.push(c);
  })([x,y,z]);
}
function labels(){
  cubies.forEach(function(c){
    if(!c.lbl)return;
    var p=c.p,f=p[1]<0?'U':p[1]>0?'D':p[0]>0?'R':p[0]<0?'L':p[2]>0?'F':'B';
    var d=f==='U'?[0,0,-1]:f==='D'?[0,0,1]:[0,-1,0],a=mv3(c.m,c.u0),b=mv3(c.m,c.x0);
    var th=Math.round(Math.atan2(b[0]*d[0]+b[1]*d[1]+b[2]*d[2],a[0]*d[0]+a[1]*d[1]+a[2]*d[2])*180/Math.PI);
    c.lbl.textContent=f;c.lbl.style.transform='translate(-50%,-50%) rotate('+th+'deg)';
  });
}
function pick(a,layer){return cubies.filter(function(c){return layer===null||c.p[a]===layer})}
function pose(sel,a,deg){sel.forEach(function(c){c.el.style.transform='rotate'+AX[a]+'('+deg.toFixed(2)+'deg) '+base(c)})}
function commit(sel,a,deg){
  var q=Math.round(deg/90)%4;
  if(q!==0){var R=rot(a,q*90);sel.forEach(function(c){c.p=mv3(R,c.p);c.m=mm(R,c.m)})}
  sel.forEach(function(c){c.el.style.transform=base(c)});
}
function anim(sel,a,from,to,dur,cb){
  var t0=null;
  function frame(ts){
    if(t0===null)t0=ts;
    var k=dur>0?Math.min(1,(ts-t0)/dur):1,e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;
    if(k<1){pose(sel,a,from+(to-from)*e);requestAnimationFrame(frame)}
    else{commit(sel,a,to);if(cb)cb()}
  }
  requestAnimationFrame(frame);
}
function turn(mv,animate,cb){
  var d=DEF[mv.f],deg=d[2]*90*mv.n,sel=pick(d[0],d[1]);
  if(!animate){commit(sel,d[0],deg);if(cb)cb();return}
  anim(sel,d[0],0,deg,mv.n===2?420:300,cb);
}
function solved(){
  var ref=null;
  cubies.forEach(function(c){if(!ref&&Math.abs(c.home[0])+Math.abs(c.home[1])+Math.abs(c.home[2])===3)ref=c.m});
  return cubies.every(function(c){
    var n=Math.abs(c.home[0])+Math.abs(c.home[1])+Math.abs(c.home[2]);
    if(n===0)return true;
    var h=mv3(ref,c.home);
    if(h[0]!==c.p[0]||h[1]!==c.p[1]||h[2]!==c.p[2])return false;
    if(n<2)return true;
    for(var i=0;i<3;i++)for(var j=0;j<3;j++)if(c.m[i][j]!==ref[i][j])return false;
    return true;
  });
}
function homeAt(p,n){
  var c=null,out='?';
  cubies.forEach(function(q){if(q.p[0]===p[0]&&q.p[1]===p[1]&&q.p[2]===p[2])c=q});
  FACES.forEach(function(f){
    var h=f[2],a=h[0]?0:(h[1]?1:2);
    if(c.home[a]!==h[a])return;
    var w=mv3(c.m,h);
    if(w[0]===n[0]&&w[1]===n[1]&&w[2]===n[2])out=f[0];
  });
  return out;
}
var NRM={U:[0,-1,0],R:[1,0,0],F:[0,0,1],D:[0,1,0],L:[-1,0,0],B:[0,0,-1]};
var AT={
  U:function(r,c){return [c,-1,r]},
  R:function(r,c){return [1,r,-c]},
  F:function(r,c){return [c,r,1]},
  D:function(r,c){return [c,1,-r]},
  L:function(r,c){return [-1,r,c]},
  B:function(r,c){return [-c,r,-1]}
};
function stateInfo(){
  var order=['U','R','F','D','L','B'],map={},scheme=[],A=[-1,0,1],s='';
  order.forEach(function(X){var h=homeAt(NRM[X],NRM[X]);map[h]=X;scheme.push(X+'='+CNAME[h])});
  order.forEach(function(X){A.forEach(function(r){A.forEach(function(c){s+=map[homeAt(AT[X](r,c),NRM[X])]||'?'})})});
  return {facelets:s,scheme:scheme.join(', ')};
}
function parse(str){
  var t=String(str||'').trim();if(!t)return null;
  var out=[],ok=true;
  t.split(/\s+/).forEach(function(tok){
    var m=/^([UDLRFBMESxyz])(2|'|’)?$/.exec(tok);
    if(!m){ok=false;return}
    out.push({f:m[1],n:m[2]==='2'?2:(m[2]?-1:1)});
  });
  return ok?out:null;
}
function fmt(m){return m.f+(m.n===2?'2':m.n===-1?"'":'')}
function inverse(l){return l.slice().reverse().map(function(m){return {f:m.f,n:m.n===2?2:-m.n}})}
function nameOf(a,layer,q){
  var f=null;
  Object.keys(DEF).forEach(function(k){if(DEF[k][0]===a&&DEF[k][1]===layer)f=k});
  var n=((q*DEF[f][2])%4+4)%4;
  if(n===0)return '';
  return f+(n===2?'2':n===3?"'":'');
}
function draw(){
  labels();
  histEl.textContent='';
  if(!hist.length)histEl.textContent='No moves yet';
  hist.forEach(function(t,i){var sp=document.createElement('span');sp.textContent=t;if(i===hpos-1)sp.className='on';else if(i>=hpos)sp.className='fut';histEl.appendChild(sp)});
  document.getElementById('rbBack').disabled=busy||playing||hpos===0;
  document.getElementById('rbFwd').disabled=busy||playing||hpos>=hist.length;
  var ok=solved();
  stEl.textContent=ok?'Solved':'Not solved';
  stEl.style.color=ok?'var(--text-success)':'var(--text-secondary)';
  notifyHost();
  playBtn.innerHTML=playing?'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="1.5"/></svg>':'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15l13-7.5z"/></svg>';playBtn.title=playing?'Stop':'Play';playBtn.setAttribute('aria-label',playBtn.title);
}
/* Host hooks: a page that embeds this script (the artifact version) can set window.coachRubikHost =
   {change(snapshot)} to save the state, and call window.coachRubik.play(moves). */
function snapshot(withAnswer){
  var st=stateInfo(),mv='';
  if(withAnswer){try{mv=answerMoves()}catch(e){}}
  return {facelets:st.facelets,centers:st.scheme,method:METHODS[current?current.m:tab][0],
    exercise:current?exerciseName():'',goal:current?METHODS[current.m][1][current.s][3]:'',
    answer:mv,history:hist.slice(0,hpos).join(' '),solved:solved(),restore:pack()};
}
// Exact widget state for restoring after a reload: each piece's position and rotation, plus tab, exercise and history.
function pack(){
  return {cubies:cubies.map(function(c){return c.p.concat(c.m[0],c.m[1],c.m[2]).join(',')}).join(';'),
    tab:tab,current:current,hist:hist.slice(),hpos:hpos,rx:rx,ry:ry};
}
function restore(o){
  if(!o||busy||playing)return false;
  var rows=String(o.cubies||'').split(';').map(function(r){return r.split(',').map(Number)});
  if(rows.length!==cubies.length||rows.some(function(n){return n.length!==12||n.some(function(v){return !isFinite(v)})}))return false;
  cubies.forEach(function(c,i){var n=rows[i];c.p=n.slice(0,3);c.m=[n.slice(3,6),n.slice(6,9),n.slice(9,12)];c.el.style.transform=base(c)});
  if(METHODS[o.tab])tab=o.tab;
  var c=o.current,ok=c&&METHODS[c.m]&&METHODS[c.m][1][c.s]&&(c.i===-1||METHODS[c.m][1][c.s][1][c.i]);
  current=ok?{m:c.m,s:c.s,i:c.i}:null;
  hist=Array.isArray(o.hist)?o.hist.filter(function(t){return parse(t)}).map(String):[];
  hpos=Math.max(0,Math.min(hist.length,o.hpos|0));
  if(isFinite(o.rx)&&isFinite(o.ry)){rx=+o.rx;ry=+o.ry;view()}
  clearAlg();renderTab();draw();
  return true;
}
var lastSent='';
function notifyHost(){
  var h=window.coachRubikHost;
  if(!h||!h.change||busy||playing)return;
  var s=snapshot(),k=JSON.stringify(s);
  if(k!==lastSent){lastSent=k;h.change(s)}
}
window.coachRubik={restore:restore,play:function(moves){if(busy||playing)return false;inp.value=moves;playBtn.click();return true},snapshot:function(){return snapshot(true)}};
function reset(){cubies.forEach(function(c){c.p=c.home.slice();c.m=I();c.el.style.transform=base(c)})}
function view(){cubeEl.style.transform='rotateX('+rx+'deg) rotateY('+ry+'deg)'}
function clearAlg(){list=[];listStr='';idx=0;inp.value='';errEl.textContent=''}
function ensure(){
  var p=parse(inp.value);
  if(!p){errEl.textContent=inp.value.trim()?"Use only U D L R F B M E S x y z, optionally followed by ' or 2, separated by spaces.":'Enter some moves first.';return false}
  var s=p.map(fmt).join(' ');
  if(s!==listStr||idx>=list.length||!list.length){list=p;listStr=s;idx=0}
  return true;
}
function step(cb){
  if(busy||idx>=list.length)return;
  busy=true;
  var m=list[idx];
  turn(m,true,function(){idx++;record(fmt(m));busy=false;draw();if(cb)cb()});
}
function run(){
  if(!playing)return;
  if(idx>=list.length){playing=false;draw();return}
  step(run);
}

/* ---------- method tabs and practice cases ---------- */
var tabsEl=document.getElementById('rbTabs'),stepsEl=document.getElementById('rbSteps');
function setCase(c){
  current=c;
  caseEl.textContent='';
  var t=document.createElement('b'),g=document.createElement('span');
  t.textContent=c?'Exercise: '+METHODS[c.m][0]+' \u00b7 '+METHODS[c.m][1][c.s][0].replace(/^\d+ /,'')+' \u00b7 '+(c.i<0?'Random':METHODS[c.m][1][c.s][1][c.i][1]):'Practice \u00b7 '+METHODS[tab][0];
  g.textContent=c?'Goal: '+METHODS[c.m][1][c.s][3]:'Turn the cube any way you like, or pick an exercise below.';
  caseEl.appendChild(t);caseEl.appendChild(g);
  document.querySelectorAll('.rb-case,.rb-rand').forEach(function(b){b.classList.toggle('sel',!!c&&b._k===c.m+'/'+c.s+'/'+c.i)});
}
function loadCase(m,s,i){
  if(busy)return;
  var cs=METHODS[m][1][s][1][i];
  playing=false;reset();
  turn({f:'z',n:2},false);
  if(cs[3])parse(cs[3]).forEach(function(mv){turn(mv,false)});
  inverse(parse(cs[2])).forEach(function(mv){turn(mv,false)});
  hist=[];hpos=0;clearAlg();
  var cross=/cross/.test(cs[0]);
  rx=cross?32:-28;ry=-38;view();
  setCase({m:m,s:s,i:i});draw();
}
function renderTab(){
  tabsEl.textContent='';stepsEl.textContent='';
  METHODS.forEach(function(md,m){
    var b=document.createElement('button');b.className='rb-tab'+(m===tab?' sel':'');b.textContent=md[0];
    b.setAttribute('role','tab');b.setAttribute('aria-selected',m===tab?'true':'false');
    b.addEventListener('click',function(){tab=m;setCase(null);renderTab()});
    tabsEl.appendChild(b);
  });
  METHODS[tab][1].forEach(function(stp,s){
    var row=document.createElement('div');row.className='rb-step';
    var lb=document.createElement('span');lb.textContent=stp[0];row.appendChild(lb);
    var btns=document.createElement('div');btns.className='rb-btns';row.appendChild(btns);
    var rb=document.createElement('button');rb.className='rb-rand';rb._k=tab+'/'+s+'/-1';
    rb.title='Random '+stp[0].replace(/^\d+ /,'')+' case';rb.setAttribute('aria-label',rb.title);
    rb.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22"/><path d="m18 2 4 4-4 4"/><path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2"/><path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8"/><path d="m18 14 4 4-4 4"/></svg>';
    rb.addEventListener('click',function(){randomCase(tab,s)});
    btns.appendChild(rb);
    stp[1].forEach(function(cs,i){
      var b=document.createElement('button');b.className='rb-case';b.textContent=cs[1];b._k=tab+'/'+s+'/'+i;
      b.addEventListener('click',function(){loadCase(tab,s,i)});
      btns.appendChild(b);
    });
    stepsEl.appendChild(row);
  });
  setCase(current);
}
/* ---------- random practice states ---------- */
var AUF=["U","U'","U2"],SIDE=[];
"RLFB".split('').forEach(function(X){[[X,X+"'"],[X+"'",X]].forEach(function(p){AUF.forEach(function(u){SIDE.push(p[0]+' '+u+' '+p[1])})})});
var OLLA=["F R U R' U' F'","F U R U' R' F'","R U R' U R U2 R'","R U2 R' U' R U' R'","R U R' U R U' R' U R U2 R'","R U2 R2 U' R2 U' R2 U2 R","R2 D' R U2 R' D R U2 R"];
var PLLA=["R U R' U' R' F R2 U' R' U' R U R' F'","F R U' R' U' R U R' F' R U R' U' R' F R F'","R U' R U R U R U' R' U' R2","R2 U R U R' U' R' U' R' U R'","M2 U M2 U2 M2 U M2","M' U M2 U M2 U M' U2 M2 U'"];
var MID=["U R U' R' U' F' U F","U B U' B' U' R' U R","U L U' L' U' B' U B","U F U' F' U' L' U L","U' L' U L U F U' F'","U' F' U F U R U' R'","U' R' U R U B U' B'","U' B' U B U L U' L'"];
var CPA=PLLA.slice(2);
[["U","U'"],["U2","U2"],["U'","U"]].forEach(function(ab){PLLA.slice(2).forEach(function(p){CPA.push(ab[0]+' '+p+' '+ab[1])})});
var GEN={cross:[SIDE.concat(AUF),14],layer1:[MID.concat(AUF),8],f2l:[OLLA.concat(PLLA,AUF),8],eo:[OLLA.slice(2).concat(PLLA,AUF),8],oll:[PLLA.concat(AUF),6],cp:[CPA,4]};
var STK=[];['U','R','F','D','L','B'].forEach(function(f){[-1,0,1].forEach(function(r){[-1,0,1].forEach(function(c){STK.push([AT[f](r,c),f])})})});
function stk(p){var o=[];STK.forEach(function(t,i){if(t[0][0]===p[0]&&t[0][1]===p[1]&&t[0][2]===p[2])o.push(i)});return o}
function pOk(s,p){return stk(p).every(function(i){return s[i]===STK[i][1]})}
function pPlaced(s,p){var ids=stk(p);return ids.map(function(i){return s[i]}).sort().join('')===ids.map(function(i){return STK[i][1]}).sort().join('')}
function every(list,f){return list.every(f)}
var CHK={
  cross:function(s){return every([[0,1,1],[1,1,0],[0,1,-1],[-1,1,0]],function(p){return pOk(s,p)})},
  cornersD:function(s){return CHK.cross(s)&&every([[1,1,1],[-1,1,1],[1,1,-1],[-1,1,-1]],function(p){return pOk(s,p)})},
  f2l:function(s){return CHK.cornersD(s)&&every([[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1]],function(p){return pOk(s,p)})},
  eo:function(s){return CHK.f2l(s)&&every([[0,-1,1],[1,-1,0],[0,-1,-1],[-1,-1,0]],function(p){return stk(p).some(function(i){return STK[i][1]==='U'&&s[i]==='U'})})},
  oll:function(s){return CHK.f2l(s)&&s.slice(0,9)==='UUUUUUUUU'},
  cp:function(s){return CHK.oll(s)&&every([[1,-1,1],[-1,-1,1],[1,-1,-1],[-1,-1,-1]],function(p){return pPlaced(s,p)})},
  solved:function(s){return STK.every(function(t,i){return s[i]===t[1]})}
};
function randomCase(m,s){
  if(busy)return;
  var spec=METHODS[m][1][s][2],gen=GEN[spec[0]],tries=0;
  playing=false;
  do{
    reset();turn({f:'z',n:2},false);
    if(spec[0]==='any'){
      var fs='UDLRFB',last='',k=0;
      while(k<20){var f=fs[Math.floor(Math.random()*6)];if(f===last)continue;last=f;k++;turn({f:f,n:[1,-1,2][Math.floor(Math.random()*3)]},false)}
    }else{
      for(var j=0;j<gen[1];j++)parse(gen[0][Math.floor(Math.random()*gen[0].length)]).forEach(function(mv){turn(mv,false)});
    }
  }while(CHK[spec[1]](stateInfo().facelets)&&++tries<30);
  hist=[];hpos=0;clearAlg();
  rx=s===0?32:-28;ry=-38;view();
  setCase({m:m,s:s,i:-1});draw();
}
var STAGE_OF={cross:0,cornersD:1,f2l:1,eo:2,oll:2,cp:3,solved:3};
function answerMoves(){
  if(current&&current.i>=0)return METHODS[current.m][1][current.s][1][current.i][2];
  var m=current?current.m:tab,method=METHODS[m][0]==='LBL'?'lbl':'cfop';
  var st=stateInfo(),white='D';
  st.scheme.split(', ').forEach(function(kv){var p=kv.split('=');if(p[1]==='white')white=p[0]});
  var stages=window.CubeSolver.solve(st.facelets,white,method),upto=stages.length-1,mv=[];
  if(current)upto=method==='lbl'?current.s:STAGE_OF[METHODS[current.m][1][current.s][2][1]];
  for(var k=0;k<=upto;k++)mv=mv.concat(stages[k].moves);
  return mv.join(' ');
}
function exerciseName(){
  if(!current)return '';
  var stp=METHODS[current.m][1][current.s];
  return METHODS[current.m][0]+' \u00b7 '+stp[0].replace(/^\d+ /,'')+' \u00b7 '+(current.i<0?'Random':stp[1][current.i][1]+' ('+stp[1][current.i][0]+')');
}
document.getElementById('rbAnswer').addEventListener('click',function(){
  if(busy||playing)return;
  errEl.textContent='';
  var mv;
  try{mv=answerMoves()}catch(e){errEl.textContent='Could not work out the moves for this cube.';return}
  if(!mv){errEl.textContent='Nothing to do: this is already done.';inp.value='';return}
  inp.value=mv;list=[];listStr='';idx=0;
});
function stamp(){
  var d=new Date();
  function p(n,w){n=String(n);while(n.length<(w||2))n='0'+n;return n}
  return p(d.getHours())+':'+p(d.getMinutes())+':'+p(d.getSeconds())+'.'+p(d.getMilliseconds(),3);
}
document.getElementById('rbAsk').addEventListener('click',function(){
  if(busy||playing)return;
  var st=stateInfo(),mv='';
  try{mv=answerMoves()}catch(e){}
  var msg='My cube right now ('+(current?exerciseName():'Practice \u00b7 '+METHODS[tab][0])+').'
    +'\nAnswer: '+(mv||'nothing to do')
    +'\nState (Kociemba facelet string, face order U R F D L B):\n'+st.facelets
    +'\nCenters: '+st.scheme
    +'\nSent at: '+stamp();
  if(typeof sendPrompt==='function'){sendPrompt(msg)}
  else{errEl.textContent='Could not send to chat. Copy this instead: '+msg}
});

function record(t){hist=hist.slice(0,hpos);hist.push(t);hpos=hist.length}
function nav(d){
  if(busy||playing)return;
  if(d<0&&hpos>0){
    var m=parse(hist[hpos-1])[0];busy=true;
    turn({f:m.f,n:m.n===2?2:-m.n},true,function(){hpos--;busy=false;draw()});
  }else if(d>0&&hpos<hist.length){
    busy=true;
    turn(parse(hist[hpos])[0],true,function(){hpos++;busy=false;draw()});
  }
}
document.getElementById('rbBack').addEventListener('click',function(){nav(-1)});
document.getElementById('rbFwd').addEventListener('click',function(){nav(1)});
playBtn.addEventListener('click',function(){
  if(playing){playing=false;draw();return}
  if(busy)return;
  if(inp.value.trim()){if(!ensure()){draw();return}inp.value=''}
  else if(!(list.length&&idx<list.length)){errEl.textContent='Enter some moves first.';return}
  playing=true;draw();run();
});
inp.addEventListener('input',function(){errEl.textContent=''});
document.getElementById('rbReset').addEventListener('click',function(){if(busy)return;playing=false;reset();hist=[];hpos=0;clearAlg();setCase(null);draw()});
document.getElementById('rbScr').addEventListener('click',function(){
  if(busy)return;playing=false;reset();
  var fs='UDLRFB',ns=[1,-1,2],sc=[],last='';
  while(sc.length<20){var f=fs[Math.floor(Math.random()*6)];if(f===last)continue;last=f;sc.push({f:f,n:ns[Math.floor(Math.random()*3)]})}
  sc.forEach(function(m){turn(m,false)});
  hist=[];hpos=0;clearAlg();setCase(null);draw();
});

function proj(v){var w=mv3(mm(rotF(0,rx),rotF(1,ry)),v);return [w[0],w[1]]}
var g=null;
scene.addEventListener('pointerdown',function(e){
  var fe=e.target.closest?e.target.closest('.rb-f'):null;
  scene.setPointerCapture(e.pointerId);
  if(fe&&fe._c&&!busy&&!playing){
    g={mode:'layer',c:fe._c,n:mv3(fe._c.m,fe._n),x:e.clientX,y:e.clientY,locked:false,deg:0};
  }else if(!fe||!fe._c){
    g={mode:'view',x:e.clientX,y:e.clientY};scene.style.cursor='grabbing';
  }
});
scene.addEventListener('pointermove',function(e){
  if(!g)return;
  if(g.mode==='view'){
    var flip=Math.cos(rx*Math.PI/180)<0?-1:1;
    ry+=(e.clientX-g.x)*0.5*flip;rx-=(e.clientY-g.y)*0.5;
    rx=((rx+180)%360+360)%360-180;g.x=e.clientX;g.y=e.clientY;view();return;
  }
  var dx=e.clientX-g.x,dy=e.clientY-g.y;
  if(!g.locked){
    if(Math.sqrt(dx*dx+dy*dy)<8)return;
    var na=g.n[0]?0:(g.n[1]?1:2),best=-1;
    [0,1,2].forEach(function(ti){
      if(ti===na)return;
      var pr=proj(unit(ti)),len=Math.sqrt(pr[0]*pr[0]+pr[1]*pr[1])||1;
      var sc=Math.abs(dx*pr[0]+dy*pr[1])/len;
      if(sc>best){best=sc;g.ti=ti;g.u=[pr[0]/len,pr[1]/len];g.len=len}
    });
    g.ra=3-na-g.ti;
    g.sign=cross(unit(g.ra),g.n)[g.ti];
    g.layer=(Math.abs(g.c.p[0])+Math.abs(g.c.p[1])+Math.abs(g.c.p[2])===1)?null:g.c.p[g.ra];
    g.sel=pick(g.ra,g.layer);
    g.locked=true;busy=true;
  }
  g.deg=(dx*g.u[0]+dy*g.u[1])/Math.max(g.len,0.35)/(1.5*S)*57.3*g.sign;
  pose(g.sel,g.ra,g.deg);
});
function endDrag(){
  scene.style.cursor='grab';
  if(!g)return;
  var d=g;g=null;
  if(d.mode!=='layer'||!d.locked)return;
  var target=Math.round(d.deg/90)*90;
  anim(d.sel,d.ra,d.deg,target,160,function(){
    var nm=nameOf(d.ra,d.layer,Math.round(target/90));
    if(nm){list=[];listStr='';idx=0;record(nm)}
    busy=false;draw();
  });
}
// On phones the chat around the widget scrolls on the same swipe unless the touch is cancelled here;
// CSS touch-action alone isn't enough inside the app's webview.
['touchstart','touchmove'].forEach(function(t){scene.addEventListener(t,function(e){if(e.cancelable)e.preventDefault()},{passive:false})});
scene.addEventListener('pointerup',endDrag);
scene.addEventListener('pointercancel',endDrag);

renderTab();view();draw();
})();
