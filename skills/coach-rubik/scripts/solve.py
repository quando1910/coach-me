#!/usr/bin/env python3
"""Solve a 3x3 Rubik's cube stage by stage with the CFOP method.

Input: a Kociemba facelet string (54 letters, face order U R F D L B; each
face read row by row, top-left to bottom-right, as seen from outside with the
standard neighbouring face on top). Each letter names the face whose centre
has that colour.

Output: one line per CFOP stage (Cross, F2L, OLL, PLL), each move list in
braces, or "-" when the stage needs no moves. The whole solution is applied
to the input and checked before it is printed.

Usage:
  python3 solve.py FACELETS [--centers "U=white, R=red, ..."] [--cross white]

The cross is built on the face whose centre has the --cross colour (white by
default). If that face is not already at the bottom, the Cross line starts
with a whole-cube rotation (x, x', x2, z, z') that brings it there.

Pure Python 3 standard library; no install needed.
"""
import argparse
import sys
from collections import deque

FACES = "URFDLB"
NRM = {"U": (0, -1, 0), "R": (1, 0, 0), "F": (0, 0, 1),
       "D": (0, 1, 0), "L": (-1, 0, 0), "B": (0, 0, -1)}
# Position of the sticker in row r, column c (both -1..1) of each face.
# Coordinates: x to the right, y down, z towards the viewer.
AT = {
    "U": lambda r, c: (c, -1, r),
    "R": lambda r, c: (1, r, -c),
    "F": lambda r, c: (c, r, 1),
    "D": lambda r, c: (c, 1, -r),
    "L": lambda r, c: (-1, r, c),
    "B": lambda r, c: (-c, r, -1),
}
# axis, layer (None = whole cube), turn direction sign
DEF = {"U": (1, -1, -1), "D": (1, 1, 1), "R": (0, 1, 1), "L": (0, -1, -1),
       "F": (2, 1, 1), "B": (2, -1, -1), "M": (0, 0, -1), "E": (1, 0, 1),
       "S": (2, 0, 1), "x": (0, None, 1), "y": (1, None, -1), "z": (2, None, 1)}

STICKERS = []
for f in FACES:
    for r in (-1, 0, 1):
        for c in (-1, 0, 1):
            STICKERS.append((AT[f](r, c), NRM[f]))
INDEX = {s: i for i, s in enumerate(STICKERS)}


def idx(pos, normal):
    return INDEX[(tuple(pos), tuple(normal))]


def rot(axis, quarter):
    q = quarter % 4
    c, s = [(1, 0), (0, 1), (-1, 0), (0, -1)][q]
    return [[[1, 0, 0], [0, c, -s], [0, s, c]],
            [[c, 0, s], [0, 1, 0], [-s, 0, c]],
            [[c, -s, 0], [s, c, 0], [0, 0, 1]]][axis]


def mv(m, v):
    return tuple(sum(m[i][k] * v[k] for k in range(3)) for i in range(3))


def move_dest(token):
    """dest[i] = index the sticker at i moves to."""
    f, n = token[0], token[1:]
    n = 2 if n == "2" else -1 if n in ("'", "’") else 1
    axis, layer, sign = DEF[f]
    m = rot(axis, sign * n)
    dest = []
    for p, nr in STICKERS:
        if layer is None or p[axis] == layer:
            dest.append(idx(mv(m, p), mv(m, nr)))
        else:
            dest.append(idx(p, nr))
    return dest


def compose(*dests):
    out = list(range(54))
    for d in dests:
        out = [d[i] for i in out]
    return out


def to_src(dest):
    src = [0] * 54
    for i, j in enumerate(dest):
        src[j] = i
    return tuple(src)


_CACHE = {}


def seq_dest(alg):
    if alg not in _CACHE:
        _CACHE[alg] = compose(*[move_dest(t) for t in alg.split()]) if alg.split() else list(range(54))
    return _CACHE[alg]


def apply(state, alg):
    src = to_src(seq_dest(alg))
    return "".join(state[k] for k in src)


# ---------------------------------------------------------------- checks

def center(state, f):
    return state[idx(NRM[f], NRM[f])]


def piece_ok(state, pos):
    for (p, n), i in INDEX.items():
        if p == pos:
            f = [k for k, v in NRM.items() if v == n][0]
            if state[i] != center(state, f):
                return False
    return True


CROSS_POS = [(0, 1, 1), (1, 1, 0), (0, 1, -1), (-1, 1, 0)]
SLOTS = [(1, 1), (-1, 1), (-1, -1), (1, -1)]  # (x, z): FR, FL, BL, BR


def cross_ok(s):
    return all(piece_ok(s, p) for p in CROSS_POS)


def slot_ok(s, slot):
    x, z = slot
    return piece_ok(s, (x, 1, z)) and piece_ok(s, (x, 0, z))


def f2l_ok(s):
    return cross_ok(s) and all(slot_ok(s, sl) for sl in SLOTS)


def oll_ok(s):
    u = center(s, "U")
    return f2l_ok(s) and all(s[idx(AT["U"](r, c), NRM["U"])] == u for r in (-1, 0, 1) for c in (-1, 0, 1))


def solved(s):
    return all(s[i] == s[9 * k + 4] for k in range(6) for i in range(9 * k, 9 * k + 9))


# ---------------------------------------------------------------- pieces

EDGE_POS = [p for p in {p for p, _ in STICKERS} if sum(map(abs, p)) == 2]
CORNER_POS = [p for p in {p for p, _ in STICKERS} if sum(map(abs, p)) == 3]


def stickers_at(pos):
    return [i for (p, _), i in INDEX.items() if p == pos]


def find_sticker(state, positions, colors, want):
    """Index of the `want`-coloured sticker of the piece whose colours are `colors`."""
    for pos in positions:
        ids = stickers_at(pos)
        if sorted(state[i] for i in ids) == sorted(colors):
            return [i for i in ids if state[i] == want][0]
    raise ValueError("piece with colours %s not found" % "".join(colors))


def bfs_table(start, moves):
    """Distance from `start` (tuple of sticker indices) under `moves` (dest lists)."""
    dist = {start: 0}
    q = deque([start])
    while q:
        k = q.popleft()
        d = dist[k] + 1
        for m in moves:
            nk = tuple(m[i] for i in k)
            if nk not in dist:
                dist[nk] = d
                q.append(nk)
    return dist


FACE_MOVES = [f + s for f in "UDRLFB" for s in ("", "'", "2")]

# ---------------------------------------------------------------- cross


def solve_cross(state):
    d = center(state, "D")
    sides = [center(state, f) for f in "FRBL"]
    key = tuple(find_sticker(state, EDGE_POS, [d, c], d) for c in sides)
    solved_key = tuple(idx(p, NRM["D"]) for p in CROSS_POS)
    # The table only depends on which sticker slots are the goal, so it is
    # the same for every input; build it once per run.
    moves = [seq_dest(m) for m in FACE_MOVES]
    dist = bfs_table(solved_key, moves)
    if key not in dist:
        raise ValueError("cross edges are in an impossible position")
    out = []
    while dist[key] > 0:
        for name, m in zip(FACE_MOVES, moves):
            nk = tuple(m[i] for i in key)
            if dist.get(nk, 99) == dist[key] - 1:
                out.append(name)
                key = nk
                break
    return out


# ---------------------------------------------------------------- F2L

SIDE = {1: "R", -1: "L"}
FRONT = {1: "F", -1: "B"}


def inv_tok(t):
    return t[0] if t.endswith("'") else t if t.endswith("2") else t + "'"


F2L_MACROS = [("U",), ("U'",), ("U2",)]
for X in "RLFB":
    for x in (X, X + "'"):
        for u in ("U", "U'", "U2"):
            F2L_MACROS.append((x, u, inv_tok(x)))
F2L_MACRO_DEST = [seq_dest(" ".join(m)) for m in F2L_MACROS]
_PAIR_TABLES = {}


def pair_key(state, slot):
    x, z = slot
    cx, cz, d = center(state, SIDE[x]), center(state, FRONT[z]), center(state, "D")
    return (find_sticker(state, CORNER_POS, [d, cx, cz], d),
            find_sticker(state, EDGE_POS, [cx, cz], cx))


def pair_table(slot):
    if slot not in _PAIR_TABLES:
        x, z = slot
        goal = (idx((x, 1, z), NRM["D"]), idx((x, 0, z), NRM[SIDE[x]]))
        _PAIR_TABLES[slot] = bfs_table(goal, F2L_MACRO_DEST)
    return _PAIR_TABLES[slot]


def solve_pair(state, slot, keep, max_depth=8):
    table = pair_table(slot)
    start = pair_key(state, slot)
    if start not in table:
        raise ValueError("F2L pair in an impossible position")

    def dfs(s, key, g, bound, path, prev):
        h = table[key]
        if g + h > bound:
            return None
        if h == 0 and all(slot_ok(s, k) for k in keep):
            return path
        for mi, m in enumerate(F2L_MACROS):
            if prev is not None:
                pm = F2L_MACROS[prev]
                if len(m) == 1 and len(pm) == 1:
                    continue  # merge U turns
                if len(m) == 3 and len(pm) == 3 and m[0][0] == pm[0][0]:
                    continue  # same side face twice in a row is never shorter
            dest = F2L_MACRO_DEST[mi]
            ns = apply(s, " ".join(m))
            nk = tuple(dest[i] for i in key)
            r = dfs(ns, nk, g + 1, bound, path + [mi], mi)
            if r is not None:
                return r
        return None

    for bound in range(table[start], max_depth + 1):
        r = dfs(state, start, 0, bound, [], None)
        if r is not None:
            return [t for mi in r for t in F2L_MACROS[mi]]
    return None


def solve_f2l(state):
    out = []
    done = [sl for sl in SLOTS if slot_ok(state, sl)]
    while len(done) < 4:
        best = None
        for sl in SLOTS:
            if sl in done:
                continue
            sol = solve_pair(state, sl, done)
            if sol is not None and (best is None or len(sol) < len(best[1])):
                best = (sl, sol)
        if best is None:
            raise ValueError("could not solve an F2L pair")
        sl, sol = best
        state = apply(state, " ".join(sol)) if sol else state
        out += sol
        done.append(sl)
    return out


# ---------------------------------------------------------------- last layer

OLL_ALGS = [
    "F R U R' U' F'",
    "F U R U' R' F'",
    "R U R' U R U2 R'",
    "R U2 R' U' R U' R'",
    "R U R' U' R' F R F'",
    "R U2 R2 U' R2 U' R2 U2 R",
    "R2 D' R U2 R' D R U2 R",
]
PLL_ALGS = [
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
    "x' R U' R' D R U R' D' R U R' D R U' R' D' x",
]
AUF = ["U", "U'", "U2"]
LL_IDS = [i for (p, _), i in INDEX.items() if p[1] == -1 and sum(map(abs, p)) >= 2]


def last_layer(state, algs, key_fn, goal_fn):
    start = key_fn(state)
    seen = {start: None}
    q = deque([(state, start)])
    macros = AUF + algs
    while q:
        s, k = q.popleft()
        if goal_fn(s):
            path = []
            while seen[k] is not None:
                pk, m = seen[k]
                path.append(m)
                k = pk
            return [t for m in reversed(path) for t in m.split()]
        for m in macros:
            ns = apply(s, m)
            nk = key_fn(ns)
            if nk not in seen:
                seen[nk] = (k, m)
                q.append((ns, nk))
    return None


def solve_oll(state):
    u = center(state, "U")
    return last_layer(state, OLL_ALGS, lambda s: tuple(s[i] == u for i in LL_IDS), oll_ok)


def solve_pll(state):
    return last_layer(state, PLL_ALGS, lambda s: tuple(s[i] for i in LL_IDS), solved)


# ---------------------------------------------------------------- output

def simplify(moves):
    out = []
    for t in moves:
        n = {"": 1, "'": 3, "2": 2}[t[1:]]
        if out and out[-1][0] == t[0]:
            m = (out.pop()[1] + n) % 4
            if m:
                out.append((t[0], m))
        else:
            out.append((t[0], n))
    return [f + {1: "", 2: "2", 3: "'"}[n] for f, n in out]


def fmt(moves):
    return "{ " + " ".join(moves) + " }" if moves else "-"


def check_input(s):
    if len(s) != 54 or any(ch not in FACES for ch in s):
        raise ValueError("expected 54 letters from U R F D L B")
    for f in FACES:
        if s.count(f) != 9:
            raise ValueError("expected 9 stickers of %s, found %d" % (f, s.count(f)))
    if [s[9 * k + 4] for k in range(6)] != list(FACES):
        raise ValueError("each centre must carry its own face letter")


def solve(state, cross_letter):
    if solved(state):
        return [(n, []) for n in ("Cross", "F2L", "OLL", "PLL")]
    rotation = []
    for r in ["", "x", "x'", "x2", "z", "z'"]:
        if center(apply(state, r), "D") == cross_letter:
            rotation = r.split()
            state = apply(state, r)
            break
    stages = []
    for name, fn, ok in [("Cross", solve_cross, cross_ok), ("F2L", solve_f2l, f2l_ok),
                         ("OLL", solve_oll, oll_ok), ("PLL", solve_pll, solved)]:
        moves = fn(state)
        if moves is None:
            raise ValueError("%s could not be solved; the state may not be reachable on a real cube" % name)
        moves = simplify(moves)
        state = apply(state, " ".join(moves))
        if not ok(state):
            raise AssertionError("%s check failed" % name)
        stages.append((name, moves))
    stages[0] = ("Cross", rotation + stages[0][1])
    return stages


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("facelets")
    ap.add_argument("--centers", default="", help='e.g. "U=white, R=red, F=green, D=yellow, L=orange, B=blue"')
    ap.add_argument("--cross", default="white", help="colour to build the cross on (default white)")
    a = ap.parse_args()
    state = a.facelets.strip().upper()
    try:
        check_input(state)
        letter = "U"
        if a.centers:
            names = {}
            for part in a.centers.split(","):
                k, _, v = part.strip().partition("=")
                names[v.strip().lower()] = k.strip().upper()
            if a.cross.lower() not in names:
                raise ValueError("no centre has colour %s" % a.cross)
            letter = names[a.cross.lower()]
        stages = solve(state, letter)
        # Re-check the whole solution from the original input.
        allmoves = " ".join(m for _, ms in stages for m in ms)
        if not solved(apply(state, allmoves)):
            raise AssertionError("final check failed")
    except (ValueError, AssertionError) as e:
        print("error: %s" % e, file=sys.stderr)
        sys.exit(1)
    print("CFOP method:")
    for name, ms in stages:
        print("%s: %s" % (name, fmt(ms)))


if __name__ == "__main__":
    main()
