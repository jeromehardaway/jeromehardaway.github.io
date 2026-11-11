# jerome.codes

Jerome Hardaway's portfolio. Everything on it is work done at [Vets Who Code](https://vetswhocode.io), and it is built against the [Vets Who Code portfolio checklist](https://vetswhocode.io/portfolio-checklist).

## Run it

Python 3.10 or newer. No dependencies.

```sh
python3 build.py --serve
```

That builds the site into `_site/` and serves it at http://127.0.0.1:8000.

## How it is put together

| Path | What it is |
| --- | --- |
| `pages/` | One HTML file per page: a front matter block (`title`, `description`, `path`, optional `nav`) and the page body |
| `templates/base.html` | The shell every page is wrapped in: head, nav, footer |
| `templates/partials/` | Fragments included with `{{> name}}` |
| `static/` | Copied to the site root as is: CSS, JS, icons, `robots.txt`, `llms.txt`, `CNAME` |
| `build.py` | The generator. Also writes `sitemap.xml`. |

## What the build checks

`build.py` exits non-zero, and CI fails, if:

- an internal link or anchor does not resolve
- a page is missing a title, description or path
- a meta description is over 170 characters
- placeholder text such as "coming soon" appears anywhere
- a JSON-LD block is not valid JSON

## Deploy

Pushing to `main` runs `.github/workflows/static.yml`, which builds and deploys `_site/` to GitHub Pages. Pull requests run the build without deploying.

## Keeping it true

Every number on the site was counted from repository history, CI configuration or the GitHub API on the date the page states. When a number changes, update the page and add an entry to `pages/changelog.html`.

## License

&copy; 2026 Jerome Hardaway. All rights reserved.
