/* ============================================================
   SPORTSCI RESEARCH — 共享 3D 背景场景
   3D 粒子星云 + 悬浮几何晶格 + 体积光束(伪) + 鼠标视差 + 点击粒子涌动
   克制 / 缓慢 / 低亮度，禁止晃眼
   ============================================================ */
(function () {
  "use strict";

  var REDUCED = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function init(canvasId, opts) {
    opts = opts || {};
    if (typeof THREE === "undefined") return null;

    var canvas = document.getElementById(canvasId);
    if (!canvas) return null;

    var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    var scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0614, 0.055);

    var camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0.4, 9);

    /* ---------- 远星层 ---------- */
    var starCount = REDUCED ? 350 : (opts.stars || 950);
    var starGeo = new THREE.BufferGeometry();
    var sp = new Float32Array(starCount * 3);
    var sc = new Float32Array(starCount * 3);
    var palette = [
      new THREE.Color(0xff4fe3),
      new THREE.Color(0x3de8ff),
      new THREE.Color(0xb48cff),
      new THREE.Color(0xb026c9)
    ];
    for (var i = 0; i < starCount; i++) {
      var r = 14 + Math.random() * 26;
      var th = Math.random() * Math.PI * 2;
      var ph = Math.acos(2 * Math.random() - 1);
      sp[i * 3] = r * Math.sin(ph) * Math.cos(th);
      sp[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.7;
      sp[i * 3 + 2] = -Math.abs(r * Math.cos(ph)) - 4;
      var c = palette[(Math.random() * palette.length) | 0].clone().multiplyScalar(0.35 + Math.random() * 0.45);
      sc[i * 3] = c.r; sc[i * 3 + 1] = c.g; sc[i * 3 + 2] = c.b;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(sp, 3));
    starGeo.setAttribute("color", new THREE.BufferAttribute(sc, 3));
    var stars = new THREE.Points(starGeo, new THREE.PointsMaterial({
      size: 0.055, vertexColors: true, transparent: true, opacity: 0.85,
      depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true
    }));
    scene.add(stars);

    /* ---------- 近处漂浮尘埃 ---------- */
    var dustCount = REDUCED ? 120 : 320;
    var dustGeo = new THREE.BufferGeometry();
    var dp = new Float32Array(dustCount * 3);
    var dv = new Float32Array(dustCount * 3); // 漂移速度
    for (var j = 0; j < dustCount; j++) {
      dp[j * 3] = (Math.random() - 0.5) * 22;
      dp[j * 3 + 1] = (Math.random() - 0.5) * 12;
      dp[j * 3 + 2] = (Math.random() - 0.5) * 8 - 1;
      dv[j * 3] = (Math.random() - 0.5) * 0.0016;
      dv[j * 3 + 1] = (Math.random() - 0.5) * 0.0012;
      dv[j * 3 + 2] = 0;
    }
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dp, 3));
    var dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({
      size: 0.035, color: 0xff4fe3, transparent: true, opacity: 0.5,
      depthWrite: false, blending: THREE.AdditiveBlending
    }));
    scene.add(dust);

    /* ---------- 悬浮几何晶格 ---------- */
    var lattice = new THREE.Group();
    var geoMat = new THREE.LineBasicMaterial({ color: 0xb026c9, transparent: true, opacity: 0.34 });
    var geoMat2 = new THREE.LineBasicMaterial({ color: 0x3de8ff, transparent: true, opacity: 0.20 });

    var ico = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.15, 0)), geoMat);
    ico.position.set(-5.6, 1.7, -3.5);
    lattice.add(ico);

    var octa = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.OctahedronGeometry(0.85, 0)), geoMat2);
    octa.position.set(5.4, -1.5, -2.5);
    lattice.add(octa);

    var torus = new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.TorusGeometry(1.3, 0.32, 8, 28)), geoMat2.clone());
    torus.material.opacity = 0.12;
    torus.position.set(4.6, 2.6, -6);
    torus.rotation.x = 1.1;
    lattice.add(torus);

    var dode = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.DodecahedronGeometry(0.7, 0)), geoMat.clone());
    dode.material.opacity = 0.22;
    dode.position.set(-4.4, -2.4, -4.5);
    lattice.add(dode);
    scene.add(lattice);

    /* ---------- 体积光束（伪，加法混合平面） ---------- */
    function makeBeam(w, h, color, opacity) {
      var g = new THREE.PlaneGeometry(w, h);
      var m = new THREE.MeshBasicMaterial({
        color: color, transparent: true, opacity: opacity,
        blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide
      });
      return new THREE.Mesh(g, m);
    }
    var beam1 = makeBeam(0.5, 26, 0xff4fe3, 0.045);
    beam1.position.set(-3, 0, -8);
    beam1.rotation.z = 0.5;
    scene.add(beam1);
    var beam2 = makeBeam(0.35, 24, 0x3de8ff, 0.035);
    beam2.position.set(4, 1, -9);
    beam2.rotation.z = -0.42;
    scene.add(beam2);
    var beam3 = makeBeam(0.26, 22, 0xb48cff, 0.03);
    beam3.position.set(0.6, 2, -10);
    beam3.rotation.z = 0.16;
    scene.add(beam3);

    /* ---------- 霓虹网格地面（赛博朋克合成波） ---------- */
    var grid = new THREE.GridHelper(60, 60, 0xff4fe3, 0x3a1560);
    grid.position.y = -3.6;
    grid.material.transparent = true;
    grid.material.opacity = 0.22;
    grid.material.depthWrite = false;
    scene.add(grid);

    /* ---------- 鼠标视差 ---------- */
    var mouseX = 0, mouseY = 0, camTX = 0, camTY = 0.4;
    window.addEventListener("mousemove", function (e) {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      camTX = mouseX * 0.55;
      camTY = 0.4 - mouseY * 0.35;
      glowTX = mouseX * 4.6;
      glowTY = 0.4 - mouseY * 2.9;
      glowTO = 0.5;
    }, { passive: true });

    /* ---------- 鼠标处三维光斑（指到哪里哪里发光） ---------- */
    var glowTex = (function () {
      var c = document.createElement("canvas");
      c.width = c.height = 128;
      var g = c.getContext("2d");
      var grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, "rgba(255,255,255,0.9)");
      grad.addColorStop(0.25, "rgba(255,190,246,0.35)");
      grad.addColorStop(0.6, "rgba(255,79,227,0.10)");
      grad.addColorStop(1, "rgba(255,79,227,0)");
      g.fillStyle = grad;
      g.fillRect(0, 0, 128, 128);
      return new THREE.CanvasTexture(c);
    })();
    var mouseGlow = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTex, color: 0xff4fe3, transparent: true, opacity: 0.0,
      blending: THREE.AdditiveBlending, depthWrite: false
    }));
    mouseGlow.scale.set(4.2, 4.2, 1);
    scene.add(mouseGlow);
    var glowTX = 0, glowTY = 0.4, glowTO = 0;

    /* ---------- 点击粒子涌动 ---------- */
    var bursts = [];
    canvas.style.pointerEvents = "auto";
    function spawnBurst(clientX, clientY) {
      var ndc = new THREE.Vector3(
        (clientX / window.innerWidth) * 2 - 1,
        -(clientY / window.innerHeight) * 2 + 1,
        0.5
      );
      ndc.unproject(camera);
      var dir = ndc.sub(camera.position).normalize();
      var dist = -camera.position.z / dir.z;
      var origin = camera.position.clone().add(dir.multiplyScalar(dist * 0.55));

      var n = 90;
      var g = new THREE.BufferGeometry();
      var pos = new Float32Array(n * 3);
      var vel = new Float32Array(n * 3);
      for (var k = 0; k < n; k++) {
        pos[k * 3] = origin.x; pos[k * 3 + 1] = origin.y; pos[k * 3 + 2] = origin.z;
        var theta = Math.random() * Math.PI * 2;
        var phi2 = Math.acos(2 * Math.random() - 1);
        var speed = 0.02 + Math.random() * 0.05;
        vel[k * 3] = Math.sin(phi2) * Math.cos(theta) * speed;
        vel[k * 3 + 1] = Math.sin(phi2) * Math.sin(theta) * speed;
        vel[k * 3 + 2] = Math.cos(phi2) * speed * 0.4;
      }
      g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      var m = new THREE.PointsMaterial({
        size: 0.06, color: 0xff9df2, transparent: true, opacity: 0.9,
        depthWrite: false, blending: THREE.AdditiveBlending
      });
      var pts = new THREE.Points(g, m);
      scene.add(pts);
      bursts.push({ pts: pts, vel: vel, life: 1.0 });
    }
    canvas.addEventListener("pointerdown", function (e) { spawnBurst(e.clientX, e.clientY); });

    /* ---------- 渲染循环 ---------- */
    var clock = new THREE.Clock();
    var running = true;
    var rafId = null;

    function tick() {
      if (!running) return;
      rafId = requestAnimationFrame(tick);
      var t = clock.getElapsedTime();

      // 相机缓动
      camera.position.x += (camTX - camera.position.x) * 0.03;
      camera.position.y += (camTY - camera.position.y) * 0.03;
      camera.lookAt(0, 0.2, 0);

      // 鼠标光斑缓动跟随 + 呼吸
      mouseGlow.position.x += (glowTX - mouseGlow.position.x) * 0.08;
      mouseGlow.position.y += (glowTY - mouseGlow.position.y) * 0.08;
      mouseGlow.position.z = 1.2;
      glowTO += (0 - glowTO) * 0.004; // 静止时极缓衰减
      mouseGlow.material.opacity = Math.max(0.14, glowTO) * (0.8 + Math.sin(t * 0.9) * 0.2);

      // 星层极缓旋转
      stars.rotation.y = t * 0.004;
      stars.rotation.x = Math.sin(t * 0.02) * 0.01;

      // 尘埃漂移
      var arr = dustGeo.attributes.position.array;
      for (var d = 0; d < dustCount; d++) {
        arr[d * 3] += dv[d * 3];
        arr[d * 3 + 1] += dv[d * 3 + 1];
        if (arr[d * 3] > 11) arr[d * 3] = -11;
        if (arr[d * 3] < -11) arr[d * 3] = 11;
        if (arr[d * 3 + 1] > 6) arr[d * 3 + 1] = -6;
        if (arr[d * 3 + 1] < -6) arr[d * 3 + 1] = 6;
      }
      dustGeo.attributes.position.needsUpdate = true;

      // 晶格自转（低帧率感：极慢）
      ico.rotation.y = t * 0.05; ico.rotation.x = t * 0.021;
      octa.rotation.y = -t * 0.04; octa.rotation.z = t * 0.017;
      torus.rotation.y = t * 0.03;
      dode.rotation.y = t * 0.045; dode.rotation.x = -t * 0.02;
      lattice.position.y = Math.sin(t * 0.16) * 0.12;

      // 光束呼吸
      beam1.material.opacity = 0.05 + Math.sin(t * 0.25) * 0.015;
      beam2.material.opacity = 0.04 + Math.cos(t * 0.21) * 0.012;
      beam3.material.opacity = 0.03 + Math.sin(t * 0.3 + 2) * 0.01;

      // 霓虹网格缓缓推进（合成波跑动）
      grid.position.z = (t * 1.1) % 1;

      // 粒子涌动更新
      for (var b = bursts.length - 1; b >= 0; b--) {
        var burst = bursts[b];
        burst.life -= 0.012;
        var pa = burst.pts.geometry.attributes.position.array;
        for (var q = 0; q < pa.length / 3; q++) {
          pa[q * 3] += burst.vel[q * 3];
          pa[q * 3 + 1] += burst.vel[q * 3 + 1];
          pa[q * 3 + 2] += burst.vel[q * 3 + 2];
          burst.vel[q * 3] *= 0.985;
          burst.vel[q * 3 + 1] *= 0.985;
        }
        burst.pts.geometry.attributes.position.needsUpdate = true;
        burst.pts.material.opacity = Math.max(burst.life, 0) * 0.9;
        if (burst.life <= 0) {
          scene.remove(burst.pts);
          burst.pts.geometry.dispose();
          burst.pts.material.dispose();
          bursts.splice(b, 1);
        }
      }

      renderer.render(scene, camera);
    }
    tick();

    document.addEventListener("visibilitychange", function () {
      running = !document.hidden;
      if (running) { clock.getDelta(); tick(); }
      else if (rafId) cancelAnimationFrame(rafId);
    });

    window.addEventListener("resize", function () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    return { scene: scene, camera: camera, renderer: renderer };
  }

  /* ---------- 滚动显现 ---------- */
  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || !els.length) {
      els.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 页面转场：空间镜头推进 ---------- */
  function initWarp() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest ? e.target.closest("a[href]") : null;
      if (!a) return;
      var href = a.getAttribute("href");
      if (!href || href.charAt(0) === "#" || a.target === "_blank" || /^(https?:|mailto:)/.test(href)) return;
      if (!/\.html($|#)/.test(href)) return;
      e.preventDefault();
      document.body.classList.add("warp-out");
      setTimeout(function () { window.location.href = href; }, 380);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initReveal();
    initWarp();
  });

  window.SPORTSCI_BG = { init: init };
})();
