// 八卦类（对应 Python 版 bagua.py，逻辑与表格完全一致）
class bagua {
  constructor(liuyao = "000000", dong = "000000") {
    this.liuyao = liuyao;
    this.dong = dong;
    // 64卦名 和 八宫卦名
    this.guaming64 = {
      0: "乾为天", 9: "兑为泽", 18: "离为火", 27: "震为雷", 36: "巽为风", 45: "坎为水", 54: "艮为山", 63: "坤为地",
      32: "天风姤", 41: "泽水困", 50: "火山旅", 59: "雷地豫", 4: "风天小畜", 13: "水泽节", 22: "山火贲", 31: "地雷复",
      48: "天山遁", 57: "泽地萃", 34: "火风鼎", 43: "雷水解", 20: "风火家人", 29: "水雷屯", 6: "山天大畜", 15: "地泽临",
      56: "天地否", 49: "泽山咸", 42: "火水未济", 35: "雷风恒", 28: "风雷益", 21: "水火既济", 14: "山泽损", 7: "地天泰",
      60: "风地观", 53: "水山蹇", 46: "山水蒙", 39: "地风升", 24: "天雷无妄", 17: "泽火革", 10: "火泽睽", 3: "雷天大壮",
      62: "山地剥", 55: "地山谦", 44: "风水涣", 37: "水风井", 26: "火雷噬嗑", 19: "雷火丰", 8: "天泽履", 1: "泽天夬",
      58: "火地晋", 51: "雷山小过", 40: "天水讼", 33: "泽风大过", 30: "山雷颐", 23: "地火明夷", 12: "风泽中孚", 5: "水天需",
      2: "火天大有", 11: "雷泽归妹", 16: "天火同人", 25: "泽雷随", 38: "山风蛊", 47: "地水师", 52: "风山渐", 61: "水地比"
    };
    this.baguaming = { 0: "乾", 1: "兑", 2: "离", 3: "震", 4: "巽", 5: "坎", 6: "艮", 7: "坤" };
    // 八宫纳支
    this.qian = { 1: "子", 2: "寅", 3: "辰", 4: "午", 5: "申", 6: "戌" };
    this.dui = { 1: "巳", 2: "卯", 3: "丑", 4: "亥", 5: "酉", 6: "未" };
    this.li = { 1: "卯", 2: "丑", 3: "亥", 4: "酉", 5: "未", 6: "巳" };
    this.zhen = { 1: "子", 2: "寅", 3: "辰", 4: "午", 5: "申", 6: "戌" };
    this.xun = { 1: "丑", 2: "亥", 3: "酉", 4: "未", 5: "巳", 6: "卯" };
    this.kan = { 1: "寅", 2: "辰", 3: "午", 4: "申", 5: "戌", 6: "子" };
    this.gen = { 1: "辰", 2: "午", 3: "申", 4: "戌", 5: "子", 6: "寅" };
    this.kun = { 1: "未", 2: "巳", 3: "卯", 4: "丑", 5: "亥", 6: "酉" };
    // 藏爻
    this.cangyao = { "乾": "000000", "兑": "001001", "离": "010010", "震": "011011", "巽": "100100", "坎": "101101", "艮": "110110", "坤": "111111" };
    // 地支五行
    this.DZ5x = { "子": "水", "丑": "土", "寅": "木", "卯": "木", "辰": "土", "巳": "火", "午": "火", "未": "土", "申": "金", "酉": "金",
      "戌": "土", "亥": "水" };
    // 八卦六亲
    this.qian6qin = { "木": "妻财", "火": "官鬼", "土": "父母", "金": "兄弟", "水": "子孙" };
    this.dui6qin = { "木": "妻财", "火": "官鬼", "土": "父母", "金": "兄弟", "水": "子孙" };
    this.li6qin = { "木": "父母", "火": "兄弟", "土": "子孙", "金": "妻财", "水": "官鬼" };
    this.zhen6qin = { "木": "兄弟", "火": "子孙", "土": "妻财", "金": "官鬼", "水": "父母" };
    this.xun6qin = { "木": "兄弟", "火": "子孙", "土": "妻财", "金": "官鬼", "水": "父母" };
    this.kan6qin = { "木": "子孙", "火": "妻财", "土": "官鬼", "金": "父母", "水": "兄弟" };
    this.gen6qin = { "木": "官鬼", "火": "父母", "土": "兄弟", "金": "子孙", "水": "妻财" };
    this.kun6qin = { "木": "官鬼", "火": "父母", "土": "兄弟", "金": "子孙", "水": "妻财" };

    this.nazhi = {};
    this.guanazhi(this.xiaguashu(this.liuyao), this.shangguashu(this.liuyao));
  }

  // 变卦
  bian6() {
    this.b6 = "";
    if (this.dong !== "000000") {
      for (let i = 0; i < 6; i++) {
        if (this.dong[i] === "0") {
          this.b6 = this.b6 + String(parseInt(this.dong[i], 10) + parseInt(this.liuyao[i], 10));
        } else if (this.dong[i] === "1") {
          this.b6 = this.b6 + String(parseInt(this.dong[i], 10) - parseInt(this.liuyao[i], 10));
        }
      }
      return this.b6;
    } else {
      return this.liuyao;
    }
  }

  // 藏爻伏
  cangyaofu(gs) {
    const gong = this.guagong(gs);
    if (gong === "乾") {
      return this.cangyao["乾"];
    } else if (gong === "兑") {
      return this.cangyao["兑"];
    } else if (gong === "离") {
      return this.cangyao["离"];
    } else if (gong === "震") {
      return this.cangyao["震"];
    } else if (gong === "巽") {
      return this.cangyao["巽"];
    } else if (gong === "坎") {
      return this.cangyao["坎"];
    } else if (gong === "艮") {
      return this.cangyao["艮"];
    } else if (gong === "坤") {
      return this.cangyao["坤"];
    }
  }

  // 卦数
  guashu(gf) {
    return parseInt(gf, 2);
  }

  // 上卦数
  shangguashu(sgs) {
    return parseInt(sgs.slice(3), 2);
  }

  // 下卦数
  xiaguashu(xgs) {
    return parseInt(xgs.slice(0, 3), 2);
  }

  guaming(gs) {
    return this.guaming64[gs];
  }

  // 卦宫
  guagong(gs) {
    if ([0, 32, 48, 56, 60, 62, 58, 2].includes(gs)) {
      return "乾";
    } else if ([9, 41, 57, 49, 53, 55, 51, 11].includes(gs)) {
      return "兑";
    } else if ([18, 50, 34, 42, 46, 44, 40, 16].includes(gs)) {
      return "离";
    } else if ([27, 59, 43, 35, 39, 37, 33, 25].includes(gs)) {
      return "震";
    } else if ([36, 4, 20, 28, 24, 26, 30, 38].includes(gs)) {
      return "巽";
    } else if ([45, 13, 29, 21, 17, 19, 23, 47].includes(gs)) {
      return "坎";
    } else if ([54, 22, 6, 14, 10, 8, 12, 52].includes(gs)) {
      return "艮";
    } else if ([63, 31, 15, 7, 3, 1, 5, 61].includes(gs)) {
      return "坤";
    }
  }

  // 卦类 六合 六冲 归魂 游魂
  gualei(gs) {
    if ([56, 41, 50, 59, 13, 22, 31, 7].includes(gs)) {
      return "六合卦";
    } else if ([0, 9, 18, 27, 36, 45, 54, 63, 3, 24].includes(gs)) {
      return "六冲卦";
    } else if ([58, 51, 40, 33, 30, 23, 12, 5].includes(gs)) {
      return "游魂卦";
    } else if ([2, 11, 16, 25, 38, 47, 52, 61].includes(gs)) {
      return "归魂卦";
    } else {
      return "　　　";
    }
  }

  // 卦纳支
  guanazhi(xgs, sgs) {
    if (this.baguaming[xgs] === "乾" || this.baguaming[xgs] === "震") {
      this.nazhi = { 1: this.qian[1], 2: this.qian[2], 3: this.qian[3] };
    } else if (this.baguaming[xgs] === "兑") {
      this.nazhi = { 1: this.dui[1], 2: this.dui[2], 3: this.dui[3] };
    } else if (this.baguaming[xgs] === "离") {
      this.nazhi = { 1: this.li[1], 2: this.li[2], 3: this.li[3] };
    } else if (this.baguaming[xgs] === "巽") {
      this.nazhi = { 1: this.xun[1], 2: this.xun[2], 3: this.xun[3] };
    } else if (this.baguaming[xgs] === "坎") {
      this.nazhi = { 1: this.kan[1], 2: this.kan[2], 3: this.kan[3] };
    } else if (this.baguaming[xgs] === "艮") {
      this.nazhi = { 1: this.gen[1], 2: this.gen[2], 3: this.gen[3] };
    } else if (this.baguaming[xgs] === "坤") {
      this.nazhi = { 1: this.kun[1], 2: this.kun[2], 3: this.kun[3] };
    }

    if (this.baguaming[sgs] === "乾" || this.baguaming[sgs] === "震") {
      this.nazhi[4] = this.qian[4];
      this.nazhi[5] = this.qian[5];
      this.nazhi[6] = this.qian[6];
    } else if (this.baguaming[sgs] === "兑") {
      this.nazhi[4] = this.dui[4];
      this.nazhi[5] = this.dui[5];
      this.nazhi[6] = this.dui[6];
    } else if (this.baguaming[sgs] === "离") {
      this.nazhi[4] = this.li[4];
      this.nazhi[5] = this.li[5];
      this.nazhi[6] = this.li[6];
    } else if (this.baguaming[sgs] === "巽") {
      this.nazhi[4] = this.xun[4];
      this.nazhi[5] = this.xun[5];
      this.nazhi[6] = this.xun[6];
    } else if (this.baguaming[sgs] === "坎") {
      this.nazhi[4] = this.kan[4];
      this.nazhi[5] = this.kan[5];
      this.nazhi[6] = this.kan[6];
    } else if (this.baguaming[sgs] === "艮") {
      this.nazhi[4] = this.gen[4];
      this.nazhi[5] = this.gen[5];
      this.nazhi[6] = this.gen[6];
    } else if (this.baguaming[sgs] === "坤") {
      this.nazhi[4] = this.kun[4];
      this.nazhi[5] = this.kun[5];
      this.nazhi[6] = this.kun[6];
    }
    return this.nazhi;
  }

  // 卦纳支 对应的五行
  guawuxing(xgs, sgs) {
    this.gwx = {};
    for (let i = 1; i <= 6; i++) {
      this.gwx[i] = this.DZ5x[this.guanazhi(xgs, sgs)[i]];
    }
    return this.gwx;
  }

  // 通过卦的纳支 和 卦宫算六亲
  gualiuqin(guagong, xgs, sgs) {
    this.glq = {};
    const table = { "乾": this.qian6qin, "兑": this.dui6qin, "离": this.li6qin, "震": this.zhen6qin, "巽": this.xun6qin,
      "坎": this.kan6qin, "艮": this.gen6qin, "坤": this.kun6qin }[guagong];
    if (!table) {
      return null;
    }
    for (let i = 1; i <= 6; i++) {
      this.glq[i] = table[this.guawuxing(xgs, sgs)[i]];
    }
    return this.glq;
  }

  // 卦世应
  guashiying(gs) {
    const f2 = "　　";
    if ([0, 9, 18, 27, 36, 45, 54, 63].includes(gs)) {
      return { 1: f2, 2: f2, 3: "　应", 4: f2, 5: f2, 6: "　世" };
    }
    if ([32, 41, 50, 59, 4, 13, 22, 31].includes(gs)) {
      return { 1: "　世", 2: f2, 3: f2, 4: "　应", 5: f2, 6: f2 };
    }
    if ([48, 57, 34, 43, 20, 29, 6, 15].includes(gs)) {
      return { 1: f2, 2: "　世", 3: f2, 4: f2, 5: "　应", 6: f2 };
    }
    if ([56, 49, 42, 35, 28, 21, 14, 7, 2, 11, 16, 25, 38, 47, 52, 61].includes(gs)) {
      return { 1: f2, 2: f2, 3: "　世", 4: f2, 5: f2, 6: "　应" };
    }
    if ([60, 53, 46, 39, 24, 17, 10, 3, 58, 51, 40, 33, 30, 23, 12, 5].includes(gs)) {
      return { 1: "　应", 2: f2, 3: f2, 4: "　世", 5: f2, 6: f2 };
    }
    if ([62, 55, 44, 37, 26, 19, 8, 1].includes(gs)) {
      return { 1: f2, 2: "　应", 3: f2, 4: f2, 5: "　世", 6: f2 };
    }
  }

  // 卦阴阳符号
  guafu() {
    this.yingyangfu = {};
    for (let i = 1; i <= 6; i++) {
      if (this.liuyao[i - 1] === "1") {
        this.yingyangfu[i] = "■■　　■■";
      } else if (this.liuyao[i - 1] === "0") {
        this.yingyangfu[i] = "■■■■■■";
      }
    }

    if (parseInt(this.dong, 2) === 0) {
      for (let i = 7; i <= 12; i++) {
        this.yingyangfu[i] = "";
      }
    } else {
      for (let i = 7; i <= 12; i++) {
        if (this.bian6()[i - 7] === "1") {
          this.yingyangfu[i] = "■■　　■■";
        } else if (this.bian6()[i - 7] === "0") {
          this.yingyangfu[i] = "■■■■■■";
        }
      }
    }
    return this.yingyangfu;
  }

  // 动爻位置
  dywz() {
    const f4 = "　".repeat(4);
    this.dyfh = { 1: f4, 2: f4, 3: f4, 4: f4, 5: f4, 6: f4 };
    if (parseInt(this.dong, 2) !== 0) {
      for (let i = 1; i <= 6; i++) {
        if (this.dong[i - 1] === "1") {
          if (this.liuyao[i - 1] === "1") {
            this.dyfh[i] = "　×→　";
          } else if (this.liuyao[i - 1] === "0") {
            this.dyfh[i] = "　○→　";
          }
        } else if (this.dong[i - 1] === "0") {
          this.dyfh[i] = f4;
        }
      }
      return this.dyfh;
    } else {
      this.dyfh = { 1: "", 2: "", 3: "", 4: "", 5: "", 6: "" };
      return this.dyfh;
    }
  }

  // 主卦
  zhugua() {
    const zg = { 1: "", 2: "", 3: "", 4: "", 5: "", 6: "" };
    const gong = this.guagong(this.guashu(this.liuyao));
    for (let i = 1; i <= 6; i++) {
      zg[i] = this.gualiuqin(gong, this.xiaguashu(this.liuyao), this.shangguashu(this.liuyao))[i] +
        this.guanazhi(this.xiaguashu(this.liuyao), this.shangguashu(this.liuyao))[i] +
        this.guawuxing(this.xiaguashu(this.liuyao), this.shangguashu(this.liuyao))[i];
    }
    return zg;
  }

  // 变卦
  biangua() {
    const bg = { 1: "", 2: "", 3: "", 4: "", 5: "", 6: "" };
    if (parseInt(this.dong, 2) === 0) {
      return bg;
    }
    const gong = this.guagong(this.guashu(this.liuyao));
    for (let i = 1; i <= 6; i++) {
      bg[i] = this.gualiuqin(gong, this.xiaguashu(this.bian6()), this.shangguashu(this.bian6()))[i] +
        this.guanazhi(this.xiaguashu(this.bian6()), this.shangguashu(this.bian6()))[i] +
        this.guawuxing(this.xiaguashu(this.bian6()), this.shangguashu(this.bian6()))[i];
    }
    return bg;
  }

  // 藏卦
  canggua() {
    const cg = {};
    const cgg = { 1: "　".repeat(4), 2: "　".repeat(4), 3: "　".repeat(4), 4: "　".repeat(4), 5: "　".repeat(4), 6: "　".repeat(4) };
    const cf = this.cangyaofu(this.guashu(this.liuyao));

    const z1 = this.guanazhi(this.xiaguashu(this.liuyao), this.shangguashu(this.liuyao))[1];
    const z4 = this.guanazhi(this.xiaguashu(this.liuyao), this.shangguashu(this.liuyao))[4];
    const c1 = this.guanazhi(this.xiaguashu(cf), this.shangguashu(cf))[1];
    const c4 = this.guanazhi(this.xiaguashu(cf), this.shangguashu(cf))[4];

    for (let i = 1; i <= 6; i++) {
      cg[i] = this.gualiuqin(this.guagong(this.guashu(this.liuyao)), this.xiaguashu(cf), this.shangguashu(cf))[i] +
        this.guanazhi(this.xiaguashu(cf), this.shangguashu(cf))[i] +
        this.guawuxing(this.xiaguashu(cf), this.shangguashu(cf))[i];
    }

    if (z1 === c1 && z4 === c4) {
      return cgg;
    } else if (z1 === c1 && z4 !== c4) {
      for (let i = 4; i <= 6; i++) {
        cgg[i] = cg[i];
      }
      return cgg;
    } else if (z1 !== c1 && z4 === c4) {
      for (let i = 1; i <= 3; i++) {
        cgg[i] = cg[i];
      }
      return cgg;
    } else {
      return cg;
    }
  }
}
