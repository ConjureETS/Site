# Conjure — site web

Site vitrine du [Conjure](https://conjure.itch.io/), le club étudiant de création de jeux vidéo de l'École de technologie supérieure (ÉTS), à Montréal. Construit avec [Next.js](https://nextjs.org/).

## Stack technique

| Techno | Rôle |
|---|---|
| [Next.js 15](https://nextjs.org/) (App Router, Turbopack) | Framework React : rendu des pages, routage, génération des métadonnées SEO. |
| [React 19](https://react.dev/) | Bibliothèque d'interface utilisateur. |
| [Tailwind CSS v4](https://tailwindcss.com/) | Styles utilitaires. Toute la palette de couleurs et les polices sont définies une seule fois dans `src/app/globals.css` (bloc `@theme`) — il n'y a pas de `tailwind.config.js`. |
| [next-intl](https://next-intl.dev/) | Site bilingue français/anglais (voir plus bas). |
| [react-icons](https://react-icons.github.io/react-icons/), [embla-carousel-react](https://www.embla-carousel.com/) | Icônes et carrousel (utilisé pour les jeux du Gamelab). |
| Aucune base de données | Le contenu (commanditaires, événements, compétitions, textes de chaque page) vit dans des fichiers JSON sous `src/messages/`, et les images/vidéos dans `public/`. Publier une modification = modifier ces fichiers et redéployer. |

## Démarrage rapide

```bash
npm install
npm run dev
```

Puis ouvrir [http://localhost:3000](http://localhost:3000) — la page redirige automatiquement vers `/fr` ou `/en` selon la langue du navigateur.

## Scripts npm

| Commande | Ce qu'elle fait |
|---|---|
| `npm run dev` | Lance le serveur de développement Next.js (avec Turbopack) sur le port 3000, avec rechargement à chaud à chaque sauvegarde. C'est la commande à utiliser au quotidien pour travailler sur le site. |
| `npm run build` | Génère le build de production (dans `.next/`). Sert à vérifier que le site compile correctement avant un déploiement, ou est utilisé automatiquement par la plateforme d'hébergement (ex. Vercel). |
| `npm run start` | Démarre le serveur en mode production à partir du build généré par `npm run build`. À exécuter après un `build` — ne fonctionne pas seule. |
| `npm run preview` | Fait un `build` puis un `start` à la suite. Pratique pour voir le site « comme en production » localement avant de pousser un changement. |
| `npm run lint` | Passe [ESLint](https://eslint.org/) (config `next/core-web-vitals`) sur le code pour attraper les erreurs évidentes et les mauvaises pratiques React/Next.js. |
| `npm run edit` | Lance l'**éditeur de contenu** : une petite interface web locale pour ajouter/modifier/supprimer des commanditaires, événements, compétitions et éléments du kit média sans toucher au code. Voir [`tools/content-editor/MANUEL.md`](tools/content-editor/MANUEL.md). |

## Structure du projet

```
src/
  app/
    [locale]/                 # Une route par langue (next-intl) : /fr/..., /en/...
      page.jsx                  # Page d'accueil
      about/page.jsx             # /about — Présentation
      contact/page.jsx           # /contact
      events/page.jsx            # /events — Événements
      games/page.jsx              # /games — Compétitions
      media-kit/page.jsx           # /media-kit — Kit média
      sponsors/page.jsx             # /sponsors — Partenaires
      layout.js                      # Layout racine : police, <html lang>, Navbar/Footer
    components/
      layout/                   # Navbar, Footer, bouton « retour en haut »
      sections/                  # Blocs de la page d'accueil (Hero, Mission, Offerings, ...)
      games/, events/             # Cartes et carrousels spécifiques à ces deux pages
      ui/                          # Composants génériques (Button, Badge, Container, Panel, PageHeader, ...)
    globals.css                   # Jetons de design Tailwind v4 (couleurs, polices)
  i18n/
    routing.js                # Langues supportées (fr, en) et langue par défaut
    navigation.js              # Link / usePathname / useRouter conscients de la langue active
    request.js                  # Liste des « namespaces » de traduction chargés sur chaque page
  messages/
    fr/*.json, en/*.json         # Tout le texte du site + le contenu dynamique (voir plus bas)
  lib/                             # Petits utilitaires partagés
public/                              # Images/vidéos servies telles quelles (ex. /sponsors/logo.png)
tools/content-editor/                  # Interface web locale pour éditer le contenu sans coder (npm run edit)
```

## Système de traduction (i18n)

Le site est bilingue français/anglais grâce à `next-intl` :

- **Langues** — `src/i18n/routing.js` déclare les langues supportées (`fr`, `en`) et la langue par défaut (`fr`). La détection automatique de la langue du navigateur reste active : un navigateur anglophone atterrit sur `/en`, un francophone (ou toute autre langue) sur `/fr`.
- **Une page, deux langues** — chaque page vit sous `src/app/[locale]/...`, donc un seul fichier `page.jsx` dessert le français et l'anglais ; c'est le contenu (les fichiers JSON) qui change, pas le code.
- **Namespaces** — le texte est réparti en petits fichiers JSON par section plutôt qu'un seul gros fichier : `src/messages/fr/sponsors.json` et `src/messages/en/sponsors.json`, par exemple. La liste des namespaces chargés sur chaque page est déclarée dans `src/i18n/request.js`.
- **Ajouter un namespace** — créer `<locale>/<nom>.json` pour **fr et en**, puis ajouter `"<nom>"` au tableau `NAMESPACES` de `src/i18n/request.js`.
- **Règle importante** — les fichiers `fr/<x>.json` et `en/<x>.json` d'un même namespace doivent garder **exactement la même structure** (mêmes clés, mêmes tableaux de même longueur et dans le même ordre) ; seul le texte à l'intérieur change. Next-intl (et l'éditeur de contenu) suppose cette symétrie — un fichier désynchronisé peut faire planter la page dans une langue seulement.

## Pages du site

| Page | Route | Fichier(s) de contenu | Description |
|---|---|---|---|
| Accueil | `/` | `home.json`, `offerings.json`, `site.json` | Vitrine du club : vidéo d'introduction, mission, ce que le club offre, aperçu des activités, bandeau des partenaires, appel à l'action final. |
| Présentation | `/about` | `about.json` | Historique du club et avantages à devenir membre. |
| Kit média | `/media-kit` | `mediaKit.json` | Logos officiels, couleurs de marque et typographie, téléchargeables par les partenaires et la presse. |
| Événements | `/events` | `events.json` | Gala annuel et autres événements (passés ou à venir), avec photos. |
| Compétitions | `/games` | `games.json` | Ubisoft Gamelab (jeux créés, classés par année) et game jams. |
| Partenaires | `/sponsors` | `sponsors.json` | Commanditaires, regroupés par palier (or, argent, bronze). |
| Contact | `/contact` | `contact.json`, `site.json` | Courriel, adresse du local, réseaux sociaux, carte. |

Le texte partagé entre plusieurs pages (nom du club, réseaux sociaux, adresse, menu de navigation, libellés de boutons communs comme « En savoir plus ») vit dans `site.json`, `navbar.json` et `common.json` plutôt que d'être dupliqué à chaque endroit.

## Contenu dynamique — le modifier sans toucher au code

Les commanditaires, événements, compétitions et éléments du kit média peuvent être ajoutés, modifiés ou supprimés de deux façons :

1. **Via l'interface web** *(recommandé pour la majorité des cas)* — `npm run edit`. Voir le guide complet : [`tools/content-editor/MANUEL.md`](tools/content-editor/MANUEL.md). Elle propose aussi, quand c'est possible, de supprimer les images devenues inutilisées en même temps que l'élément qui les référençait.
2. **À la main**, en éditant directement les fichiers JSON — utile pour un tout petit changement, ou si l'éditeur n'est pas disponible.

### Éditer un fichier JSON à la main

Chaque type de contenu dynamique est soutenu par **deux fichiers**, un par langue, qui doivent garder la même structure :

- `src/messages/fr/sponsors.json` et `src/messages/en/sponsors.json`
- `src/messages/fr/events.json` et `src/messages/en/events.json`
- `src/messages/fr/games.json` et `src/messages/en/games.json`
- `src/messages/fr/mediaKit.json` et `src/messages/en/mediaKit.json`

Exemple — ajouter un commanditaire dans `sponsors.json` (à répéter dans **fr et en**, dans le tableau `sponsors` du palier voulu) :

```json
{
  "name": "Nom du commanditaire",
  "logo": "/sponsors/mon-logo.png",
  "url": "https://exemple.com",
  "description": "Texte optionnel — peut être omis complètement"
}
```

Quelques précisions utiles :

- Les champs comme `logo`, `url`, `images` ou `darkBg` sont **identiques dans les deux langues** (ce sont des chemins de fichiers, des liens ou des cases à cocher, pas du texte à traduire) ; `name`, `description`, `date` et `location`, eux, se traduisent et peuvent différer d'une langue à l'autre.
- Les images vont dans le sous-dossier `public/` correspondant (`public/sponsors`, `public/events`, `public/games`, `public/conjure` pour le kit média) et sont référencées par un chemin absolu commençant par `/` — par exemple `/sponsors/mon-logo.png`. Le mot `public` n'apparaît jamais dans le chemin.
- Un JSON invalide (virgule oubliée, guillemet manquant) fait planter **toutes** les pages qui lisent ce fichier. Avant de sauvegarder, valider avec un outil comme [jsonlint.com](https://jsonlint.com/), ou simplement lancer `npm run dev` : l'erreur apparaît clairement dans la console si un fichier est cassé.
- `npm run edit` fait exactement ces vérifications à votre place (et gère les images automatiquement) — c'est la méthode recommandée pour qui n'est pas à l'aise avec le format JSON.

## Palette et polices

Toutes les couleurs et polices du site sont définies **une seule fois**, dans `src/app/globals.css` (bloc `@theme`). Tailwind v4 génère directement les classes utilitaires (`bg-primary`, `text-tier-gold`, etc.) à partir de ces variables — changer une couleur pour tout le site se fait donc à un seul endroit, sans fichier de configuration séparé.

## Déploiement

Ce projet se déploie comme n'importe quelle application Next.js — par exemple sur [Vercel](https://vercel.com/), en connectant simplement le dépôt Git. La commande de build est `npm run build`, celle de démarrage `npm run start`. Voir la [documentation de déploiement de Next.js](https://nextjs.org/docs/app/building-your-application/deploying) pour les détails.
