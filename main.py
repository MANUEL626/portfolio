from flask import Flask, render_template

from config import Config
from data.projects import PROJECT_FILTERS, PROJECTS
from data.site_config import SITE_CONFIG


app = Flask(__name__)
app.config.from_object(Config)


@app.route("/")
def index():
    return render_template(
        "index.html",
        projects=PROJECTS,
        project_filters=PROJECT_FILTERS,
        config=SITE_CONFIG,
    )


if __name__ == "__main__":
    app.run(
        debug=app.config["DEBUG"],
        host=app.config["HOST"],
        port=app.config["PORT"],
    )
