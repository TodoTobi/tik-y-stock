#!/usr/bin/env node

/**
 * validate-docs.js — Validación cruzada de documentación
 *
 * Busca términos prohibidos (features eliminadas) en archivos donde no deberían aparecer.
 * Ignora líneas que documentan explícitamente la eliminación de algo.
 *
 * Uso: node scripts/validate-docs.js
 */

import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DOCS_DIR = join(__dirname, '..', 'docs');

// Términos prohibidos fuera de los archivos permitidos
const FORBIDDEN = [
  { term: '/admin/dashboard.html', desc: 'dashboard.html ya no existe en el PMV (redirige a movimientos)' },
  { term: 'dashboard/resumen', desc: 'Endpoint /api/dashboard/resumen eliminado del PMV' },
  { term: 'institucional.html', desc: 'Página institucional movida a BACKLOG_FUTURO' },
  { term: 'generar-etiquetas', desc: 'Script de etiquetas movido a BACKLOG_FUTURO' },
  { term: 'alertas/contador', desc: 'Endpoint contador eliminado (usar alertas.length)' },
];

// Archivos donde los términos SÍ están permitidos
const ALLOWED_FILES = [
  'BACKLOG_FUTURO.md',
  '00-indice.md',
  '00-acta-proyecto.md',
  '02-registro-hallazgos.md',
  '01-historial-auditorias.md',
  '03-runbook-pendiente.md',
];

// Palabras que indican que la línea documenta una eliminación (falso positivo permitido)
const EXEMPT_PATTERNS = [
  /eliminad[oa]/i,
  /excluid[oa]/i,
  /BACKLOG_FUTURO/,
  /no existe/i,
  /reemplazad[oa]/i,
  /se sirve con respaldo local/i,
];

function isExemptLine(line) {
  return EXEMPT_PATTERNS.some(pattern => pattern.test(line));
}

let exitCode = 0;

const files = readdirSync(DOCS_DIR).filter(f => f.endsWith('.md'));

for (const file of files) {
  if (ALLOWED_FILES.includes(file)) continue;

  const content = readFileSync(join(DOCS_DIR, file), 'utf-8');
  const lines = content.split('\n');

  for (const { term, desc } of FORBIDDEN) {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.toLowerCase().includes(term.toLowerCase()) && !isExemptLine(line)) {
        console.error(`[ERROR] ${file}:${i + 1} — ${desc}`);
        console.error(`        ${line.trim()}`);
        exitCode = 1;
      }
    }
  }
}

if (exitCode === 0) {
  console.log('[OK] Validación cruzada superada. No se encontraron referencias obsoletas.');
} else {
  console.error('\n[FAIL] Corregir las referencias antes de continuar.');
}

process.exit(exitCode);
