# Éditeur de contenu

Une petite interface d'administration, locale et sans base de données, pour
modifier le contenu dynamique qui vit dans `src/messages/{fr,en}/*.json` —
commanditaires, événements, entrées du Gamelab, game jams et kit média —
sans avoir à éditer du JSON à la main.

Ce fichier documente **comment l'outil est construit** (pour qui code dessus).
Pour un guide d'utilisation pas à pas de l'interface, voir
[`MANUEL.md`](MANUEL.md).

## Lancer l'outil

```
npm run edit
```

Ceci démarre un serveur Node sur `http://127.0.0.1:4747` (branché uniquement
sur `localhost`, jamais accessible depuis le réseau) et l'ouvre dans le
navigateur par défaut. `Ctrl+C` pour arrêter.

## Fonctionnement

- **Aucune nouvelle dépendance.** Le serveur (`server.js`) n'utilise que les
  modules natifs `http`/`fs` de Node, et le frontend (`public/`) est du
  HTML/CSS/JS pur, sans framework. C'est un outil de développement, pas une
  page du site publié — elle n'est jamais importée par l'app Next.js et n'a
  aucune authentification, donc elle doit impérativement rester hors de
  portée de tout réseau autre que l'ordinateur qui l'exécute.
- **Les modifications s'écrivent directement sur disque.** Le bouton
  « Enregistrer » envoie (`PUT`) le JSON français **et** anglais de l'onglet
  actif vers `src/messages/fr/<fichier>.json` et
  `src/messages/en/<fichier>.json`. Il n'y a pas de base de données : les
  fichiers JSON *sont* la base de données, exactement comme avant que cet
  outil existe.
- **Les images sont téléversées dans `public/`.** Choisir un fichier pour un
  champ logo/photo envoie les octets bruts au serveur, qui les écrit dans le
  sous-dossier `public/<sponsors|events|games>/` correspondant et remplit le
  champ avec le chemin résultant (ex. `/sponsors/logo.png`) — le même format
  de chemin que `next/image` attend partout ailleurs dans l'app.
- **Champs partagés vs. champs par langue.** La plupart du contenu a un
  fichier JSON français et un fichier anglais de forme identique. Les champs
  qu'une personne visitant le site va lire (noms, descriptions, dates,
  titres, ...) s'éditent comme deux boîtes FR/EN séparées, côte à côte. Les
  champs qui ne sont pas linguistiques (chemins d'image, liens URL, la case
  « fond foncé ») s'éditent une seule fois et s'écrivent dans les deux
  fichiers — ainsi, ajouter/supprimer/réordonner une entrée garde toujours
  les deux fichiers de langue synchronisés : les tableaux FR et EN ne
  divergent jamais en longueur ni en ordre.
- **L'état ouvert/fermé des cartes est mémorisé, pas recalculé.** Comme
  chaque modification redessine tout l'onglet (`innerHTML` complet), l'outil
  garde une petite mémoire (`openState` dans `app.js`) de ce que
  l'utilisateur·rice a manuellement déplié ou replié, plutôt que de
  redéterminer l'état à chaque fois selon la position dans la liste — sinon,
  ajouter un élément ailleurs sur la page rouvrirait des sections que
  quelqu'un venait de refermer.
- **Supprimer un élément propose de nettoyer les fichiers devenus
  inutiles.** Quand un commanditaire, un événement, un jeu ou une game jam
  est supprimé, `cleanupOrphanedImages()` (`app.js`) parcourt tout le
  contenu restant de l'onglet ; si une image qu'il référençait n'apparaît
  plus nulle part ailleurs, une confirmation séparée propose de supprimer
  aussi le fichier physique via `DELETE /api/asset`. Deux garde-fous
  distincts protègent contre une suppression involontaire d'un fichier
  encore utile :
  1. Le calcul « encore référencé ? » se fait sur le contenu **après** la
     suppression, donc un fichier réutilisé par un autre élément n'est
     jamais proposé.
  2. **Le Kit média est volontairement exclu** (`CLEANUP_ENABLED_COLLECTIONS`
     côté client, `DELETE_ALLOWED_DIRS` côté serveur — les deux doivent être
     d'accord). Les fichiers sous `public/conjure/` sont aussi codés en dur
     dans des composants React (le logo de la barre de navigation, du pied
     de page, ...) que cet outil ne peut pas voir ; « absent du JSON »
     n'y garantit donc pas « inutilisé ». Le serveur applique cette
     restriction indépendamment du client, au cas où.

## Ajouter un nouveau type de contenu

Ajouter une entrée à `COLLECTIONS` dans `server.js` (quel fichier
`src/messages/*.json` correspond à ce type, et dans quel sous-dossier de
`public/` vont ses images), puis ajouter un onglet et une fonction de rendu
dans `public/app.js`, en suivant le modèle de `renderSponsors` /
`renderEvents` / `renderGames` / `renderMediaKit`. Les fonctions génériques
déjà en place (`localePairField`, `fieldImage`, `fieldSelect`, `fieldColor`,
`cardShell`, `addListItem` / `removeListItem` / `moveListItem`, ...) sont
faites pour être réutilisées plutôt que réimplémentées.

Si les images du nouveau type ne sont référencées **que** depuis son propre
fichier JSON (comme sponsors/events/games), ajouter aussi son `uploadDir` à
`DELETE_ALLOWED_DIRS` dans `server.js` pour profiter du nettoyage automatique
des fichiers orphelins. Si ses fichiers peuvent aussi être référencés
ailleurs dans le code (comme `conjure/` pour le kit média), **ne pas**
l'ajouter — voir l'avertissement ci-dessus.
