/* ============================================================
   SPORTSCI RESEARCH — ECharts 暗色科研主题
   用法：var chart = SPORTSCI_CHARTS.init(document.getElementById('xxx'));
        chart.setOption({...});
   ============================================================ */
(function () {
  "use strict";

  var PALETTE = ["#ff4fe3", "#3de8ff", "#ffb54d", "#ff4d6d", "#b48cff", "#7a5cff"];

  function register() {
    if (typeof echarts === "undefined") return;
    echarts.registerTheme("sportsci", {
      color: PALETTE,
      backgroundColor: "transparent",
      textStyle: { color: "#a08cc0", fontFamily: "Inter, -apple-system, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif" },
      title: { textStyle: { color: "#eeddfa", fontSize: 14 } },
      grid: { borderColor: "rgba(200,120,255,0.12)" },
      categoryAxis: {
        axisLine: { lineStyle: { color: "rgba(200,120,255,0.25)" } },
        axisTick: { show: false },
        axisLabel: { color: "#a08cc0", fontSize: 11 },
        splitLine: { show: false }
      },
      valueAxis: {
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: "#a08cc0", fontSize: 11 },
        splitLine: { lineStyle: { color: "rgba(200,120,255,0.08)" } },
        nameTextStyle: { color: "#66567e" }
      },
      logAxis: {
        axisLine: { show: false },
        axisLabel: { color: "#a08cc0" },
        splitLine: { lineStyle: { color: "rgba(200,120,255,0.08)" } }
      },
      timeAxis: {
        axisLine: { lineStyle: { color: "rgba(200,120,255,0.25)" } },
        axisLabel: { color: "#a08cc0" },
        splitLine: { show: false }
      },
      line: { lineStyle: { width: 2 }, symbolSize: 5, smooth: true },
      scatter: { symbolSize: 8 },
      legend: { textStyle: { color: "#a08cc0", fontSize: 11 }, itemWidth: 14, itemHeight: 8 },
      tooltip: {
        backgroundColor: "rgba(22,10,40,0.94)",
        borderColor: "rgba(200,120,255,0.2)",
        textStyle: { color: "#eeddfa", fontSize: 12 },
        axisPointer: { lineStyle: { color: "rgba(255,79,227,0.3)" } }
      },
      dataZoom: {
        backgroundColor: "rgba(22,12,40,0.6)",
        fillerColor: "rgba(255,79,227,0.08)",
        borderColor: "rgba(200,120,255,0.15)",
        textStyle: { color: "#a08cc0" }
      },
      markLine: { lineStyle: { color: "rgba(255,181,77,0.5)", type: "dashed" }, label: { color: "#a08cc0" } },
      markArea: { itemStyle: { color: "rgba(255,79,227,0.05)" } }
    });
  }

  var bound = [];

  function init(el, opts) {
    if (typeof echarts === "undefined") { console.warn("echarts 未加载"); return null; }
    register._done || (register(), register._done = true);
    var chart = echarts.init(el, "sportsci", opts || {});
    var onResize = function () { chart.resize(); };
    window.addEventListener("resize", onResize);
    bound.push({ chart: chart, onResize: onResize });
    return chart;
  }

  window.SPORTSCI_CHARTS = {
    PALETTE: PALETTE,
    init: init
  };
})();
