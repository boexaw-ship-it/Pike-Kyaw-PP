// စည်းမျဉ်းများ အားလုံး ဒီဖိုင်မှာပဲ ရှိတယ်။ (အနိုင် ၂ မှတ်၊ မှတ်တူရင် Total Point)
export const GROUPS = "ABCDEFGH".split("");
export const WIN_POINTS = 2;
const PAIRS = [[1, 2], [3, 4], [1, 3], [2, 4], [1, 4], [2, 3]];

export const STAGES = {
  R16: "အပြင်ပိုင်း ၁၆ သင်း",
  QF: "ကွာတားဖိုင်နယ်",
  SF: "ဆီမီးဖိုင်နယ်",
  TP: "တတိယလုပွဲ",
  F: "ဖိုင်နယ်",
};

const g = (grp, r) => ({ g: grp, r });
const W = (m) => ({ w: m });
const L = (m) => ({ l: m });
// ပုံထဲက ပွဲစဉ် ၁–၁၆
export const KO = [
  ["R16", g("A", 1), g("H", 2)], ["R16", g("B", 1), g("G", 2)],
  ["R16", g("C", 1), g("F", 2)], ["R16", g("D", 1), g("E", 2)],
  ["R16", g("E", 1), g("D", 2)], ["R16", g("F", 1), g("C", 2)],
  ["R16", g("G", 1), g("B", 2)], ["R16", g("H", 1), g("A", 2)],
  ["QF", W(1), W(2)], ["QF", W(3), W(4)], ["QF", W(5), W(6)], ["QF", W(7), W(8)],
  ["SF", W(9), W(10)], ["SF", W(11), W(12)],
  ["TP", L(13), L(14)], ["F", W(13), W(14)],
].map(([stage, a, b], i) => ({ id: `K${i + 1}`, no: i + 1, stage, a, b }));

// အုပ်စုတစ်ခုမှာ အသင်း ၃ သင်း (သို့) ၄ သင်း ရှိနိုင်တယ်
export function groupMatches(teams) {
  const ids = new Set(teams.map((t) => t.id));
  return GROUPS.flatMap((grp) =>
    PAIRS.filter(([i, j]) => ids.has(`${grp}${i}`) && ids.has(`${grp}${j}`)).map(([i, j]) => ({
      id: `${grp}-${i}v${j}`, group: grp, a: `${grp}${i}`, b: `${grp}${j}`,
    }))
  );
}

export function resultMap(results) {
  return Object.fromEntries(results.map((r) => [r.id, r]));
}

// sets → { a: နိုင်set, b: နိုင်set, pa: စုစုပေါင်းရမှတ်, pb, winner: 'a'|'b'|null }
export function tally(sets = []) {
  let a = 0, b = 0, pa = 0, pb = 0;
  for (const [x, y] of sets) {
    pa += x; pb += y;
    if (x > y) a++; else if (y > x) b++;
  }
  return { a, b, pa, pb, winner: a === b ? null : a > b ? "a" : "b" };
}

export function standings(grp, teams, rmap) {
  const rows = Object.fromEntries(
    teams.filter((t) => t.group === grp).map((t) => [t.id, { id: t.id, p: 0, w: 0, l: 0, pts: 0, sc: 0, co: 0 }])
  );
  let done = 0;
  const ms = groupMatches(teams).filter((m) => m.group === grp);
  for (const m of ms) {
    const r = rmap[m.id];
    if (!r) continue;
    const t = tally(r.sets);
    const A = rows[m.a], B = rows[m.b];
    A.p++; B.p++; A.sc += t.pa; A.co += t.pb; B.sc += t.pb; B.co += t.pa;
    if (t.winner === "a") { A.w++; B.l++; A.pts += WIN_POINTS; }
    else if (t.winner === "b") { B.w++; A.l++; B.pts += WIN_POINTS; }
    done++;
  }
  const list = Object.values(rows).sort(
    (x, y) => y.pts - x.pts || y.sc - x.sc || (y.sc - y.co) - (x.sc - x.co) || x.id.localeCompare(y.id)
  );
  return { rows: list, complete: done === ms.length };
}

const ordinal = (r) => (r === 1 ? "ပထမ" : "ဒုတိယ");

// Knockout bracket ကို အုပ်စုရလဒ်ကနေ တွက်
export function resolveKO(teams, rmap) {
  const st = Object.fromEntries(GROUPS.map((grp) => [grp, standings(grp, teams, rmap)]));
  const out = {};
  const side = (src) => {
    if (src.g) {
      const s = st[src.g];
      return { team: s.complete ? s.rows[src.r - 1].id : null, label: `${src.g} အုပ်စု ${ordinal(src.r)}` };
    }
    const m = out[`K${src.w ?? src.l}`];
    const id = src.w ? m.winner : m.loser;
    return { team: id, label: `ပွဲစဉ် ${src.w ?? src.l} ${src.w ? "နိုင်သူ" : "ရှုံးသူ"}` };
  };
  for (const k of KO) {
    const a = side(k.a), b = side(k.b);
    const res = rmap[k.id];
    const t = res ? tally(res.sets) : null;
    const w = t && t.winner ? (t.winner === "a" ? a.team : b.team) : null;
    const l = t && t.winner ? (t.winner === "a" ? b.team : a.team) : null;
    out[k.id] = { ...k, ta: a.team, tb: b.team, la: a.label, lb: b.label, res, t, winner: w, loser: l };
  }
  return { st, ko: out };
}
