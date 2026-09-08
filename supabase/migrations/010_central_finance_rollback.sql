-- ============================================================
-- The Snap Legacy ERP — Rollback Migration 010 & 011
-- Drops Phase 5 Central Finance Intelligence tables in reverse order
-- Leaves Phase 1, Phase 2, Phase 3, and Phase 4 100% untouched
-- ============================================================

DROP TABLE IF EXISTS financial_reversals_audit CASCADE;
DROP TABLE IF EXISTS financial_payables_ledger CASCADE;
DROP TABLE IF EXISTS financial_bank_reconciliations CASCADE;
DROP TABLE IF EXISTS financial_bank_accounts CASCADE;
DROP TABLE IF EXISTS financial_journal_lines CASCADE;
DROP TABLE IF EXISTS financial_journal_entries CASCADE;
DROP TABLE IF EXISTS financial_chart_of_accounts CASCADE;
