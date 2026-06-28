from pathlib import Path
from datetime import date
import os
from xml.sax.saxutils import escape

from flask import Flask, Response, abort, render_template, request, url_for

from config import Config
from data.home import COLLABORATIONS, EXPERTISE_TAGS, KEY_METRICS, PROCESS_STEPS, SERVICES
from data.projects import PROJECT_FILTERS, PROJECTS
from data.site_config import SITE_CONFIG


app = Flask(__name__)
app.config.from_object(Config)

SCREENSHOT_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp", ".gif"}


def get_project_by_slug(slug):
    return next((project for project in PROJECTS if project.get("slug") == slug), None)


def get_site_url():
    configured_url = os.environ.get("SITE_URL") or SITE_CONFIG.get("site_url")
    if configured_url:
        return configured_url.rstrip("/")
    return request.url_root.rstrip("/")


def absolute_url(endpoint, **values):
    return f"{get_site_url()}{url_for(endpoint, **values)}"


def build_seo(title=None, description=None, path=None, image_url=None, item_type="website"):
    site_url = get_site_url()
    canonical_url = f"{site_url}{path or request.path}"
    default_title = f"Portfolio - {SITE_CONFIG['author_name']}"
    default_description = SITE_CONFIG.get("site_description", "")

    return {
        "title": title or default_title,
        "description": description or default_description,
        "canonical_url": canonical_url,
        "image_url": image_url or f"{site_url}{url_for('static', filename='favicon.svg')}",
        "type": item_type,
    }


def get_project_gallery(slug):
    screenshot_dir = Path(app.static_folder) / "image" / "screenshot" / slug
    if not screenshot_dir.exists():
        return []

    files = sorted(
        file
        for file in screenshot_dir.iterdir()
        if file.is_file() and file.suffix.lower() in SCREENSHOT_EXTENSIONS
    )

    return [
        {
            "src": url_for("static", filename=f"image/screenshot/{slug}/{file.name}"),
            "alt": file.stem.replace("-", " ").replace("_", " ").strip().title(),
        }
        for file in files
    ]


def get_related_projects(project):
    related_slugs = project.get("related_slugs", [])
    if not related_slugs:
        return []

    return [item for slug in related_slugs if (item := get_project_by_slug(slug)) is not None]


def get_platform_links(project):
    return [
        {
            "label": stack.get("label"),
            "description": stack.get("description"),
            "url": url_for("index", filter=stack.get("type"), _anchor="projects"),
        }
        for stack in project.get("platform_stacks", [])
        if stack.get("type") and stack.get("label")
    ]


@app.route("/")
def index():
    automation_projects = [
        project for project in PROJECTS if "automation" in project.get("types", [project.get("type")])
    ]

    return render_template(
        "index.html",
        projects=PROJECTS,
        automation_projects=automation_projects,
        project_filters=PROJECT_FILTERS,
        expertise_tags=EXPERTISE_TAGS,
        key_metrics=KEY_METRICS,
        services=SERVICES,
        process_steps=PROCESS_STEPS,
        collaborations=COLLABORATIONS,
        config=SITE_CONFIG,
        seo=build_seo(),
    )


@app.route("/projets/<slug>")
def project_detail(slug):
    project = get_project_by_slug(slug)
    if project is None:
        abort(404)
    gallery = project.get("gallery") or get_project_gallery(slug)

    return render_template(
        "project_detail.html",
        project=project,
        gallery=gallery,
        related_projects=get_related_projects(project),
        platform_links=get_platform_links(project),
        config=SITE_CONFIG,
        back_url=url_for("index", _anchor="projects"),
        seo=build_seo(
            title=f"{project['title']} | Étude de cas - {SITE_CONFIG['author_name']}",
            description=project.get("summary") or project.get("description"),
            path=url_for("project_detail", slug=slug),
            item_type="article",
        ),
    )


@app.route("/robots.txt")
def robots_txt():
    content = "\n".join(
        [
            "User-agent: *",
            "Allow: /",
            "",
            f"Sitemap: {absolute_url('sitemap_xml')}",
            "",
        ]
    )
    return Response(content, mimetype="text/plain")


@app.route("/sitemap.xml")
def sitemap_xml():
    today = date.today().isoformat()
    urls = [
        {"loc": absolute_url("index"), "priority": "1.0", "changefreq": "monthly"},
        *[
            {
                "loc": absolute_url("project_detail", slug=project["slug"]),
                "priority": "0.8",
                "changefreq": "monthly",
            }
            for project in PROJECTS
        ],
    ]

    items = "\n".join(
        "  <url>\n"
        f"    <loc>{escape(item['loc'])}</loc>\n"
        f"    <lastmod>{today}</lastmod>\n"
        f"    <changefreq>{item['changefreq']}</changefreq>\n"
        f"    <priority>{item['priority']}</priority>\n"
        "  </url>"
        for item in urls
    )
    xml = f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{items}\n</urlset>\n'
    return Response(xml, mimetype="application/xml")


if __name__ == "__main__":
    app.run(
        debug=app.config["DEBUG"],
        host=app.config["HOST"],
        port=app.config["PORT"],
    )
