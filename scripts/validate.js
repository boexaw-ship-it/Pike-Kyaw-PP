import fs from "node:fs";
import { groupMatches, KO, resolveKO, resultMap, tally } from "../src/logic.js";

const read = (f) => JSON.parse(fs.readFileSync(new URL(`../data/${f}`, import.meta.url), "utf8"));
const teams = read("teams.json");
const groupRes = read("group-results.json");
const koRes = read("knockout-results.json");
const errs = [];
const err = (m) => errs.push("❌ " + m);

const ids = new Set(teams.map((t) => t.id));
for (const g of "ABCDEFGH") { const n = teams.filter((t) => t.group === g).length; if (n < 3 || n > 4) err(`အုပ်စု ${g}: အသင်း ၃ သို့ ၄ သင်းရှိရမယ် (အခု ${n})`); }
if (ids.size !== teams.length) err("teams.json: အသင်း id ထပ်နေတယ်");

const gm = new Set(groupMatches(teams).map((m) => m.id));
const ko = new Set(KO.map((k) => k.id));
const seen = new Set();

function check(list, file, isKO) {
  for (const r of list) {
    if (seen.has(r.id)) err(`${r.id} ကို နှစ်ခါထည့်ထားတယ် (${file})`);
    seen.add(r.id);
    if (!(isKO ? ko : gm).has(r.id)) { err(`${file}: ${r.id} ဆိုတဲ့ ပွဲ မရှိပါ`); continue; }
    if (!Array.isArray(r.sets) || !r.sets.length) { err(`${r.id}: sets မရှိ`); continue; }
    const bad = r.sets.some((s) => !Array.isArray(s) || s.length !== 2 || !s.every((n) => Number.isInteger(n) && n >= 0) || s[0] === s[1]);
    if (bad) { err(`${r.id}: ရမှတ်မှားနေတယ် (ကိန်းပြည့် ၂ ခု၊ မတူရ)`); continue; }
    if (!isKO && r.sets.length !== 1) err(`${r.id}: အုပ်စုပွဲက ၁ set ပဲ`);
    if (isKO) {
      if (r.sets.length > 3) err(`${r.id}: set ၃ ခုထက်မများရ`);
      const t = tally(r.sets);
      if (!t.winner || Math.max(t.a, t.b) !== 2) err(`${r.id}: ၃ set ၂ နိုင် ပြည့်စုံရမယ်`);
      if (r.sets.length === 3) {
        const f = tally(r.sets.slice(0, 2));
        if (f.a === 2 || f.b === 2) err(`${r.id}: ၂ set နဲ့ ပြီးပြီဆိုရင် ၃ ခုမထည့်ရ`);
      }
    }
  }
}
check(groupRes, "group-results.json", false);
check(koRes, "knockout-results.json", true);

if (!errs.length) {
  const { ko: bracket } = resolveKO(teams, resultMap([...groupRes, ...koRes]));
  for (const k of KO) if (bracket[k.id].res && (!bracket[k.id].ta || !bracket[k.id].tb)) err(`${k.id}: အသင်းမသိသေးခင် ရလဒ်ထည့်ထားတယ်`);
}
if (errs.length) { console.error(errs.join("\n")); process.exit(1); }
console.log(`✅ data အိုကေ (အုပ်စုပွဲ ${groupRes.length}၊ knockout ${koRes.length})`);
