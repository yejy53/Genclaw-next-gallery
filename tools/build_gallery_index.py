#!/usr/bin/env python3
"""Build the public, read-only gallery index from a curated manifest.

Sources may be single files (image / html) or directory "bundles" (a built
page whose ``index.html`` pulls in relative ``./assets`` such as JS, GLB or
MP4). Cases whose curated sources are not present on the current machine are
skipped and their previously published output is preserved, so the gallery can
be rebuilt on a checkout that does not carry the private ``runs/`` tree.
"""

from __future__ import annotations

import copy
import json
import os
import platform
import re
import shutil
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

_REEXEC_FLAG = "GALLERY_INDEX_ARCH_RETRY"


def pillow_loads() -> bool:
    try:
        from PIL import Image  # noqa: F401
    except Exception:
        return False
    return True


def reexec_for_pillow() -> None:
    """Retry under the other architecture when Pillow will not load.

    Covers are the one asset every visitor downloads, and Pillow is what
    shrinks them; if it fails to import they silently ship at print
    resolution. node is x86_64 here, so `npm run index` hands this script a
    translated interpreter, and a working Pillow may sit on either slice
    depending on how its image libraries were installed. Rather than pinning
    an architecture, try the current one and flip once.
    """
    if pillow_loads() or sys.platform != "darwin" or os.environ.get(_REEXEC_FLAG):
        return
    other = "x86_64" if platform.machine() == "arm64" else "arm64"
    try:
        subprocess.run(
            ["arch", f"-{other}", "/usr/bin/true"],
            check=True, capture_output=True, timeout=5,
        )
    except Exception:
        return
    os.execvpe(
        "arch",
        ["arch", f"-{other}", sys.executable, *sys.argv],
        {**os.environ, _REEXEC_FLAG: "1"},
    )


ROOT = Path(__file__).resolve().parents[1]
GALLERY_ROOT = ROOT / "gallery"
SOURCE_MANIFEST = GALLERY_ROOT / "content" / "cases.json"
PUBLIC_CASES = GALLERY_ROOT / "public" / "cases"
GENERATED_INDEX = GALLERY_ROOT / "generated" / "cases.json"
GENERATED_REPORT = GALLERY_ROOT / "generated" / "index-report.json"

SAFE_SLUG = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
ALLOWED_SUFFIXES = {".html", ".png", ".jpg", ".jpeg", ".webp", ".svg"}


def load_json(path: Path) -> Any:
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def within_root(value: str) -> Path | None:
    candidate = (ROOT / value).resolve()
    try:
        candidate.relative_to(ROOT)
    except ValueError:
        return None
    return candidate


def resolve_curated_source(value: str) -> Path:
    source = within_root(value)
    if source is None:
        raise ValueError(f"Source escapes repository root: {value}")
    if not source.is_file():
        raise FileNotFoundError(f"Curated source does not exist: {value}")
    if source.suffix.lower() not in ALLOWED_SUFFIXES:
        raise ValueError(f"Unsupported public artifact type: {value}")
    return source


def resolve_bundle_dir(value: str) -> Path:
    source = within_root(value)
    if source is None:
        raise ValueError(f"Bundle escapes repository root: {value}")
    if not source.is_dir():
        raise FileNotFoundError(f"Bundle directory does not exist: {value}")
    if not (source / "index.html").is_file():
        raise ValueError(f"Bundle is missing index.html: {value}")
    return source


def publish(source_value: str, destination: Path) -> str:
    source = resolve_curated_source(source_value)
    destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, destination)
    return source.relative_to(ROOT).as_posix()


# Covers are the only assets every visitor downloads, and the curated sources
# are print-resolution: left as-is the home page pulls tens of megabytes to
# fill cards a few hundred pixels wide. Full-resolution files stay reachable as
# the result artifacts.
COVER_MAX_EDGE = 1200
COVER_QUALITY = 80


def publish_cover(source_value: str, case_dir: Path) -> tuple[str, str]:
    """Publish a cover, downscaled to WebP when it is a raster image."""
    source = resolve_curated_source(source_value)
    origin = source.relative_to(ROOT).as_posix()

    if source.suffix.lower() == ".svg":
        destination = case_dir / "cover.svg"
        shutil.copy2(source, destination)
        return "cover.svg", origin

    try:
        from PIL import Image
    except ImportError:
        destination = case_dir / f"cover{source.suffix.lower()}"
        shutil.copy2(source, destination)
        print("  ! Pillow missing; cover copied at full resolution")
        return destination.name, origin

    with Image.open(source) as img:
        img = img.convert("RGB")
        if max(img.size) > COVER_MAX_EDGE:
            img.thumbnail((COVER_MAX_EDGE, COVER_MAX_EDGE), Image.LANCZOS)
        destination = case_dir / "cover.webp"
        img.save(destination, "WEBP", quality=COVER_QUALITY, method=6)
    return "cover.webp", origin


def validate_case(item: dict[str, Any]) -> None:
    slug = item.get("slug")
    if not isinstance(slug, str) or not SAFE_SLUG.fullmatch(slug):
        raise ValueError(f"Invalid case slug: {slug!r}")
    if item.get("category") not in {"web", "poster", "infographic", "svg"}:
        raise ValueError(f"Invalid category for {slug}")
    if not item.get("results"):
        raise ValueError(f"Case must contain at least one result: {slug}")
    if "sources" not in item:
        raise ValueError(f"Case is missing curated sources: {slug}")


def sources_available(item: dict[str, Any], sources: dict[str, Any]) -> bool:
    cover = within_root(sources.get("cover", ""))
    if cover is None or not cover.is_file():
        return False
    result_sources = sources.get("results", {})
    for result in item["results"]:
        spec = result_sources.get(result.get("id"))
        if not spec:
            return False
        if "bundle" in spec:
            bundle = within_root(spec["bundle"])
            if bundle is None or not (bundle / "index.html").is_file():
                return False
        elif "artifact" in spec:
            artifact = within_root(spec["artifact"])
            if artifact is None or not artifact.is_file():
                return False
        else:
            return False
    if item.get("baseline"):
        bspec = sources.get("baseline")
        if not bspec or "artifact" not in bspec:
            return False
        artifact = within_root(bspec["artifact"])
        if artifact is None or not artifact.is_file():
            return False
    return True


def build() -> None:
    curated = load_json(SOURCE_MANIFEST)
    if not isinstance(curated, list):
        raise ValueError("Gallery manifest must be a JSON array")

    existing_by_slug: dict[str, dict[str, Any]] = {}
    if GENERATED_INDEX.is_file():
        try:
            for entry in load_json(GENERATED_INDEX):
                existing_by_slug[entry["slug"]] = entry
        except Exception:
            existing_by_slug = {}

    PUBLIC_CASES.mkdir(parents=True, exist_ok=True)
    GENERATED_INDEX.parent.mkdir(parents=True, exist_ok=True)

    public_cases: list[dict[str, Any]] = []
    copied_sources: list[dict[str, str]] = []
    preserved: list[str] = []

    for raw_item in curated:
        validate_case(raw_item)
        item = copy.deepcopy(raw_item)
        sources = item.pop("sources")
        slug = item["slug"]

        if not sources_available(item, sources):
            preserved_entry = existing_by_slug.get(slug)
            if preserved_entry is not None and (PUBLIC_CASES / slug).exists():
                public_cases.append(preserved_entry)
                preserved.append(slug)
                continue
            raise FileNotFoundError(
                f"Sources for '{slug}' are unavailable and no published output "
                f"exists to preserve."
            )

        case_dir = PUBLIC_CASES / slug
        if case_dir.exists():
            shutil.rmtree(case_dir)
        case_dir.mkdir(parents=True)

        cover_name, copied_from = publish_cover(sources["cover"], case_dir)
        item["cover"] = f"/cases/{slug}/{cover_name}"
        copied_sources.append(
            {"case": slug, "role": "cover", "source": copied_from}
        )

        result_sources = sources.get("results", {})
        result_ids: set[str] = set()
        for result in item["results"]:
            result_id = result.get("id")
            if not isinstance(result_id, str) or not SAFE_SLUG.fullmatch(result_id):
                raise ValueError(f"Invalid result id in {slug}: {result_id!r}")
            if result_id in result_ids:
                raise ValueError(f"Duplicate result id in {slug}: {result_id}")
            result_ids.add(result_id)

            source_spec = result_sources.get(result_id)
            if not source_spec:
                raise ValueError(f"Missing source for {slug}/{result_id}")

            if "bundle" in source_spec:
                bundle_dir = resolve_bundle_dir(source_spec["bundle"])
                shutil.copytree(bundle_dir, case_dir / result_id)
                result["artifact"] = f"/cases/{slug}/{result_id}/index.html"
                copied_sources.append(
                    {
                        "case": slug,
                        "role": f"result:{result_id}",
                        "source": bundle_dir.relative_to(ROOT).as_posix(),
                    }
                )
            elif "artifact" in source_spec:
                artifact_source = resolve_curated_source(source_spec["artifact"])
                artifact_name = f"{result_id}{artifact_source.suffix.lower()}"
                copied_from = publish(
                    source_spec["artifact"], case_dir / artifact_name
                )
                result["artifact"] = f"/cases/{slug}/{artifact_name}"
                copied_sources.append(
                    {
                        "case": slug,
                        "role": f"result:{result_id}",
                        "source": copied_from,
                    }
                )
            else:
                raise ValueError(f"Missing artifact/bundle for {slug}/{result_id}")

            preview_value = source_spec.get("preview")
            if preview_value:
                preview_source = resolve_curated_source(preview_value)
                preview_name = (
                    f"{result_id}-preview{preview_source.suffix.lower()}"
                )
                publish(preview_value, case_dir / preview_name)
                result["preview"] = f"/cases/{slug}/{preview_name}"
            elif result["kind"] == "html":
                result["preview"] = item["cover"]
            else:
                result["preview"] = result["artifact"]

        baseline = item.get("baseline")
        baseline_source = sources.get("baseline")
        if baseline:
            if not baseline_source or "artifact" not in baseline_source:
                raise ValueError(f"Missing baseline artifact source for {slug}")
            artifact_source = resolve_curated_source(baseline_source["artifact"])
            artifact_name = f"baseline{artifact_source.suffix.lower()}"
            copied_from = publish(baseline_source["artifact"], case_dir / artifact_name)
            baseline["artifact"] = f"/cases/{slug}/{artifact_name}"
            copied_sources.append(
                {"case": slug, "role": "baseline", "source": copied_from}
            )

            preview_value = baseline_source.get("preview")
            if preview_value:
                preview_source = resolve_curated_source(preview_value)
                preview_name = f"baseline-preview{preview_source.suffix.lower()}"
                publish(preview_value, case_dir / preview_name)
                baseline["preview"] = f"/cases/{slug}/{preview_name}"
            elif baseline["kind"] == "html":
                baseline["preview"] = item["cover"]
            else:
                baseline["preview"] = baseline["artifact"]

        public_cases.append(item)

    with GENERATED_INDEX.open("w", encoding="utf-8") as handle:
        json.dump(public_cases, handle, ensure_ascii=False, indent=2)
        handle.write("\n")

    report = {
        "schemaVersion": 1,
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "caseCount": len(public_cases),
        "resultCount": sum(len(item["results"]) for item in public_cases),
        "preservedCases": preserved,
        "copiedSources": copied_sources,
        "notes": [
            "Only explicitly curated files are copied; run logs and raw metadata remain private.",
            "The gallery is read-only and does not expose model credentials or live generation.",
        ],
    }
    with GENERATED_REPORT.open("w", encoding="utf-8") as handle:
        json.dump(report, handle, ensure_ascii=False, indent=2)
        handle.write("\n")

    msg = (
        f"Built {len(public_cases)} gallery cases and "
        f"{report['resultCount']} frozen results."
    )
    if preserved:
        msg += f" Preserved {len(preserved)} case(s) with missing sources: " + ", ".join(preserved)
    print(msg)


if __name__ == "__main__":
    reexec_for_pillow()
    build()
