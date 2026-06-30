import { before, after } from 'node:test';
import mysql from 'mysql2/promise';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEST_DB = 'tic_stock_test';

process.env.DB_NAME = TEST_DB;

let setupConn;

before(async () => {
  setupConn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    charset: 'utf8mb4',
  });
  await setupConn.query(`DROP DATABASE IF EXISTS \`${TEST_DB}\``);
  await setupConn.query(`CREATE DATABASE \`${TEST_DB}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await setupConn.query(`USE \`${TEST_DB}\``);
  const schema = readFileSync(join(__dirname, '..', 'database', 'schema.sql'), 'utf8')
    .replace(/CREATE DATABASE.*?;/is, '')
    .replace(/USE .*?;/i, '');
  const statements = schema.split(';').filter(s => s.trim().length > 0);
  for (const stmt of statements) {
    await setupConn.query(stmt);
  }
});

after(async () => {
  if (setupConn) {
    await setupConn.query(`DROP DATABASE IF EXISTS \`${TEST_DB}\``);
    await setupConn.end();
  }
  const { default: pool } = await import('../config/db.js');
  await pool.end();
});
