/* ============================================================
   SPORTSCI RESEARCH — 人体运动系统交互图谱
   教学性解剖摘编，非临床解剖图谱
   ============================================================ */
(function () {
  "use strict";

  var REGIONS = [
    {
      id: "shoulder", name: "肩带与肩关节", en: "Shoulder Girdle", note: "肩关节是全身活动度最大的关节，稳定性依赖肩袖与肩胛控制的动态平衡。",
      muscles: [
        { name: "三角肌", en: "Deltoid", origin: "锁骨外侧 1/3、肩峰、肩胛冈", insertion: "肱骨三角肌粗隆", action: "中束外展；前束前屈内旋；后束后伸外旋", exercise: "侧平举、推举、面拉", injury: "肩峰下撞击、三角肌拉伤" },
        { name: "冈上肌", en: "Supraspinatus", origin: "肩胛骨冈上窝", insertion: "肱骨大结节", action: "启动肩外展 0–15°，肩袖稳定肱骨头", exercise: "侧卧外展、空罐训练", injury: "肩袖撕裂（撞击部位最常见）" },
        { name: "斜方肌上部", en: "Upper Trapezius", origin: "枕外隆凸、项韧带、C7 棘突", insertion: "锁骨外侧 1/3、肩峰", action: "肩胛上提与上回旋，辅助颈伸", exercise: "耸肩、农夫行走", injury: "颈肩肌筋膜痛、上交叉综合征" }
      ]
    },
    {
      id: "chest", name: "胸廓与胸前肌群", en: "Thorax & Chest", note: "胸前肌群参与推类动作与呼吸，肩胛前伸控制依赖前锯肌。",
      muscles: [
        { name: "胸大肌", en: "Pectoralis Major", origin: "锁骨内侧、胸骨、肋软骨、腹外斜肌腱膜", insertion: "肱骨大结节嵴", action: "肩水平内收、内旋、前屈", exercise: "卧推、俯卧撑、飞鸟", injury: "胸大肌肌腱断裂（大重量卧推）" },
        { name: "前锯肌", en: "Serratus Anterior", origin: "第 1–9 肋外面", insertion: "肩胛骨内侧缘", action: "肩胛前伸与上回旋，使肩胛贴附胸壁", exercise: "肩胛俯卧撑、推举末端前伸", injury: "翼状肩胛（长胸神经损伤）" },
        { name: "胸小肌", en: "Pectoralis Minor", origin: "第 3–5 肋", insertion: "肩胛骨喙突", action: "肩胛前倾与下回旋，辅助吸气", exercise: "推墙、胸小肌拉伸", injury: "胸廓出口综合征的解剖诱因之一" }
      ]
    },
    {
      id: "back", name: "背部与脊柱伸肌", en: "Back & Spinal Extensors", note: "背部肌群决定拉类动作能力与躯干伸展耐力，是久坐人群的高发薄弱区。",
      muscles: [
        { name: "背阔肌", en: "Latissimus Dorsi", origin: "T7–L5 棘突、髂嵴、下位肋", insertion: "肱骨小结节", action: "肩伸、内收、内旋", exercise: "引体向上、划船", injury: "拉伤少见；过度内旋可加重肩前痛" },
        { name: "斜方肌中下部", en: "Middle & Lower Trapezius", origin: "T1–T5 棘突（中束）、T6–T12 棘突（下束）", insertion: "肩胛冈、肩胛骨内侧缘", action: "肩胛后缩、下压与上回旋", exercise: "划船、Y-T-W 训练", injury: "菱形肌劳损、肩胛控制不足" },
        { name: "竖脊肌", en: "Erector Spinae", origin: "骶骨、髂嵴、腰椎棘突", insertion: "肋骨、椎骨横突与棘突、枕骨", action: "脊柱伸展、侧屈与姿势抗屈", exercise: "硬拉、背屈伸、鸟狗", injury: "腰肌劳损、急性腰扭伤" }
      ]
    },
    {
      id: "core", name: "腹壁与核心", en: "Abdominal Wall & Core", note: "核心的功能是传递力量与抵抗不必要的运动，而非单纯产生屈曲。",
      muscles: [
        { name: "腹直肌", en: "Rectus Abdominis", origin: "耻骨联合、耻骨嵴", insertion: "胸骨剑突、第 5–7 肋软骨", action: "躯干屈曲、增加腹内压", exercise: "卷腹、悬垂举腿", injury: "腹直肌分离（产后高发）" },
        { name: "腹外斜肌", en: "External Oblique", origin: "第 5–12 肋外面", insertion: "髂嵴、腹白线", action: "同侧屈曲、对侧旋转", exercise: "俄罗斯转体、砍树动作", injury: "腹壁拉伤、肋骨缘疼痛" },
        { name: "腹横肌", en: "Transversus Abdominis", origin: "第 7–12 肋软骨、髂嵴、腹股沟韧带", insertion: "腹白线、耻骨", action: "维持腹内压、腰椎节段稳定", exercise: "死虫、呼吸-核心协同训练", injury: "核心稳定不足、腹股沟区疼痛" }
      ]
    },
    {
      id: "arm", name: "上臂", en: "Upper Arm", note: "屈肘与伸肘肌群构成典型的第三类杠杆，肌腱断裂多发生于突然高负荷离心收缩。",
      muscles: [
        { name: "肱二头肌", en: "Biceps Brachii", origin: "肩胛骨盂上结节、喙突", insertion: "桡骨粗隆、肱二头肌腱膜", action: "屈肘、前臂旋后、辅助肩屈", exercise: "弯举、反握引体", injury: "远端肌腱断裂（提举重物）" },
        { name: "肱三头肌", en: "Triceps Brachii", origin: "肩胛骨盂下结节、肱骨桡神经沟上下", insertion: "尺骨鹰嘴", action: "伸肘、长头辅助肩伸", exercise: "臂屈伸、窄距卧推", injury: "肱三头肌腱断裂、鹰嘴滑囊炎" },
        { name: "肱肌", en: "Brachialis", origin: "肱骨前面下半", insertion: "尺骨粗隆", action: "各前臂位置下的主要屈肘肌", exercise: "锤式弯举、中立位弯举", injury: "孤立损伤少见" }
      ]
    },
    {
      id: "forearm", name: "前臂与腕", en: "Forearm & Wrist", note: "腕伸肌与屈肌的肌腱附着于肱骨内外上髁，是网球肘与高尔夫球肘的解剖基础。",
      muscles: [
        { name: "桡侧腕屈肌", en: "Flexor Carpi Radialis", origin: "肱骨内上髁", insertion: "第 2 掌骨底", action: "屈腕、桡偏", exercise: "腕屈曲训练、握力训练", injury: "高尔夫球肘（内上髁炎）" },
        { name: "桡侧腕短伸肌", en: "Extensor Carpi Radialis Brevis", origin: "肱骨外上髁", insertion: "第 3 掌骨底", action: "伸腕、桡偏", exercise: "腕伸训练、反向弯举", injury: "网球肘（外上髁炎）" },
        { name: "肱桡肌", en: "Brachioradialis", origin: "肱骨外上髁上嵴", insertion: "桡骨远端", action: "前臂中立位屈肘", exercise: "锤式弯举", injury: "劳损性疼痛，多见于重复抓握" }
      ]
    },
    {
      id: "glute", name: "髋与臀肌", en: "Hip & Gluteal Region", note: "臀肌是跑步与变向的发力核心，臀中肌无力与膝外翻及髌股疼痛相关。",
      muscles: [
        { name: "臀大肌", en: "Gluteus Maximus", origin: "髂骨后部、骶骨、尾骨", insertion: "髂胫束、股骨臀肌粗隆", action: "髋伸、外旋，起身与冲刺主发力肌", exercise: "硬拉、臀桥、冲刺跑", injury: "臀肌肌腱病、深层臀肌综合征" },
        { name: "臀中肌", en: "Gluteus Medius", origin: "髂骨翼外面", insertion: "股骨大转子", action: "髋外展、外旋，单腿支撑时稳定骨盆", exercise: "侧抬腿、单腿硬拉、蚌式", injury: "髋外展无力、跑步膝、髂胫束综合征" },
        { name: "髂腰肌", en: "Iliopsoas", origin: "腰椎体与横突（腰大肌）、髂窝（髂肌）", insertion: "股骨小转子", action: "髋屈、外旋，深层稳定腰椎", exercise: "高抬腿、90/90 呼吸", injury: "髂腰肌综合征、髋前疼痛" }
      ]
    },
    {
      id: "thighfront", name: "大腿前侧与内收肌", en: "Anterior Thigh & Adductors", note: "股四头肌伸膝，内收肌群在变向与踢击动作中承受高离心负荷。",
      muscles: [
        { name: "股四头肌", en: "Quadriceps Femoris", origin: "髂前下棘（股直肌）、股骨体", insertion: "髌骨→经髌韧带止于胫骨粗隆", action: "伸膝；股直肌兼屈髋", exercise: "深蹲、腿举、箭步蹲", injury: "髌腱病、股四头肌拉伤" },
        { name: "内收肌群", en: "Adductor Group", origin: "耻骨、坐骨", insertion: "股骨粗线、内收肌结节", action: "髋内收，部分参与屈伸", exercise: "哥本哈根内收、夹腿机", injury: "内收肌拉伤（足球、变向项目高发）" },
        { name: "缝匠肌", en: "Sartorius", origin: "髂前上棘", insertion: "胫骨上端内侧面（鹅足）", action: "屈髋、外旋、屈膝", exercise: "柔韧训练、跨步动作", injury: "鹅足滑囊炎相关" }
      ]
    },
    {
      id: "thighback", name: "大腿后侧", en: "Posterior Thigh", note: "腘绳肌跨越髋膝双关节，冲刺摆动末期承受极高离心张力，是拉伤高发部位。",
      muscles: [
        { name: "股二头肌", en: "Biceps Femoris", origin: "坐骨结节、股骨粗线", insertion: "腓骨头", action: "屈膝、髋伸、小腿外旋", exercise: "罗马尼亚硬拉、腿弯举", injury: "腘绳肌拉伤（短跑摆动期）" },
        { name: "半腱肌", en: "Semitendinosus", origin: "坐骨结节", insertion: "胫骨内侧鹅足", action: "屈膝、髋伸、小腿内旋", exercise: "北欧屈曲、单腿 RDL", injury: "近端腘绳肌拉伤" },
        { name: "半膜肌", en: "Semimembranosus", origin: "坐骨结节", insertion: "胫骨内侧髁后面", action: "屈膝、髋伸、小腿内旋", exercise: "臀桥、腿弯举", injury: "近端腘绳肌损伤、坐骨结节滑囊炎" }
      ]
    },
    {
      id: "calf", name: "小腿与踝", en: "Lower Leg & Ankle", note: "小腿三头肌通过跟腱传递巨大张力，踝背屈不足会改变深蹲与落地力学。",
      muscles: [
        { name: "腓肠肌", en: "Gastrocnemius", origin: "股骨内、外侧髁", insertion: "跟骨（经跟腱）", action: "踝跖屈、屈膝", exercise: "站姿提踵", injury: "小腿拉伤（网球腿）" },
        { name: "比目鱼肌", en: "Soleus", origin: "腓骨后面、胫骨比目鱼肌线", insertion: "跟骨（经跟腱）", action: "膝伸直位跖屈，姿势性耐力", exercise: "坐姿提踵", injury: "跟腱病、比目鱼肌拉伤" },
        { name: "胫骨前肌", en: "Tibialis Anterior", origin: "胫骨外侧面上半", insertion: "内侧楔骨、第 1 跖骨底", action: "踝背屈、内翻", exercise: "勾脚训练、弹力带背屈", injury: "胫前疼痛、慢性骨筋膜室综合征" }
      ]
    }
  ];

  var ROM = [
    { name: "肩前屈", value: 180 }, { name: "肩外展", value: 180 },
    { name: "肘屈曲", value: 150 }, { name: "腕掌屈", value: 80 },
    { name: "腕背伸", value: 70 }, { name: "髋屈曲", value: 120 },
    { name: "膝屈曲", value: 135 }, { name: "踝跖屈", value: 50 },
    { name: "踝背屈", value: 20 }, { name: "颈椎旋转", value: 60 },
    { name: "肩外旋", value: 90 }, { name: "髋外旋", value: 45 }
  ];

  var current = "shoulder";
  var chart = null;

  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

  function renderChips() {
    var box = $("an-chips");
    if (!box) return;
    box.innerHTML = REGIONS.map(function (r) {
      return '<button class="chip' + (r.id === current ? " active" : "") + '" data-region="' + r.id + '">' + esc(r.name) + "</button>";
    }).join("");
    Array.prototype.forEach.call(box.querySelectorAll(".chip"), function (b) {
      b.addEventListener("click", function () { select(b.getAttribute("data-region")); });
    });
  }

  function select(id) {
    var region = REGIONS.filter(function (r) { return r.id === id; })[0];
    if (!region) return;
    current = id;
    $("an-region-name").textContent = region.name;
    $("an-region-en").textContent = region.en;
    $("an-region-note").textContent = region.note;
    $("an-region-count").textContent = region.muscles.length + " 条";

    $("an-muscle-list").innerHTML = region.muscles.map(function (m) {
      return '<div class="card an-muscle tone-b">' +
        '<div class="an-m-name">' + esc(m.name) + '<span class="an-m-en">' + esc(m.en) + "</span></div>" +
        '<dl class="an-kv">' +
          "<dt>起点</dt><dd>" + esc(m.origin) + "</dd>" +
          "<dt>止点</dt><dd>" + esc(m.insertion) + "</dd>" +
          "<dt>功能</dt><dd>" + esc(m.action) + "</dd>" +
          "<dt>训练</dt><dd>" + esc(m.exercise) + "</dd>" +
          "<dt>常见损伤</dt><dd>" + esc(m.injury) + "</dd>" +
        "</dl></div>";
    }).join("");

    Array.prototype.forEach.call(document.querySelectorAll("#an-svg .an-region"), function (shape) {
      var on = shape.getAttribute("data-region") === id;
      shape.classList.toggle("active", on);
    });
    Array.prototype.forEach.call(document.querySelectorAll("#an-chips .chip"), function (b) {
      b.classList.toggle("active", b.getAttribute("data-region") === id);
    });
  }

  function drawROM() {
    var box = $("an-rom-chart");
    if (!box || !window.SPORTSCI_CHARTS) return;
    if (!chart) chart = SPORTSCI_CHARTS.init(box);
    if (!chart) return;
    chart.resize();
    chart.setOption({
      grid: { left: 72, right: 40, top: 16, bottom: 28 },
      xAxis: { type: "value", name: "度（°）", max: 200 },
      yAxis: { type: "category", data: ROM.map(function (r) { return r.name; }).reverse() },
      series: [{
        type: "bar",
        data: ROM.map(function (r) { return r.value; }).reverse(),
        barWidth: 10,
        itemStyle: {
          borderRadius: [0, 5, 5, 0],
          color: {
            type: "linear", x: 0, y: 0, x2: 1, y2: 0,
            colorStops: [{ offset: 0, color: "rgba(255,79,227,0.35)" }, { offset: 1, color: "#ff4fe3" }]
          }
        },
        label: { show: true, position: "right", color: "#a08cc0", fontSize: 11, formatter: "{c}°" }
      }],
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" }, formatter: "{b}<br/>参考上限 {c}°" }
    });
  }

  function bindTabs() {
    var bar = $("an-tabs");
    if (!bar) return;
    Array.prototype.forEach.call(bar.querySelectorAll(".tab"), function (btn) {
      btn.addEventListener("click", function () {
        Array.prototype.forEach.call(bar.querySelectorAll(".tab"), function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        var pane = btn.getAttribute("data-pane");
        Array.prototype.forEach.call(document.querySelectorAll(".an-pane"), function (p) { p.classList.remove("active"); });
        var target = $("an-" + pane);
        if (target) target.classList.add("active");
        if (pane === "rom") drawROM();
      });
    });
  }

  function init() {
    if (!$("an-muscle-list")) return;
    var total = 0;
    REGIONS.forEach(function (r) { total += r.muscles.length; });
    $("an-muscle-count").textContent = total;
    renderChips();
    select(current);
    bindTabs();
    Array.prototype.forEach.call(document.querySelectorAll("#an-svg .an-region"), function (shape) {
      shape.addEventListener("click", function () { select(shape.getAttribute("data-region")); });
    });
    window.addEventListener("resize", function () { if (chart) chart.resize(); });
  }

  window.SPORTSCI_ANATOMY = { init: init, regions: REGIONS, rom: ROM };
})();
