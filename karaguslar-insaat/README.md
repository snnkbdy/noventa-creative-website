# KARAGUŞLAR İNŞAAT

Static, responsive Turkish corporate website.

## Preview locally
Open `index.html` in a browser. No build step or paid service is required.

## Free deployment
This folder can be deployed as a static site with Cloudflare Pages. Set the project root/build output to `karaguslar-insaat`; no build command is required.

## Included
- Responsive Turkish corporate page with services, concept gallery, FAQ and inquiry form.
- SEO metadata and Organization structured data.
- Accessible mobile navigation, skip link, reduced-motion support and no-JavaScript content fallback.
- Custom 404 page, SVG favicon, web manifest and static security headers.

## Before public launch
- Replace the typographic temporary brand mark with the supplied original KARAGUŞLAR İNŞAAT logo asset.
- Add verified company phone, email and address only after they are provided.
- Connect the inquiry form to an approved email/form endpoint if direct submissions are required. It currently validates the fields in the browser, displays a clear status message, and does not store or transmit form data.
- Replace concept imagery with approved project photography if available.

All project cards are explicitly labelled as concept visuals; they are not presented as completed client work.

## Automated checks
The repository runs a GitHub Actions validation workflow when files in this site folder change. It checks duplicate IDs, in-page navigation targets, local assets, image alt text, form labels, brand spelling, core SEO/accessibility features and inline JavaScript syntax.

Run locally from the repository root:

```bash
python tests/validate_site.py
```
