// 四柱干支（对应 Python 版 sizhu.py）
// 年柱、月柱按“节令当日即换”的日级规则切换（与 sxtwl 行为一致），节令数据来自 jieqi_data.js
// 日干支锚点 (JDN+49)%60、时柱（含 23 点晚子时规则）、星期映射均已与原程序全量校验

class sizhu {
  constructor(year, month, day, hou, minu) {
    this.year = parseInt(year, 10);
    this.month = parseInt(month, 10);
    this.day = parseInt(day, 10);
    this.hou = parseInt(hou, 10);
    this.minu = parseInt(minu, 10);
    this.Gan = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
    this.Zhi = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
    this.WeekCn = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
  }

  // 该公历日期的儒略日数 JDN
  static jdn(y, m, d) {
    const a = Math.floor((14 - m) / 12);
    const y2 = y + 4800 - a;
    const m2 = m + 12 * a - 3;
    return d + Math.floor((153 * m2 + 2) / 5) + 365 * y2 + Math.floor(y2 / 4) - Math.floor(y2 / 100) + Math.floor(y2 / 400) - 32045;
  }

  // 日干支序（0=甲子）
  static dayIndex(y, m, d) {
    return (((sizhu.jdn(y, m, d) + 49) % 60) + 60) % 60;
  }

  // 当前日期（日级）所处节令：返回 [月支索引, 干支年]
  // JIEQI_DATA 每年 12 项，按公历年内顺序 小寒..大雪
  static jieMonth(y, m, d) {
    const ZHI_OF_JIE = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0]; // 小寒→丑 … 大雪→子
    const pad = (n) => (n < 10 ? "0" + n : "" + n);
    const target = y + "-" + pad(m) + "-" + pad(d);
    let best = null;
    for (const yy of [y - 1, y]) {
      const arr = JIEQI_DATA[String(yy)];
      for (let i = 0; i < 12; i++) {
        // arr[i] 形如 "02-04 04:01"：节令当日即换柱，故只按日期部分比较
        const key = yy + "-" + arr[i].slice(0, 5);
        if (key <= target) {
          best = [ZHI_OF_JIE[i], i === 0 ? yy - 1 : yy]; // 小寒仍属上一干支年
        }
      }
    }
    return best;
  }

  ri() {
    const k = sizhu.dayIndex(this.year, this.month, this.day);
    return [this.Gan[k % 10], this.Zhi[k % 12]];
  }

  yue() {
    const jie = sizhu.jieMonth(this.year, this.month, this.day);
    const mz = jie[0];
    const gzYear = jie[1];
    const yg = ((((gzYear - 4) % 60) + 60) % 60) % 10;
    // 五虎遁：由年干推寅月干，再数到目标月支
    const mg = ((yg % 5) * 2 + 2 + ((mz - 2 + 12) % 12)) % 10;
    return [this.Gan[mg], this.Zhi[mz]];
  }

  nian() {
    const gzYear = sizhu.jieMonth(this.year, this.month, this.day)[1];
    const k = (((gzYear - 4) % 60) + 60) % 60;
    return [this.Gan[k % 10], this.Zhi[k % 12]];
  }

  shi() {
    const k = sizhu.dayIndex(this.year, this.month, this.day);
    let tg = k % 10;
    if (this.hou === 23) {
      tg = (tg + 1) % 10; // 晚子时按次日日干（与 sxtwl 一致）
    }
    const zhi = ((this.hou + 1) >> 1) % 12;
    const gan = ((tg % 5) * 2 + zhi) % 10;
    return [this.Gan[gan], this.Zhi[zhi]];
  }

  xinqi() {
    return this.WeekCn[(sizhu.jdn(this.year, this.month, this.day) + 1) % 7];
  }
}
