// Schlanke SQLite-Engine (sql.js) für das Spiel. Jede Spielwelt wird aus einem Seed-SQL erzeugt.
import initSqlJs from 'sql.js';
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url';

export const lastSet = (sets) => (sets.length ? sets[sets.length - 1] : null);

let SQL = null;
async function initSqlite() {
  if (!SQL) SQL = await initSqlJs({ locateFile: () => wasmUrl });
}

class SqliteSession {
  constructor(base) {
    this.kind = 'sqlite';
    this.base = base;
    this.db = new SQL.Database(this.base);
    this.db.run('PRAGMA foreign_keys = ON;');
  }
  async exec(sql) {
    // db.exec() liefert für Abfragen mit 0 Zeilen keine Tabelle. iterateStatements behält die Spalten.
    const sets = [];
    for (const st of this.db.iterateStatements(sql)) {
      const columns = st.getColumnNames();
      const values = [];
      while (st.step()) values.push(st.get());
      if (columns.length) sets.push({ columns, values });
    }
    return { sets, modified: this.db.getRowsModified() };
  }
  async schema() {
    const out = {};
    const t = this.db.exec("SELECT name FROM sqlite_master WHERE type IN ('table','view') AND name NOT LIKE 'sqlite_%'");
    if (!t.length) return out;
    for (const [name] of t[0].values) {
      const c = this.db.exec(`SELECT name FROM pragma_table_info('${name}')`);
      out[name] = c.length ? c[0].values.map((r) => r[0]) : [];
    }
    return out;
  }
  async reset() {
    try { this.db.close(); } catch {}
    this.db = new SQL.Database(this.base);
    this.db.run('PRAGMA foreign_keys = ON;');
  }
  async close() { try { this.db.close(); } catch {} }
}

const seedCache = {};
export async function seededSession(seed) {
  await initSqlite();
  if (!seedCache[seed]) {
    const d = new SQL.Database();
    d.exec(seed);
    seedCache[seed] = d.export();
    d.close();
  }
  return new SqliteSession(seedCache[seed]);
}

export async function initEngine() { await initSqlite(); }

// Führt fn(session) auf einer frischen Datenbank aus dem Seed aus (nichts bleibt zurück).
export async function isolated(kind, fn, sqlText = '', seed) {
  const s = await seededSession(seed);
  try { return await fn(s); } finally { await s.close(); }
}
