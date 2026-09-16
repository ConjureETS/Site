"use strict";

// Vanilla-JS admin UI. No build step, no framework: every tab is just a
// function that returns an HTML string rendered into #app, plus a
// handful of delegated event listeners on #app that read data-* attributes
// to know what changed. See tools/content-editor/README.md for the model.

const LOCALES = ["fr", "en"];

// store[collection] = { fr: {...parsed json}, en: {...parsed json} }
const store = {};
let current = null;
let dirty = false;

// Every re-render rebuilds #app from scratch (innerHTML = ...), so a
// card's open/closed state can't just live in the DOM — it has to be
// tracked here and re-applied, otherwise any unrelated edit (e.g. adding
// a game jam) would reset every card back to its positional default and
// silently re-expand something the user had deliberately collapsed.
const openState = {}; // key -> boolean, populated lazily with each card's default on first render

// Stable per-item identity for cards whose list can be reordered/prepended
// (events, sponsors, game entries, game jams): keyed by object reference,
// so an item keeps its own open state even as its array index shifts.
let idCounter = 0;
const idMap = new WeakMap();
function idFor(obj) {
  if (!idMap.has(obj)) idMap.set(obj, `id${idCounter++}`);
  return idMap.get(obj);
}

// Reads the *current* DOM's open/closed state for every card before it's
// discarded by the next render, so that state survives the rebuild.
function captureOpenState() {
  document.querySelectorAll("#app details.card[data-key]").forEach((el) => {
    openState[el.dataset.key] = el.open;
  });
}

// ---------------------------------------------------------------------
// path helpers — "tiers.0.sponsors.2.name" style dotted paths that work
// on both plain objects and arrays (numeric segments index into arrays).
// ---------------------------------------------------------------------
function getPath(obj, pathStr) {
  return pathStr.split(".").reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

function setPath(obj, pathStr, value) {
  const keys = pathStr.split(".");
  let o = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    if (o[k] == null || typeof o[k] !== "object") {
      o[k] = /^\d+$/.test(keys[i + 1]) ? [] : {};
    }
    o = o[k];
  }
  o[keys[keys.length - 1]] = value;
}

function val(locale, path) {
  return getPath(store[current][locale], path);
}
function sval(path) {
  return val("fr", path); // shared fields: fr copy is the display source of truth
}

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

// ---------------------------------------------------------------------
// field builders — every one returns an HTML string carrying data-path
// (+ data-locale or data-shared) so the delegated listeners below know
// where to write the edited value back into `store`.
// ---------------------------------------------------------------------
function localePairField(label, path, opts = {}) {
  const cols = LOCALES.map((locale) => {
    const v = val(locale, path) ?? "";
    const input = opts.textarea
      ? `<textarea data-path="${esc(path)}" data-locale="${locale}">${esc(v)}</textarea>`
      : `<input type="text" data-path="${esc(path)}" data-locale="${locale}" value="${esc(v)}">`;
    return `<div class="field"><label data-locale="${locale}">${esc(label)}</label>${input}</div>`;
  }).join("");
  return `<div class="locale-pair">${cols}</div>`;
}

function fieldShared(label, path, opts = {}) {
  const v = sval(path) ?? "";
  return `<div class="field"><label>${esc(label)}</label>
    <input type="text" data-path="${esc(path)}" data-shared="1" value="${esc(v)}" placeholder="${esc(opts.placeholder || "")}"></div>`;
}

function fieldImage(label, path, dir) {
  const v = sval(path) ?? "";
  const src = v ? `/site${v}` : "";
  return `<div class="field"><label>${esc(label)}</label>
    <div class="image-field">
      <div class="thumb" style="background-image:url('${esc(src)}')"></div>
      <div class="image-controls">
        <input type="text" data-path="${esc(path)}" data-shared="1" value="${esc(v)}" placeholder="/${dir}/example.png">
        <input type="file" accept="image/*" data-upload-path="${esc(path)}" data-upload-dir="${dir}">
      </div>
    </div>
  </div>`;
}

function fieldSelect(label, path, options) {
  const v = sval(path) ?? options[0].value;
  const opts = options
    .map((o) => `<option value="${esc(o.value)}" ${o.value === v ? "selected" : ""}>${esc(o.label)}</option>`)
    .join("");
  return `<div class="field"><label>${esc(label)}</label>
    <select data-path="${esc(path)}" data-shared="1">${opts}</select></div>`;
}

// A hex-color field with a solid-color swatch preview, reusing the same
// layout as fieldImage (thumb + text input) since it's the same shape of
// "small preview next to an editable value".
function fieldColor(label, path) {
  const v = sval(path) || "#000000";
  return `<div class="field"><label>${esc(label)}</label>
    <div class="image-field">
      <div class="thumb" style="background:${esc(v)}"></div>
      <div class="image-controls">
        <input type="text" data-path="${esc(path)}" data-shared="1" value="${esc(v)}" placeholder="#RRGGBB">
      </div>
    </div>
  </div>`;
}

function fieldCheckbox(label, path) {
  const checked = !!sval(path);
  const id = "cb-" + path.replace(/[^a-z0-9]/gi, "-");
  return `<div class="field checkbox">
    <input type="checkbox" id="${id}" data-path="${esc(path)}" data-shared="1" ${checked ? "checked" : ""}>
    <label for="${id}">${esc(label)}</label>
  </div>`;
}

function imagesListField(path, dir) {
  const arr = sval(path) || [];
  const rows = arr
    .map(
      (src, i) => `
    <div class="image-field" style="margin-bottom:8px">
      <div class="thumb" style="background-image:url('${esc(src ? "/site" + src : "")}')"></div>
      <div class="image-controls">
        <input type="text" data-path="${esc(path)}.${i}" data-shared="1" value="${esc(src)}">
      </div>
      <button class="btn btn-sm" data-action="moveListItem" data-listpath="${esc(path)}" data-index="${i}" data-dir="-1" ${i === 0 ? "disabled" : ""}>↑</button>
      <button class="btn btn-sm" data-action="moveListItem" data-listpath="${esc(path)}" data-index="${i}" data-dir="1" ${i === arr.length - 1 ? "disabled" : ""}>↓</button>
      <button class="btn btn-sm btn-danger" data-action="removeListItem" data-listpath="${esc(path)}" data-index="${i}">✕</button>
    </div>`
    )
    .join("");
  return `<div class="field"><label>Photos</label>${rows}
    <input type="file" accept="image/*" multiple data-upload-path="${esc(path)}" data-upload-dir="${dir}" data-upload-append="1">
  </div>`;
}

function stringListEditor(locale, path, label) {
  const arr = val(locale, path) || [];
  const rows = arr
    .map(
      (v, i) => `
    <div class="stringlist-item">
      <textarea data-path="${esc(path)}.${i}" data-locale="${locale}">${esc(v)}</textarea>
      <button class="btn btn-sm btn-danger" data-action="removeStringListItem" data-locale="${locale}" data-path="${esc(path)}" data-index="${i}">✕</button>
    </div>`
    )
    .join("");
  return `<div class="field"><label data-locale="${locale}">${esc(label)}</label>${rows}
    <button class="btn btn-sm add-row" data-action="addStringListItem" data-locale="${locale}" data-path="${esc(path)}">+ Ajouter une ligne</button>
  </div>`;
}

function pageCopySection(fields) {
  const body = fields.map((f) => localePairField(f.label, f.path, { textarea: !!f.textarea })).join("");
  return `<details class="pagecopy"><summary>Texte de la page</summary><div class="pagecopy-body">${body}</div></details>`;
}

function stringListPairSection(label, path) {
  const cols = LOCALES.map((locale) => stringListEditor(locale, path, label)).join("");
  return `<details class="pagecopy"><summary>${esc(label)}</summary><div class="pagecopy-body"><div class="locale-pair">${cols}</div></div></details>`;
}

// A collapsible card: the header (title + up/down/remove buttons) is
// always visible and clickable to expand/collapse, so long lists can be
// scanned without paging through every field of every entry. Buttons in
// the header still work normally — the click handler below calls
// preventDefault() on data-action clicks so they don't also toggle the
// <details> open state.
function cardShell({ key, titleHtml, actionsHtml = "", bodyHtml, defaultOpen = false }) {
  if (!(key in openState)) openState[key] = defaultOpen; // first time we see this card: lock in its default
  const open = openState[key];
  return `<details class="card" data-key="${esc(key)}" ${open ? "open" : ""}>
    <summary class="card-head">
      <div class="card-head-title"><span class="chevron">▸</span>${titleHtml}</div>
      <div class="card-actions">${actionsHtml}</div>
    </summary>
    <div class="card-body">${bodyHtml}</div>
  </details>`;
}

// ---------------------------------------------------------------------
// shared-list mutations — items whose *shape* (add/remove/reorder) must
// stay identical across fr/en, even though fields inside each item can
// hold different per-locale text.
// ---------------------------------------------------------------------
const BLANK_FACTORIES = {
  sponsor: () => ({ name: "", logo: "", url: "", description: "" }),
  event: () => ({ name: "", date: "", location: "", description: "", images: [] }),
  game: () => ({ title: "", image: "", description: "", url: "" }),
  jam: () => ({ name: "", url: "", date: "", description: "", games: [] }),
  logo: () => ({ label: "", png: "", svg: "", resolution: "", surface: "light" }),
  color: () => ({ name: "", hex: "#2789ca", className: "" }),
};

// ---------------------------------------------------------------------
// Orphaned-file cleanup — when an item that referenced an image is
// deleted, offer to also delete the file(s) from public/ if nothing else
// in this collection's content still points at them.
//
// Deliberately excludes mediaKit: its files under public/conjure/ are
// *also* hardcoded straight into React components (the navbar and footer
// logos), which this tool can't see — "unreferenced in the JSON" would
// not mean "safe to delete" there. See server.js's DELETE_ALLOWED_DIRS,
// which independently enforces the same restriction.
// ---------------------------------------------------------------------
const CLEANUP_ENABLED_COLLECTIONS = new Set(["sponsors", "events", "games"]);

function isImagePath(v) {
  return typeof v === "string" && /^\/[^\s"]+\.(png|jpe?g|gif|webp|svg)$/i.test(v);
}

function collectImagePaths(node, acc = []) {
  if (Array.isArray(node)) node.forEach((v) => collectImagePaths(v, acc));
  else if (node && typeof node === "object") Object.values(node).forEach((v) => collectImagePaths(v, acc));
  else if (isImagePath(node)) acc.push(node);
  return acc;
}

function countPathOccurrences(root, targetPath) {
  let count = 0;
  (function walk(node) {
    if (Array.isArray(node)) node.forEach(walk);
    else if (node && typeof node === "object") Object.values(node).forEach(walk);
    else if (node === targetPath) count++;
  })(root);
  return count;
}

// `removedSubtree` is whatever object/array/string was just spliced out
// (a sponsor, an event, a jam and its nested games, a single photo
// path, ...) — collected generically rather than per content type, so
// this works the same for every kind of item without special-casing.
async function cleanupOrphanedImages(removedSubtree) {
  if (!CLEANUP_ENABLED_COLLECTIONS.has(current)) return;
  const candidates = [...new Set(collectImagePaths(removedSubtree))];
  if (!candidates.length) return;
  // store[current].fr already reflects the post-removal state (this runs
  // after the splice + re-render), so a count of 0 means genuinely unused.
  const orphaned = candidates.filter((p) => countPathOccurrences(store[current].fr, p) === 0);
  if (!orphaned.length) return;

  const list = orphaned.map((p) => `  ${p}`).join("\n");
  const ok = confirm(
    `Ce(s) fichier(s) ne semble(nt) plus utilisé(s) ailleurs dans cet onglet :\n\n${list}\n\nLes supprimer aussi du serveur ? Cette action est irréversible.`
  );
  if (!ok) return;

  let deleted = 0;
  for (const p of orphaned) {
    try {
      const res = await fetch(`/api/asset?path=${encodeURIComponent(p)}`, { method: "DELETE" });
      if (res.ok) deleted++;
    } catch {
      /* best effort — a failed cleanup delete isn't worth blocking on */
    }
  }
  toast(deleted ? `${deleted} fichier(s) supprimé(s) du serveur.` : "Échec de la suppression des fichiers.", !deleted);
}

function mutateSharedList(listPath, fn) {
  for (const locale of LOCALES) {
    let arr = getPath(store[current][locale], listPath);
    if (!Array.isArray(arr)) {
      arr = [];
      setPath(store[current][locale], listPath, arr);
    }
    fn(arr);
  }
}

function addListItem(listPath, kind, prepend) {
  const factory = BLANK_FACTORIES[kind] || (() => ({}));
  // Chronological lists (events, game jams) grow new-first: adding at the
  // top means past entries never need to be manually walked back down.
  mutateSharedList(listPath, (arr) => (prepend ? arr.unshift(factory()) : arr.push(factory())));
  markDirty();
  renderTab(current);
}

function removeListItem(listPath, index) {
  if (!confirm("Supprimer cet élément ? Cette action est irréversible tant que vous ne rechargez pas.")) return;
  const listBefore = getPath(store[current].fr, listPath);
  const removed = Array.isArray(listBefore) ? listBefore[index] : undefined;
  mutateSharedList(listPath, (arr) => arr.splice(index, 1));
  markDirty();
  renderTab(current);
  if (removed !== undefined) cleanupOrphanedImages(removed);
}

function moveListItem(listPath, index, dir) {
  mutateSharedList(listPath, (arr) => {
    const j = index + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[index], arr[j]] = [arr[j], arr[index]];
  });
  markDirty();
  renderTab(current);
}

function addStringListItem(locale, path) {
  const arr = val(locale, path) || [];
  arr.push("");
  setPath(store[current][locale], path, arr);
  markDirty();
  renderTab(current);
}

function removeStringListItem(locale, path, index) {
  const arr = val(locale, path) || [];
  arr.splice(index, 1);
  markDirty();
  renderTab(current);
}

// ---------------------------------------------------------------------
// Sponsors tab
// ---------------------------------------------------------------------
const SPONSORS_FIELDS = [
  { label: "Amorce (eyebrow)", path: "eyebrow" },
  { label: "Titre", path: "title" },
  { label: "Description", path: "description", textarea: true },
  { label: 'Message si aucun commanditaire ("{tier}" est remplacé par le nom du palier)', path: "emptyTemplate" },
];

function sponsorCard(tierIndex, index) {
  const listPath = `tiers.${tierIndex}.sponsors`;
  const base = `${listPath}.${index}`;
  const title = val("fr", `${base}.name`) || "(sans nom)";
  return cardShell({
    key: `sponsors:${idFor(getPath(store.sponsors.fr, base))}`,
    titleHtml: esc(title),
    actionsHtml: `
        <button class="btn btn-sm" data-action="moveListItem" data-listpath="${listPath}" data-index="${index}" data-dir="-1">↑</button>
        <button class="btn btn-sm" data-action="moveListItem" data-listpath="${listPath}" data-index="${index}" data-dir="1">↓</button>
        <button class="btn btn-sm btn-danger" data-action="removeListItem" data-listpath="${listPath}" data-index="${index}">Supprimer</button>`,
    bodyHtml: `
    ${localePairField("Nom", `${base}.name`)}
    ${fieldImage("Logo", `${base}.logo`, "sponsors")}
    ${fieldShared("Site web (URL)", `${base}.url`, { placeholder: "https://…" })}
    ${fieldCheckbox("Fond de tuile foncé (pour un logo clair ou transparent)", `${base}.darkBg`)}
    ${localePairField("Description (optionnelle)", `${base}.description`, { textarea: true })}`,
  });
}

function renderSponsors() {
  let html = pageCopySection(SPONSORS_FIELDS);
  store.sponsors.fr.tiers.forEach((tier, ti) => {
    const sponsors = tier.sponsors || [];
    html += `<section class="block">
      <h2 class="block-title">${esc(tier.label)} <span style="color:var(--text-faint);font-weight:400">(${esc(tier.key)})</span></h2>
      ${localePairField("Nom du palier", `tiers.${ti}.label`)}
      <button class="btn add-row" data-action="addListItem" data-listpath="tiers.${ti}.sponsors" data-kind="sponsor" data-prepend="1">+ Ajouter un commanditaire</button>
      ${sponsors.length ? sponsors.map((_, si) => sponsorCard(ti, si)).join("") : '<div class="empty-hint">Aucun commanditaire dans ce palier pour le moment.</div>'}
    </section>`;
  });
  document.getElementById("app").innerHTML = html;
}

function normalizeSponsors() {
  for (const locale of LOCALES) {
    for (const tier of store.sponsors[locale].tiers) {
      for (const sponsor of tier.sponsors) {
        if (!sponsor.description) delete sponsor.description;
        if (!sponsor.darkBg) delete sponsor.darkBg;
      }
    }
  }
}

// ---------------------------------------------------------------------
// Events tab
// ---------------------------------------------------------------------
const EVENTS_FIELDS = [
  { label: "Amorce (eyebrow)", path: "eyebrow" },
  { label: "Titre", path: "title" },
  { label: "Description", path: "description", textarea: true },
  { label: "Texte si aucun événement", path: "emptyText" },
];

function eventCard(index, defaultOpen) {
  const base = `items.${index}`;
  const title = val("fr", `${base}.name`) || "(sans nom)";
  const date = val("fr", `${base}.date`);
  return cardShell({
    key: `events:${idFor(getPath(store.events.fr, base))}`,
    titleHtml: `${esc(title)}${date ? ` <span class="card-head-sub">— ${esc(date)}</span>` : ""}`,
    actionsHtml: `
        <button class="btn btn-sm" data-action="moveListItem" data-listpath="items" data-index="${index}" data-dir="-1">↑</button>
        <button class="btn btn-sm" data-action="moveListItem" data-listpath="items" data-index="${index}" data-dir="1">↓</button>
        <button class="btn btn-sm btn-danger" data-action="removeListItem" data-listpath="items" data-index="${index}">Supprimer</button>`,
    bodyHtml: `
    ${localePairField("Nom", `${base}.name`)}
    ${localePairField('Date (texte libre, ex. « Dernier événement : 2025-10-16 »)', `${base}.date`)}
    ${localePairField("Lieu", `${base}.location`)}
    ${localePairField("Description", `${base}.description`, { textarea: true })}
    ${imagesListField(`${base}.images`, "events")}`,
    defaultOpen,
  });
}

function renderEvents() {
  let html = pageCopySection(EVENTS_FIELDS);
  const items = store.events.fr.items || [];
  html += `<section class="block">
    <button class="btn add-row" data-action="addListItem" data-listpath="items" data-kind="event" data-prepend="1">+ Ajouter un événement</button>
    ${items.length ? items.map((_, i) => eventCard(i, i === 0)).join("") : '<div class="empty-hint">Aucun événement pour le moment.</div>'}
  </section>`;
  document.getElementById("app").innerHTML = html;
}

// ---------------------------------------------------------------------
// Games / competitions tab
// ---------------------------------------------------------------------
const GAMES_FIELDS = [
  { label: "Amorce (eyebrow)", path: "eyebrow" },
  { label: "Titre", path: "title" },
  { label: "Description", path: "description", textarea: true },
  { label: 'Texte du bouton "En savoir plus"', path: "labels.learnMore" },
  { label: "Titre de la section Gamelab", path: "gamelab.title" },
  { label: 'Titre "Qu\'est-ce que c\'est ?"', path: "gamelab.whatIsTitle" },
  { label: 'Titre "Comment participer ?"', path: "gamelab.participateTitle" },
  { label: 'Intro "Comment participer ?"', path: "gamelab.participateIntro", textarea: true },
  { label: "Titre des avantages", path: "gamelab.benefitsTitle" },
  { label: "Texte des avantages", path: "gamelab.benefitsText", textarea: true },
  { label: "Texte si aucun Gamelab", path: "gamelab.emptyText" },
  { label: "Titre de la section Game jams", path: "gameJams.title" },
  { label: "Texte si aucune game jam", path: "gameJams.emptyText" },
];

function gameEntryCard(listPath, index, uploadDir) {
  const base = `${listPath}.${index}`;
  const title = val("fr", `${base}.title`) || "(sans titre)";
  // Open by default (there are usually only a handful per year/jam) —
  // still collapsible if a year ends up with a long list.
  return cardShell({
    key: `game:${idFor(getPath(store.games.fr, base))}`,
    titleHtml: esc(title),
    actionsHtml: `
        <button class="btn btn-sm" data-action="moveListItem" data-listpath="${listPath}" data-index="${index}" data-dir="-1">↑</button>
        <button class="btn btn-sm" data-action="moveListItem" data-listpath="${listPath}" data-index="${index}" data-dir="1">↓</button>
        <button class="btn btn-sm btn-danger" data-action="removeListItem" data-listpath="${listPath}" data-index="${index}">Supprimer</button>`,
    bodyHtml: `
    ${localePairField("Titre", `${base}.title`)}
    ${fieldImage("Image", `${base}.image`, uploadDir)}
    ${fieldShared("Lien (itch.io, etc.)", `${base}.url`, { placeholder: "https://…" })}
    ${localePairField("Description (prix, un par ligne)", `${base}.description`, { textarea: true })}`,
    defaultOpen: true,
  });
}

function yearGroup(year, defaultOpen) {
  const listPath = `gamelab.games.${year}`;
  const games = getPath(store.games.fr, listPath) || [];
  const count = games.length;
  return cardShell({
    key: `games:year:${year}`,
    titleHtml: `${esc(year)} <span class="card-head-sub">(${count} jeu${count === 1 ? "" : "x"})</span>`,
    actionsHtml: `<button class="btn btn-sm btn-danger" data-action="removeYear" data-year="${esc(year)}">Supprimer l'année</button>`,
    bodyHtml: `
    <button class="btn btn-sm add-row" data-action="addListItem" data-listpath="${listPath}" data-kind="game" data-prepend="1">+ Ajouter un jeu</button>
    ${games.length ? games.map((_, i) => gameEntryCard(listPath, i, "games")).join("") : '<div class="empty-hint">Aucun jeu pour cette année.</div>'}`,
    defaultOpen,
  });
}

function jamCard(index, defaultOpen) {
  const base = `gameJams.items.${index}`;
  const title = val("fr", `${base}.name`) || "(sans nom)";
  const date = val("fr", `${base}.date`);
  const games = getPath(store.games.fr, `${base}.games`) || [];
  return cardShell({
    key: `games:jam:${idFor(getPath(store.games.fr, base))}`,
    titleHtml: `${esc(title)}${date ? ` <span class="card-head-sub">— ${esc(date)}</span>` : ""}`,
    actionsHtml: `
        <button class="btn btn-sm" data-action="moveListItem" data-listpath="gameJams.items" data-index="${index}" data-dir="-1">↑</button>
        <button class="btn btn-sm" data-action="moveListItem" data-listpath="gameJams.items" data-index="${index}" data-dir="1">↓</button>
        <button class="btn btn-sm btn-danger" data-action="removeListItem" data-listpath="gameJams.items" data-index="${index}">Supprimer la jam</button>`,
    bodyHtml: `
    ${localePairField("Nom de la jam", `${base}.name`)}
    ${localePairField("Date (texte libre)", `${base}.date`)}
    ${fieldShared("Lien (optionnel)", `${base}.url`, { placeholder: "https://…" })}
    ${localePairField("Description", `${base}.description`, { textarea: true })}
    <div class="jam-games">
      <div class="card-head-title" style="font-size:13px;color:var(--text-faint);margin-bottom:8px">Jeux créés pendant cette jam</div>
      <button class="btn btn-sm add-row" data-action="addListItem" data-listpath="${base}.games" data-kind="game" data-prepend="1">+ Ajouter un jeu</button>
      ${games.length ? games.map((_, gi) => gameEntryCard(`${base}.games`, gi, "games")).join("") : '<div class="empty-hint">Aucun jeu pour le moment.</div>'}
    </div>`,
    defaultOpen,
  });
}

function renderGames() {
  let html = pageCopySection(GAMES_FIELDS);
  html += stringListPairSection('Gamelab — paragraphes "Qu\'est-ce que c\'est ?"', "gamelab.whatIsParagraphs");
  html += stringListPairSection('Gamelab — liste à puces "Comment participer ?"', "gamelab.participateList");

  const years = Object.keys(store.games.fr.gamelab.games || {}).sort((a, b) => b.localeCompare(a));
  html += `<section class="block">
    <h2 class="block-title">Entrées Gamelab par année</h2>
    <p class="block-hint">Le titre, le lien et l'image sont partagés entre les langues — seule la description (prix) est traduite. Cliquez sur une année pour la déplier.</p>
    <button class="btn add-row" data-action="addYear">+ Ajouter une année</button>
    ${years.length ? years.map((y, i) => yearGroup(y, i === 0)).join("") : '<div class="empty-hint">Aucune année pour le moment.</div>'}
  </section>`;

  const jams = store.games.fr.gameJams.items || [];
  html += `<section class="block">
    <h2 class="block-title">Game jams</h2>
    <button class="btn add-row" data-action="addListItem" data-listpath="gameJams.items" data-kind="jam" data-prepend="1">+ Ajouter une game jam</button>
    ${jams.length ? jams.map((_, i) => jamCard(i, i === 0)).join("") : '<div class="empty-hint">Aucune game jam pour le moment.</div>'}
  </section>`;

  document.getElementById("app").innerHTML = html;
}

function addYear() {
  const year = prompt("Année (ex. 2026) :");
  if (!year) return;
  const key = year.trim();
  if (!/^\d{4}$/.test(key)) {
    alert("Veuillez entrer une année à 4 chiffres.");
    return;
  }
  for (const locale of LOCALES) {
    const games = store.games[locale].gamelab.games;
    if (!games[key]) games[key] = [];
  }
  markDirty();
  renderTab("games");
}

function removeYear(year) {
  if (!confirm(`Supprimer ${year} et tous les jeux qui y sont listés ?`)) return;
  const removedGames = store.games.fr.gamelab.games[year];
  for (const locale of LOCALES) delete store.games[locale].gamelab.games[year];
  markDirty();
  renderTab("games");
  if (removedGames) cleanupOrphanedImages(removedGames);
}

// ---------------------------------------------------------------------
// Media kit tab
// ---------------------------------------------------------------------
const MEDIAKIT_FIELDS = [
  { label: "Amorce (eyebrow)", path: "eyebrow" },
  { label: "Titre", path: "title" },
  { label: "Introduction", path: "intro", textarea: true },
  { label: "Titre de la section Logos", path: "logosHeading" },
  { label: "Titre de la section Couleurs", path: "colorsHeading" },
  { label: "Titre de la section Typographie", path: "typographyHeading" },
  { label: "Texte du bouton de téléchargement", path: "downloadLabel" },
  { label: "Étiquette du champ police", path: "typographyFieldLabel" },
];

function mediaKitLogoCard(index, defaultOpen) {
  const base = `logos.${index}`;
  const title = val("fr", `${base}.label`) || "(sans nom)";
  return cardShell({
    key: `mediaKit:logo:${idFor(getPath(store.mediaKit.fr, base))}`,
    titleHtml: esc(title),
    actionsHtml: `
        <button class="btn btn-sm" data-action="moveListItem" data-listpath="logos" data-index="${index}" data-dir="-1">↑</button>
        <button class="btn btn-sm" data-action="moveListItem" data-listpath="logos" data-index="${index}" data-dir="1">↓</button>
        <button class="btn btn-sm btn-danger" data-action="removeListItem" data-listpath="logos" data-index="${index}">Supprimer</button>`,
    bodyHtml: `
    ${localePairField("Nom du logo", `${base}.label`)}
    ${fieldImage("Fichier PNG", `${base}.png`, "conjure")}
    ${fieldImage("Fichier SVG", `${base}.svg`, "conjure")}
    ${fieldShared("Résolution affichée (ex. « 666 × 100 »)", `${base}.resolution`)}
    ${fieldSelect("Fond affiché derrière le logo dans le kit média", `${base}.surface`, [
      { value: "light", label: "Fond clair" },
      { value: "dark", label: "Fond sombre" },
    ])}`,
    defaultOpen,
  });
}

function mediaKitColorCard(index, defaultOpen) {
  const base = `colors.${index}`;
  const title = val("fr", `${base}.name`) || "(sans nom)";
  return cardShell({
    key: `mediaKit:color:${idFor(getPath(store.mediaKit.fr, base))}`,
    titleHtml: esc(title),
    actionsHtml: `
        <button class="btn btn-sm" data-action="moveListItem" data-listpath="colors" data-index="${index}" data-dir="-1">↑</button>
        <button class="btn btn-sm" data-action="moveListItem" data-listpath="colors" data-index="${index}" data-dir="1">↓</button>
        <button class="btn btn-sm btn-danger" data-action="removeListItem" data-listpath="colors" data-index="${index}">Supprimer</button>`,
    bodyHtml: `
    ${localePairField("Nom", `${base}.name`)}
    ${fieldColor("Couleur (hexadécimal)", `${base}.hex`)}
    ${fieldShared("Classe Tailwind associée (doit déjà exister dans globals.css)", `${base}.className`, { placeholder: "bg-primary" })}`,
    defaultOpen,
  });
}

function renderMediaKit() {
  let html = pageCopySection(MEDIAKIT_FIELDS);

  const logos = store.mediaKit.fr.logos || [];
  html += `<section class="block">
    <h2 class="block-title">Logos</h2>
    <p class="block-hint">Ces fichiers sont aussi utilisés ailleurs sur le site (ex. le logo de la barre de navigation) — contrairement aux autres onglets, ils ne sont jamais supprimés automatiquement du serveur depuis ici, même en retirant un logo ci-dessous.</p>
    <button class="btn add-row" data-action="addListItem" data-listpath="logos" data-kind="logo">+ Ajouter un logo</button>
    ${logos.length ? logos.map((_, i) => mediaKitLogoCard(i, false)).join("") : '<div class="empty-hint">Aucun logo pour le moment.</div>'}
  </section>`;

  const colors = store.mediaKit.fr.colors || [];
  html += `<section class="block">
    <h2 class="block-title">Couleurs</h2>
    <p class="block-hint">Ces couleurs doivent correspondre à des jetons déjà définis dans <code>src/app/globals.css</code> — cet onglet ne crée pas de nouvelle couleur pour le reste du site, il ne fait qu'afficher/documenter celles qui existent déjà.</p>
    <button class="btn add-row" data-action="addListItem" data-listpath="colors" data-kind="color">+ Ajouter une couleur</button>
    ${colors.length ? colors.map((_, i) => mediaKitColorCard(i, false)).join("") : '<div class="empty-hint">Aucune couleur pour le moment.</div>'}
  </section>`;

  html += `<section class="block">
    <h2 class="block-title">Typographie</h2>
    ${fieldShared("Nom de la police", "typography.name")}
    ${localePairField("Consignes d'utilisation", "typography.usage", { textarea: true })}
  </section>`;

  document.getElementById("app").innerHTML = html;
}

// ---------------------------------------------------------------------
// Tab plumbing
// ---------------------------------------------------------------------
function renderTab(key) {
  captureOpenState(); // remember whatever's currently expanded before we blow the DOM away
  if (key === "sponsors") renderSponsors();
  else if (key === "events") renderEvents();
  else if (key === "games") renderGames();
  else if (key === "mediaKit") renderMediaKit();
}

async function loadCollection(key) {
  const res = await fetch(`/api/content?collection=${key}`);
  if (!res.ok) throw new Error("Impossible de charger le contenu.");
  store[key] = await res.json();
}

async function switchTab(key) {
  if (key === current) return;
  if (dirty && !confirm("Vous avez des modifications non enregistrées. Les abandonner et changer d'onglet ?")) return;
  current = key;
  dirty = false;
  updateStatus();
  document.querySelectorAll(".tab").forEach((b) => b.classList.toggle("active", b.dataset.tab === key));
  if (!store[key]) {
    document.getElementById("app").innerHTML = '<p class="block-hint">Chargement…</p>';
    await loadCollection(key);
  }
  renderTab(key);
}

function markDirty() {
  dirty = true;
  updateStatus();
}

function updateStatus() {
  const el = document.getElementById("status");
  el.textContent = dirty ? "Modifications non enregistrées" : "Tout est enregistré";
  el.classList.toggle("dirty", dirty);
}

function toast(msg, isError = false) {
  const tpl = document.getElementById("tpl-toast");
  const node = tpl.content.firstElementChild.cloneNode(true);
  node.textContent = msg;
  if (isError) node.classList.add("error");
  document.body.appendChild(node);
  setTimeout(() => node.remove(), 3200);
}

async function saveCurrent() {
  if (!current) return;
  if (current === "sponsors") normalizeSponsors();
  const btn = document.getElementById("saveBtn");
  btn.disabled = true;
  btn.textContent = "Enregistrement…";
  try {
    const res = await fetch(`/api/content?collection=${current}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fr: store[current].fr, en: store[current].en }),
    });
    if (!res.ok) throw new Error((await res.json()).error || "Échec de l'enregistrement.");
    dirty = false;
    updateStatus();
    toast("Enregistré.");
  } catch (err) {
    toast("Échec de l'enregistrement : " + err.message, true);
  } finally {
    btn.disabled = false;
    btn.textContent = "Enregistrer";
  }
}

async function reloadCurrent() {
  if (!current) return;
  if (dirty && !confirm("Abandonner les modifications non enregistrées et recharger depuis le disque ?")) return;
  await loadCollection(current);
  dirty = false;
  updateStatus();
  renderTab(current);
  toast("Rechargé depuis le disque.");
}

// ---------------------------------------------------------------------
// delegated event listeners
// ---------------------------------------------------------------------
const app = document.getElementById("app");

app.addEventListener("input", (e) => {
  const t = e.target;
  if (t.type === "checkbox" || t.type === "file" || !t.dataset.path) return;
  const path = t.dataset.path;
  if (t.dataset.shared) {
    for (const locale of LOCALES) setPath(store[current][locale], path, t.value);
  } else if (t.dataset.locale) {
    setPath(store[current][t.dataset.locale], path, t.value);
  }
  markDirty();
});

app.addEventListener("change", async (e) => {
  const t = e.target;

  if (t.type === "checkbox" && t.dataset.path) {
    for (const locale of LOCALES) setPath(store[current][locale], t.dataset.path, t.checked);
    markDirty();
    return;
  }

  if (t.type === "file" && t.dataset.uploadPath) {
    const files = Array.from(t.files || []);
    if (!files.length) return;
    const dir = t.dataset.uploadDir;
    const uploadPath = t.dataset.uploadPath;
    const append = t.dataset.uploadAppend === "1";

    async function uploadOne(file) {
      const url = `/api/upload?dir=${encodeURIComponent(dir)}&filename=${encodeURIComponent(file.name)}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": file.type || "application/octet-stream" },
        body: file,
      });
      if (!res.ok) throw new Error((await res.json()).error || "Échec du téléversement.");
      const { path: newPath } = await res.json();
      return newPath;
    }

    try {
      if (append) {
        // Uploaded sequentially (not Promise.all) so the server's
        // dedup-by-filename check sees each write before the next starts.
        for (const file of files) {
          const newPath = await uploadOne(file);
          for (const locale of LOCALES) {
            const arr = getPath(store[current][locale], uploadPath) || [];
            arr.push(newPath);
            setPath(store[current][locale], uploadPath, arr);
          }
        }
        toast(files.length > 1 ? `${files.length} images téléversées.` : "Image téléversée.");
      } else {
        const newPath = await uploadOne(files[0]);
        for (const locale of LOCALES) setPath(store[current][locale], uploadPath, newPath);
        toast("Image téléversée.");
      }
      markDirty();
      renderTab(current);
    } catch (err) {
      toast("Échec du téléversement : " + err.message, true);
    }
  }
});

app.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;
  // Action buttons can live inside a <summary> (card header). Without this,
  // clicking them would also trigger the native <details> expand/collapse.
  e.preventDefault();
  const d = btn.dataset;
  switch (d.action) {
    case "addListItem":
      addListItem(d.listpath, d.kind, d.prepend === "1");
      break;
    case "removeListItem":
      removeListItem(d.listpath, Number(d.index));
      break;
    case "moveListItem":
      moveListItem(d.listpath, Number(d.index), Number(d.dir));
      break;
    case "addStringListItem":
      addStringListItem(d.locale, d.path);
      break;
    case "removeStringListItem":
      removeStringListItem(d.locale, d.path, Number(d.index));
      break;
    case "addYear":
      addYear();
      break;
    case "removeYear":
      removeYear(d.year);
      break;
  }
});

document.querySelectorAll(".tab").forEach((b) => b.addEventListener("click", () => switchTab(b.dataset.tab)));
document.getElementById("saveBtn").addEventListener("click", saveCurrent);
document.getElementById("reloadBtn").addEventListener("click", reloadCurrent);
window.addEventListener("beforeunload", (e) => {
  if (!dirty) return;
  e.preventDefault();
  e.returnValue = "";
});

switchTab("sponsors");
