# Manuel d'utilisation — Éditeur de contenu Conjure

Ce guide explique comment utiliser l'**éditeur de contenu**, l'interface web
qui permet d'ajouter, modifier ou supprimer les commanditaires, les
événements, les compétitions et le kit média du site Conjure **sans avoir
besoin de savoir coder**. Il ne suppose aucune connaissance technique —
seulement de savoir ouvrir un terminal et copier-coller une commande.

Pour la documentation technique de l'outil (comment il est construit), voir
[`README.md`](README.md) dans ce même dossier.

## Table des matières

1. [Démarrer l'outil](#1--démarrer-loutil)
2. [Vue d'ensemble de l'interface](#2--vue-densemble-de-linterface)
3. [Notions communes à tous les onglets](#3--notions-communes-à-tous-les-onglets)
4. [Onglet Commanditaires](#4--onglet-commanditaires)
5. [Onglet Événements](#5--onglet-événements)
6. [Onglet Compétitions / jeux](#6--onglet-compétitions--jeux)
7. [Onglet Kit média](#7--onglet-kit-média)
8. [Enregistrer, recharger, et publier sur le vrai site](#8--enregistrer-recharger-et-publier-sur-le-vrai-site)
9. [Précautions et limites](#9--précautions-et-limites)
10. [Dépannage](#10--dépannage)

---

## 1 · Démarrer l'outil

Depuis un terminal, à la racine du projet :

```bash
npm run edit
```

Un navigateur s'ouvre automatiquement sur `http://127.0.0.1:4747`. Si ce
n'est pas le cas, ouvrez cette adresse vous-même dans votre navigateur.

Pour arrêter l'outil, retournez dans le terminal et appuyez sur `Ctrl+C`.

> **Important** : cet outil ne fonctionne que sur votre propre ordinateur
> (« local »). Il ne modifie rien sur le site en ligne tant que les
> changements n'ont pas été renvoyés sur le dépôt Git du projet — voir la
> [section 8](#8--enregistrer-recharger-et-publier-sur-le-vrai-site).

## 2 · Vue d'ensemble de l'interface

En haut de la page se trouve un bandeau toujours visible :

- **Quatre onglets** : *Commanditaires*, *Événements*, *Compétitions / jeux*,
  *Kit média* — chacun correspond à une section du site.
- **Un indicateur d'état**, à droite : « Tout est enregistré » ou
  « Modifications non enregistrées ».
- **Recharger** : abandonne les changements non enregistrés et recharge le
  contenu tel qu'il est actuellement sur le disque.
- **Enregistrer** : écrit les changements de l'onglet actif sur le disque
  (voir [section 8](#8--enregistrer-recharger-et-publier-sur-le-vrai-site)).

En changeant d'onglet ou en fermant la page alors qu'il y a des changements
non enregistrés, l'outil demande confirmation pour éviter de perdre du
travail par erreur.

## 3 · Notions communes à tous les onglets

Ces principes reviennent partout dans l'outil :

### Cartes repliables

Chaque commanditaire, événement, année ou game jam s'affiche comme une
**carte** dont seul l'en-tête (nom, et parfois une date) est visible au
départ. Cliquez n'importe où sur l'en-tête pour la déplier ou la replier —
la petite flèche (▸) à gauche du titre pivote pour indiquer l'état. Ceci
sert uniquement à faciliter la navigation quand la liste est longue ; ça ne
supprime ni ne modifie rien.

L'outil se souvient de ce que vous avez déplié ou replié : ajouter un
élément ailleurs sur la page ne referme pas ce que vous aviez ouvert, et ne
rouvre pas ce que vous aviez fermé.

### Réordonner et supprimer

Dans l'en-tête de chaque carte :

- **↑ / ↓** déplacent l'élément d'une position vers le haut ou le bas dans
  la liste (utile si l'ordre affiché sur le site n'est pas le bon).
- **Supprimer** retire l'élément définitivement de la liste (voir
  l'avertissement sur l'irréversibilité en [section 9](#9--précautions-et-limites)).

### Suppression d'un fichier devenu inutile

Dans les onglets **Commanditaires**, **Événements** et
**Compétitions / jeux**, supprimer un élément qui avait une image (un
commanditaire, un événement, un jeu, une game jam avec ses jeux) déclenche
une **seconde question**, séparée de la confirmation de suppression : si
l'image (ou les photos) qu'il utilisait ne semble(nt) plus utilisée(s) par
aucun autre élément de cet onglet, l'outil propose de supprimer aussi le ou
les fichiers correspondants sur le serveur, pas seulement la référence dans
le JSON. Répondre « Annuler » laisse les fichiers en place — ils
resteront simplement inutilisés dans le dossier `public/`, sans que rien ne
soit cassé.

> Cette proposition **n'apparaît jamais dans l'onglet Kit média** : les
> logos de ce dossier (`public/conjure/`) sont aussi utilisés directement
> ailleurs sur le site (par exemple le logo de la barre de navigation), pas
> seulement dans le kit média — l'outil ne peut donc pas garantir qu'un
> fichier « absent du kit média » est réellement inutilisé, et ne propose
> jamais de le supprimer automatiquement. Voir la [section 7](#7--onglet-kit-média).

### Champs français / anglais côte à côte

Le site est bilingue : la plupart des champs de texte (nom, description,
date, etc.) apparaissent **deux fois côte à côte**, une boîte étiquetée
`FR` et une boîte étiquetée `EN`. Il faut remplir les deux pour que le
contenu s'affiche correctement dans les deux langues du site.

Certains champs n'apparaissent qu'**une seule fois** (logo, lien web, case
« fond foncé », photos) : ce sont des informations qui ne se traduisent pas
— elles s'appliquent automatiquement aux deux langues.

### Ajouter une image

Les champs d'image (logo, photo) affichent une petite vignette d'aperçu à
gauche et, à droite, un champ de texte (le chemin de l'image) suivi d'un
bouton pour choisir un fichier sur votre ordinateur. Choisir un fichier
l'envoie automatiquement au bon endroit sur le serveur et remplit le champ
— il n'y a normalement pas besoin de taper un chemin à la main.

Formats acceptés : `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`, `.svg`.

### « Texte de la page »

En haut de chaque onglet se trouve une section repliable intitulée
**Texte de la page** : elle regroupe les titres et textes d'introduction de
la page (pas les commanditaires/événements eux-mêmes). C'est là qu'on
modifie, par exemple, le texte qui explique ce qu'est le Gamelab.

## 4 · Onglet Commanditaires

Les commanditaires sont regroupés en trois **paliers**, affichés dans cet
ordre : **Or**, **Argent**, **Bronze**. Le palier lui-même (son nom, sa
couleur) ne se crée pas ni ne se supprime depuis l'outil — seul le nom
affiché du palier (« Nom du palier ») est modifiable.

### Ajouter un commanditaire

1. Repérez le bon palier, puis cliquez sur **+ Ajouter un commanditaire**
   en haut de ce palier.
2. Une carte vide apparaît, dépliée, tout en haut du palier — remplissez :
   - **Nom** (FR/EN)
   - **Logo** — choisissez le fichier image
   - **Site web (URL)** — le lien vers le site du commanditaire
   - **Fond de tuile foncé** — à cocher seulement si le logo est clair ou
     transparent (il aurait l'air invisible sur un fond blanc)
   - **Description (optionnelle)** (FR/EN) — un paragraphe qui s'affiche
     sous le logo sur le site ; peut rester vide.

### Modifier ou supprimer un commanditaire

Dépliez sa carte pour modifier n'importe quel champ. Utilisez **Supprimer**
dans l'en-tête pour le retirer, ou **↑ / ↓** pour changer sa position dans
le palier.

## 5 · Onglet Événements

### Ajouter un événement

Cliquez sur **+ Ajouter un événement**, tout en haut de la liste. Le
nouvel événement apparaît en premier (donc tout en haut) et déplié —
inutile de le chercher plus bas dans une longue liste d'événements passés.
Remplissez :

- **Nom** (FR/EN)
- **Date** (FR/EN) — c'est un texte libre, pas une vraie date : par
  exemple « Dernier événement : 2025-10-16 ». Ceci permet d'écrire
  « Prochain événement : ... » pour un événement à venir, par exemple.
- **Lieu** (FR/EN)
- **Description** (FR/EN)
- **Photos** — une ou plusieurs images ; chaque photo ajoutée apparaît
  dans la liste avec un bouton `✕` pour la retirer individuellement.

### Modifier ou supprimer un événement

Dépliez sa carte pour tout modifier. **Supprimer** le retire de la liste ;
**↑ / ↓** ajuste sa position si l'ordre chronologique ne convient pas.

## 6 · Onglet Compétitions / jeux

Cet onglet a deux parties : le **Gamelab** (concours annuel d'Ubisoft,
organisé par année) et les **Game jams**.

### Gamelab — ajouter une année

Cliquez sur **+ Ajouter une année**, entrez l'année à 4 chiffres (ex.
`2026`) dans la fenêtre qui s'ouvre. La nouvelle année apparaît en premier
(les années sont toujours triées de la plus récente à la plus ancienne) et
dépliée.

### Gamelab — ajouter un jeu à une année

Dépliez l'année voulue, puis cliquez sur **+ Ajouter un jeu** en haut de
cette année. Remplissez :

- **Titre** (FR/EN)
- **Image** — une image du jeu
- **Lien (itch.io, etc.)** — vers la page du jeu
- **Description (prix, un par ligne)** (FR/EN) — les mentions/prix reçus,
  un par ligne (par exemple `Prix : Meilleur prototype`) ; peut rester
  vide si le jeu n'a rien gagné.

### Gamelab — supprimer une année ou un jeu

**Supprimer l'année** dans l'en-tête d'une année la retire, **avec tous les
jeux qu'elle contient** — une confirmation est demandée. Pour retirer un
seul jeu, dépliez son année et utilisez **Supprimer** sur la carte du jeu.

### Game jams

Fonctionne comme les événements : **+ Ajouter une game jam** ajoute une
nouvelle jam en haut de la liste, avec :

- **Nom de la jam** (FR/EN)
- **Date** (FR/EN, texte libre)
- **Lien (optionnel)**
- **Description** (FR/EN)
- Une sous-liste **Jeux créés pendant cette jam**, avec son propre
  **+ Ajouter un jeu** — mêmes champs que pour le Gamelab.

## 7 · Onglet Kit média

Cet onglet gère la page `/media-kit` (logos officiels, couleurs de marque
et typographie) destinée aux partenaires, aux membres et à la presse.

### Logos

**+ Ajouter un logo** ajoute une nouvelle carte, avec :

- **Nom du logo** (FR/EN) — ex. « Logo — usage sur fond clair »
- **Fichier PNG** et **Fichier SVG** — les deux formats offerts au
  téléchargement sur la page
- **Résolution affichée** — texte informatif (ex. « 666 × 100 »)
- **Fond affiché derrière le logo** — *Fond clair* ou *Fond sombre*, selon
  que le logo est plutôt sombre ou plutôt clair (pour qu'il reste visible
  dans l'aperçu du kit média)

> Contrairement aux autres onglets, supprimer un logo ici **ne propose
> jamais** de supprimer le fichier PNG/SVG associé — voir l'encadré de la
> [section 3](#3--notions-communes-à-tous-les-onglets).

### Couleurs

**+ Ajouter une couleur** ajoute une carte avec un **nom** (FR/EN), un code
**hexadécimal** (ex. `#2789CA`, avec un aperçu de la teinte) et une
**classe Tailwind**. Cette classe doit correspondre à un jeton de couleur
qui existe déjà dans `src/app/globals.css` — cet onglet sert à documenter
la palette du site pour le kit média, pas à créer de nouvelles couleurs
pour le reste du site.

### Typographie

Un seul bloc, sans liste : le **nom de la police** et les **consignes
d'utilisation** (FR/EN) affichées sur la page.

## 8 · Enregistrer, recharger, et publier sur le vrai site

- **Enregistrer** écrit immédiatement les changements de l'onglet actif
  dans les fichiers du projet (`src/messages/fr/...json` et
  `src/messages/en/...json`), et téléverse toute image ajoutée dans le
  dossier `public/` correspondant. Chaque onglet s'enregistre
  séparément — enregistrer l'onglet *Événements* n'enregistre pas des
  changements en attente dans l'onglet *Compétitions / jeux*.
- **Recharger** abandonne les changements non enregistrés de l'onglet
  actif et reprend le contenu tel qu'il est sur le disque.
- Cliquer sur **Enregistrer** modifie les fichiers **sur votre ordinateur
  seulement**. Pour que ces changements apparaissent sur le site en ligne,
  il faut ensuite les traiter comme n'importe quelle autre modification du
  projet : vérifier le résultat (`npm run dev`), puis faire un `commit` et
  un `push` Git sur le dépôt, selon le processus habituel de déploiement du
  site.

## 9 · Précautions et limites

- **Outil local, sans mot de passe.** L'éditeur n'a aucune authentification
  — il compte sur le fait de ne tourner que sur `127.0.0.1` (votre propre
  ordinateur). Ne jamais tenter de le rendre accessible depuis Internet.
- **« Supprimer » est immédiat et irréversible** une fois le bouton
  **Enregistrer** cliqué. Avant cela, un **Recharger** permet encore
  d'annuler une suppression faite par erreur (voir [section 8](#8--enregistrer-recharger-et-publier-sur-le-vrai-site)). Après un
  enregistrement, la seule façon de revenir en arrière est via l'historique
  Git du projet.
- **La suppression d'un fichier (voir [section 3](#3--notions-communes-à-tous-les-onglets)) est immédiate, elle,
  même sans « Enregistrer ».** Contrairement au reste du formulaire, un
  fichier supprimé du serveur est parti tout de suite — cliquer sur
  **Recharger** après coup ramène l'élément dans la liste, mais son image
  reste manquante (chemin brisé) puisque le fichier, lui, ne revient pas. En
  cas de doute sur une suppression, répondre « Annuler » à cette question
  précise plutôt que de compter sur **Recharger**.
- **Un JSON cassé peut casser une page du site.** L'outil valide toujours
  ce qu'il enregistre, donc ce risque n'existe pas en utilisant l'interface
  — il ne concerne que l'édition manuelle des fichiers JSON (voir le
  `README.md` à la racine du projet).
- **Formatage du fichier.** La première fois qu'un fichier est enregistré
  depuis l'outil, sa mise en forme (indentation) peut légèrement changer —
  c'est purement esthétique, le contenu reste identique.

## 10 · Dépannage

**Le navigateur ne s'ouvre pas tout seul.**
Ouvrez manuellement `http://127.0.0.1:4747`.

**Le port 4747 est déjà utilisé par autre chose.**
Relancez avec un autre port, par exemple :

```bash
PORT=4848 npm run edit
```

puis ouvrez `http://127.0.0.1:4848`.

**J'ai perdu des changements.**
Les changements ne sont écrits sur disque qu'au moment où **Enregistrer**
est cliqué. Fermer l'onglet du navigateur, changer d'onglet dans l'outil
sans enregistrer, ou arrêter le serveur (`Ctrl+C`) avant d'avoir cliqué
**Enregistrer** perd les changements en cours — l'outil affiche une
confirmation dans les deux premiers cas pour éviter que ça arrive par
erreur.

**Une image que je viens d'ajouter n'apparaît pas.**
Vérifiez que le format du fichier est bien accepté (`.png`, `.jpg`,
`.jpeg`, `.gif`, `.webp`, `.svg`) et que le message « Image téléversée. »
est bien apparu en bas de l'écran après le choix du fichier.

**On ne me propose jamais de supprimer le fichier en même temps que
l'élément.**
C'est normal dans deux cas : dans l'onglet **Kit média** (voir
[section 7](#7--onglet-kit-média)), ou si l'image supprimée est encore
utilisée par un autre élément de l'onglet — l'outil ne propose la
suppression du fichier que lorsqu'il est certain que plus rien n'y fait
référence.
