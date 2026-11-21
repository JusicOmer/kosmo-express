// Startet Vite und überlebt sporadische Windows-Dateisperren (EBUSY) im Dateiwächter.
import { createServer } from 'vite';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

process.on('uncaughtException', (e) => {
  if (e && (e.code === 'EBUSY' || e.code === 'EPERM')) return;
  console.error(e);
  process.exit(1);
});

const root = dirname(fileURLToPath(import.meta.url));
const server = await createServer({ root, server: { port: 5174 } });
await server.listen();
server.printUrls();
