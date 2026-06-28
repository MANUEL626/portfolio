# Déploiement et domaine personnalisé

Le portfolio est prêt à être connecté à un domaine personnalisé.

## Domaines possibles

- `tevilawson.dev`
- `emmanuellawson.dev`
- `portfolio.tevilawson.com`
- `lawson-akplaka.dev`

## Configuration Vercel

1. Acheter le domaine chez un registrar.
2. Dans Vercel, ouvrir le projet du portfolio.
3. Aller dans `Settings > Domains`.
4. Ajouter le domaine choisi.
5. Copier les enregistrements DNS proposés par Vercel.
6. Les ajouter chez le registrar.
7. Attendre la propagation DNS.

## Points à vérifier après connexion

- Le HTTPS est actif.
- L'ancien lien Vercel redirige correctement.
- Le lien du CV pointe vers le domaine personnalisé.
- Les liens GitHub, WhatsApp et démos fonctionnent.
- Les pages `/projets/<slug>` sont accessibles.
