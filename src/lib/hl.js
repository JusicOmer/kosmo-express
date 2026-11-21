import { esc } from './errors.js';

const KW = new Set(('SELECT FROM WHERE GROUP BY ORDER HAVING LIMIT OFFSET JOIN INNER LEFT RIGHT FULL OUTER CROSS ON AS AND OR NOT IN LIKE BETWEEN IS NULL DISTINCT UNION ALL INTERSECT EXCEPT INSERT INTO VALUES UPDATE SET DELETE CREATE TABLE ALTER ADD COLUMN DROP INDEX VIEW TRIGGER WITH RECURSIVE CASE WHEN THEN ELSE END EXISTS OVER PARTITION ROWS RANGE PRECEDING FOLLOWING CURRENT ROW UNBOUNDED BEGIN COMMIT ROLLBACK TRANSACTION DESC ASC PRIMARY KEY REFERENCES UNIQUE DEFAULT CHECK CONSTRAINT CONFLICT DO NOTHING IF AFTER BEFORE EACH FOR EXPLAIN QUERY PLAN INTEGER TEXT REAL USING NATURAL TO RENAME ILIKE LATERAL FUNCTION RETURNS LANGUAGE MATERIALIZED ROLLUP GROUPING SETS FILTER WINDOW RETURNING TEMP TEMPORARY DISTINCT ON DOUBLE PRECISION IDENTITY GENERATED ALWAYS').split(' '));

export function hl(code) {
  return esc(code).replace(/('(?:[^']|'')*')|(--[^\n]*)|\b(\d+(?:\.\d+)?)\b|\b([A-Za-z_]+)\b/g, (m, s, c, n, w) => {
    if (s) return '<span class="t-s">' + s + '</span>';
    if (c) return '<span class="t-c">' + c + '</span>';
    if (n) return '<span class="t-n">' + n + '</span>';
    if (w && KW.has(w.toUpperCase())) return '<span class="t-k">' + w + '</span>';
    return m;
  });
}

// {{ code }} -> hervorgehobener Codeblock
export const fmt = (s) => (s || '').replace(/\{\{([\s\S]*?)\}\}/g, (m, c) => '<pre class="code">' + hl(c.trim()) + '</pre>');
