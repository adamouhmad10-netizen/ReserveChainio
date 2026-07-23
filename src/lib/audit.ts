import type Database from "better-sqlite3";
import { createHash, randomUUID } from "node:crypto";

// Append-only, hash-chained administrative audit trail. Each entry commits to
// the previous entry's hash; verifyChain() recomputes the chain end-to-end.
// This is a database-level tamper-evidence mechanism, not an on-chain record.

export interface AuditInput {
  actor: string;
  action: string;
  entity: string;
  recordId?: string;
  previousValue?: unknown;
  newValue?: unknown;
  reason?: string;
  requestMeta?: Record<string, unknown>;
}

function entryHash(payload: {
  id: string;
  actor: string;
  action: string;
  entity: string;
  recordId: string | null;
  previousValue: string | null;
  newValue: string | null;
  reason: string | null;
  occurredAt: string;
  prevHash: string;
}): string {
  return createHash("sha256").update(JSON.stringify(payload)).digest("hex");
}

export function appendAudit(d: Database.Database, input: AuditInput) {
  const insert = d.transaction(() => {
    const last = d
      .prepare("SELECT hash FROM audit_entries ORDER BY seq DESC LIMIT 1")
      .get() as { hash: string } | undefined;
    const prevHash = last?.hash ?? "GENESIS";
    const id = randomUUID();
    const occurredAt = new Date().toISOString();
    const row = {
      id,
      actor: input.actor,
      action: input.action,
      entity: input.entity,
      recordId: input.recordId ?? null,
      previousValue: input.previousValue != null ? JSON.stringify(input.previousValue) : null,
      newValue: input.newValue != null ? JSON.stringify(input.newValue) : null,
      reason: input.reason ?? null,
      occurredAt,
      prevHash,
    };
    const hash = entryHash(row);
    d.prepare(
      `INSERT INTO audit_entries (id, actor, action, entity, record_id, previous_value, new_value, reason, request_meta, occurred_at, prev_hash, hash)
       VALUES (@id, @actor, @action, @entity, @recordId, @previousValue, @newValue, @reason, @requestMeta, @occurredAt, @prevHash, @hash)`
    ).run({
      ...row,
      requestMeta: input.requestMeta ? JSON.stringify(input.requestMeta) : null,
      hash,
    });
    return { id, hash };
  });
  return insert();
}

export interface ChainVerification {
  ok: boolean;
  checked: number;
  firstBrokenSeq: number | null;
}

export function verifyChain(d: Database.Database): ChainVerification {
  const rows = d
    .prepare(
      `SELECT seq, id, actor, action, entity, record_id, previous_value, new_value, reason, occurred_at, prev_hash, hash
       FROM audit_entries ORDER BY seq ASC`
    )
    .all() as {
    seq: number; id: string; actor: string; action: string; entity: string;
    record_id: string | null; previous_value: string | null; new_value: string | null;
    reason: string | null; occurred_at: string; prev_hash: string; hash: string;
  }[];
  let expectedPrev = "GENESIS";
  for (const r of rows) {
    const recomputed = entryHash({
      id: r.id,
      actor: r.actor,
      action: r.action,
      entity: r.entity,
      recordId: r.record_id,
      previousValue: r.previous_value,
      newValue: r.new_value,
      reason: r.reason,
      occurredAt: r.occurred_at,
      prevHash: r.prev_hash,
    });
    if (r.prev_hash !== expectedPrev || recomputed !== r.hash) {
      return { ok: false, checked: rows.length, firstBrokenSeq: r.seq };
    }
    expectedPrev = r.hash;
  }
  return { ok: true, checked: rows.length, firstBrokenSeq: null };
}
