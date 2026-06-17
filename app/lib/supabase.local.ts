/**
 * Local PostgreSQL adapter — mirrors the Supabase JS client query-builder API
 * so all existing server-side db files work without any changes.
 *
 * Supports:
 *   .from(table)
 *   .select(cols?)
 *   .insert(rows, opts?)      → { data, error }
 *   .update(patch)            → { data, error }
 *   .upsert(rows, opts?)      → { data, error }
 *   .delete()                 → { data, error }
 *   .eq(col, val)
 *   .not(col, 'in', csvList)
 *   .order(col, {ascending})
 *   .single()
 *
 * Returns the same { data, error } shape as the real client.
 */
import { Pool } from "pg";

const pool = new Pool({
  host:     process.env.PG_HOST     || "127.0.0.1",
  port:     Number(process.env.PG_PORT || 5432),
  database: process.env.PG_DATABASE || "airdrop_local",
  user:     process.env.PG_USER     || "airdrop_user",
  password: process.env.PG_PASSWORD || "airdrop_pass",
});

type Row = Record<string, unknown>;

type Op =
  | { kind: "select"; cols: string }
  | { kind: "insert"; rows: Row[]; returning: boolean; upsert?: string }
  | { kind: "update"; patch: Row; returning: boolean }
  | { kind: "delete" };

interface WhereClause { col: string; op: "eq" | "not_in"; val: unknown }
interface OrderClause { col: string; asc: boolean }

class QueryBuilder {
  private _table: string;
  private _op: Op | null = null;
  private _where: WhereClause[] = [];
  private _order: OrderClause[] = [];
  private _single = false;

  constructor(table: string) { this._table = table; }

  // ── Terminals that set the operation ────────────────────────────

  select(cols = "*"): this { this._op = { kind: "select", cols }; return this; }

  insert(rows: Row | Row[], opts?: { returning?: boolean }): this {
    const arr = Array.isArray(rows) ? rows : [rows];
    this._op = { kind: "insert", rows: arr, returning: opts?.returning !== false };
    return this;
  }

  upsert(rows: Row | Row[], opts?: { onConflict?: string }): this {
    const arr = Array.isArray(rows) ? rows : [rows];
    this._op = { kind: "insert", rows: arr, returning: true, upsert: opts?.onConflict };
    return this;
  }

  update(patch: Row): this { this._op = { kind: "update", patch, returning: true }; return this; }

  delete(): this { this._op = { kind: "delete" }; return this; }

  // ── Filters ─────────────────────────────────────────────────────

  eq(col: string, val: unknown): this { this._where.push({ col, op: "eq", val }); return this; }

  not(col: string, op: string, val: unknown): this {
    if (op === "in") this._where.push({ col, op: "not_in", val });
    return this;
  }

  // ── Modifiers ───────────────────────────────────────────────────

  order(col: string, opts?: { ascending?: boolean }): this {
    this._order.push({ col, asc: opts?.ascending !== false });
    return this;
  }

  single(): this { this._single = true; return this; }

  // ── Execute (thenable) ──────────────────────────────────────────

  then(resolve: (v: { data: unknown; error: Error | null }) => void, reject?: (e: unknown) => void): void {
    this._run().then(resolve, reject);
  }

  private async _run(): Promise<{ data: unknown; error: Error | null }> {
    try {
      const result = await this._execute();
      return { data: result, error: null };
    } catch (e) {
      return { data: null, error: e instanceof Error ? e : new Error(String(e)) };
    }
  }

  private async _execute(): Promise<unknown> {
    const op = this._op;
    if (!op) throw new Error("No operation set on QueryBuilder");

    if (op.kind === "select") return this._execSelect(op.cols);
    if (op.kind === "insert") return this._execInsert(op.rows, op.returning, op.upsert);
    if (op.kind === "update") return this._execUpdate(op.patch, op.returning);
    if (op.kind === "delete") return this._execDelete();
    throw new Error(`Unknown op: ${(op as { kind: string }).kind}`);
  }

  // ── SELECT ──────────────────────────────────────────────────────
  private async _execSelect(cols: string): Promise<unknown> {
    const { text, params } = this._buildWhere(1);
    const orderSql = this._order.map(o => `"${o.col}" ${o.asc ? "ASC" : "DESC"}`).join(", ");
    const sql = `SELECT ${cols === "*" ? "*" : cols} FROM "${this._table}"${text ? " WHERE " + text : ""}${orderSql ? " ORDER BY " + orderSql : ""}`;
    const res = await pool.query(sql, params);
    if (this._single) {
      if (res.rows.length === 0) throw Object.assign(new Error("Row not found"), { code: "PGRST116" });
      return res.rows[0];
    }
    return res.rows;
  }

  // ── INSERT ──────────────────────────────────────────────────────
  private async _execInsert(rows: Row[], returning: boolean, upsertConflict?: string): Promise<unknown> {
    if (rows.length === 0) return this._single ? null : [];
    const keys = Object.keys(rows[0]).filter(k => k !== "undefined");
    const cols = keys.map(k => `"${k}"`).join(", ");
    const params: unknown[] = [];
    const rowPlaceholders = rows.map(row => {
      const placeholders = keys.map(k => {
        params.push(this._toDb(row[k]));
        return `$${params.length}`;
      });
      return `(${placeholders.join(", ")})`;
    }).join(", ");

    let sql = `INSERT INTO "${this._table}" (${cols}) VALUES ${rowPlaceholders}`;

    if (upsertConflict) {
      const updateCols = keys.filter(k => !upsertConflict.split(",").map(c => c.trim()).includes(k));
      const updateSet = updateCols.map(k => `"${k}" = EXCLUDED."${k}"`).join(", ");
      sql += ` ON CONFLICT (${upsertConflict.split(",").map(c => `"${c.trim()}"`).join(", ")}) DO UPDATE SET ${updateSet}`;
    }

    if (returning) sql += " RETURNING *";
    const res = await pool.query(sql, params);
    if (!returning) return this._single ? null : [];
    if (this._single) return res.rows[0] ?? null;
    return res.rows;
  }

  // ── UPDATE ──────────────────────────────────────────────────────
  private async _execUpdate(patch: Row, returning: boolean): Promise<unknown> {
    const keys = Object.keys(patch).filter(k => k !== "id" && k !== "undefined");
    const params: unknown[] = [];
    const setClause = keys.map(k => {
      params.push(this._toDb(patch[k]));
      return `"${k}" = $${params.length}`;
    }).join(", ");
    const { text: whereText, params: whereParams } = this._buildWhere(params.length + 1);
    params.push(...whereParams);
    let sql = `UPDATE "${this._table}" SET ${setClause}${whereText ? " WHERE " + whereText : ""}`;
    if (returning) sql += " RETURNING *";
    const res = await pool.query(sql, params);
    if (this._single) return res.rows[0] ?? null;
    return res.rows;
  }

  // ── DELETE ──────────────────────────────────────────────────────
  private async _execDelete(): Promise<unknown> {
    const { text, params } = this._buildWhere(1);
    const sql = `DELETE FROM "${this._table}"${text ? " WHERE " + text : ""}`;
    await pool.query(sql, params);
    return null;
  }

  // ── WHERE builder ────────────────────────────────────────────────
  private _buildWhere(startIdx: number): { text: string; params: unknown[] } {
    const parts: string[] = [];
    const params: unknown[] = [];
    let idx = startIdx;
    for (const w of this._where) {
      if (w.op === "eq") {
        params.push(w.val);
        parts.push(`"${w.col}" = $${idx++}`);
      } else if (w.op === "not_in") {
        // val is a raw SQL string like "('a','b')" from the original code
        // just pass it through as-is (values are already quoted by caller)
        parts.push(`"${w.col}" NOT IN ${w.val}`);
      }
    }
    return { text: parts.join(" AND "), params };
  }

  // ── Type coercion for pg ─────────────────────────────────────────
  private _toDb(val: unknown): unknown {
    if (val === undefined) return null;
    if (Array.isArray(val)) return val; // pg handles arrays natively
    return val;
  }
}

/** Drop-in replacement for `createClient(url, key).from(table)` */
export const supabase = {
  from: (table: string) => new QueryBuilder(table),
};
