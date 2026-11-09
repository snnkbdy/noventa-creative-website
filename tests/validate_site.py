from html.parser import HTMLParser
from pathlib import Path
import re
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parents[1] / "karaguslar-insaat"
HTML = ROOT / "index.html"
source = HTML.read_text(encoding="utf-8")

class SiteParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids = []
        self.links = []
        self.labels = []
        self.images = []
        self.scripts = []
        self._script = False
        self._script_text = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if "id" in attrs:
            self.ids.append(attrs["id"])
        if tag in ("a", "link") and attrs.get("href"):
            self.links.append(attrs["href"])
        if tag == "label" and attrs.get("for"):
            self.labels.append(attrs["for"])
        if tag == "img":
            self.images.append(attrs)
        if tag == "script" and attrs.get("src") is None and attrs.get("type", "text/javascript") in ("text/javascript", "module"):
            self._script = True
            self._script_text = []

    def handle_data(self, data):
        if self._script:
            self._script_text.append(data)

    def handle_endtag(self, tag):
        if tag == "script" and self._script:
            self.scripts.append("".join(self._script_text))
            self._script = False

parser = SiteParser()
parser.feed(source)
parser.close()

duplicates = sorted({item for item in parser.ids if parser.ids.count(item) > 1})
assert not duplicates, f"Duplicate IDs: {duplicates}"
id_set = set(parser.ids)
missing_anchors = sorted({href[1:] for href in parser.links if href.startswith("#") and href[1:] not in id_set})
assert not missing_anchors, f"Broken in-page links: {missing_anchors}"
assert "KARAGUŞLAR İNŞAAT" in source, "Brand spelling missing"
assert "KARAGÜŞLAR" not in source and "KARAGÜŞLER" not in source, "Incorrect brand spelling found"
assert 'id="email"' not in source, "Unavailable email field should not be shown"
assert "mailto:?" not in source, "Form must not open an empty-recipient email draft"
assert "henüz gönderilmedi" in source, "Form submission status must be transparent"
assert "<title>" in source and 'name="description"' in source, "SEO title/description missing"
assert 'name="viewport"' in source, "Viewport metadata missing"
assert 'id="lead-form"' in source, "Lead form missing"
assert source.count("<h1") == 1, "Page must have exactly one primary heading"
assert 'id="skip"' in source and 'href="#main-content"' in source, "Keyboard skip navigation missing"
assert 'aria-expanded="false"' in source and 'aria-controls="nav"' in source, "Mobile navigation accessibility attributes missing"
assert 'id="form-note"' in source and 'role="status"' in source, "Form status feedback missing"
assert 'name="name"' in source and 'name="phone"' in source, "Essential inquiry fields missing"
assert 'type="tel"' in source and '10,25' in source, "Phone number validation missing"
assert "prefers-reduced-motion" in source, "Reduced-motion support missing"
assert "@media(max-width:850px)" in source and "@media(max-width:520px)" in source, "Tablet/mobile breakpoints missing"
assert "background-image:" in source and "mask-image:" in source, "Architectural hero treatment missing"
assert "prefers-reduced-motion" in source, "Reduced-motion support missing"
assert "IntersectionObserver" in source, "Scroll reveal fallback missing"
assert "application/ld+json" in source, "Organization structured data missing"

for image in parser.images:
    assert image.get("alt") is not None, f"Image missing alt text: {image.get('src')}"
for label in parser.labels:
    assert label in id_set, f"Label points to missing field: {label}"

for href in parser.links:
    if href.startswith("./") and not href.startswith("./#"):
        local = href.split("?", 1)[0].split("#", 1)[0]
        if local:
            assert (ROOT / local[2:]).is_file(), f"Missing local asset: {local}"

with tempfile.TemporaryDirectory() as tmp:
    for index, script in enumerate(parser.scripts):
        path = Path(tmp) / f"inline-{index}.js"
        path.write_text(script, encoding="utf-8")
        subprocess.run(["node", "--check", str(path)], check=True)

print("KARAGUŞLAR İNŞAAT site validation passed.")
print(f"Checked {len(parser.ids)} IDs, {len(parser.links)} links, {len(parser.images)} images and {len(parser.scripts)} inline scripts.")
