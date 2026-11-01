// data.json မှားရင် build မအောင်ဘဲ ရပ်မယ် (Vercel မှာ အရင် site ပဲ ဆက်ရှိနေမယ်)
import fs from "node:fs";
import { groupMatches, KO, resolveKO, resultMap, tally } from "../src/logic.js";

const data = JSON.parse(fs.readFileSync(new URL("../data/data.json", import.meta.url), "utf8"));
const errs = [];
const err = (m) => errs.push("❌ " + m);

const ids = new Set(data.teams.map((t) => t.id));
if (data.teams.length !== 32) err(`အသင်း ၃၂ သင်းရှိရမယ် (အခု ${data.teams.length})`);
if (ids.size !== data.teams.length) err("အသင်း id ထပ်နေတယ်");

const gm = new Set(groupMatches().map((m) => m.id));
const ko = new Set(KO.map((k) => k.id));
const seen = new Set();
for (const r of data.results) {
  if (seen.has(r.id)) err(`${r.id} ကို နှစ်ခါထည့်ထားတယ်`);
  seen.add(r.id);
  const isG = gm.has(r.id), isK = ko.has(r.id);
  if (!isG && !isK) { err(`${r.id} ဆိုတဲ့ ပွဲ မရှိပါ (ဥပမာ A-1v2 သို့ K1)`); continue; }
  if (!Array.isArray(r.sets) || !r.sets.length) { err(`${r.id}: sets မရှိ`); continue; }
  const bad = r.sets.some((s) => !Array.isArray(s) || s.length !== 2 || !s.every((n) => Number.isInteger(n) && n >= 0) || s[0] === s[1]);
  if (bad) { err(`${r.id}: ရမှတ်မှားနေတယ် (ကိန်းပြည့် ၂ ခု၊ မတူရ)`); continue; }
  if (isG && r.sets.length !== 1) err(`${r.id}: အုပ်စုပွဲက ၁ set ပဲ`);
  if (isK) {
    if (r.sets.length > 3) err(`${r.id}: set ၃ ခုထက်မများရ`);
    const t = tally(r.sets);
    if (!t.winner || Math.max(t.a, t.b) !== 2) err(`${r.id}: ၃ set ၂ နိုင် ပြည့်စုံရမယ်`);
    if (r.sets.length === 3) {
      const f = tally(r.sets.slice(0, 2));
      if (f.a === 2 || f.b === 2) err(`${r.id}: ၂ set နဲ့ ပြီးပြီဆိုရင် ၃ ခုမထည့်ရ`);
    }
  }
}
if (!errs.length) {
  const { ko: bracket } = resolveKO(data.teams, resultMap(data.results));
  for (const k of KO) if (bracket[k.id].res && (!bracket[k.id].ta || !bracket[k.id].tb)) err(`${k.id}: အသင်းမသိသေးခင် ရလဒ်ထည့်ထားတယ်`);
}
if (errs.length) { console.error(errs.join("\n")); process.exit(1); }
console.log(`✅ data.json အိုကေ (ရလဒ် ${data.results.length} ပွဲ)`);
