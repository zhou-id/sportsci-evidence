/* ============================================================
   SPORTSCI RESEARCH — 训练计划与周期化中心
   教学模板生成器：4 周为一中周期，末周减载
   ============================================================ */
(function () {
  "use strict";

  var PROFILES = {
    hypertrophy: { name: "肌肥大", i0: 65, i1: 82, r0: 10, r1: 6, sets: 12, aerobic: "2 × 25 min 低强度有氧", note: "每肌群 10–20 组/周，RIR 1–3" },
    strength:    { name: "最大力量", i0: 75, i1: 92, r0: 6, r1: 2, sets: 10, aerobic: "2 × 20 min 低强度有氧", note: "主项 3–5 组，组间休息 3–5 min" },
    endurance:   { name: "肌耐力", i0: 55, i1: 70, r0: 15, r1: 8, sets: 12, aerobic: "4 × 30–40 min Zone 2", note: "以总训练时长与动作质量为先" },
    fatloss:     { name: "减脂体成分", i0: 60, i1: 75, r0: 12, r1: 8, sets: 11, aerobic: "4 × 30 min 低冲击有氧", note: "保留力量刺激，能量缺口温和" },
    performance: { name: "运动表现", i0: 70, i1: 90, r0: 8, r1: 3, sets: 10, aerobic: "3 × 30 min + 2 次跳跃/冲刺", note: "力量与功率并重，重视动作速度" }
  };

  var LEVEL = {
    novice: { mul: 0.75, label: "新手" },
    intermediate: { mul: 1.0, label: "中级" },
    advanced: { mul: 1.15, label: "进阶" }
  };

  var SPLITS = {
    2: [["全身 A", "蹲 / 推 / 拉"], ["全身 B", "髋铰链 / 拉 / 核心"]],
    3: [["推", "胸肩三头"], ["拉", "背二头"], ["腿", "股四头 / 腘绳 / 小腿"]],
    4: [["上肢 · 推", "卧推 / 肩推 / 三头"], ["下肢", "深蹲 / RDL / 小腿"], ["上肢 · 拉", "引体 / 划船 / 二头"], ["下肢", "硬拉 / 箭步 / 核心"]],
    5: [["推", "胸肩三头"], ["拉", "背二头"], ["腿", "蹲类主导"], ["上肢综合", "推拉交替"], ["下肢综合", "髋膝联动"]],
    6: [["推 A", "重卧推"], ["拉 A", "重划船"], ["腿 A", "重深蹲"], ["推 B", "肩推主导"], ["拉 B", "引体主导"], ["腿 B", "硬拉 / 单腿"]]
  };

  var chart = null;

  function $(id) { return document.getElementById(id); }

  function fmt(n, d) { return (Math.round(n * Math.pow(10, d || 0)) / Math.pow(10, d || 0)).toString(); }

  function buildWeek(w, weeks, p, level) {
    var block = Math.floor((w - 1) / 4);
    var progress = weeks > 1 ? (w - 1) / (weeks - 1) : 0;
    var deload = (w % 4 === 0);
    var intensity = p.i0 + (p.i1 - p.i0) * progress;
    if (deload) intensity -= 7;
    intensity = Math.min(97, Math.max(45, intensity));

    var sets = p.sets * (1 + 0.12 * block) * level.mul;
    if (deload) sets *= 0.6;
    sets = Math.max(4, Math.round(sets));

    var reps = p.r0 + (p.r1 - p.r0) * progress;
    reps = Math.max(1, Math.round(reps));

    var phase;
    if (deload) phase = "减载周";
    else if (block === 0) phase = "基础适应";
    else if (block === 1) phase = "容量积累";
    else if (block === 2) phase = "强度强化";
    else phase = "峰值巩固";

    var perSet = Math.max(2, Math.round(sets / 3));
    var note;
    if (deload) note = "容量降约 40%，保留动作质量与轻技术练习";
    else if (w === 1) note = "建立动作模式，记录起始负荷";
    else if (block >= 3) note = "强度接近峰值，减少非必要辅助动作";
    else note = "完成目标次数且 RIR ≥2 时，下周可小幅加重";

    return {
      week: w, phase: phase, intensity: intensity, reps: reps, sets: sets, perSet: perSet,
      aerobic: deload ? "1–2 次轻松有氧 / 主动恢复" : p.aerobic, note: note, deload: deload
    };
  }

  function renderSummary(rows, weeks, days, levelLabel, goalName) {
    var peak = Math.max.apply(null, rows.map(function (r) { return r.intensity; }));
    var maxSets = Math.max.apply(null, rows.map(function (r) { return r.sets; }));
    $("pl-summary").innerHTML = [
      ["目标", goalName],
      ["周期", weeks + " 周 · " + days + " 天/周"],
      ["峰值强度", "≈" + fmt(peak, 0) + "% 1RM"],
      ["峰值容量", maxSets + " 组/肌群·周"]
    ].map(function (x, i) {
      return '<div class="card ' + (i < 2 ? "tone-a" : "tone-b") + '">' +
        '<div class="sk">' + x[0] + "</div><div class=\"sv\">" + x[1] + "</div></div>";
    }).join("");
    $("pl-split-note").textContent = levelLabel + "水平 · 共 " + days + " 个训练日";
  }

  function renderSplit(days) {
    var arr = SPLITS[days] || SPLITS[4];
    $("pl-split").innerHTML = arr.map(function (d, i) {
      return '<div class="card tone-b"><div class="pd">DAY ' + (i + 1) + "</div>" +
        '<div class="pf">' + d[0] + '</div><div class="pp">' + d[1] + "</div></div>";
    }).join("");
  }

  function renderTable(rows) {
    $("pl-body").innerHTML = rows.map(function (r) {
      var style = r.deload ? ' style="opacity:0.72"' : "";
      return "<tr" + style + "><td><span class=\"t-title\">W" + r.week + "</span></td>" +
        "<td>" + r.phase + "</td>" +
        "<td>" + fmt(r.intensity, 0) + "%</td>" +
        "<td>" + r.perSet + " × " + r.reps + "</td>" +
        "<td>" + r.sets + "</td>" +
        "<td>" + r.aerobic + "</td>" +
        '<td class="tiny">' + r.note + "</td></tr>";
    }).join("");
  }

  function drawChart(rows) {
    var box = $("pl-chart");
    if (!box || !window.SPORTSCI_CHARTS) return;
    if (!chart) chart = SPORTSCI_CHARTS.init(box);
    if (!chart) return;
    chart.resize();
    chart.setOption({
      grid: { left: 52, right: 58, top: 30, bottom: 34 },
      legend: { data: ["每周组数", "强度 %1RM"], top: 0 },
      tooltip: { trigger: "axis" },
      xAxis: { type: "category", data: rows.map(function (r) { return "W" + r.week; }), axisLabel: { interval: 0 } },
      yAxis: [
        { type: "value", name: "组数", min: 0, max: 30 },
        { type: "value", name: "%1RM", min: 40, max: 100, splitLine: { show: false } }
      ],
      series: [
        { name: "每周组数", type: "bar", data: rows.map(function (r) { return r.sets; }), barWidth: "42%",
          itemStyle: { borderRadius: [4, 4, 0, 0], color: { type: "linear", x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: "#ff4fe3" }, { offset: 1, color: "rgba(255,79,227,0.18)" }] } } },
        { name: "强度 %1RM", type: "line", yAxisIndex: 1, data: rows.map(function (r) { return Math.round(r.intensity); }),
          lineStyle: { color: "#3de8ff", width: 2 }, itemStyle: { color: "#3de8ff" }, symbol: "circle", symbolSize: 6, smooth: true }
      ]
    });
  }

  function generate() {
    var goal = $("pl-goal").value;
    var weeks = +$("pl-weeks").value;
    var days = +$("pl-days").value;
    var level = $("pl-level").value;
    var p = PROFILES[goal] || PROFILES.hypertrophy;
    var lv = LEVEL[level] || LEVEL.intermediate;

    $("pl-weeks-view").textContent = weeks;
    $("pl-weeks-val").textContent = weeks + " 周";
    $("pl-days-val").textContent = days + " 天";

    var rows = [];
    for (var w = 1; w <= weeks; w++) rows.push(buildWeek(w, weeks, p, lv));

    renderSummary(rows, weeks, days, lv.label, p.name);
    renderSplit(days);
    renderTable(rows);
    drawChart(rows);
  }

  function bindTabs() {
    var bar = $("pl-tabs");
    if (!bar) return;
    Array.prototype.forEach.call(bar.querySelectorAll(".tab"), function (btn) {
      btn.addEventListener("click", function () {
        Array.prototype.forEach.call(bar.querySelectorAll(".tab"), function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        var pane = btn.getAttribute("data-pane");
        Array.prototype.forEach.call(document.querySelectorAll(".pl-pane"), function (p) { p.classList.remove("active"); });
        var target = $("pl-" + pane);
        if (target) target.classList.add("active");
        if (pane === "gen" && chart) chart.resize();
      });
    });
  }

  function init() {
    if (!$("pl-body")) return;
    ["pl-goal", "pl-weeks", "pl-days", "pl-level"].forEach(function (id) {
      var el = $(id);
      if (!el) return;
      el.addEventListener("input", generate);
      el.addEventListener("change", generate);
    });
    bindTabs();
    generate();
    window.addEventListener("resize", function () { if (chart) chart.resize(); });
  }

  window.SPORTSCI_PLAN = { init: init, profiles: PROFILES, splits: SPLITS };
})();
