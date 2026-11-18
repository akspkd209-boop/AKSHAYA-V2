# Akshaya Centre Management 2.0

This is a parallel v2 codebase derived from the supplied Akshaya Centre application. The existing project and live deployment are not modified.

## Preserved business workflows
- Counter service entry and service-charge aggregation
- Daily/monthly collections and staff-wise splits
- Cash closing, denomination count, reconciliation, short/excess tracking
- Customer credit and repayments
- Advances, payments, expenses and centre payouts
- Salary, incentives, attendance, leave and LWP deductions
- Diary, staff, reports, backups and archive restore

## AEWS removal policy
- Removed the unused AEWS import screen and parser from the v2 source.
- Removed the ledger-store import action.
- New collection entry remains through the live manual Counter workflow.
- Existing historical rows whose note begins `Imported from aewskerala` are intentionally still readable and included in historic calculations/attendance. They are not deleted or rewritten.

## Data preservation
The original app stores the shared centre book and archive records in the configured database. V2 keeps the existing server functions, table definitions and book shape so it can read the same centre data when deployed with the same approved database configuration. Browser-local state is separate by origin; use the built-in Backup > Download book / Restore a downloaded book workflow for a controlled copy if needed. Do not point two environments at production and test writes without a backup and a coordinated cutover plan.

## Important verification gate
The v2 source is a parallel baseline, not yet approved for production. Compare old and new outputs using a read-only copy of the centre book before enabling writes.
