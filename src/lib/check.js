import { esc } from './errors.js';
import { isolated, lastSet } from './engine.js';

export function normVal(v) {
  if (v === null || v === undefined) return '∅';
  if (typeof v === 'number') return String(Math.round(v * 10000) / 10000);
  if (typeof v === 'string' && /^-?\d+\.\d+$/.test(v)) return String(Math.round(parseFloat(v) * 10000) / 10000);
  return String(v);
}

export async function runForCheck(s, sql, task) {
  const r = await s.exec(sql);
  if (task.verify) {
    if (task.testSql) await s.exec(task.testSql);
    return lastSet((await s.exec(task.verify)).sets);
  }
  return lastSet(r.sets);
}

export function compare(user, sol, task) {
  const msgs = [];
  if (!user) return { ok: false, msgs: ['Deine Anweisung liefert keine Ergebnistabelle. Es fehlt wohl ein <code>SELECT</code>.'] };
  if (user.columns.length !== sol.columns.length) {
    return { ok: false, msgs: [`Du lieferst ${user.columns.length} Spalte(n), erwartet sind ${sol.columns.length}.`] };
  }
  const ru = user.values.map((r) => JSON.stringify(r.map(normVal)));
  const rs = sol.values.map((r) => JSON.stringify(r.map(normVal)));
  if (ru.length !== rs.length) msgs.push(`Dein Ergebnis hat ${ru.length} Zeile(n), erwartet sind ${rs.length}.`);
  const cnt = (a) => a.reduce((m, x) => ((m[x] = (m[x] || 0) + 1), m), {});
  const cu = cnt(ru), cs = cnt(rs);
  const missing = Object.keys(cs).filter((k) => (cu[k] || 0) < cs[k]);
  const extra = Object.keys(cu).filter((k) => (cs[k] || 0) < cu[k]);
  const show = (k) => '<code>' + esc(JSON.parse(k).join(' | ')) + '</code>';
  if (missing.length) msgs.push(`Es fehlt z. B. die Zeile ${show(missing[0])}.`);
  if (extra.length) msgs.push(`Zu viel ist z. B. die Zeile ${show(extra[0])}.`);
  if (!msgs.length) {
    if (task.geordnet && JSON.stringify(ru) !== JSON.stringify(rs))
      return { ok: false, msgs: ['Die Zeilen stimmen, aber die <b>Reihenfolge</b> nicht. Prüfe <code>ORDER BY</code> (und <code>ASC</code>/<code>DESC</code>).'] };
    const names = user.columns.join() !== sol.columns.join();
    return { ok: true, msgs: names ? [`Hinweis: In der Musterlösung heißen die Spalten <code>${esc(sol.columns.join(', '))}</code>. Für das Ergebnis ist das egal.`] : [] };
  }
  if (missing.length && !extra.length && ru.length < rs.length) msgs.push('Dein Filter ist wahrscheinlich zu streng, oder ein <code>JOIN</code> verliert Zeilen (probiere <code>LEFT JOIN</code>).');
  if (extra.length && !missing.length) msgs.push('Dein Filter ist wahrscheinlich zu locker, oder ein <code>JOIN</code> vervielfacht Zeilen.');
  if (missing.length && extra.length && ru.length === rs.length) msgs.push('Die Anzahl stimmt, aber die Werte nicht. Prüfe Spaltenwahl, Berechnung und Bedingung.');
  return { ok: false, msgs };
}

// Vollständige Prüfung auf frischen Datenbanken.
export async function checkSolution(task, sql) {
  const kind = task.engine || 'sqlite';
  let sol;
  try { sol = await isolated(kind, (s) => runForCheck(s, task.loesung, task), task.loesung, task.seed); }
  catch (e) { return { internal: String(e.message || e) }; }
  try {
    const user = await isolated(kind, (s) => runForCheck(s, sql, task), sql, task.seed);
    return { user, cmp: compare(user, sol, task) };
  } catch (e) {
    return { error: String(e.message || e) };
  }
}
