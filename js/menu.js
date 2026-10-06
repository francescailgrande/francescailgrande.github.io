// Menu a hamburger, uguale su ogni pagina: le voci cambiano in base a dove ci si trova.
(function () {
  if (location.pathname.replace(/index\.html$/, '').replace(/\/+$/, '') === '') return;   // nella home il menu non serve
  var p = location.pathname.replace(/index\.html$/, '').replace(/\/+$/, '') || '/';
  var VOCI = {
    carrello: { href: '/', testo: 'Torna al carrello', icona: true },
    lavori: { href: '/lavori', testo: 'I miei lavori' },
    tutti: { href: '/lavori', testo: 'Tutti i lavori' },
    chi: { href: '/chisono', testo: 'Chi sono' },
    cosa: { href: '/cosafaccio', testo: 'Cosa faccio' }
  };
  var elenco;
  if (p === '/') elenco = ['lavori', 'chi', 'cosa'];
  else if (p === '/chisono') elenco = ['carrello', 'lavori', 'cosa'];
  else if (p === '/cosafaccio') elenco = ['carrello', 'lavori', 'chi'];
  else if (p === '/lavori') elenco = ['carrello', 'chi', 'cosa'];
  else elenco = ['carrello', 'tutti'];

  var CARRELLO = '<svg class="ico-carrello" viewBox="0 0 38 28" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="2.5" width="31" height="23" rx="5.5" stroke-width="1.8"/><rect x="11" y="8.5" width="16" height="11" rx="2.5" stroke-width="1.5"/><path stroke-width="1.1" d="M6.5 5.5 11.5 9M31.5 5.5 26.5 9M6.5 22.5l5-3.5M31.5 22.5 26.5 19M14.5 2.5v6M19 2.5v6M23.5 2.5v6M14.5 19.5v6M19 19.5v6M23.5 19.5v6M3.5 10.5l7.5 1.5M3.5 17.5 11 16M34.5 10.5 27 12M34.5 17.5 27 16M15.5 8.5v11M19 8.5v11M22.5 8.5v11M11 14h16"/></g><rect x=".6" y="9" width="3.4" height="10" rx="1.7" fill="currentColor"/><rect x="34" y="9" width="3.4" height="10" rx="1.7" fill="currentColor"/></svg>';
  var FRECCIA = '<svg class="menu-freccia" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  var btn = document.createElement('button');
  btn.className = 'menu-btn';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Apri il menu');
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-controls', 'menu-pannello');
  btn.innerHTML = '<span></span><span></span>';

  var nav = document.createElement('nav');
  nav.className = 'menu-pannello';
  nav.id = 'menu-pannello';
  nav.setAttribute('aria-label', 'Menu');
  nav.setAttribute('aria-hidden', 'true');
  nav.innerHTML = '<ul>' + elenco.map(function (k, i) {
    var v = VOCI[k];
    return '<li style="--i:' + i + '"><a href="' + v.href + '" tabindex="-1">' + (v.icona ? CARRELLO : '') + '<span>' + v.testo + '</span>' + FRECCIA + '</a></li>';
  }).join('') + '</ul><p class="menu-copy">© Francesca Il Grande</p>';

  document.body.appendChild(nav);
  document.body.appendChild(btn);

  // nelle pagine dei singoli lavori: freccia per tornare a tutti i lavori
  if (/^\/lavori\/.+/.test(p)) {
    var ind = document.createElement('a');
    ind.className = 'menu-indietro';
    ind.href = '/lavori';
    ind.setAttribute('aria-label', 'Torna a tutti i lavori');
    ind.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12H5M11 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    document.body.appendChild(ind);
  }

  var html = document.documentElement;
  function apri(si) {
    btn.classList.toggle('aperto', si);
    nav.classList.toggle('aperto', si);
    html.classList.toggle('menu-aperto', si);
    btn.setAttribute('aria-expanded', si ? 'true' : 'false');
    btn.setAttribute('aria-label', si ? 'Chiudi il menu' : 'Apri il menu');
    nav.setAttribute('aria-hidden', si ? 'false' : 'true');
    Array.prototype.forEach.call(nav.querySelectorAll('a'), function (a) { a.tabIndex = si ? 0 : -1; });
    if (si) { var a = nav.querySelector('a'); if (a) setTimeout(function () { a.focus({ preventScroll: true }); }, 300); }
  }
  btn.addEventListener('click', function () { apri(!nav.classList.contains('aperto')); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('aperto')) { apri(false); btn.focus(); }
  });
  nav.addEventListener('click', function (e) { if (e.target === nav) apri(false); });
})();
