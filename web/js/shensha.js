// 神煞计算（对应 Python 版 shensha.py）
// 注：禄神表中「丙、戊」在原 Python 版误写为“己”，已按命理修正为“巳”（丙戊禄在巳）

class shensha {
  constructor(yuezhi = "寅", rigan = "甲", rizhi = "子") {
    this.yuezhi = yuezhi;
    this.rigan = rigan;
    this.rizhi = rizhi;

    // 用月支计算的神煞：天医 天禧
    this.tianyi1 = { "子": "亥", "丑": "子", "寅": "丑", "卯": "寅", "辰": "卯", "巳": "辰", "午": "巳", "未": "午",
      "申": "未", "酉": "申", "戌": "酉", "亥": "戌" };
    this.tianxi1 = { "子": "未", "丑": "未", "寅": "戌", "卯": "戌", "辰": "戌", "巳": "丑", "午": "丑", "未": "丑",
      "申": "辰", "酉": "辰", "戌": "辰", "亥": "未" };

    // 用日干计算的神煞：贵人 禄神 羊刃 文昌
    this.guiren1 = { "甲": "丑、未", "乙": "子、申", "丙": "亥、酉", "丁": "亥、酉", "戊": "丑、未", "己": "子、申",
      "庚": "午、寅", "辛": "午、寅", "壬": "巳、卯", "癸": "巳、卯" };
    this.lvshen1 = { "甲": "寅", "乙": "卯", "丙": "巳", "丁": "午", "戊": "巳", "己": "午", "庚": "申", "辛": "酉",
      "壬": "亥", "癸": "子" };
    this.yangren1 = { "甲": "卯", "乙": "寅", "丙": "午", "丁": "巳", "戊": "午", "己": "巳", "庚": "酉", "辛": "申",
      "壬": "子", "癸": "亥" };
    this.wenchang1 = { "甲": "巳", "乙": "午", "丙": "申", "丁": "酉", "戊": "申", "己": "酉", "庚": "亥", "辛": "子",
      "壬": "寅", "癸": "卯" };

    // 用日支计算的神煞：马星 桃花 将星 劫煞 灾煞 华盖 谋星
    this.maxing1 = { "申": "寅", "子": "寅", "辰": "寅", "巳": "亥", "酉": "亥", "丑": "亥", "亥": "巳", "卯": "巳",
      "未": "巳", "寅": "申", "午": "申", "戌": "申" };
    this.taohua1 = { "申": "酉", "子": "酉", "辰": "酉", "巳": "午", "酉": "午", "丑": "午", "亥": "子", "卯": "子",
      "未": "子", "寅": "卯", "午": "卯", "戌": "卯" };
    this.jiangxing1 = { "申": "子", "子": "子", "辰": "子", "巳": "酉", "酉": "酉", "丑": "酉", "亥": "卯",
      "卯": "卯", "未": "卯", "寅": "午", "午": "午", "戌": "午" };
    this.jiesha1 = { "申": "巳", "子": "巳", "辰": "巳", "巳": "寅", "酉": "寅", "丑": "寅", "亥": "申", "卯": "申",
      "未": "申", "寅": "亥", "午": "亥", "戌": "亥" };
    this.zaisha1 = { "申": "午", "子": "午", "辰": "午", "巳": "卯", "酉": "卯", "丑": "卯", "亥": "酉", "卯": "酉",
      "未": "酉", "寅": "子", "午": "子", "戌": "子" };
    this.huagai1 = { "申": "辰", "子": "辰", "辰": "辰", "巳": "丑", "酉": "丑", "丑": "丑", "亥": "未", "卯": "未",
      "未": "未", "寅": "戌", "午": "戌", "戌": "戌" };
    this.mouxing1 = { "申": "戌", "子": "戌", "辰": "戌", "巳": "未", "酉": "未", "丑": "未", "亥": "丑", "卯": "丑",
      "未": "丑", "寅": "辰", "午": "辰", "戌": "辰" };

    // 天干地支数，用来计算旬空
    this.gan = { "甲": 1, "乙": 2, "丙": 3, "丁": 4, "戊": 5, "己": 6, "庚": 7, "辛": 8, "壬": 9, "癸": 10 };
    this.zhi = { "子": 1, "丑": 2, "寅": 3, "卯": 4, "辰": 5, "巳": 6, "午": 7, "未": 8, "申": 9, "酉": 10, "戌": 11,
      "亥": 12 };
  }

  // 用月支计算的神煞：天医 天禧
  tianyi() { return this.tianyi1[this.yuezhi]; }
  tianxi() { return this.tianxi1[this.yuezhi]; }

  // 用日干计算的神煞：贵人 禄神 羊刃 文昌
  guiren() { return this.guiren1[this.rigan]; }
  lvshen() { return this.lvshen1[this.rigan]; }
  yangren() { return this.yangren1[this.rigan]; }
  wenchang() { return this.wenchang1[this.rigan]; }

  // 用日支计算的神煞：马星 桃花 将星 劫煞 灾煞 华盖 谋星
  maxing() { return this.maxing1[this.rizhi]; }
  taohua() { return this.taohua1[this.rizhi]; }
  jiangxing() { return this.jiangxing1[this.rizhi]; }
  jiesha() { return this.jiesha1[this.rizhi]; }
  zaisha() { return this.zaisha1[this.rizhi]; }
  huagai() { return this.huagai1[this.rizhi]; }
  mouxing() { return this.mouxing1[this.rizhi]; }

  // 六神 返回值是一个字典
  liushen() {
    if (this.rigan === "甲" || this.rigan === "乙") {
      return { 1: "青龙", 2: "朱雀", 3: "勾陈", 4: "腾蛇", 5: "白虎", 6: "玄武" };
    } else if (this.rigan === "丙" || this.rigan === "丁") {
      return { 1: "朱雀", 2: "勾陈", 3: "腾蛇", 4: "白虎", 5: "玄武", 6: "青龙" };
    } else if (this.rigan === "戊") {
      return { 1: "勾陈", 2: "腾蛇", 3: "白虎", 4: "玄武", 5: "青龙", 6: "朱雀" };
    } else if (this.rigan === "己") {
      return { 1: "腾蛇", 2: "白虎", 3: "玄武", 4: "青龙", 5: "朱雀", 6: "勾陈" };
    } else if (this.rigan === "庚" || this.rigan === "辛") {
      return { 1: "白虎", 2: "玄武", 3: "青龙", 4: "朱雀", 5: "勾陈", 6: "腾蛇" };
    } else if (this.rigan === "壬" || this.rigan === "癸") {
      return { 1: "玄武", 2: "青龙", 3: "朱雀", 4: "勾陈", 5: "腾蛇", 6: "白虎" };
    }
  }

  // 旬空
  xunkong() {
    const kong = this.zhi[this.rizhi] - this.gan[this.rigan];
    if (kong === 0) {
      return "（旬空：戌亥）";
    } else if (kong === 2) {
      return "（旬空：子丑）";
    } else if (kong === 6 || kong === -6) {
      return "（旬空：辰巳）";
    } else if (kong === 8 || kong === -4) {
      return "（旬空：午未）";
    } else if (kong === 4 || kong === -8) {
      return "（旬空：寅卯）";
    } else if (kong === -2 || kong === 10) {
      return "（旬空：申酉）";
    }
  }
}
