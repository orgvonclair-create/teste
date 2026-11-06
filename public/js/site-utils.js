/* Local helpers + Meta Pixel base code. */
function getUrlWithUtm(url) {
  if (typeof window === 'undefined') return url;
  var current = new URLSearchParams(window.location.search);
  if (!Array.from(current.keys()).length) return url;
  var base = String(url).split('#')[0];
  var hash = String(url).indexOf('#') !== -1 ? '#' + String(url).split('#').slice(1).join('#') : '';
  var parts = base.split('?');
  var path = parts[0];
  var target = new URLSearchParams(parts[1] || '');
  current.forEach(function (value, key) {
    if (!target.has(key)) target.set(key, value);
  });
  var qs = target.toString();
  return path + (qs ? '?' + qs : '') + hash;
}

window.getUrlWithUtm = getUrlWithUtm;

async function uploadReceipt(file, stage, order, total) {
  var prepared = file;
  try { if (window.shrinkReceiptFile) prepared = await window.shrinkReceiptFile(file); } catch (e) {}
  var form = new FormData();
  form.append('file', prepared, prepared.name || file.name || 'comprobante');
  form.append('stage', stage);
  form.append('order', JSON.stringify(order || {}));
  form.append('total', String(Number(total) || 0));
  var query = new URLSearchParams(location.search);
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'ttclid', 'fbclid', 'gclid'].forEach(function (key) {
    var value = query.get(key);
    if (value) form.append(key, value);
  });
  form.append('referrer', document.referrer || '');
  form.append('landing_url', location.href);
  var response = await fetch('/api/public/receipt', { method: 'POST', body: form });
  var payload = null;
  try { payload = await response.json(); } catch (e) {}
  if (!response.ok || !payload || !payload.ok) throw new Error((payload && payload.error) || 'No pudimos enviar el comprobante.');
  return payload;
}

/* Sube el comprobante en cuanto el cliente lo elige, para que "Confirmar" sea instantáneo. */
var receiptJobs = [];
function findJob(file) {
  for (var i = 0; i < receiptJobs.length; i++) if (receiptJobs[i].file === file) return receiptJobs[i];
  return null;
}

window.startReceiptUpload = function (file, stage, order, total) {
  if (!file) return null;
  var existing = findJob(file);
  if (existing) return existing.promise;
  var job = { file: file, promise: null };
  job.promise = uploadReceipt(file, stage, order, total).catch(function (err) {
    for (var i = receiptJobs.length - 1; i >= 0; i--) if (receiptJobs[i] === job) receiptJobs.splice(i, 1);
    throw err;
  });
  job.promise.catch(function () {});
  receiptJobs.push(job);
  if (receiptJobs.length > 4) receiptJobs.shift();
  return job.promise;
};

window.saveReceipt = function (file, stage, order, total) {
  var job = findJob(file);
  if (job) return job.promise;
  return window.startReceiptUpload(file, stage, order, total);
};
window.dataLayer = window.dataLayer || [];
if (typeof window.gtag !== 'function') { window.gtag = function () { window.dataLayer.push(arguments); }; }
/* Meta Pixel base code */
(function (f, b, e, v, n, t, s) {
  if (f.fbq) return;
  n = f.fbq = function () {
    n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
  };
  if (!f._fbq) f._fbq = n;
  n.push = n;
  n.loaded = !0;
  n.version = '2.0';
  n.queue = [];
  t = b.createElement(e);
  t.async = !0;
  t.src = v;
  s = b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t, s);
})(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

/* Inicializa todos os pixels */
fbq('init', '1389819873331788');
fbq('init', '4392270654327305');
fbq('init', '1351942567004426');
fbq('init', '2270535053790516');
fbq('init', '1861333715182864');
fbq('init', '1650638313297540');
fbq('init', '932953569850875');
fbq('track', 'PageView');

/* ---- Meta Pixel: Purchase com dedup por etapa do funil ---- */
(function () {
  var PIXELS = ['1389819873331788', '4392270654327305', '1351942567004426', '2270535053790516', '1861333715182864', '1650638313297540', '932953569850875'];

  function getOrder() {
    try { return JSON.parse(localStorage.getItem('foldease-order') || 'null') || {}; } catch (e) { return {}; }
  }

  function eventId(step) {
    try {
      var k = 'fb-eid-' + step;
      var v = localStorage.getItem(k);
      if (!v) {
        v = step + '-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);
        localStorage.setItem(k, v);
      }
      return v;
    } catch (e) { return step + '-' + Date.now(); }
  }

  function fire(step, value, extra) {
    try {
      var doneKey = 'fb-purchase-' + step;
      var eid = eventId(step);
      try { if (localStorage.getItem(doneKey) === eid) return; } catch (e) {}
      var props = { value: Number(value) || 0, currency: 'ARS', content_name: step };
      if (extra) { for (var k in extra) props[k] = extra[k]; }
      var send = function () {
        if (!window.fbq) return;
        for (var i = 0; i < PIXELS.length; i++) {
          try { fbq('trackSingle', PIXELS[i], 'Purchase', props, { eventID: eid }); } catch (e) {}
        }
      };
      if (window.fbq && window.fbq.loaded) send(); else window.addEventListener('load', send);
      try { localStorage.setItem(doneKey, eid); } catch (e) {}
    } catch (e) {}
  }

  window.trackFbPurchase = fire;
  window.trackFbOrderPurchase = function (step) {
    var o = getOrder();
    fire(step || 'pedido', Number(o.total) || 0, { content_ids: [o.slug || 'armario-flexhome'] });
  };
})();

/* ---- Compresión de comprobantes: fotos de celular pesan 5-12 MB y fallan en 4G ---- */
(function () {
  window.shrinkReceiptFile = function (f) {
    return new Promise(function (resolve) {
      try {
        if (!f) return resolve(f);
        var isImg = (f.type || '').indexOf('image/') === 0;
        if (!isImg || f.size < 300 * 1024) return resolve(f);
        if (typeof createImageBitmap !== 'function' && typeof FileReader !== 'function') return resolve(f);
        var done = false;
        var finish = function (out) { if (!done) { done = true; resolve(out || f); } };
        setTimeout(function () { finish(f); }, 3500);
        var url = URL.createObjectURL(f);
        var img = new Image();
        img.onload = function () {
          try {
            var max = 1280;
            var scale = Math.min(1, max / Math.max(img.width, img.height));
            var w = Math.max(1, Math.round(img.width * scale));
            var h = Math.max(1, Math.round(img.height * scale));
            var c = document.createElement('canvas');
            c.width = w; c.height = h;
            c.getContext('2d').drawImage(img, 0, 0, w, h);
            c.toBlob(function (b) {
              try { URL.revokeObjectURL(url); } catch (e) {}
              if (!b || b.size >= f.size) return finish(f);
              var name = (f.name || 'comprobante').replace(/\.[^.]+$/, '') + '.jpg';
              try { finish(new File([b], name, { type: 'image/jpeg' })); }
              catch (e) { b.name = name; finish(b); }
            }, 'image/jpeg', 0.7);
          } catch (e) { finish(f); }
        };
        img.onerror = function () { try { URL.revokeObjectURL(url); } catch (e) {} finish(f); };
        img.src = url;
      } catch (e) { resolve(f); }
    });
  };
})();
