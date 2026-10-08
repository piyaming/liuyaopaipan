#!/usr/bin/env python3
"""生成 web/js/jieqi_data.js —— 12 节令数据（与 Python 版 sxtwl 一致，供 JS 计算年/月柱）

用法: .venv/bin/python web/tools/gen_jieqi.py

核心：日期取「月支实际切换日」——逐日调用 sxtwl 的 getMonthGZ()（原程序 sizhu.py 使用的
同一个 API），把月支发生变化的那一天记为节令日；时刻取该节令的精确交节时刻（getJieQiJD）。
极少数历史年份（如 1917-12-07 大雪、1927-09-08 白露）交节时刻贴近午夜，sxtwl 的
hasJieQi 标记日与 getMonthGZ 的切换日相差一天，这里以 getMonthGZ 为准以保证与原程序一致。

数据结构: 每年 12 个节令，按公历年内顺序（小寒→...→大雪），值为 "MM-DD HH:MM"（北京时间）。
年份范围向外多生成两年（1899/2101），保证 1900-2100 任意日期都能取到相邻节令。
"""
import datetime
import os
import sxtwl

START, END = 1899, 2101
JIE_INDICES = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23]  # jqmc 中 0=冬至，奇数索引均为「节」
# 月支索引 -> 该月起始的节令 jqmc（丑月起于小寒、寅月起于立春、……、子月起于大雪）
ZHI_TO_JIE = {1: 1, 2: 3, 3: 5, 4: 7, 5: 9, 6: 11, 7: 13, 8: 15, 9: 17, 10: 19, 11: 21, 0: 23}


def main():
    scan_end = datetime.date(END, 12, 31)

    # 第一遍：收集各节令的精确交节时刻 {(年, jqmc): (时, 分)}
    jq_time = {}
    d = datetime.date(START, 1, 1)
    while d <= scan_end:
        day = sxtwl.fromSolar(d.year, d.month, d.day)
        if day.hasJieQi():
            jq = day.getJieQi()
            if jq in JIE_INDICES:
                t = sxtwl.JD2DD(day.getJieQiJD())
                jq_time[(d.year, jq)] = (int(t.h), int(t.m))
        d += datetime.timedelta(days=1)

    # 第二遍：逐日检测月支切换，切换日即为节令日
    data = {}
    prev_mz = None
    d = datetime.date(START, 1, 1)
    while d <= scan_end:
        day = sxtwl.fromSolar(d.year, d.month, d.day)
        mz = day.getMonthGZ().dz
        if prev_mz is not None and mz != prev_mz:
            jq = ZHI_TO_JIE[mz]
            hh, mm = jq_time.get((d.year, jq), (0, 0))
            data.setdefault(d.year, {})[jq] = "%02d-%02d %02d:%02d" % (d.month, d.day, hh, mm)
        prev_mz = mz
        d += datetime.timedelta(days=1)

    for year in range(START, END + 1):
        assert len(data.get(year, {})) == 12, (year, sorted(data.get(year, {})))

    out = []
    out.append("// 本文件由 tools/gen_jieqi.py 生成（数据来源: sxtwl 寿星天文历），请勿手工修改")
    out.append("// 每年 12 个节令（决定月柱），按公历年内顺序: 小寒 立春 惊蛰 清明 立夏 芒种 小暑 立秋 白露 寒露 立冬 大雪")
    out.append("// 日期为月支实际切换日（与 sxtwl getMonthGZ 一致），格式 \"MM-DD HH:MM\"（北京时间）；年份范围 %d-%d" % (START, END))
    out.append("const JIEQI_DATA = {")
    for year in range(START, END + 1):
        items = ", ".join('"%s"' % data[year][i] for i in JIE_INDICES)
        out.append('  "%d": [%s],' % (year, items))
    out.append("};")
    out.append('if (typeof globalThis !== "undefined") { globalThis.JIEQI_DATA = JIEQI_DATA; }')
    out.append("")

    path = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "js", "jieqi_data.js"))
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write("\n".join(out))
    print("已生成:", path)
    print("年份数:", len(data))


if __name__ == "__main__":
    main()
