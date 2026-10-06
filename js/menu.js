// Menu a hamburger, uguale su ogni pagina: le voci cambiano in base a dove ci si trova.
(function () {
  if (location.pathname.replace(/index\.html$/, '').replace(/\/+$/, '') === '') return;   // nella home il menu non serve
  var p = location.pathname.replace(/index\.html$/, '').replace(/\/+$/, '') || '/';
  var VOCI = {
    carrello: { href: '/', testo: 'Torna alla home' },
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
  else elenco = ['carrello', 'tutti', 'chi', 'cosa'];

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
    return '<li style="--i:' + i + '"><a href="' + v.href + '" tabindex="-1">' + '<span>' + v.testo + '</span>' + FRECCIA + '</a></li>';
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
