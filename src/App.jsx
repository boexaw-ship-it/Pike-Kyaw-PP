import React, { useMemo, useState } from "react";
import data from "./data.js";
import { GROUPS, KO, STAGES, groupMatches, resolveKO, resultMap } from "./logic.js";

const teamById = Object.fromEntries(data.teams.map((t) => [t.id, t]));
const name = (id, fallback) => (id ? teamById[id].name : fallback);
const TABS = [["home", "ရလဒ်"], ["groups", "အုပ်စု"], ["bracket", "Bracket"], ["teams", "အသင်းများ"]];

function Score({ t, a, b }) {
  if (!t) return <span className="vs">vs</span>;
  return (
    <span className="score">
      {t.pa}–{t.pb}
      {a != null && <small>{a}–{b}</small>}
    </span>
  );
}

function MatchRow({ ta, tb, la, lb, res, t, ko }) {
  const w = t?.winner;
  return (
    <li className="match">
      <span className={w === "a" ? "win" : ""}>{name(ta, la)}</span>
      {ko && t ? <span className="score">{t.a}–{t.b}<small>{res.sets.map((s) => s.join("-")).join(", ")}</small></span> : <Score t={t} />}
      <span className={"r " + (w === "b" ? "win" : "")}>{name(tb, lb)}</span>
    </li>
  );
}

function Home({ ko, rmap }) {
  const gm = groupMatches(data.teams);
  const played = data.results.slice().reverse();
  const next = gm.filter((m) => !rmap[m.id]).slice(0, 6);
  const label = (id) => {
    const k = ko[id];
    if (k) return { ...k, ko: true };
    const m = gm.find((x) => x.id === id);
    return { ta: m.a, tb: m.b, res: rmap[id], t: { ...tallyOf(rmap[id]) }, ko: false };
  };
  return (
    <>
      <h2>နောက်ဆုံးရလဒ်</h2>
      {played.length === 0 && <p className="empty">ပွဲရလဒ် မရှိသေးပါ။ ပွဲပြီးတာနဲ့ ဒီမှာ ပေါ်မယ်။</p>}
      <ul className="list">{played.map((r) => <MatchRow key={r.id} {...label(r.id)} />)}</ul>
      {next.length > 0 && (
        <>
          <h2>ကစားရန်ကျန်သော ပွဲများ</h2>
          <ul className="list">{next.map((m) => <MatchRow key={m.id} ta={m.a} tb={m.b} />)}</ul>
        </>
      )}
    </>
  );
}
import { tally } from "./logic.js";
const tallyOf = (r) => tally(r?.sets);

function Groups({ st }) {
  return GROUPS.map((g) => (
    <section key={g} className="card">
      <h3>အုပ်စု {g} {st[g].complete && <em>ပြီးပြီ</em>}</h3>
      <table>
        <thead><tr><th></th><th>အသင်း</th><th>ကစား</th><th>နိုင်</th><th>ရှုံး</th><th>ရမှတ်</th><th>အမှတ်</th></tr></thead>
        <tbody>
          {st[g].rows.map((r, i) => (
            <tr key={r.id} className={i < 2 ? "adv" : ""}>
              <td>{i + 1}</td><td className="tn">{name(r.id)}</td><td>{r.p}</td><td>{r.w}</td><td>{r.l}</td>
              <td>{r.sc}</td><td><b>{r.pts}</b></td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  ));
}

function Bracket({ ko }) {
  const col = (stage) => KO.filter((k) => k.stage === stage).map((k) => ko[k.id]);
  const cols = [["R16"], ["QF"], ["SF"], ["F", "TP"]];
  return (
    <div className="bracket">
      {cols.map((stages) => (
        <div className="bcol" key={stages.join()}>
          {stages.map((s) => (
            <div key={s}>
              <h3>{STAGES[s]}</h3>
              {col(s).map((m) => (
                <div className="bm" key={m.id}>
                  <small>ပွဲစဉ် {m.no}</small>
                  <div className={m.t?.winner === "a" ? "win" : ""}><span>{name(m.ta, m.la)}</span><b>{m.t?.a ?? ""}</b></div>
                  <div className={m.t?.winner === "b" ? "win" : ""}><span>{name(m.tb, m.lb)}</span><b>{m.t?.b ?? ""}</b></div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function Teams() {
  const [g, setG] = useState("A");
  return (
    <>
      <div className="chips">{GROUPS.map((x) => <button key={x} className={x === g ? "on" : ""} onClick={() => setG(x)}>{x}</button>)}</div>
      {data.teams.filter((t) => t.group === g).map((t) => (
        <section className="card" key={t.id}>
          <h3>{t.name}</h3>
          <div className="players">
            {t.players.map((p, i) => (
              <figure key={i}>
                {p.photo ? <img src={p.photo} alt={p.name} loading="lazy" /> : <div className="ph">{p.name.slice(0, 1)}</div>}
                <figcaption>{p.name}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}

export default function App() {
  const [tab, setTab] = useState("home");
  const rmap = useMemo(() => resultMap(data.results), []);
  const { st, ko } = useMemo(() => resolveKO(data.teams, rmap), [rmap]);
  const share = () => {
    const d = { title: data.tournament.name, url: location.href };
    navigator.share ? navigator.share(d).catch(() => {}) : navigator.clipboard?.writeText(d.url);
  };
  return (
    <div className="app">
      <header>
        <div><h1>{data.tournament.name}</h1><p>{data.tournament.subtitle} · {data.tournament.date}</p></div>
        <button className="share" onClick={share}>Share</button>
      </header>
      <main>
        {tab === "home" && <Home ko={ko} rmap={rmap} />}
        {tab === "groups" && <Groups st={st} />}
        {tab === "bracket" && <Bracket ko={ko} />}
        {tab === "teams" && <Teams />}
      </main>
      <nav>{TABS.map(([k, l]) => <button key={k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}>{l}</button>)}</nav>
    </div>
  );
}
