// Kosmo-Express: Welt, Figuren und Missionen (Prototyp: Kapitel 1).
export const SPEAKERS = {
  juna: { name: 'Juna', color: '#2aa198' },
  brum: { name: 'Kapitän Brum', color: '#c9a227' },
  bolzen: { name: 'Bolzen', color: '#4dd0e1' },
  zora: { name: 'Zora', color: '#c084fc' },
};

export const SEED = `
CREATE TABLE fracht (id INTEGER PRIMARY KEY, name TEXT NOT NULL, ziel TEXT NOT NULL, gewicht INTEGER NOT NULL);
INSERT INTO fracht VALUES
 (1,'Pizzaofen','Mars',120),(2,'Kaktus','Mond',15),(3,'Raumanzug','Venus',8),(4,'Eisblock','Mars',300),
 (5,'Gitarre','Mond',6),(6,'Tomaten','Venus',40),(7,'Ersatzteile','Mars',85),(8,'Teleskop','Venus',50);
`;

export const KAPITEL = { titel: 'Kapitel 1: Der erste Arbeitstag', ort: 'Raumfrachter Kosmo-Express' };

// Jede Zeile: { who, e (Emotion), t (Text) }
export const MISSIONS = [
  {
    id: 1, titel: 'Inventur', introBg: 'bruecke',
    intro: [
      { who: 'brum', e: 'determined', t: 'Willkommen an Bord des Kosmo-Express, Azubi! Der Start rückt näher, und ich habe keine Ahnung, was im Frachtraum steht.' },
      { who: 'juna', e: 'curious', t: 'Ich bin Juna! Aber wie finde ich das heraus? Soll ich alle Kisten von Hand zählen?' },
      { who: 'bolzen', e: 'happy', t: 'Piep! Das erledigt der Bordcomputer. Er führt die Tabelle „fracht“. Jede Kiste ist eine Zeile. Mit SELECT sagst du ihm, was du sehen willst, mit FROM, woher.' },
      { who: 'bolzen', e: 'curious', t: 'Und der Stern * heißt: alle Spalten. Probier es aus!' },
    ],
    aufgabe: 'Zeige <b>alle Kisten mit allen Spalten</b> aus der Tabelle <code>fracht</code>.',
    loesung: 'SELECT * FROM fracht;',
    hinweise: ['Du brauchst nur <code>SELECT</code> und <code>FROM</code>. Die Tabelle heißt <code>fracht</code>.', 'Der Stern <code>*</code> steht für „alle Spalten“.', '{{SELECT ___ FROM fracht;}}'],
    win: [
      { who: 'juna', e: 'proud', t: 'Acht Kisten, und alle sind da! Ich sehe sie sogar im Frachtraum leuchten.' },
      { who: 'brum', e: 'happy', t: 'Hmpf. Nicht schlecht für den ersten Tag. Aber das war erst die Inventur.' },
    ],
    lehre: 'SELECT * FROM tabelle; holt alle Zeilen und Spalten.',
  },
  {
    id: 2, titel: 'Zoras Auftrag',
    intro: [
      { who: 'zora', e: 'happy', t: 'Hallo, neue Frachtmeisterin! Ich bin Zora und habe eine Bestellung für den Mars. Zeig mir nur die Kisten, die dorthin sollen. Name und Gewicht reichen.' },
      { who: 'juna', e: 'curious', t: 'Nur die für den Mars? Dann muss ich aussortieren.' },
      { who: 'bolzen', e: 'happy', t: 'Dafür gibt es WHERE. Das ist ein Türsteher: Nur Zeilen, die die Bedingung erfüllen, kommen durch. Text steht in einfachen Anführungszeichen, zum Beispiel ziel = \'Mars\'.' },
    ],
    aufgabe: 'Zeige <code>name</code> und <code>gewicht</code> aller Kisten mit dem Ziel <code>Mars</code>.',
    loesung: "SELECT name, gewicht FROM fracht WHERE ziel = 'Mars';",
    hinweise: ['Nach <code>FROM fracht</code> kommt ein <code>WHERE</code> mit der Bedingung.', 'Die Bedingung vergleicht die Spalte <code>ziel</code> mit dem Text <code>\'Mars\'</code>.', "{{SELECT name, gewicht FROM fracht WHERE ziel = ___;}}"],
    win: [
      { who: 'zora', e: 'proud', t: 'Genau die drei Kisten, die ich brauche! Du bist ein Schatz.' },
      { who: 'juna', e: 'happy', t: 'Der Türsteher hat alle anderen weggeschickt. Das macht Spaß!' },
    ],
    lehre: 'WHERE filtert Zeilen nach einer Bedingung.',
  },
  {
    id: 3, titel: 'Schwerlast zuerst',
    intro: [
      { who: 'brum', e: 'angry', t: 'Die Schwerlastkräne laden immer die schwersten Kisten zuerst. Wer das vergisst, kippt mir das Schiff um!' },
      { who: 'juna', e: 'worried', t: 'Okay, okay! Ich brauche also eine Reihenfolge. Nach Gewicht, aber die schwerste zuerst.' },
      { who: 'bolzen', e: 'happy', t: 'ORDER BY sortiert. DESC heißt absteigend, vom größten zum kleinsten. Und mit LIMIT schneidest du nach ein paar Zeilen ab.' },
    ],
    aufgabe: 'Zeige <code>name</code> und <code>gewicht</code> der <b>3 schwersten</b> Kisten, die schwerste zuerst.',
    geordnet: true,
    loesung: 'SELECT name, gewicht FROM fracht ORDER BY gewicht DESC LIMIT 3;',
    hinweise: ['Erst sortieren, dann begrenzen.', '<code>ORDER BY gewicht DESC</code> sortiert absteigend, <code>LIMIT 3</code> behält drei Zeilen.', '{{SELECT name, gewicht FROM fracht ORDER BY ___ DESC LIMIT ___;}}'],
    win: [
      { who: 'brum', e: 'proud', t: 'Eisblock, Pizzaofen, Ersatzteile. Genau in der Reihenfolge lade ich sie. Gut gemacht!' },
      { who: 'juna', e: 'happy', t: 'Ich glaube, ich werde richtig gut darin.' },
    ],
    lehre: 'ORDER BY sortiert, DESC = absteigend, LIMIT begrenzt.',
  },
  {
    id: 4, titel: 'Das falsche Etikett',
    intro: [
      { who: 'zora', e: 'worried', t: 'Oh nein! Mein Kaktus hat das falsche Ziel. Er soll auf den Mars, steht aber für den Mond im System!' },
      { who: 'juna', e: 'determined', t: 'Das ändere ich! Aber ich muss vorsichtig sein, sonst bekommen alle Kisten dasselbe Ziel.' },
      { who: 'bolzen', e: 'worried', t: 'Genau! UPDATE ändert vorhandene Zeilen. Ohne WHERE trifft es ALLE. Immer eine Bedingung dazu, sonst Chaos im Frachtraum.' },
    ],
    aufgabe: 'Ändere das Ziel der Kiste <code>Kaktus</code> auf <code>Mars</code>. Nur diese eine Kiste darf sich ändern.',
    verify: 'SELECT id, name, ziel FROM fracht ORDER BY id',
    loesung: "UPDATE fracht SET ziel = 'Mars' WHERE name = 'Kaktus';",
    hinweise: ['Die Anweisung beginnt mit <code>UPDATE fracht SET ...</code>.', 'Mit <code>WHERE name = \'Kaktus\'</code> beschränkst du die Änderung auf eine Kiste.', "{{UPDATE fracht SET ziel = 'Mars' WHERE ___ = 'Kaktus';}}"],
    win: [
      { who: 'zora', e: 'happy', t: 'Mein Kaktus fliegt zum Mars! Danke, Juna!' },
      { who: 'brum', e: 'proud', t: 'Erster Arbeitstag, vier Aufträge, keine Katastrophe. Ich bin beeindruckt, Azubi.' },
      { who: 'bolzen', e: 'proud', t: 'Piep-piep! Kapitel 1 geschafft. Im nächsten Kapitel lernst du, Tabellen zu verbinden!' },
    ],
    lehre: 'UPDATE ... SET ... WHERE ändert vorhandene Zeilen.',
  },
].map((m) => ({ ...m, seed: SEED, erklaerung: '' }));
