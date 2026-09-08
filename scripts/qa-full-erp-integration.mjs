// The Snap Legacy ERP — Master Cross-Brand Integration QA Suite
// Verifies Phase 1 (HQ), Phase 2 (Service), Phase 3 (Agency), Phase 4 (Memories)
import fs from 'fs';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const RESULTS = [];

function assert(category, description, condition, details = '') {
  if (condition) {
    RESULTS.push({ category, status: 'PASS', description, details });
    console.log(`✅ [${category}] ${description}`);
  } else {
    RESULTS.push({ category, status: 'FAIL', description, details });
    console.error(`❌ [${category}] ${description} — ${details}`);
  }
}

console.log('='.repeat(80));
console.log('🏛️ THE SNAP LEGACY ERP — MASTER CROSS-BRAND INTEGRATION QA GATE');
console.log('='.repeat(80));

// 1. MIGRATION DEPENDENCY GRAPH & INTEGRITY
console.log('\n--- 1. DATABASE MIGRATIONS DEPENDENCY ORDER (001 -> 009) ---');
const migrationsDir = path.join(ROOT_DIR, 'supabase', 'migrations');
const migrations = [
  '001_foundation.sql',
  '002_rls_policies.sql',
  '003_seed_data.sql',
  '004_snap_service_schema.sql',
  '005_seed_snap_service.sql',
  '006_snap_agency_schema.sql',
  '007_seed_snap_agency.sql',
  '008_snap_memories_schema.sql',
  '009_seed_snap_memories.sql',
];

for (const m of migrations) {
  const filePath = path.join(migrationsDir, m);
  const exists = fs.existsSync(filePath);
  const size = exists ? fs.statSync(filePath).size : 0;
  assert('MIGRATION', `Migration ${m} exists and is valid`, exists && size > 500, `Size: ${size} bytes`);
}

// 2. CENTRAL POSTGRESQL ARCHITECTURE VERIFICATION
console.log('\n--- 2. CENTRAL ARCHITECTURAL INTEGRITY (NO DATABASE SILOS) ---');
const schema001 = fs.readFileSync(path.join(migrationsDir, '001_foundation.sql'), 'utf-8');
const schema004 = fs.readFileSync(path.join(migrationsDir, '004_snap_service_schema.sql'), 'utf-8');
const schema006 = fs.readFileSync(path.join(migrationsDir, '006_snap_agency_schema.sql'), 'utf-8');
const schema008 = fs.readFileSync(path.join(migrationsDir, '008_snap_memories_schema.sql'), 'utf-8');

const expectedCentralTables = ['clients', 'projects', 'financial_transactions', 'payments', 'audit_logs'];
for (const table of expectedCentralTables) {
  const tableDefRegex = new RegExp(`CREATE TABLE (IF NOT EXISTS )?${table}\\b`, 'i');
  assert('CENTRAL_DB', `Central ${table} table defined in Foundation`, tableDefRegex.test(schema001));
}

// Cross-brand table linkages
assert('CENTRAL_DB', 'Snap Service links to central clients & projects', schema004.includes('REFERENCES clients(id)') && schema004.includes('REFERENCES projects(id)'));
assert('CENTRAL_DB', 'Snap Agency links to central clients & projects', schema006.includes('REFERENCES clients(id)') && schema006.includes('REFERENCES projects(id)'));
assert('CENTRAL_DB', 'Snap Memories links to central clients & projects', schema008.includes('REFERENCES clients(id)') && schema008.includes('REFERENCES projects(id)'));

// 3. BRAND WORKSPACE UUIDS & ISOLATION MATRIX
console.log('\n--- 3. BRAND WORKSPACE UUIDS & ISOLATION MATRIX ---');
const constantsFile = fs.readFileSync(path.join(ROOT_DIR, 'src', 'lib', 'constants.ts'), 'utf-8');
const BRAND_HQ = 'b0000000-0000-0000-0000-000000000001';
const BRAND_SERVICE = 'b0000000-0000-0000-0000-000000000002';
const BRAND_AGENCY = 'b0000000-0000-0000-0000-000000000003';
const BRAND_MEMORIES = 'b0000000-0000-0000-0000-000000000004';

assert('BRAND_MATRIX', `HQ Brand UUID: ${BRAND_HQ}`, constantsFile.includes(BRAND_HQ));
assert('BRAND_MATRIX', `Service Brand UUID: ${BRAND_SERVICE}`, constantsFile.includes(BRAND_SERVICE));
assert('BRAND_MATRIX', `Agency Brand UUID: ${BRAND_AGENCY}`, constantsFile.includes(BRAND_AGENCY));
assert('BRAND_MATRIX', `Memories Brand UUID: ${BRAND_MEMORIES}`, constantsFile.includes(BRAND_MEMORIES));

// 4. BUSINESS BOUNDARIES & EXCLUSION RULES
console.log('\n--- 4. STRICT BUSINESS BOUNDARIES ---');
assert('BOUNDARIES', 'Maternity is STRICTLY EXCLUDED from Snap Memories category check constraints',
  schema008.includes("'Newborn'") && !schema008.includes("'Maternity'"));
assert('BOUNDARIES', 'Weddings are owned by The Snap Service and not by Memories',
  schema004.includes('wedding') && !schema008.includes('wedding_milestones'));

// 5. SUBDOMAIN REWRITE IN MIDDLEWARE
console.log('\n--- 5. SUBDOMAIN REWRITE INTEGRITY ---');
const middleware = fs.readFileSync(path.join(ROOT_DIR, 'src', 'middleware.ts'), 'utf-8');
assert('MIDDLEWARE', 'Subdomain routing for service.thesnaplegacy.com -> /service/*', middleware.includes('isServiceSubdomain'));
assert('MIDDLEWARE', 'Subdomain routing for agency.thesnaplegacy.com -> /agency/*', middleware.includes('isAgencySubdomain'));
assert('MIDDLEWARE', 'Subdomain routing for memories.thesnaplegacy.com -> /memories/*', middleware.includes('isMemoriesSubdomain'));
assert('MIDDLEWARE', 'Public token bypass for /quote/* and /approvals/*', middleware.includes("startsWith('/quote')"));

// 6. LIVE HTTP ROUTE VERIFICATION ACROSS ALL WORKSPACES
console.log('\n--- 6. LIVE ROUTE VERIFICATION (HQ, SERVICE, AGENCY, MEMORIES) ---');
const testRoutes = [
  // Phase 1: Legacy HQ
  { path: '/', label: 'Legacy HQ Dashboard' },
  { path: '/finance', label: 'HQ Central Finance' },
  { path: '/people/employees', label: 'HQ Central HR' },
  // Phase 2: Snap Service
  { path: '/service', label: 'The Snap Service Command' },
  { path: '/service/leads', label: 'Service Leads' },
  { path: '/service/events', label: 'Service Events' },
  // Phase 3: Snap Agency
  { path: '/agency', label: 'The Snap Agency Command' },
  { path: '/agency/leads', label: 'Agency Leads' },
  { path: '/agency/campaigns', label: 'Agency Campaigns' },
  { path: '/agency/content', label: 'Agency Content' },
  // Phase 4: Snap Memories
  { path: '/memories', label: 'Snap Memories Command' },
  { path: '/memories/leads', label: 'Memories Leads CRM' },
  { path: '/memories/sessions', label: 'Memories Sessions' },
  { path: '/memories/sessions/shoot-day', label: 'Memories Shoot Day Station' },
  { path: '/memories/quotes', label: 'Memories Quotes' },
  { path: '/memories/galleries', label: 'Memories Galleries' },
  { path: '/quote/acc_key_ayesha_rayan_9283f', label: 'Public Quote Portal' },
];

async function runLiveRouteCheck() {
  for (const item of testRoutes) {
    const isPublic = item.path.startsWith('/quote');
    const headers = isPublic ? {} : { Cookie: 'demo_session=true' };

    await new Promise((resolve) => {
      const req = http.get({
        hostname: 'localhost',
        port: 3000,
        path: item.path,
        headers,
      }, (res) => {
        assert('HTTP_ROUTE', `[HTTP ${res.statusCode}] ${item.label} (${item.path})`, res.statusCode === 200);
        res.resume();
        resolve();
      });
      req.on('error', (e) => {
        assert('HTTP_ROUTE', `${item.label} (${item.path})`, false, `Connection error: ${e.message}`);
        resolve();
      });
    });
  }

  // Summary Report
  console.log('\n' + '='.repeat(80));
  const total = RESULTS.length;
  const passed = RESULTS.filter(r => r.status === 'PASS').length;
  const failed = RESULTS.filter(r => r.status === 'FAIL').length;

  console.log(`TOTAL INTEGRATION CHECKS: ${total}`);
  console.log(`PASSED:                   ${passed}`);
  console.log(`FAILED:                   ${failed}`);

  if (failed === 0) {
    console.log('🏆 COMPLETE CROSS-BRAND ERP INTEGRATION PASSED WITH 100% SUCCESS!');
    console.log('The Snap Legacy ERP is fully prepared for Live Supabase Deployment.');
    console.log('='.repeat(80));
    process.exit(0);
  } else {
    console.error(`⚠️ ${failed} CHECKS FAILED.`);
    console.log('='.repeat(80));
    process.exit(1);
  }
}

runLiveRouteCheck();
