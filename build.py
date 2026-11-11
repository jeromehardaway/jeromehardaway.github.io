#!/usr/bin/env python3
"""Build jerome.codes into _site/.

Standard library only. Each file in pages/ is an HTML body with a small
front matter block; it is wrapped in templates/base.html and written to
_site/<path>/index.html. The build fails on broken internal links,
placeholder text or missing metadata, so CI catches them before deploy.

    python3 build.py          # build
    python3 build.py --serve  # build, then serve _site on :8000
"""

from __future__ import annotations

import html
import json
import re
import shutil
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).parent
PAGES = ROOT / "pages"
PARTIALS = ROOT / "templates" / "partials"
STATIC = ROOT / "static"
OUT = ROOT / "_site"

SITE_URL = "https://jerome.codes"
SITE_NAME = "Jerome Hardaway"
DEFAULT_OG = "/og.png"

# Order matters: this is the primary nav.
NAV = [
    ("about", "About", "/about/"),
    ("artifacts", "Artifacts", "/artifacts/"),
    ("how-i-build", "How I Build", "/how-i-build/"),
    ("writing", "Writing", "/writing/"),
    ("resume", "Résumé", "/resume/"),
    ("contact", "Contact", "/contact/"),
]

# Text that must never ship. The checklist's quality bar bans placeholders.
BANNED = re.compile(r"coming soon|lorem ipsum|\bTODO\b|\bTBD\b", re.I)

FRONT_MATTER = re.compile(r"\A---\n(.*?)\n---\n", re.S)


def parse(path: Path) -> tuple[dict[str, str], str]:
    text = path.read_text(encoding="utf-8")
    match = FRONT_MATTER.match(text)
    if not match:
        sys.exit(f"{path}: missing front matter")
    meta = {}
    for line in match.group(1).splitlines():
        if not line.strip():
            continue
        key, _, value = line.partition(":")
        meta[key.strip()] = value.strip()
    for key in ("title", "description", "path"):
        if not meta.get(key):
            sys.exit(f"{path}: front matter needs '{key}'")
    return meta, text[match.end():]


def include_partials(body: str) -> str:
    def replace(match: re.Match) -> str:
        return (PARTIALS / f"{match.group(1)}.html").read_text(encoding="utf-8")

    return re.sub(r"\{\{>\s*([\w-]+)\s*\}\}", replace, body)


def nav_html(active: str) -> str:
    items = []
    for key, label, href in NAV:
        current = ' aria-current="page"' if key == active else ""
        items.append(f'<li><a href="{href}"{current}>{label}</a></li>')
    return "\n            ".join(items)


def render(base: str, meta: dict[str, str], body: str) -> str:
    path = meta["path"]
    title = meta["title"]
    full_title = title if path == "/" else f"{title} | {SITE_NAME}"
    values = {
        "title": html.escape(full_title),
        "description": html.escape(meta["description"], quote=True),
        "canonical": SITE_URL + path,
        "og_image": SITE_URL + meta.get("og_image", DEFAULT_OG),
        "og_type": meta.get("og_type", "website"),
        "nav": nav_html(meta.get("nav", "")),
        "body_class": meta.get("body_class", ""),
        "head_extra": (
            (PARTIALS / "person-jsonld.html").read_text(encoding="utf-8")
            if meta.get("jsonld") == "person"
            else ""
        ),
        "year": str(date.today().year),
        "content": include_partials(body),
    }
    return re.sub(r"\{\{\s*(\w+)\s*\}\}", lambda m: values[m.group(1)], base)


def out_file(url_path: str) -> Path:
    if url_path.endswith(".html"):
        return OUT / url_path.lstrip("/")
    return OUT / url_path.strip("/") / "index.html"


def check_links(pages: dict[str, str]) -> list[str]:
    """Every internal href/src must resolve to a built page or static file."""
    errors = []
    for url_path, page_html in pages.items():
        ids = set(re.findall(r'\bid="([^"]+)"', page_html))
        for target in re.findall(r'(?:href|src)="([^"]+)"', page_html):
            if target.startswith(("http://", "https://", "mailto:", "tel:", "data:")):
                continue
            if target.startswith("#"):
                if target[1:] and target[1:] not in ids:
                    errors.append(f"{url_path}: no element with id '{target[1:]}'")
                continue
            if not target.startswith("/"):
                errors.append(f"{url_path}: use root-relative links, got '{target}'")
                continue
            clean = target.split("#")[0].split("?")[0]
            resolved = OUT / clean.lstrip("/")
            if clean.endswith("/"):
                resolved = resolved / "index.html"
            if not resolved.is_file():
                errors.append(f"{url_path}: broken link '{target}'")
            elif "#" in target and clean in pages:
                anchor = target.split("#", 1)[1]
                if f'id="{anchor}"' not in pages[clean]:
                    errors.append(f"{url_path}: no '#{anchor}' on {clean}")
    return errors


def build() -> None:
    if OUT.exists():
        shutil.rmtree(OUT)
    shutil.copytree(STATIC, OUT)

    base = (ROOT / "templates" / "base.html").read_text(encoding="utf-8")
    pages: dict[str, str] = {}
    errors: list[str] = []

    for source in sorted(PAGES.rglob("*.html")):
        meta, body = parse(source)
        page_html = render(base, meta, body)
        if meta["path"] in pages:
            errors.append(f"{source}: duplicate path {meta['path']}")
        visible = re.sub(r"<[^>]+>", " ", page_html)
        for hit in BANNED.findall(visible):
            errors.append(f"{source}: banned placeholder text '{hit}'")
        if len(meta["description"]) > 170:
            errors.append(f"{source}: description over 170 characters")
        pages[meta["path"]] = page_html
        target = out_file(meta["path"])
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(page_html, encoding="utf-8")

    indexable = sorted(p for p in pages if not p.endswith(".html"))
    today = date.today().isoformat()
    sitemap = ['<?xml version="1.0" encoding="UTF-8"?>',
               '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    sitemap += [f"  <url><loc>{SITE_URL}{p}</loc><lastmod>{today}</lastmod></url>"
                for p in indexable]
    sitemap.append("</urlset>")
    (OUT / "sitemap.xml").write_text("\n".join(sitemap) + "\n", encoding="utf-8")

    # JSON-LD must at least be valid JSON.
    for url_path, page_html in pages.items():
        for block in re.findall(
            r'<script type="application/ld\+json">(.*?)</script>', page_html, re.S
        ):
            try:
                json.loads(block)
            except json.JSONDecodeError as exc:
                errors.append(f"{url_path}: invalid JSON-LD ({exc})")

    errors += check_links(pages)
    if errors:
        print("\n".join(errors), file=sys.stderr)
        sys.exit(f"build failed: {len(errors)} problem(s)")
    print(f"built {len(pages)} pages into {OUT.name}/")


def serve() -> None:
    import functools
    import http.server

    handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(OUT))
    with http.server.ThreadingHTTPServer(("127.0.0.1", 8000), handler) as server:
        print("serving http://127.0.0.1:8000")
        server.serve_forever()


if __name__ == "__main__":
    build()
    if "--serve" in sys.argv:
        serve()
