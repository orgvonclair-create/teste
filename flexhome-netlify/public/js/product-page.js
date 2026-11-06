/* =========================================================================
   GENERIC PRODUCT LANDING RENDERER  —  mx-ttshop
   Reads PRODUCTS[window.PRODUCT_SLUG] and builds the whole landing.
   The per-product HTML is just a shell that sets PRODUCT_SLUG + loads this.
   ========================================================================= */
(function () {
  var slug = window.PRODUCT_SLUG;
  var p = (window.PRODUCTS || {})[slug];
  var mount = document.getElementById('app');
  if (!p || !mount) {
    if (mount) mount.innerHTML = '<div style="padding:40px;text-align:center;font-family:sans-serif">Producto no encontrado.</div>';
    return;
  }
  mount.classList.add('product-' + slug);

  if (p.cartBumps) window.CART_BUMPS = p.cartBumps; else if (p.cartBump) window.CART_BUMP = p.cartBump;   /* order bump(s) del producto */

  /* ---------- helpers ---------- */
  function money(n) { return '$' + Number(n).toLocaleString('es-AR') + ' ' + p.currency; }
  function intMX(n) { return Number(n).toLocaleString('es-AR'); }
  var COLORMAP = {};
  (p.colors || []).forEach(function (c) { COLORMAP[c.name] = c; });
  /* update all price displays when a variant with its own price is chosen */
  function applyVariant(c) {
    if (!c) return;
    var price = (c.price != null) ? c.price : p.price;
    var was = (c.was != null) ? c.was : p.was;
    var disc = c.discount || p.discount;
    var fsNow = document.querySelector('.fs-now');
    if (fsNow) fsNow.innerHTML = '<span class="fs-cur">$</span>' + intMX(price) + '<span class="fs-code"> ' + p.currency + '</span>';
    var fsWas = document.querySelector('.fs-was'); if (fsWas) fsWas.textContent = money(was);
    var badge = document.querySelector('.fs-badge'); if (badge && disc) badge.textContent = disc;
    var pr = document.querySelector('.price'); if (pr) pr.innerHTML = '<span class="cur">$</span>' + intMX(price) + '<span class="cur-code">' + p.currency + '</span>';
    var pw = document.querySelector('.price-was'); if (pw) pw.textContent = money(was);
  }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function starStr(n) { return '★★★★★☆☆☆☆☆'.slice(5 - n, 10 - n); }
  var AVCOL = ['#ff5fa2', '#6c8cff', '#ffb24d', '#45c4a0', '#b07cff', '#ff7a7a'];
  function initials(nm) {
    var parts = nm.replace(/[^A-Za-zÁÉÍÓÚÑáéíóúñ ]/g, ' ').trim().split(/\s+/);
    var a = parts[0] ? parts[0].charAt(0) : '';
    var b = parts[1] ? parts[1].charAt(0) : (parts[0] && parts[0].charAt(1) ? parts[0].charAt(1) : '');
    return (a + b).toUpperCase();
  }

  /* ---------- <head> meta ---------- */
  if (p.metaTitle) document.title = p.metaTitle;
  var md = document.querySelector('meta[name="description"]');
  if (!md) { md = document.createElement('meta'); md.name = 'description'; document.head.appendChild(md); }
  if (p.metaDesc) md.content = p.metaDesc;

  /* ---------- checkout link (carries incoming query + chosen color) ---------- */
  var chosenColor = p.variant;
  function checkoutHref() {
    var qs = new URLSearchParams(window.location.search);
    qs.set('p', slug);
    qs.set('color', chosenColor);
    return '/checkout.html?' + qs.toString();
  }

  /* ---------- build markup ---------- */
  var gallery = p.gallery.map(function (g) {
    return '<div class="slide"><img src="' + g.src + '" alt="' + esc(g.alt || '') + '" loading="lazy"></div>';
  }).join('');
  var dots = p.gallery.map(function (_, i) { return '<i class="' + (i === 0 ? 'on' : '') + '"></i>'; }).join('');

  var colorSwatches = (p.colors || []).map(function (c, i) {
    var inner = c.img
      ? '<img src="' + c.img + '" alt="' + esc(c.name) + '" loading="lazy">'
      : '<span class="sw-fill" style="display:block;width:100%;height:100%;background:' + (c.sw || '#ccc') + '"></span>';
    return '<button type="button" class="color-sw' + (i === 0 ? ' on' : '') + '" data-color="' + esc(c.name) + '"' + (c.img ? ' data-img="' + c.img + '"' : '') + ' title="' + esc(c.name) + '">' +
             inner +
           '</button>';
  }).join('');

  var specRows = p.specs.map(function (s) { return '<dt>' + esc(s[0]) + '</dt><dd>' + esc(s[1]) + '</dd>'; }).join('');
  var SHIP_HTML = '<section class="section">' +
    '<h2 class="block-title">Envío y devoluciones</h2>' +
    '<div class="row"><div class="grow"><span class="delivery" id="delivery">Entrega 3 - 5 días</span></div></div>' +
    '<div class="row"><div class="grow"><span class="teal" style="font-weight:700;">Envío gratis a toda Argentina</span></div></div>' +
    '<div class="hr" style="margin:6px 0;"></div>' +
    '<div class="row"><div class="grow"><div class="lead">Política de devoluciones</div><div class="muted-2" style="font-size:13px;margin-top:3px;">Garantía de satisfacción de 30 días. Si hay algún problema, solicita un reembolso o cambio dentro de 30 días.</div></div><span class="chev"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"></path></svg></span></div>' +
  '</section>';
  var DETAILS_HTML = '<section class="section">' +
    '<h2 class="block-title">Acerca del producto</h2>' +
    '<div class="lead" style="margin-bottom:10px;">Detalles</div>' +
    '<dl class="details">' + specRows + '</dl>' +
  '</section>';
  var descImgs = (p.descImages || []).map(function (d, i) {
    return '<div class="desc-img"' + (i > 0 && !p.descExpanded ? ' id="desc-extra" style="display:none"' : '') + '><img src="' + d.src + '" alt="' + esc(d.alt || '') + '" loading="lazy"></div>';
  }).join('');
  var DESCRIPTION_HTML = '<section class="section">' +
    '<h2 class="block-title">Descripción</h2>' +
    '<p class="muted" style="font-size:14px;line-height:1.6;margin:0 0 12px;">' + esc(p.description) + '</p>' +
    descImgs +
    (p.descImages && p.descImages.length > 1 && !p.descExpanded ? '<a class="desc-toggle" href="#" id="desc-toggle">Ver más <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"></path></svg></a>' : '') +
  '</section>';
  var STORE_HTML = '<section class="section">' +
    '<h2 class="block-title">Acerca de esta tienda</h2>' +
    '<div class="shop-card"><span class="big-av"' + (p.shopLogo ? ' style="overflow:hidden"' : '') + '>' + (p.shopLogo ? '<img src="' + p.shopLogo + '" alt="' + esc(p.shopName) + '" style="width:100%;height:100%;object-fit:contain;display:block">' : esc(p.shopInitials)) + '</span><div><div class="nm">' + esc(p.shopName) + '</div><div class="sub">18 productos · 300K+ artículos vendidos</div></div><div class="score">' + p.rating + ' <span class="star">★</span></div></div>' +
    '<div class="two-btn"><button>Mensaje</button><button>Ver tienda</button></div>' +
  '</section>';

  function reviewCard(r, idx, hidden) {
    var av = r.av
      ? '<img class="rev-av" src="' + r.av + '" alt="">'
      : '<span class="rev-av" style="background:' + AVCOL[idx % AVCOL.length] + ';">' + initials(r.nm) + '</span>';
    return '<div class="rev-card' + (hidden ? ' rev-hidden' : '') + '">' +
        '<div class="rev-top">' + av +
          '<div class="rev-id"><div class="nm">' + esc(r.nm) + '</div><div class="src">' + esc(p.reviewSource || 'Comprado en TikTok') + '</div></div>' +
          '<div class="stars">' + starStr(r.stars) + '</div>' +
        '</div>' +
        '<div class="rev-body"><p>' + esc(r.text) + '</p>' + (r.thumb ? '<img class="rev-thumb" src="' + r.thumb + '" alt="" loading="lazy">' : '') + '</div>' +
        '<div class="rev-meta"><span>' + esc(r.date) + '</span><span>' + esc(r.variant || p.variantFull) + '</span></div>' +
      '</div>';
  }
  var reviewsHtml = p.reviews.map(function (r, i) { return reviewCard(r, i, false); }).join('');


  /* FAQ (acordeón nativo <details>) — CSS inyectado una vez */
  if (!document.getElementById('faq-css')) {
    var _fs = document.createElement('style'); _fs.id = 'faq-css';
    _fs.textContent = '.faq-item{border-bottom:1px solid #eee}.faq-item summary{list-style:none;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:12px;padding:14px 2px;font-weight:700;font-size:14.5px;color:#161823}.faq-item summary::-webkit-details-marker{display:none}.faq-ico{flex-shrink:0;color:#9ca3af;transition:transform .2s}.faq-ico svg{width:18px;height:18px;display:block}.faq-item[open] .faq-ico{transform:rotate(180deg)}.faq-a{padding:0 2px 14px;font-size:13.5px;line-height:1.6;color:#65676b}';
    document.head.appendChild(_fs);
  }
  var faqHtml = (p.faq || []).map(function (f) {
    return '<details class="faq-item"><summary>' + esc(f.q) + '<span class="faq-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"></path></svg></span></summary><div class="faq-a">' + esc(f.a) + '</div></details>';
  }).join('');

  var ratingBarsHtml = (p.ratingBars || []).map(function (b) {
    return '<div class="rev-bar"><span class="lbl">' + esc(b.lbl) + '</span><span class="track"><span class="fill" style="width:' + b.w + '"></span></span><span class="pct">' + esc(b.pct) + '</span></div>';
  }).join('');
  var revSummaryHtml = p.ratingBars ?
    '<div class="rev-summary"><div class="big-score">' + p.rating + '</div><div class="rs-right"><div class="stars" style="font-size:16px;">★★★★★</div>' +
      '<div class="muted" style="font-size:12px;margin-top:3px;">' + esc(p.reviewsCount) + ' reseñas' + (p.reviewsRecommend ? ' · ' + esc(p.reviewsRecommend) + ' las recomiendan' : '') + '</div>' +
      '<div class="rev-bars">' + ratingBarsHtml + '</div></div></div>' :
    '<div class="rating" style="margin-top:0;"><span class="score">' + p.rating + '</span><span class="star">★</span><span class="sep">·</span><span class="muted">' + esc(p.reviewsCount) + ' reseñas</span></div>';
  var revPhotosHtml = (p.reviewPhotos && p.reviewPhotos.length) ?
    '<div class="rev-gallery-head"><span class="t">Fotos de clientes</span><span class="c">' + p.reviewPhotos.length + ' fotos · toca para ampliar</span></div>' +
    '<div class="rev-gallery">' + p.reviewPhotos.map(function (src) { return '<img src="' + src + '" loading="lazy" alt="Foto de cliente">'; }).join('') + '</div>' : '';

  mount.innerHTML =
  '<header class="app-header">' +
    '<button class="icon-btn back" aria-label="Atrás"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"></path></svg></button>' +
    '<div class="shop-chip' + (p.shopLogoOnly ? ' logo-only' : '') + (p.shopLogoOriginalRatio ? ' original-logo' : '') + '"><span class="shop-avatar">' + (p.shopLogo ? '<img src="' + p.shopLogo + '" alt="' + esc(p.shopName) + '">' : esc(p.shopInitials)) + '</span>' + (p.shopLogoOnly ? '' : '<span class="name">' + esc(p.shopName) + '</span>') + '</div>' +
    '<div class="right">' +
      '<button class="icon-btn cart-ico" aria-label="Carrito" style="background:#fff0f3;border-radius:50%;color:#e9202f"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1.6"></circle><circle cx="18" cy="21" r="1.6"></circle><path d="M2 3h2.2l2.4 12.4a1.5 1.5 0 0 0 1.5 1.2h8.9a1.5 1.5 0 0 0 1.5-1.2L21 7H6"></path></svg></button>' +
    '</div>' +
  '</header>' +

  '<section class="gallery">' +
    '<div class="slides" id="slides">' + gallery + '</div>' +
    '<button class="gnav prev" id="gprev" type="button" aria-label="Imagen anterior"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"></path></svg></button>' +
    '<button class="gnav next" id="gnext" type="button" aria-label="Imagen siguiente"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"></path></svg></button>' +
    '<div class="gcount"><span id="gcur">1</span>/' + p.gallery.length + '</div>' +
    '<div class="dots" id="dots">' + dots + '</div>' +
  '</section>' +

  '<div class="flash-sale">' +
    '<div class="fs-left"><span class="fs-badge">' + esc(p.discount) + '</span>' +
      '<div class="fs-price"><div class="fs-now"><span class="fs-cur">$</span>' + Number(p.price).toLocaleString('es-AR') + '<span class="fs-code"> ' + p.currency + '</span></div>' +
      '<div class="fs-was">' + money(p.was) + '</div></div></div>' +
    '<div class="fs-right"><div class="fs-flash"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h7l-1 8 10-12h-7z"></path></svg> Liquidación</div>' +
    '<div class="fs-ends">Termina en <b id="fs-timer">04:00:00</b></div></div>' +
  '</div>' +

  '<section class="section">' +
    '<div class="title-row"><h1 class="p-title"><span class="wins">Más Vendido</span>' + esc(p.title) + '</h1>' +
      '<div class="title-actions">' +
        '<button type="button" class="act-btn" aria-label="Compartir"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7"></path><path d="M16 6l-4-4-4 4"></path><path d="M12 2v14"></path></svg></button>' +
        '<button type="button" class="act-btn save-btn" aria-label="Guardar" aria-pressed="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg></button>' +
      '</div>' +
    '</div>' +
    '<div class="price-row"><span class="price"><span class="cur">$</span>' + Number(p.price).toLocaleString('es-AR') + '<span class="cur-code">' + p.currency + '</span></span><span class="price-was">' + money(p.was) + '</span></div>' +
    '<div class="rating"><span class="score">' + p.rating + '</span><span class="star">★</span><span class="sep">·</span><span class="muted">' + p.reviewsCount + '</span><span class="sep">|</span><span class="muted">' + esc(p.sold) + '</span></div>' +
    (p.colors && p.colors.length ? '<div class="color-pick"><div class="color-lead">' + esc(p.pickLabel || 'Color') + ': <b id="color-name">' + esc(p.variant) + '</b></div><div class="color-row">' + colorSwatches + '</div></div>' : '') +
    '<div class="stock-urgency"><div class="stock-top"><span class="stock-label">🔥 ¡Solo quedan <span id="stock-left">' + p.stock + '</span> unidades!</span><span class="stock-hint">Se agotan rápido</span></div><div class="stock-track"><span class="stock-fill" id="stock-fill" style="width:' + (p.stock / 120 * 100) + '%"></span></div></div>' +
    '<div class="price-why"><div class="pw-title">📦 ¿Por qué el precio es tan bajo?</div><p>' + p.whyCheap + '</p></div>' +
  '</section>' +

  '<div class="divider"></div>' +

  (p.detailsAfterRelated ? '' : SHIP_HTML) +

  (p.hideReviews ? '' :
  '<div class="divider"></div>' +

  '<section class="section">' +
    '<div class="rev-head"><span class="big">Reseñas</span></div>' +
    revSummaryHtml +
    revPhotosHtml +
    reviewsHtml +
    ((p.reviewPool && p.reviewPool.length) ? '<button class="view-all" id="more-reviews" type="button"><span>Ver más reseñas</span><span class="chev"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"></path></svg></span></button>' : '') +
  '</section>') +

  (p.storeAfterReviews && !p.hideStore ? '<div class="divider"></div>' + STORE_HTML : '') +

  (p.descriptionAfterReviews ? '<div class="divider"></div>' + DESCRIPTION_HTML : '') +

  (p.detailsAfterRelated ? '<div class="divider"></div>' + DETAILS_HTML + '<div class="divider"></div>' + SHIP_HTML : '') +


  (p.hideStore || p.storeAfterReviews ? '' :
  '<div class="divider"></div>' +
  STORE_HTML) +

  '<div class="divider"></div>' +

  (p.detailsAfterRelated ? '' : DETAILS_HTML) +

  '<div class="divider"></div>' +

  (p.descriptionAfterReviews ? '' : DESCRIPTION_HTML) +

  (faqHtml ?
  '<div class="divider"></div>' +
  '<section class="section">' +
    '<h2 class="block-title">Preguntas frecuentes</h2>' +
    faqHtml +
  '</section>' : '') +

  '<div class="bottom-bar">' +
    '<a class="btn btn-cart" id="cta-cart" href="#">Agregar al carrito</a>' +
    '<a class="btn btn-buy" id="cta-buy" href="#">Comprar ahora</a>' +
  '</div>' +
  '<div class="rev-lb" id="rev-lb"><button class="lb-close" type="button" aria-label="Cerrar">×</button><img src="" alt="Foto ampliada"></div>';

  /* ---------- lightbox de fotos de reseñas / clientes ---------- */
  (function () {
    var lb = document.getElementById('rev-lb'); if (!lb) return;
    var lbImg = lb.querySelector('img');
    document.addEventListener('click', function (e) {
      var t = e.target; if (!t) return;
      if (t.tagName === 'IMG' && t.closest && (t.closest('.rev-gallery') || t.closest('.rev-photos') || (t.classList && t.classList.contains('rev-thumb')))) {
        lbImg.src = t.src; lb.classList.add('open'); document.body.style.overflow = 'hidden'; return;
      }
      if (t.classList && (t.classList.contains('rev-lb') || t.classList.contains('lb-close'))) {
        lb.classList.remove('open'); lbImg.src = ''; document.body.style.overflow = '';
      }
    });
  })();

  /* ---------- wire checkout links ---------- */
  function refreshCta() {
    var href = checkoutHref();
    var a = document.getElementById('cta-cart'), b = document.getElementById('cta-buy');
    if (a) a.href = href; if (b) b.href = href;
  }
  refreshCta();

  /* ---------- color picker ---------- */
  (function () {
    var slides = document.getElementById('slides');
    [].forEach.call(document.querySelectorAll('.color-sw'), function (sw) {
      sw.addEventListener('click', function () {
        [].forEach.call(document.querySelectorAll('.color-sw'), function (o) { o.classList.remove('on'); });
        sw.classList.add('on');
        chosenColor = sw.getAttribute('data-color');
        var nm = document.getElementById('color-name');
        if (nm) nm.textContent = chosenColor;
        // swap first gallery slide to the chosen color (only if this color has its own image)
        var dataImg = sw.getAttribute('data-img');
        var firstImg = slides && slides.firstChild && slides.firstChild.querySelector('img');
        if (firstImg && dataImg) { firstImg.src = dataImg; slides.scrollTo({ left: 0, behavior: 'smooth' }); }
        applyVariant(COLORMAP[chosenColor]);
        refreshCta();
      });
    });
  })();

  /* ---------- gallery scroll / dots / arrows / counter ---------- */
  (function () {
    var s = document.getElementById('slides'), dots = document.getElementById('dots'),
        cur = document.getElementById('gcur'), prev = document.getElementById('gprev'), next = document.getElementById('gnext');
    if (!s) return;
    var n = s.children.length, i = 0;
    function go(idx) { i = Math.max(0, Math.min(n - 1, idx)); s.scrollTo({ left: i * s.clientWidth, behavior: 'smooth' }); }
    s.addEventListener('scroll', function () {
      i = Math.round(s.scrollLeft / s.clientWidth);
      if (dots) [].forEach.call(dots.children, function (d, idx) { d.classList.toggle('on', idx === i); });
      if (cur) cur.textContent = i + 1;
    }, { passive: true });
    if (dots) [].forEach.call(dots.children, function (d, idx) { d.addEventListener('click', function () { go(idx); }); });
    if (prev) prev.addEventListener('click', function () { go(i - 1); });
    if (next) next.addEventListener('click', function () { go(i + 1); });
  })();

  /* ---------- dynamic delivery window (3–5 days) ---------- */
  (function () {
    var el = document.getElementById('delivery'); if (!el) return;
    var M = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    function plus(d) { var x = new Date(); x.setHours(0, 0, 0, 0); x.setDate(x.getDate() + d); return x; }
    function range(a, b) {
      return a.getMonth() === b.getMonth()
        ? a.getDate() + ' - ' + b.getDate() + ' ' + M[b.getMonth()]
        : a.getDate() + ' ' + M[a.getMonth()] + ' - ' + b.getDate() + ' ' + M[b.getMonth()];
    }
    el.textContent = 'Entrega ' + range(plus(3), plus(5));
  })();

  /* ---------- low-stock ticker ---------- */
  (function () {
    var label = document.getElementById('stock-left'), fill = document.getElementById('stock-fill');
    if (!label || !fill) return;
    var units = p.stock, FLOOR = 4, TOTAL = 120;
    function paint() { label.textContent = units; fill.style.width = (units / TOTAL * 100) + '%'; }
    paint();
    (function tick() { setTimeout(function () { if (units > FLOOR) { units -= 1; paint(); } tick(); }, 7000 + Math.random() * 9000); })();
  })();

  /* ---------- clearance countdown (persisted 3–5h) ---------- */
  (function () {
    var el = document.getElementById('fs-timer'); if (!el) return;
    var KEY = 'ttshop_' + slug + '_deadline';
    function fresh() { return Date.now() + Math.round((3 + Math.random() * 2) * 3600 * 1000); }
    function load() { var d = parseInt(localStorage.getItem(KEY) || '', 10); if (!d || isNaN(d) || d <= Date.now()) { d = fresh(); try { localStorage.setItem(KEY, d); } catch (e) {} } return d; }
    var deadline = load();
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    function paint() { var t = Math.max(0, Math.floor((deadline - Date.now()) / 1000)); el.textContent = pad(Math.floor(t / 3600)) + ':' + pad(Math.floor((t % 3600) / 60)) + ':' + pad(t % 60); return t; }
    paint();
    setInterval(function () { if (paint() <= 0) { deadline = fresh(); try { localStorage.setItem(KEY, deadline); } catch (e) {} } }, 1000);
  })();

  /* ---------- reviews load-more ---------- */
  (function () {
    var btn = document.getElementById('more-reviews'); if (!btn) return;
    var DEFAULT = btn.innerHTML, BATCH = 3, busy = false, pi = 0, pool = p.reviewPool || [], base = p.reviews.length;
    function reveal() {
      var added = 0;
      while (added < BATCH && pi < pool.length) { btn.parentNode.insertBefore(mk(reviewCard(pool[pi], base + pi, false)), btn); pi++; added++; }
    }
    function mk(html) { var d = document.createElement('div'); d.innerHTML = html; return d.firstChild; }
    btn.addEventListener('click', function (e) {
      e.preventDefault(); if (busy) return; busy = true;
      btn.classList.add('loading');
      btn.innerHTML = '<span class="rev-spinner"></span><span>Cargando más reseñas…</span>';
      setTimeout(function () { reveal(); btn.classList.remove('loading'); btn.innerHTML = DEFAULT; busy = false; }, 900);
    });
  })();

  /* ---------- share / save feedback ---------- */
  (function () {
    [].forEach.call(document.querySelectorAll('.act-btn'), function (b) {
      b.addEventListener('click', function () { var on = b.classList.toggle('on'); if (b.classList.contains('save-btn')) b.setAttribute('aria-pressed', on); });
    });
  })();

  /* ---------- description toggle ---------- */
  (function () {
    var extra = document.getElementById('desc-extra'), tog = document.getElementById('desc-toggle');
    if (!extra || !tog) return;
    extra.style.display = 'none';
    tog.addEventListener('click', function (e) {
      e.preventDefault();
      var open = extra.style.display === 'none';
      extra.style.display = open ? 'block' : 'none';
      tog.firstChild.textContent = open ? 'Ver menos ' : 'Ver más ';
      tog.querySelector('svg').style.transform = open ? 'rotate(180deg)' : '';
    });
  })();

  /* ---------- "Elige tu oferta" modal (only for products with p.offers) ---------- */
  (function () {
    if (!p.offers || !p.offers.length) return;
    var colors = p.colors || [];
    var curColor = (colors[0] && colors[0].name) || p.variant;
    var curOffer = p.offers[0];

    /* inject modal styles once */
    var css = document.createElement('style');
    css.textContent =
      '.offer-ov{position:fixed;inset:0;z-index:80;background:rgba(0,0,0,.5);opacity:0;pointer-events:none;transition:opacity .25s;}' +
      '.offer-ov.on{opacity:1;pointer-events:auto;}' +
      '.offer-sheet{position:absolute;left:50%;bottom:0;transform:translateX(-50%) translateY(100%);width:100%;max-width:var(--maxw);background:#fff;border-radius:18px 18px 0 0;padding:14px 16px calc(16px + env(safe-area-inset-bottom));transition:transform .28s cubic-bezier(.4,1.2,.4,1);max-height:90vh;overflow-y:auto;}' +
      '.offer-ov.on .offer-sheet{transform:translateX(-50%) translateY(0);}' +
      '.offer-grab{width:38px;height:4px;border-radius:3px;background:#e2e2e5;margin:2px auto 12px;}' +
      '.offer-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;}' +
      '.offer-title{font-size:17px;font-weight:800;color:var(--ink);}' +
      '.offer-x{width:28px;height:28px;border:none;background:var(--gap);border-radius:50%;font-size:15px;color:var(--ink-2);cursor:pointer;line-height:1;}' +
      '.offer-lbl{font-size:13px;color:var(--ink-2);margin-bottom:8px;}.offer-lbl b{color:var(--ink);}' +
      '.color-opts{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:18px;}' +
      '.color-opt{display:flex;align-items:center;gap:8px;border:1.5px solid var(--line);border-radius:12px;padding:7px 11px 7px 8px;background:#fff;cursor:pointer;transition:border-color .15s,background .15s;}' +
      '.color-opt.on{border-color:var(--red);background:#fff5f7;}' +
      '.color-opt .color-dot{width:22px;height:22px;border-radius:50%;flex:0 0 auto;box-shadow:inset 0 0 0 1px rgba(0,0,0,.12);}' +
      '.color-opt span{font-size:14px;font-weight:600;color:var(--ink);}' +
      '.bundle{position:relative;display:flex;align-items:center;gap:12px;width:100%;text-align:left;border:1.5px solid var(--line);border-radius:14px;padding:13px 14px;margin-bottom:10px;background:#fff;cursor:pointer;transition:border-color .15s,box-shadow .15s;}' +
      '.bundle.on{border-color:var(--red);box-shadow:0 0 0 3px #fff0f3;}' +
      '.bundle-radio{width:20px;height:20px;border-radius:50%;border:2px solid #cfd0d4;flex:0 0 auto;position:relative;transition:border-color .15s;}' +
      '.bundle.on .bundle-radio{border-color:var(--red);}.bundle.on .bundle-radio::after{content:"";position:absolute;inset:3px;border-radius:50%;background:var(--red);}' +
      '.bundle-thumb{width:52px;height:52px;object-fit:contain;border-radius:9px;background:var(--gap);flex:0 0 auto;}' +
      '.bundle-info{flex:1;min-width:0;}' +
      '.bundle-name{display:block;font-size:14px;font-weight:700;color:var(--ink);line-height:1.3;}' +
      '.bundle-price{display:block;margin-top:3px;font-size:15px;font-weight:800;color:var(--red);}' +
      '.bundle-price s{color:var(--ink-3);font-weight:500;font-size:12px;margin-left:5px;}' +
      '.bundle-badge{position:absolute;top:-9px;right:12px;background:var(--red);color:#fff;font-size:10px;font-weight:800;padding:2px 8px;border-radius:20px;letter-spacing:.3px;}' +
      '.bundle-badge.green{background:#12b76a;}' +
      '.offer-cta{width:100%;border:none;border-radius:999px;padding:15px;background:var(--red);color:#fff;font-size:16px;font-weight:800;cursor:pointer;margin-top:6px;box-shadow:0 8px 22px rgba(254,44,85,.3);transition:filter .15s;}' +
      '.offer-cta:active{filter:brightness(.95);}';
    document.head.appendChild(css);

    function offerImg(o, color) { return (o.imgs && color && o.imgs[color]) || o.img || ''; }

    var colorHtml = colors.map(function (c, i) {
      var dotStyle = c.img ? ('background-image:url(' + c.img + ');background-size:cover;background-position:center') : ('background:' + (c.sw || '#ccc'));
      return '<button type="button" class="color-opt' + (i === 0 ? ' on' : '') + '" data-color="' + esc(c.name) + '">' +
        '<span class="color-dot" style="' + dotStyle + '"></span><span>' + esc(c.name) + '</span></button>';
    }).join('');

    var offerHtml = p.offers.map(function (o, i) {
      var badge = o.badge ? '<span class="bundle-badge' + (o.badgeColor === 'green' ? ' green' : '') + '">' + esc(o.badge) + '</span>' : '';
      var was = o.was ? ' <s>' + money(o.was) + '</s>' : '';
      var timg = offerImg(o, curColor);
      return '<button type="button" class="bundle' + (i === 0 ? ' on' : '') + '" data-offer="' + esc(o.id) + '">' +
        '<span class="bundle-radio"></span>' +
        (timg ? '<img class="bundle-thumb" src="' + timg + '" alt="">' : '') +
        '<span class="bundle-info"><span class="bundle-name">' + esc(o.name) + '</span>' +
        '<span class="bundle-price">' + money(o.price) + was + '</span></span>' + badge + '</button>';
    }).join('');

    var ov = document.createElement('div');
    ov.className = 'offer-ov';
    ov.innerHTML =
      '<div class="offer-sheet" role="dialog" aria-label="Elige tu oferta">' +
        '<div class="offer-grab"></div>' +
        '<div class="offer-head"><span class="offer-title">Elige tu oferta</span><button class="offer-x" aria-label="Cerrar">&#10005;</button></div>' +
        (colors.length ? '<div class="offer-lbl">Color: <b class="oc-name">' + esc(curColor) + '</b></div><div class="color-opts">' + colorHtml + '</div>' : '') +
        '<div class="offer-bundles">' + offerHtml + '</div>' +
        '<button type="button" class="offer-cta">Continuar &middot; <span class="oc-total">' + money(curOffer.price) + '</span></button>' +
      '</div>';
    document.body.appendChild(ov);

    function open() { ov.classList.add('on'); document.body.style.overflow = 'hidden'; }
    function close() { ov.classList.remove('on'); document.body.style.overflow = ''; }

    // Producto sin bundle (una sola oferta): los CTA agregan directo al carrito, sin abrir el sheet.
    function addCurrent() {
      var cn = document.getElementById('color-name');
      var col = (cn && cn.textContent) || curColor;
      if (!window.Cart) {
        var qs = new URLSearchParams(window.location.search);
        qs.set('p', slug); qs.set('color', col); qs.set('offer', curOffer.id);
        window.location.href = '/checkout.html?' + qs.toString(); return;
      }
      window.Cart.add({
        slug: slug, offer: String(curOffer.id), color: col,
        name: curOffer.name, variant: (colors.length ? col : ''),
        img: offerImg(curOffer, col) || (p.gallery[0] && p.gallery[0].src) || '',
        price: curOffer.price, was: curOffer.was || 0, qty: 1
      });
      window.Cart.open();
    }
    var singleOffer = p.offers.length === 1 && !p.bogo;
    [].forEach.call(document.querySelectorAll('.bottom-bar a, .bottom-bar button'), function (el) {
      el.addEventListener('click', function (e) { e.preventDefault(); if (singleOffer) { addCurrent(); } else { open(); } });
    });
    ov.querySelector('.offer-x').addEventListener('click', close);
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });

    [].forEach.call(ov.querySelectorAll('.color-opt'), function (b) {
      b.addEventListener('click', function () {
        [].forEach.call(ov.querySelectorAll('.color-opt'), function (x) { x.classList.remove('on'); });
        b.classList.add('on'); curColor = b.getAttribute('data-color');
        var nm = ov.querySelector('.oc-name'); if (nm) nm.textContent = curColor;
        /* refresca las miniaturas de cada bundle según el color (matriz color×bundle) */
        [].forEach.call(ov.querySelectorAll('.bundle'), function (bt) {
          var of = p.offers.filter(function (o) { return String(o.id) === String(bt.getAttribute('data-offer')); })[0];
          var im = bt.querySelector('.bundle-thumb');
          if (of && im) { var s = offerImg(of, curColor); if (s) im.src = s; }
        });
      });
    });
    [].forEach.call(ov.querySelectorAll('.bundle'), function (b) {
      b.addEventListener('click', function () {
        [].forEach.call(ov.querySelectorAll('.bundle'), function (x) { x.classList.remove('on'); });
        b.classList.add('on');
        var id = b.getAttribute('data-offer');
        curOffer = p.offers.filter(function (o) { return String(o.id) === String(id); })[0] || p.offers[0];
        var t = ov.querySelector('.oc-total'); if (t) t.textContent = money(curOffer.price);
      });
    });
    ov.querySelector('.offer-cta').addEventListener('click', function () {
      if (!window.Cart) {
        var qs = new URLSearchParams(window.location.search);
        qs.set('p', slug); qs.set('color', curColor); qs.set('offer', curOffer.id);
        window.location.href = '/checkout.html?' + qs.toString(); return;
      }
      window.Cart.add({
        slug: slug, offer: String(curOffer.id), color: curColor,
        name: curOffer.name, variant: (colors.length ? curColor : ''),
        img: offerImg(curOffer, curColor) || (p.gallery[0] && p.gallery[0].src) || '',
        price: curOffer.price, was: curOffer.was || 0, qty: 1
      });
      close();
      window.Cart.open();
    });
  })();

  /* ---------- "Compre 1 Lleve 2" — elige 2 colores (only for products with p.bogo) ---------- */
  (function () {
    if (!p.bogo) return;
    var colors = p.colors || [];
    if (!colors.length) return;
    var pick1 = colors[0].name;
    var pick2 = (colors[1] || colors[0]).name;

    /* Combinaciones del 2×1: cada tarjeta usa una imagen REAL de la galería.
       2 colores -> 3 combos (1 de cada / 2×A / 2×B); la imagen "ambos colores" sale de gallery[0]. */
    var combos;
    if (p.bogo.combos) {
      combos = p.bogo.combos;
    } else if (colors.length >= 2) {
      var bothImg = p.bogo.comboImg || (p.gallery[0] && p.gallery[0].src) || colors[0].img;
      combos = [
        { c1: colors[0].name, c2: colors[1].name, img: bothImg, title: '1 de cada color', sub: colors[0].name + ' + ' + colors[1].name, badge: 'Más elegido' },
        { c1: colors[0].name, c2: colors[0].name, img: colors[0].img, title: '2 × ' + colors[0].name, sub: 'Ambas del mismo color' },
        { c1: colors[1].name, c2: colors[1].name, img: colors[1].img, title: '2 × ' + colors[1].name, sub: 'Ambas del mismo color' }
      ];
    } else {
      combos = [{ c1: colors[0].name, c2: colors[0].name, img: colors[0].img, title: '2 × ' + colors[0].name, sub: '' }];
    }
    var sel = combos[0];
    pick1 = sel.c1; pick2 = sel.c2;

    var css = document.createElement('style');
    css.textContent =
      '.offer-ov{position:fixed;inset:0;z-index:80;background:rgba(0,0,0,.5);opacity:0;pointer-events:none;transition:opacity .25s;}' +
      '.offer-ov.on{opacity:1;pointer-events:auto;}' +
      '.offer-sheet{position:absolute;left:50%;bottom:0;transform:translateX(-50%) translateY(100%);width:100%;max-width:var(--maxw);background:#fff;border-radius:18px 18px 0 0;padding:14px 16px calc(16px + env(safe-area-inset-bottom));transition:transform .28s cubic-bezier(.4,1.2,.4,1);max-height:90vh;overflow-y:auto;}' +
      '.offer-ov.on .offer-sheet{transform:translateX(-50%) translateY(0);}' +
      '.offer-grab{width:38px;height:4px;border-radius:3px;background:#e2e2e5;margin:2px auto 12px;}' +
      '.offer-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;}' +
      '.offer-title{font-size:17px;font-weight:800;color:var(--ink);}' +
      '.offer-x{width:28px;height:28px;border:none;background:var(--gap);border-radius:50%;font-size:15px;color:var(--ink-2);cursor:pointer;line-height:1;}' +
      '.offer-lbl{font-size:13px;color:var(--ink-2);margin-bottom:14px;}' +
      '.bogo-unit{margin-bottom:16px;}' +
      '.bogo-utitle{font-size:13px;font-weight:800;color:var(--ink);margin-bottom:8px;}' +
      '.color-opts{display:flex;gap:8px;flex-wrap:wrap;}' +
      '.color-opt{display:flex;align-items:center;gap:8px;border:1.5px solid var(--line);border-radius:12px;padding:7px 12px 7px 8px;background:#fff;cursor:pointer;transition:border-color .15s,background .15s;}' +
      '.color-opt.on{border-color:var(--red);background:#fff5f7;}' +
      '.color-opt .color-dot{width:24px;height:24px;border-radius:50%;flex:0 0 auto;box-shadow:inset 0 0 0 1px rgba(0,0,0,.14);background-size:cover;background-position:center;}' +
      '.color-opt span{font-size:14px;font-weight:600;color:var(--ink);}' +
      '.offer-cta{width:100%;border:none;border-radius:999px;padding:15px;background:var(--red);color:#fff;font-size:16px;font-weight:800;cursor:pointer;margin-top:6px;box-shadow:0 8px 22px rgba(254,44,85,.3);}' +
      '.offer-cta:active{filter:brightness(.95);}' +
      '.bogo-strip{margin:14px 0 2px;background:linear-gradient(135deg,#e9202f,#ff6b8a);color:#fff;border-radius:14px;padding:12px 14px;display:flex;align-items:center;gap:11px;cursor:pointer;box-shadow:0 8px 20px rgba(254,44,85,.28);}' +
      '.bogo-strip .tag{background:#fff;color:#e9202f;border-radius:8px;padding:4px 9px;font-size:14px;font-weight:900;letter-spacing:.3px;white-space:nowrap;line-height:1;}' +
      '.bogo-strip-txt{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px;}' +
      '.bogo-strip-txt b{font-size:14.5px;font-weight:800;line-height:1.15;}' +
      '.bogo-strip-txt small{font-size:11.5px;font-weight:600;opacity:.92;line-height:1.2;}' +
      '.bogo-strip-arrow{font-size:22px;font-weight:700;opacity:.85;flex:0 0 auto;line-height:1;}' +
      '.bogo-combos{display:flex;flex-direction:column;gap:10px;margin-bottom:14px;}' +
      '.combo{position:relative;display:flex;align-items:center;gap:12px;width:100%;text-align:left;border:1.5px solid var(--line);border-radius:14px;padding:10px 12px;background:#fff;cursor:pointer;transition:border-color .15s,box-shadow .15s;}' +
      '.combo.on{border-color:var(--red);box-shadow:0 0 0 3px #fff0f3;}' +
      '.combo-radio{width:20px;height:20px;border-radius:50%;border:2px solid #cfd0d4;flex:0 0 auto;position:relative;transition:border-color .15s;}' +
      '.combo.on .combo-radio{border-color:var(--red);}' +
      '.combo.on .combo-radio::after{content:"";position:absolute;inset:3px;border-radius:50%;background:var(--red);}' +
      '.combo-img{width:58px;height:58px;object-fit:contain;border-radius:10px;background:var(--gap);flex:0 0 auto;}' +
      '.combo-info{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px;}' +
      '.combo-title{font-size:14.5px;font-weight:700;color:var(--ink);line-height:1.25;}' +
      '.combo-sub{font-size:12.5px;color:var(--ink-2);line-height:1.2;}' +
      '.combo-badge{position:absolute;top:-9px;right:12px;background:var(--red);color:#fff;font-size:10px;font-weight:800;padding:2px 8px;border-radius:20px;letter-spacing:.3px;}' +
      '.bogo-free{display:flex;align-items:center;gap:6px;background:#fff0f3;color:#c31742;border:1px solid #ffd9e2;border-radius:11px;padding:9px 12px;font-size:12.5px;font-weight:600;margin-bottom:12px;}';
    document.head.appendChild(css);

    function dotStyle(c) { return c.img ? ('background-image:url(' + c.img + ')') : ('background:' + (c.sw || '#ccc')); }
    function colorRow(group, sel) {
      return colors.map(function (c) {
        return '<button type="button" class="color-opt' + (c.name === sel ? ' on' : '') + '" data-group="' + group + '" data-color="' + esc(c.name) + '">' +
          '<span class="color-dot" style="' + dotStyle(c) + '"></span><span>' + esc(c.name) + '</span></button>';
      }).join('');
    }

    /* franja promocional visible en la página */
    var strip = document.createElement('div');
    strip.className = 'bogo-strip';
    strip.innerHTML = '<span class="tag">2×1</span>' +
      '<span class="bogo-strip-txt"><b>' + esc(p.bogo.title) + '</b><small>' + esc(p.bogo.stripSub || '2 unidades por el precio de 1 · elige los colores') + '</small></span>' +
      '<span class="bogo-strip-arrow">&rsaquo;</span>';
    var anchor = document.querySelector('.rating');
    if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(strip, anchor.nextSibling);

    var ov = document.createElement('div');
    ov.className = 'offer-ov';
    ov.innerHTML =
      '<div class="offer-sheet" role="dialog" aria-label="' + esc(p.bogo.title) + '">' +
        '<div class="offer-grab"></div>' +
        '<div class="offer-head"><span class="offer-title">' + esc(p.bogo.title) + '</span><button class="offer-x" aria-label="Cerrar">&#10005;</button></div>' +
        '<div class="offer-lbl">' + esc(p.bogo.sub || '') + '</div>' +
        '<div class="bogo-combos">' + combos.map(function (co, i) {
          return '<button type="button" class="combo' + (i === 0 ? ' on' : '') + '" data-i="' + i + '">' +
            '<span class="combo-radio"></span>' +
            '<img class="combo-img" src="' + (co.img || '') + '" alt="" loading="lazy">' +
            '<span class="combo-info"><span class="combo-title">' + esc(co.title) + '</span><span class="combo-sub">' + esc(co.sub || '') + '</span></span>' +
            (co.badge ? '<span class="combo-badge">' + esc(co.badge) + '</span>' : '') +
          '</button>';
        }).join('') + '</div>' +
        '<div class="bogo-free">🎁&nbsp;<span>La 2ª unidad va <b>gratis</b> — pagas ' + money(p.price) + ' por las 2 unidades.</span></div>' +
        '<button type="button" class="offer-cta">' + esc(p.bogo.cta || 'Continuar') + ' &middot; ' + money(p.price) + '</button>' +
      '</div>';
    document.body.appendChild(ov);

    function open() { ov.classList.add('on'); document.body.style.overflow = 'hidden'; }
    function close() { ov.classList.remove('on'); document.body.style.overflow = ''; }

    [].forEach.call(document.querySelectorAll('.bottom-bar a, .bottom-bar button'), function (el) {
      el.addEventListener('click', function (e) { e.preventDefault(); open(); });
    });
    strip.addEventListener('click', open);
    ov.querySelector('.offer-x').addEventListener('click', close);
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });

    [].forEach.call(ov.querySelectorAll('.combo'), function (b) {
      b.addEventListener('click', function () {
        [].forEach.call(ov.querySelectorAll('.combo'), function (x) { x.classList.remove('on'); });
        b.classList.add('on');
        sel = combos[+b.getAttribute('data-i')] || combos[0];
        pick1 = sel.c1; pick2 = sel.c2;
      });
    });
    ov.querySelector('.offer-cta').addEventListener('click', function () {
      if (!window.Cart) {
        var qs = new URLSearchParams(window.location.search);
        qs.set('p', slug); qs.set('color', pick1); qs.set('color2', pick2); qs.set('bogo', '1');
        window.location.href = '/checkout.html?' + qs.toString(); return;
      }
      function ci(name) { for (var i = 0; i < colors.length; i++) { if (colors[i].name === name) return colors[i].img || ''; } return ''; }
      window.Cart.add({
        slug: slug, offer: 'bogo', color: pick1 + '+' + pick2,
        name: (p.shortName || p.title) + ' — Compre 1 Lleve 2',
        variant: '🎁 2 unidades: ' + pick1 + ' + ' + pick2,
        img: (sel && sel.img) || ci(pick1) || (p.gallery[0] && p.gallery[0].src) || '',
        price: p.price, was: p.was || 0, qty: 1, bogo: 1, color2: pick2
      });
      close();
      window.Cart.open();
    });
  })();

  /* ---------- productos SIN offers ni bogo: bottom-bar agrega base al carrito ---------- */
  (function () {
    if ((p.offers && p.offers.length) || p.bogo) return;
    function baseImg() { for (var i = 0; i < (p.colors || []).length; i++) { if (p.colors[i].name === chosenColor) return p.colors[i].img || ''; } return (p.gallery[0] && p.gallery[0].src) || ''; }
    [].forEach.call(document.querySelectorAll('.bottom-bar a, .bottom-bar button'), function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        if (!window.Cart) { window.location.href = checkoutHref(); return; }
        window.Cart.add({
          slug: slug, offer: '', color: chosenColor,
          name: p.shortName || p.title, variant: (p.colors && p.colors.length ? chosenColor : ''),
          img: baseImg(), price: p.price, was: p.was || 0, qty: 1
        });
        window.Cart.open();
      });
    });
  })();
})();
