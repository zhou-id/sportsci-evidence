/* ============================================================
   SPORTSCI RESEARCH — 生理可视化仿真页面逻辑
   面板1 心肺负荷动力学 | 面板2 胸廓形态力学(接 RibcageSim)
   面板3 肌肥大剂量-反应 | 面板4 Banister 疲劳-适应模型
   面板5 咖啡因药代动力学 | 面板6 能量平衡与体成分
   依赖：charts.js (SPORTSCI_CHARTS)、ribcage.js (RibcageSim)
   ============================================================ */
(function () {
  "use strict";

  function $(id) { return document.getElementById(id); }
  function clamp(v, lo, hi) { return Math.min(hi, Math.max(lo, v)); }
  // 分段线性插值查表
  function lut(points, x) {
    if (x <= points[0][0]) return points[0][1];
    for (var i = 1; i < points.length; i++) {
      if (x <= points[i][0]) {
        var p0 = points[i - 1], p1 = points[i];
        return p0[1] + (p1[1] - p0[1]) * (x - p0[0]) / (p1[0] - p0[0]);
      }
    }
    return points[points.length - 1][1];
  }
  function bindSlider(id, valId, fmt, onChange) {
    var el = $(id), out = $(valId);
    function show() { out.textContent = fmt(el.value); }
    el.addEventListener("input", function () { show(); onChange(); });
    show();
  }

  /* ================= Tab 切换 ================= */
  var ribcage = null, thoraxChart = null;
  Array.prototype.forEach.call(document.querySelectorAll("#sim-tabs .tab"), function (t) {
    t.addEventListener("click", function () {
      document.querySelectorAll("#sim-tabs .tab").forEach(function (x) { x.classList.remove("active"); });
      t.classList.add("active");
      var name = t.getAttribute("data-sim");
      document.querySelectorAll(".sim-pane").forEach(function (p) { p.classList.remove("active"); });
      $("sim-" + name).classList.add("active");
      if (name === "thorax" && !ribcage) initThorax();
      [cardioChart, muscleChart, fatigueChart, thoraxChart, pkChart, energyChart].forEach(function (c) { c && c.resize(); });
    });
  });

  /* ================= 面板1 心肺负荷 ================= */
  var cardioChart = SPORTSCI_CHARTS.init($("cardio-chart"));
  var ZONES = [
    { name: "Z1 恢复",     hi: 60,  color: "rgba(180,140,255,0.05)" },
    { name: "Z2 有氧基础", hi: 70,  color: "rgba(61,232,255,0.06)" },
    { name: "Z3 有氧耐力", hi: 80,  color: "rgba(255,79,227,0.07)" },
    { name: "Z4 阈强度",   hi: 90,  color: "rgba(255,181,77,0.08)" },
    { name: "Z5 最大摄氧", hi: 101, color: "rgba(255,77,109,0.08)" }
  ];

  function cardioParams() {
    return {
      age: +$("cardio-age").value,
      hrrest: +$("cardio-hrrest").value,
      intensity: +$("cardio-intensity").value,
      mode: $("cardio-mode").value,
      work: +$("cardio-work").value,
      rec: +$("cardio-rec").value,
      sets: +$("cardio-sets").value,
      dur: +$("cardio-dur").value
    };
  }

  function runCardio() {
    var p = cardioParams();
    var hrmax = 220 - p.age;
    $("cardio-hrmax-view").textContent = hrmax;
    $("cardio-interval-block").classList.toggle("u-hidden", p.mode !== "interval");

    var hrss = clamp(hrmax * p.intensity / 100, p.hrrest + 5, hrmax);
    var dt = 2, T = p.dur * 60;
    var hr = p.hrrest, t = 0;
    var data = [], trimp = 0, peak = 0, sum = 0, n = 0;
    var zoneTime = [0, 0, 0, 0, 0];

    while (t <= T) {
      var target = hrss, tau = 30;
      if (p.mode === "interval") {
        var cyc = p.work + p.rec;
        var pos = t % cyc;
        var setIdx = Math.floor(t / cyc);
        if (setIdx < p.sets) {
          if (pos < p.work) { target = hrss; tau = 25; }
          else { target = p.hrrest + 0.35 * (hrss - p.hrrest); tau = 45; }
        } else { target = p.hrrest; tau = 45; }
      }
      hr = target + (hr - target) * Math.exp(-dt / tau);
      t += dt;
      data.push([+(t / 60).toFixed(3), Math.round(hr * 10) / 10]);
      var ratio = clamp((hr - p.hrrest) / (hrmax - p.hrrest), 0, 1);
      trimp += (dt / 60) * ratio * 0.64 * Math.exp(1.92 * ratio);
      peak = Math.max(peak, hr); sum += hr; n++;
      var pct = hr / hrmax * 100;
      for (var z = 0; z < ZONES.length; z++) {
        if (pct < ZONES[z].hi) { zoneTime[z] += dt; break; }
      }
    }

    var domIdx = zoneTime.indexOf(Math.max.apply(null, zoneTime));
    $("cardio-stat-peak").textContent = Math.round(peak);
    $("cardio-stat-avg").textContent = Math.round(sum / n);
    $("cardio-stat-trimp").textContent = Math.round(trimp);
    $("cardio-stat-zone").textContent = ZONES[domIdx].name;

    var lo = 50, span = 50;
    cardioChart.setOption({
      tooltip: { trigger: "axis", valueFormatter: function (v) { return v + " 次/分"; } },
      grid: { left: 46, right: 18, top: 18, bottom: 34 },
      xAxis: { type: "value", name: "min", min: 0, max: Math.ceil(T / 60), axisLabel: { fontSize: 10 } },
      yAxis: { type: "value", min: Math.floor(hrmax * lo / 100), max: Math.ceil(hrmax * (lo + span) / 100), axisLabel: { fontSize: 10 } },
      series: [{
        name: "心率", type: "line", data: data, showSymbol: false, smooth: true,
        lineStyle: { width: 2, color: "#ff4fe3" },
        areaStyle: { color: "rgba(255,79,227,0.10)" },
        markLine: {
          silent: true, symbol: "none",
          label: { fontSize: 10, color: "#a08cc0" },
          data: [{ yAxis: hrss, lineStyle: { color: "#ffb54d", type: "dashed" }, label: { formatter: "HRss" } }]
        },
        markArea: {
          silent: true, data: ZONES.map(function (zn, i) {
            var y0 = hrmax * (i === 0 ? lo : ZONES[i - 1].hi) / 100;
            var y1 = hrmax * zn.hi / 100;
            return [{ yAxis: y0, itemStyle: { color: zn.color }, label: { show: false } }, { yAxis: y1 }];
          })
        }
      }]
    }, true);
  }

  /* ================= 面板2 胸廓形态力学 ================= */
  function thoraxParams() {
    return {
      rr: +$("thorax-rr").value, tv: +$("thorax-tv").value,
      thoraxIndex: +$("thorax-index").value,
      bucketRatio: +$("thorax-bucket").value,
      diaphragmRatio: +$("thorax-diaphragm").value
    };
  }

  function inspirationAmount(t, rr) {
    var period = 60 / rr, p = (t % period) / period, inDur = 0.4;
    if (p < inDur) return (1 - Math.cos(Math.PI * (p / inDur))) / 2;
    var q = (p - inDur) / (1 - inDur);
    return (1 + Math.cos(Math.PI * q)) / 2;
  }

  function initThorax() {
    ribcage = window.RibcageSim ? RibcageSim.init($("ribcage-canvas")) : null;
    thoraxChart = SPORTSCI_CHARTS.init($("thorax-chart"));
    runThorax();
  }

  function runThorax() {
    var p = thoraxParams();
    if (!thoraxChart) return;
    if (ribcage) ribcage.update(p);
    $("thorax-index-hint").classList.toggle("u-hidden", p.thoraxIndex <= 0.9);

    var period = 60 / p.rr, T2 = period * 2, data = [], t = 0;
    while (t <= T2) { data.push([+t.toFixed(2), Math.round(p.tv * inspirationAmount(t, p.rr))]); t += period / 40; }

    thoraxChart.setOption({
      tooltip: { trigger: "axis", valueFormatter: function (v) { return v + " ml"; } },
      grid: { left: 46, right: 18, top: 14, bottom: 30 },
      xAxis: { type: "value", name: "s", min: 0, max: +T2.toFixed(1), axisLabel: { fontSize: 10 } },
      yAxis: { type: "value", min: 0, axisLabel: { fontSize: 10 } },
      series: [{
        name: "肺容积变化", type: "line", data: data, showSymbol: false, smooth: true,
        lineStyle: { width: 2, color: "#3de8ff" },
        areaStyle: { color: "rgba(61,232,255,0.12)" },
        markArea: {
          silent: true,
          data: [0, 1].map(function (k) {
            return [{ xAxis: +(k * period).toFixed(2), itemStyle: { color: "rgba(255,79,227,0.05)" }, label: { show: true, fontSize: 9, color: "#66567e", formatter: "吸气" } },
                    { xAxis: +(k * period + 0.4 * period).toFixed(2) }];
          })
        }
      }]
    }, true);

    var ve = p.rr * p.tv / 1000;
    var dia = 1.8 * (p.tv / 600) * (p.diaphragmRatio / 70);
    var bucket = p.bucketRatio, pump = 100 - bucket;
    $("thorax-stat-ve").textContent = ve.toFixed(1);
    $("thorax-stat-dia").textContent = dia.toFixed(1);
    $("thorax-stat-split").textContent = pump + "% / " + bucket + "%";
    $("thorax-stat-index").textContent =
      p.thoraxIndex > 0.9 ? "桶状胸特征" : (p.thoraxIndex < 0.7 ? "扁平胸倾向" : "正常范围(教学)");
  }

  /* ================= 面板3 肌肥大剂量-反应 ================= */
  var muscleChart = SPORTSCI_CHARTS.init($("muscle-chart"));
  var VOL_LUT = [[0,0],[2,0.35],[6,0.65],[10,0.85],[12,1.0],[16,1.08],[20,1.10],[24,1.08],[30,1.02]];
  var LOAD_LUT = [[30,0.55],[40,0.72],[55,0.86],[65,0.95],[75,1.0],[85,1.0],[90,0.95]];
  var RIR_LUT = [[0,1.0],[1,0.98],[2,0.95],[3,0.85],[4,0.7],[5,0.55]];
  var FREQ_LUT = [[1,0.9],[2,1.0],[3,1.02],[4,1.03]];
  var LEVEL_BASE = { novice: 0.95, inter: 0.5, adv: 0.26 };

  function muscleParams() {
    return {
      sets: +$("muscle-sets").value, load: +$("muscle-load").value,
      freq: +$("muscle-freq").value, rir: +$("muscle-rir").value,
      level: $("muscle-level").value
    };
  }

  function projectMuscle(p) {
    var weekly0 = LEVEL_BASE[p.level] *
      lut(VOL_LUT, p.sets) * lut(LOAD_LUT, p.load) *
      lut(RIR_LUT, p.rir) * lut(FREQ_LUT, p.freq);
    var cum = 0, series = [];
    for (var w = 1; w <= 12; w++) {
      cum += weekly0 * Math.exp(-0.12 * (w - 1));
      series.push([w, +cum.toFixed(2)]);
    }
    return { weekly0: weekly0, total: cum, series: series };
  }

  function runMuscle() {
    var p = muscleParams();
    var cur = projectMuscle(p);
    var ref = projectMuscle({ sets: 12, load: 75, freq: 2, rir: 2, level: p.level });

    muscleChart.setOption({
      tooltip: { trigger: "axis", valueFormatter: function (v) { return "+" + v + " %"; } },
      legend: { bottom: 0, textStyle: { color: "#a08cc0", fontSize: 11 } },
      grid: { left: 46, right: 18, top: 18, bottom: 52 },
      xAxis: { type: "value", name: "周", min: 1, max: 12, minInterval: 1, axisLabel: { fontSize: 10 } },
      yAxis: { type: "value", name: "CSA 累积 %", axisLabel: { fontSize: 10 } },
      series: [
        { name: "当前参数", type: "line", data: cur.series, showSymbol: false, smooth: true,
          lineStyle: { width: 2.4, color: "#ff4fe3" }, areaStyle: { color: "rgba(255,79,227,0.10)" } },
        { name: "参考最优(12组/75%/2次/RIR2)", type: "line", data: ref.series, showSymbol: false, smooth: true,
          lineStyle: { width: 1.4, color: "#ffb54d", type: "dashed" } }
      ]
    }, true);

    var vol = p.sets < 6 ? "低容量" : p.sets < 10 ? "中容量" : p.sets < 20 ? "高容量" : "很高(接近上限)";
    $("muscle-stat-gain").textContent = "+" + cur.total.toFixed(1) + "%";
    $("muscle-stat-vol").textContent = p.sets + " 组/周 · " + vol;
    $("muscle-stat-tier").textContent =
      "剂量-反应判读：周容量 " + p.sets + " 组（容量因子 " + lut(VOL_LUT, p.sets).toFixed(2) +
      "），负荷 " + p.load + "%1RM（负荷因子 " + lut(LOAD_LUT, p.load).toFixed(2) +
      "），RIR " + p.rir + "（因子 " + lut(RIR_LUT, p.rir).toFixed(2) + "）。";
    $("muscle-stat-advice").textContent =
      p.sets < 6 ? "提示：当前容量低于多数 Meta 分析的高收益区间（≥10 组/周/肌群），可考虑逐步递增组数。" :
      p.sets >= 20 ? "提示：容量已接近收益递减平台，优先检查恢复、蛋白质摄入（≈1.6 g/kg/d）与渐进超负荷质量。" :
      p.rir >= 4 ? "提示：平均 RIR 偏高，低负荷训练时刺激可能不足，可将部分组推近力竭（RIR 0–2）。" :
      p.load < 50 && p.rir > 2 ? "提示：低负荷需更靠近力竭才能获得与高负荷相近的肥大刺激（Lasevicius 2022）。" :
      "参数处于证据支持的有效区间，保持渐进超负荷与充分恢复。";
  }

  /* ================= 面板4 疲劳累积模型 ================= */
  var fatigueChart = SPORTSCI_CHARTS.init($("fatigue-chart"));
  var DEFAULT_LOADS = [250, 280, 310, 340, 380, 420, 460, 500];

  function buildWeekSliders() {
    var box = $("fatigue-weeks");
    box.innerHTML = DEFAULT_LOADS.map(function (v, i) {
      return '<div class="slider-row">' +
        '<span class="tiny" style="min-width:34px">W' + (i + 1) + "</span>" +
        '<input type="range" class="slider" id="fw-' + i + '" min="0" max="800" step="10" value="' + v + '">' +
        '<output class="slider-val num" id="fw-' + i + '-val">' + v + "</output></div>";
    }).join("");
    DEFAULT_LOADS.forEach(function (v, i) {
      $("fw-" + i).addEventListener("input", function () {
        $("fw-" + i + "-val").textContent = this.value;
        runFatigue();
      });
    });
  }

  function runFatigue() {
    var tauc = +$("fatigue-tauc").value, taua = +$("fatigue-taua").value;
    var weeks = DEFAULT_LOADS.map(function (v, i) { return +$("fw-" + i).value; });
    var taper = $("fatigue-taper").checked;
    var plan = weeks.slice();
    if (taper) plan.push(Math.round(weeks[7] * 0.6), Math.round(weeks[7] * 0.45));

    var ctl = 200, atl = 200;
    var days = [], ctlS = [], atlS = [], tsbS = [];
    var dayIdx = 0, weekAtlPeak = 0, atlMax = -1;
    for (var w = 0; w < plan.length; w++) {
      for (var d = 0; d < 7; d++) {
        var load = plan[w] / 7;
        ctl += (load - ctl) / tauc;
        atl += (load - atl) / taua;
        dayIdx++;
        ctlS.push([dayIdx, Math.round(ctl)]);
        atlS.push([dayIdx, Math.round(atl)]);
        tsbS.push([dayIdx, Math.round(ctl - atl)]);
      }
      if (atl > atlMax && w < 8) { atlMax = atl; weekAtlPeak = w + 1; }
    }

    var d56 = 55;
    $("fatigue-stat-ctl").textContent = ctlS[d56][1];
    $("fatigue-stat-atl").textContent = atlS[d56][1];
    var tsb8 = tsbS[d56][1];
    $("fatigue-stat-tsb").textContent = (tsb8 > 0 ? "+" : "") + tsb8;
    $("fatigue-stat-peak").textContent = "W" + weekAtlPeak;

    var spikes = [];
    for (var k = 1; k < 8; k++) {
      if (weeks[k - 1] > 0 && weeks[k] / weeks[k - 1] > 1.5) spikes.push("W" + k + "→W" + (k + 1));
    }
    var warnEl = $("fatigue-warn");
    if (spikes.length) {
      warnEl.classList.remove("u-hidden");
      warnEl.textContent = "负荷骤增提示：" + spikes.join("、") + "（相邻周比 > 1.5）。渐进递增原则建议周增幅控制在约 5–10%（Gabbett 2016）。";
    } else warnEl.classList.add("u-hidden");

    $("fatigue-stat-taper").textContent = taper
      ? "减量期结束（第 10 周）TSB = " + (tsbS[tsbS.length - 1][1] > 0 ? "+" : "") + tsbS[tsbS.length - 1][1] +
        "，ATL 消退快于 CTL，理论竞技状态回升。"
      : "勾选「追加减量期」可观察 TSB 回升与竞技状态窗口。";

    fatigueChart.setOption({
      tooltip: { trigger: "axis" },
      legend: { bottom: 0, textStyle: { color: "#a08cc0", fontSize: 11 } },
      grid: { left: 44, right: 18, top: 18, bottom: 52 },
      xAxis: { type: "value", name: "天", min: 1, max: plan.length * 7, axisLabel: { fontSize: 10 } },
      yAxis: { type: "value", axisLabel: { fontSize: 10 } },
      series: [
        { name: "CTL 体能", type: "line", data: ctlS, showSymbol: false, smooth: 0.2, lineStyle: { width: 2.2, color: "#ff4fe3" } },
        { name: "ATL 疲劳", type: "line", data: atlS, showSymbol: false, smooth: 0.2, lineStyle: { width: 2, color: "#ff4d6d" } },
        { name: "TSB 状态", type: "line", data: tsbS, showSymbol: false, smooth: 0.2,
          lineStyle: { width: 1.6, color: "#3de8ff" }, areaStyle: { color: "rgba(61,232,255,0.06)" },
          markLine: { silent: true, symbol: "none", label: { show: false },
            data: [{ yAxis: 0, lineStyle: { color: "rgba(200,120,255,0.35)", type: "dashed" } }] } }
      ]
    }, true);
  }

  /* ================= 面板5 补剂药代动力学（咖啡因） ================= */
  var pkChart = SPORTSCI_CHARTS.init($("pk-chart"));

  function runPK() {
    var bw = +$("pk-bw").value, doseKg = +$("pk-dose").value;
    var half = +$("pk-half").value, ka = +$("pk-ka").value;
    var ke = Math.LN2 / half;
    var dose = doseKg * bw;              // mg
    var vd = 0.6 * bw;                   // L
    var coef = (0.99 * dose / vd) * (ka / (ka - ke)); // mg/L

    var data = [], cmax = 0, tmax = 0;
    for (var t = 0; t <= 12 * 60; t += 2) {
      var h = t / 60;
      var c = Math.max(0, coef * (Math.exp(-ke * h) - Math.exp(-ka * h)));
      if (c > cmax) { cmax = c; tmax = t; }
      data.push([+(h).toFixed(3), +c.toFixed(3)]);
    }
    var resid = cmax > 0 ? Math.round(data[data.length - 1][1] / cmax * 100) : 0;

    pkChart.setOption({
      tooltip: { trigger: "axis", valueFormatter: function (v) { return v + " mg/L"; } },
      grid: { left: 50, right: 18, top: 18, bottom: 34 },
      xAxis: { type: "value", name: "h", min: 0, max: 12, axisLabel: { fontSize: 10 } },
      yAxis: { type: "value", name: "mg/L", min: 0, axisLabel: { fontSize: 10 } },
      series: [{
        name: "血浆浓度", type: "line", data: data, showSymbol: false, smooth: true,
        lineStyle: { width: 2.2, color: "#b48cff" },
        areaStyle: { color: "rgba(180,140,255,0.10)" },
        markLine: {
          silent: true, symbol: "none",
          label: { fontSize: 10, color: "#a08cc0" },
          data: [{ xAxis: +(tmax / 60).toFixed(2), lineStyle: { color: "#ffb54d", type: "dashed" }, label: { formatter: "Tmax " + Math.round(tmax) + " min" } }]
        },
        markArea: {
          silent: true,
          data: [[{ xAxis: 0.5, itemStyle: { color: "rgba(255,79,227,0.06)" }, label: { show: true, fontSize: 9, color: "#ff9df2", position: "insideTop", formatter: "ISSN 推荐摄入窗口→运动" } }, { xAxis: 1 }]]
        }
      }]
    }, true);

    $("pk-stat-cmax").textContent = cmax.toFixed(2);
    $("pk-stat-tmax").textContent = Math.round(tmax);
    $("pk-stat-total").textContent = Math.round(dose);
    $("pk-stat-resid").textContent = resid + "%";
    $("pk-note").textContent =
      doseKg < 3 ? "当前剂量低于 ISSN 增效区间下限（3 mg/kg），增效效应可能不足。" :
      doseKg > 6 ? "剂量超过 6 mg/kg：增效收益不再增加，心悸/焦虑/胃肠不适等副作用风险上升（ISSN 2021）。" :
      "剂量处于 ISSN 推荐增效区间（3–6 mg/kg）。建议运动前约 60 min 摄入，使比赛/训练落在达峰附近；晚间训练者注意半衰期 " + half + " h 的睡眠残余影响。";
  }

  /* ================= 面板6 能量平衡与体成分 ================= */
  var energyChart = SPORTSCI_CHARTS.init($("en-chart"));

  function runEnergy() {
    var bw0 = +$("en-bw").value, bf0 = +$("en-bf").value;
    var bal = +$("en-def").value;        // kcal/d（负=缺口）
    var pro = +$("en-pro").value;
    var rt = $("en-rt").checked;

    // 去脂体重变化占体重变化的比例（缺口时为丢失，盈余时为增长）
    // 缺口越大→丢得越多；蛋白高+抗阻→丢得少
    var leanFrac;
    if (bal < 0) {
      leanFrac = 0.28
        * Math.min(1, Math.abs(bal) / 750)          // 缺口修正
        * (1 - Math.min(0.45, (pro - 0.8) / 1.6 * 0.45))  // 蛋白修正
        * (rt ? 0.6 : 1);                            // 抗阻修正
      leanFrac = clamp(leanFrac, 0.03, 0.35);
    } else {
      leanFrac = (rt ? 0.35 : 0.2) * (pro >= 1.6 ? 1 : 0.8); // 盈余期瘦体重增长占比
    }

    var weeks = 12;
    var bwS = [], fatS = [], ffmS = [];
    var fat = bw0 * bf0 / 100, ffm = bw0 - fat;
    bwS.push([0, +bw0.toFixed(2)]); fatS.push([0, +fat.toFixed(2)]); ffmS.push([0, +ffm.toFixed(2)]);
    for (var w = 1; w <= weeks; w++) {
      var dw = (bal * 7) / 7700;         // 周体重变化 kg（按脂肪能量密度近似）
      var dffm = dw * leanFrac;
      var dfat = dw - dffm;
      fat = Math.max(2, fat + dfat);
      ffm = Math.max(20, ffm + dffm);
      bwS.push([w, +(fat + ffm).toFixed(2)]);
      fatS.push([w, +fat.toFixed(2)]);
      ffmS.push([w, +ffm.toFixed(2)]);
    }
    var bwEnd = fat + ffm;
    var bfEnd = fat / bwEnd * 100;

    energyChart.setOption({
      tooltip: { trigger: "axis", valueFormatter: function (v) { return v + " kg"; } },
      legend: { bottom: 0, textStyle: { color: "#a08cc0", fontSize: 11 } },
      grid: { left: 46, right: 18, top: 18, bottom: 52 },
      xAxis: { type: "value", name: "周", min: 0, max: weeks, minInterval: 1, axisLabel: { fontSize: 10 } },
      yAxis: { type: "value", name: "kg", axisLabel: { fontSize: 10 } },
      series: [
        { name: "体重", type: "line", data: bwS, showSymbol: false, smooth: true, lineStyle: { width: 2.4, color: "#ff4fe3" }, areaStyle: { color: "rgba(255,79,227,0.08)" } },
        { name: "脂肪量", type: "line", data: fatS, showSymbol: false, smooth: true, lineStyle: { width: 1.8, color: "#ffb54d" } },
        { name: "去脂体重", type: "line", data: ffmS, showSymbol: false, smooth: true, lineStyle: { width: 1.8, color: "#3de8ff" } }
      ]
    }, true);

    var dBW = bwEnd - bw0, dFat = fat - bw0 * bf0 / 100, dFFM = bwEnd - fat - (bw0 - bw0 * bf0 / 100);
    $("en-stat-bw").textContent = (dBW > 0 ? "+" : "") + dBW.toFixed(1);
    $("en-stat-fat").textContent = (dFat > 0 ? "+" : "") + dFat.toFixed(1);
    $("en-stat-ffm").textContent = (dFFM > 0 ? "+" : "") + dFFM.toFixed(1);
    $("en-stat-bf").textContent = bfEnd.toFixed(1) + "%";

    var warnEl = $("en-warn"), msgs = [];
    if (bal <= -750) msgs.push("每日缺口 ≥750 kcal：去脂体重丢失风险与低能量可用性（RED-S）风险显著上升，建议缺口控制在约 300–500 kcal/d 并保证蛋白 ≥1.6 g/kg/d 与抗阻训练。");
    if (bal < 0 && pro < 1.2) msgs.push("缺口期蛋白摄入 <1.2 g/kg/d：去脂体重保护不足，建议提升至 1.6–2.4 g/kg/d（Morton 2018；ISSN 2017）。");
    if (bal < 0 && !rt) msgs.push("缺口期未结合抗阻训练：去脂体重丢失比例上升，建议每周 ≥2 次抗阻。");
    if (bal > 400) msgs.push("盈余 >400 kcal/d：体重增长将以脂肪为主；「干净增肌」建议盈余约 200–300 kcal/d 并配合渐进超负荷。");
    if (msgs.length) { warnEl.classList.remove("u-hidden"); warnEl.textContent = msgs.join(" "); }
    else warnEl.classList.add("u-hidden");
  }

  /* ================= 绑定 ================= */
  bindSlider("cardio-age", "cardio-age-val", function (v) { return v + " 岁"; }, runCardio);
  bindSlider("cardio-hrrest", "cardio-hrrest-val", function (v) { return v; }, runCardio);
  bindSlider("cardio-intensity", "cardio-intensity-val", function (v) { return v + "%"; }, runCardio);
  bindSlider("cardio-work", "cardio-work-val", function (v) { return v + " s"; }, runCardio);
  bindSlider("cardio-rec", "cardio-rec-val", function (v) { return v + " s"; }, runCardio);
  bindSlider("cardio-sets", "cardio-sets-val", function (v) { return v + " 组"; }, runCardio);
  bindSlider("cardio-dur", "cardio-dur-val", function (v) { return v + " min"; }, runCardio);
  $("cardio-mode").addEventListener("change", runCardio);

  bindSlider("thorax-rr", "thorax-rr-val", function (v) { return v; }, runThorax);
  bindSlider("thorax-tv", "thorax-tv-val", function (v) { return v; }, runThorax);
  bindSlider("thorax-index", "thorax-index-val", function (v) { return (+v).toFixed(2); }, runThorax);
  bindSlider("thorax-bucket", "thorax-bucket-val", function (v) { return v + "%"; }, runThorax);
  bindSlider("thorax-diaphragm", "thorax-diaphragm-val", function (v) { return v + "%"; }, runThorax);

  bindSlider("muscle-sets", "muscle-sets-val", function (v) { return v + " 组"; }, runMuscle);
  bindSlider("muscle-load", "muscle-load-val", function (v) { return v + "%"; }, runMuscle);
  bindSlider("muscle-freq", "muscle-freq-val", function (v) { return v + " 次"; }, runMuscle);
  bindSlider("muscle-rir", "muscle-rir-val", function (v) { return v; }, runMuscle);
  $("muscle-level").addEventListener("change", runMuscle);

  bindSlider("fatigue-tauc", "fatigue-tauc-val", function (v) { return v + " d"; }, runFatigue);
  bindSlider("fatigue-taua", "fatigue-taua-val", function (v) { return v + " d"; }, runFatigue);
  $("fatigue-taper").addEventListener("change", runFatigue);
  buildWeekSliders();

  bindSlider("pk-bw", "pk-bw-val", function (v) { return v + " kg"; }, runPK);
  bindSlider("pk-dose", "pk-dose-val", function (v) { return v + " mg/kg"; }, runPK);
  bindSlider("pk-half", "pk-half-val", function (v) { return v + " h"; }, runPK);
  bindSlider("pk-ka", "pk-ka-val", function (v) { return (+v).toFixed(1); }, runPK);

  bindSlider("en-bw", "en-bw-val", function (v) { return v + " kg"; }, runEnergy);
  bindSlider("en-bf", "en-bf-val", function (v) { return v + "%"; }, runEnergy);
  bindSlider("en-def", "en-def-val", function (v) { return (+v > 0 ? "+" : "−") + Math.abs(+v); }, runEnergy);
  bindSlider("en-pro", "en-pro-val", function (v) { return (+v).toFixed(1); }, runEnergy);
  $("en-rt").addEventListener("change", runEnergy);

  runCardio();
  runMuscle();
  runFatigue();
  runPK();
  runEnergy();
})();
