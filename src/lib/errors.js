// Fehleranalyse: übersetzt SQLite-Meldungen in verständliche Hilfen.
const KEYWORDS = ['SELECT', 'FROM', 'WHERE', 'GROUP', 'ORDER', 'BY', 'HAVING', 'LIMIT', 'OFFSET', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'FULL', 'OUTER', 'CROSS', 'ON', 'AS', 'AND', 'OR', 'NOT', 'IN', 'LIKE', 'BETWEEN', 'IS', 'NULL', 'DISTINCT', 'UNION', 'INTERSECT', 'EXCEPT', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE', 'TABLE', 'ALTER', 'DROP', 'INDEX', 'VIEW', 'TRIGGER', 'WITH', 'RECURSIVE', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'EXISTS', 'OVER', 'PARTITION', 'BEGIN', 'COMMIT', 'ROLLBACK', 'DESC', 'ASC', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX'];

function lev(a, b) {
  a = a.toLowerCase(); b = b.toLowerCase();
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}
function closest(word, list, max) {
  let best = null, bd = 99;
  for (const w of list) { const d = lev(word, w); if (d < bd) { bd = d; best = w; } }
  return bd <= (max ?? Math.max(2, Math.floor(word.length / 3))) ? best : null;
}
export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function normalizeMsg(msg) {
  return msg
    .replace(/column "(?:(\w+)\.)?(\w+)" does not exist/, (m, a, c) => `no such column: ${a ? a + '.' : ''}${c}`)
    .replace(/relation "(\w+)" does not exist/, 'no such table: $1')
    .replace(/column reference "(\w+)" is ambiguous/, 'ambiguous column name: $1')
    .replace(/aggregate functions are not allowed in WHERE/, 'misuse of aggregate')
    .replace(/function (\w+)\(.*?\) does not exist/, 'no such function: $1')
    .replace(/duplicate key value violates unique constraint.*/, 'UNIQUE constraint failed: (siehe Fehlermeldung)')
    .replace(/null value in column "(\w+)".*violates not-null constraint/, 'NOT NULL constraint failed: $1')
    .replace(/violates foreign key constraint.*/, 'FOREIGN KEY constraint failed')
    .replace(/syntax error at or near "([^"]*)"/, 'near "$1": syntax error')
    .replace(/syntax error at end of input/, 'incomplete input')
    .replace(/relation "(\w+)" already exists/, 'table $1 already exists');
}

// schema: { tabelle: [spalten] }. Gibt eine Liste von { titel, text } zurück.
export function analyzeError(rawMsg, sql, schema) {
  const out = [];
  const msg = normalizeMsg(rawMsg);
  const allCols = [...new Set(Object.values(schema).flat())];
  const tables = Object.keys(schema);
  let m;

  if ((m = msg.match(/no such column: (?:(\w+)\.)?(\w+)/))) {
    const [, alias, col] = m;
    const guess = closest(col, allCols);
    let text = `Die Spalte <code>${esc(col)}</code> gibt es nicht${alias ? ` (in <code>${esc(alias)}</code>)` : ''}.`;
    if (guess) text += ` Meintest du <code>${esc(guess)}</code>?`;
    const owner = guess && tables.filter((t) => schema[t].includes(guess) && new RegExp('\\b' + t + '\\b', 'i').test(sql));
    if (owner && owner.length) text += ` Diese Spalte steckt in: ${owner.map((t) => '<code>' + t + '</code>').join(', ')}.`;
    text += ' Tipp: Prüfe im Schema-Fenster die genauen Spaltennamen. Texte gehören in einfache Anführungszeichen (<code>\'Berlin\'</code>), nicht in doppelte.';
    out.push({ titel: 'Unbekannte Spalte', text });
  } else if ((m = msg.match(/no such table: (?:\w+\.)?(\w+)/))) {
    const guess = closest(m[1], tables);
    out.push({ titel: 'Unbekannte Tabelle', text: `Die Tabelle <code>${esc(m[1])}</code> existiert nicht.${guess ? ` Meintest du <code>${esc(guess)}</code>?` : ''} Vorhanden sind: ${tables.map((t) => '<code>' + t + '</code>').join(', ')}.` });
  } else if ((m = msg.match(/ambiguous column name: (\w+)/))) {
    out.push({ titel: 'Mehrdeutige Spalte', text: `<code>${esc(m[1])}</code> kommt in mehreren Tabellen der Abfrage vor. Stelle den Tabellennamen oder Alias davor, z. B. <code>k.${esc(m[1])}</code>.` });
  } else if (/misuse of aggregate/.test(msg)) {
    out.push({ titel: 'Aggregat am falschen Ort', text: 'Aggregatfunktionen wie <code>COUNT</code>, <code>SUM</code> oder <code>AVG</code> dürfen nicht in <code>WHERE</code> stehen. <code>WHERE</code> filtert einzelne Zeilen vor dem Gruppieren. Nutze <code>HAVING</code>, um Gruppen zu filtern.' });
  } else if (/must appear in the GROUP BY clause/.test(rawMsg)) {
    const c = (rawMsg.match(/column "([^"]+)"/) || [, '?'])[1];
    out.push({ titel: 'Spalte fehlt in GROUP BY', text: `<code>${esc(c)}</code> steht im <code>SELECT</code>, ist aber weder aggregiert noch in <code>GROUP BY</code>. Entweder nimm die Spalte in <code>GROUP BY</code> auf, oder verwende eine Aggregatfunktion wie <code>MAX(${esc(c)})</code>.` });
  } else if (/no such function: (\w+)/.test(msg)) {
    const fn = msg.match(/no such function: (\w+)/)[1];
    out.push({ titel: 'Unbekannte Funktion', text: `<code>${esc(fn)}()</code> kennt SQLite nicht. Prüfe die Schreibweise. Manche Funktionen heißen in anderen Dialekten anders (z. B. <code>DATEDIFF</code> gibt es nicht, nutze <code>JULIANDAY(a) - JULIANDAY(b)</code>).` });
  } else if (/UNIQUE constraint failed: (.+)/.test(msg)) {
    out.push({ titel: 'Eindeutigkeit verletzt', text: `Der Wert in <code>${esc(msg.match(/failed: (.+)/)[1])}</code> existiert schon, die Spalte muss aber eindeutig sein. Wähle einen anderen Wert oder nutze <code>ON CONFLICT ... DO UPDATE</code> (Upsert).` });
  } else if (/NOT NULL constraint failed: (.+)/.test(msg)) {
    out.push({ titel: 'Pflichtfeld leer', text: `Die Spalte <code>${esc(msg.match(/failed: (.+)/)[1])}</code> darf nicht <code>NULL</code> sein. Gib beim <code>INSERT</code> einen Wert an.` });
  } else if (/FOREIGN KEY constraint failed/.test(msg)) {
    out.push({ titel: 'Fremdschlüssel verletzt', text: 'Du verweist auf einen Datensatz, der nicht existiert (beim <code>INSERT</code>/<code>UPDATE</code>), oder löschst einen Datensatz, auf den noch andere Zeilen zeigen (beim <code>DELETE</code>). Lege erst den referenzierten Datensatz an bzw. lösche zuerst die abhängigen Zeilen.' });
  } else if (/CHECK constraint failed/.test(msg)) {
    out.push({ titel: 'CHECK-Regel verletzt', text: 'Der Wert verstößt gegen eine <code>CHECK</code>-Bedingung der Tabelle (z. B. negativer Preis).' });
  } else if (/already exists/.test(msg)) {
    out.push({ titel: 'Existiert schon', text: 'Das Objekt gibt es bereits. Mit <code>IF NOT EXISTS</code> überspringst du das Anlegen, mit <code>DROP ... IF EXISTS</code> räumst du vorher auf. Oder setze die Datenbank zurück.' });
  } else if (/do not have the same number of result columns/.test(msg)) {
    out.push({ titel: 'Spaltenzahl passt nicht', text: 'Bei <code>UNION</code>, <code>INTERSECT</code> und <code>EXCEPT</code> müssen beide <code>SELECT</code>s gleich viele Spalten (mit passenden Typen) liefern.' });
  } else if (/incomplete input/.test(msg)) {
    out.push({ titel: 'Unvollständige Eingabe', text: 'Die Anweisung bricht mitten drin ab. Meist fehlt eine schließende Klammer, ein Anführungszeichen oder der Rest der Abfrage.' });
  } else if ((m = msg.match(/near "([^"]*)": syntax error/)) || /syntax error/.test(msg)) {
    const tok = m ? m[1] : '';
    out.push({ titel: 'Syntaxfehler', text: `SQLite stolpert bei <code>${esc(tok || '?')}</code> (oder direkt davor). Die Ursache liegt meist an dieser Stelle oder kurz davor.` });
    const before = tok ? sql.slice(0, sql.toUpperCase().indexOf(tok.toUpperCase())).trimEnd() : '';
    if (tok && /^(FROM|WHERE|GROUP|ORDER|LIMIT|HAVING)$/i.test(tok) && before.endsWith(','))
      out.push({ titel: 'Überflüssiges Komma', text: `Vor <code>${esc(tok.toUpperCase())}</code> steht ein Komma zu viel. Nach dem letzten Element einer Liste kommt kein Komma.` });
  } else {
    out.push({ titel: 'Fehler', text: 'Lies die Originalmeldung oben genau. Sie nennt meist die Stelle, an der es hakt.' });
  }

  // Allgemeine Syntax-Heuristiken
  if (/syntax error|incomplete input|unrecognized token/.test(msg)) {
    if ((sql.match(/'/g) || []).length % 2) out.push({ titel: 'Anführungszeichen offen', text: 'Du hast eine ungerade Anzahl von <code>\'</code>. Ein Textwert ist nicht geschlossen. Ein Apostroph im Text wird verdoppelt: <code>\'O\'\'Brien\'</code>.' });
    const open = (sql.match(/\(/g) || []).length, close = (sql.match(/\)/g) || []).length;
    if (open !== close) out.push({ titel: 'Klammern prüfen', text: `Es gibt ${open} öffnende und ${close} schließende Klammern.` });
    const words = [...new Set(sql.replace(/'[^']*'/g, ' ').match(/[A-Za-zÄÖÜäöü_]+/g) || [])];
    for (const w of words) {
      if (KEYWORDS.includes(w.toUpperCase()) || allCols.includes(w) || tables.includes(w) || w.length < 4) continue;
      const k = closest(w, KEYWORDS, 2);
      if (k && !/^[a-z]$/.test(w)) { out.push({ titel: 'Tippfehler?', text: `<code>${esc(w)}</code> sieht aus wie das Schlüsselwort <code>${k}</code>.` }); break; }
    }
    if (/\bSELECT\s+[\w.*]+\s+[\w.]+\s+FROM/i.test(sql) && !/\bAS\b/i.test(sql.split(/FROM/i)[0]))
      out.push({ titel: 'Komma vergessen?', text: 'Zwischen zwei Spalten in der <code>SELECT</code>-Liste muss ein Komma stehen.' });
  }
  return out;
}

// Hinweise bei Abfragen, die zwar laufen, aber verdächtig sind.
export function analyzeWarnings(sql, result) {
  const w = [];
  if (/(=|<>|!=)\s*NULL\b/i.test(sql))
    w.push({ titel: 'Vergleich mit NULL', text: '<code>= NULL</code> ist nie wahr. NULL bedeutet „unbekannt“. Nutze <code>IS NULL</code> bzw. <code>IS NOT NULL</code>.' });
  if (/\bWHERE\b[^;]*"[^"]+"/i.test(sql))
    w.push({ titel: 'Doppelte Anführungszeichen', text: 'Textwerte stehen in einfachen Anführungszeichen (<code>\'Berlin\'</code>). Doppelte bezeichnen Spalten- oder Tabellennamen.' });
  if (/\bFROM\s+\w+\s*,\s*\w+/i.test(sql) && !/\bWHERE\b/i.test(sql) && !/\bJOIN\b/i.test(sql))
    w.push({ titel: 'Kreuzprodukt', text: 'Zwei Tabellen ohne Bedingung ergeben jede Kombination aller Zeilen. Nutze <code>JOIN ... ON</code>.' });
  if (result && result.values && result.values.length === 0)
    w.push({ titel: 'Leeres Ergebnis', text: 'Die Abfrage ist gültig, liefert aber keine Zeilen. Prüfe die <code>WHERE</code>-Bedingung, Schreibweise der Werte (Groß-/Kleinschreibung) und die <code>JOIN</code>-Bedingung.' });
  return w;
}
