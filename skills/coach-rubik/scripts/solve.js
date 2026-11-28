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
})(this);
