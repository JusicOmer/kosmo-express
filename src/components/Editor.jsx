import React, { useMemo, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { sql, SQLite, PostgreSQL } from '@codemirror/lang-sql';
import { keymap, EditorView } from '@codemirror/view';
import { Prec } from '@codemirror/state';

export default function Editor({ value, onChange, onRun, schema, dark, kind }) {
  const run = useRef(onRun);
  run.current = onRun;
  const ext = useMemo(
    () => [
      sql({ dialect: kind === 'pg' ? PostgreSQL : SQLite, schema, upperCaseKeywords: true }),
      EditorView.lineWrapping,
      Prec.highest(keymap.of([{ key: 'Mod-Enter', run: () => { run.current(); return true; } }])),
    ],
    [schema, kind]
  );
  return (
    <div className="editor-wrap">
      <CodeMirror
        value={value}
        minHeight="150px"
        maxHeight="320px"
        theme={dark ? 'dark' : 'light'}
        extensions={ext}
        onChange={onChange}
        placeholder="Schreibe hier dein SQL …"
        basicSetup={{ lineNumbers: true, foldGutter: false, highlightActiveLine: false, highlightActiveLineGutter: false }}
      />
    </div>
  );
}
