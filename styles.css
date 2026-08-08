// Hero current flow-field animation.
// Guarded so this file can be shared across pages that don't have #heroCanvas.
(function () {
  var canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var w, h, bgGrad, jetX, jetY, jetR, mouseR;
  var mouseX = null, mouseY = null;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Density tuned against a ~648x380 preview (200 particles felt right there).
  // Scaled by sqrt(area) rather than linearly, so a huge monitor gets denser
  // coverage without the particle count (and render cost) exploding 4-5x.
  var BASE_AREA = 648 * 380;
  var BASE_N = 200;
  function particleCountFor(area) {
    var n = Math.round(BASE_N * Math.sqrt(area / BASE_AREA));
    return Math.max(140, Math.min(420, n));
  }

  function resize() {
    var rect = canvas.getBoundingClientRect();
    w = canvas.width = rect.width;
    h = canvas.height = rect.height;
    bgGrad = ctx.createLinearGradient(0, 0, w, h);
    bgGrad.addColorStop(0, '#05182D');
    bgGrad.addColorStop(0.5, '#0D3A60');
    bgGrad.addColorStop(1, '#1C6FA8');
    jetX = w * 0.62;
    jetY = h * 0.38;
    jetR = Math.min(w, h) * 0.22;
    mouseR = Math.min(w, h) * 0.32;
    initParticles();
  }

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
    var n = particleCountFor(w * h);
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
      var stepLen = 0.45 + spd * 1.5;
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
        var r = Math.round(120 + mix * 135);
        var g = Math.round(165 + mix * 90);
        var b = Math.round(210 + mix * 45);
        var alpha = 0.04 + frac * (0.2 + mix * 0.35);
        ctx.strokeStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + alpha.toFixed(3) + ')';
        ctx.lineWidth = 0.3 + frac * (0.7 + mix * 1);
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
  if (!reduceMotion) step();
})();
