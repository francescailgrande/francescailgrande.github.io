// Scrollytelling delle pagine dei lavori:
// gli elementi con classe "rv" compaiono man mano che entrano nello schermo,
// le foto hanno un leggero parallasse. Con "riduci animazioni" attivo non fa nulla e tutto resta visibile.
(function () {
  var html = document.documentElement;
  if (!html.classList.contains('rv-on')) return;

  var els = Array.prototype.slice.call(document.querySelectorAll('.rv'));
  if (!els.length) return;

  var io = new IntersectionObserver(function (voci) {
    voci.forEach(function (v) {
      if (v.isIntersecting) {
        v.target.classList.add('in');
        (agganciati[v.target.id] || []).forEach(function (a) { a.classList.add('in'); });
        io.unobserve(v.target);
      }
    });
  }, { threshold: 0, rootMargin: '0px 0px -12% 0px' });
  // elementi "agganciati": compaiono insieme a un altro elemento (data-con="id")
  var agganciati = {};
  var gruppi = [];   // i riquadri "clip" vengono osservati tramite il contenitore, perche' da nascosti non hanno area visibile
  els.forEach(function (el) {
    var con = el.getAttribute('data-con');
    if (con) { (agganciati[con] = agganciati[con] || []).push(el); }
    else if (el.classList.contains('rv-clip') || el.classList.contains('rv-sale')) {
      var p = el.parentElement;
      if (!p.__figli) { p.__figli = []; gruppi.push(p); }
      p.__figli.push(el);
    }
    else { io.observe(el); }
  });
  // i contenitori con data-soglia partono quando se ne vede almeno quella frazione (utile per i riquadri alti)
  function creaGruppi(soglia) {
    var o = new IntersectionObserver(function (voci) {
      voci.forEach(function (v) {
        if (v.isIntersecting) {
          v.target.__figli.forEach(function (el) {
            el.classList.add('in');
            (agganciati[el.id] || []).forEach(function (a) { a.classList.add('in'); });
          });
          o.unobserve(v.target);
        }
      });
    }, { threshold: soglia, rootMargin: '0px 0px -8% 0px' });
    return o;
  }
  var oggetti = {};
  gruppi.forEach(function (g) {
    var soglia = parseFloat(g.getAttribute('data-soglia')) || 0;
    var o = oggetti[soglia] || (oggetti[soglia] = creaGruppi(soglia));
    o.observe(g);
  });

  // parallasse leggero sulle foto
  var foto = Array.prototype.slice.call(document.querySelectorAll('img[data-par]'));
  if (!foto.length) return;
  var visibili = new Set();
  var po = new IntersectionObserver(function (voci) {
    voci.forEach(function (v) { v.isIntersecting ? visibili.add(v.target) : visibili.delete(v.target); });
    pianifica();
  }, { rootMargin: '10% 0px 10% 0px' });
  foto.forEach(function (img) { po.observe(img.parentElement); img.parentElement.__img = img; });

  var attesa = false;
  function pianifica() {
    if (attesa) return;
    attesa = true;
    requestAnimationFrame(function () {
      attesa = false;
      var h = window.innerHeight;
      visibili.forEach(function (box) {
        var r = box.getBoundingClientRect();
        var p = ((r.top + r.height / 2) - h / 2) / h;           // -1 .. 1 circa
        var py = Math.max(-1, Math.min(1, p)) * -r.height * 0.045;
        box.__img.style.setProperty('--py', py.toFixed(1) + 'px');
      });
    });
  }
  window.addEventListener('scroll', pianifica, { passive: true });
  window.addEventListener('resize', pianifica);
})();
