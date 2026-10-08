#!/usr/bin/env python3
"""生成黄金测试向量（以 Python 原程序输出为准）

用法: .venv/bin/python web/tools/gen_test_vectors.py

产物:
  vectors_sizhu.json  —— 四柱/星期向量 [y,m,d,h,min,nian,yue,ri,shi,weekIdx]
  vectors_paipan.json —— 完整排盘文本向量（模拟 GUI 操作生成）
"""
import datetime
import json
import os
import random
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))
sys.path.insert(0, ROOT)
os.environ.setdefault("QT_QPA_PLATFORM", "offscreen")

import sxtwl
from PyQt5.QtWidgets import QApplication

from sizhu import sizhu as Sizhu
import liuyaopaipan as lyp

HERE = os.path.dirname(os.path.abspath(__file__))
Gan = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"]
Zhi = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"]
WeekCn = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
JIE_INDICES = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23]


def jie_days(year):
    """该年 12 节令的 (month, day) 列表"""
    res = []
    d = datetime.date(year, 1, 1)
    while d.year == year:
        day = sxtwl.fromSolar(d.year, d.month, d.day)
        if day.hasJieQi() and day.getJieQi() in JIE_INDICES:
            res.append((d.month, d.day))
        d += datetime.timedelta(days=1)
    return res


def gen_sizhu():
    dates = set()
    # 全部节令日 ±1（1900-2100，覆盖所有月柱/年柱边界）
    for year in range(1900, 2101):
        for (m, d) in jie_days(year):
            base = datetime.date(year, m, d)
            for delta in (-1, 0, 1):
                dd = base + datetime.timedelta(days=delta)
                if 1900 <= dd.year <= 2100:
                    dates.add(dd)
    # 系统采样（97 天步长）+ 元旦/岁末/立春附近
    d = datetime.date(1900, 1, 1)
    while d <= datetime.date(2100, 12, 31):
        dates.add(d)
        d += datetime.timedelta(days=97)
    for year in range(1900, 2101):
        dates.add(datetime.date(year, 1, 1))
        dates.add(datetime.date(year, 12, 31))
        dates.add(datetime.date(year, 2, 3))
        dates.add(datetime.date(year, 2, 4))
        dates.add(datetime.date(year, 2, 5))

    records = []
    for d in sorted(dates):
        sz = Sizhu(d.year, d.month, d.day, 12, 30)
        records.append([d.year, d.month, d.day, 12, 30,
                        sz.nian()[0] + sz.nian()[1], sz.yue()[0] + sz.yue()[1],
                        sz.ri()[0] + sz.ri()[1], sz.shi()[0] + sz.shi()[1],
                        WeekCn.index(sz.xinqi())])
    # 时柱专项：抽样日期 x 24 小时（覆盖 23 点晚子时规则）
    all_dates = sorted(dates)
    step = max(1, len(all_dates) // 45)
    for d in all_dates[::step]:
        for h in range(24):
            sz = Sizhu(d.year, d.month, d.day, h, 30)
            records.append([d.year, d.month, d.day, h, 30,
                            sz.nian()[0] + sz.nian()[1], sz.yue()[0] + sz.yue()[1],
                            sz.ri()[0] + sz.ri()[1], sz.shi()[0] + sz.shi()[1],
                            WeekCn.index(sz.xinqi())])
    return records


def gen_paipan():
    app = QApplication.instance() or QApplication([])  # noqa: F841
    w = lyp.paipan()
    btns = [w.pushButton, w.pushButton_2, w.pushButton_3, w.pushButton_4, w.pushButton_5, w.pushButton_6]
    chks = [w.checkBox_1, w.checkBox_2, w.checkBox_3, w.checkBox_4, w.checkBox_5, w.checkBox_6]
    rng = random.Random(42)

    def run_case(c):
        w.comboBox.setCurrentText(str(c["year"]))
        w.comboBox_2.setCurrentText(str(c["month"]))
        w.comboBox_3.setCurrentText(str(c["day"]))
        w.comboBox_4.setCurrentText(str(c["hour"]))
        w.comboBox_5.setCurrentText(str(c["minute"]))
        w.biangz()
        if c.get("manual"):
            w.comboBox_6.setCurrentText(c["yueZhi"])
            w.comboBox_7.setCurrentText(c["riGan"])
            w.comboBox_8.setCurrentText(c["riZhi"])
        for i in range(6):
            btns[i].setText("■■■■■■" if c["yao"][i] == 0 else "■■　　■■")
            w.yaof[i] = str(c["yao"][i])
            chks[i].setChecked(bool(c["dong"][i]))
        w.lineEdit.setText(c["zhan"])
        w.paigua()
        return {
            "year": c["year"], "month": c["month"], "day": c["day"], "hour": c["hour"], "minute": c["minute"],
            "yao": c["yao"], "dong": c["dong"], "zhan": c["zhan"],
            "yueZhi": w.comboBox_6.currentText(), "riGan": w.comboBox_7.currentText(),
            "riZhi": w.comboBox_8.currentText(),
            "text": w.plainTextEdit.toPlainText(),
        }

    cases = []
    # 定向案例
    fixed = [
        dict(year=2026, month=9, day=30, hour=17, minute=54, yao=[0] * 6, dong=[0] * 6, zhan="", manual=False),
        dict(year=2026, month=9, day=30, hour=23, minute=10, yao=[0] * 6, dong=[0] * 6, zhan="晚子时", manual=False),
        dict(year=1984, month=2, day=2, hour=0, minute=0, yao=[0] * 6, dong=[1] * 6, zhan="乾变坤", manual=False),
        dict(year=1984, month=2, day=2, hour=0, minute=0, yao=[1] * 6, dong=[0] * 6, zhan="坤静", manual=False),
        dict(year=2000, month=1, day=1, hour=12, minute=0, yao=[0, 1, 0, 1, 0, 1], dong=[1, 0, 1, 0, 1, 0],
             zhan="占财", manual=False),
        dict(year=2026, month=9, day=30, hour=10, minute=0, yao=[0] * 6, dong=[0] * 6, zhan="", manual=True,
             yueZhi="寅", riGan="甲", riZhi="子"),
        dict(year=2026, month=9, day=30, hour=10, minute=0, yao=[1, 0, 1, 0, 1, 0], dong=[1, 1, 1, 1, 1, 1],
             zhan="古例研究", manual=True, yueZhi="酉", riGan="丙", riZhi="寅"),
        dict(year=1980, month=1, day=1, hour=0, minute=0, yao=[0] * 6, dong=[0] * 6, zhan="", manual=False),
        dict(year=2040, month=12, day=31, hour=23, minute=59, yao=[1, 1, 0, 0, 1, 1], dong=[0, 1, 0, 1, 0, 0],
             zhan="跨年", manual=False),
        dict(year=2026, month=2, day=4, hour=3, minute=0, yao=[0, 0, 1, 1, 0, 0], dong=[0] * 6, zhan="立春日",
             manual=False),
    ]
    for c in fixed:
        cases.append(run_case(c))

    # 随机案例
    for _ in range(120):
        c = dict(
            year=rng.randint(1980, 2040), month=rng.randint(1, 12), day=rng.randint(1, 28),
            hour=rng.randint(0, 23), minute=rng.randint(0, 59),
            yao=[rng.randint(0, 1) for _ in range(6)], dong=[rng.randint(0, 1) for _ in range(6)],
            zhan=rng.choice(["求财", "问婚姻", "占疾病", "考试", "出行", ""]),
            manual=rng.random() < 0.35,
        )
        if c["manual"]:
            g = rng.randint(0, 9)
            z = rng.randint(0, 11)
            if (g % 2) != (z % 2):
                z = (z + 1) % 12
            c["yueZhi"] = rng.choice(Zhi)
            c["riGan"] = Gan[g]
            c["riZhi"] = Zhi[z]
        cases.append(run_case(c))
    return cases


def main():
    sizhu_records = gen_sizhu()
    with open(os.path.join(HERE, "vectors_sizhu.json"), "w", encoding="utf-8") as f:
        json.dump(sizhu_records, f, ensure_ascii=False, separators=(",", ":"))
    print("vectors_sizhu.json:", len(sizhu_records), "条")

    paipan_cases = gen_paipan()
    with open(os.path.join(HERE, "vectors_paipan.json"), "w", encoding="utf-8") as f:
        json.dump(paipan_cases, f, ensure_ascii=False, separators=(",", ":"))
    print("vectors_paipan.json:", len(paipan_cases), "条")
    print("样例文本尾部 repr:", repr(paipan_cases[0]["text"][-25:]))


if __name__ == "__main__":
    main()
