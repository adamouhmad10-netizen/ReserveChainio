import type Database from "better-sqlite3";
import { randomUUID, scryptSync, randomBytes } from "node:crypto";
import { appendAudit } from "@/lib/audit";

// Seeds controlled demonstration data. Every registry record carries
// is_demo = 1 and pending/illustrative statuses — nothing here may be
// presented as a verified reserve. See docs/attachment-review.md for the
// provenance of the IGAS certificate facts referenced below.

const uid = () => randomUUID();

export function hashPassword(pw: string): string {
  const salt = randomBytes(16).toString("hex");
  return `scrypt:${salt}:${scryptSync(pw, salt, 64).toString("hex")}`;
}

export function seed(d: Database.Database) {
  const seeded = d.prepare("SELECT COUNT(*) AS n FROM roles").get() as { n: number };
  if (seeded.n > 0) return;

  const tx = d.transaction(() => {
    // ---- roles & demo admin -------------------------------------------------
    const roles: [string, string][] = [
      ["super_admin", "Full administrative control, including sensitive configuration"],
      ["operations", "Registry, asset and logistics operations"],
      ["compliance", "KYC/KYB, jurisdiction and eligibility review"],
      ["finance", "Financial reporting and reconciliation"],
      ["treasury", "Treasury and token administration (inactive prelaunch)"],
      ["support", "Enquiry and support handling"],
      ["content_editor", "Draft and edit CMS content"],
      ["reviewer", "Review and approve content for publication"],
      ["auditor", "Read-only audit and evidence access"],
    ];
    const roleIds: Record<string, string> = {};
    for (const [name, description] of roles) {
      const id = uid();
      roleIds[name] = id;
      d.prepare("INSERT INTO roles (id, name, description) VALUES (?, ?, ?)").run(id, name, description);
    }

    const adminEmail = process.env.RC_DEMO_ADMIN_EMAIL ?? "admin@reservechain.local";
    const adminPassword = process.env.RC_DEMO_ADMIN_PASSWORD ?? "reservechain-demo";
    const adminId = uid();
    d.prepare(
      "INSERT INTO users (id, email, password_hash, display_name) VALUES (?, ?, ?, ?)"
    ).run(adminId, adminEmail, hashPassword(adminPassword), "Demo Administrator");
    d.prepare("INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)").run(adminId, roleIds.super_admin);

    const reviewerId = uid();
    d.prepare(
      "INSERT INTO users (id, email, password_hash, display_name) VALUES (?, ?, ?, ?)"
    ).run(reviewerId, "reviewer@reservechain.local", hashPassword("reservechain-review"), "Demo Reviewer");
    d.prepare("INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)").run(reviewerId, roleIds.reviewer);

    // ---- website modes ------------------------------------------------------
    const modes: [string, string, number, number][] = [
      ["development", "Development", 0, 0],
      ["pre-launch", "Pre-Launch", 1, 0],
      ["waitlist", "Waitlist", 0, 0],
      ["documentation-release", "Documentation Release", 0, 0],
      ["asset-verification", "Asset Verification", 0, 1],
      ["eligibility", "Eligibility", 0, 1],
      ["early-participation", "Early Participation", 0, 1],
      ["live-offering", "Live Offering", 0, 1],
      ["redemption", "Redemption", 0, 1],
      ["enterprise-onboarding", "Enterprise Onboarding", 0, 1],
    ];
    modes.forEach(([mode, label, active, gated], i) =>
      d.prepare(
        "INSERT INTO website_modes (id, mode, label, is_active, requires_written_authorization, sort) VALUES (?, ?, ?, ?, ?, ?)"
      ).run(uid(), mode, label, active, gated, i)
    );

    // ---- module visibility --------------------------------------------------
    const mods: [string, string, string, string, string, number][] = [
      ["public_website", "Public Website", "enabled", "Prelaunch information platform", "None", 0],
      ["waitlist", "Project Waitlist", "enabled", "Registration of interest only — no payment, wallet or reservation", "None", 0],
      ["registry_demo", "Industrial Metals Registry (illustrative)", "enabled", "Template records only, clearly labelled", "Owner-approved asset data for real records", 0],
      ["passports_demo", "Digital Asset Passports (illustrative)", "enabled", "TEMPLATE-CU-BATCH / TEMPLATE-NI-COIL only", "Owner-approved asset data for real records", 0],
      ["investor_portal", "Investor Portal", "architecture_prepared", "No offering exists; KYC/KYB provider not selected", "Legal structure, KYC provider, written authorization", 1],
      ["wallet_connect", "Wallet Connection", "disabled", "Prohibited in public prelaunch mode", "Written authorization + approved offering", 1],
      ["token_acquisition", "USDT Token Acquisition", "disabled", "No token exists; module must be incapable of accepting funds", "Legal documentation, treasury controls, written authorization", 1],
      ["proof_of_reserves_public", "Public Proof of Reserves", "disabled", "No approved asset, custody, supply or attestation data", "Approved reserve, custody and attestation data", 1],
      ["redemption", "Physical Redemption", "disabled", "No custody arrangement or token exists", "Custody, legal terms, token issuance, written authorization", 1],
      ["kyc_kyb", "KYC / KYB", "architecture_prepared", "Provider-agnostic adapter boundary implemented; no provider selected", "Owner provider selection and contract", 1],
      ["exchange_info", "DEX / Exchange Information", "disabled", "Conditional launch phase; nothing may be published", "Written authorization", 1],
      ["mobile_app_links", "Mobile Application Links", "disabled", "Apps not yet distributed via TestFlight / Google Play", "Store testing distribution under owner accounts", 0],
    ];
    for (const [module, label, state, reason, dep, gated] of mods) {
      d.prepare(
        "INSERT INTO module_visibility (id, module, label, state, reason, activation_dependency, requires_written_authorization) VALUES (?, ?, ?, ?, ?, ?, ?)"
      ).run(uid(), module, label, state, reason, dep, gated);
    }

    // ---- document categories & documents -----------------------------------
    const cats = [
      "Corporate Documents", "Project Overview", "Whitepaper", "Token Terms", "Risk Disclosure",
      "Copper Powder Reports", "Nickel Wire Reports", "Certificates of Analysis", "Ownership Documentation",
      "Valuation Reports", "Warehouse and Custody Records", "Insurance Information", "Proof-of-Reserves Reports",
      "Smart-Contract Documentation", "Smart-Contract Audit", "Redemption Terms", "Jurisdictional Restrictions",
      "Privacy and Data Protection", "Governance Reports", "Material Events and Announcements",
    ];
    const catIds: Record<string, string> = {};
    cats.forEach((name, i) => {
      const id = uid();
      catIds[name] = id;
      d.prepare("INSERT INTO document_categories (id, name, sort) VALUES (?, ?, ?)").run(id, name, i);
    });

    const docCopper = uid();
    const docNickel = uid();
    d.prepare(
      "INSERT INTO documents (id, category_id, title, file_ref, doc_status, visibility, notes, is_demo) VALUES (?, ?, ?, ?, ?, ?, ?, 1)"
    ).run(
      docCopper, catIds["Certificates of Analysis"],
      "IGAS research Certificate of Analysis No. 0004512 — Ultrafine Copper Powder (owner-supplied reference document)",
      "/lab/igas-copper-0004512.webp", "approved_preview", "public",
      "Owner-supplied reference document. Publication and current verification status remain subject to approval. Redacted areas preserved."
    );
    d.prepare(
      "INSERT INTO documents (id, category_id, title, file_ref, doc_status, visibility, notes, is_demo) VALUES (?, ?, ?, ?, ?, ?, ?, 1)"
    ).run(
      docNickel, catIds["Certificates of Analysis"],
      "IGAS research Certificate of Analysis No. 0004368 — Nickel Wire 0.025 mm (owner-supplied reference document)",
      "/lab/igas-nickel-0004368.webp", "approved_preview", "public",
      "Owner-supplied reference document. Publication and current verification status remain subject to approval. Redacted areas preserved."
    );
    d.prepare(
      "INSERT INTO documents (id, category_id, title, doc_status, visibility, notes, is_demo) VALUES (?, ?, ?, ?, ?, ?, 1)"
    ).run(
      uid(), catIds["Whitepaper"], "ReserveChain Institutional Whitepaper",
      "in_preparation", "pending",
      "Stage 1 draft in preparation. Publication follows completion of the Swiss corporate and issuance structure, legal documentation, asset verification, custody and insurance arrangements, reserve reconciliation and technical implementation."
    );
    for (const cat of ["Corporate Documents", "Token Terms", "Risk Disclosure", "Ownership Documentation", "Valuation Reports", "Warehouse and Custody Records", "Insurance Information", "Proof-of-Reserves Reports", "Smart-Contract Audit", "Redemption Terms"]) {
      d.prepare(
        "INSERT INTO documents (id, category_id, title, doc_status, visibility, notes, is_demo) VALUES (?, ?, ?, ?, ?, ?, 1)"
      ).run(uid(), catIds[cat], `${cat} — pending owner input`, "in_preparation", "pending", "Placeholder category. Content requires owner-supplied or owner-approved documentation.");
    }

    // ---- laboratories -------------------------------------------------------
    const labId = uid();
    d.prepare(
      "INSERT INTO laboratories (id, name, country, publication_status, is_demo) VALUES (?, ?, ?, ?, 1)"
    ).run(labId, "IGAS research — Independent Global Assaying Services (owner-supplied reference)", "Germany", "pending_approval");

    // ---- asset programs -----------------------------------------------------
    const cuProg = uid();
    const niProg = uid();
    d.prepare(
      `INSERT INTO asset_programs (id, code, slug, name, metal, material_form, proposed_purity, program_status, summary, is_demo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`
    ).run(
      cuProg, "CU-PWD-6N", "copper-powder", "Ultra-High-Purity Copper Powder Program", "copper", "powder",
      "99.9999% (proposed program specification)", "in_development",
      "Proposed asset program for ultra-high-purity copper powder, supported by an owner-supplied IGAS research Certificate of Analysis. All ownership, custody, valuation, insurance and reserve information remains pending documentary verification and approval."
    );
    d.prepare(
      `INSERT INTO asset_programs (id, code, slug, name, metal, material_form, proposed_purity, program_status, summary, is_demo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`
    ).run(
      niProg, "NI-WIRE-4N", "nickel-wire", "High-Purity Nickel Wire Program", "nickel", "wire",
      "99.9807% (proposed program specification)", "in_development",
      "Proposed asset program for high-purity nickel wire, supported by an owner-supplied IGAS research Certificate of Analysis. All ownership, custody, valuation, insurance and reserve information remains pending documentary verification and approval."
    );

    // ---- physical assets (illustrative templates) ---------------------------
    const cuAsset = uid();
    const niAsset = uid();
    d.prepare(
      `INSERT INTO physical_assets (id, program_id, identifier, slug, asset_type, title, description, is_demo)
       VALUES (?, ?, ?, ?, ?, ?, ?, 1)`
    ).run(
      cuAsset, cuProg, "TEMPLATE-CU-BATCH", "illustrative-copper", "batch",
      "Illustrative Copper Powder Batch Record",
      "Illustrative template demonstrating the future format of a ReserveChain copper powder batch record. No verified material, ownership document, valuation, custody arrangement, reserve claim or token is represented."
    );
    d.prepare(
      `INSERT INTO physical_assets (id, program_id, identifier, slug, asset_type, title, description, is_demo)
       VALUES (?, ?, ?, ?, ?, ?, ?, 1)`
    ).run(
      niAsset, niProg, "TEMPLATE-NI-COIL", "illustrative-nickel", "coil_lot",
      "Illustrative Nickel Wire Coil Record",
      "Illustrative template demonstrating the future format of a ReserveChain nickel wire coil record. No verified material, ownership document, valuation, custody arrangement, reserve claim or token is represented."
    );

    // ---- demo units ---------------------------------------------------------
    for (let i = 1; i <= 3; i++) {
      d.prepare(
        "INSERT INTO units (id, asset_id, unit_type, unit_code, status, is_demo) VALUES (?, ?, 'container', ?, 'pending', 1)"
      ).run(uid(), cuAsset, `TEMPLATE-CU-CTR-${String(i).padStart(2, "0")}`);
      d.prepare(
        "INSERT INTO units (id, asset_id, unit_type, unit_code, status, is_demo) VALUES (?, ?, 'coil', ?, 'pending', 1)"
      ).run(uid(), niAsset, `TEMPLATE-NI-COIL-${String(i).padStart(2, "0")}`);
    }
    d.prepare(
      "INSERT INTO lots (id, asset_id, lot_number, status, is_demo) VALUES (?, ?, ?, 'pending', 1)"
    ).run(uid(), cuAsset, "TEMPLATE-CU-LOT-01");
    d.prepare(
      "INSERT INTO lots (id, asset_id, lot_number, status, is_demo) VALUES (?, ?, ?, 'pending', 1)"
    ).run(uid(), niAsset, "TEMPLATE-NI-LOT-01");

    // ---- specifications -----------------------------------------------------
    // Values marked with an IGAS source restate the content of the
    // owner-supplied certificates; everything else is Pending — never invented.
    const cuCoA = "IGAS research CoA No. 0004512, 04.07.2022 (owner-supplied; publication subject to approval)";
    const niCoA = "IGAS research CoA No. 0004368, 19.10.2021 (owner-supplied; publication subject to approval)";
    const spec = d.prepare(
      "INSERT INTO asset_specs (id, asset_id, spec_group, label, value, unit, source, sort) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    );
    const cuSpecs: [string, string, string, string | null, string | null][] = [
      ["identity", "Product name", "Ultrafine Copper Powder", null, cuCoA],
      ["identity", "Proposed program specification", "99.9999% purity", null, "Proposed — subject to final approval"],
      ["identity", "Certificate-stated purity", "99,9999% (impurity basis: Al, Cd, Fe, Mg, Mo, Ni, Sb, Ti, Zn; TU 1793-011-50316079-2004)", null, cuCoA],
      ["identity", "Lot / batch (document-stated)", "Lot #03-K-07", null, cuCoA],
      ["chemistry", "Testing methodology", "ICP/OES", null, cuCoA],
      ["chemistry", "Notable measured impurities", "Ag 8 ppm · S 16 ppm · P 5 ppm · As 4 ppm · Pb 1 ppm · Sb 1 ppm (remaining elements <1 or <0.5 ppm)", "ppm", cuCoA],
      ["chemistry", "Isotopic composition", "63Cu 69.1% ±0.05 · 65Cu 30.9% ±0.05 (natural copper)", null, cuCoA],
      ["chemistry", "Radioactivity", "The material is not radioactive (document statement)", null, cuCoA],
      ["chemistry", "Oxygen content", "Pending", null, null],
      ["chemistry", "Moisture content", "Pending", null, null],
      ["physical", "Particle-size distribution", "Pending", null, null],
      ["physical", "Minimum / maximum particle size", "Pending", null, null],
      ["physical", "Average particle size", "Pending", null, null],
      ["physical", "Morphology", "Pending", null, null],
      ["physical", "Apparent density", "Pending", null, null],
      ["physical", "Tap density", "Pending", null, null],
      ["physical", "Flow characteristics", "Pending", null, null],
      ["physical", "Production method", "Pending", null, null],
      ["packaging", "Packaging (document-stated)", "Glass ampoules, packed in cardboard boxes", null, cuCoA],
      ["packaging", "Quantity (document-stated)", "2000 kg — net weight according to data supplied by customer; not independently verified", "kg", cuCoA],
      ["packaging", "Container type / count", "Pending", null, null],
      ["packaging", "Net weight per container", "Pending", null, null],
      ["packaging", "Seal numbers", "Pending", null, null],
      ["packaging", "Storage requirements", "Pending", null, null],
      ["packaging", "Handling requirements", "Pending", null, null],
      ["packaging", "Safety documentation", "Pending", null, null],
      ["provenance", "Sampling (document-stated)", "10 g sample taken by IGAS research at ProSafe in Magdeburg on 01.07.2022, Box no. 20", null, cuCoA],
      ["provenance", "Country of origin", "Pending", null, null],
      ["provenance", "Ownership evidence", "Pending", null, null],
      ["provenance", "Warehouse / custody receipt", "Pending", null, null],
      ["provenance", "Valuation history", "Pending", null, null],
      ["provenance", "Proposed token program", "Pending — no token issued", null, null],
      ["provenance", "Container-level redemption", "Inactive — proposed framework only", null, null],
    ];
    cuSpecs.forEach(([g, l, v, u, s], i) => spec.run(uid(), cuAsset, g, l, v, u, s, i));

    const niSpecs: [string, string, string, string | null, string | null][] = [
      ["identity", "Product name", "Nickel wire 0,025 mm dia, DKRNT NP1", null, niCoA],
      ["identity", "Proposed program specification", "99.9807% purity", null, "Proposed — subject to final approval"],
      ["identity", "Certificate-stated purity", "99,9807% (impurities acc. GOST 2179-75: As, Cu, Fe, Mn, Pb, Si = 0.0193% by weight)", null, niCoA],
      ["identity", "Lot (document-stated)", "Lot “120/NP1”", null, niCoA],
      ["chemistry", "Testing methodology", "ICP/MS and ICP/OES", null, niCoA],
      ["chemistry", "Notable measured impurities", "Ti 227 ppm · Fe 116 ppm · Cu 45 ppm · Co 41 ppm · K 41 ppm · As 13 ppm · Si 13 ppm", "ppm", niCoA],
      ["chemistry", "Radioactivity", "The material is not radioactive (document statement)", null, niCoA],
      ["physical", "Wire diameter (document-stated)", "0.025 mm", "mm", niCoA],
      ["physical", "Gauge", "Pending", null, null],
      ["physical", "Diameter tolerance", "Pending", null, null],
      ["physical", "Coil length", "Pending", null, null],
      ["physical", "Net coil weight", "Pending", null, null],
      ["physical", "Surface finish", "Pending", null, null],
      ["physical", "Temper / material condition", "Pending", null, null],
      ["physical", "Tensile strength", "Pending", null, null],
      ["physical", "Elongation", "Pending", null, null],
      ["physical", "Electrical / thermal characteristics", "Pending", null, null],
      ["packaging", "Total net weight (document-stated)", "5000 g — 30 bobbins in 1 box; net weight according to information given by customer; not independently verified", "g", niCoA],
      ["packaging", "Coil identification numbers", "Pending", null, null],
      ["packaging", "Packaging method", "Pending", null, null],
      ["packaging", "Seal numbers", "Pending", null, null],
      ["packaging", "Storage requirements", "Pending", null, null],
      ["packaging", "Handling requirements", "Pending", null, null],
      ["provenance", "Sampling (document-stated)", "0.8 g sample taken from bobbins no. 8, 10, 19, 27 by IGAS research on 14.10.2021 in Goslar", null, niCoA],
      ["provenance", "Country of origin", "Pending", null, null],
      ["provenance", "Ownership evidence", "Pending", null, null],
      ["provenance", "Warehouse / custody receipt", "Pending", null, null],
      ["provenance", "Valuation history", "Pending", null, null],
      ["provenance", "Proposed token program", "Pending — no token issued", null, null],
      ["provenance", "Coil-level redemption", "Inactive — proposed framework only", null, null],
    ];
    niSpecs.forEach(([g, l, v, u, s], i) => spec.run(uid(), niAsset, g, l, v, u, s, i));

    // ---- lab reports & pending supporting records ---------------------------
    d.prepare(
      "INSERT INTO laboratory_reports (id, asset_id, laboratory_id, report_number, report_date, methodology, stated_purity, document_id, publication_status, is_demo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending_approval', 1)"
    ).run(uid(), cuAsset, labId, "0004512", "2022-07-04", "ICP/OES", "99,9999%", docCopper);
    d.prepare(
      "INSERT INTO laboratory_reports (id, asset_id, laboratory_id, report_number, report_date, methodology, stated_purity, document_id, publication_status, is_demo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending_approval', 1)"
    ).run(uid(), niAsset, labId, "0004368", "2021-10-19", "ICP/MS and ICP/OES", "99,9807%", docNickel);

    for (const asset of [cuAsset, niAsset]) {
      d.prepare("INSERT INTO ownership_records (id, asset_id, holder, status, is_demo) VALUES (?, ?, 'Pending owner documentation', 'pending', 1)").run(uid(), asset);
      d.prepare("INSERT INTO custody_records (id, asset_id, custodian, location, status, is_demo) VALUES (?, ?, 'Pending — custody structure in development', 'Pending', 'pending', 1)").run(uid(), asset);
      d.prepare("INSERT INTO insurance_records (id, asset_id, provider, coverage, status, is_demo) VALUES (?, ?, 'Pending', 'Pending', 'pending', 1)").run(uid(), asset);
      d.prepare("INSERT INTO valuations (id, asset_id, valuer, methodology, status, is_demo) VALUES (?, ?, 'Pending independent valuation', 'Pending', 'pending', 1)").run(uid(), asset);
      d.prepare("INSERT INTO warehouse_receipts (id, asset_id, receipt_number, status, is_demo) VALUES (?, ?, 'Pending', 'pending', 1)").run(uid(), asset);
    }

    // ---- token programs (pending, unpublished) ------------------------------
    d.prepare(
      "INSERT INTO token_programs (id, program_id, name, symbol, decimals, status, is_demo) VALUES (?, ?, 'Pending final authorization', NULL, NULL, 'pending', 1)"
    ).run(uid(), cuProg);
    d.prepare(
      "INSERT INTO token_programs (id, program_id, name, symbol, decimals, status, is_demo) VALUES (?, ?, 'Pending final authorization', NULL, NULL, 'pending', 1)"
    ).run(uid(), niProg);

    // ---- reserve report placeholder (inactive) ------------------------------
    d.prepare(
      "INSERT INTO reserve_reports (id, program_id, period, status, publication_status, is_demo) VALUES (?, NULL, 'Module prepared — reporting inactive', 'inactive', 'unpublished', 1)"
    ).run(uid());

    // ---- passports ----------------------------------------------------------
    const cuPass = uid();
    const niPass = uid();
    d.prepare(
      "INSERT INTO passport_records (id, asset_id, passport_code, slug, is_demo) VALUES (?, ?, 'DAP-TEMPLATE-CU-BATCH', 'illustrative-copper', 1)"
    ).run(cuPass, cuAsset);
    d.prepare(
      "INSERT INTO passport_records (id, asset_id, passport_code, slug, is_demo) VALUES (?, ?, 'DAP-TEMPLATE-NI-COIL', 'illustrative-nickel', 1)"
    ).run(niPass, niAsset);

    const ev = d.prepare(
      "INSERT INTO passport_events (id, passport_id, event_type, label, detail, status, sort) VALUES (?, ?, ?, ?, ?, ?, ?)"
    );
    for (const [pass, coa] of [[cuPass, "IGAS CoA 0004512 registered as owner-supplied reference document"], [niPass, "IGAS CoA 0004368 registered as owner-supplied reference document"]] as const) {
      const events: [string, string, string, string][] = [
        ["record_created", "Illustrative passport record created", "Template record created for demonstration. is_demo = true.", "recorded"],
        ["document_registered", "Laboratory reference document registered", coa + ". Publication and current verification status remain subject to approval.", "recorded"],
        ["ownership", "Ownership documentation", "Awaiting owner-supplied title and acquisition documents.", "pending"],
        ["custody", "Custody and warehouse documentation", "Custody structure in development. No custodian confirmed.", "pending"],
        ["valuation", "Independent valuation", "Awaiting appointment of independent valuer.", "pending"],
        ["insurance", "Insurance arrangements", "Subject to final insurance arrangements.", "pending"],
        ["reserve", "Reserve reconciliation", "Inactive until approved asset, custody, supply and attestation data exist.", "inactive"],
        ["tokenization", "Tokenization", "Not issued. ERC-20 architecture in development; no contract published.", "inactive"],
        ["redemption", "Physical redemption", "Inactive. Proposed framework subject to final legal and custody arrangements.", "inactive"],
      ];
      events.forEach(([t, l, det, st], i) => ev.run(uid(), pass, t, l, det, st, i));
    }
    for (const [pass] of [[cuPass], [niPass]] as const) {
      d.prepare(
        "INSERT INTO passport_versions (id, passport_id, version, snapshot) VALUES (?, ?, 1, ?)"
      ).run(uid(), pass, JSON.stringify({ note: "Initial illustrative template version" }));
    }

    // ---- jurisdiction rules -------------------------------------------------
    const restricted = [
      ["AT","Austria"],["BE","Belgium"],["BG","Bulgaria"],["HR","Croatia"],["CY","Cyprus"],["CZ","Czechia"],
      ["DK","Denmark"],["EE","Estonia"],["FI","Finland"],["FR","France"],["DE","Germany"],["GR","Greece"],
      ["HU","Hungary"],["IE","Ireland"],["IT","Italy"],["LV","Latvia"],["LT","Lithuania"],["LU","Luxembourg"],
      ["MT","Malta"],["NL","Netherlands"],["PL","Poland"],["PT","Portugal"],["RO","Romania"],["SK","Slovakia"],
      ["SI","Slovenia"],["ES","Spain"],["SE","Sweden"],["IS","Iceland"],["LI","Liechtenstein"],["NO","Norway"],
    ];
    for (const [code, name] of restricted) {
      d.prepare(
        "INSERT INTO jurisdiction_rules (id, country_code, country_name, classification, notes) VALUES (?, ?, ?, 'restricted', ?)"
      ).run(uid(), code, name, "EU/EEA: ReserveChain currently does not intend to offer tokens to residents or persons located in the EU/EEA. Subject to final legal approval.");
    }
    d.prepare(
      "INSERT INTO jurisdiction_rules (id, country_code, country_name, classification, notes) VALUES (?, 'CH', 'Switzerland', 'pending_legal_review', 'Issuer home jurisdiction; final rules subject to professional legal review.')"
    ).run(uid());

    // ---- CMS workflow demonstration pages -----------------------------------
    const pages: [string, string, string][] = [
      ["draft", "corporate-development-status-update", "Corporate Development Status Update (Draft)"],
      ["under_review", "custody-framework-note", "Proposed Custody Framework Note (Under Review)"],
      ["approved", "verification-framework-overview", "Verification Framework Overview (Approved)"],
      ["published", "project-overview-summary", "Project Overview Summary"],
    ];
    for (const [status, slug, title] of pages) {
      const pid = uid();
      d.prepare(
        "INSERT INTO content_pages (id, slug, title, status, body, created_by) VALUES (?, ?, ?, ?, ?, ?)"
      ).run(pid, slug, title, status, `Demonstration content for the ${status} publication state.`, adminId);
      d.prepare(
        "INSERT INTO content_versions (id, page_id, version, body, status_at_capture, captured_by) VALUES (?, ?, 1, ?, ?, ?)"
      ).run(uid(), pid, "Initial version", status, adminId);
    }

    // ---- audit genesis ------------------------------------------------------
    appendAudit(d, {
      actor: "system:seed",
      action: "database.seeded",
      entity: "system",
      reason: "Initial controlled demonstration data seeded. All registry records carry is_demo = true.",
    });
    appendAudit(d, {
      actor: "system:seed",
      action: "website_mode.set",
      entity: "website_modes",
      newValue: { mode: "pre-launch", active: true },
      reason: "Prelaunch information platform is the only permitted public mode without written authorization.",
    });
  });
  tx();
}
