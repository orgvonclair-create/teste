/* =========================================================================
   CARRITO (cart) — estado en localStorage + drawer + badge. Genérico:
   sirve a mx-ttshop-2 (multi-producto) y a mesa-mx (producto único).
   Un ítem: { key, slug, offer, color, name, variant, img, price, was, qty }
   El total del carrito ES el monto que se cobra (Clip/SPEI) y se sincroniza
   en el checkout, Supabase y Google Ads.
   ========================================================================= */
(function () {
  var KEY = 'ttk-cart', MAXQ = 10;
  var listeners = [];

  function read() { try { return JSON.parse(localStorage.getItem(KEY) || '[]') || []; } catch (e) { return []; } }
  function write(items) { try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) {} emit(); }
  function emit() {
    var items = read();
    listeners.forEach(function (fn) { try { fn(items); } catch (e) {} });
    paintBadges();
    if (ovEl) renderDrawer();
  }
  function money(n) { return '$' + String(Math.round(Number(n) || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' ARS'; }
  function keyOf(it) { return it.key || (it.slug + '|' + (it.offer || '') + '|' + (it.color || '')); }

  /* ---------- order bump: cross-sell dentro del carrito. Default = armário 2×1;
     un producto lo sobrescribe vía window.CART_BUMP (product-page.js lo toma de P.cartBump). ---------- */
  var BUMP_DEFAULT = {
    slug: 'armario-flexhome', offer: 'bogo', color: 'Negro grafito+Blanco', color2: 'Blanco', bogo: 1,
    name: 'Armario FlexHome de Acero — Compre 1 Lleve 2',
    variant: '🎁 2 unidades: Negro grafito + Blanco',
    img: '/__l5e/assets-v1/9b016f33-21e4-403a-94f1-cb34f82ef0c4/arm-1.png', price: 399, was: 1916,
    tag: '🎁 Compre 1 y llévate 2', hint: 'Oferta 2×1 · solo aquí', badge: '2×1',
    ttl: 'Armario FlexHome de Acero — ¡recibes 2!',
    benef: '4 niveles · Puertas de vidrio · Soporta 200 kg por estante'
  };
  /* soporta 1 o varios bumps: window.CART_BUMPS (array) o window.CART_BUMP (uno) o el default */
  function getBumps() {
    if (window.CART_BUMPS) return window.CART_BUMPS;   /* array vacío = producto sin bump */
    if (window.CART_BUMP) return [window.CART_BUMP];
    return [BUMP_DEFAULT];
  }
  function bumpCardHtml(B) {
    var badge = B.badge ? (/^\s*\d+\s*×\s*\d+\s*$/.test(B.badge) ? '<span class="cb-2x1">' + B.badge + '</span>' : '<span class="cb-off">' + B.badge + '</span>') : '';
    return '<div class="cart-bump">' +
        '<div class="cb-top"><span class="cb-hint">' + B.hint + '</span></div>' +
        '<div class="cb-main">' +
          '<img class="cb-thumb" src="' + B.img + '" alt="">' +
          '<div class="cb-info">' +
            '<div class="cb-name">' + B.ttl + '</div>' +
            '<div class="cb-benef">' + B.benef + '</div>' +
            '<div class="cb-price"><span class="cb-now">' + money(B.price) + '</span>' + (B.was ? '<span class="cb-was">' + money(B.was) + '</span>' : '') + badge + '</div>' +
          '</div>' +
        '</div>' +
        '<button type="button" class="cb-add" data-act="bump" data-bump="' + B.slug + '">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>' +
          'Agregar a mi pedido' +
        '</button>' +
      '</div>';
  }
  function bumpsHtml() {
    var items = read();
    var cards = getBumps().filter(function (B) {
      return B && B.slug && !items.some(function (it) { return it.slug === B.slug; });
    }).map(bumpCardHtml).join('');
    if (!cards) return '';
    return '<div class="cart-bump-sep"><span>Puede que te guste</span></div>' + cards;
  }

  var Cart = {
    items: read,
    count: function () { return read().reduce(function (a, i) { return a + (i.qty || 1); }, 0); },
    lines: function () { return read().length; },
    subtotal: function () { return read().reduce(function (a, i) { return a + (Number(i.price) || 0) * (i.qty || 1); }, 0); },
    add: function (item) {
      var items = read(), key = keyOf(item); item.key = key;
      var found = null;
      for (var i = 0; i < items.length; i++) { if (items[i].key === key) { found = items[i]; break; } }
      if (found) { found.qty = Math.min(MAXQ, (found.qty || 1) + (item.qty || 1)); }
      else { item.qty = Math.min(MAXQ, item.qty || 1); items.push(item); }
      write(items);
    },
    setQty: function (key, qty) {
      var items = read();
      for (var i = 0; i < items.length; i++) { if (items[i].key === key) { items[i].qty = Math.max(1, Math.min(MAXQ, qty)); break; } }
      write(items);
    },
    remove: function (key) { write(read().filter(function (i) { return i.key !== key; })); },
    clear: function () { write([]); },
    onChange: function (fn) { listeners.push(fn); },
    open: openDrawer, close: closeDrawer, money: money, MAXQ: MAXQ
  };
  window.Cart = Cart;

  /* ---------- badge en el ícono .cart-ico ---------- */
  function paintBadges() {
    var c = Cart.count();
    [].forEach.call(document.querySelectorAll('.cart-ico'), function (el) {
      var b = el.querySelector('.cart-badge');
      if (!b) { b = document.createElement('span'); b.className = 'cart-badge'; el.appendChild(b); if (getComputedStyle(el).position === 'static') el.style.position = 'relative'; }
      b.textContent = c > 9 ? '9+' : String(c);
      b.style.display = c > 0 ? '' : 'none';
    });
  }

  /* ---------- drawer ---------- */
  var ovEl = null, drawerEl = null;
  function buildDrawer() {
    var css = document.createElement('style');
    css.textContent =
      '.cart-badge{position:absolute;top:-6px;right:-6px;min-width:17px;height:17px;padding:0 4px;border-radius:9px;background:#e9202f;color:#fff;font-size:11px;font-weight:800;line-height:17px;text-align:center;box-shadow:0 0 0 2px #fff;}' +
      '.cart-ov{position:fixed;inset:0;z-index:90;background:rgba(0,0,0,.5);opacity:0;pointer-events:none;transition:opacity .25s;}' +
      '.cart-ov.on{opacity:1;pointer-events:auto;}' +
      '.cart-drawer{position:absolute;top:0;right:0;height:100%;width:100%;max-width:400px;background:#f5f5f7;display:flex;flex-direction:column;transform:translateX(100%);transition:transform .3s cubic-bezier(.4,0,.2,1);}' +
      '.cart-ov.on .cart-drawer{transform:translateX(0);}' +
      '.cart-hd{display:flex;align-items:center;justify-content:space-between;padding:16px 18px;background:#fff;border-bottom:1px solid #ececee;}' +
      '.cart-hd h3{font-size:17px;font-weight:800;color:#161820;margin:0;}' +
      '.cart-x{width:30px;height:30px;border:none;background:#f0f0f2;border-radius:50%;font-size:16px;color:#4b5563;cursor:pointer;line-height:1;}' +
      '.cart-body{flex:1;overflow-y:auto;padding:14px;}' +
      '.cart-empty{text-align:center;color:#9ca3af;font-size:14px;padding:48px 16px;}' +
      '.cart-item{display:flex;gap:12px;background:#fff;border-radius:14px;padding:12px;margin-bottom:10px;box-shadow:0 1px 3px rgba(0,0,0,.05);}' +
      '.cart-item .ci-thumb{width:62px;height:62px;object-fit:contain;border-radius:10px;background:#f5f5f7;flex:0 0 auto;}' +
      '.cart-item .ci-info{flex:1;min-width:0;}' +
      '.cart-item .ci-name{font-size:13.5px;font-weight:700;color:#161820;line-height:1.3;margin-bottom:2px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}' +
      '.cart-item .ci-var{font-size:12px;color:#9ca3af;margin-bottom:6px;}' +
      '.cart-item .ci-row{display:flex;align-items:center;justify-content:space-between;}' +
      '.cart-item .ci-price{font-size:15px;font-weight:800;color:#e9202f;}' +
      '.cart-item .ci-price s{color:#c9ccd3;font-weight:500;font-size:11.5px;margin-left:4px;}' +
      '.ci-stepper{display:flex;align-items:center;gap:0;border:1px solid #e2e2e5;border-radius:9px;overflow:hidden;}' +
      '.ci-stepper button{width:28px;height:28px;border:none;background:#fff;color:#161820;font-size:16px;cursor:pointer;line-height:1;}' +
      '.ci-stepper button:active{background:#f0f0f2;}' +
      '.ci-stepper span{min-width:26px;text-align:center;font-size:13px;font-weight:700;color:#161820;}' +
      '.ci-del{border:none;background:none;color:#c0c4ce;cursor:pointer;padding:4px;margin-left:4px;}' +
      '.ci-del svg{width:16px;height:16px;display:block;}' +
      '.cart-ft{background:#fff;border-top:1px solid #ececee;padding:16px 18px calc(16px + env(safe-area-inset-bottom));}' +
      '.cart-sub{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;}' +
      '.cart-sub .lab{font-size:14px;color:#4b5563;}' +
      '.cart-sub .val{font-size:20px;font-weight:800;color:#161820;}' +
      '.cart-go{display:block;width:100%;border:none;border-radius:999px;padding:15px;background:#e9202f;color:#fff;font-size:16px;font-weight:800;cursor:pointer;text-align:center;text-decoration:none;box-shadow:0 8px 22px rgba(254,44,85,.3);}' +
      '.cart-go.off{opacity:.5;pointer-events:none;}' +
      '.cart-protect{display:flex;align-items:center;gap:11px;background:#f7f8fa;border:1px solid #ececee;border-radius:14px;padding:11px 12px;margin-bottom:14px;}' +
      '.cp-img{width:44px;height:44px;object-fit:contain;flex:0 0 auto;}' +
      '.cp-info{flex:1;min-width:0;}' +
      '.cp-top{display:flex;align-items:baseline;gap:8px;justify-content:space-between;}' +
      '.cp-name{font-size:13.5px;font-weight:800;color:#161820;}' +
      '.cp-price{font-size:13px;font-weight:800;color:#161820;flex:0 0 auto;}' +
      '.cp-desc{font-size:11.5px;color:#8a8f98;line-height:1.35;margin-top:3px;}' +
      '.cp-toggle{flex:0 0 auto;width:44px;height:26px;border-radius:999px;border:none;background:#d1d5db;cursor:pointer;position:relative;transition:background .2s;padding:0;}' +
      '.cp-toggle.on{background:#16a34a;}' +
      '.cp-knob{position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:#fff;transition:transform .2s;box-shadow:0 1px 3px rgba(0,0,0,.25);}' +
      '.cp-toggle.on .cp-knob{transform:translateX(18px);}' +
      '.cart-keep{display:block;width:100%;border:none;background:none;color:#9ca3af;font-size:13.5px;font-weight:600;cursor:pointer;padding:12px 0 2px;text-align:center;}' +
      '.cart-bump-sep{display:flex;align-items:center;gap:10px;margin:16px 2px 10px;color:#9ca3af;font-size:11.5px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;}' +
      '.cart-bump-sep::before,.cart-bump-sep::after{content:"";flex:1;height:1px;background:#ececee;}' +
      '.cart-bump{background:linear-gradient(180deg,#ffffff,#fff5f7);border:1.5px solid #ffd0dc;border-radius:16px;padding:12px;margin:2px 0 4px;box-shadow:0 4px 16px rgba(254,44,85,.09);animation:cbIn .3s ease both;}' +
      '@keyframes cbIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:none;}}' +
      '.cb-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:11px;}' +
      '.cb-tag{display:inline-flex;align-items:center;gap:5px;background:#e9202f;color:#fff;font-size:10.5px;font-weight:800;padding:4px 9px;border-radius:999px;letter-spacing:.3px;text-transform:uppercase;box-shadow:0 4px 10px rgba(254,44,85,.28);}' +
      '.cb-hint{font-size:10.5px;color:#c14a63;font-weight:700;}' +
      '.cb-main{display:flex;gap:11px;align-items:center;}' +
      '.cb-thumb{width:58px;height:58px;object-fit:contain;border-radius:11px;background:#fff;border:1px solid #f3dde3;flex:0 0 auto;}' +
      '.cb-info{flex:1;min-width:0;}' +
      '.cb-name{font-size:13.5px;font-weight:800;color:#161820;line-height:1.25;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}' +
      '.cb-benef{font-size:11px;color:#95737b;margin:3px 0 6px;line-height:1.3;}' +
      '.cb-price{display:flex;align-items:baseline;gap:7px;flex-wrap:wrap;}' +
      '.cb-now{font-size:16px;font-weight:900;color:#e9202f;letter-spacing:-.02em;}' +
      '.cb-was{font-size:11.5px;color:#c9ccd3;text-decoration:line-through;}' +
      '.cb-off{background:#fde3ea;color:#d81f45;font-size:10px;font-weight:800;padding:2px 6px;border-radius:6px;align-self:center;}' +
      '.cb-2x1{background:#e9202f;color:#fff;font-size:11px;font-weight:900;padding:2px 8px;border-radius:6px;letter-spacing:.5px;align-self:center;box-shadow:0 3px 8px rgba(254,44,85,.3);}' +
      '.cb-add{display:flex;align-items:center;justify-content:center;gap:7px;width:100%;margin-top:11px;border:none;border-radius:11px;padding:11px;background:#e9202f;color:#fff;font-size:14px;font-weight:800;cursor:pointer;box-shadow:0 6px 15px rgba(254,44,85,.26);transition:transform .08s;}' +
      '.cb-add:active{transform:scale(.98);}' +
      '.cb-add svg{width:17px;height:17px;flex:0 0 auto;}';
    document.head.appendChild(css);

    ovEl = document.createElement('div'); ovEl.className = 'cart-ov'; ovEl.id = 'cart-ov';
    ovEl.innerHTML =
      '<div class="cart-drawer" role="dialog" aria-label="Carrito">' +
        '<div class="cart-hd"><h3>Tu carrito (<span id="cart-hd-n">0</span>)</h3><button class="cart-x" aria-label="Cerrar">&#10005;</button></div>' +
        '<div class="cart-body" id="cart-body"></div>' +
        '<div class="cart-ft">' +
            '<div class="cart-protect" id="cart-protect">' +
            '<img class="cp-img" src="/__l5e/assets-v1/e412a84c-4e3a-449a-bd62-856f47502847/protecao-envio-checkout.png" alt="Protección de envío">' +
            '<div class="cp-info">' +
              '<div class="cp-top"><span class="cp-name">Protecci\u00f3n de Env\u00edo</span><span class="cp-price">$3.000 ARS</span></div>' +
              '<div class="cp-desc">Protege tu pedido contra da\u00f1os, p\u00e9rdidas o robo durante el env\u00edo.</div>' +
            '</div>' +
            '<button class="cp-toggle on" id="cp-toggle" type="button" role="switch" aria-checked="true"><span class="cp-knob"></span></button>' +
          '</div>' +
        '<div class="cart-sub"><span class="lab">Total</span><span class="val" id="cart-sub-val">$0 ARS</span></div>' +
          '<a class="cart-go" id="cart-go" href="#">Ir a pagar</a>' +
          '<button class="cart-keep" type="button" id="cart-keep">Seguir comprando</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(ovEl);
    drawerEl = ovEl.querySelector('.cart-drawer');

    ovEl.addEventListener('click', function (e) { if (e.target === ovEl) closeDrawer(); });
    ovEl.querySelector('.cart-x').addEventListener('click', closeDrawer);
    ovEl.querySelector('#cart-keep').addEventListener('click', closeDrawer);
    ovEl.querySelector('#cart-go').addEventListener('click', function (e) {
      e.preventDefault();
      if (!Cart.count()) return;
      var url = '/checkout.html' + (window.location.search || '');
      if (typeof window.getUrlWithUtm === 'function') { try { url = window.getUrlWithUtm('/checkout.html'); } catch (x) {} }
      window.location.href = url;
    });
    var cpt = ovEl.querySelector('#cp-toggle');
    if (cpt) cpt.addEventListener('click', function () {
      try { localStorage.setItem('ttk-protect', protectOn() ? '0' : '1'); } catch (e) {}
      emit();
    });
    /* delegación: steppers y eliminar */
    ovEl.querySelector('#cart-body').addEventListener('click', function (e) {
      var btn = e.target.closest('[data-act]'); if (!btn) return;
      var key = btn.getAttribute('data-key'), act = btn.getAttribute('data-act');
      if (act === 'bump') { var bs = btn.getAttribute('data-bump'); var B = getBumps().filter(function (b) { return b.slug === bs; })[0] || getBumps()[0]; if (B) Cart.add({ slug: B.slug, offer: B.offer, color: B.color, name: B.name, variant: B.variant, img: B.img, price: B.price, was: B.was, qty: 1, bogo: B.bogo, color2: B.color2 }); return; }
      var items = read(), it = null;
      for (var i = 0; i < items.length; i++) { if (items[i].key === key) { it = items[i]; break; } }
      if (!it) return;
      if (act === 'inc') Cart.setQty(key, (it.qty || 1) + 1);
      else if (act === 'dec') Cart.setQty(key, (it.qty || 1) - 1);
      else if (act === 'del') Cart.remove(key);
    });
  }

  function protectOn() { try { return localStorage.getItem('ttk-protect') !== '0'; } catch (e) { return true; } }
  function protectAmt() { return (read().length && protectOn()) ? 3000 : 0; }
  function renderDrawer() {
    if (!ovEl) return;
    var items = read(), body = ovEl.querySelector('#cart-body');
    ovEl.querySelector('#cart-hd-n').textContent = Cart.count();
    ovEl.querySelector('#cart-sub-val').textContent = money(Cart.subtotal() + protectAmt());
    var pr = ovEl.querySelector('#cart-protect'); if (pr) pr.style.display = items.length ? 'flex' : 'none';
    var pt = ovEl.querySelector('#cp-toggle'); if (pt) { pt.classList.toggle('on', protectOn()); pt.setAttribute('aria-checked', protectOn() ? 'true' : 'false'); }
    var go = ovEl.querySelector('#cart-go'); if (go) go.classList.toggle('off', !items.length);
    if (!items.length) { body.innerHTML = '<div class="cart-empty">Tu carrito está vacío.</div>'; return; }
    body.innerHTML = items.map(function (it) {
      var was = it.was ? ' <s>' + money(it.was) + '</s>' : '';
      return '<div class="cart-item">' +
        (it.img ? '<img class="ci-thumb" src="' + it.img + '" alt="">' : '') +
        '<div class="ci-info">' +
          '<div class="ci-name">' + (it.name || 'Producto') + '</div>' +
          (it.variant ? '<div class="ci-var">' + it.variant + '</div>' : '') +
          '<div class="ci-row">' +
            '<span class="ci-price">' + money(it.price) + was + '</span>' +
            '<span style="display:flex;align-items:center;">' +
              '<span class="ci-stepper">' +
                '<button type="button" data-act="dec" data-key="' + it.key + '" aria-label="Menos">&minus;</button>' +
                '<span>' + (it.qty || 1) + '</span>' +
                '<button type="button" data-act="inc" data-key="' + it.key + '" aria-label="Más">+</button>' +
              '</span>' +
              '<button type="button" class="ci-del" data-act="del" data-key="' + it.key + '" aria-label="Eliminar">' +
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>' +
              '</button>' +
            '</span>' +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('') + bumpsHtml();
  }

  function openDrawer() { if (!ovEl) buildDrawer(); renderDrawer(); requestAnimationFrame(function () { ovEl.classList.add('on'); }); document.body.style.overflow = 'hidden'; }
  function closeDrawer() { if (ovEl) ovEl.classList.remove('on'); document.body.style.overflow = ''; }

  /* ---------- ícono del carrito abre el drawer ---------- */
  function wireIcon() {
    [].forEach.call(document.querySelectorAll('.cart-ico'), function (el) {
      if (el.getAttribute('data-cart-wired')) return;
      el.setAttribute('data-cart-wired', '1');
      el.style.cursor = 'pointer';
      el.addEventListener('click', function (e) { e.preventDefault(); openDrawer(); });
    });
  }

  function init() { paintBadges(); wireIcon(); }
  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
