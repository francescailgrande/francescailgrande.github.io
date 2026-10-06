// Il pulsante WhatsApp in basso a destra apre una mini finestra: solo il pulsante dentro la finestra porta al link.
(function () {
  var apri = document.querySelector('a.whatsapp');
  if (!apri) return;
  var link = apri.getAttribute('href');
  var html = document.documentElement;

  var ICONA = '<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false"><circle cx="24" cy="24" r="24" class="wa-cerchio"/><path d="M24 10.5a13 13 0 1 1-6.6 24.2L11 36.5l1.9-6.2A13 13 0 0 1 24 10.5z" fill="none" stroke-width="2.4" stroke-linejoin="round" class="wa-bolla"/><path transform="translate(16.2 15.4) scale(.62)" class="wa-cornetta" d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>';
  var FRECCIA = '<svg class="wa-freccia" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  var velo = document.createElement('div');
  velo.className = 'wa-velo';
  velo.setAttribute('role', 'dialog');
  velo.setAttribute('aria-modal', 'true');
  velo.setAttribute('aria-label', 'Contattami su WhatsApp');
  velo.setAttribute('aria-hidden', 'true');
  velo.innerHTML =
    '<div class="wa-finestra">' +
      '<button type="button" class="wa-chiudi" aria-label="Chiudi" tabindex="-1"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg></button>' +
      '<a class="wa-btn" href="' + link + '" target="_blank" rel="noopener" tabindex="-1">' +
        '<span class="wa-icona">' + ICONA + '</span>' +
        '<span class="wa-testi"><span class="wa-titolo">WhatsApp</span><span class="wa-sotto">Contattami!' + FRECCIA + '</span></span>' +
      '</a>' +
    '</div>';
  document.body.appendChild(velo);

  var finestra = velo.querySelector('.wa-finestra');
  var btn = velo.querySelector('.wa-btn');
  var chiudi = velo.querySelector('.wa-chiudi');
  var aperto = false;

  function posiziona() {
    // la finestra "esce" dal pulsante in basso a destra: parte da li' e si ingrandisce
    var b = apri.getBoundingClientRect();
    var f = finestra.getBoundingClientRect();
    var prima = finestra.style.transform;
    finestra.style.setProperty('--dx', (b.left + b.width / 2 - (f.left + f.width / 2)) + 'px');
    finestra.style.setProperty('--dy', (b.top + b.height / 2 - (f.top + f.height / 2)) + 'px');
  }

  function imposta(si) {
    aperto = si;
    if (si) posiziona();
    velo.classList.toggle('aperto', si);
    html.classList.toggle('wa-aperto', si);
    velo.setAttribute('aria-hidden', si ? 'false' : 'true');
    btn.tabIndex = si ? 0 : -1;
    chiudi.tabIndex = si ? 0 : -1;
    if (si) setTimeout(function () { btn.focus({ preventScroll: true }); }, 350);
    else apri.focus({ preventScroll: true });
  }

  apri.addEventListener('click', function (e) { e.preventDefault(); imposta(true); });
  chiudi.addEventListener('click', function () { imposta(false); });
  velo.addEventListener('click', function (e) { if (e.target === velo) imposta(false); });
  btn.addEventListener('click', function () { setTimeout(function () { imposta(false); }, 250); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && aperto) imposta(false); });
  window.addEventListener('resize', function () { if (aperto) posiziona(); });
})();
