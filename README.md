# Club Conjure - Site Web Officiel

Site web officiel du club Conjure de l'École de Technologie Supérieure (ÉTS).

## À propos

Laboratoire de médias interactifs - depuis 2009. Le Club Conjure offre formation, équipement et des opportunités de compétition aux développeurs de jeux vidéo et médias interactifs.

## Technologies

- **Framework**: [Astro](https://astro.build) - Framework web statique ultra-rapide
- **Styling**: [SCSS](https://sass-lang.com) + [Bulma](https://bulma.io) - CSS framework moderne
- **Carousel**: [Bulma Carousel](https://github.com/creativebulma/bulma-carousel) - Carousel responsive
- **JavaScript**: Vanilla JS pour les interactions

## Installation & Setup

### Prérequis

- Node.js 16.12+ et npm

### Installation

```bash
npm install
```

### Développement

Démarrer le serveur de développement :

```bash
npm run dev
```

Le site sera disponible à `http://localhost:3000`

### Build

Créer une version optimisée pour la production :

```bash
npm run build
```

Les fichiers générés seront dans le répertoire `dist/`

### Aperçu du Build

Prévisualiser le build localement :

```bash
npm run preview
```

## Structure du Projet

```
src/
├── pages/              # Routes statiques
│   ├── index.astro    # Page d'accueil (principal)
│   ├── 404.astro      # Page d'erreur 404
│   ├── 500.astro      # Page d'erreur 500
│   └── fr/            # Routes françaises
│       ├── index.astro
│       └── 404.astro
├── layouts/           # Layouts réutilisables
│   └── MainLayout.astro
├── components/        # Composants réutilisables
│   ├── Navigation.astro
│   └── Footer.astro
├── styles/           # Feuilles de style SCSS
│   ├── main.scss
│   └── _partials/
│       ├── _general.scss
│       ├── _navigation.scss
│       └── _media.scss
├── scripts/          # Scripts JavaScript/TypeScript
│   └── app.ts        # Logique d'application principale
└── env.d.ts          # Déclarations TypeScript Astro
public/               # Fichiers statiques
├── img/             # Images
│   ├── icons/
│   ├── competitions/
│   └── sponsors/
├── js/              # Scripts JS compilés
└── css/             # CSS minifiés
```

## Pages

- **`/`** - Page d'accueil principale (français)
- **`/fr/`** - Page d'accueil francaise (alias)
- **`/404`** - Page d'erreur 404
- **`/fr/404`** - Page d'erreur 404 (français)
- **`/500`** - Page d'erreur 500

## Fonctionnalités

- ✨ Navigation responsive avec menu hamburger
- 📱 Design mobile-first avec Bulma
- 🎠 Carousel de compétitions
- ✏️ Animation de chiffres (année)
- 🎬 Sections d'activités interactives
- 🗺️ Carte intégrée Google Maps
- 📱 Routes bilingues (Français disponible)

## Scripts

| Commande | Description |
|----------|-------------|
| `npm run dev` | Démarre le serveur de développement |
| `npm run build` | Crée une version optimisée pour la production |
| `npm run preview` | Prévisualise le build en local |

## Déploiement

Le site Astro génère des fichiers HTML/CSS/JS statiques optimisés. Ces fichiers peuvent être déployés sur n'importe quel serveur web statique :

- Netlify
- Vercel
- GitHub Pages
- AWS S3
- Hébergement traditionnel

Déployez simplement le contenu du répertoire `dist/`

## Scripts Personnalisés

### Carousel (`src/scripts/app.ts`)

Initialise Bulma Carousel pour le slider de compétitions.

### Animation de Chiffres

Anime les années dans la section splash screen (2009 - année courante).

### Activités Interactives

Gère les clics sur les boutons d'activités pour afficher/masquer le contenu détaillé.

## Ressources

- [Documentation Astro](https://docs.astro.build)
- [Documentation Bulma](https://bulma.io/documentation/)
- [Bulma Carousel](https://creativebulma.net/docs/bulma-carousel/)

## Auteurs

Club Conjure - ÉTS

## Licence

ISC

## Contactez-nous

- 📧 Email: conjure@ens.etsmtl.ca
- 📍 Adresse: 1219 William, Montréal, Local D-2020
- 📞 Téléphone: (514) 396-8800 poste #7713
- 📱 Instagram: [@conjure_ets](https://instagram.com/conjure_ets)
- 💼 LinkedIn: [Conjure-ets](https://linkedin.com/company/conjure-ets)
- 🎮 Itch.io: [conjure.itch.io](https://conjure.itch.io)
