/* ============================================================
   SPORTSCI RESEARCH — 运动损伤智能评估页面逻辑
   1 肌肉拉伤筛查 | 2 胸痛红旗分诊 | 3 ACWR 监控 | 4 ACL 重返核查
   规则引擎权重基于公开循证文献的教学化设定
   ============================================================ */
(function () {
  "use strict";

  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;"); }

  /* ---------- Tab ---------- */
  var acwrChart = null;
  Array.prototype.forEach.call(document.querySelectorAll("#as-tabs .tab"), function (t) {
    t.addEventListener("click", function () {
      document.querySelectorAll("#as-tabs .tab").forEach(function (x) { x.classList.remove("active"); });
      t.classList.add("active");
      var name = t.getAttribute("data-pane");
      document.querySelectorAll(".as-pane").forEach(function (p) { p.classList.remove("active"); });
      $("as-" + name).classList.add("active");
      if (name === "acwr") {
        if (!acwrChart) acwrChart = SPORTSCI_CHARTS.init($("acwr-chart"));
        runACWR();
        acwrChart && acwrChart.resize();
      }
    });
  });

  function setBadge(el, level, text) {
    el.className = "as-risk " + level;
    el.textContent = text;
  }
  function recs(list) {
    return list.map(function (r) { return '<div class="as-rec">' + r + "</div>"; }).join("");
  }

  /* ---------- 1 肌肉拉伤 ---------- */
  function runStrain() {
    var age = +$("st-age").value;
    $("st-age-val").textContent = age;
    var score = 0;
    if (age >= 23) score += 1.5;
    if ($("st-hx").checked) score += 3.5;
    if ($("st-speed").checked) score += 2;
    if ($("st-fatigue").checked) score += 2;
    if ($("st-nordic").checked) score -= 3;
    score = Math.max(0, Math.min(10, Math.round(score * 10) / 10));
    $("st-score").textContent = score.toFixed(1);

    var badge = $("st-badge");
    if (score < 2.5) setBadge(badge, "risk-low", "低风险区间");
    else if (score < 5.5) setBadge(badge, "risk-mid", "中等风险");
    else setBadge(badge, "risk-high", "高风险");

    var r = [];
    if ($("st-hx").checked) r.push("<b>既往拉伤史</b>是最强单一预测因子：建议系统化的离心力量重建与重返专项前的渐进高速跑阶梯。");
    if (!$("st-nordic").checked) r.push("将<b>北欧腘绳肌练习</b>纳入每周 2 次力量课：Meta 分析显示可将拉伤率降低约 50%（van Dyk 2019）。");
    if ($("st-speed").checked) r.push("高速跑暴露须<b>渐进递增</b>，避免周间骤增；配合 ACWR 模块监控。");
    if ($("st-fatigue").checked) r.push("疲劳累积期应<b>下调高速跑与离心量</b>，优先恢复：睡眠、碳水补充与负荷减量。");
    if (age >= 23) r.push("年龄因素不可改变，但可通过更高的<b>力量储备</b>对冲：力量训练是损伤预防最强干预（Lauersen 2014，约 −66%）。");
    if (!r.length) r.push("当前画像风险较低：保持规律离心力量、渐进负荷与充足恢复即可。");
    $("st-recs").innerHTML = recs(r);
  }

  /* ---------- 2 胸痛红旗 ---------- */
  function runChest() {
    var rf = document.querySelectorAll("#as-chest .rf");
    var msf = document.querySelectorAll("#as-chest .msf");
    var rfN = 0, msN = 0;
    rf.forEach(function (c) { if (c.checked) rfN++; });
    msf.forEach(function (c) { if (c.checked) msN++; });
    var box = $("ch-result");
    if (rfN > 0) {
      box.innerHTML =
        '<div class="danger-zone"><b>检测到 ' + rfN + ' 项红旗症状。</b><br>' +
        '劳力性胸痛、晕厥/心悸、放射痛、不成比例呼吸困难或猝死家族史均提示需<b>优先排除心源性原因</b>。' +
        '请立即停止运动，尽快前往医院进行心电图、心肌酶/肌钙蛋白等评估；明确排除心肺问题后再考虑肌肉骨骼来源。</div>';
    } else if (msN >= 2) {
      box.innerHTML =
        '<div class="ok"><b>症状模式偏向肌肉骨骼来源</b>（按压可复现 / 呼吸相关 / 负荷史）。</div>' +
        '<div class="notice mt-16">可能涉及肋间肌拉伤或胸廓机械性疼痛，多为自限性：暂停诱发动作 1–2 周、呼吸模式评估、渐进恢复负荷。' +
        '若 2 周内无缓解或加重，仍需就医排查肋骨应力性损伤（划船/投掷人群参考 Karlson 1998）。</div>';
    } else if (msN === 1) {
      box.innerHTML =
        '<div class="warn"><b>线索不足。</b>存在一项肌肉骨骼特征但证据不充分。</div>' +
        '<div class="notice mt-16">建议补充按压复现测试与呼吸诱发测试；如疼痛与运动强度明确相关，按红旗流程就医。</div>';
    } else {
      box.innerHTML =
        '<div class="notice">请先在左侧勾选症状。任一项红旗症状都应优先就医排除心肺原因——这是本模块的最高原则。</div>';
    }
  }

  /* ---------- 3 ACWR ---------- */
  function runACWR() {
    var w = [0, 1, 2, 3].map(function (i) {
      var v = +$("aw-" + i).value;
      $("aw-" + i + "-val").textContent = v;
      return v;
    });
    var acute = w[3];
    var prior = (w[0] + w[1] + w[2]) / 3;
    var ratio = prior > 0 ? acute / prior : (acute > 0 ? 2.5 : 0);
    ratio = Math.round(ratio * 100) / 100;

    if (acwrChart) {
      acwrChart.setOption({
        grid: { left: 30, right: 30, top: 26, bottom: 20 },
        xAxis: { type: "value", min: 0, max: 2.2, splitNumber: 11, axisLabel: { fontSize: 10 } },
        yAxis: { type: "category", data: ["ACWR"], axisLabel: { fontSize: 11 } },
        series: [{
          type: "bar", barWidth: 22,
          data: [Math.min(ratio, 2.2)],
          itemStyle: {
            color: ratio < 0.8 ? "#b48cff" : ratio <= 1.3 ? "#3de8ff" : ratio <= 1.5 ? "#ffb54d" : "#ff4d6d",
            borderRadius: [0, 6, 6, 0]
          },
          label: { show: true, position: "right", formatter: ratio.toFixed(2), color: "#eeddfa", fontSize: 13 },
          markArea: {
            silent: true,
            data: [
              [{ xAxis: 0, itemStyle: { color: "rgba(180,140,255,0.06)" }, label: { show: true, position: "insideTop", fontSize: 9, color: "#66567e", formatter: "欠训练" } }, { xAxis: 0.8 }],
              [{ xAxis: 0.8, itemStyle: { color: "rgba(61,232,255,0.07)" }, label: { show: true, position: "insideTop", fontSize: 9, color: "#3de8ff", formatter: "安全区" } }, { xAxis: 1.3 }],
              [{ xAxis: 1.3, itemStyle: { color: "rgba(255,181,77,0.08)" }, label: { show: true, position: "insideTop", fontSize: 9, color: "#ffb54d", formatter: "注意" } }, { xAxis: 1.5 }],
              [{ xAxis: 1.5, itemStyle: { color: "rgba(255,77,109,0.10)" }, label: { show: true, position: "insideTop", fontSize: 9, color: "#ff4d6d", formatter: "高风险" } }, { xAxis: 2.2 }]
            ]
          }
        }]
      }, true);
    }

    var badge = $("acwr-badge"), r = [];
    if (ratio === 0 && acute === 0) { setBadge(badge, "risk-mid", "无负荷数据"); r.push("请输入近 4 周负荷。"); }
    else if (ratio < 0.8) {
      setBadge(badge, "risk-mid", "欠训练区间 < 0.8");
      r.push("本周负荷明显低于既往水平：长期低负荷会<b>削弱负荷承载力</b>，重返高强度时反而受伤（Gabbett 悖论）。");
    } else if (ratio <= 1.3) {
      setBadge(badge, "risk-low", "相对安全区 0.8–1.3");
      r.push("负荷递增节奏合理。建议周增幅继续控制在约 <b>5–10%</b>，维持高慢性负荷是保护因素。");
    } else if (ratio <= 1.5) {
      setBadge(badge, "risk-mid", "注意区 1.3–1.5");
      r.push("负荷增幅偏大：密切监控酸痛、睡眠与主观疲劳，必要时本周后半段减量 10–20%。");
    } else {
      setBadge(badge, "risk-high", "高风险区 > 1.5");
      r.push("<b>负荷骤增。</b>建议立即回调本周剩余训练量，下一周以不超过前三周均值 ×1.3 为目标重建递增节奏。");
    }
    $("acwr-recs").innerHTML = recs(r);
  }

  /* ---------- 4 ACL ---------- */
  function runACL() {
    var items = document.querySelectorAll("#as-acl .acl-c");
    var met = 0;
    items.forEach(function (c) { if (c.checked) met++; });
    $("acl-met").textContent = met + " / " + items.length;
    var badge = $("acl-badge"), r = [];
    if (met === items.length) {
      setBadge(badge, "risk-low", "达到重返标准");
      r.push("全部标准达标：队列证据显示此类运动员再损伤风险降低约 <b>84%</b>（Grindem 2016）。重返后仍建议 12 个月内维持神经肌肉训练。");
    } else if (met >= 4) {
      setBadge(badge, "risk-mid", "接近达标 · 暂缓高强度");
      r.push("已达标 " + met + "/6。未达标条目是重返决策的否决项——未满足 6 项出院标准者移植物断裂风险约为 <b>4 倍</b>（Kyritsis 2016）。");
      r.push("可参与限制性训练（直线跑、非接触技术），暂缓变向 / 对抗 / 比赛。");
    } else {
      setBadge(badge, "risk-high", "不建议重返运动");
      r.push("当前仅达标 " + met + "/6：请与康复团队针对未达标条目制定阶段目标（力量对称性 → 跳跃质量 → 心理就绪）。");
      r.push("时间不是充分条件：即使 ≥9 个月，也需功能标准达标方可重返。");
    }
    $("acl-recs").innerHTML = recs(r);
  }

  /* ---------- 5 PAR-Q+ ---------- */
  function runPARQ() {
    var items = document.querySelectorAll("#as-parq .pq");
    var yes = 0;
    items.forEach(function (c) { if (c.checked) yes++; });
    var age = +$("pq-age").value;
    $("pq-age-val").textContent = age;
    var box = $("pq-result");
    if (yes === 0) {
      box.innerHTML =
        '<div class="ok"><b>全部回答「否」：可直接起步。</b></div>' +
        '<div class="notice mt-16">按 PAR-Q+ 与 ACSM 更新版筛查逻辑（Riebe 2015），无症状人群无需强制医疗许可，' +
        '可从<b>中低强度</b>开始，遵循渐进原则（每周增量约 5–10%）。' +
        (age >= 45 ? '<br><b>年龄 ≥45 岁：</b>建议首 4 周以中低强度为主，监控晨起心率与血压，再逐步递增强度。' : "") +
        '<br>目标参照 WHO 2020 指南：每周 150–300 分钟中等强度 + 2 次力量训练。</div>';
    } else {
      box.innerHTML =
        '<div class="' + (yes >= 3 ? "danger-zone" : "warn") + '"><b>有 ' + yes + ' 项回答「是」：建议先咨询医疗专业人员。</b></div>' +
        '<div class="notice mt-16">PAR-Q+ 流程：任一「是」→ 进入针对性随访问题或由合格医务/运动专业人员评估，' +
        '明确安全强度上限后再制定计划。多数情况并非禁止运动，而是需要<b>个体化处方与医学监护下起步</b>。' +
        (age >= 45 ? '<br>叠加年龄因素，建议完成血压、静息心电图等基础检查后再递增负荷。' : "") +
        '</div>';
    }
  }

  /* ---------- 6 1RM 估算与力量评级 ---------- */
  var ORM_NORMS = {
    squat:    { m: [1.0, 1.5, 2.0, 2.5],  f: [0.75, 1.25, 1.75, 2.25] },
    bench:    { m: [0.75, 1.0, 1.5, 2.0], f: [0.4, 0.6, 0.9, 1.2] },
    deadlift: { m: [1.25, 1.75, 2.25, 2.75], f: [1.0, 1.5, 2.0, 2.5] },
    ohp:      { m: [0.5, 0.65, 0.9, 1.2], f: [0.3, 0.45, 0.6, 0.8] }
  };
  var ORM_TIERS = ["新手入门", "初级训练者", "中级训练者", "高级训练者", "精英水平"];
  var ORM_REPS = { 95: "1–2", 90: "3–4", 85: "5–6", 80: "7–8", 75: "9–10", 70: "11–12", 65: "14–15", 60: "17–18" };

  function runORM() {
    var w = +$("orm-w").value, r = +$("orm-r").value, bw = +$("orm-bw").value;
    $("orm-w-val").textContent = w;
    $("orm-r-val").textContent = r;
    $("orm-bw-val").textContent = bw;
    var ex = $("orm-ex").value, sex = $("orm-sex").value;

    var epley = w * (1 + r / 30);
    var brzycki = r >= 37 ? w : w * 36 / (37 - r);
    var lombardi = w * Math.pow(r, 0.10);
    var orm = (epley + brzycki + lombardi) / 3;
    $("orm-1rm").textContent = orm.toFixed(1);
    var ratio = orm / bw;
    $("orm-ratio").textContent = ratio.toFixed(2);

    var cuts = (ORM_NORMS[ex] || ORM_NORMS.squat)[sex] || ORM_NORMS.squat.m;
    var tier = 0;
    cuts.forEach(function (c) { if (ratio >= c) tier++; });
    setBadge($("orm-tier"), tier >= 2 ? "risk-low" : "risk-mid", ORM_TIERS[tier] + " · 教学常模 " + tier + "/4 档");

    $("orm-table").innerHTML = Object.keys(ORM_REPS).map(function (p) {
      var kg = Math.round(orm * p / 100 / 2.5) * 2.5;
      return "<tr><td>" + p + "%</td><td class='num'>" + kg.toFixed(1) + "</td><td>" + ORM_REPS[p] + "</td></tr>";
    }).join("");
  }

  /* ---------- 7 能量可用性 ---------- */
  function runEA() {
    var bw = +$("ea-bw").value, bf = +$("ea-bf").value;
    var ei = +$("ea-ei").value, eee = +$("ea-eee").value;
    $("ea-bw-val").textContent = bw;
    $("ea-bf-val").textContent = bf + "%";
    $("ea-ei-val").textContent = ei;
    $("ea-eee-val").textContent = eee;
    var ffm = bw * (1 - bf / 100);
    var ea = (ei - eee) / ffm;
    $("ea-val").textContent = ea.toFixed(1);
    var badge = $("ea-badge"), r = [];
    if (ea < 30) {
      setBadge(badge, "risk-high", "低能量可用性 LEA · RED-S 风险区 < 30");
      r.push("<b>内分泌与生殖轴抑制</b>、骨密度下降、免疫受损与训练适应受阻均与该区间相关（Mountjoy 2018/2023 IOC RED-S）。");
      r.push("优先<b>提高能量摄入</b>（尤其训练前后碳水）或短期下调训练量；目标先把 EA 拉回 30–45 区间。");
      r.push("若伴随月经紊乱、反复应力性损伤或持续疲劳，请转诊运动医学/运动营养专业人员。");
    } else if (ea < 45) {
      setBadge(badge, "risk-mid", "次优区间 30–45");
      r.push("可满足基础健康但可能限制高强度训练适应：增肌/大负荷周期建议提升至 ≥45。");
      r.push("关注<b>训练前后能量时机</b>：训练前碳水 + 训练后碳水-蛋白联合补充可减少低可用性时长。");
      r.push("定期监控体重趋势、静息心率与主观疲劳；若指标恶化按 LEA 流程处理。");
    } else {
      setBadge(badge, "risk-low", "充足区间 ≥ 45");
      r.push("能量可用性满足训练适应需求：维持当前摄入-消耗结构，大负荷周期可再评估。");
      r.push("减脂期如需制造缺口，建议温和缺口（300–500 kcal/d）并保证蛋白 ≥1.6 g/kg/d，避免跌入 <30 区间。");
    }
    r.push("FFM ≈ " + ffm.toFixed(1) + " kg（由体重与体脂率估算）。");
    $("ea-recs").innerHTML = recs(r);
  }

  /* ---------- 绑定 ---------- */
  ["st-age", "st-hx", "st-speed", "st-fatigue", "st-nordic"].forEach(function (id) {
    $(id).addEventListener("input", runStrain);
  });
  document.querySelectorAll("#as-chest input").forEach(function (c) { c.addEventListener("change", runChest); });
  [0, 1, 2, 3].forEach(function (i) { $("aw-" + i).addEventListener("input", runACWR); });
  document.querySelectorAll("#as-acl input").forEach(function (c) { c.addEventListener("change", runACL); });
  document.querySelectorAll("#as-parq .pq").forEach(function (c) { c.addEventListener("change", runPARQ); });
  $("pq-age").addEventListener("input", runPARQ);
  ["orm-w", "orm-r", "orm-bw"].forEach(function (id) { $(id).addEventListener("input", runORM); });
  ["orm-ex", "orm-sex"].forEach(function (id) { $(id).addEventListener("change", runORM); });
  ["ea-bw", "ea-bf", "ea-ei", "ea-eee"].forEach(function (id) { $(id).addEventListener("input", runEA); });

  runStrain();
  runChest();
  runACL();
  runPARQ();
  runORM();
  runEA();
})();
