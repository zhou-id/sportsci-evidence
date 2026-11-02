/* ============================================================
   SPORTSCI RESEARCH — 鼠标追随光晕 + 元素聚光
   光晕缓动跟随 / 光点即时跟随 / 卡片·玻璃·按钮指针位置聚光
   克制低亮度；触屏设备自动禁用
   ============================================================ */
(function () {
  "use strict";

  function init() {
    if (window.matchMedia && window.matchMedia("(hover: none)").matches) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var halo = document.createElement("div");
    halo.id = "cursor-halo";
    var dot = document.createElement("div");
    dot.id = "cursor-dot";
    document.body.appendChild(halo);
    document.body.appendChild(dot);

    var tx = window.innerWidth / 2, ty = window.innerHeight / 3;
    var hx = tx, hy = ty;

    document.addEventListener("mousemove", function (e) {
      tx = e.clientX; ty = e.clientY;
      dot.style.transform = "translate(" + (tx - 3) + "px," + (ty - 3) + "px)";

      // 指针位置聚光：写入元素 CSS 变量
      var el = e.target;
      while (el && el !== document.body) {
        if (el.classList && (el.classList.contains("card") || el.classList.contains("glass") || el.classList.contains("btn"))) {
          var r = el.getBoundingClientRect();
          el.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100).toFixed(1) + "%");
          el.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100).toFixed(1) + "%");
          break;
        }
        el = el.parentElement;
      }
    }, { passive: true });

    (function loop() {
      requestAnimationFrame(loop);
      hx += (tx - hx) * 0.075;
      hy += (ty - hy) * 0.075;
      halo.style.transform = "translate(" + (hx - 280) + "px," + (hy - 280) + "px)";
    })();
  }

  window.SPORTSCI_CURSOR = { init: init };
})();
