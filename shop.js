/* Juniper & Leaf Tea Co. — shop page logic.
   COURSE-TRACK STUDY NOTES (Dr. Angela Yu, Full-Stack Bootcamp):
   This file combines the course's front-end patterns in plain JavaScript:
   - DATA-DRIVEN RENDERING: the whole shelf is one array of objects below.
     Cards, the result count and the empty state are all built from that data,
     so adding a tea means adding one object — never editing HTML.
   - STATE + PERSISTENCE: the basket and the wishlist live in localStorage.
     Every change saves them, so they survive page changes and reloads.
   - DERIVED STATE: the visible list (family + search + sort) and every
     price (size option, quantity, basket totals) are COMPUTED from state,
     never stored. If the data changes, the page follows.
   - OPTION-DRIVEN PRICING: the modal's size buttons reprice live —
     Taster is $5 under Classic, Pantry is $12 over Classic.
*/

"use strict";

/* ------------------------------------------------------------------ */
/* 1. DATA — the single source of truth for the whole shop.            */
/*    price = the CLASSIC size. Taster and Pantry are derived from it.  */
/* ------------------------------------------------------------------ */
const TEAS = [
  { id: "sencha-green",      name: "Sencha Green",       family: "Green",   price: 12, detail: "Loose leaf",    img: "images/c1.jpg",  alt: "A cup of green tea with dry leaves and a ceramic teapot, seen from above", desc: "Japanese sencha, steamed and rolled the same week it was picked — grassy, bright and clean, the everyday green tea that never tastes tired." },
  { id: "ceremonial-matcha", name: "Ceremonial Matcha",  family: "Green",   price: 18, detail: "Stone-ground powder", img: "images/c2.jpg",  alt: "Vibrant green matcha in a rustic ceramic bowl with a bamboo whisk", desc: "Shade-grown tencha, stone-ground in small batches — thick, sweet and vivid green. Whisk it with hot water, or shake it into cold milk." },
  { id: "assam-breakfast",   name: "Assam Breakfast",    family: "Black",   price: 11, detail: "Loose leaf",    img: "images/c3.jpg",  alt: "A warm cup of black tea with a tea bag on a white saucer", desc: "Bold Assam from the Brahmaputra valley — malty, strong and made for milk. The cup that gets a slow morning moving." },
  { id: "masala-chai",       name: "Masala Chai",        family: "Black",   price: 13, detail: "Loose leaf",    img: "images/c4.jpg",  alt: "A glass of creamy Indian masala chai on a wooden table", desc: "Assam blended with cardamom, cinnamon, ginger and black pepper — the house chai. Simmer it in half milk, half water, and sweeten to taste." },
  { id: "chamomile-blossom", name: "Chamomile Blossom",  family: "Herbal",  price: 10, detail: "Whole flowers", img: "images/c5.jpg",  alt: "A calming cup of herbal tea with dried flowers and herbs", desc: "Whole Egyptian chamomile flowers, nothing else — soft, apple-sweet and honeyed. The cup for the last hour of the day." },
  { id: "peppermint-leaf",   name: "Peppermint Leaf",    family: "Herbal",  price: 9,  detail: "Dried leaf",    img: "images/c6.jpg",  alt: "A glass of herbal tea on a floral plate with dried flowers", desc: "American peppermint, cut leaf and nothing else — cool, clean and properly minty. Lovely hot, and better still poured over ice." },
  { id: "tieguanyin-oolong", name: "Iron Goddess Oolong", family: "Oolong", price: 16, detail: "Whole leaf",    img: "images/c7.jpg",  alt: "An elegant tea tray with a teapot, cups and green leaves", desc: "Tieguanyin, rolled tight and roasted light — orchid on the first steep, toasted hazelnut by the third. The leaves open up and keep giving." },
  { id: "dark-roast-oolong", name: "Dark Roast Oolong",  family: "Oolong",  price: 15, detail: "Whole leaf",    img: "images/c8.jpg",  alt: "Chinese tea cups and bowls set out for a traditional tea ceremony", desc: "A heavily roasted oolong from the Wuyi mountains — dark fruit, warm charcoal and a long finish. Brew it strong and short." },
  { id: "silver-needle",     name: "Silver Needle White", family: "White",  price: 17, detail: "Whole buds",    img: "images/c9.jpg",  alt: "A tea strainer resting on a glass in soft sunlight", desc: "First-spring buds, picked before they open and dried in the sun — pale, delicate and quietly sweet, like cucumber and hay." },
  { id: "white-peony",       name: "White Peony",        family: "White",   price: 14, detail: "Loose leaf",    img: "images/c10.jpg", alt: "A glass cup of aromatic tea on a sunlit table with leaf shadows", desc: "Buds and young leaves together, the classic white tea — gentle, floral and forgiving. Hard to oversteep, easy to love." },
  { id: "classic-rooibos",   name: "Classic Rooibos",    family: "Rooibos", price: 10, detail: "Loose leaf",    img: "images/c11.jpg", alt: "A black teapot beside a clear glass of rooibos tea", desc: "Red rooibos from the Cederberg, naturally caffeine-free — smooth, woody and a little honeyed. The all-day, all-ages cup." },
  { id: "rooibos-lemongrass", name: "Rooibos & Lemongrass", family: "Rooibos", price: 11, detail: "Loose leaf", img: "images/c12.jpg", alt: "A close-up of dried rooibos and lemongrass blend", desc: "Rooibos with bright lemongrass and a whisper of ginger — citrusy, warming and caffeine-free. Our best iced tea, poured over a tall glass." },
];

/* Size options: each size is a price OFFSET from the Classic price.
   Deriving prices this way keeps one number per tea in the data. */
const SIZES = [
  { key: "Taster",  offset: -5,  note: "1 oz · the taster tin" },
  { key: "Classic", offset: 0,   note: "4 oz · the classic tin" },
  { key: "Pantry",  offset: 12,  note: "8 oz · the pantry tin" },
];

const BASKET_KEY = "juniper-leaf-tea-basket";
const WISHLIST_KEY = "juniper-leaf-tea-wishlist";

/* ------------------------------------------------------------------ */
/* 2. STATE — loaded from localStorage, saved on every change.         */
/* ------------------------------------------------------------------ */
function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}
function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

let basket = loadJSON(BASKET_KEY, []);       // [{id, size, qty}]
let wishlist = loadJSON(WISHLIST_KEY, []);   // [id, id, ...]
let activeFamily = "All";
let searchText = "";
let sortMode = "featured";

/* ------------------------------------------------------------------ */
/* 3. HELPERS                                                          */
/* ------------------------------------------------------------------ */
const $ = (sel) => document.querySelector(sel);
const money = (n) => "$" + n.toFixed(2);
function teaById(id) { return TEAS.find((b) => b.id === id); }
function sizePrice(tea, sizeKey) {
  const size = SIZES.find((s) => s.key === sizeKey) || SIZES[1];
  return tea.price + size.offset;
}
function basketCount() { return basket.reduce((sum, line) => sum + line.qty, 0); }
function basketSubtotal() {
  return basket.reduce((sum, line) => {
    const b = teaById(line.id);
    return b ? sum + sizePrice(b, line.size) * line.qty : sum;
  }, 0);
}

/* ------------------------------------------------------------------ */
/* 4. RENDER — the visible list is DERIVED from data + filters.        */
/*    Filter, then search, then sort, then paint. Nothing is stored.   */
/* ------------------------------------------------------------------ */
function visibleTeas() {
  let list = TEAS.slice();
  if (activeFamily !== "All") {
    list = list.filter((b) => b.family === activeFamily);
  }
  const q = searchText.trim().toLowerCase();
  if (q) {
    list = list.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.desc.toLowerCase().includes(q) ||
        b.detail.toLowerCase().includes(q)
    );
  }
  if (sortMode === "price-asc") list.sort((a, b) => a.price - b.price);
  else if (sortMode === "price-desc") list.sort((a, b) => b.price - a.price);
  else if (sortMode === "name") list.sort((a, b) => a.name.localeCompare(b.name));
  return list; // "featured" keeps the catalogue order
}

function renderGrid() {
  const grid = $("#teaGrid");
  const list = visibleTeas();
  $("#resultCount").textContent =
    list.length + (list.length === 1 ? " tea" : " teas");

  if (list.length === 0) {
    grid.innerHTML =
      '<div class="empty-state"><strong>No teas match that search.</strong>' +
      "Try a different tea family, or clear the family filter to see the whole shelf.</div>";
    return;
  }

  grid.innerHTML = list.map((b) => {
    const wished = wishlist.includes(b.id);
    return (
      '<article class="card">' +
      '<img src="' + b.img + '" alt="' + b.alt + '" loading="lazy">' +
      '<div class="card-body">' +
      '<h3>' + b.name + '</h3>' +
      '<p class="card-family">' + b.family + '</p>' +
      '<p class="desc">' + b.desc + '</p>' +
      '<div class="card-meta"><span class="price">' + money(b.price) +
      ' <small>Classic</small></span><span class="detail">' + b.detail + '</span></div>' +
      '<div class="card-actions">' +
      '<button class="btn" type="button" data-view="' + b.id + '">View &amp; choose size</button>' +
      '<button class="heart" type="button" data-wish="' + b.id + '" aria-pressed="' + wished +
      '" aria-label="Save ' + b.name + ' to wishlist">' + (wished ? "♥" : "♡") + '</button>' +
      "</div></div></article>"
    );
  }).join("");
}

/* ------------------------------------------------------------------ */
/* 5. BASKET DRAWER — same state, second view of it.                  */
/* ------------------------------------------------------------------ */
function renderBasketBtn() {
  $("#basketBtn").textContent = "Basket (" + basketCount() + ")";
}

function renderDrawer() {
  const body = $("#drawerBody");
  const foot = $("#drawerFoot");
  if (basket.length === 0) {
    body.innerHTML =
      '<p class="drawer-empty">Your basket is empty.<br>Pick a tea and choose a size to get started.</p>';
    foot.innerHTML = "";
    return;
  }
  body.innerHTML = basket.map((line, i) => {
    const b = teaById(line.id);
    if (!b) return "";
    const unit = sizePrice(b, line.size);
    return (
      '<div class="basket-line">' +
      '<img src="' + b.img + '" alt="' + b.alt + '">' +
      "<div><h4>" + b.name + "</h4>" +
      '<p class="line-sub">' + line.size + " · " + money(unit) + " each</p>" +
      '<span class="qty-mini"><button type="button" data-dec="' + i + '" aria-label="One fewer">−</button>' +
      "<span>" + line.qty + "</span>" +
      '<button type="button" data-inc="' + i + '" aria-label="One more">+</button></span>' +
      '<br><button class="line-remove" type="button" data-remove="' + i + '">Remove</button>' +
      "</div>" +
      '<div class="line-price">' + money(unit * line.qty) + "</div>" +
      "</div>"
    );
  }).join("");

  foot.innerHTML =
    '<div class="totals"><div><span>Subtotal</span><span>' + money(basketSubtotal()) + "</span></div>" +
    "<div><span>Delivery</span><span>At checkout</span></div></div>" +
    '<a class="btn btn-rose" href="cart.html">Go to checkout</a>';
}

function openDrawer() {
  renderDrawer();
  $("#basketDrawer").classList.add("open");
  $("#drawerBackdrop").classList.add("open");
}
function closeDrawer() {
  $("#basketDrawer").classList.remove("open");
  $("#drawerBackdrop").classList.remove("open");
}

function addToBasket(id, size, qty) {
  const existing = basket.find((l) => l.id === id && l.size === size);
  if (existing) existing.qty += qty;
  else basket.push({ id: id, size: size, qty: qty });
  saveJSON(BASKET_KEY, basket);
  renderBasketBtn();
  renderDrawer();
}

/* ------------------------------------------------------------------ */
/* 6. DETAIL MODAL — size and quantity reprice live (derived state).  */
/* ------------------------------------------------------------------ */
let modalTea = null;
let modalSize = "Classic";
let modalQty = 1;

function openModal(id) {
  modalTea = teaById(id);
  if (!modalTea) return;
  modalSize = "Classic";
  modalQty = 1;
  $("#modalImg").src = modalTea.img;
  $("#modalImg").alt = modalTea.alt;
  $("#modalTitle").textContent = modalTea.name;
  $("#modalFamily").textContent =
    modalTea.family + " · " + modalTea.detail;
  $("#modalDesc").textContent = modalTea.desc;
  renderSizeRow();
  renderModalTotal();
  $("#modalBackdrop").classList.add("open");
}
function closeModal() {
  $("#modalBackdrop").classList.remove("open");
  modalTea = null;
}
function renderSizeRow() {
  $("#sizeRow").innerHTML = SIZES.map((s) => {
    const price = modalTea.price + s.offset;
    return (
      '<button class="size-opt" type="button" data-size="' + s.key +
      '" aria-pressed="' + (modalSize === s.key) + '">' +
      "<strong>" + s.key + " — " + money(price) + "</strong>" +
      "<span>" + s.note + "</span></button>"
    );
  }).join("");
  $("#qtyOut").textContent = modalQty;
}
function renderModalTotal() {
  $("#modalTotal").textContent = money(
    sizePrice(modalTea, modalSize) * modalQty
  );
  $("#qtyOut").textContent = modalQty;
}

/* ------------------------------------------------------------------ */
/* 7. EVENTS — one delegated listener per area keeps this tidy.        */
/* ------------------------------------------------------------------ */
document.addEventListener("DOMContentLoaded", () => {
  renderGrid();
  renderBasketBtn();

  // Search (live, as you type) and sort.
  $("#searchInput").addEventListener("input", (e) => {
    searchText = e.target.value;
    renderGrid();
  });
  $("#sortSelect").addEventListener("change", (e) => {
    sortMode = e.target.value;
    renderGrid();
  });

  // Family chips — single-select, aria-pressed shows the active one.
  $("#familyChips").addEventListener("click", (e) => {
    const btn = e.target.closest(".chip");
    if (!btn) return;
    activeFamily = btn.dataset.family;
    document.querySelectorAll("#familyChips .chip").forEach((c) =>
      c.setAttribute("aria-pressed", String(c === btn))
    );
    renderGrid();
  });

  // Grid: view buttons and wishlist hearts.
  $("#teaGrid").addEventListener("click", (e) => {
    const viewBtn = e.target.closest("[data-view]");
    if (viewBtn) { openModal(viewBtn.dataset.view); return; }
    const wishBtn = e.target.closest("[data-wish]");
    if (wishBtn) {
      const id = wishBtn.dataset.wish;
      if (wishlist.includes(id)) wishlist = wishlist.filter((w) => w !== id);
      else wishlist.push(id);
      saveJSON(WISHLIST_KEY, wishlist);
      renderGrid(); // re-render so the heart flips and stays flipped
    }
  });

  // Modal: size, quantity, add, close (button, backdrop, Escape).
  $("#sizeRow").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-size]");
    if (!btn) return;
    modalSize = btn.dataset.size;
    renderSizeRow();
    renderModalTotal();
  });
  $("#qtyMinus").addEventListener("click", () => {
    if (modalQty > 1) { modalQty--; renderModalTotal(); }
  });
  $("#qtyPlus").addEventListener("click", () => {
    if (modalQty < 9) { modalQty++; renderModalTotal(); }
  });
  $("#modalAddBtn").addEventListener("click", () => {
    if (!modalTea) return;
    addToBasket(modalTea.id, modalSize, modalQty);
    closeModal();
    openDrawer();
  });
  $("#modalClose").addEventListener("click", closeModal);
  $("#modalBackdrop").addEventListener("click", (e) => {
    if (e.target === $("#modalBackdrop")) closeModal();
  });

  // Basket drawer: open, close, quantity, remove.
  $("#basketBtn").addEventListener("click", openDrawer);
  $("#drawerClose").addEventListener("click", closeDrawer);
  $("#drawerBackdrop").addEventListener("click", closeDrawer);
  $("#drawerBody").addEventListener("click", (e) => {
    const inc = e.target.closest("[data-inc]");
    const dec = e.target.closest("[data-dec]");
    const rem = e.target.closest("[data-remove]");
    if (inc) {
      basket[+inc.dataset.inc].qty = Math.min(9, basket[+inc.dataset.inc].qty + 1);
    } else if (dec) {
      const line = basket[+dec.dataset.dec];
      line.qty--;
      if (line.qty <= 0) basket.splice(+dec.dataset.dec, 1);
    } else if (rem) {
      basket.splice(+rem.dataset.remove, 1);
    } else return;
    saveJSON(BASKET_KEY, basket);
    renderBasketBtn();
    renderDrawer();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { closeModal(); closeDrawer(); }
  });
});
