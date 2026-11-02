/* ============================================================
   SPORTSCI RESEARCH — 胸廓形态力学 3D 仿真模块
   全息线框风格：10 对肋骨椭圆环 + 胸骨/脊柱 + 膈肌穹顶
   暴露 window.RibcageSim.init(canvas) -> { update(params), setBreathPhaseCallback(fn) }
   依赖：vendor/three.min.js（全局 THREE r128）
   ============================================================ */
(function () {
  "use strict";

  var REDUCED = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function init(canvas) {
    if (typeof THREE === "undefined" || !canvas) return null;

    var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(42, 1, 0.1, 50);
    camera.position.set(0, 0.55, 3.1);
    camera.lookAt(0, 0.35, 0);

    var group = new THREE.Group();
    scene.add(group);

    /* ---------- 参数状态 ---------- */
    var params = {
      rr: 12,               // 呼吸频率 次/分
      tv: 600,              // 潮气量 ml
      thoraxIndex: 0.75,    // 前后径/横径
      bucketRatio: 60,      // 桶柄权重 %
      diaphragmRatio: 70    // 膈肌贡献 %
    };

    /* ---------- 肋骨（10 对水平椭圆环） ---------- */
    var RIB_N = 10;
    var ribDefs = [];
    // rx 轮廓：0.42 渐增到 0.62 再收到 0.50
    var rxProfile = [0.42, 0.50, 0.56, 0.60, 0.62, 0.61, 0.58, 0.55, 0.52, 0.50];
    for (var i = 0; i < RIB_N; i++) {
      ribDefs.push({
        y: 0.9 - i * (1.0 / (RIB_N - 1)), // 0.9 -> -0.1
        rx: rxProfile[i]
      });
    }

    var ribMat = new THREE.LineBasicMaterial({
      color: 0xff4fe3, transparent: true, opacity: 0.55,
      blending: THREE.AdditiveBlending, depthWrite: false
    });
    var boneMat = new THREE.LineBasicMaterial({
      color: 0xb026c9, transparent: true, opacity: 0.7
    });

    var ribs = [];      // LineLoop 数组
    var ribDots = null; // 每肋前端发光点（Points，统一一个 geometry）

    function ellipsePoints(rx, rz, seg) {
      var curve = new THREE.EllipseCurve(0, 0, rx, rz, 0, Math.PI * 2, false, 0);
      var pts2 = curve.getPoints(seg || 72);
      var arr = new Float32Array(pts2.length * 3);
      for (var k = 0; k < pts2.length; k++) {
        arr[k * 3] = pts2[k].x;
        arr[k * 3 + 1] = 0;
        arr[k * 3 + 2] = pts2[k].y; // 椭圆 y 轴 -> 场景 z 轴（前后径）
      }
      return arr;
    }

    function buildRibcage() {
      // 清理旧结构
      for (var r = 0; r < ribs.length; r++) {
        group.remove(ribs[r]);
        ribs[r].geometry.dispose();
      }
      ribs = [];
      if (ribDots) { group.remove(ribDots); ribDots.geometry.dispose(); ribDots.material.dispose(); ribDots = null; }

      var dotPos = new Float32Array(RIB_N * 3);
      for (var i = 0; i < RIB_N; i++) {
        var def = ribDefs[i];
        var rz = def.rx * params.thoraxIndex;
        var geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.BufferAttribute(ellipsePoints(def.rx, rz), 3));
        var loop = new THREE.LineLoop(geo, ribMat);
        loop.position.y = def.y;
        loop.userData.baseY = def.y;
        group.add(loop);
        ribs.push(loop);
        // 前端发光点（z 正方向）
        dotPos[i * 3] = 0;
        dotPos[i * 3 + 1] = def.y;
        dotPos[i * 3 + 2] = rz;
      }
      var dg = new THREE.BufferGeometry();
      dg.setAttribute("position", new THREE.BufferAttribute(dotPos, 3));
      ribDots = new THREE.Points(dg, new THREE.PointsMaterial({
        size: 0.045, color: 0xff9df2, transparent: true, opacity: 0.85,
        blending: THREE.AdditiveBlending, depthWrite: false
      }));
      group.add(ribDots);

      buildBones();
    }

    /* ---------- 胸骨（前）与脊柱（后） ---------- */
    var bones = [];
    function buildBones() {
      for (var b = 0; b < bones.length; b++) {
        group.remove(bones[b]);
        bones[b].geometry.dispose();
      }
      bones = [];
      var frontRz = ribDefs[3].rx * params.thoraxIndex; // 参考中部肋骨
      var backRz = frontRz;

      var sternumGeo = new THREE.BufferGeometry();
      sternumGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array([
        0, 0.92, frontRz * 1.0,
        0, 0.30, frontRz * 0.98
      ]), 3));
      var sternum = new THREE.Line(sternumGeo, boneMat);
      group.add(sternum); bones.push(sternum);

      var spineGeo = new THREE.BufferGeometry();
      spineGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array([
        0, 1.02, -backRz * 1.02,
        0, -0.28, -backRz * 1.02
      ]), 3));
      var spine = new THREE.Line(spineGeo, boneMat);
      group.add(spine); bones.push(spine);

      // 胸椎横突短刻线（视觉锚点）
      for (var i = 0; i < RIB_N; i++) {
        var rz = ribDefs[i].rx * params.thoraxIndex;
        var tickGeo = new THREE.BufferGeometry();
        tickGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array([
          0, ribDefs[i].y, -backRz * 1.02,
          0, ribDefs[i].y, -rz
        ]), 3));
        var tick = new THREE.Line(tickGeo, boneMat);
        group.add(tick); bones.push(tick);
      }
    }

    /* ---------- 膈肌（上半穹顶 wireframe） ---------- */
    var diaGeo = new THREE.SphereGeometry(0.55, 24, 10, 0, Math.PI * 2, 0, Math.PI / 2);
    var diaMat = new THREE.MeshBasicMaterial({
      color: 0x3de8ff, transparent: true, opacity: 0.3,
      wireframe: true, blending: THREE.AdditiveBlending, depthWrite: false
    });
    var diaphragm = new THREE.Mesh(diaGeo, diaMat);
    var DIA_BASE_Y = -0.28;
    diaphragm.position.y = DIA_BASE_Y;
    diaphragm.scale.set(1.0, 0.6, 0.9);
    group.add(diaphragm);

    buildRibcage();

    /* ---------- 鼠标拖拽旋转 ---------- */
    var dragging = false, lastX = 0, lastY = 0;
    canvas.addEventListener("pointerdown", function (e) {
      dragging = true; lastX = e.clientX; lastY = e.clientY;
      canvas.setPointerCapture && canvas.setPointerCapture(e.pointerId);
    });
    canvas.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      var dx = e.clientX - lastX, dy = e.clientY - lastY;
      lastX = e.clientX; lastY = e.clientY;
      group.rotation.y += dx * 0.005;
      group.rotation.x += dy * 0.005;
      if (group.rotation.x > 0.9) group.rotation.x = 0.9;
      if (group.rotation.x < -0.9) group.rotation.x = -0.9;
    });
    function endDrag() { dragging = false; }
    canvas.addEventListener("pointerup", endDrag);
    canvas.addEventListener("pointercancel", endDrag);

    /* ---------- 呼吸相位 ---------- */
    var phaseCb = null;
    var clock = new THREE.Clock();

    // 吸气占 40%，吸气段 0->1 平滑：(1-cos(π·p))/2，呼气镜像
    function inspirationAmount(t) {
      var period = 60 / params.rr; // 秒/周期
      var p = (t % period) / period;
      var inDur = 0.4;
      var ins;
      if (p < inDur) {
        ins = (1 - Math.cos(Math.PI * (p / inDur))) / 2;
      } else {
        var q = (p - inDur) / (1 - inDur);
        ins = (1 + Math.cos(Math.PI * q)) / 2;
      }
      return ins;
    }

    function tick() {
      requestAnimationFrame(tick);
      var t = clock.getElapsedTime();
      if (!dragging && !REDUCED) group.rotation.y += 0.0015;

      var ins = REDUCED ? 0.4 : inspirationAmount(t);
      var bucket = params.bucketRatio / 100;
      var pump = 1 - bucket;
      var expand = 0.04 * bucket * ins;            // 桶柄横向扩张（最大 +4%）
      var lift = 0.05 * pump * ins;                // 泵柄整体抬升
      var tilt = (Math.PI / 180) * 2 * pump * ins; // 泵柄外旋（最大 2°）

      for (var i = 0; i < ribs.length; i++) {
        var w = 1 - i / (RIB_N - 1); // 上位肋泵柄更明显，下位肋桶柄更明显
        var lat = expand * (0.4 + 0.6 * (1 - w));
        ribs[i].scale.set(1 + lat, 1, 1 + lat);
        ribs[i].position.y = ribs[i].userData.baseY + lift * (0.4 + 0.6 * w);
        ribs[i].rotation.x = -tilt * (0.4 + 0.6 * w);
      }

      // 膈肌：吸气下移 + 压扁
      var excursion = 0.12 * (params.tv / 600) * (params.diaphragmRatio / 70);
      diaphragm.position.y = DIA_BASE_Y - excursion * ins;
      diaphragm.scale.y = 0.6 * (1 - 0.45 * ins);
      diaphragm.scale.x = 1.0 * (1 + 0.06 * ins);
      diaphragm.scale.z = 0.9 * (1 + 0.06 * ins);

      if (phaseCb) phaseCb(ins);

      // 尺寸自适应
      var wpx = canvas.clientWidth, hpx = canvas.clientHeight;
      if (canvas.width !== Math.floor(wpx * renderer.getPixelRatio()) ||
          canvas.height !== Math.floor(hpx * renderer.getPixelRatio())) {
        renderer.setSize(wpx, hpx, false);
        camera.aspect = wpx / hpx;
        camera.updateProjectionMatrix();
      }

      renderer.render(scene, camera);
    }

    renderer.setSize(canvas.clientWidth || 600, canvas.clientHeight || 420, false);
    camera.aspect = (canvas.clientWidth || 600) / (canvas.clientHeight || 420);
    camera.updateProjectionMatrix();
    tick();

    return {
      update: function (p) {
        if (!p) return;
        var rebuild = (p.thoraxIndex !== undefined && p.thoraxIndex !== params.thoraxIndex);
        for (var k in p) { if (p.hasOwnProperty(k)) params[k] = p[k]; }
        if (rebuild) buildRibcage();
      },
      setBreathPhaseCallback: function (fn) { phaseCb = fn; }
    };
  }

  window.RibcageSim = { init: init };
})();
