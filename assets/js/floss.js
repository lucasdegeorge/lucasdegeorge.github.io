// Project page: Balancing Frequencies and Pixels in Flow Matching
// Loaded only on /projects/floss/ (via page.extra_js), after fl-common.js.
(function () {
  'use strict';

  var FL = window.FL;
  if (!FL) return;
  var root = FL.root, reduceMotion = FL.reduceMotion;
  var $ = FL.$, $$ = FL.$$, css = FL.css, onVisible = FL.onVisible;
  var el = FL.el, lineChart = FL.lineChart, addText = FL.addText, registerChart = FL.registerChart;
  var IMG = root.getAttribute('data-img-root');
  var DATA = window.FLOSS_DATA || {};

  /* ---------------- Guess the real image ---------------- */
  (function game() {
    var card = $('#game'); if (!card) return;
    var tiles = $$('.fl-game-tile', card), status = $('.fl-game-status', card), reset = $('.fl-game-reset', card);
    var picked = [];
    tiles.forEach(function (t) {
      $('.fl-game-tag', t).textContent = t.getAttribute('data-real') === '1' ? 'REAL' : 'GENERATED';
      t.addEventListener('click', function () {
        if (card.classList.contains('is-done')) return;
        var i = picked.indexOf(t);
        if (i >= 0) { picked.splice(i, 1); t.classList.remove('is-picked'); }
        else if (picked.length < 2) { picked.push(t); t.classList.add('is-picked'); }
        status.textContent = picked.length < 2 ? 'Pick ' + (2 - picked.length) + ' more' : '';
        if (picked.length === 2) setTimeout(finish, 350);
      });
    });
    function finish() {
      var ok = picked.filter(function (t) { return t.getAttribute('data-real') === '1'; }).length;
      card.classList.add('is-done');
      status.textContent = ok === 2 ? 'Well spotted, you found both real images!' :
        ok === 1 ? 'You found 1 of the 2 real images.' : 'Fooled! Both of your picks were generated.';
      reset.hidden = false;
    }
    reset.addEventListener('click', function () {
      picked.forEach(function (t) { t.classList.remove('is-picked'); });
      picked = []; card.classList.remove('is-done'); reset.hidden = true; status.textContent = 'Pick 2 images';
    });
  })();

  /* ---------------- FFT (radix-2, in place) ---------------- */
  function fft1(re, im, n, inv) {
    for (var i = 1, j = 0; i < n; i++) {
      var bit = n >> 1;
      for (; j & bit; bit >>= 1) j ^= bit;
      j ^= bit;
      if (i < j) { var tr = re[i]; re[i] = re[j]; re[j] = tr; var ti = im[i]; im[i] = im[j]; im[j] = ti; }
    }
    for (var len = 2; len <= n; len <<= 1) {
      var ang = (inv ? 2 : -2) * Math.PI / len, wr = Math.cos(ang), wi = Math.sin(ang);
      for (var s = 0; s < n; s += len) {
        var cr = 1, ci = 0;
        for (var k = 0; k < len / 2; k++) {
          var a = s + k, b = a + len / 2;
          var xr = re[b] * cr - im[b] * ci, xi = re[b] * ci + im[b] * cr;
          re[b] = re[a] - xr; im[b] = im[a] - xi; re[a] += xr; im[a] += xi;
          var nr = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = nr;
        }
      }
    }
  }
  function fft2(re, im, N, inv) {
    var rr = new Float64Array(N), ri = new Float64Array(N), x, y;
    for (y = 0; y < N; y++) {
      for (x = 0; x < N; x++) { rr[x] = re[y * N + x]; ri[x] = im[y * N + x]; }
      fft1(rr, ri, N, inv);
      for (x = 0; x < N; x++) { re[y * N + x] = rr[x]; im[y * N + x] = ri[x]; }
    }
    for (x = 0; x < N; x++) {
      for (y = 0; y < N; y++) { rr[y] = re[y * N + x]; ri[y] = im[y * N + x]; }
      fft1(rr, ri, N, inv);
      for (y = 0; y < N; y++) { re[y * N + x] = rr[y]; im[y * N + x] = ri[y]; }
    }
    var s = 1 / N; // orthonormal
    for (var i = 0; i < N * N; i++) { re[i] *= s; im[i] *= s; }
  }

  /* ---------------- Loss share per frequency octave ---------------- */
  var N = 256;
  var radius = new Float64Array(N * N); // in cycles per image
  (function () {
    for (var y = 0; y < N; y++) for (var x = 0; x < N; x++) {
      var fy = y < N / 2 ? y : y - N, fx = x < N / 2 ? x : x - N;
      radius[y * N + x] = Math.sqrt(fx * fx + fy * fy);
    }
  })();

  var spec = null; // {re:[3], im:[3]}: per-channel spectra of the selected image
  var listeners = [];

  function loadSpectrum(src) {
    var im = new Image();
    im.onload = function () {
      var c = document.createElement('canvas'); c.width = N; c.height = N;
      var cx = c.getContext('2d'); cx.drawImage(im, 0, 0, N, N);
      var px = cx.getImageData(0, 0, N, N).data;
      var re = [], imm = [];
      for (var ch = 0; ch < 3; ch++) {
        var r = new Float64Array(N * N), i2 = new Float64Array(N * N);
        for (var p = 0; p < N * N; p++) r[p] = px[p * 4 + ch] / 255;
        fft2(r, i2, N, false);
        re.push(r); imm.push(i2);
      }
      spec = { re: re, im: imm };
      listeners.forEach(function (f) { f(); });
    };
    im.src = src;
  }

  (function shareBars() {
    var card = $('.fl-share'); if (!card) return;
    var barsEl = $('.fl-share-bars', card);
    var edges = [1, 2, 4, 8, 16, 32, 64, Infinity];
    var labels = ['1–2', '2–4', '4–8', '8–16', '16–32', '32–64', '64+'];
    var mode = 'v';
    card.setAttribute('data-mode', mode);
    barsEl.innerHTML = labels.map(function (l) { return '<div class="fl-share-bar"><b></b><i></i><span>' + l + '</span></div>'; }).join('');
    var bars = $$('.fl-share-bar', barsEl);
    var shares = null, shown = false;

    function compute() {
      // Residual early in training ~ the image itself (prediction ~ mean); mean color excluded.
      var vS = edges.slice(1).map(function () { return 0; }), fS = vS.slice();
      for (var ch = 0; ch < 3; ch++) {
        var re = spec.re[ch], im = spec.im[ch], e = new Float64Array(N * N), ss = 0, mx = 0, p;
        for (p = 1; p < N * N; p++) { e[p] = Math.sqrt(re[p] * re[p] + im[p] * im[p]); ss += e[p] * e[p]; }
        var rms = Math.sqrt(ss / (N * N));
        for (p = 1; p < N * N; p++) { e[p] /= rms; if (e[p] > mx) mx = e[p]; }
        for (p = 1; p < N * N; p++) {
          var r = radius[p];
          for (var b = 0; b < vS.length; b++) {
            if (r >= edges[b] && r < edges[b + 1]) {
              vS[b] += e[p] * e[p];                       // pixel MSE (Parseval)
              fS[b] += (e[p] / mx) * Math.log(1 + e[p]);  // focal weight x log compression
              break;
            }
          }
        }
      }
      function norm(a) { var s = a.reduce(function (x, y) { return x + y; }, 0); return a.map(function (x) { return 100 * x / s; }); }
      shares = { v: norm(vS), f: norm(fS) };
    }
    function draw() {
      if (!shares || !shown) return;
      var arr = shares[mode], mx = Math.max.apply(null, shares.v.concat(shares.f));
      bars.forEach(function (b, i) {
        var h = 100 * arr[i] / mx;
        b.querySelector('i').style.height = h + '%';
        var lab = b.querySelector('b');
        lab.style.bottom = 'calc(' + h + '% + 4px)';
        lab.textContent = arr[i].toFixed(0) + '%';
      });
    }
    var btns = $$('.fl-toggle button', card), auto = null;
    function setMode(m) {
      mode = m; card.setAttribute('data-mode', mode);
      btns.forEach(function (x) { x.classList.toggle('is-active', x.getAttribute('data-mode') === m); });
      draw();
    }
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () { clearInterval(auto); setMode(btn.getAttribute('data-mode')); });
    });
    listeners.push(function () { compute(); draw(); });
    var shareImg = $('.fl-share-img', card);
    $$('.fx-thumb', card).forEach(function (b) {
      b.addEventListener('click', function () {
        $$('.fx-thumb', card).forEach(function (x) { x.classList.remove('is-active'); });
        b.classList.add('is-active');
        shareImg.src = b.getAttribute('data-src');
        loadSpectrum(b.getAttribute('data-src'));
      });
    });
    onVisible(card, function () {
      shown = true; draw();
      if (!reduceMotion) auto = setInterval(function () { setMode(mode === 'v' ? 'f' : 'v'); }, 2600);
    }, 0.5);
  })();

  var firstThumb = $('.fx-thumb.is-active');
  if (firstThumb) loadSpectrum(firstThumb.getAttribute('data-src'));

  function colors() { return { v: css('--fl-v'), f: css('--fl-f'), fv: css('--fl-fv'), ink: css('--text-primary'), muted: css('--text-secondary') }; }

  /* RAPS: deviation of generated spectrum during training */
  (function () {
    if (!DATA.raps) return;
    var greens = ['#a6e3a1', '#7ccf72', '#4fae4a', '#2e8a31', '#14601c'];
    registerChart('chart-raps', function (c, instant) {
      lineChart(c, {
        title: 'Relative deviation of generated power spectrum',
        h: 420, ratio: 0.5,
        x: { min: 0.0039, max: 0.45, log: true, ticks: [0.01, 0.03, 0.1, 0.3], label: 'Spatial frequency (cycles/pixel)' },
        y: { min: -100, max: 45, ticks: [-80, -60, -40, -20, 0, 20, 40], fmt: function (t) { return t + '%'; }, label: 'Δ power vs. real' },
        series: DATA.raps.series.map(function (pts, i) {
          return { pts: pts, color: greens[i], width: 2.5, name: DATA.raps.steps[i] + ' steps' };
        }),
        legend: true,
        before: function (g, X, Y) {
          el('line', { x1: X(0.0039), x2: X(0.45), y1: Y(0), y2: Y(0), class: 'zero' }, g);
          el('rect', { x: X(0.0039), y: Y(45), width: X(0.1) - X(0.0039), height: Y(0) - Y(45), fill: css('--fl-v'), opacity: 0.06 }, g);
          el('rect', { x: X(0.1), y: Y(0), width: X(0.45) - X(0.1), height: Y(-100) - Y(0), fill: css('--fl-fv'), opacity: 0.06 }, g);
        },
        after: function (svg, X, Y) {
          addText(svg, X(0.006), Y(36), 'overestimated', { class: 'fade', fill: css('--fl-v') });
          addText(svg, X(0.42), Y(-92), 'underestimated', { class: 'fade', 'text-anchor': 'end', fill: css('--fl-fv') });
        }
      }).draw(true);
    });
  })();

  /* Schedule + long-run FID, linked by a scrubber */
  (function () {
    var card = $('.fl-schedule'); if (!card) return;
    var ep = [79, 99, 119, 139, 159, 179, 199, 219, 239, 259, 279, 299, 319];
    var V = [8.44, 6.58, 5.81, 5.26, 4.88, 4.69, 4.53, 4.40, 4.34, 4.22, 4.22, 4.14, 4.11];
    var F = [6.82, 5.74, 5.27, 4.94, 4.73, 4.60, 4.55, 4.43, 4.36, 4.27, 4.32, 4.23, 4.24];
    var FV = [7.05, 5.86, 5.24, 4.82, 4.56, 4.32, 4.21, 4.03, 4.00, 3.99, 3.98, 4.00, 3.96];
    function zip(a) { return ep.map(function (e, i) { return [e, a[i]]; }); }
    var SSTAR = 199;
    function lam(s) { return 1 / (1 + Math.exp((s - SSTAR) / 18)); }
    function interp(arr, s) {
      for (var i = 0; i < ep.length - 1; i++) if (s <= ep[i + 1]) { var t = (s - ep[i]) / (ep[i + 1] - ep[i]); return arr[i] + t * (arr[i + 1] - arr[i]); }
      return arr[arr.length - 1];
    }
    var range = $('.fl-scrub-range', card), label = $('.fl-scrub-label', card), play = $('.fl-play', card);
    var sched = null, long = null, cur = {}, pos = 79; // pos: current epoch (float)

    function renderSched(c, instant) {
      var C = colors(), pf = [], pv = [];
      for (var s = 79; s <= 319; s += 3) { pf.push([s, lam(s)]); pv.push([s, 1 - lam(s)]); }
      sched = lineChart(c, {
        h: 300, ratio: 0.9,
        x: { min: 79, max: 319, ticks: [100, 150, 200, 250, 300], label: 'Training epoch' },
        y: { min: 0, max: 1.05, ticks: [0, 0.5, 1], label: 'weight' },
        series: [{ pts: pf, color: C.f, name: 'λ(s): f-loss' }, { pts: pv, color: C.v, name: '1−λ(s): v-loss' }],
        legend: true,
        after: function (svg, X, Y) {
          el('line', { x1: X(SSTAR), x2: X(SSTAR), y1: Y(0), y2: Y(1.05), stroke: C.muted, 'stroke-dasharray': '3 4' }, svg);
          addText(svg, X(SSTAR) + 4, Y(0.04), 's*', { class: 'lbl' });
          cur.sl = el('line', { y1: Y(0), y2: Y(1.05), class: 'cursor' }, svg);
          cur.sf = el('circle', { r: 6, fill: C.f, stroke: '#fff', 'stroke-width': 2 }, svg);
          cur.sv = el('circle', { r: 6, fill: C.v, stroke: '#fff', 'stroke-width': 2 }, svg);
        }
      });
      sched.draw(instant); update();
    }
    function renderLong(c, instant) {
      var C = colors();
      long = lineChart(c, {
        h: 420, ratio: 0.62,
        x: { min: 79, max: 319, ticks: [100, 150, 200, 250, 300], label: 'Training epoch' },
        y: { min: 3.8, max: 8.6, log: true, ticks: [4, 5, 6, 7, 8], label: 'Guided FID ↓' },
        series: [
          { pts: zip(V), color: C.v, name: 'v-loss', dots: true },
          { pts: zip(F), color: C.f, name: 'f-loss', dots: true },
          { pts: zip(FV), color: C.fv, name: 'fv-loss', dots: true }
        ],
        legend: true,
        after: function (svg, X, Y) {
          cur.ll = el('line', { y1: Y(3.8), y2: Y(8.6), class: 'cursor' }, svg);
          cur.lv = el('circle', { r: 5, fill: C.v }, svg);
          cur.lf = el('circle', { r: 5, fill: C.f }, svg);
          cur.lfv = el('circle', { r: 5, fill: C.fv }, svg);
          cur.lt = addText(svg, 0, Y(8.5), '', { class: 'lbl' });
        }
      });
      long.draw(instant); update();
    }
    function update() {
      var s = pos;
      range.value = Math.round(s);
      label.textContent = 'epoch ' + Math.round(s) + ' · λ=' + lam(s).toFixed(2);
      if (sched && cur.sl) {
        var x = sched.X(s);
        cur.sl.setAttribute('x1', x); cur.sl.setAttribute('x2', x);
        cur.sf.setAttribute('cx', x); cur.sf.setAttribute('cy', sched.Y(lam(s)));
        cur.sv.setAttribute('cx', x); cur.sv.setAttribute('cy', sched.Y(1 - lam(s)));
      }
      if (long && cur.ll) {
        var lx = long.X(s), v = interp(V, s), f = interp(F, s), fv = interp(FV, s);
        cur.ll.setAttribute('x1', lx); cur.ll.setAttribute('x2', lx);
        cur.lv.setAttribute('cx', lx); cur.lv.setAttribute('cy', long.Y(v));
        cur.lf.setAttribute('cx', lx); cur.lf.setAttribute('cy', long.Y(f));
        cur.lfv.setAttribute('cx', lx); cur.lfv.setAttribute('cy', long.Y(fv));
        var best = Math.min(v, f, fv), who = best === fv ? 'fv-loss' : best === f ? 'f-loss' : 'v-loss';
        cur.lt.textContent = 'best: ' + who + ' (' + best.toFixed(2) + ')';
        cur.lt.setAttribute('x', Math.min(lx + 8, long.W - 150));
      }
    }
    registerChart('chart-sched', renderSched);
    registerChart('chart-long', renderLong);
    range.addEventListener('input', function () { touched = true; stop(); pos = +range.value; update(); });

    // Play: sweep epoch 79 -> 319 in ~6 s, frame-rate independent.
    var raf = null, SPEED = 40, touched = false; // epochs per second
    function stop() { if (raf) cancelAnimationFrame(raf); raf = null; play.innerHTML = '&#9654;'; play.setAttribute('aria-label', 'Play'); }
    function start() {
      if (raf) return;
      if (pos >= 319) pos = 79;
      play.innerHTML = '&#10074;&#10074;'; play.setAttribute('aria-label', 'Pause');
      var last = null;
      function st(ts) {
        if (last == null) last = ts;
        pos = Math.min(319, pos + (ts - last) / 1000 * SPEED); last = ts;
        update();
        if (pos >= 319) { stop(); return; }
        raf = requestAnimationFrame(st);
      }
      raf = requestAnimationFrame(st);
    }
    play.addEventListener('click', function () { touched = true; raf ? stop() : start(); });
    onVisible(card, function () { if (!reduceMotion) setTimeout(function () { if (!touched) start(); }, 1200); }, 0.2);
  })();

  /* Training evolution */
  (function () {
    var card = $('.fl-evo'); if (!card) return;
    var steps = [40000, 50000, 60000, 70000, 80000, 100000, 120000];
    var cls = 'class853seed456', idx = 0, timer = null;
    var iv = $('.fl-evo-v', card), iff = $('.fl-evo-f', card), range = $('.fl-evo-range', card);
    var label = $('.fl-evo-label', card), play = $('.fl-evo-play', card);
    function src(c, s, l) { return IMG + '/evolution/' + c + '/step_' + s + '_' + l + '.jpg'; }
    function preload(c) { steps.forEach(function (s) { new Image().src = src(c, s, 'v-loss'); new Image().src = src(c, s, 'f-loss'); }); }
    function show() {
      iv.src = src(cls, steps[idx], 'v-loss'); iff.src = src(cls, steps[idx], 'f-loss');
      range.value = idx; label.textContent = (steps[idx] / 1000) + 'k steps';
    }
    function stop() { clearInterval(timer); timer = null; play.innerHTML = '&#9654;'; }
    function start() {
      play.innerHTML = '&#10074;&#10074;';
      if (idx >= steps.length - 1) { idx = 0; show(); }
      timer = setInterval(function () { if (idx >= steps.length - 1) { stop(); return; } idx++; show(); }, 900);
    }
    play.addEventListener('click', function () { timer ? stop() : start(); });
    range.addEventListener('input', function () { stop(); idx = +range.value; show(); });
    $$('.fl-evo-tabs .fl-chip', card).forEach(function (b) {
      b.addEventListener('click', function () {
        $$('.fl-evo-tabs .fl-chip', card).forEach(function (x) { x.classList.remove('is-active'); });
        b.classList.add('is-active'); cls = b.getAttribute('data-cls'); preload(cls); stop(); idx = 0; show();
        if (!reduceMotion) start();
      });
    });
    show();
    onVisible(card, function () { preload(cls); if (!reduceMotion) setTimeout(start, 600); }, 0.5);
  })();

  /* v-loss vs f-loss convergence (before introducing the schedule) */
  registerChart('chart-vf', function (c, instant) {
    var C = colors();
    var ep = [79, 99, 119, 139, 159, 179, 199, 219, 239, 259, 279, 299, 319];
    var V = [8.44, 6.58, 5.81, 5.26, 4.88, 4.69, 4.53, 4.40, 4.34, 4.22, 4.22, 4.14, 4.11];
    var F = [6.82, 5.74, 5.27, 4.94, 4.73, 4.60, 4.55, 4.43, 4.36, 4.27, 4.32, 4.23, 4.24];
    function zip(a) { return ep.map(function (e, i) { return [e, a[i]]; }); }
    lineChart(c, {
      h: 380, ratio: 0.5,
      x: { min: 75, max: 325, ticks: [100, 150, 200, 250, 300], label: 'Training epoch' },
      y: { min: 3.9, max: 8.8, log: true, ticks: [4, 5, 6, 7, 8], label: 'Guided FID ↓' },
      series: [{ pts: zip(V), color: C.v, name: 'v-loss', dots: true }, { pts: zip(F), color: C.f, name: 'f-loss', dots: true }],
      legend: true,
      before: function (g, X, Y) {
        el('rect', { x: X(75), y: Y(8.8), width: X(199) - X(75), height: Y(3.9) - Y(8.8), fill: C.f, opacity: 0.06 }, g);
        el('rect', { x: X(199), y: Y(8.8), width: X(325) - X(199), height: Y(3.9) - Y(8.8), fill: C.v, opacity: 0.06 }, g);
        el('line', { x1: X(199), x2: X(199), y1: Y(3.9), y2: Y(8.8), stroke: C.muted, 'stroke-dasharray': '3 4' }, g);
      },
      after: function (svg, X, Y) {
        addText(svg, (X(75) + X(199)) / 2, Y(8.1), 'f-loss ahead', { 'text-anchor': 'middle', class: 'lbl fade', fill: C.f });
        addText(svg, (X(199) + X(325)) / 2, Y(8.1), 'v-loss catches up', { 'text-anchor': 'middle', class: 'lbl fade', fill: C.v });
        addText(svg, X(199) + 4, Y(4.0), 'crossover s*', { class: 'fade' });
      }
    }).draw(instant);
  });

  /* Convergence per model size: one subplot each, guided/unguided toggle */
  (function () {
    var eps = [40, 60, 80, 100];
    var D = {
      u: {
        B: { v: [84.49, 56.40, 46.04, 40.76], fv: [77.88, 51.90, 42.63, 38.19], x: 88.4, sp: '1.13', ay: 37.5 },
        L: { v: [67.99, 36.14, 26.90, 23.95], fv: [49.88, 24.97, 19.48, 17.47], x: 63.7, sp: '1.57', ay: 18.5 },
        XL: { v: [59.10, 30.63, 22.57, 19.01], fv: [46.45, 23.34, 17.84, 15.26], x: 75.7, sp: '1.32', ay: 17.2 }
      },
      g: {
        B: { v: [35.41, 13.42, 8.44, 6.58], fv: [26.48, 10.14, 7.05, 5.86], x: 87.9, sp: '1.14', ay: 5.8 },
        L: { v: [29.62, 8.78, 5.29, 4.55], fv: [15.89, 5.29, 3.92, 3.62], x: 70.8, sp: '1.41', ay: 3.45 },
        XL: { v: [26.32, 8.37, 5.22, 4.13], fv: [16.57, 5.68, 4.17, 3.56], x: 81.3, sp: '1.25', ay: 3.6 }
      }
    };
    var gd = 'u', draws = [];
    function zip(a) { return eps.map(function (e, i) { return [e, a[i]]; }); }
    ['B', 'L', 'XL'].forEach(function (size) {
      draws.push(registerChart('chart-speed-' + size, function (c, instant) {
        var C = colors(), d = D[gd][size];
        var all = d.v.concat(d.fv), lo = Math.min.apply(null, all) * 0.8, hi = Math.max.apply(null, all) * 1.12;
        var ticks = [4, 6, 10, 15, 20, 30, 40, 60, 80].filter(function (t) { return t >= lo && t <= hi; });
        lineChart(c, {
          h: 300, ratio: 0.95,
          x: { min: 36, max: 106, ticks: [40, 60, 80, 100], label: 'Training epoch' },
          y: { min: lo, max: hi, log: true, ticks: ticks, label: (gd === 'g' ? 'Guided' : 'Unguided') + ' FID ↓' },
          series: [{ pts: zip(d.v), color: C.v, dots: true }, { pts: zip(d.fv), color: C.fv, dots: true }],
          after: function (svg, X, Y) {
            // As in the paper: dashed line at the v-loss FID at epoch 100, and a double arrow from the
            // epoch where fv-loss reaches that FID to epoch 100, labelled with the speed-up.
            var g = el('g', { class: 'fade' }, svg), x0 = X(d.x), x1 = X(100), y = Y(d.ay), h = 5;
            el('line', { x1: X(40), x2: X(105), y1: Y(d.v[3]), y2: Y(d.v[3]), stroke: C.ink, 'stroke-width': 1.2, 'stroke-dasharray': '5 4' }, g);
            el('line', { x1: x0, x2: x0, y1: y - h, y2: y + h, stroke: C.muted, 'stroke-width': 1 }, g);
            el('line', { x1: x1, x2: x1, y1: y - h, y2: y + h, stroke: C.muted, 'stroke-width': 1 }, g);
            el('line', { x1: x0 + 5, x2: x1 - 5, y1: y, y2: y, stroke: C.ink, 'stroke-width': 1.6 }, g);
            el('path', { d: 'M' + x0 + ',' + y + 'l7,-3.5v7z', fill: C.ink }, g);
            el('path', { d: 'M' + x1 + ',' + y + 'l-7,-3.5v7z', fill: C.ink }, g);
            addText(g, (x0 + x1) / 2, y + 15, d.sp + '×', { 'text-anchor': 'middle', class: 'lbl', fill: C.ink });
          }
        }).draw(instant);
      }));
    });
    $$('.fl-speed-guid button').forEach(function (b) {
      b.addEventListener('click', function () {
        $$('.fl-speed-guid button').forEach(function (x) { x.classList.remove('is-active'); });
        b.classList.add('is-active'); gd = b.getAttribute('data-g');
        draws.forEach(function (f) { if (f) f(); });
        $$('.fl-speed-grid .fl-chart').forEach(function (host) {
          host.classList.remove('is-drawn');
          $$('.ln', host).forEach(function (p) { var L = p.getTotalLength(); p.classList.remove('draw'); p.style.strokeDashoffset = L; p.getBoundingClientRect(); p.classList.add('draw'); p.style.strokeDashoffset = 0; });
          requestAnimationFrame(function () { host.classList.add('is-drawn'); });
        });
      });
    });
  })();

  /* Wall-clock */
  registerChart('chart-wall', function (c, instant) {
    var C = colors();
    lineChart(c, {
      h: 380, ratio: 0.5,
      x: { min: 85, max: 440, ticks: [100, 200, 300, 400], label: 'Wall-clock training time (min)' },
      y: { min: 3.8, max: 11, log: true, ticks: [4, 5, 6, 8, 10], label: 'Guided FID ↓' },
      series: [
        { pts: [[100, 8.44], [200, 5.26], [300, 4.40], [400, 4.14]], color: C.v, name: 'v-loss', dots: true },
        { pts: [[100, 10.24], [200, 5.10], [300, 4.60], [400, 4.57]], color: C.f, name: 'f-loss', dots: true },
        { pts: [[100, 10.14], [200, 5.24], [300, 4.32], [400, 3.99]], color: C.fv, name: 'fv-loss', dots: true }
      ],
      legend: true,
      after: function (svg, X, Y) {
        addText(svg, X(406), Y(4.14) - 2, '370k', { class: 'fade', fill: C.v });
        addText(svg, X(406), Y(4.57) + 4, '353k', { class: 'fade', fill: C.f });
        addText(svg, X(406), Y(3.99) + 12, '318k', { class: 'fade', fill: C.fv });
      }
    }).draw(instant);
  });

  /* Frequency-band error: low and high side by side */
  (function () {
    var X = [50, 75, 100, 150, 200, 250, 300, 400];
    var D = {
      low: { v: [14.00, 8.87, 6.24, 5.74, 4.61, 4.67, 4.51, 4.15], f: [12.34, 7.96, 7.07, 6.64, 6.26, 6.44, 5.94, 6.03], fv: [12.35, 7.72, 7.03, 6.36, 5.35, 4.41, 3.85, 3.79],
        y: { min: 3.5, max: 14.5, log: true, ticks: [4, 6, 8, 10, 14] } },
      high: { v: [4.51, 4.18, 3.83, 3.69, 3.50, 3.48, 3.48, 3.38], f: [4.45, 4.06, 3.88, 3.76, 3.65, 3.62, 3.53, 3.49], fv: [4.46, 4.07, 3.90, 3.72, 3.55, 3.45, 3.36, 3.34],
        y: { min: 3.3, max: 4.6, ticks: [3.4, 3.8, 4.2, 4.6], fmt: function (t) { return t.toFixed(1); } } }
    };
    function zip(a) { return X.map(function (x, i) { return [x, a[i]]; }); }
    ['low', 'high'].forEach(function (band) {
      registerChart('chart-band-' + band, function (c, instant) {
        var C = colors(), d = D[band], y = Object.assign({ label: 'Magnitude error ↓' }, d.y);
        lineChart(c, {
          h: 320,
          x: { min: 45, max: 410, ticks: [50, 100, 200, 300, 400], label: 'Training step (k)' },
          y: y,
          series: [{ pts: zip(d.v), color: C.v, name: 'v-loss', dots: true }, { pts: zip(d.f), color: C.f, name: 'f-loss', dots: true }, { pts: zip(d.fv), color: C.fv, name: 'fv-loss', dots: true }],
          legend: true
        }).draw(instant);
      });
    });
  })();

})();
