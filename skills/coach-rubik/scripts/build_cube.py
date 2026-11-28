#!/usr/bin/env python3
"""Copy scripts/solve.js into assets/cube.js (between the SOLVER markers).

Run after changing solve.js, then commit and tag a new release, and update the
version in reference/widget.md's script URL.
"""
import os

here = os.path.dirname(os.path.abspath(__file__))
solver = open(os.path.join(here, "solve.js")).read()
solver = solver.replace("})(this);", '})(typeof window !== "undefined" ? window : this);')
path = os.path.join(here, "..", "assets", "cube.js")
cube = open(path).read()
a = cube.index("/* SOLVER START */") + len("/* SOLVER START */\n")
b = cube.index("/* SOLVER END */")
open(path, "w").write(cube[:a] + solver + cube[b:])
print("updated", os.path.normpath(path))
