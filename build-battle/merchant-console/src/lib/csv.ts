import { merchantById } from "@/data/merchants"
import { Payment } from "@/data/types"
import { formatMoney } from "./money"

/**
 * CSV export for the payments table.
 *
 * Ops chooses the columns and the scope (NWP-101). Column names arrive from
 * the client, so they are checked against EXPORT_COLUMNS here before they
 * reach the serializer. The card last four is opt-in.
 */

export const EXPORT_COLUMNS = [
  "id",
  "created_at",
  "merchant",
  "description",
  "status",
  "method",
  "card_brand",
  "last4",
  "amount",
  "currency",
] as const

export type ExportColumn = (typeof EXPORT_COLUMNS)[number]

/** What a file gets when nobody chose: everything except the card last four. */
export const DEFAULT_EXPORT_COLUMNS: readonly ExportColumn[] = EXPORT_COLUMNS.filter(
  (column) => column !== "last4",
)

export const EXPORT_COLUMN_LABELS: Record<ExportColumn, string> = {
  id: "Payment ID",
  created_at: "Created (UTC)",
  merchant: "Merchant",
  description: "Description",
  status: "Status",
  method: "Method",
  card_brand: "Card brand",
  last4: "Card last four",
  amount: "Amount",
  currency: "Currency",
}

export const EXPORT_SCOPES = ["filter", "all"] as const
export type ExportScope = (typeof EXPORT_SCOPES)[number]

type Parsed<T> = { ok: true; value: T } | { ok: false; error: string }

/**
 * Validates the `columns` query param against the allowlist.
 * Missing means the defaults; present but empty is rejected, never an empty file.
 * Requested order is kept and duplicates are dropped.
 */
export function parseExportColumns(raw: string | null): Parsed<ExportColumn[]> {
  if (raw === null) return { ok: true, value: [...DEFAULT_EXPORT_COLUMNS] }

  const requested = raw
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean)
  if (requested.length === 0) {
    return { ok: false, error: "Choose at least one column to export." }
  }

  const columns: ExportColumn[] = []
  for (const name of requested) {
    if (!EXPORT_COLUMNS.includes(name as ExportColumn)) {
      return { ok: false, error: `Unknown export column: ${name.slice(0, 40)}` }
    }
    if (!columns.includes(name as ExportColumn)) columns.push(name as ExportColumn)
  }
  return { ok: true, value: columns }
}

/** Validates the `scope` query param. Missing means the current filter. */
export function parseExportScope(raw: string | null): Parsed<ExportScope> {
  if (raw === null) return { ok: true, value: "filter" }
  if (EXPORT_SCOPES.includes(raw as ExportScope)) {
    return { ok: true, value: raw as ExportScope }
  }
  return { ok: false, error: "Scope must be \"filter\" or \"all\"." }
}

function escapeCell(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`
  return value
}

function cell(payment: Payment, column: ExportColumn): string {
  switch (column) {
    case "id":
      return payment.id
    case "created_at":
      return payment.createdAt
    case "merchant":
      return merchantById(payment.merchantId)?.name ?? payment.merchantId
    case "description":
      return payment.description
    case "status":
      return payment.status
    case "method":
      return payment.method
    case "card_brand":
      return payment.cardBrand ?? ""
    case "last4":
      return payment.last4 ?? ""
    case "amount":
      return formatMoney(payment.amount, payment.currency)
    case "currency":
      return payment.currency
  }
}

export function toCsv(
  payments: Payment[],
  columns: readonly ExportColumn[] = EXPORT_COLUMNS,
): string {
  const header = columns.join(",")
  const rows = payments.map((payment) =>
    columns.map((column) => escapeCell(cell(payment, column))).join(","),
  )
  return [header, ...rows].join("\n")
}

/**
 * `payments-<label>-YYYY-MM-DD.csv`, dated in UTC. The label must come from
 * an allowlist (a scope or a validated status), never raw client input.
 */
export function exportFilename(date = new Date(), label?: string): string {
  const day = date.toISOString().slice(0, 10)
  return label ? `payments-${label}-${day}.csv` : `payments-${day}.csv`
}
