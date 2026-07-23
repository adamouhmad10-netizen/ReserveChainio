import { getDb } from "@/lib/db";

// Public read layer. Publication gating is enforced here: anything not
// 'published' (or an approved public preview for documents) never reaches a
// public page or public API response.

export interface ProgramRow {
  id: string; code: string; slug: string; name: string; metal: string;
  material_form: string; proposed_purity: string | null; program_status: string;
  summary: string | null; is_demo: number;
}

export function getPrograms(): ProgramRow[] {
  return getDb()
    .prepare("SELECT * FROM asset_programs WHERE publication_status = 'published' ORDER BY code")
    .all() as ProgramRow[];
}

export function getProgramBySlug(slug: string): ProgramRow | undefined {
  return getDb()
    .prepare("SELECT * FROM asset_programs WHERE slug = ? AND publication_status = 'published'")
    .get(slug) as ProgramRow | undefined;
}

export interface AssetRow {
  id: string; program_id: string; identifier: string; slug: string; asset_type: string;
  title: string; description: string | null;
  verification_status: string; ownership_status: string; custody_status: string;
  insurance_status: string; valuation_status: string; reserve_status: string;
  tokenization_status: string; redemption_status: string; availability: string;
  version: number; is_demo: number; updated_at: string;
}

export function getAssetsForProgram(programId: string): AssetRow[] {
  return getDb()
    .prepare("SELECT * FROM physical_assets WHERE program_id = ? AND publication_status = 'published'")
    .all(programId) as AssetRow[];
}

export function getAssetBySlug(slug: string): AssetRow | undefined {
  return getDb()
    .prepare("SELECT * FROM physical_assets WHERE slug = ? AND publication_status = 'published'")
    .get(slug) as AssetRow | undefined;
}

export interface SpecRow {
  spec_group: string; label: string; value: string; unit: string | null; source: string | null;
}

export function getSpecs(assetId: string): SpecRow[] {
  return getDb()
    .prepare("SELECT spec_group, label, value, unit, source FROM asset_specs WHERE asset_id = ? ORDER BY sort")
    .all(assetId) as SpecRow[];
}

export interface UnitRow {
  unit_type: string; unit_code: string; seal_number: string | null; net_weight: string | null;
  status: string; redemption_status: string; is_demo: number;
}

export function getUnits(assetId: string): UnitRow[] {
  return getDb()
    .prepare("SELECT unit_type, unit_code, seal_number, net_weight, status, redemption_status, is_demo FROM units WHERE asset_id = ? ORDER BY unit_code")
    .all(assetId) as UnitRow[];
}

export interface PassportRow {
  id: string; asset_id: string; passport_code: string; slug: string; version: number;
  publication_status: string; is_demo: number; updated_at: string;
}

export function getPassports(): (PassportRow & { asset_title: string; asset_identifier: string; program_name: string; program_slug: string; metal: string })[] {
  return getDb()
    .prepare(
      `SELECT p.*, a.title AS asset_title, a.identifier AS asset_identifier,
              g.name AS program_name, g.slug AS program_slug, g.metal
       FROM passport_records p
       JOIN physical_assets a ON a.id = p.asset_id
       JOIN asset_programs g ON g.id = a.program_id
       WHERE p.publication_status = 'published'`
    )
    .all() as any;
}

export function getPassportBySlug(slug: string) {
  const d = getDb();
  const passport = d
    .prepare(
      `SELECT p.*, a.title AS asset_title, a.identifier AS asset_identifier, a.id AS asset_id,
              a.description AS asset_description, a.asset_type,
              a.verification_status, a.ownership_status, a.custody_status, a.insurance_status,
              a.valuation_status, a.reserve_status, a.tokenization_status, a.redemption_status,
              a.availability, g.name AS program_name, g.slug AS program_slug, g.metal,
              g.proposed_purity, g.code AS program_code
       FROM passport_records p
       JOIN physical_assets a ON a.id = p.asset_id
       JOIN asset_programs g ON g.id = a.program_id
       WHERE p.slug = ? AND p.publication_status = 'published'`
    )
    .get(slug) as any;
  if (!passport) return undefined;
  const events = d
    .prepare("SELECT event_type, label, detail, status, occurred_at FROM passport_events WHERE passport_id = ? ORDER BY sort")
    .all(passport.id) as { event_type: string; label: string; detail: string | null; status: string; occurred_at: string }[];
  const labReport = d
    .prepare(
      `SELECT lr.report_number, lr.report_date, lr.methodology, lr.stated_purity, lr.publication_status,
              l.name AS lab_name, doc.file_ref, doc.title AS doc_title, doc.notes AS doc_notes
       FROM laboratory_reports lr
       LEFT JOIN laboratories l ON l.id = lr.laboratory_id
       LEFT JOIN documents doc ON doc.id = lr.document_id
       WHERE lr.asset_id = ?`
    )
    .get(passport.asset_id) as any;
  return { passport, events, labReport, specs: getSpecs(passport.asset_id), units: getUnits(passport.asset_id) };
}

export function getPublicDocuments() {
  return getDb()
    .prepare(
      `SELECT doc.id, doc.title, doc.file_ref, doc.doc_status, doc.visibility, doc.notes, c.name AS category, c.sort
       FROM documents doc
       LEFT JOIN document_categories c ON c.id = doc.category_id
       ORDER BY c.sort, doc.title`
    )
    .all() as { id: string; title: string; file_ref: string | null; doc_status: string; visibility: string; notes: string | null; category: string | null; sort: number }[];
}

export function getModuleVisibility() {
  return getDb()
    .prepare("SELECT module, label, state, reason, activation_dependency, requires_written_authorization FROM module_visibility ORDER BY label")
    .all() as { module: string; label: string; state: string; reason: string; activation_dependency: string; requires_written_authorization: number }[];
}

export function getWebsiteModes() {
  return getDb()
    .prepare("SELECT mode, label, is_active, requires_written_authorization, sort FROM website_modes ORDER BY sort")
    .all() as { mode: string; label: string; is_active: number; requires_written_authorization: number; sort: number }[];
}

export function getJurisdictions() {
  return getDb()
    .prepare("SELECT country_code, country_name, classification, notes FROM jurisdiction_rules ORDER BY country_name")
    .all() as { country_code: string; country_name: string; classification: string; notes: string | null }[];
}
