// Safe deployment gate for SQLite lineage migrations.
// Always invoke migrations through `npm run db:deploy`.

import Database from 'better-sqlite3';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { isAbsolute, resolve } from 'node:path';

const MIGRATION_NAME = '20260620130000_add_audit_lineage';
const EXPIRY_MIGRATION_NAME = '20260620170000_add_claim_expiry_reaper';
const REQUIRED_COLUMNS = ['score', 'verdict', 'previousAuditId', 'monitoredSiteId'];

function configuredDatabaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  const envPath = resolve(process.cwd(), '.env');
  if (!existsSync(envPath)) return undefined;
  const match = readFileSync(envPath, 'utf8').match(/^DATABASE_URL\s*=\s*(.+)$/m);
  return match?.[1].trim().replace(/^(['"])(.*)\1$/, '$2');
}

export function resolveSqlitePath(databaseUrl = configuredDatabaseUrl()) {
  if (!databaseUrl?.startsWith('file:')) throw new Error('DATABASE_URL must be a SQLite file: URL');
  const pathWithoutQuery = databaseUrl.slice('file:'.length).split('?')[0];
  const decodedPath = decodeURIComponent(pathWithoutQuery);
  if (!decodedPath) throw new Error('DATABASE_URL does not contain a database path');
  return isAbsolute(decodedPath) ? decodedPath : resolve(process.cwd(), 'prisma', decodedPath);
}

function tableExists(db, table) {
  return Boolean(db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?").get(table));
}

function requireDbPushSchema(db) {
  const columns = db.pragma('table_info(Audit)');
  const byName = new Map(columns.map((column) => [column.name, column]));
  const missing = REQUIRED_COLUMNS.filter((column) => !byName.has(column));
  if (missing.length) throw new Error(`Unsafe partial lineage schema: missing columns ${missing.join(', ')}`);

  const scoreType = byName.get('score')?.type.toUpperCase();
  const verdictType = byName.get('verdict')?.type.toUpperCase();
  if (!['INT', 'INTEGER'].includes(scoreType || '')) {
    throw new Error(`Unsafe lineage schema: score must be INTEGER, found ${scoreType || 'no type'}`);
  }
  if (verdictType !== 'TEXT') throw new Error(`Unsafe lineage schema: verdict must be TEXT, found ${verdictType || 'no type'}`);

  for (const table of ['MonitoredSite', 'RescanLock']) {
    if (!tableExists(db, table)) throw new Error(`Unsafe partial lineage schema: missing table ${table}`);
  }

  const foreignKeys = db.pragma('foreign_key_list(Audit)');
  const hasSiteFk = foreignKeys.some((fk) =>
    fk.from === 'monitoredSiteId' && fk.table === 'MonitoredSite' && fk.to === 'id' && fk.on_delete.toUpperCase() === 'SET NULL'
  );
  const hasPreviousFk = foreignKeys.some((fk) =>
    fk.from === 'previousAuditId' && fk.table === 'Audit' && fk.to === 'id' && fk.on_delete.toUpperCase() === 'SET NULL'
  );
  if (!hasSiteFk || !hasPreviousFk) throw new Error('Unsafe partial lineage schema: required Audit foreign keys are missing');

  const indexes = db.pragma('index_list(Audit)');
  if (!indexes.some((index) => index.name === 'Audit_previousAuditId_key' && index.unique === 1)) {
    throw new Error('Unsafe partial lineage schema: unique previousAuditId index is missing');
  }

  const violations = db.pragma('foreign_key_check');
  if (violations.length) throw new Error(`Foreign-key check failed with ${violations.length} violation(s)`);
}

function expirySchemaState(db) {
  const names = new Set(db.pragma('table_info(Audit)').map((column) => column.name));
  const hasStaleClaims = names.has('staleClaims');
  const hasStaleAt = names.has('staleAt');
  const hasNotification = tableExists(db, 'ExpiryNotification');
  const hasJob = tableExists(db, 'ExpiryRescanJob');
  const present = [hasStaleClaims, hasStaleAt, hasNotification, hasJob].filter(Boolean).length;
  if (present === 0) return 'pending';
  if (present !== 4) throw new Error(`Unsafe partial expiry schema: found ${present}/4 required elements`);

  const notificationFks = db.pragma('foreign_key_list(ExpiryNotification)');
  const jobFks = db.pragma('foreign_key_list(ExpiryRescanJob)');
  if (!notificationFks.some((fk) => fk.from === 'auditId' && fk.table === 'Audit' && fk.to === 'id')) {
    throw new Error('Unsafe partial expiry schema: ExpiryNotification audit foreign key is missing');
  }
  if (!jobFks.some((fk) => fk.from === 'auditId' && fk.table === 'Audit' && fk.to === 'id')) {
    throw new Error('Unsafe partial expiry schema: ExpiryRescanJob audit foreign key is missing');
  }
  return 'db-push';
}

function resolveAppliedMigration(name) {
  try {
    execFileSync('npx', ['prisma', 'migrate', 'resolve', '--applied', name], {
      env: process.env,
      stdio: 'pipe',
      timeout: 30_000,
    });
    console.log(`Marked ${name} as applied; existing data was preserved.`);
  } catch (error) {
    const output = `${error.stdout?.toString() || ''}\n${error.stderr?.toString() || ''}`;
    if (output.includes('P3008') || output.includes('already recorded as applied')) {
      console.log(`${name} is already recorded as applied.`);
      return;
    }
    throw new Error(`Failed to resolve migration ${name}: ${output.trim() || error.message}`);
  }
}

export function detectUpgradePath(databasePath) {
  const db = new Database(databasePath, { fileMustExist: true });
  try {
    db.pragma('foreign_keys = ON');
    if (!tableExists(db, 'Audit')) return 'pre-lineage';
    const names = new Set(db.pragma('table_info(Audit)').map((column) => column.name));
    const count = REQUIRED_COLUMNS.filter((column) => names.has(column)).length;
    if (count === 0) return 'pre-lineage';
    if (count !== REQUIRED_COLUMNS.length) {
      throw new Error(`Unsafe partial lineage schema: found ${count}/${REQUIRED_COLUMNS.length} lineage columns`);
    }
    requireDbPushSchema(db);
    return 'db-push';
  } finally {
    db.close();
  }
}

function main() {
  const databasePath = resolveSqlitePath();
  const path = detectUpgradePath(databasePath);
  console.log(`Lineage migration gate: ${path} (${databasePath})`);
  if (path === 'pre-lineage') {
    console.log('Pre-lineage schema verified. The SQL migration must run normally.');
    return;
  }

  const db = new Database(databasePath, { fileMustExist: true });
  let expiryState;
  try {
    expiryState = expirySchemaState(db);
  } finally {
    db.close();
  }
  if (process.env.PRE_MIGRATE_DRY_RUN === '1') {
    console.log(`Fully pushed lineage schema verified; expiry schema is ${expiryState}. Dry run: migration resolve skipped.`);
    return;
  }
  resolveAppliedMigration(MIGRATION_NAME);
  if (expiryState === 'db-push') resolveAppliedMigration(EXPIRY_MIGRATION_NAME);
}

main();
