-- ============================================================
-- The Snap Legacy ERP — Rollback Script for Migration 006 & 007
-- Drops all The Snap Agency tables, views, and associated policies
-- Completely safe & non-destructive to Phase 1 HQ and Phase 2 The Snap Service
-- ============================================================

-- 1. DROP AGENCY TABLES IN REVERSE DEPENDENCY ORDER
DROP TABLE IF EXISTS agency_expenses CASCADE;
DROP TABLE IF EXISTS agency_deliverables CASCADE;
DROP TABLE IF EXISTS agency_approvals CASCADE;
DROP TABLE IF EXISTS agency_creative_tasks CASCADE;
DROP TABLE IF EXISTS agency_content_items CASCADE;
DROP TABLE IF EXISTS agency_campaigns CASCADE;
DROP TABLE IF EXISTS agency_retainer_cycles CASCADE;
DROP TABLE IF EXISTS agency_retainers CASCADE;
DROP TABLE IF EXISTS agency_projects CASCADE;
DROP TABLE IF EXISTS agency_proposals CASCADE;
DROP TABLE IF EXISTS agency_quotation_items CASCADE;
DROP TABLE IF EXISTS agency_discovery_records CASCADE;
DROP TABLE IF EXISTS agency_client_profiles CASCADE;
DROP TABLE IF EXISTS agency_package_items CASCADE;
DROP TABLE IF EXISTS agency_packages CASCADE;
DROP TABLE IF EXISTS agency_services CASCADE;

-- 2. OPTIONAL CLEANUP OF SEED/DEMO AGENCY DATA FROM CENTRAL TABLES
-- (Uncomment if full data purge is desired)
-- DELETE FROM client_brand_associations WHERE brand_id = 'b0000000-0000-0000-0000-000000000003';
-- DELETE FROM projects WHERE brand_id = 'b0000000-0000-0000-0000-000000000003';
-- DELETE FROM quotations WHERE brand_id = 'b0000000-0000-0000-0000-000000000003';
-- DELETE FROM payments WHERE brand_id = 'b0000000-0000-0000-0000-000000000003';
-- DELETE FROM financial_transactions WHERE brand_id = 'b0000000-0000-0000-0000-000000000003';
