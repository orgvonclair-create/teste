/* Envio de eventos do funil para o painel (checkout_started / upsell_reached). */
(function () {
  var ENDPOINT = '/api/public/events';

  function sessionId() {
    try {
      var k = 'ff-session-id';
      var v = localStorage.getItem(k);
      if (!v) {
        v = 's-' + Date.now() + '-' + Math.random().toString(36).slice(2, 10);
        localStorage.setItem(k, v);
      }
      return v;
    } catch (e) {
      return null;
    }
  }

  function order() {
    try {
      return JSON.parse(localStorage.getItem('foldease-order') || 'null');
    } catch (e) {
      return null;
    }
  }

  function trackFunnelEvent(name, extra) {
    try {
      var o = order() || {};
      var sp = new URLSearchParams(location.search);
      var payload = {
        event_name: name,
        session_id: sessionId(),
        customer_email: o.email || null,
        customer_name: o.nombre || null,
        product: o.producto || null,
        amount: Number(o.total) || 0,
        currency: 'ARS',
        country: o.estado || null,
        utm_source: sp.get('utm_source'),
        utm_campaign: sp.get('utm_campaign'),
        site: 'ttshop-arg'
      };
      if (extra) {
        for (var k in extra) if (extra[k] !== undefined) payload[k] = extra[k];
      }
      fetch(ENDPOINT, {
        method: 'POST',
        keepalive: true,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(function () {});
    } catch (e) {}
  }

  function once(name) {
    try {
      var k = 'ff-ev-' + name + '-' + (sessionId() || '') + '-' + new Date().toISOString().slice(0, 10);
      if (localStorage.getItem(k)) return false;
      localStorage.setItem(k, '1');
    } catch (e) {}
    return true;
  }

  window.trackFunnelEvent = trackFunnelEvent;
  window.trackFunnelEventOnce = function (name, extra) {
    if (once(name)) trackFunnelEvent(name, extra);
  };
})();
