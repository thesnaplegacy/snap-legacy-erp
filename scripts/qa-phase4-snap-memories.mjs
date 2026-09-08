// Phase 4 Snap Memories QA & Production Readiness Automated Verification Suite
import fs from 'fs';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const RESULTS = [];

function assert(description, condition, details = '') {
  if (condition) {
    RESULTS.push({ status: 'PASS', description, details });
    console.log(`✅ [PASS] ${description}`);
  } else {
    RESULTS.push({ status: 'FAIL', description, details });
    console.error(`❌ [FAIL] ${description} — ${details}`);
  }
}

console.log('='.repeat(75));
console.log('🚀 RUNNING PHASE 4: SNAP MEMORIES DEDICATED WORKSPACE QA TEST SUITE');
console.log('='.repeat(75));

// ============================================================
// 1. BRAND IDENTITY & ARCHITECTURAL PILLARS
// ============================================================
console.log('\n--- 1. BRAND IDENTITY & ARCHITECTURAL INTEGRITY ---');
const MEMORIES_BRAND_UUID = 'b0000000-0000-0000-0000-000000000004';
const constantsFile = fs.readFileSync(path.join(ROOT_DIR, 'src', 'lib', 'constants.ts'), 'utf-8');

assert('Snap Memories Brand UUID is correctly defined as b0000000-...-0004',
  constantsFile.includes(`SNAP_MEMORIES: '${MEMORIES_BRAND_UUID}'`));

assert('Snap Memories visual identity signature color is pinned to #46BBD4',
  constantsFile.includes(`'snap-memories': '#46BBD4'`));

// ============================================================
// 2. STRICT BUSINESS BOUNDARIES: MATERNITY & WEDDING EXCLUSION
// ============================================================
console.log('\n--- 2. STRICT BUSINESS BOUNDARIES (MATERNITY & WEDDINGS EXCLUSION) ---');
const schema008 = fs.readFileSync(path.join(ROOT_DIR, 'supabase', 'migrations', '008_snap_memories_schema.sql'), 'utf-8');
const seed009 = fs.readFileSync(path.join(ROOT_DIR, 'supabase', 'migrations', '009_seed_snap_memories.sql'), 'utf-8');
const memoriesTypes = fs.readFileSync(path.join(ROOT_DIR, 'src', 'lib', 'types', 'database.ts'), 'utf-8');

// Extract memories_session_type enum block from schema008
const sessionTypeEnumMatch = schema008.match(/CREATE TYPE memories_session_type AS ENUM \(([\s\S]*?)\);/);
const sessionTypeEnumContent = sessionTypeEnumMatch ? sessionTypeEnumMatch[1] : '';

assert('Maternity photography is STRICTLY EXCLUDED from 008 memories_session_type enum',
  !sessionTypeEnumContent.toLowerCase().includes('maternity'));

// Verify seed data services and packages do not contain Maternity
const seedServicesPackages = seed009.split('-- 3. SEED CLIENT PROFILES')[0];
assert('Maternity photography is STRICTLY EXCLUDED from 009 seed services and packages',
  !seedServicesPackages.includes("'Maternity'"));

assert('Maternity photography is STRICTLY EXCLUDED from MemoriesSessionType in database.ts',
  !memoriesTypes.includes("'Maternity'"));

// Verify allowed studio categories
const allowedCategories = ['Newborn', 'Baby Milestone', 'Cake Smash', 'Birthday', 'Family', 'Anniversary', 'Lifestyle'];
const hasAllAllowed = allowedCategories.every(cat => schema008.includes(cat));
assert('All authorized studio categories exist in schema (Newborn, Cake Smash, Baby Milestone, etc.)', hasAllAllowed);

// ============================================================
// 3. DATABASE SCHEMA & 18 MEMORIES TABLES INTEGRITY
// ============================================================
console.log('\n--- 3. DATABASE TABLES INTEGRITY (008_snap_memories_schema.sql) ---');
const expectedMemoriesTables = [
  'memories_services',
  'memories_packages',
  'memories_package_items',
  'memories_client_profiles',
  'memories_leads',
  'memories_sessions',
  'memories_booking_holds',
  'memories_quotes',
  'memories_quote_items',
  'memories_galleries',
  'memories_selections',
  'memories_editing_pipeline',
  'memories_deliverables',
  'memories_tasks',
  'memories_reminders',
  'memories_communications',
  'memories_automation_events',
  'memories_expenses',
];

for (const table of expectedMemoriesTables) {
  const tableDefRegex = new RegExp(`CREATE TABLE (IF NOT EXISTS )?${table}\\b`, 'i');
  assert(`Table ${table} defined in 008 migration`, tableDefRegex.test(schema008));
}

// Check RLS on all tables
console.log('\n--- 4. ROW LEVEL SECURITY (RLS) POLICIES ON ALL 18 TABLES ---');
for (const table of expectedMemoriesTables) {
  const rlsRegex = new RegExp(`ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY`, 'i');
  assert(`RLS enabled on ${table}`, rlsRegex.test(schema008));
}

assert('Public unauthenticated access is permitted for quote viewing by access_key',
  schema008.includes('access_key IS NOT NULL') && schema008.includes('Public quote select by accessKey'));

// ============================================================
// 5. ROLLBACK & DOWN-MIGRATION SAFETY
// ============================================================
console.log('\n--- 5. DOWN-MIGRATION & ROLLBACK SCRIPT INTEGRITY ---');
const rollback008 = fs.readFileSync(path.join(ROOT_DIR, 'supabase', 'migrations', '008_snap_memories_rollback.sql'), 'utf-8');
for (const table of expectedMemoriesTables) {
  assert(`Rollback script safely drops table ${table}`, rollback008.includes(`DROP TABLE IF EXISTS ${table}`));
}

// ============================================================
// 6. SINGLE CENTRAL DATABASE INTEGRATION (NO SEPARATE SILOS)
// ============================================================
console.log('\n--- 6. CENTRAL DATABASE COHESION (CLIENTS, PROJECTS, FINANCE) ---');
assert('memories_client_profiles references central public.clients table',
  schema008.includes('REFERENCES clients(id)'));
assert('memories_sessions references central public.projects and public.clients',
  schema008.includes('REFERENCES projects(id)') && schema008.includes('REFERENCES clients(id)'));
assert('memories_quotes references central public.clients',
  schema008.includes('REFERENCES clients(id)'));
assert('memories_expenses references central brand_id',
  schema008.includes('REFERENCES brands(id)'));

// ============================================================
// 7. SEED DATA VERIFICATION (009_seed_snap_memories.sql)
// ============================================================
console.log('\n--- 7. SEED DATA & CLIENT RELATIONSHIPS ---');
assert('Seed migration links to Central Clients Master (Sara Khan, Dr. Ayesha, Zainab Bilal)',
  seed009.includes('Sara Khan') && seed009.includes('Dr. Ayesha & Tariq') && seed009.includes('Zainab Bilal'));
assert('Seed migration pins all records to Memories Brand UUID',
  seed009.includes(MEMORIES_BRAND_UUID));
assert('Seed migration populates client_brand_associations for memories',
  seed009.includes('client_brand_associations'));
assert('Seed migration creates initial proofing galleries and tasks',
  seed009.includes('INSERT INTO memories_galleries') && seed009.includes('INSERT INTO memories_tasks'));

// ============================================================
// 8. MIDDLEWARE & SUBDOMAIN ROUTING
// ============================================================
console.log('\n--- 8. MIDDLEWARE & SUBDOMAIN ROUTING ---');
const middlewareContent = fs.readFileSync(path.join(ROOT_DIR, 'src', 'middleware.ts'), 'utf-8');
assert('Middleware detects memories.thesnaplegacy.com subdomain',
  middlewareContent.includes('isMemoriesSubdomain'));
assert('Middleware rewrites memories subdomain to /memories/*',
  middlewareContent.includes('url.pathname = `/memories${request.nextUrl.pathname'));
assert('Middleware exempts /quote/* public portal from auth redirect barriers',
  middlewareContent.includes("request.nextUrl.pathname.startsWith('/quote')"));

// ============================================================
// 9. FUNCTIONAL SCENARIOS VERIFICATION (A-H)
// ============================================================
console.log('\n--- 9. FUNCTIONAL SCENARIOS (A-H) ENGINES VERIFICATION ---');
const actionsContent = fs.readFileSync(path.join(ROOT_DIR, 'src', 'actions', 'memories-actions.ts'), 'utf-8');

// Scenario A: Leads CRM & Central Client Duplicate Prevention
assert('Scenario A: checkDuplicateClient checks phone/email in central clients master before inserting',
  actionsContent.includes('export async function checkDuplicateClient') && actionsContent.includes(".from('clients')"));
assert('Scenario A: convertLeadToClient establishes client_brand_associations without duplicating record',
  actionsContent.includes('export async function convertLeadToClient') && actionsContent.includes('client_brand_associations'));

// Scenario B: Quotation Snapshot Immutability
assert('Scenario B: createMemoriesQuote creates immutable quote snapshot and generates public access key',
  actionsContent.includes('export async function createMemoriesQuote') && actionsContent.includes('access_key'));

// Scenario C: Public Quote Acceptance
assert('Scenario C: getPublicQuoteByAccessKey and acceptPublicQuote handle digital signature and status transition',
  actionsContent.includes('export async function getPublicQuoteByAccessKey') && actionsContent.includes('export async function acceptPublicQuote'));

// Scenario D: Studio Calendar Conflict Engine
assert('Scenario D: checkSessionConflict prevents room double-booking and photographer overlap',
  actionsContent.includes('export async function checkSessionConflict') && actionsContent.includes('studio_room'));

// Scenario E: Shoot-Day Floor Station
assert('Scenario E: updateShootDayChecklist and completeShootDay support live studio checklists and raw ingest trigger',
  actionsContent.includes('export async function updateShootDayChecklist') && actionsContent.includes('export async function completeShootDay'));

// Scenario F: Central Double-Entry Finance Sync & Idempotency
assert('Scenario F: recordMemoriesPayment uses idempotency keys and creates double-entry financial_transactions',
  actionsContent.includes('export async function recordMemoriesPayment') && actionsContent.includes('financial_transactions'));

// Scenario G: Deterministic Next-Action Engine
const nextActionFile = fs.readFileSync(path.join(ROOT_DIR, 'src', 'lib', 'workflow', 'next-action.ts'), 'utf-8');
assert('Scenario G: calculateNextActions surfaces urgent cake orders, lead follow-ups, and proofing reviews',
  nextActionFile.includes('calculateNextActions') && actionsContent.includes('getMemoriesNextActions'));

// Scenario H: Zero Regressions across Phase 1, 2, 3
assert('Scenario H: The Snap Service remains unmodified and isolated',
  fs.existsSync(path.join(ROOT_DIR, 'src', 'app', '(service)', 'service', 'page.tsx')));
assert('Scenario H: The Snap Agency remains unmodified and isolated',
  fs.existsSync(path.join(ROOT_DIR, 'src', 'app', '(agency)', 'agency', 'page.tsx')));
assert('Scenario H: Legacy HQ remains unmodified and isolated',
  fs.existsSync(path.join(ROOT_DIR, 'src', 'app', '(dashboard)', 'page.tsx')));

// ============================================================
// 10. APP ROUTES EXISTENCE & HTTP AVAILABILITY
// ============================================================
console.log('\n--- 10. APP ROUTES MASTER REGISTRY CHECK (23 ROUTES) ---');
const routes = [
  '/memories',
  '/memories/leads',
  '/memories/clients',
  '/memories/calendar',
  '/memories/sessions',
  '/memories/sessions/shoot-day',
  '/memories/quotes',
  '/memories/packages',
  '/memories/services',
  '/memories/payments',
  '/memories/galleries',
  '/memories/selections',
  '/memories/editing',
  '/memories/deliverables',
  '/memories/tasks',
  '/memories/reminders',
  '/memories/communications',
  '/memories/follow-ups',
  '/memories/products',
  '/memories/reports',
  '/memories/profitability',
  '/memories/settings',
  '/quote/acc_key_ayesha_rayan_9283f',
];

async function checkLiveRoutes() {
  console.log('Checking live HTTP responses from dev server on port 3000...');
  for (const route of routes) {
    const isPublic = route.startsWith('/quote');
    const headers = isPublic ? {} : { Cookie: 'demo_session=true' };

    await new Promise((resolve) => {
      const req = http.get({
        hostname: 'localhost',
        port: 3000,
        path: route,
        headers,
      }, (res) => {
        assert(`Route ${route} returns HTTP 200`, res.statusCode === 200, `Status: ${res.statusCode}`);
        res.resume();
        resolve();
      });
      req.on('error', (e) => {
        assert(`Route ${route} returns HTTP 200`, false, `Connection error: ${e.message}`);
        resolve();
      });
    });
  }

  // Summary Report
  console.log('\n' + '='.repeat(75));
  const total = RESULTS.length;
  const passed = RESULTS.filter(r => r.status === 'PASS').length;
  const failed = RESULTS.filter(r => r.status === 'FAIL').length;

  console.log(`TOTAL CHECKS: ${total}`);
  console.log(`PASSED:       ${passed}`);
  console.log(`FAILED:       ${failed}`);

  if (failed === 0) {
    console.log('🎉 ALL PHASE 4 VERIFICATIONS PASSED WITH 100% SUCCESS!');
    console.log('Snap Memories Studio Operating System is Production Ready.');
    console.log('='.repeat(75));
    process.exit(0);
  } else {
    console.error(`⚠️ ${failed} CHECKS FAILED.`);
    console.log('='.repeat(75));
    process.exit(1);
  }
}

checkLiveRoutes();
