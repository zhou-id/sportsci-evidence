/* ============================================================
   SPORTSCI RESEARCH — 运动医学与临床运动处方
   FITT-VP 参数为教学框架，参考 ACSM GETP 第 11 版
   ============================================================ */
(function () {
  "use strict";

  var CONDITIONS = [
    {
      id: "htn", name: "高血压", en: "Hypertension", tag: "ACSM GETP 11th",
      note: "运动是降压的一线非药物手段之一；核心在于规律有氧 + 中等负荷抗阻，避免屏气与爆发用力。",
      freq: "有氧 ≥5 天/周；抗阻 2–3 天/周（非连续）",
      intensity: "有氧 40–59% HRR 或 RPE 11–13；抗阻 60–70% 1RM",
      time: "30 min/d 连续或累计，目标 150–300 min/周",
      type: "步行、骑行、游泳等大肌群有氧；抗阻 2–4 组 × 8–12 次，覆盖主要肌群",
      volume: "≥150 min/周中等强度有氧 + 每周 2 次抗阻",
      progress: "先增加时长，再提高强度；每 1–2 周调整一次",
      caution: "静息血压 ≥180/110 mmHg 时暂缓运动并就医；抗阻训练全程保持呼气，避免 Valsalva 动作；服用 β-阻断剂者以 RPE 而非心率为强度依据。"
    },
    {
      id: "t2dm", name: "2 型糖尿病", en: "Type 2 Diabetes", tag: "ACSM GETP 11th",
      note: "有氧与抗阻联合优于单一模式；降低血糖的同时改善胰岛素敏感性与肌糖原储备。",
      freq: "有氧 3–7 天/周（间隔不超过 2 天）；抗阻 2–3 天/周",
      intensity: "有氧 50–70% HRR；抗阻 50–70% 1RM 起始",
      time: "20–60 min/d，累计 ≥150 min/周",
      type: "快走、骑行、游泳 + 全身抗阻 8–10 个动作，10–15 次/组",
      volume: "≥150 min/周中等强度有氧 + 2–3 次抗阻",
      progress: "每周增加 5–10 min 或约 5% 强度；先建立规律性",
      caution: "使用胰岛素或磺脲类药物者需防范运动性低血糖，运动前测血糖并随身携带碳水；血糖 >13.9 mmol/L 伴酮症、或存在未控制的高血压与增殖性视网膜病变时先就医。"
    },
    {
      id: "obesity", name: "肥胖与体重管理", en: "Obesity & Weight Management", tag: "ACSM GETP 11th",
      note: "减重与维持需要较大总能量消耗；抗阻训练用于保留去脂体重，两者不可替代。",
      freq: "有氧 ≥5 天/周；抗阻 2–3 天/周",
      intensity: "有氧 40–60% VO2R 起始，逐步提高；抗阻中等负荷",
      time: "30–60 min/d，逐步至 200–300 min/周",
      type: "低冲击有氧（快走、骑车、水中有氧）+ 多关节抗阻 + 日常步数",
      volume: "减重期 150–250 min/周；维持期 200–300 min/周",
      progress: "优先延长时长与增加每日步数，再提高强度；关注关节耐受",
      caution: "重度肥胖或合并膝骨关节炎者优选低冲击模式；热环境与高湿条件下降低强度；能量缺口不宜过大，避免瘦体重快速流失。"
    },
    {
      id: "lipid", name: "血脂异常", en: "Dyslipidemia", tag: "ACSM GETP 11th",
      note: "规律有氧主要改善甘油三酯与 HDL；抗阻与减重对 LDL 有附加作用。",
      freq: "有氧 3–5 天/周；抗阻 2–3 天/周",
      intensity: "有氧 40–75% VO2R；抗阻 中等负荷多关节",
      time: "30–40 min/d，累计 ≥150 min/周",
      type: "持续有氧为主，辅以抗阻与柔韧训练",
      volume: "≥150 min/周中等强度，或 75 min/周高强度",
      progress: "每 2 周增加 5–10 min；结合饮食与体成分管理",
      caution: "服用他汀类药物者若出现不明原因的肌痛、乏力或茶色尿，应暂停运动并就医检查肌酸激酶。"
    },
    {
      id: "osteo", name: "骨质疏松", en: "Osteoporosis", tag: "ACSM GETP 11th",
      note: "负重与抗阻是骨刺激的核心；平衡训练降低跌倒与骨折风险。",
      freq: "负重/抗阻 2–3 天/周；平衡训练 ≥3 天/周",
      intensity: "中高负荷 70–85% 1RM（确诊者需专业监督）；冲击负荷循序渐进",
      time: "每次 2–3 组 × 8–12 次多关节动作，平衡训练 10–20 min",
      type: "负重抗阻、低幅高频冲击、单腿站立与动态平衡训练",
      volume: "覆盖髋、脊柱、下肢主要肌群，每周 2–3 次",
      progress: "先建立动作质量与平衡能力，再逐步增加负荷",
      caution: "避免脊柱屈曲 + 旋转的复合动作（如仰卧起坐、负重转体）；严重骨质疏松或既往椎体骨折者须在专业指导下训练；优先预防跌倒环境风险。"
    },
    {
      id: "copd", name: "慢性阻塞性肺疾病", en: "COPD", tag: "ACSM GETP 11th",
      note: "运动康复可改善运动耐量与呼吸困难感知；间歇模式更易被耐受。",
      freq: "有氧 3–5 天/周；抗阻 2–3 天/周",
      intensity: "60–80% 峰值功率或症状限制（Borg 4–6）",
      time: "20–30 min/d，可拆分为 5–10 min 间歇",
      type: "步行、骑车、上肢功率车 + 抗阻 + 缩唇呼吸/呼吸肌训练",
      volume: "每周累计 60–150 min，逐步增加",
      progress: "以症状与 SpO₂ 为准，缓慢加量；急性加重期暂停",
      caution: "运动中监测血氧饱和度，持续 <88% 需评估氧疗；出现明显呼吸困难、发绀或心悸应立即停止；急性加重期（发热、咳痰增多）不进行训练。"
    },
    {
      id: "cad", name: "稳定期冠心病", en: "Stable Coronary Artery Disease", tag: "心脏康复框架",
      note: "心脏康复以运动试验为基础制定强度；监测症状与心电图变化是安全底线。",
      freq: "有氧 3–5 天/周；抗阻 2–3 天/周（低负荷高重复）",
      intensity: "有氧 40–80% HRR，以运动试验与症状阈值为准",
      time: "20–60 min/d，从 10 min 间歇开始",
      type: "步行、骑车为主 + 低负荷抗阻 + 柔韧",
      volume: "每周 150 min 中等强度（按耐受逐步达到）",
      progress: "在监护条件下逐步增加；每次训练含 5–10 min 热身与冷身",
      caution: "出现胸痛、胸闷、心悸、异常气促或心电图改变立即停止并就医；不稳定心绞痛、未控制的心衰或严重心律失常为运动禁忌。"
    }
  ];

  var FLAGS = [
    { t: "胸痛、胸闷或压迫感", d: "尤其放射至左臂、下颌、背部，伴冷汗或恶心——按急性冠脉综合征处理，立即停止运动并呼叫急救。" },
    { t: "晕厥或近似晕厥", d: "运动中或运动后突发意识丧失、眼前发黑，需排除心源性与热相关病因，禁止当日继续训练。" },
    { t: "心悸伴头晕", d: "不规则快速心跳、伴乏力或气短，需心电图评估；避免以「休息一下就好」处理。" },
    { t: "突发单侧无力或言语不清", d: "BE-FAST 原则识别卒中，记录最后正常时间并立即急诊。" },
    { t: "意识改变 + 高热", d: "核心体温 >40 °C、皮肤灼热、行为异常提示劳力性热射病，需快速冷水浸泡降温。" },
    { t: "头部外伤后神经症状", d: "头痛、恶心、平衡障碍、记忆缺失提示脑震荡，立即离场并按 SCAT6 流程评估。" },
    { t: "突发呼吸困难或单侧胸痛", d: "需排除气胸、肺栓塞；伴呼吸音消失或低氧应紧急处理。" },
    { t: "茶色尿 + 严重肌痛肿胀", d: "极端负荷后的横纹肌溶解信号，须立即就医评估肌酸激酶与肾功能。" }
  ];

  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

  var current = "htn";

  function fittItem(k, v) {
    return '<div class="card md-fitt-item tone-b"><div class="fk">' + k + '</div><div class="fv">' + esc(v) + "</div></div>";
  }

  function renderChips() {
    var box = $("md-cond-chips");
    if (!box) return;
    box.innerHTML = CONDITIONS.map(function (c) {
      return '<button class="chip' + (c.id === current ? " active" : "") + '" data-cond="' + c.id + '">' + esc(c.name) + "</button>";
    }).join("");
    Array.prototype.forEach.call(box.querySelectorAll(".chip"), function (b) {
      b.addEventListener("click", function () { select(b.getAttribute("data-cond")); });
    });
  }

  function select(id) {
    var c = CONDITIONS.filter(function (x) { return x.id === id; })[0];
    if (!c) return;
    current = id;
    $("md-rx-name").textContent = c.name;
    $("md-rx-en").textContent = c.en;
    $("md-rx-tag").textContent = c.tag;
    $("md-rx-note").textContent = c.note;
    $("md-rx-grid").innerHTML = [
      fittItem("F · 频率 Frequency", c.freq),
      fittItem("I · 强度 Intensity", c.intensity),
      fittItem("T · 时间 Time", c.time),
      fittItem("T · 类型 Type", c.type),
      fittItem("V · 总量 Volume", c.volume),
      fittItem("P · 进阶 Progression", c.progress)
    ].join("");
    $("md-rx-caution").innerHTML = "<b>安全边界</b> · " + esc(c.caution);
    Array.prototype.forEach.call(document.querySelectorAll("#md-cond-chips .chip"), function (b) {
      b.classList.toggle("active", b.getAttribute("data-cond") === id);
    });
  }

  function renderFlags() {
    var box = $("md-flag-list");
    if (!box) return;
    box.innerHTML = FLAGS.map(function (f, i) {
      return '<div class="md-flag"><div class="md-flag-num num">' + String(i + 1).padStart(2, "0") + "</div>" +
        '<div><div class="md-flag-t">' + esc(f.t) + '</div><div class="md-flag-d">' + esc(f.d) + "</div></div></div>";
    }).join("");
  }

  function bindTabs() {
    var bar = $("md-tabs");
    if (!bar) return;
    Array.prototype.forEach.call(bar.querySelectorAll(".tab"), function (btn) {
      btn.addEventListener("click", function () {
        Array.prototype.forEach.call(bar.querySelectorAll(".tab"), function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        var pane = btn.getAttribute("data-pane");
        Array.prototype.forEach.call(document.querySelectorAll(".md-pane"), function (p) { p.classList.remove("active"); });
        var target = $("md-" + pane);
        if (target) target.classList.add("active");
      });
    });
  }

  function init() {
    if (!$("md-rx-grid")) return;
    renderChips();
    select(current);
    renderFlags();
    bindTabs();
  }

  window.SPORTSCI_MEDICINE = { init: init, conditions: CONDITIONS };
})();
