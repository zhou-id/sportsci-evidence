/* ============================================================
   SPORTSCI RESEARCH — 证据数据库页面逻辑
   筛选 / 检索 / 排序 / 可视化 / 导出文献矩阵
   依赖：data.js (SPORTSCI_DATA)、charts.js (SPORTSCI_CHARTS)
   ============================================================ */
(function () {
  "use strict";

  var D = window.SPORTSCI_DATA;
  if (!D) return;

  var LIB_NAME = {}, LIB_EN = {}, TRACK_NAME = {}, TYPE_NAME = D.types;
  D.libraries.forEach(function (l) { LIB_NAME[l.id] = l.name; LIB_EN[l.id] = l.en; });
  D.tracks.forEach(function (t) { TRACK_NAME[t.id] = t.name; });

  var state = { q: "", lib: "all", type: "all", grade: "all", sort: "pop" };
  var GRADE_ORDER = { A: 0, B: 1, C: 2, D: 3 };

  /* ---------- 工具 ---------- */
  function $(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function filtered() {
    var q = state.q.trim().toLowerCase();
    var list = D.entries.filter(function (e) {
      if (state.lib !== "all" && e.lib !== state.lib) return false;
      if (state.type !== "all" && e.type !== state.type) return false;
      if (state.grade !== "all" && e.grade !== state.grade) return false;
      if (q) {
        var hay = (e.title + " " + e.authors + " " + e.journal + " " + e.sub + " " +
                   e.key + " " + e.tags.join(" ")).toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });
    list.sort(function (a, b) {
      switch (state.sort) {
        case "year-desc": return b.year - a.year || b.pop - a.pop;
        case "year-asc":  return a.year - b.year || b.pop - a.pop;
        case "grade":     return GRADE_ORDER[a.grade] - GRADE_ORDER[b.grade] || b.pop - a.pop;
        default:          return b.pop - a.pop;
      }
    });
    return list;
  }

  /* ---------- 分库总览卡 ---------- */
  function renderLibs() {
    var counts = D.stats().byLib;
    $("db-libs").innerHTML = D.libraries.map(function (l, i) {
      return '<div class="card db-lib-card reveal" data-delay="' + (i % 3) + '" data-lib="' + l.id + '" role="button" tabindex="0">' +
        '<div class="lib-en">' + esc(l.en) + '</div>' +
        '<div class="panel-title mt-8">' + esc(l.name) + '</div>' +
        '<div class="lib-count num">' + (counts[l.id] || 0) + '</div>' +
        '<p class="panel-sub">' + esc(l.desc) + '</p>' +
        '</div>';
    }).join("");
    Array.prototype.forEach.call(document.querySelectorAll(".db-lib-card"), function (el) {
      el.addEventListener("click", function () { setLib(el.getAttribute("data-lib")); });
    });
  }

  /* ---------- 筛选芯片 ---------- */
  function chip(label, value, active) {
    return '<button class="chip' + (active ? " active" : "") + '" data-v="' + value + '">' + esc(label) + "</button>";
  }

  function renderChips() {
    var counts = D.stats().byLib;
    var html = chip("全部分库", "all", state.lib === "all");
    D.libraries.forEach(function (l) {
      html += chip(l.name + " · " + (counts[l.id] || 0), l.id, state.lib === l.id);
    });
    $("db-lib-chips").innerHTML = html;

    var th = chip("全部类型", "all", state.type === "all");
    Object.keys(TYPE_NAME).forEach(function (t) {
      th += chip(TYPE_NAME[t], t, state.type === t);
    });
    $("db-type-chips").innerHTML = th;

    var gh = chip("全部等级", "all", state.grade === "all");
    ["A", "B", "C", "D"].forEach(function (g) {
      gh += chip("等级 " + g, g, state.grade === g);
    });
    $("db-grade-chips").innerHTML = gh;

    bindChips($("db-lib-chips"), function (v) { setLib(v); });
    bindChips($("db-type-chips"), function (v) { state.type = v; refresh(); });
    bindChips($("db-grade-chips"), function (v) { state.grade = v; refresh(); });
  }

  function bindChips(container, fn) {
    Array.prototype.forEach.call(container.querySelectorAll(".chip"), function (c) {
      c.addEventListener("click", function () { fn(c.getAttribute("data-v")); });
    });
  }

  function setLib(v) {
    state.lib = v;
    refresh();
    var bar = document.querySelector(".db-filterbar");
    if (bar) bar.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ---------- 文献列表 ---------- */
  function renderList(list) {
    $("db-hit").textContent = list.length;
    $("db-total").textContent = D.entries.length;
    $("db-empty").classList.toggle("u-hidden", list.length > 0);
    $("db-list").innerHTML = list.map(function (e) {
      return '<div class="card db-entry">' +
        '<div class="db-entry-head">' +
          '<div class="db-entry-title">' + esc(e.title) + "</div>" +
          '<div class="db-badges">' +
            '<span class="grade-badge badge-' + e.grade.toLowerCase() + '">' + e.grade + "</span>" +
            '<span class="tag">' + esc(TYPE_NAME[e.type]) + "</span>" +
          "</div>" +
        "</div>" +
        '<div class="db-entry-meta"><b>' + esc(e.authors) + "</b> · " + e.year + " · <i>" + esc(e.journal) + "</i>" +
          ' · <span class="db-libname">' + esc(LIB_NAME[e.lib]) + " / " + esc(e.sub) + "</span></div>" +
        '<div class="db-entry-key">' + esc(e.key) + "</div>" +
        '<div class="db-entry-tags">' + e.tags.map(function (t) { return '<span class="tag">' + esc(t) + "</span>"; }).join("") + "</div>" +
      "</div>";
    }).join("");
  }

  /* ---------- 可视化 ---------- */
  var charts = null;
  function renderViz(list) {
    if (typeof SPORTSCI_CHARTS === "undefined") return;
    if (!charts) {
      charts = {
        lib:   SPORTSCI_CHARTS.init($("viz-lib")),
        grade: SPORTSCI_CHARTS.init($("viz-grade")),
        type:  SPORTSCI_CHARTS.init($("viz-type")),
        year:  SPORTSCI_CHARTS.init($("viz-year"))
      };
    }
    if (!charts.lib) return;

    var byLib = {}, byGrade = {}, byType = {}, byYear = {};
    list.forEach(function (e) {
      byLib[e.lib] = (byLib[e.lib] || 0) + 1;
      byGrade[e.grade] = (byGrade[e.grade] || 0) + 1;
      byType[e.type] = (byType[e.type] || 0) + 1;
      byYear[e.year] = (byYear[e.year] || 0) + 1;
    });

    charts.lib.setOption({
      tooltip: {},
      xAxis: { type: "category", data: D.libraries.map(function (l) { return l.name.replace("证据库", "").replace("循证库", ""); }), axisLabel: { interval: 0, rotate: 18 } },
      yAxis: { type: "value", minInterval: 1 },
      series: [{
        type: "bar", barWidth: 26,
        data: D.libraries.map(function (l) { return byLib[l.id] || 0; }),
        itemStyle: { color: "#b026c9", borderRadius: [4, 4, 0, 0] }
      }]
    });

    charts.grade.setOption({
      tooltip: { trigger: "item" },
      legend: { bottom: 0, textStyle: { color: "#a08cc0", fontSize: 11 } },
      series: [{
        type: "pie", radius: ["42%", "66%"], center: ["50%", "44%"],
        label: { color: "#a08cc0", fontSize: 11 },
        data: ["A", "B", "C", "D"].map(function (g) {
          var color = { A: "#3de8ff", B: "#ff4fe3", C: "#ffb54d", D: "#ff4d6d" }[g];
          return { name: "等级 " + g, value: byGrade[g] || 0, itemStyle: { color: color } };
        })
      }]
    });

    var typeKeys = Object.keys(byType).sort(function (a, b) { return byType[b] - byType[a]; });
    charts.type.setOption({
      tooltip: {},
      yAxis: { type: "category", data: typeKeys.map(function (t) { return TYPE_NAME[t]; }).reverse(), axisLabel: { fontSize: 11 } },
      xAxis: { type: "value", minInterval: 1 },
      grid: { left: 90, right: 24, top: 12, bottom: 24 },
      series: [{
        type: "bar", barWidth: 12,
        data: typeKeys.map(function (t) { return byType[t]; }).reverse(),
        itemStyle: { color: "#3de8ff", borderRadius: [0, 4, 4, 0] }
      }]
    });

    var years = Object.keys(byYear).map(Number).sort(function (a, b) { return a - b; });
    charts.year.setOption({
      tooltip: {},
      xAxis: { type: "category", data: years, axisLabel: { fontSize: 10, rotate: 45 } },
      yAxis: { type: "value", minInterval: 1 },
      grid: { left: 36, right: 16, top: 16, bottom: 48 },
      series: [{
        type: "bar", barWidth: "62%",
        data: years.map(function (y) { return byYear[y]; }),
        itemStyle: { color: "#b48cff", borderRadius: [3, 3, 0, 0] }
      }]
    });
  }

  /* ---------- 导出 CSV ---------- */
  function exportCSV(list) {
    var head = ["ID", "证据分库", "赛道", "子方向", "标题", "作者", "年份", "期刊/出版", "研究类型", "证据等级", "标签", "核心结论"];
    var rows = list.map(function (e) {
      return [e.id, LIB_NAME[e.lib], TRACK_NAME[e.track], e.sub, e.title, e.authors, e.year, e.journal, TYPE_NAME[e.type], e.grade, e.tags.join("; "), e.key];
    });
    var csv = "﻿" + [head].concat(rows).map(function (r) {
      return r.map(function (c) { return '"' + String(c).replace(/"/g, '""') + '"'; }).join(",");
    }).join("\r\n");
    var blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "sportsci-evidence-matrix.csv";
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 400);
  }

  /* ---------- 视图切换 ---------- */
  var pane = "list";
  function refresh() {
    renderChips();
    var list = filtered();
    renderList(list);
    if (pane === "viz") renderViz(list);
  }

  Array.prototype.forEach.call(document.querySelectorAll("#db-tabs .tab"), function (t) {
    t.addEventListener("click", function () {
      document.querySelectorAll("#db-tabs .tab").forEach(function (x) { x.classList.remove("active"); });
      t.classList.add("active");
      pane = t.getAttribute("data-pane");
      $("db-pane-list").classList.toggle("u-hidden", pane !== "list");
      $("db-pane-viz").classList.toggle("u-hidden", pane !== "viz");
      if (pane === "viz") {
        renderViz(filtered());
        if (charts) Object.keys(charts).forEach(function (k) { charts[k] && charts[k].resize(); });
      }
    });
  });

  /* ---------- 事件 ---------- */
  var debounce = null;
  $("db-q").addEventListener("input", function (e) {
    clearTimeout(debounce);
    debounce = setTimeout(function () { state.q = e.target.value; refresh(); }, 160);
  });
  $("db-sort").addEventListener("change", function (e) { state.sort = e.target.value; refresh(); });
  $("db-export").addEventListener("click", function () { exportCSV(filtered()); });

  renderLibs();
  refresh();
})();
