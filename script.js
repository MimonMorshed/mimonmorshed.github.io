// Hero current flow-field animation.
// Guarded so this file can be shared across pages that don't have #heroCanvas.
(function () {
  var canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var w, h, bgGrad, jetX, jetY, jetR, mouseR, motionScale, palette;
  var mouseX = null, mouseY = null;

  // Color palette per theme. "slow"/"fast" are the two ends of the
  // per-particle color ramp (speedAt() decides where a given point falls
  // between them). Dark ramps toward white at speed, light ramps toward a
  // richer blue instead, since brightening further isn't possible on white.
  var PALETTES = {
    dark: { grad: ['#05182D', '#0D3A60', '#1C6FA8'], slow: [120, 165, 210], fast: [255, 255, 255], alphaMul: 1 },
    light: { grad: ['#FFFFFF', '#FFFFFF', '#FFFFFF'], slow: [147, 181, 227], fast: [30, 58, 158], alphaMul: 1.4 }
  };
  function currentPalette() {
    var theme = document.documentElement.getAttribute('data-theme') || 'dark';
    return PALETTES[theme] || PALETTES.dark;
  }

  // Particle count by viewport width, straight-line interpolated between
  // points, flat at the last value beyond 3440px. Edit this table directly
  // to retune, no formula to reverse-engineer.
  var DENSITY_BREAKPOINTS = [
    [380, 157],
    [768, 223],
    [1440, 350],
    [1920, 400],
    [2560, 450],
    [3440, 500]
  ];
  function particleCountFor(width) {
    var pts = DENSITY_BREAKPOINTS;
    if (width <= pts[0][0]) return pts[0][1];
    for (var i = 1; i < pts.length; i++) {
      if (width <= pts[i][0]) {
        var a = pts[i - 1], b = pts[i];
        var t = (width - a[0]) / (b[0] - a[0]);
        return Math.round(a[1] + t * (b[1] - a[1]));
      }
    }
    return pts[pts.length - 1][1];
  }

  // Speed and stroke width get a modest boost on wider screens too, capped
  // at 1.3x so it stays "a little," not a different-feeling animation.
  function motionScaleFor(width) {
    var t = Math.max(0, Math.min(1, (width - 768) / (3440 - 768)));
    return 1 + t * 0.3;
  }

  function applyPalette() {
    palette = currentPalette();
    bgGrad = ctx.createLinearGradient(0, 0, w, h);
    bgGrad.addColorStop(0, palette.grad[0]);
    bgGrad.addColorStop(0.5, palette.grad[1]);
    bgGrad.addColorStop(1, palette.grad[2]);
  }

  function resize() {
    var rect = canvas.getBoundingClientRect();
    w = canvas.width = rect.width;
    h = canvas.height = rect.height;
    applyPalette();
    jetX = w * 0.62;
    jetY = h * 0.38;
    jetR = Math.min(w, h) * 0.22;
    mouseR = Math.min(w, h) * 0.32;
    motionScale = motionScaleFor(w);
    initParticles();
  }

  // Theme toggle (script.js's other half, see bottom of file) dispatches
  // this on <html> when the theme changes. Repaint the gradient and swap
  // the color ramp immediately, but don't touch particle positions, no
  // reason to reset the flow field just because the palette changed.
  document.documentElement.addEventListener('themechange', applyPalette);

  canvas.addEventListener('mousemove', function (e) {
    var rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });
  canvas.addEventListener('mouseleave', function () { mouseX = null; mouseY = null; });
  canvas.addEventListener('touchmove', function (e) {
    if (e.touches && e.touches[0]) {
      var rect = canvas.getBoundingClientRect();
      mouseX = e.touches[0].clientX - rect.left;
      mouseY = e.touches[0].clientY - rect.top;
    }
  }, { passive: true });
  canvas.addEventListener('touchend', function () { mouseX = null; mouseY = null; });

  function speedAt(x, y) {
    var dx = x - jetX, dy = y - jetY;
    var jet = Math.exp(-(dx * dx + dy * dy) / (2 * jetR * jetR));
    var s = 0.16 + jet * 0.85;
    if (mouseX !== null) {
      var mdx = x - mouseX, mdy = y - mouseY;
      var md = Math.sqrt(mdx * mdx + mdy * mdy);
      if (md < mouseR) s += (1 - md / mouseR) * 0.6;
    }
    return s;
  }
  function angleAt(x, y, t) {
    var nx = x / w, ny = y / h;
    var base = Math.sin(nx * 3 + t * 0.3) * Math.cos(ny * 2.5 - t * 0.2) * Math.PI + Math.sin(ny * 4 - t * 0.15) * 0.6;
    if (mouseX === null) return base;
    var dx = x - mouseX, dy = y - mouseY;
    var d = Math.sqrt(dx * dx + dy * dy);
    if (d >= mouseR) return base;
    var falloff = 1 - d / mouseR;
    var tangent = Math.atan2(dy, dx) + Math.PI / 2;
    var bx = Math.cos(base) * (1 - falloff) + Math.cos(tangent) * falloff;
    var by = Math.sin(base) * (1 - falloff) + Math.sin(tangent) * falloff;
    return Math.atan2(by, bx);
  }

  var HIST = 40;
  var particles = [];
  function initParticles() {
    var n = particleCountFor(w);
    particles = [];
    for (var i = 0; i < n; i++) {
      particles.push({ x: Math.random() * w, y: Math.random() * h, life: 90 + Math.random() * 180, history: [] });
    }
  }

  resize();
  window.addEventListener('resize', resize);

  var t = 0;
  function step() {
    t += 1;
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      var spd = speedAt(p.x, p.y);
      var a = angleAt(p.x, p.y, t * 0.012);
      var stepLen = (0.45 + spd * 1.5) * motionScale;
      var nx = p.x + Math.cos(a) * stepLen;
      var ny = p.y + Math.sin(a) * stepLen;
      p.history.push({ x: nx, y: ny, spd: spd });
      if (p.history.length > HIST) p.history.shift();
      p.x = nx; p.y = ny;
      p.life -= 1;

      var hist = p.history;
      for (var j = 1; j < hist.length; j++) {
        var frac = j / (hist.length - 1);
        var pt0 = hist[j - 1], pt1 = hist[j];
        var mix = Math.min(1, pt1.spd);
        var r = Math.round(palette.slow[0] + mix * (palette.fast[0] - palette.slow[0]));
        var g = Math.round(palette.slow[1] + mix * (palette.fast[1] - palette.slow[1]));
        var b = Math.round(palette.slow[2] + mix * (palette.fast[2] - palette.slow[2]));
        var alpha = Math.min(1, (0.04 + frac * (0.2 + mix * 0.35)) * palette.alphaMul);
        ctx.strokeStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + alpha.toFixed(3) + ')';
        ctx.lineWidth = (0.3 + frac * (0.7 + mix * 1)) * motionScale;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(pt0.x, pt0.y);
        ctx.lineTo(pt1.x, pt1.y);
        ctx.stroke();
      }

      if (p.life <= 0 || p.x < 0 || p.x > w || p.y < 0 || p.y > h) {
        p.x = Math.random() * w;
        p.y = Math.random() * h;
        p.life = 90 + Math.random() * 180;
        p.history = [];
      }
    }
    requestAnimationFrame(step);
  }

  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);
  step();
})();

// Light/dark theme toggle. Runs on every page (not guarded by heroCanvas),
// since the toggle button lives in the shared nav. Persists to localStorage
// and fires "themechange" on <html> so the hero animation above can react
// without a reload.
(function () {
  var root = document.documentElement;
  var toggle = document.getElementById('themeToggle');
  if (!toggle) return;

  toggle.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    if (next === 'dark') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', next);
    }
    try { localStorage.setItem('theme', next); } catch (e) {}
    root.dispatchEvent(new CustomEvent('themechange'));
  });
})();
