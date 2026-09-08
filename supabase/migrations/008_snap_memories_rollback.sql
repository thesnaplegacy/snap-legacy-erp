-- ============================================================
-- The Snap Legacy ERP — Rollback Script for Migration 008 & 009
-- Drops all Snap Memories studio tables and associated policies
-- Completely safe & non-destructive to Phase 1 HQ, Phase 2 Service, & Phase 3 Agency
-- ============================================================

-- 1. DROP SNAP MEMORIES TABLES IN REVERSE DEPENDENCY ORDER
DROP TABLE IF EXISTS memories_expenses CASCADE;
DROP TABLE IF EXISTS memories_automation_events CASCADE;
DROP TABLE IF EXISTS memories_communications CASCADE;
DROP TABLE IF EXISTS memories_reminders CASCADE;
DROP TABLE IF EXISTS memories_tasks CASCADE;
DROP TABLE IF EXISTS memories_deliverables CASCADE;
DROP TABLE IF EXISTS memories_editing_pipeline CASCADE;
DROP TABLE IF EXISTS memories_selections CASCADE;
DROP TABLE IF EXISTS memories_galleries CASCADE;
DROP TABLE IF EXISTS memories_quote_items CASCADE;
DROP TABLE IF EXISTS memories_booking_holds CASCADE;
DROP TABLE IF EXISTS memories_sessions CASCADE;
DROP TABLE IF EXISTS memories_quotes CASCADE;
DROP TABLE IF EXISTS memories_leads CASCADE;
DROP TABLE IF EXISTS memories_client_profiles CASCADE;
DROP TABLE IF EXISTS memories_package_items CASCADE;
DROP TABLE IF EXISTS memories_packages CASCADE;
DROP TABLE IF EXISTS memories_services CASCADE;

-- 2. OPTIONAL SEED DATA CLEANUP FROM CENTRAL TABLES
-- DELETE FROM client_brand_associations WHERE brand_id = 'b0000000-0000-0000-0000-000000000004';
-- DELETE FROM projects WHERE brand_id = 'b0000000-0000-0000-0000-000000000004';
-- DELETE FROM payments WHERE brand_id = 'b0000000-0000-0000-0000-000000000004';
-- DELETE FROM financial_transactions WHERE brand_id = 'b0000000-0000-0000-0000-000000000004';
