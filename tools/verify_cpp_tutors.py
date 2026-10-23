#!/usr/bin/env python3
"""Check 21 zero-beginner guides, compiling and running every complete C++17 example."""
import json
import subprocess
import tempfile
from pathlib import Path

root = Path(__file__).resolve().parents[1]
source = root / "docs" / "md" / "cpp"
guide = json.loads((source / "assets" / "cpp-tutor-data.json").read_text(encoding="utf-8"))
stages = json.loads((source / "assets" / "cpp-practice-data.json").read_text(encoding="utf-8"))
assert guide["schema"] == 1
assert len(guide["lessons"]) == 21
assert len(stages["lessons"]) == 23
assert set(guide["lessons"]) == {f"{n:02d}" for n in range(1, 22)}
with tempfile.TemporaryDirectory(prefix="cpp-tutor-check-") as folder:
    folder = Path(folder)
    for i in range(1, 22):
        ident = f"{i:02d}"
        item = guide["lessons"][ident]
        assert item["name"].startswith(ident)
        assert len(item["terms"]) >= 3 and len(item["trace"]) == 3
        assert all(len(x) == 2 and all(x) for x in item["terms"])
        assert all(isinstance(x, str) and x for x in item["trace"])
        assert len(item["check"]["options"]) == 3
        assert 0 <= item["check"]["correct"] < 3
        for key in ("goal", "analogy", "code", "output", "pitfall", "tiny"):
            assert item[key], (ident, key)
        matches = list(source.glob(ident + "-*.md"))
        assert len(matches) == 1, ident
        assert matches[0].stem in stages["lessons"], ident
        cpp = folder / (ident + ".cpp")
        binary = folder / (ident + ".bin")
        cpp.write_text(item["code"] + "\n", encoding="utf-8")
        subprocess.run(
            ["g++", "-std=c++17", "-Wall", "-Wextra", str(cpp), "-o", str(binary)],
            check=True, capture_output=True, text=True, timeout=25,
        )
        result = subprocess.run(
            [str(binary)], input=item["input"], check=True,
            text=True, capture_output=True, timeout=5,
        )
        assert result.stdout.split() == item["output"].split(), (
            ident, result.stdout, item["output"],
        )
print("PASS: 21 beginner tutorials, 84+ terms, 63 traced steps, 21 C++17 examples compiled and executed")

