# Portfolio Flask

Portfolio personnel construit avec Flask, Jinja, Tailwind CDN et des assets SVG locaux.

## Structure

```text
.
├── main.py
├── config.py
├── data/
│   ├── projects.py
│   └── site_config.py
├── templates/
│   ├── base.html
│   └── index.html
└── static/
    ├── css/style.css
    ├── js/main.js
    └── image/tech/
```

## Installation

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

## Lancement

```bash
flask --app main run
```

Ou directement :

```bash
python main.py
```

Les variables disponibles sont documentées dans `.env.example`.

## Ajouter un projet

Les projets sont déclarés dans `data/projects.py`.

Les sections `Mobile` et `Desktop` sont conservées dans `PROJECT_FILTERS` pour les prochains ajouts.

## Ajouter des captures

Place les captures dans `static/image/screenshot/<slug-du-projet>/`.

Formats détectés automatiquement : `.png`, `.jpg`, `.jpeg`, `.webp`, `.gif`.

Exemple :

```text
static/image/screenshot/veille-concurrentielle-automatisee/img.png
```

## Domaine personnalisé

Voir `docs/deploiement-domaine.md` pour la checklist de connexion d'un domaine sur Vercel.
