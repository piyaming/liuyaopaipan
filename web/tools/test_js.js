// node 自动化对比测试：JS 实现 vs Python 原程序黄金向量
// 用法: node web/tools/test_js.js
const fs = require("fs");
const path = require("path");

const toolsDir = __dirname;
const webRoot = path.join(toolsDir, "..");

// 将页面脚本按顺序拼接为工厂函数（模拟浏览器中多个 <script> 共享全局作用域）
const files = ["js/jieqi_data.js", "js/sizhu.js", "js/shensha.js", "js/bagua.js", "js/output.js"];
const src = files.map((f) => fs.readFileSync(path.join(webRoot, f), "utf8")).join("\n");
const factory = new Function(src + "\n;return { sizhu, shensha, bagua, buildPaigua };");
const { sizhu, buildPaigua } = factory();

let total = 0;
let fail = 0;

// ---- Part 1: 四柱向量 [y,m,d,h,min,nian,yue,ri,shi,weekIdx] ----
const WeekCn = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
const sizhuVec = JSON.parse(fs.readFileSync(path.join(toolsDir, "vectors_sizhu.json"), "utf8"));
for (const [y, m, d, h, mi, nian, yue, ri, shi, week] of sizhuVec) {
  total++;
  const z = new sizhu(y, m, d, h, mi);
  const got = [z.nian().join(""), z.yue().join(""), z.ri().join(""), z.shi().join(""), WeekCn.indexOf(z.xinqi())];
  const exp = [nian, yue, ri, shi, week];
  if (got.join("|") !== exp.join("|")) {
    fail++;
    if (fail <= 15) console.log("SIZHU 不一致:", [y, m, d, h, mi], "期望", exp.join("|"), "实际", got.join("|"));
  }
}

// ---- Part 2: 排盘文本向量 ----
const paipanVec = JSON.parse(fs.readFileSync(path.join(toolsDir, "vectors_paipan.json"), "utf8"));
for (const c of paipanVec) {
  total++;
  const text = buildPaigua({
    year: c.year, month: c.month, day: c.day, hour: c.hour, minute: c.minute,
    liuyao: c.yao.join(""), dong: c.dong.join(""),
    yueZhi: c.yueZhi, riGan: c.riGan, riZhi: c.riZhi, zhanShi: c.zhan,
  });
  if (text !== c.text) {
    fail++;
    if (fail <= 8) {
      console.log("PAIPAN 不一致 case:", JSON.stringify({ y: c.year, mo: c.month, d: c.day, h: c.hour, mi: c.minute, yao: c.yao, dong: c.dong, yueZhi: c.yueZhi, riGan: c.riGan, riZhi: c.riZhi }));
      console.log("期望:", JSON.stringify(c.text.slice(0, 260)));
      console.log("实际:", JSON.stringify(text.slice(0, 260)));
      console.log("---");
    }
  }
}

console.log(`\n共 ${total} 例，失败 ${fail}`);
process.exit(fail ? 1 : 0);
