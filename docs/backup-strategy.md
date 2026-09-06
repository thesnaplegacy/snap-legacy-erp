# The Snap Legacy ERP — Backup Strategy

## Overview

This document outlines the backup strategy for The Snap Legacy ERP system.
The system is designed for **lifetime data retention** and all business data
must be recoverable.

## Three-Tier Backup Strategy

### Tier 1: Supabase Native Backups

**Daily Automatic Backups** (available on Pro plan and above):
- Supabase automatically creates daily backups of your PostgreSQL database
- Backups are retained according to your plan's retention policy
- Access via: Supabase Dashboard → Database → Backups

**Point-in-Time Recovery (PITR)** (available as Pro plan add-on):
- Enables recovery to any specific second within the retention window
- Uses PostgreSQL Write-Ahead Log (WAL) streaming
- Enable via: Supabase Dashboard → Database → Backups → Enable PITR

> **Recommendation**: Enable PITR for production environments. This is the
> most reliable way to recover from accidental data loss or corruption.

### Tier 2: Scheduled pg_dump Exports

For additional safety, run periodic `pg_dump` exports:

```bash
# Weekly full backup
pg_dump \
  --host=db.<project-ref>.supabase.co \
  --port=5432 \
  --username=postgres \
  --dbname=postgres \
  --format=custom \
  --file=backup_$(date +%Y%m%d_%H%M%S).dump

# Compressed backup
pg_dump \
  --host=db.<project-ref>.supabase.co \
  --port=5432 \
  --username=postgres \
  --dbname=postgres \
  | gzip > backup_$(date +%Y%m%d_%H%M%S).sql.gz
```

**Storage**: Store backups in a separate cloud storage service:
- AWS S3
- Google Cloud Storage
- Azure Blob Storage
- Or any S3-compatible storage

**Schedule**: Automate using cron or a CI/CD pipeline:
```cron
# Weekly backup every Sunday at 2 AM
0 2 * * 0 /path/to/backup-script.sh
```

### Tier 3: Application-Level Protection

The ERP application itself provides data protection through:

1. **Soft Delete Architecture**: Normal business records are never permanently
   deleted through the application. They are archived with `is_archived = true`.

2. **Immutable Financial Transactions**: Financial transaction records cannot
   be updated or deleted. Corrections are made through reversal entries.

3. **Immutable Audit Logs**: All significant actions are logged in an
   append-only audit trail that cannot be modified through the application.

4. **Row Level Security**: RLS policies prevent unauthorized data access
   even if application-level security is bypassed.

## Restoration Procedures

### Restore from Supabase Dashboard
1. Go to Supabase Dashboard → Database → Backups
2. Select the backup point you want to restore to
3. Click "Restore"
4. Wait for the restoration to complete

### Restore from pg_dump
```bash
# Restore a custom-format dump
pg_restore \
  --host=db.<project-ref>.supabase.co \
  --port=5432 \
  --username=postgres \
  --dbname=postgres \
  --clean \
  --if-exists \
  backup_file.dump

# Restore a SQL dump
psql \
  --host=db.<project-ref>.supabase.co \
  --port=5432 \
  --username=postgres \
  --dbname=postgres \
  < backup_file.sql
```

### Recover Individual Archived Records
Archived records can be restored through the application:
1. Navigate to the relevant module
2. Toggle the "Show Archived" filter
3. Select the archived record
4. Click "Restore"

This will set `is_archived = false` and re-activate the record.

### Recover Financial History
Financial transactions are never deleted. To correct errors:
1. Navigate to Finance → Transactions
2. Find the incorrect transaction
3. Create a reversal entry (the original is preserved)

## Important Notes

- **NEVER** treat the live database as the only backup
- **NEVER** store backup credentials in the application code
- **ALWAYS** test restoration procedures periodically
- **ALWAYS** verify backup integrity before relying on them
- Supabase Storage (file uploads) is NOT covered by database backups — back up storage separately
- Edge Functions and environment variables are NOT covered by database backups

## Environment Separation

| Environment | Database | Backups |
|-------------|----------|---------|
| Development | Local or separate Supabase project | Not required |
| Preview | Separate Supabase project | Daily automatic |
| Production | Production Supabase project | Daily + PITR + weekly pg_dump |

## Compliance

For business continuity, maintain:
- Minimum 30 days of daily backups
- Minimum 90 days of weekly exports
- Annual archive of full database exports
- Documentation of all restoration procedures and their test results
