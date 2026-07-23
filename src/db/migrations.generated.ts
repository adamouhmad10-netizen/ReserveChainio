// AUTO-GENERATED from src/db/migrations/*.sql — do not edit by hand.
// Regenerate with: node scripts/build-migrations.mjs
// Embedded so the SQL is bundled into the serverless build (no runtime fs read
// of source files, which do not exist in the Next.js production output).

export interface Migration { name: string; sql: string; }

export const MIGRATIONS: Migration[] = [
  {
    name: "001_core.sql",
    sql: `-- ReserveChain demo database — SQLite dialect.
-- Production target is PostgreSQL with Row-Level Security; the PostgreSQL DDL
-- mirror lives in supabase/migrations. Structural parity is documented in
-- docs/database-schema.md.

PRAGMA journal_mode = WAL;

-- ---------------------------------------------------------------- identity
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT,               -- scrypt; null for non-login records
  display_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',  -- active | suspended | closed
  mfa_enrolled INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS roles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,        -- super_admin | operations | compliance | finance | treasury | support | content_editor | reviewer | auditor
  description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS user_roles (
  user_id TEXT NOT NULL REFERENCES users(id),
  role_id TEXT NOT NULL REFERENCES roles(id),
  granted_at TEXT NOT NULL DEFAULT (datetime('now')),
  granted_by TEXT REFERENCES users(id),
  PRIMARY KEY (user_id, role_id)
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  expires_at TEXT NOT NULL,
  ip TEXT,
  user_agent TEXT,
  revoked INTEGER NOT NULL DEFAULT 0
);

-- ---------------------------------------------------------------- content
CREATE TABLE IF NOT EXISTS content_pages (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  summary TEXT,
  status TEXT NOT NULL DEFAULT 'draft',  -- draft | under_review | approved | published | unpublished | archived
  locale TEXT NOT NULL DEFAULT 'en',
  body TEXT,
  seo_title TEXT,
  seo_description TEXT,
  created_by TEXT REFERENCES users(id),
  reviewed_by TEXT REFERENCES users(id),
  approved_by TEXT REFERENCES users(id),
  published_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS content_versions (
  id TEXT PRIMARY KEY,
  page_id TEXT NOT NULL REFERENCES content_pages(id),
  version INTEGER NOT NULL,
  body TEXT,
  status_at_capture TEXT NOT NULL,
  captured_at TEXT NOT NULL DEFAULT (datetime('now')),
  captured_by TEXT REFERENCES users(id)
);

-- ---------------------------------------------------------------- registry
CREATE TABLE IF NOT EXISTS asset_programs (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,        -- e.g. CU-PWD-6N, NI-WIRE-4N
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  metal TEXT NOT NULL,              -- copper | nickel | future
  material_form TEXT NOT NULL,      -- powder | wire
  proposed_purity TEXT,             -- text: e.g. '99.9999% (proposed specification)'
  program_status TEXT NOT NULL DEFAULT 'in_development',
  publication_status TEXT NOT NULL DEFAULT 'published',
  is_demo INTEGER NOT NULL DEFAULT 1,
  summary TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS physical_assets (
  id TEXT PRIMARY KEY,
  program_id TEXT NOT NULL REFERENCES asset_programs(id),
  identifier TEXT NOT NULL UNIQUE,  -- TEMPLATE-CU-BATCH etc.
  slug TEXT NOT NULL UNIQUE,
  asset_type TEXT NOT NULL,         -- batch | coil_lot
  title TEXT NOT NULL,
  description TEXT,
  verification_status TEXT NOT NULL DEFAULT 'pending',
  ownership_status TEXT NOT NULL DEFAULT 'pending',
  custody_status TEXT NOT NULL DEFAULT 'pending',
  insurance_status TEXT NOT NULL DEFAULT 'pending',
  valuation_status TEXT NOT NULL DEFAULT 'pending',
  reserve_status TEXT NOT NULL DEFAULT 'inactive',
  tokenization_status TEXT NOT NULL DEFAULT 'not_issued',
  redemption_status TEXT NOT NULL DEFAULT 'inactive',
  availability TEXT NOT NULL DEFAULT 'not_offered_for_sale',
  publication_status TEXT NOT NULL DEFAULT 'published',
  is_demo INTEGER NOT NULL DEFAULT 1,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS lots (
  id TEXT PRIMARY KEY,
  asset_id TEXT NOT NULL REFERENCES physical_assets(id),
  lot_number TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  net_weight TEXT, gross_weight TEXT, weight_unit TEXT,
  is_demo INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS units ( -- containers, coils and future packaged units
  id TEXT PRIMARY KEY,
  asset_id TEXT NOT NULL REFERENCES physical_assets(id),
  unit_type TEXT NOT NULL,          -- container | coil
  unit_code TEXT NOT NULL,
  seal_number TEXT,
  net_weight TEXT,
  packaging TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  redemption_status TEXT NOT NULL DEFAULT 'inactive',
  is_demo INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS asset_specs (
  id TEXT PRIMARY KEY,
  asset_id TEXT NOT NULL REFERENCES physical_assets(id),
  spec_group TEXT NOT NULL,         -- identity | chemistry | physical | packaging | provenance
  label TEXT NOT NULL,
  value TEXT NOT NULL,              -- 'Pending' when unknown — never fabricated
  unit TEXT,
  source TEXT,                      -- e.g. 'IGAS CoA 0004512 (owner-supplied)'
  sort INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS laboratories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT,
  publication_status TEXT NOT NULL DEFAULT 'pending_approval',
  is_demo INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS laboratory_reports (
  id TEXT PRIMARY KEY,
  asset_id TEXT REFERENCES physical_assets(id),
  laboratory_id TEXT REFERENCES laboratories(id),
  report_number TEXT,
  report_date TEXT,
  methodology TEXT,
  stated_purity TEXT,
  document_id TEXT,
  publication_status TEXT NOT NULL DEFAULT 'pending_approval',
  is_demo INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS ownership_records (
  id TEXT PRIMARY KEY, asset_id TEXT REFERENCES physical_assets(id),
  holder TEXT, status TEXT NOT NULL DEFAULT 'pending', evidence_document_id TEXT,
  recorded_at TEXT NOT NULL DEFAULT (datetime('now')), is_demo INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS chain_of_title_events (
  id TEXT PRIMARY KEY, asset_id TEXT REFERENCES physical_assets(id),
  event_type TEXT NOT NULL, detail TEXT, occurred_at TEXT, recorded_at TEXT NOT NULL DEFAULT (datetime('now')),
  is_demo INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS custody_records (
  id TEXT PRIMARY KEY, asset_id TEXT REFERENCES physical_assets(id),
  custodian TEXT, location TEXT, status TEXT NOT NULL DEFAULT 'pending',
  agreement_document_id TEXT, is_demo INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS warehouse_receipts (
  id TEXT PRIMARY KEY, asset_id TEXT REFERENCES physical_assets(id),
  receipt_number TEXT, status TEXT NOT NULL DEFAULT 'pending', document_id TEXT, is_demo INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS insurance_records (
  id TEXT PRIMARY KEY, asset_id TEXT REFERENCES physical_assets(id),
  provider TEXT, coverage TEXT, status TEXT NOT NULL DEFAULT 'pending', document_id TEXT, is_demo INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS valuations (
  id TEXT PRIMARY KEY, asset_id TEXT REFERENCES physical_assets(id),
  valuer TEXT, methodology TEXT, currency TEXT, amount TEXT, valuation_date TEXT,
  status TEXT NOT NULL DEFAULT 'pending', document_id TEXT, is_demo INTEGER NOT NULL DEFAULT 1
);

-- ---------------------------------------------------------------- reserves & tokens
CREATE TABLE IF NOT EXISTS token_programs (
  id TEXT PRIMARY KEY,
  program_id TEXT REFERENCES asset_programs(id),
  name TEXT, symbol TEXT, decimals INTEGER,
  chain TEXT NOT NULL DEFAULT 'ethereum',
  status TEXT NOT NULL DEFAULT 'pending',  -- pending | under_review | not_applicable | approved | published | suspended | retired
  supply_cap TEXT, contract_address TEXT,   -- null until deployment approval
  is_demo INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS token_deployments (
  id TEXT PRIMARY KEY, token_program_id TEXT REFERENCES token_programs(id),
  network TEXT NOT NULL, address TEXT, tx_hash TEXT, deployed_at TEXT,
  status TEXT NOT NULL DEFAULT 'pending', is_demo INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS token_supply_snapshots (
  id TEXT PRIMARY KEY, token_program_id TEXT REFERENCES token_programs(id),
  issued TEXT, circulating TEXT, treasury TEXT, locked TEXT, burned TEXT, redeemed TEXT,
  captured_at TEXT NOT NULL DEFAULT (datetime('now')), source_reference TEXT, is_demo INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS reserve_reports (
  id TEXT PRIMARY KEY, program_id TEXT REFERENCES asset_programs(id),
  period TEXT, status TEXT NOT NULL DEFAULT 'inactive',
  coverage_ratio TEXT, valuation_date TEXT, attestation_date TEXT,
  publication_status TEXT NOT NULL DEFAULT 'unpublished', is_demo INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS reserve_snapshots (
  id TEXT PRIMARY KEY, report_id TEXT REFERENCES reserve_reports(id),
  metric TEXT NOT NULL, value TEXT NOT NULL, captured_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS reserve_discrepancies (
  id TEXT PRIMARY KEY, report_id TEXT REFERENCES reserve_reports(id),
  severity TEXT NOT NULL, description TEXT NOT NULL, resolved INTEGER NOT NULL DEFAULT 0,
  detected_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ---------------------------------------------------------------- passports
CREATE TABLE IF NOT EXISTS passport_records (
  id TEXT PRIMARY KEY,
  asset_id TEXT NOT NULL REFERENCES physical_assets(id),
  passport_code TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  version INTEGER NOT NULL DEFAULT 1,
  publication_status TEXT NOT NULL DEFAULT 'published',
  visibility TEXT NOT NULL DEFAULT 'public',
  is_demo INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS passport_versions (
  id TEXT PRIMARY KEY, passport_id TEXT NOT NULL REFERENCES passport_records(id),
  version INTEGER NOT NULL, snapshot TEXT NOT NULL, captured_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS passport_events (
  id TEXT PRIMARY KEY, passport_id TEXT NOT NULL REFERENCES passport_records(id),
  event_type TEXT NOT NULL, label TEXT NOT NULL, detail TEXT,
  status TEXT NOT NULL DEFAULT 'recorded', occurred_at TEXT NOT NULL DEFAULT (datetime('now')),
  sort INTEGER NOT NULL DEFAULT 0
);

-- ---------------------------------------------------------------- documents
CREATE TABLE IF NOT EXISTS document_categories (
  id TEXT PRIMARY KEY, name TEXT NOT NULL UNIQUE, sort INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  category_id TEXT REFERENCES document_categories(id),
  title TEXT NOT NULL,
  file_ref TEXT,                    -- storage reference / public path for approved previews
  doc_status TEXT NOT NULL DEFAULT 'in_preparation', -- in_preparation | pending_approval | approved_preview | published
  visibility TEXT NOT NULL DEFAULT 'private',        -- public | private | pending
  version INTEGER NOT NULL DEFAULT 1,
  notes TEXT,
  is_demo INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS document_versions (
  id TEXT PRIMARY KEY, document_id TEXT NOT NULL REFERENCES documents(id),
  version INTEGER NOT NULL, file_ref TEXT, captured_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ---------------------------------------------------------------- waitlist & enquiries
CREATE TABLE IF NOT EXISTS waitlist_registrations (
  id TEXT PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  country_of_residence TEXT NOT NULL,
  interest_type TEXT NOT NULL,      -- individual | institutional
  is_industrial_buyer INTEGER NOT NULL DEFAULT 0,
  is_asset_originator INTEGER NOT NULL DEFAULT 0,
  material_interest TEXT NOT NULL,  -- copper | nickel | both | future
  interest_range TEXT,
  participation_type TEXT,
  status TEXT NOT NULL DEFAULT 'pending_verification', -- pending_verification | verified | unsubscribed | anonymized
  referrer TEXT,
  campaign_source TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  verified_at TEXT
);
CREATE TABLE IF NOT EXISTS email_verifications (
  id TEXT PRIMARY KEY,
  registration_id TEXT NOT NULL REFERENCES waitlist_registrations(id),
  token_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  expires_at TEXT NOT NULL,
  consumed_at TEXT,
  dispatch_status TEXT NOT NULL DEFAULT 'pending_email_provider' -- no SMTP provider configured yet
);
CREATE TABLE IF NOT EXISTS consent_records (
  id TEXT PRIMARY KEY,
  registration_id TEXT REFERENCES waitlist_registrations(id),
  consent_type TEXT NOT NULL,       -- updates | privacy | no_entitlement_ack
  consent_text_version TEXT NOT NULL,
  consent_text_hash TEXT NOT NULL,
  granted INTEGER NOT NULL DEFAULT 1,
  recorded_at TEXT NOT NULL DEFAULT (datetime('now')),
  ip_hash TEXT
);
CREATE TABLE IF NOT EXISTS enquiries (
  id TEXT PRIMARY KEY,
  enquiry_type TEXT NOT NULL,       -- enterprise | asset_originator | industrial_buyer | general
  organization TEXT,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  country TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  assigned_to TEXT REFERENCES users(id),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS support_requests (
  id TEXT PRIMARY KEY, subject TEXT NOT NULL, email TEXT NOT NULL, message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open', created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ---------------------------------------------------------------- platform config
CREATE TABLE IF NOT EXISTS website_modes (
  id TEXT PRIMARY KEY,
  mode TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 0,
  requires_written_authorization INTEGER NOT NULL DEFAULT 0,
  sort INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS module_visibility (
  id TEXT PRIMARY KEY,
  module TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'disabled',  -- enabled | disabled | architecture_prepared
  reason TEXT NOT NULL,
  activation_dependency TEXT NOT NULL,
  requires_written_authorization INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS jurisdiction_rules (
  id TEXT PRIMARY KEY,
  country_code TEXT NOT NULL UNIQUE,
  country_name TEXT NOT NULL,
  classification TEXT NOT NULL DEFAULT 'pending_legal_review', -- permitted | restricted | pending_legal_review
  notes TEXT,
  decided_by TEXT, decided_at TEXT
);
CREATE TABLE IF NOT EXISTS eligibility_decisions (
  id TEXT PRIMARY KEY, subject_ref TEXT NOT NULL, decision TEXT NOT NULL,
  reason TEXT, decided_by TEXT REFERENCES users(id), decided_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY, audience TEXT NOT NULL, title TEXT NOT NULL, body TEXT,
  status TEXT NOT NULL DEFAULT 'draft', created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ---------------------------------------------------------------- audit trail
-- Append-only, hash-chained administrative audit trail (NOT an on-chain
-- structure — see docs/security-architecture.md). Update/delete are blocked
-- at the database layer by triggers below.
CREATE TABLE IF NOT EXISTS audit_entries (
  seq INTEGER PRIMARY KEY AUTOINCREMENT,
  id TEXT NOT NULL UNIQUE,
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  record_id TEXT,
  previous_value TEXT,
  new_value TEXT,
  reason TEXT,
  request_meta TEXT,
  occurred_at TEXT NOT NULL DEFAULT (datetime('now')),
  prev_hash TEXT NOT NULL,
  hash TEXT NOT NULL
);

CREATE TRIGGER IF NOT EXISTS audit_no_update
BEFORE UPDATE ON audit_entries
BEGIN
  SELECT RAISE(ABORT, 'audit_entries is append-only: updates are prohibited');
END;

CREATE TRIGGER IF NOT EXISTS audit_no_delete
BEFORE DELETE ON audit_entries
BEGIN
  SELECT RAISE(ABORT, 'audit_entries is append-only: deletes are prohibited');
END;

CREATE INDEX IF NOT EXISTS idx_waitlist_country ON waitlist_registrations(country_of_residence);
CREATE INDEX IF NOT EXISTS idx_waitlist_material ON waitlist_registrations(material_interest);
CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_entries(entity, record_id);
CREATE INDEX IF NOT EXISTS idx_units_asset ON units(asset_id);
CREATE INDEX IF NOT EXISTS idx_specs_asset ON asset_specs(asset_id, spec_group, sort);
CREATE INDEX IF NOT EXISTS idx_passport_events ON passport_events(passport_id, sort);
`,
  },
];
