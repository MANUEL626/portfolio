from pathlib import Path

from flask import Flask, abort, render_template, url_for

from config import Config
from data.home import COLLABORATIONS, EXPERTISE_TAGS, KEY_METRICS, PROCESS_STEPS, SERVICES
from data.projects import PROJECT_FILTERS, PROJECTS
from data.site_config import SITE_CONFIG


app = Flask(__name__)
app.config.from_object(Config)

SCREENSHOT_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp", ".gif"}


def get_project_by_slug(slug):
    return next((project for project in PROJECTS if project.get("slug") == slug), None)


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
    )


if __name__ == "__main__":
    app.run(
        debug=app.config["DEBUG"],
        host=app.config["HOST"],
        port=app.config["PORT"],
    )
