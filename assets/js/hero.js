/* ============================================================
   SPORTSCI RESEARCH INSTITUTE — 首页 3D 人体解剖线框
   逼真化肌肉骨骼线框：颅骨 / 脊柱 / 胸廓 / 骨盆 / 四肢骨 + 肌群轮廓
   鼠标交互：跟随视差、拖拽旋转、滚轮缩放、悬停高亮、全息扫描面
   ============================================================ */
(function () {
  "use strict";

  function ring(rx, rz, y, seg, tilt) {
    seg = seg || 48;
    var pts = [];
    for (var i = 0; i < seg; i++) {
      var a = (i / seg) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * rx, y + (tilt ? Math.cos(a) * tilt : 0), Math.sin(a) * rz));
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }

  function curveLine(pts, mat, closed) {
    var v = pts.map(function (p) { return new THREE.Vector3(p[0], p[1], p[2]); });
    var c = new THREE.CatmullRomCurve3(v, closed || false, "catmullrom", 0.5);
    var g = new THREE.BufferGeometry().setFromPoints(c.getPoints(Math.max(v.length * 6, 24)));
    return new THREE.Line(g, mat);
  }

  function lineSeg(pts, mat) {
    var v = pts.map(function (p) { return new THREE.Vector3(p[0], p[1], p[2]); });
    var g = new THREE.BufferGeometry().setFromPoints(v);
    return new THREE.Line(g, mat);
  }

  function init(canvasId) {
    if (typeof THREE === "undefined") return null;
    var canvas = document.getElementById(canvasId);
    if (!canvas) return null;
    var host = canvas.parentElement;

    var W = host.clientWidth, H = host.clientHeight;
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(W, H);

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 60);
    var camDist = 4.0, camY = 1.0, camZ = 4.0;
    camera.position.set(0, camY, camZ);
    camera.lookAt(0, 1.0, 0);

    var human = new THREE.Group();
    human.scale.set(1.12, 1.12, 1.12);
    scene.add(human);

    /* ---------- 胸口能量核心 ---------- */
    var core = (function () {
      var c = document.createElement("canvas"); c.width = c.height = 128;
      var g = c.getContext("2d");
      var grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, "rgba(255,255,255,0.95)");
      grad.addColorStop(0.3, "rgba(255,157,242,0.5)");
      grad.addColorStop(1, "rgba(255,79,227,0)");
      g.fillStyle = grad; g.fillRect(0, 0, 128, 128);
      var sp = new THREE.Sprite(new THREE.SpriteMaterial({
        map: new THREE.CanvasTexture(c), color: 0xff4fe3, transparent: true, opacity: 0.85,
        blending: THREE.AdditiveBlending, depthWrite: false
      }));
      sp.scale.set(0.52, 0.52, 1); sp.position.set(0, 1.42, 0.04);
      return sp;
    })();
    scene.add(core);

    /* ---------- 轨道光环与足底基环 ---------- */
    var halo1 = new THREE.Mesh(new THREE.TorusGeometry(0.78, 0.004, 8, 100),
      new THREE.MeshBasicMaterial({ color: 0xff4fe3, transparent: true, opacity: 0.30, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
    halo1.position.y = 1.02; halo1.rotation.x = 1.42; scene.add(halo1);
    var halo2 = new THREE.Mesh(new THREE.TorusGeometry(0.96, 0.003, 8, 100),
      new THREE.MeshBasicMaterial({ color: 0x3de8ff, transparent: true, opacity: 0.20, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
    halo2.position.y = 1.02; halo2.rotation.x = 1.30; halo2.rotation.y = 0.4; scene.add(halo2);
    var base = new THREE.Mesh(new THREE.TorusGeometry(0.56, 0.005, 8, 80),
      new THREE.MeshBasicMaterial({ color: 0x3de8ff, transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending, depthWrite: false }));
    base.rotation.x = Math.PI / 2; base.position.y = 0.04; scene.add(base);

    /* ---------- 材质 ---------- */
    var mBone = new THREE.LineBasicMaterial({ color: 0x3de8ff, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false });
    var mBoneDeep = new THREE.LineBasicMaterial({ color: 0x2a8fb0, transparent: true, opacity: 0.42, blending: THREE.AdditiveBlending, depthWrite: false });
    var mMusc = new THREE.LineBasicMaterial({ color: 0xff4fe3, transparent: true, opacity: 0.50, blending: THREE.AdditiveBlending, depthWrite: false });
    var mMuscDim = new THREE.LineBasicMaterial({ color: 0xb026c9, transparent: true, opacity: 0.40, blending: THREE.AdditiveBlending, depthWrite: false });
    var mCardio = new THREE.LineBasicMaterial({ color: 0xff9df2, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false });

    /* ---------- 颅骨（更饱满） ---------- */
    var skull = new THREE.Mesh(new THREE.SphereGeometry(0.15, 18, 14),
      new THREE.MeshBasicMaterial({ color: 0xff4fe3, wireframe: true, transparent: true, opacity: 0.32, blending: THREE.AdditiveBlending, depthWrite: false }));
    skull.position.y = 1.86; skull.scale.set(0.86, 1.06, 0.94); human.add(skull);
    // 下颌线
    human.add(curveLine([[-0.11, 1.74, 0.06], [-0.06, 1.68, 0.1], [0, 1.66, 0.12], [0.06, 1.68, 0.1], [0.11, 1.74, 0.06]], mBone));
    // 眼眶
    (function () {
      var eyeMat = new THREE.MeshBasicMaterial({ color: 0x3de8ff, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false });
      var el = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.003, 6, 24), eyeMat);
      el.position.set(-0.05, 1.88, 0.13); human.add(el);
      var er = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.003, 6, 24), eyeMat);
      er.position.set(0.05, 1.88, 0.13); human.add(er);
    })();

    /* ---------- 颈椎 / 脊柱（含颈曲胸曲腰曲） ---------- */
    var spinePts = [];
    for (var s = 0; s <= 28; s++) {
      var t = s / 28;
      var sy = 1.78 - t * 0.96;
      var sz = -0.05 + Math.sin(t * Math.PI) * 0.03 - (t > 0.6 ? (t - 0.6) * 0.12 : 0);
      spinePts.push([0, sy, sz]);
    }
    human.add(curveLine(spinePts, mBoneDeep));
    // 颈椎横突点
    for (var cv = 0; cv < 5; cv++) {
      var cy = 1.74 - cv * 0.035;
      human.add(new THREE.Points(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-0.03, cy, -0.02), new THREE.Vector3(0.03, cy, -0.02)
      ]), new THREE.PointsMaterial({ size: 0.02, color: 0x3de8ff, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending, depthWrite: false })));
    }

    /* ---------- 胸廓（12 肋，更宽更立体） ---------- */
    var ribRx = [0.08, 0.11, 0.135, 0.155, 0.17, 0.178, 0.18, 0.176, 0.166, 0.152, 0.133, 0.112];
    var ribGlow = [];
    for (var r = 0; r < ribRx.length; r++) {
      var ry = 1.66 - r * 0.052;
      var mat = r < 6 ? mBone : mBoneDeep;
      human.add(new THREE.LineLoop(ring(ribRx[r], ribRx[r] * 0.72, ry, 46, 0.008 * r), mat));
      ribGlow.push(new THREE.Vector3(ribRx[r] * 0.998, ry, 0));
    }
    var glowGeo = new THREE.BufferGeometry().setFromPoints(ribGlow);
    human.add(new THREE.Points(glowGeo, new THREE.PointsMaterial({
      size: 0.026, color: 0xff9df2, transparent: true, opacity: 0.9,
      blending: THREE.AdditiveBlending, depthWrite: false
    })));
    // 胸骨
    human.add(lineSeg([[0, 1.66, 0.115], [0, 1.52, 0.13], [0, 1.28, 0.105], [0, 1.12, 0.085]], mBoneDeep));
    // 锁骨
    human.add(lineSeg([[-0.03, 1.66, 0.08], [-0.16, 1.64, 0.02], [-0.28, 1.6, 0]], mBoneDeep));
    human.add(lineSeg([[0.03, 1.66, 0.08], [0.16, 1.64, 0.02], [0.28, 1.6, 0]], mBoneDeep));
    // 肩胛骨内侧缘
    human.add(curveLine([[-0.22, 1.56, -0.06], [-0.2, 1.32, -0.08], [-0.16, 1.18, -0.07]], mBoneDeep));
    human.add(curveLine([[0.22, 1.56, -0.06], [0.2, 1.32, -0.08], [0.16, 1.18, -0.07]], mBoneDeep));

    /* ---------- 膈肌穹顶 ---------- */
    var dia = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 7, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshBasicMaterial({ color: 0x3de8ff, wireframe: true, transparent: true, opacity: 0.26, blending: THREE.AdditiveBlending, depthWrite: false }));
    dia.position.y = 1.02; dia.scale.set(1, 0.6, 0.82); human.add(dia);

    /* ---------- 骨盆 ---------- */
    human.add(new THREE.LineLoop(ring(0.175, 0.12, 0.92, 42), mBoneDeep));
    human.add(new THREE.LineLoop(ring(0.155, 0.108, 0.86, 42), mBoneDeep));
    // 髂嵴
    human.add(curveLine([[-0.17, 0.94, 0], [-0.18, 0.92, -0.08], [-0.14, 0.88, -0.12]], mBone));
    human.add(curveLine([[0.17, 0.94, 0], [0.18, 0.92, -0.08], [0.14, 0.88, -0.12]], mBone));

    /* ---------- 肌群轮廓（逼真化核心） ---------- */
    // 胸大肌
    human.add(curveLine([[-0.26, 1.55, 0.08], [-0.14, 1.5, 0.11], [-0.04, 1.42, 0.12], [-0.1, 1.3, 0.1], [-0.2, 1.34, 0.07]], mMusc));
    human.add(curveLine([[0.26, 1.55, 0.08], [0.14, 1.5, 0.11], [0.04, 1.42, 0.12], [0.1, 1.3, 0.1], [0.2, 1.34, 0.07]], mMusc));
    // 三角肌
    human.add(curveLine([[-0.28, 1.62, 0.02], [-0.34, 1.55, 0.04], [-0.33, 1.42, 0.06], [-0.27, 1.4, 0.03], [-0.22, 1.5, 0.02]], mMuscDim));
    human.add(curveLine([[0.28, 1.62, 0.02], [0.34, 1.55, 0.04], [0.33, 1.42, 0.06], [0.27, 1.4, 0.03], [0.22, 1.5, 0.02]], mMuscDim));
    // 肱二头肌 / 肱三头肌
    human.add(curveLine([[-0.3, 1.52, 0.05], [-0.33, 1.32, 0.06], [-0.31, 1.16, 0.04]], mMusc));
    human.add(curveLine([[0.3, 1.52, 0.05], [0.33, 1.32, 0.06], [0.31, 1.16, 0.04]], mMusc));
    human.add(curveLine([[-0.26, 1.5, -0.02], [-0.29, 1.3, -0.04], [-0.28, 1.16, -0.03]], mMuscDim));
    human.add(curveLine([[0.26, 1.5, -0.02], [0.29, 1.3, -0.04], [0.28, 1.16, -0.03]], mMuscDim));
    // 前臂肌群
    human.add(curveLine([[-0.31, 1.16, 0.04], [-0.29, 0.96, 0.05], [-0.26, 0.82, 0.04]], mMuscDim));
    human.add(curveLine([[0.31, 1.16, 0.04], [0.29, 0.96, 0.05], [0.26, 0.82, 0.04]], mMuscDim));
    // 腹直肌（分块线）
    for (var ab = 0; ab < 5; ab++) {
      var ay = 1.05 - ab * 0.055;
      human.add(lineSeg([[-0.08, ay, 0.09], [0.08, ay, 0.09]], mMusc));
    }
    human.add(lineSeg([[0, 1.12, 0.09], [0, 0.88, 0.07]], mMusc)); // 腹白线
    // 腹外斜肌
    human.add(curveLine([[-0.16, 1.18, 0.06], [-0.19, 1.0, 0.04], [-0.16, 0.86, 0.02]], mMuscDim));
    human.add(curveLine([[0.16, 1.18, 0.06], [0.19, 1.0, 0.04], [0.16, 0.86, 0.02]], mMuscDim));
    // 背阔肌外缘
    human.add(curveLine([[-0.3, 1.4, -0.06], [-0.24, 1.1, -0.1], [-0.13, 0.92, -0.08]], mMuscDim));
    human.add(curveLine([[0.3, 1.4, -0.06], [0.24, 1.1, -0.1], [0.13, 0.92, -0.08]], mMuscDim));
    // 臀大肌
    human.add(curveLine([[-0.15, 0.9, -0.02], [-0.2, 0.78, -0.06], [-0.17, 0.66, -0.08], [-0.1, 0.7, -0.06]], mMuscDim));
    human.add(curveLine([[0.15, 0.9, -0.02], [0.2, 0.78, -0.06], [0.17, 0.66, -0.08], [0.1, 0.7, -0.06]], mMuscDim));
    // 股四头肌
    human.add(curveLine([[-0.15, 0.88, 0.04], [-0.17, 0.62, 0.05], [-0.15, 0.42, 0.03]], mMusc));
    human.add(curveLine([[0.15, 0.88, 0.04], [0.17, 0.62, 0.05], [0.15, 0.42, 0.03]], mMusc));
    // 腘绳肌
    human.add(curveLine([[-0.13, 0.86, -0.04], [-0.15, 0.6, -0.06], [-0.14, 0.42, -0.05]], mMuscDim));
    human.add(curveLine([[0.13, 0.86, -0.04], [0.15, 0.6, -0.06], [0.14, 0.42, -0.05]], mMuscDim));
    // 腓肠肌（小腿）
    human.add(curveLine([[-0.13, 0.42, 0.03], [-0.15, 0.26, 0.05], [-0.13, 0.12, 0.02]], mMusc));
    human.add(curveLine([[0.13, 0.42, 0.03], [0.15, 0.26, 0.05], [0.13, 0.12, 0.02]], mMusc));

    /* ---------- 四肢骨（骨架） ---------- */
    function limb(pts, mat) { human.add(lineSeg(pts, mat || mBone)); }
    // 左臂 / 右臂
    limb([[-0.28, 1.6, 0], [-0.31, 1.18, 0.02], [-0.27, 0.82, 0.05]]);
    limb([[0.28, 1.6, 0], [0.31, 1.18, 0.02], [0.27, 0.82, 0.05]]);
    // 手（简化掌骨）
    limb([[-0.27, 0.82, 0.05], [-0.28, 0.74, 0.06], [-0.26, 0.7, 0.05]]);
    limb([[0.27, 0.82, 0.05], [0.28, 0.74, 0.06], [0.26, 0.7, 0.05]]);
    // 左腿 / 右腿
    limb([[-0.13, 0.88, 0], [-0.14, 0.48, 0.02], [-0.13, 0.12, -0.02], [-0.13, 0.1, 0.09]]);
    limb([[0.13, 0.88, 0], [0.14, 0.48, 0.02], [0.13, 0.12, -0.02], [0.13, 0.1, 0.09]]);

    /* ---------- 关节标记 ---------- */
    var joints = [
      [-0.28, 1.6, 0], [0.28, 1.6, 0],
      [-0.31, 1.18, 0.02], [0.31, 1.18, 0.02],
      [-0.27, 0.82, 0.05], [0.27, 0.82, 0.05],
      [-0.13, 0.88, 0], [0.13, 0.88, 0],
      [-0.14, 0.48, 0.02], [0.14, 0.48, 0.02],
      [-0.13, 0.12, -0.02], [0.13, 0.12, -0.02]
    ].map(function (p) { return new THREE.Vector3(p[0], p[1], p[2]); });
    human.add(new THREE.Points(new THREE.BufferGeometry().setFromPoints(joints), new THREE.PointsMaterial({
      size: 0.03, color: 0x3de8ff, transparent: true, opacity: 0.95,
      blending: THREE.AdditiveBlending, depthWrite: false
    })));

    /* ---------- 心肺与血流粒子流线 ---------- */
    var flows = [];
    var flowDefs = [
      { curve: new THREE.CatmullRomCurve3([
          new THREE.Vector3(0, 1.92, 0), new THREE.Vector3(0, 1.5, -0.05),
          new THREE.Vector3(0, 1.05, -0.06), new THREE.Vector3(0, 0.88, -0.02)
        ]), color: 0xff4fe3, n: 56, speed: 0.04, size: 0.022 },
      { curve: new THREE.CatmullRomCurve3([
          new THREE.Vector3(0, 1.4, 0.06), new THREE.Vector3(0.14, 1.52, 0.05),
          new THREE.Vector3(0.28, 1.6, 0), new THREE.Vector3(0.31, 1.18, 0.02),
          new THREE.Vector3(0.27, 0.82, 0.05)
        ]), color: 0x3de8ff, n: 48, speed: 0.055, size: 0.02 },
      { curve: new THREE.CatmullRomCurve3([
          new THREE.Vector3(0, 0.9, 0), new THREE.Vector3(-0.13, 0.88, 0),
          new THREE.Vector3(-0.14, 0.48, 0.02), new THREE.Vector3(-0.13, 0.12, -0.02)
        ]), color: 0xb48cff, n: 48, speed: 0.045, size: 0.02 },
      { curve: new THREE.CatmullRomCurve3([
          new THREE.Vector3(0, 1.42, 0.06), new THREE.Vector3(-0.14, 1.52, 0.05),
          new THREE.Vector3(-0.28, 1.6, 0), new THREE.Vector3(-0.31, 1.18, 0.02),
          new THREE.Vector3(-0.27, 0.82, 0.05)
        ]), color: 0x3de8ff, n: 40, speed: 0.06, size: 0.018 }
    ];
    flowDefs.forEach(function (fd) {
      var positions = new Float32Array(fd.n * 3);
      var geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      var pts = new THREE.Points(geo, new THREE.PointsMaterial({
        size: fd.size, color: fd.color, transparent: true, opacity: 0.85,
        blending: THREE.AdditiveBlending, depthWrite: false
      }));
      human.add(pts);
      flows.push({ fd: fd, geo: geo, offset: Math.random() });
    });

    /* ---------- 全息扫描面 ---------- */
    var scanMat = new THREE.MeshBasicMaterial({
      color: 0x3de8ff, transparent: true, opacity: 0.10,
      blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide
    });
    var scan = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.012), scanMat);
    scan.rotation.x = -Math.PI / 2;
    scene.add(scan);

    /* ---------- 悬停高亮光斑 ---------- */
    var hoverGlow = (function () {
      var c = document.createElement("canvas"); c.width = c.height = 64;
      var g = c.getContext("2d");
      var grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, "rgba(255,255,255,0.8)");
      grad.addColorStop(0.4, "rgba(61,232,255,0.3)");
      grad.addColorStop(1, "rgba(61,232,255,0)");
      g.fillStyle = grad; g.fillRect(0, 0, 64, 64);
      var sp = new THREE.Sprite(new THREE.SpriteMaterial({
        map: new THREE.CanvasTexture(c), color: 0x3de8ff, transparent: true, opacity: 0,
        blending: THREE.AdditiveBlending, depthWrite: false
      }));
      sp.scale.set(0.6, 0.6, 1);
      scene.add(sp);
      return sp;
    })();

    /* ---------- 交互：视差 + 拖拽 + 滚轮 + 悬停 ---------- */
    var targetRY = 0, targetRX = 0, rotY = 0, rotX = 0;
    var dragging = false, lastX = 0, lastY = 0, dragRY = 0, dragRX = 0;

    function toNDC(e) {
      var rect = host.getBoundingClientRect();
      return {
        nx: ((e.clientX - rect.left) / rect.width) * 2 - 1,
        ny: -((e.clientY - rect.top) / rect.height) * 2 + 1
      };
    }

    host.addEventListener("mousemove", function (e) {
      var ndc = toNDC(e);
      if (dragging) {
        dragRY += (e.clientX - lastX) * 0.006;
        dragRX += (e.clientY - lastY) * 0.005;
        dragRX = Math.max(-0.6, Math.min(0.6, dragRX));
        lastX = e.clientX; lastY = e.clientY;
      } else {
        targetRY = ndc.nx * 0.35;
        targetRX = ndc.ny * 0.12;
      }
      // 悬停光斑投射到人体中面
      hoverGlow.position.set(ndc.nx * 0.32, 1.0 + ndc.ny * 0.7, 0.35);
      hoverGlow.material.opacity = 0.7;
    }, { passive: true });

    host.addEventListener("mousedown", function (e) {
      dragging = true; lastX = e.clientX; lastY = e.clientY;
      host.style.cursor = "grabbing";
    });
    window.addEventListener("mouseup", function () {
      dragging = false; host.style.cursor = "grab";
    });
    host.addEventListener("mouseleave", function () {
      targetRY = 0; targetRX = 0; hoverGlow.material.opacity = 0;
      dragging = false; host.style.cursor = "grab";
    });
    host.style.cursor = "grab";

    host.addEventListener("wheel", function (e) {
      e.preventDefault();
      camDist += e.deltaY * 0.0025;
      camDist = Math.max(2.6, Math.min(6.5, camDist));
    }, { passive: false });

    // 点击脉冲
    host.addEventListener("click", function () {
      human.userData.pulse = 1.0;
    });

    /* ---------- 渲染循环 ---------- */
    var clock = new THREE.Clock();
    var running = true;
    function tick() {
      if (!running) return;
      requestAnimationFrame(tick);
      var t = clock.getElapsedTime();

      // 旋转合成：拖拽 + 视差 + 微呼吸
      var ry = dragRY + targetRY + Math.sin(t * 0.12) * 0.05;
      var rx = dragRX + targetRX;
      rotY += (ry - rotY) * 0.06;
      rotX += (rx - rotX) * 0.06;
      human.rotation.y = rotY;
      human.rotation.x = rotX;
      human.position.y = Math.sin(t * 0.45) * 0.025;

      // 点击脉冲缩放
      if (human.userData.pulse > 0) {
        var s = 1.12 + human.userData.pulse * 0.12;
        human.scale.set(s, s, s);
        human.userData.pulse *= 0.88;
        if (human.userData.pulse < 0.01) human.userData.pulse = 0;
      } else {
        human.scale.set(1.12, 1.12, 1.12);
      }

      // 相机缩放
      camera.position.z += (camDist - camera.position.z) * 0.08;
      camera.lookAt(0, 1.0, 0);

      // 血流粒子
      flows.forEach(function (f) {
        var arr = f.geo.attributes.position.array;
        for (var i = 0; i < f.fd.n; i++) {
          var p = (i / f.fd.n + t * f.fd.speed + f.offset) % 1;
          var v = f.fd.curve.getPoint(p);
          arr[i * 3] = v.x; arr[i * 3 + 1] = v.y; arr[i * 3 + 2] = v.z;
        }
        f.geo.attributes.position.needsUpdate = true;
      });

      // 核心脉动
      core.material.opacity = 0.55 + Math.sin(t * 2.2) * 0.28;
      var cs = 0.5 + Math.sin(t * 2.2) * 0.06;
      core.scale.set(cs, cs, 1);
      halo1.rotation.z = t * 0.42;
      halo2.rotation.z = -t * 0.30;
      var bs = 1 + Math.sin(t * 1.8) * 0.06;
      base.scale.set(bs, bs, 1);
      base.material.opacity = 0.16 + Math.sin(t * 1.8) * 0.07;

      // 扫描面上下扫动
      scan.position.y = 0.1 + ((Math.sin(t * 0.6) + 1) / 2) * 1.7;
      scan.material.opacity = 0.08 + Math.sin(t * 0.6) * 0.03;

      // 悬停光斑缓隐
      if (!dragging) hoverGlow.material.opacity *= 0.96;

      renderer.render(scene, camera);
    }
    tick();

    document.addEventListener("visibilitychange", function () {
      running = !document.hidden;
      if (running) { clock.getDelta(); tick(); }
    });

    window.addEventListener("resize", function () {
      var w = host.clientWidth, h = host.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });

    return { scene: scene, renderer: renderer };
  }

  window.SPORTSCI_HERO = { init: init };
})();
