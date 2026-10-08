// 排盘结果文本拼装（对应 Python 版 liuyaopaipan.py 中 paipan.paigua() 的输出逻辑）
// 输入: { year, month, day, hour, minute, liuyao, dong, yueZhi, riGan, riZhi, zhanShi }
// 输出: 与 Python 版逐字一致的纯文本（用于显示与复制到 Word）

function buildPaigua(o) {
  const F = (n) => "　".repeat(n); // 全角空格
  const GG = new bagua(o.liuyao, o.dong);
  const SS = new shensha(o.yueZhi, o.riGan, o.riZhi);
  const SZ2 = new sizhu(o.year, o.month, o.day, o.hour, o.minute);
  const lines = [];

  // 时间行：干支选择与日期推算一致时显示完整时间与四柱，否则仅显示手填干支
  let paiguashijian;
  if (SZ2.yue()[1] === o.yueZhi && SZ2.ri()[0] === o.riGan && SZ2.ri()[1] === o.riZhi) {
    paiguashijian = o.year + "年" + o.month + "月" + o.day + "日" + o.hour + "点" + o.minute + "分" + "　" +
      SZ2.xinqi() + "\n" + "干支：" +
      SZ2.nian()[0] + SZ2.nian()[1] + "年　" +
      SZ2.yue()[0] + SZ2.yue()[1] + "月　" +
      SZ2.ri()[0] + SZ2.ri()[1] + "日　" +
      SZ2.shi()[0] + SZ2.shi()[1] + "时";
  } else {
    paiguashijian = o.yueZhi + "月" + "　　" + o.riGan + o.riZhi + "日";
  }

  lines.push("占事：" + o.zhanShi);
  lines.push("时间：" + paiguashijian);
  lines.push("神煞：" + "华盖-" + SS.huagai() + "　将星-" + SS.jiangxing() + "　劫煞-" + SS.jiesha() + "　天医-" +
    SS.tianyi() + "　天禧-" + SS.tianxi() + "　桃花-" + SS.taohua() + "　谋星-" + SS.mouxing());
  lines.push(F(3) + "禄神-" + SS.lvshen() + "　羊刃-" + SS.yangren() + "　文昌-" + SS.wenchang() + "　马星-" +
    SS.maxing() + "　灾煞-" + SS.zaisha() + "　贵人-" + SS.guiren());

  if (parseInt(o.dong, 2) === 0) {
    // 无动爻
    lines.push(F(7) + o.yueZhi + "月" + F(7) + o.riGan + o.riZhi + "日" + SS.xunkong());
    lines.push("六神" + F(2) + "藏爻" + "　" + GG.guaming(GG.guashu(o.liuyao)) + "　" +
      GG.guagong(GG.guashu(o.liuyao)) + "宫");
    for (let i = 6; i >= 1; i--) {
      lines.push(SS.liushen()[i] + "　" + GG.canggua()[i] + GG.guafu()[i] + GG.zhugua()[i] +
        GG.guashiying(GG.guashu(o.liuyao))[i] + GG.dywz()[i] + GG.biangua()[i] + GG.guafu()[i + 6]);
    }
    lines.push(F(7) + GG.gualei(GG.guashu(o.liuyao)));
  } else {
    // 有动爻（含变卦列）
    lines.push(F(7) + o.yueZhi + "月" + F(14) + o.riGan + o.riZhi + "日" + SS.xunkong());
    lines.push("六神" + F(2) + "藏爻" + "　" + GG.guaming(GG.guashu(o.liuyao)) + "　" +
      GG.guagong(GG.guashu(o.liuyao)) + "宫" + F(10) + GG.guaming(GG.guashu(GG.bian6())) + "　" +
      GG.guagong(GG.guashu(GG.bian6())) + "宫");
    for (let i = 6; i >= 1; i--) {
      lines.push(SS.liushen()[i] + "　" + GG.canggua()[i] + GG.guafu()[i] + GG.zhugua()[i] +
        GG.guashiying(GG.guashu(o.liuyao))[i] + GG.dywz()[i] + GG.biangua()[i] + GG.guafu()[i + 6]);
    }
    lines.push(F(7) + GG.gualei(GG.guashu(o.liuyao)) + F(13) + GG.gualei(GG.guashu(GG.bian6())));
  }

  return lines.join("\n");
}
