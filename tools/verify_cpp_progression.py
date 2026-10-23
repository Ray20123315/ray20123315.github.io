#!/usr/bin/env python3
"""Verify staged C++ learning data and compile the original C++17 examples."""
import json
import re
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "docs" / "md" / "cpp"
DATA = SOURCE / "assets" / "cpp-practice-data.json"
SAMPLES = [["","Hello, C++!\nI can code!"],["","5\n62.5\n3"],["17 5\n","22\n2"],["75\n","Pass"],["4\n","10"],["5\n","2"],["5\n3 7 2 9 4\n","9"],["banana\n","3"],["3 4\n","25"],["2 3\n1 2 3\n4 5 6\n","21"],["3\n","9"],["5\n8 3 8 1 4\n","1 3 4 8 8"],["5 7\n1 3 5 7 9\n","3"],["4 2\n2 3 5 7\n1 3\n0 0\n","15\n2"],["4\n","24"],["","7\n3"],["4 3\n0 1\n1 2\n2 3\n","3"],["4\n1 3\n2 5\n3 4\n4 6\n","3"],["4\n","5"],["3 3\n0 2 10\n0 1 2\n1 2 3\n","5"],["5\n-2 0 3 1 -1\n","2"]]

def run():
    bank = json.loads(DATA.read_text(encoding="utf-8"))
    assert bank["schema"] == 1
    lessons = bank["lessons"]
    assert len(lessons) == 23
    total = 0
    for idx in range(1, 24):
        matches = list(SOURCE.glob(f"{idx:02d}-*.md"))
        assert len(matches) == 1, (idx, matches)
        path = matches[0]
        raw = path.read_text(encoding="utf-8")
        ident = path.stem
        assert ident in lessons
        assert f'data-cpp-practice="{ident}"' in raw, ident
        stages = lessons[ident]["stages"]
        assert len(stages) == (4 if idx <= 21 else 10 if idx == 22 else 3)
        total += len(stages)
        for stage in stages:
            assert stage["prompt"].strip() and stage["hint"].strip()
            if stage["type"] == "choice":
                assert len(stage["options"]) >= 3 and 0 <= stage["correct"] < len(stage["options"])
            elif stage["type"] == "fill":
                assert stage["answer"].strip() and "____" in stage["prompt"]
            elif stage["type"] == "code":
                assert stage["starter"].startswith("#include") and stage["output"].strip()
            else:
                raise AssertionError(stage)
    assert total == 97
    assert "data-cpp-overview" in (SOURCE / "00-學習地圖.md").read_text(encoding="utf-8")
    print(f"PASS progression: 23 lessons, {total} stages")

    with tempfile.TemporaryDirectory(prefix="cpp-course-test-") as tmp:
        for n, (sample_input, expected) in enumerate(SAMPLES, start=1):
            source, = list(SOURCE.glob(f"{n:02d}-*.md"))
            raw = source.read_text(encoding="utf-8")
            fence = chr(96) * 3
            match = re.search(re.escape(fence) + r"cpp\n(.*?)\n" + re.escape(fence), raw, re.S)
            assert match, source
            cpp = Path(tmp) / f"{n:02d}.cpp"
            exe = Path(tmp) / f"{n:02d}.bin"
            cpp.write_text(match.group(1) + "\n", encoding="utf-8")
            subprocess.run(["g++", "-std=c++17", "-Wall", "-Wextra", str(cpp), "-o", str(exe)],
                           check=True, capture_output=True, text=True, timeout=25)
            p = subprocess.run([str(exe)], input=sample_input, text=True,
                               capture_output=True, timeout=5, check=True)
            assert p.stdout.split() == expected.split(), (source, p.stdout, expected)
    print("PASS compilation: all 21 source examples and public sample outputs")

if __name__ == "__main__":
    run()

