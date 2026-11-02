/* ============================================================
   SPORTSCI RESEARCH — 科研工具站逻辑
   1 效应量 | 2 Mini Meta(森林图/漏斗图/Egger) | 3 GRADE | 4 PEDro
   纯本地计算，SVG 手绘图表，无外部依赖
   ============================================================ */
(function () {
  "use strict";

  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function fmt(v, d) { return (Math.round(v * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d); }
  // 标准正态累积分布（教学近似）
  function normCDF(z) {
    var t = 1 / (1 + 0.2316419 * Math.abs(z));
    var p = 0.3989423 * Math.exp(-z * z / 2) * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return z > 0 ? 1 - p : p;
  }

  /* ---------- Tab ---------- */
  Array.prototype.forEach.call(document.querySelectorAll("#tl-tabs .tab"), function (t) {
    t.addEventListener("click", function () {
      document.querySelectorAll("#tl-tabs .tab").forEach(function (x) { x.classList.remove("active"); });
      t.classList.add("active");
      document.querySelectorAll(".tl-pane").forEach(function (p) { p.classList.remove("active"); });
      $("tl-" + t.getAttribute("data-pane")).classList.add("active");
    });
  });

  /* ================= 1 效应量 ================= */
  function runES() {
    var m1 = +$("es-m1").value, s1 = +$("es-s1").value, n1 = +$("es-n1").value;
    var m2 = +$("es-m2").value, s2 = +$("es-s2").value, n2 = +$("es-n2").value;
    if (!(s1 > 0 && s2 > 0 && n1 > 1 && n2 > 1)) {
      $("es-d").textContent = "—"; $("es-g").textContent = "—";
      $("es-mag").textContent = "输入无效"; $("es-note").textContent = "请检查：标准差须 > 0，样本量须 ≥ 2。";
      return;
    }
    var sp = Math.sqrt(((n1 - 1) * s1 * s1 + (n2 - 1) * s2 * s2) / (n1 + n2 - 2));
    var d = (m1 - m2) / sp;
    var df = n1 + n2 - 2;
    var J = 1 - 3 / (4 * df - 1);
    var g = J * d;
    var a = Math.abs(d);
    var mag = a < 0.2 ? "微弱效应" : a < 0.5 ? "小效应" : a < 0.8 ? "中效应" : "大效应";
    $("es-d").textContent = fmt(d, 2);
    $("es-g").textContent = fmt(g, 2);
    $("es-mag").textContent = mag;
    $("es-note").textContent =
      "合并标准差 SDpooled = " + fmt(sp, 2) + "；小样本校正因子 J = " + fmt(J, 3) + "（df = " + df + "）。" +
      (d >= 0 ? "实验组高于对照组。" : "实验组低于对照组。") +
      "建议报告 95% CI 并结合最小重要变化（SWC）做量级推断。";
  }
  ["es-m1", "es-s1", "es-n1", "es-m2", "es-s2", "es-n2"].forEach(function (id) {
    $(id).addEventListener("input", runES);
  });
  runES();

  /* ================= 2 Mini Meta ================= */
  function parseMeta() {
    var lines = $("meta-input").value.split("\n");
    var studies = [];
    lines.forEach(function (ln) {
      var parts = ln.split(/[,，]/);
      if (parts.length < 3) return;
      var name = parts[0].trim();
      var yi = parseFloat(parts[1]), sei = parseFloat(parts[2]);
      if (name && isFinite(yi) && isFinite(sei) && sei > 0) studies.push({ name: name, yi: yi, sei: sei });
    });
    return studies;
  }

  function dlMeta(st) {
    var k = st.length;
    var w = st.map(function (s) { return 1 / (s.sei * s.sei); });
    var sw = w.reduce(function (a, b) { return a + b; }, 0);
    var fe = st.reduce(function (a, s, i) { return a + w[i] * s.yi; }, 0) / sw;
    var Q = st.reduce(function (a, s, i) { return a + w[i] * (s.yi - fe) * (s.yi - fe); }, 0);
    var df = k - 1;
    var sw2 = w.reduce(function (a, b) { return a + b * b; }, 0);
    var C = sw - sw2 / sw;
    var tau2 = Math.max(0, (Q - df) / C);
    var wr = st.map(function (s) { return 1 / (s.sei * s.sei + tau2); });
    var swr = wr.reduce(function (a, b) { return a + b; }, 0);
    var pool = st.reduce(function (a, s, i) { return a + wr[i] * s.yi; }, 0) / swr;
    var sePool = Math.sqrt(1 / swr);
    var I2 = Q > 0 ? Math.max(0, (Q - df) / Q) * 100 : 0;
    // Egger：SND = a + b·precision 的 OLS，检验截距 a
    var x = st.map(function (s) { return 1 / s.sei; });
    var y = st.map(function (s) { return s.yi / s.sei; });
    var mx = x.reduce(function (a, b) { return a + b; }, 0) / k;
    var my = y.reduce(function (a, b) { return a + b; }, 0) / k;
    var sxx = 0, sxy = 0;
    for (var i = 0; i < k; i++) { sxx += (x[i] - mx) * (x[i] - mx); sxy += (x[i] - mx) * (y[i] - my); }
    var b = sxx > 0 ? sxy / sxx : 0;
    var a0 = my - b * mx;
    var rss = 0;
    for (var j = 0; j < k; j++) { var r = y[j] - (a0 + b * x[j]); rss += r * r; }
    var seA = k > 2 && sxx > 0 ? Math.sqrt((rss / (k - 2)) * (1 / k + mx * mx / sxx)) : NaN;
    var tEg = isFinite(seA) && seA > 0 ? a0 / seA : 0;
    var pEg = 2 * (1 - normCDF(Math.abs(tEg)));
    return {
      k: k, pool: pool, lo: pool - 1.96 * sePool, hi: pool + 1.96 * sePool,
      Q: Q, df: df, tau2: tau2, I2: I2, eggerP: pEg, w: wr, swr: swr
    };
  }

  function forestSVG(st, m) {
    var W = 660, rh = 34, top = 18, bot = 64, H = top + st.length * rh + bot;
    var lo = Math.min(m.lo, Math.min.apply(null, st.map(function (s) { return s.yi - 1.96 * s.sei; })));
    var hi = Math.max(m.hi, Math.max.apply(null, st.map(function (s) { return s.yi + 1.96 * s.sei; })));
    var pad = (hi - lo) * 0.08; lo -= pad; hi += pad;
    var x0 = 170, x1 = W - 30;
    function X(v) { return x0 + (v - lo) / (hi - lo) * (x1 - x0); }
    var maxW = Math.max.apply(null, m.w);
    var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg" font-family="inherit">';
    s += '<line x1="' + X(m.pool) + '" y1="' + (top - 6) + '" x2="' + X(m.pool) + '" y2="' + (top + st.length * rh + 8) + '" stroke="rgba(194,168,120,0.4)" stroke-dasharray="4 4"/>';
    s += '<line x1="' + X(0) + '" y1="' + (top - 6) + '" x2="' + X(0) + '" y2="' + (top + st.length * rh + 8) + '" stroke="rgba(120,160,200,0.3)" stroke-dasharray="2 4"/>';
    st.forEach(function (e, i) {
      var y = top + i * rh + rh / 2;
      var cLo = e.yi - 1.96 * e.sei, cHi = e.yi + 1.96 * e.sei;
      var sq = 5 + 9 * (m.w[i] / maxW);
      s += '<text x="4" y="' + (y + 4) + '" fill="#a08cc0" font-size="11">' + esc(e.name) + "</text>";
      s += '<line x1="' + X(cLo) + '" y1="' + y + '" x2="' + X(cHi) + '" y2="' + y + '" stroke="#3de8ff" stroke-width="1.2"/>';
      s += '<rect x="' + (X(e.yi) - sq / 2) + '" y="' + (y - sq / 2) + '" width="' + sq + '" height="' + sq + '" fill="#3de8ff" opacity="0.85"/>';
      s += '<text x="' + (x1 + 2) + '" y="' + (y + 4) + '" fill="#66567e" font-size="9">' + fmt(e.yi, 2) + " [" + fmt(cLo, 2) + "," + fmt(cHi, 2) + "]</text>";
    });
    var dy = top + st.length * rh + 12;
    var hw = Math.max(6, (X(m.hi) - X(m.lo)) / 2);
    s += '<polygon points="' + X(m.lo) + "," + dy + " " + X(m.pool) + "," + (dy - 8) + " " + X(m.hi) + "," + dy + " " + X(m.pool) + "," + (dy + 8) + '" fill="none" stroke="#ffb54d" stroke-width="1.4"/>';
    s += '<text x="4" y="' + (dy + 4) + '" fill="#ffb54d" font-size="11">合并效应 (RE)</text>';
    s += '<text x="4" y="' + (H - 8) + '" fill="#66567e" font-size="10">k=' + m.k + " · τ²=" + fmt(m.tau2, 3) + " · I²=" + fmt(m.I2, 1) + "% · Q=" + fmt(m.Q, 2) + " (df=" + m.df + ")</text>";
    return s + "</svg>";
  }

  function funnelSVG(st, m) {
    var W = 660, H = 300, x0 = 50, x1 = W - 30, y0 = 16, y1 = H - 34;
    var lo = Math.min(m.lo, Math.min.apply(null, st.map(function (s) { return s.yi; }))) - 0.2;
    var hi = Math.max(m.hi, Math.max.apply(null, st.map(function (s) { return s.yi; }))) + 0.2;
    var seMax = Math.max.apply(null, st.map(function (s) { return s.sei; })) * 1.15;
    function X(v) { return x0 + (v - lo) / (hi - lo) * (x1 - x0); }
    function Y(se) { return y0 + (se / seMax) * (y1 - y0); }
    var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg">';
    s += '<line x1="' + X(m.pool) + '" y1="' + y0 + '" x2="' + X(m.pool) + '" y2="' + y1 + '" stroke="#ffb54d" stroke-width="1" stroke-dasharray="4 4"/>';
    s += '<line x1="' + X(m.pool - 1.96 * seMax) + '" y1="' + Y(seMax) + '" x2="' + X(m.pool) + '" y2="' + Y(0) + '" stroke="rgba(111,195,223,0.35)" stroke-width="1" stroke-dasharray="3 3"/>';
    s += '<line x1="' + X(m.pool + 1.96 * seMax) + '" y1="' + Y(seMax) + '" x2="' + X(m.pool) + '" y2="' + Y(0) + '" stroke="rgba(111,195,223,0.35)" stroke-width="1" stroke-dasharray="3 3"/>';
    st.forEach(function (e) {
      s += '<circle cx="' + X(e.yi) + '" cy="' + Y(e.sei) + '" r="4" fill="#3de8ff" opacity="0.85"><title>' + esc(e.name) + "</title></circle>";
    });
    s += '<text x="' + ((x0 + x1) / 2 - 30) + '" y="' + (H - 8) + '" fill="#66567e" font-size="10">效应量 →</text>';
    s += '<text x="6" y="' + (y0 + 8) + '" fill="#66567e" font-size="10">SE↓(高精度在上)</text>';
    return s + "</svg>";
  }

  function runMeta() {
    var st = parseMeta();
    if (st.length < 2) {
      $("meta-pool").textContent = "—"; $("meta-ci").textContent = "—";
      $("meta-i2").textContent = "—"; $("meta-egger").textContent = "—";
      $("meta-forest").innerHTML = '<div class="tiny" style="padding:20px">至少需要 2 条有效研究数据（每行：名称, 效应量, SE）。</div>';
      $("meta-funnel").innerHTML = "";
      return;
    }
    var m = dlMeta(st);
    $("meta-pool").textContent = fmt(m.pool, 2);
    $("meta-ci").textContent = "[" + fmt(m.lo, 2) + ", " + fmt(m.hi, 2) + "]";
    $("meta-i2").textContent = fmt(m.I2, 0) + "%";
    $("meta-egger").textContent = "p ≈ " + (m.eggerP < 0.001 ? "<0.001" : fmt(m.eggerP, 3));
    $("meta-forest").innerHTML = forestSVG(st, m);
    $("meta-funnel").innerHTML = funnelSVG(st, m);
  }
  $("meta-run").addEventListener("click", runMeta);
  $("meta-demo").addEventListener("click", function () {
    $("meta-input").value = $("meta-input").defaultValue;
    runMeta();
  });
  runMeta();

  /* ================= 3 GRADE ================= */
  var gradeStart = 4;
  var GRADE_LABEL = { 4: "高 ⊕⊕⊕⊕", 3: "中 ⊕⊕⊕", 2: "低 ⊕⊕", 1: "极低 ⊕" };
  Array.prototype.forEach.call(document.querySelectorAll("#grade-start .chip"), function (c) {
    c.addEventListener("click", function () {
      document.querySelectorAll("#grade-start .chip").forEach(function (x) { x.classList.remove("active"); });
      c.classList.add("active");
      gradeStart = c.getAttribute("data-v") === "high" ? 4 : 2;
      runGrade();
    });
  });
  function runGrade() {
    var down = 0, up = 0;
    document.querySelectorAll("#tl-grade .gd").forEach(function (c) { if (c.checked) down++; });
    document.querySelectorAll("#tl-grade .gu").forEach(function (c) { if (c.checked) up++; });
    var appliedUp = gradeStart === 2 ? up : 0;
    var lv = Math.max(1, Math.min(4, gradeStart - down + appliedUp));
    $("grade-out").textContent = GRADE_LABEL[lv];
    $("grade-out").style.color = { 4: "#ff9df2", 3: "#3de8ff", 2: "#ffb54d", 1: "#ff4d6d" }[lv];
    $("grade-note").textContent =
      "起点 " + (gradeStart === 4 ? "高（RCT）" : "低（观察性）") + " · 降级 " + down + " 项 · 升级 " + appliedUp + " 项" +
      (gradeStart === 4 && up > 0 ? "（RCT 起点不适用升级）" : "") + "。GRADE 强调对「证据体」而非单项研究评级，推荐强度还需结合获益-负担平衡。";
  }
  document.querySelectorAll("#tl-grade input").forEach(function (c) { c.addEventListener("change", runGrade); });
  runGrade();

  /* ================= 4 PEDro ================= */
  var PEDRO_ITEMS = [
    ["纳入标准明确说明", false],
    ["受试者随机分配至各组", true],
    ["分配方案隐藏", true],
    ["各组基线特征相似", true],
    ["对受试者施盲", true],
    ["对实施干预的治疗师施盲", true],
    ["对评估者施盲（关键结局）", true],
    ["至少 85% 受试者完成随访测量", true],
    ["意向性治疗分析（ITT）", true],
    ["组间统计比较（关键结局）", true],
    ["提供点估计与变异性指标", true]
  ];
  $("pedro-items").innerHTML = PEDRO_ITEMS.map(function (it, i) {
    return '<label class="tl-check"><input type="checkbox" class="pd" data-i="' + i + '"' + (it[1] ? "" : " disabled") + '>' +
      "<span>" + (i + 1) + ". " + esc(it[0]) + (it[1] ? "" : ' <span class="tiny">（不计入总分）</span>') + "</span></label>";
  }).join("");
  function runPedro() {
    var score = 0;
    document.querySelectorAll("#tl-pedro .pd").forEach(function (c) { if (c.checked && !c.disabled) score++; });
    $("pedro-score").textContent = score + " / 10";
    var tier = $("pedro-tier"), note;
    if (score >= 7) { tier.className = "grade-badge badge-a"; tier.textContent = "高质量"; note = "方法学质量较高：结果可信度较好，仍建议结合 RoB 2 做领域级偏倚评估。"; }
    else if (score >= 5) { tier.className = "grade-badge badge-b"; tier.textContent = "中等质量"; note = "存在若干方法学局限（常见缺口：盲法与分配隐藏），解释结果时保持谨慎。"; }
    else { tier.className = "grade-badge badge-c"; tier.textContent = "较低质量"; note = "多项关键条目未满足，偏倚风险较高；建议仅作探索性参考。"; }
    $("pedro-note").textContent = note;
  }
  document.querySelectorAll("#tl-pedro .pd").forEach(function (c) { c.addEventListener("change", runPedro); });
  runPedro();

  /* ================= 5 宏量营养素 ================= */
  function runMacro() {
    var bw = +$("mc-bw").value, bf = +$("mc-bf").value, pro = +$("mc-pro").value;
    $("mc-bw-val").textContent = bw;
    $("mc-bf-val").textContent = bf + "%";
    $("mc-pro-val").textContent = pro.toFixed(1);
    var goal = $("mc-goal").value, act = +$("mc-act").value;

    var ffm = bw * (1 - bf / 100);
    var rmr = 370 + 21.6 * ffm;
    var tdee = rmr * act;
    var adj = goal === "cut" ? -500 : goal === "gain" ? 300 : 0;
    var kcal = Math.max(1200, tdee + adj);

    var proG = pro * bw;
    var proK = proG * 4;
    var fatK = Math.max(kcal * 0.22, 0.8 * bw * 9); // 下限：总能量22% 或 0.8g/kg
    if (fatK > kcal * 0.35) fatK = kcal * 0.35;
    var fatG = fatK / 9;
    var choG = Math.max(0, (kcal - proK - fatK) / 4);

    $("mc-kcal").textContent = Math.round(kcal);
    $("mc-pro-g").textContent = Math.round(proG);
    $("mc-cho-g").textContent = Math.round(choG);
    $("mc-fat-g").textContent = Math.round(fatG);
    $("mc-note").textContent =
      "RMR ≈ " + Math.round(rmr) + " kcal（Katch-McArdle，FFM " + ffm.toFixed(1) + " kg）· TDEE ≈ " + Math.round(tdee) +
      " kcal × 目标修正 " + (adj > 0 ? "+" : "") + adj + " kcal。蛋白 " + pro.toFixed(1) + " g/kg · 脂肪 " +
      Math.round(fatK / kcal * 100) + "% 能量 · 碳水填充剩余" +
      (goal === "cut" ? "。减脂期建议配合抗阻训练并监控 EA ≥30（见智能评估模块）" : "") +
      (goal === "gain" ? "。盈余期碳水可在大负荷训练日上调 20–30%（周期化供能）" : "") + "。";
  }
  ["mc-bw", "mc-bf", "mc-pro"].forEach(function (id) { $(id).addEventListener("input", runMacro); });
  ["mc-goal", "mc-act"].forEach(function (id) { $(id).addEventListener("change", runMacro); });
  runMacro();

  /* ================= 6 1RM-RPE 负荷换算 ================= */
  var RPE_PCT = [100, 95.5, 92.2, 89.2, 86.3, 83.7, 81.1, 78.6, 76.2, 73.9, 71.7, 69.4]; // n@RPE10
  function runRPE() {
    var orm = +$("rpe-1rm").value;
    if (!(orm > 0)) { $("rpe-table").innerHTML = "<tr><td colspan='5'>请输入有效 1RM</td></tr>"; return; }
    var rows = "";
    for (var n = 1; n <= 10; n++) {
      var p10 = RPE_PCT[n - 1];
      var p9 = RPE_PCT[Math.min(n, 11)];     // ≈ n+1 次力竭
      var p8 = RPE_PCT[Math.min(n + 1, 11)]; // ≈ n+2 次力竭
      function kg(p) { return (Math.round(orm * p / 100 / 1.25) * 1.25).toFixed(1); }
      rows += "<tr><td>" + n + "</td><td class='num'>" + p10 + "%</td><td class='num'><b>" + kg(p10) +
        "</b></td><td class='num'>" + kg(p9) + "</td><td class='num'>" + kg(p8) + "</td></tr>";
    }
    $("rpe-table").innerHTML = rows;
  }
  $("rpe-1rm").addEventListener("input", runRPE);
  runRPE();

  /* ================= 7 周期化计划生成 ================= */
  function runPlan() {
    var model = $("pl-model").value;
    var weeks = +$("pl-weeks").value;
    var freq = +$("pl-freq").value;
    var start = +$("pl-start").value;
    var orm = +$("pl-1rm").value;
    $("pl-weeks-val").textContent = weeks;
    $("pl-start-val").textContent = start + "%";
    if (!(orm > 0)) orm = 100;
    function kg(p) { return (Math.round(orm * p / 100 / 2.5) * 2.5).toFixed(1); }
    function repsFor(p) { return p <= 70 ? 10 : p <= 77.5 ? 8 : p <= 85 ? 6 : p <= 90 ? 5 : 3; }

    var rows = "";
    for (var i = 1; i <= weeks; i++) {
      var phase = "", p = start, sets = 4, note = "", last = i === weeks;
      var deload = model !== "block" && i % 4 === 0 && !last;

      if (model === "linear") {
        p = Math.min(92.5, start + 2.5 * (i - 1));
        phase = p < 75 ? "适应期" : p < 85 ? "强化期" : "峰值期";
        if (deload) { p = 60; sets = 3; note = "减量周 · 容量 −40%"; phase = "减量"; }
        else if (last) { p = Math.min(95, p + 2.5); sets = 3; note = "末周冲顶 / 可测新 1RM"; }
      } else if (model === "dup") {
        var base = Math.min(88, start + 1.5 * (i - 1));
        p = base;
        phase = "波动周";
        sets = 4;
        note = "日内波动：D1 " + kg(base + 5) + "kg×5 · D2 " + kg(base - 7.5) + "kg×10 · D3 " + kg(Math.max(50, base - 20)) + "kg×3 爆发";
        if (freq < 3) note = "2 日版：D1 力量 " + kg(base + 5) + "kg×5 · D2 肥大 " + kg(base - 7.5) + "kg×10";
        if (deload) { p = 60; sets = 3; note = "减量周 · 各日均降强度"; phase = "减量"; }
        else if (last) { p = Math.min(95, base + 7.5); sets = 2; note = "末周减量冲顶"; }
      } else {
        var third = weeks / 3;
        if (i <= third) { phase = "累积板块"; p = Math.min(77.5, start - 5 + (i / third) * 7.5); sets = 4; note = "高容量积累 4×" + repsFor(p); }
        else if (i <= third * 2) { phase = "强化板块"; p = Math.min(87.5, 75 + ((i - third) / third) * 10); sets = 4; note = "强度主导 4×" + repsFor(p); }
        else { phase = "实现板块"; p = Math.min(92.5, 85 + ((i - third * 2) / third) * 7.5); sets = 3; note = "低容量高强度 3×" + repsFor(p); }
        if (last) { p = 60; sets = 2; note = "减量峰值周 · 周末测试"; phase = "峰值"; }
      }
      var reps = repsFor(p);
      rows += "<tr><td>W" + i + "</td><td>" + phase + "</td><td class='num'>" + p.toFixed(1) + "%</td>" +
        "<td class='num'>" + kg(p) + "</td><td class='num'>" + sets + " × " + reps + "</td><td>" + (note || "按 RPE 7–9 执行") + "</td></tr>";
    }
    $("pl-table").innerHTML = rows;
    $("pl-sub").textContent =
      { linear: "线性模型：强度每周 +2.5%，次数渐降", dup: "DUP：每周 " + freq + " 课内力量/肥大/爆发轮换", block: "板块模型：三等分周期，逐板块聚焦单一适应" }[model] +
      " · 参考 1RM = " + orm + " kg";
  }
  ["pl-weeks", "pl-start"].forEach(function (id) { $(id).addEventListener("input", runPlan); });
  ["pl-model", "pl-freq"].forEach(function (id) { $(id).addEventListener("change", runPlan); });
  $("pl-1rm").addEventListener("input", runPlan);
  runPlan();
})();
