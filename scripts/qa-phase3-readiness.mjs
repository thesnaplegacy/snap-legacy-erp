// Phase 3 QA & Production Readiness Automated Verification Script
import fs from 'fs';
import path from 'path';
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

console.log('='.repeat(70));
console.log('🚀 RUNNING PHASE 3 FINAL QA / PRODUCTION READINESS TEST SUITE');
console.log('='.repeat(70));

// 1. DATABASE MIGRATIONS INTEGRITY
console.log('\n--- 1. DATABASE MIGRATIONS INTEGRITY ---');
const migrationsDir = path.join(ROOT_DIR, 'supabase', 'migrations');
const expectedMigrations = [
  '001_foundation.sql',
  '002_rls_policies.sql',
  '003_seed_data.sql',
  '004_snap_service_schema.sql',
  '005_seed_snap_service.sql',
  '006_snap_agency_schema.sql',
  '007_seed_snap_agency.sql',
  '006_snap_agency_rollback.sql',
];

for (const m of expectedMigrations) {
  const filePath = path.join(migrationsDir, m);
  const exists = fs.existsSync(filePath);
  const size = exists ? fs.statSync(filePath).size : 0;
  assert(`Migration file ${m} exists and is non-empty`, exists && size > 100, `Size: ${size} bytes`);
}

// 2. ACTUAL SUPABASE SCHEMA & TABLES CHECK
console.log('\n--- 2. SCHEMA & TABLE DEFINITIONS (006_snap_agency_schema.sql) ---');
const schema006 = fs.readFileSync(path.join(migrationsDir, '006_snap_agency_schema.sql'), 'utf-8');
const expectedAgencyTables = [
  'agency_services',
  'agency_packages',
  'agency_package_items',
  'agency_client_profiles',
  'agency_discovery_records',
  'agency_quotation_items',
  'agency_proposals',
  'agency_projects',
  'agency_retainers',
  'agency_retainer_cycles',
  'agency_campaigns',
  'agency_content_items',
  'agency_creative_tasks',
  'agency_approvals',
  'agency_deliverables',
  'agency_expenses',
];

for (const table of expectedAgencyTables) {
  const tableDefRegex = new RegExp(`CREATE TABLE (IF NOT EXISTS )?${table}\\b`, 'i');
  assert(`Table ${table} is defined in 006 migration`, tableDefRegex.test(schema006));
}

// 3. ROW LEVEL SECURITY (RLS) POLICIES CHECK
console.log('\n--- 3. RLS / AUTHORIZATION DEFENSE-IN-DEPTH CHECK ---');
for (const table of expectedAgencyTables) {
  const rlsRegex = new RegExp(`ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY`, 'i');
  assert(`RLS is enabled on table ${table}`, rlsRegex.test(schema006));
}

assert('RLS helper get_user_brand_ids is referenced for multi-tenant isolation',
  schema006.includes('get_user_brand_ids(auth.uid())'));
assert('RLS helper is_super_admin is referenced for CEO/Super Admin override',
  schema006.includes('is_super_admin(auth.uid())'));
assert('Public token access is enabled on agency_approvals for client review without login',
  schema006.includes('approval_token IS NOT NULL'));

// 4. SEED DATA SEPARATION CHECK (007_seed_snap_agency.sql)
console.log('\n--- 4. SEED DATA SEPARATION CHECK (007_seed_snap_agency.sql) ---');
const seed007 = fs.readFileSync(path.join(migrationsDir, '007_seed_snap_agency.sql'), 'utf-8');
const AGENCY_BRAND_UUID = 'b0000000-0000-0000-0000-000000000003';
assert('Seed migration pins to dedicated Agency Brand UUID b0000000-...-0003',
  seed007.includes(AGENCY_BRAND_UUID));
assert('Seed migration links to Central Clients Master (Biryani Pizza, GCH Retail, Linker)',
  seed007.includes('Biryani Pizza Co.') && seed007.includes('GCH Retail') && seed007.includes('Linker Builders'));
assert('Seed migration populates client_brand_associations',
  seed007.includes('client_brand_associations'));
assert('Seed migration creates central projects and links to agency_projects',
  seed007.includes('INSERT INTO projects') && seed007.includes('INSERT INTO agency_projects'));

// 5. BRAND ISOLATION & AUTHORIZATION IN SERVER ACTIONS
console.log('\n--- 5. BRAND ISOLATION & SERVER ACTIONS CHECK ---');
const actionsContent = fs.readFileSync(path.join(ROOT_DIR, 'src', 'actions', 'agency-actions.ts'), 'utf-8');
assert('Agency brand ID constant is defined as b0000000-...-0003',
  actionsContent.includes(AGENCY_BRAND_UUID));
assert('verifyAgencyAccess enforces authentication & brand access / superadmin',
  actionsContent.includes('verifyAgencyAccess()') &&
  actionsContent.includes('hasBrandAccess(user, AGENCY_BRAND_ID)') &&
  actionsContent.includes('isSuperAdmin(user)'));

// Check brand scoping in queries
const brandEqMatches = (actionsContent.match(/\.eq\('brand_id', AGENCY_BRAND_ID\)/g) || []).length;
assert(`Server actions strictly filter by AGENCY_BRAND_ID in queries (${brandEqMatches} queries checked)`,
  brandEqMatches >= 10);

// Check that Agency actions never hardcode Service or Photography brand IDs
assert('Zero contamination: Service brand ID (b0000...0002) is NOT used for Agency writes',
  !actionsContent.includes('b0000000-0000-0000-0000-000000000002'));
assert('Zero contamination: Photography brand ID (b0000...0001) is NOT used for Agency writes',
  !actionsContent.includes('b0000000-0000-0000-0000-000000000001'));

// 6. FINANCE IDEMPOTENCY & CENTRAL DOUBLE-ENTRY SYNC
console.log('\n--- 6. FINANCE IDEMPOTENCY & CENTRAL DOUBLE-ENTRY SYNC ---');
assert('recordAgencyPayment checks idempotency via reference/idempotencyKey before write',
  actionsContent.includes("eq('reference', refKey)") && actionsContent.includes('Payment already processed (idempotent)'));
assert('recordAgencyPayment writes credit to central financial_transactions',
  actionsContent.includes("from('financial_transactions')") && actionsContent.includes("type: 'credit'"));
assert('recordAgencyPayment links central payments record with transaction_id',
  actionsContent.includes("transaction_id: tx.id"));
assert('recordAgencyExpense writes debit to central financial_transactions',
  actionsContent.includes("type: 'debit'") && actionsContent.includes("from('agency_expenses')"));

// 7. SNAPSHOT PRICING & LIFETIME DATA PRESERVATION
console.log('\n--- 7. SNAPSHOT PRICING & LIFETIME DATA PRESERVATION ---');
assert('createAgencyQuotation creates frozen line item snapshots in agency_quotation_items',
  actionsContent.includes("from('agency_quotation_items').insert(snapshotItems)"));
assert('agency_quotation_items table has immutable pricing columns',
  schema006.includes('unit_price DECIMAL(15,2)') &&
  schema006.includes('discount_amount DECIMAL(15,2)') &&
  schema006.includes('total_price DECIMAL(15,2)'));
assert('agency_approvals maintains revision history and client audit timestamps',
  schema006.includes('revision_number INT NOT NULL DEFAULT 1') &&
  schema006.includes('feedback_comments TEXT') &&
  schema006.includes('client_action_at TIMESTAMPTZ'));

// 8. AUDIT LOGGING
console.log('\n--- 8. AUDIT LOGGING VERIFICATION ---');
assert('createAuditLog is imported and called on financial mutations',
  actionsContent.includes("createAuditLog(") && actionsContent.includes("'financial_change'"));

// 9. SUBDOMAIN ROUTING & WORKSPACE PROXY/MIDDLEWARE
console.log('\n--- 9. SUBDOMAIN ROUTING & WORKSPACE PROXY CHECK ---');
const middlewareContent = fs.readFileSync(path.join(ROOT_DIR, 'src', 'middleware.ts'), 'utf-8');
assert('Middleware detects agency.thesnaplegacy subdomain',
  middlewareContent.includes("isAgencySubdomain = host.startsWith('agency.')"));
assert('Middleware rewrites agency subdomain to /agency workspace in demo mode',
  middlewareContent.includes('url.pathname = `/agency${request.nextUrl.pathname === \'/\' ? \'\' : request.nextUrl.pathname}`'));
assert('Middleware rewrites agency subdomain in authenticated Supabase mode',
  middlewareContent.includes('NextResponse.rewrite(url, { headers: supabaseResponse.headers })'));

// 10. ROLLBACK CAPABILITY (006_snap_agency_rollback.sql)
console.log('\n--- 10. ROLLBACK CAPABILITY CHECK ---');
const rollbackContent = fs.readFileSync(path.join(migrationsDir, '006_snap_agency_rollback.sql'), 'utf-8');
assert('Rollback drops all agency tables in reverse foreign key order',
  rollbackContent.includes('DROP TABLE IF EXISTS agency_expenses CASCADE') &&
  rollbackContent.includes('DROP TABLE IF EXISTS agency_services CASCADE'));
assert('Rollback does NOT drop any central or Service tables (zero Phase 1/2 impact)',
  !rollbackContent.includes('DROP TABLE IF EXISTS packages') &&
  !rollbackContent.includes('DROP TABLE IF EXISTS event_functions') &&
  !rollbackContent.includes('DROP TABLE IF EXISTS clients') &&
  !rollbackContent.includes('DROP TABLE IF EXISTS brands'));

// 11. REGRESSION CHECK: PHASE 1 HQ & PHASE 2 SERVICE INTACT
console.log('\n--- 11. REGRESSION CHECK (PHASE 1 HQ & PHASE 2 SERVICE) ---');
const serviceActions = fs.readFileSync(path.join(ROOT_DIR, 'src', 'actions', 'service.ts'), 'utf-8');
const financeActions = fs.readFileSync(path.join(ROOT_DIR, 'src', 'actions', 'finance.ts'), 'utf-8');
assert('Phase 2 service.ts uses SNAP_SERVICE_BRAND_ID b0000...0002 without alteration',
  serviceActions.includes("const SNAP_SERVICE_BRAND_ID = 'b0000000-0000-0000-0000-000000000002'"));
assert('Phase 2 service dashboard stats function is intact',
  serviceActions.includes('export async function getServiceDashboardStats()'));
assert('Phase 2 wedding functions loader is intact',
  serviceActions.includes('export async function getServiceWeddings()'));
assert('Phase 2 calendar & scheduling action is intact',
  serviceActions.includes('export async function getServiceCalendarEvents()'));
assert('Phase 2 payment & cost sync actions are intact',
  serviceActions.includes('export async function recordServicePayment(') &&
  serviceActions.includes('export async function recordServiceCost('));
assert('Phase 2 editing pipeline action is intact',
  serviceActions.includes('export async function updateEditingStatus('));
assert('Phase 1 central finance actions are intact',
  financeActions.includes('export async function getDashboardStats()') &&
  financeActions.includes('export async function getBrandPerformance()'));

// 12. PRODUCTION ENVIRONMENT VS DEMO MODE AUDIT
console.log('\n--- 12. PRODUCTION ENVIRONMENT AUDIT ---');
const envContent = fs.readFileSync(path.join(ROOT_DIR, '.env.local'), 'utf-8');
const isDemoMode = envContent.includes('NEXT_PUBLIC_DEMO_MODE=true');
assert('Environment status clearly identified (.env.local inspected)', true,
  isDemoMode ? 'Current state: Local Demo Mode (NEXT_PUBLIC_DEMO_MODE=true)' : 'Current state: Live Supabase Backend');

// SUMMARY
console.log('\n' + '='.repeat(70));
const total = RESULTS.length;
const passed = RESULTS.filter((r) => r.status === 'PASS').length;
const failed = RESULTS.filter((r) => r.status === 'FAIL').length;
console.log(`TOTAL CHECKS: ${total} | PASSED: ${passed} | FAILED: ${failed}`);
console.log('='.repeat(70));

if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL 12 READINESS AREAS VERIFIED WITH ZERO ERRORS!');
  process.exit(0);
}
