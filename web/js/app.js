// 界面与交互（对应 Python 版 liuyaopaipan.py 主窗口的全部行为）
// 依赖: jieqi_data.js / sizhu.js / shensha.js / bagua.js / output.js
(function () {
  "use strict";

  var $ = function (id) { return document.getElementById(id); };
  var YAO_YANG = "■■■■■■";   // 阳爻按钮文字（与 Python 版一致）
  var YAO_YIN = "■■　　■■"; // 阴爻按钮文字（中间为两个全角空格）
  var ZHI = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
  var GAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
  var YANG_GAN = ["甲", "丙", "戊", "庚", "壬"];
  var YANG_ZHI = ["子", "寅", "辰", "午", "申", "戌"];

  var selYear = $("selYear"), selMonth = $("selMonth"), selDay = $("selDay");
  var selHour = $("selHour"), selMinute = $("selMinute");
  var selYueZhi = $("selYueZhi"), selRiGan = $("selRiGan"), selRiZhi = $("selRiZhi");
  var inpZhanShi = $("inpZhanShi"), result = $("result");

  // 按钮/复选框数组：下标 0 为初爻 ... 下标 5 为上爻（与 Python 版 yaof 数组一致）
  var yaoBtns = [0, 1, 2, 3, 4, 5].map(function (i) { return $("btn" + (i + 1)); });
  var chks = [0, 1, 2, 3, 4, 5].map(function (i) { return $("chk" + (i + 1)); });
  var yaof = ["0", "0", "0", "0", "0", "0"];

  // ---- 下拉框工具 ----
  function range(from, to) {
    var a = [];
    for (var i = from; i <= to; i++) { a.push(i); }
    return a;
  }

  function fill(sel, values, keep) {
    sel.innerHTML = "";
    for (var i = 0; i < values.length; i++) {
      var opt = document.createElement("option");
      opt.value = String(values[i]);
      opt.textContent = String(values[i]);
      sel.appendChild(opt);
    }
    if (keep !== undefined && values.some(function (v) { return String(v) === String(keep); })) {
      sel.value = String(keep);
    }
  }

  function daysInMonth(y, m) { return new Date(y, m, 0).getDate(); }

  // 按年、月重建"日"下拉（自动处理大月/小月/闰年），并尽量保持当前选中日
  function rebuildDays(keep) {
    var n = daysInMonth(+selYear.value, +selMonth.value);
    var want = Math.min(keep === undefined ? (+selDay.value || 1) : keep, n);
    fill(selDay, range(1, n), want);
  }

  // ---- 时间与干支同步（对应 Python 版 biangz） ----
  function syncGanzhi() {
    var SZ = new sizhu(+selYear.value, +selMonth.value, +selDay.value, +selHour.value, +selMinute.value);
    selYueZhi.value = SZ.yue()[1];
    selRiGan.value = SZ.ri()[0];
    selRiZhi.value = SZ.ri()[1];
  }

  function setNow() {
    var t = new Date();
    selYear.value = String(t.getFullYear());
    selMonth.value = String(t.getMonth() + 1);
    rebuildDays(t.getDate());
    selHour.value = String(t.getHours());
    selMinute.value = String(t.getMinutes());
  }

  // ---- 初始化 ----
  fill(selYear, range(1900, 2100));
  fill(selMonth, range(1, 12));
  fill(selHour, range(0, 23));
  fill(selMinute, range(0, 59));
  fill(selYueZhi, ZHI);
  fill(selRiGan, GAN);
  fill(selRiZhi, ZHI);
  setNow();
  syncGanzhi();

  // ---- 公历时间变化 → 重算干支 ----
  [selYear, selMonth].forEach(function (sel) {
    sel.addEventListener("change", function () { rebuildDays(); syncGanzhi(); });
  });
  [selDay, selHour, selMinute].forEach(function (sel) {
    sel.addEventListener("change", syncGanzhi);
  });

  // ---- 日干/日支联动校验（对应 Python 版 cb7 / cb8：阳干配阳支、阴干配阴支） ----
  selRiGan.addEventListener("change", function () {
    var g = selRiGan.value, z = selRiZhi.value;
    if (YANG_GAN.indexOf(g) >= 0 && YANG_ZHI.indexOf(z) < 0) {
      selRiZhi.value = "子";
    } else if (YANG_GAN.indexOf(g) < 0 && YANG_ZHI.indexOf(z) >= 0) {
      selRiZhi.value = "丑";
    }
  });
  selRiZhi.addEventListener("change", function () {
    var g = selRiGan.value, z = selRiZhi.value;
    if (YANG_ZHI.indexOf(z) >= 0 && YANG_GAN.indexOf(g) < 0) {
      selRiGan.value = "甲";
    } else if (YANG_ZHI.indexOf(z) < 0 && YANG_GAN.indexOf(g) >= 0) {
      selRiGan.value = "乙";
    }
  });

  // ---- 爻位按钮：点击切换阴阳（对应 Python 版 yaofb 系列） ----
  yaoBtns.forEach(function (btn, idx) {
    btn.addEventListener("click", function () {
      if (btn.textContent === YAO_YANG) {
        btn.textContent = YAO_YIN;
        yaof[idx] = "1";
      } else {
        btn.textContent = YAO_YANG;
        yaof[idx] = "0";
      }
    });
  });

  // ---- 排盘（对应 Python 版 paigua） ----
  $("btnPaipan").addEventListener("click", function () {
    var dong = chks.map(function (c) { return c.checked ? "1" : "0"; }).join("");
    result.textContent = buildPaigua({
      year: +selYear.value, month: +selMonth.value, day: +selDay.value,
      hour: +selHour.value, minute: +selMinute.value,
      liuyao: yaof.join(""), dong: dong,
      yueZhi: selYueZhi.value, riGan: selRiGan.value, riZhi: selRiZhi.value,
      zhanShi: inpZhanShi.value
    });
  });

  // ---- 复制全部结果（对应 Python 版 copyall） ----
  $("btnCopy").addEventListener("click", function () {
    var text = result.textContent;
    if (!text) { return; }
    var done = function () { toast("已复制到剪贴板"); };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text, done); });
    } else {
      fallbackCopy(text, done);
    }
  });

  function fallbackCopy(text, done) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      done();
    } catch (e) {
      toast("复制失败，请手动选中复制");
    }
    ta.remove();
  }

  // ---- 重填（对应 Python 版 qinkong） ----
  $("btnReset").addEventListener("click", function () {
    result.textContent = "";
    inpZhanShi.value = "";
    chks.forEach(function (c) { c.checked = false; });
    yaoBtns.forEach(function (b) { b.textContent = YAO_YANG; });
    yaof = ["0", "0", "0", "0", "0", "0"];
    setNow();
    syncGanzhi();
  });

  // ---- 联系作者对话框（对应 Python 版 Dia） ----
  var mask = $("dialogMask");
  $("btnContact").addEventListener("click", function () { mask.hidden = false; });
  $("btnDialogClose").addEventListener("click", function () { mask.hidden = true; });
  $("btnDialogOk").addEventListener("click", function () { mask.hidden = true; });
  mask.addEventListener("click", function (e) { if (e.target === mask) { mask.hidden = true; } });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !mask.hidden) { mask.hidden = true; }
  });

  // ---- 轻提示 ----
  var toastTimer = null;
  function toast(msg) {
    var el = $("toast");
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.hidden = true; }, 1600);
  }

  // ---- PWA：注册 Service Worker（file:// 打开时跳过；缓存失败不影响正常使用） ----
  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").catch(function () {});
    });
  }
})();
