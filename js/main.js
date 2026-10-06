// Apertura animata della home + leggero movimento delle pillole (solo desktop).
(function () {
  var html = document.documentElement;
  var logo = document.querySelector('.logo');
  var carrello = document.querySelector('.carrello');
  if (!carrello) return;
  html.dataset.ok = '1';

  var ridotto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function mostraTutto() {
    if (logo) { logo.style.opacity = 1; logo.classList.add('fatto'); }
    carrello.classList.add('in');
    html.classList.add('fine');
  }

  function intro() {
    if (ridotto || !logo || !logo.animate) { mostraTutto(); return; }
    var mono = logo.querySelector('.mono');

    // il blocco (monogramma + scritta) parte al centro della pagina, ingrandito: il monogramma si riempie d'acqua e la scritta compare
    logo.classList.add('intro');
    var r = logo.getBoundingClientRect();
    var scala = Math.min(2.6, (window.innerWidth * 0.8) / r.width);
    var dx = window.innerWidth / 2 - (r.left + r.width / 2);
    var dy = window.innerHeight / 2 - (r.top + r.height / 2);
    var centro = 'translate(' + dx + 'px,' + dy + 'px) scale(' + scala + ')';
    var tot = parseFloat(getComputedStyle(logo).getPropertyValue('--tot')) || 1.3;

    logo.style.transform = centro;
    logo.style.opacity = 1;
    logo.classList.add('scrive');

    // la scritta sparisce, il solo monogramma sale al suo posto in alto al centro
    setTimeout(function () {
      logo.classList.add('nome-via');
      setTimeout(function () {
        var m0 = mono.getBoundingClientRect();
        logo.classList.remove('intro', 'nome-via');
        logo.classList.add('fatto');
        logo.style.transform = '';
        var m1 = mono.getBoundingClientRect();
        var s = m0.width / m1.width;
        var tx = (m0.left + m0.width / 2) - (m1.left + m1.width / 2);
        var ty = (m0.top + m0.height / 2) - (m1.top + m1.height / 2);
        var sale = logo.animate(
          [{ transform: 'translate(' + tx + 'px,' + ty + 'px) scale(' + s + ')' }, { transform: 'none' }],
          { duration: 800, easing: 'cubic-bezier(.65,0,.25,1)' }
        );
        sale.onfinish = function () {
          setTimeout(function () { carrello.classList.add('in'); }, 50);
          setTimeout(function () { html.classList.add('fine'); }, 900);
        };
      }, 320);
    }, (tot + 0.55) * 1000);
  }

  var partito = false;
  function via() { if (!partito) { partito = true; intro(); } }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(via);
    setTimeout(via, 1500);
  } else { via(); }

  // parallasse: parte solo quando il mouse e' dentro il carrello e segue il mouse in modo morbido
  if (ridotto || !window.matchMedia('(hover: hover)').matches) return;
  var bersX = 0, bersY = 0, ora = { x: 0, y: 0 }, giro = false;

  function frame() {
    ora.x += (bersX - ora.x) * 0.08;
    ora.y += (bersY - ora.y) * 0.08;
    carrello.style.setProperty('--mx', ora.x.toFixed(4));
    carrello.style.setProperty('--my', ora.y.toFixed(4));
    if (Math.abs(bersX - ora.x) > 0.001 || Math.abs(bersY - ora.y) > 0.001) {
      requestAnimationFrame(frame);
    } else { giro = false; }
  }
  function sveglia() { if (!giro) { giro = true; requestAnimationFrame(frame); } }

  window.addEventListener('pointermove', function (e) {
    var b = carrello.getBoundingClientRect();
    // zona utile: solo l'interno del carrello, un po' piu' stretta dell'immagine
    var mx = b.width * 0.06, my = b.height * 0.12;
    var dentro = e.clientX > b.left + mx && e.clientX < b.right - mx &&
                 e.clientY > b.top + my && e.clientY < b.bottom - my;
    if (dentro) {
      bersX = (e.clientX - b.left) / b.width - 0.5;
      bersY = (e.clientY - b.top) / b.height - 0.5;
    } else { bersX = 0; bersY = 0; }
    sveglia();
  });
  document.documentElement.addEventListener('pointerleave', function () { bersX = 0; bersY = 0; sveglia(); });
})();
