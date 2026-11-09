// Z0MBIT: rising souls canvas + count-ups + fee bars.
(function () {
  var cv = document.getElementById("souls"), ctx = cv.getContext("2d");
  var W, H, souls = [], N = window.innerWidth < 720 ? 42 : 80;
  function size() { W = cv.width = window.innerWidth; H = cv.height = window.innerHeight; }
  size(); window.addEventListener("resize", size);
  function spawn(init) {
    return {
      x: Math.random() * W,
      y: init ? Math.random() * H : H + 12,
      r: 0.8 + Math.random() * 2.2,
      s: 0.25 + Math.random() * 0.75,
      wob: Math.random() * Math.PI * 2,
      ws: 0.008 + Math.random() * 0.02,
      a: 0.12 + Math.random() * 0.4
    };
  }
  for (var i = 0; i < N; i++) souls.push(spawn(true));
  (function tick() {
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < souls.length; i++) {
      var s = souls[i];
      s.y -= s.s; s.wob += s.ws; s.x += Math.sin(s.wob) * 0.4;
      if (s.y < -14) souls[i] = s = spawn(false);
      var flick = 0.75 + 0.25 * Math.sin(s.wob * 3);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r * 2.6, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(141,255,60," + (s.a * 0.10 * flick) + ")";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(168,255,110," + (s.a * flick) + ")";
      ctx.fill();
    }
    requestAnimationFrame(tick);
  })();

  function countUp(el) {
    var target = parseFloat(el.getAttribute("data-count")), dec = parseInt(el.getAttribute("data-dec") || "0", 10);
    var t0 = null;
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / 1300, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * e).toFixed(dec).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var seen = new WeakSet();
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting || seen.has(en.target)) return;
      seen.add(en.target);
      en.target.querySelectorAll("[data-count]").forEach(countUp);
      en.target.querySelectorAll(".bar i").forEach(function (b) { b.style.width = b.getAttribute("data-w") + "%"; });
    });
  }, { threshold: 0.3 });
  document.querySelectorAll(".hero,.fees").forEach(function (s) { io.observe(s); });
})();
