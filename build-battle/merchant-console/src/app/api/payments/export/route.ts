import { filterPayments, parseFilters, sortPayments } from "@/data/queries"
import {
  exportFilename,
  parseExportColumns,
  parseExportScope,
  toCsv,
} from "@/lib/csv"
import { NextRequest } from "next/server"

/**
 * Exports the payments table as CSV (NWP-101).
 *
 *   ?columns=id,amount,...   allowlisted, in the order given; defaults omit last4
 *   ?scope=filter|all        "filter" (default) honors the active filters
 *
 * Rows always come from the shared query builder, never from the browser,
 * so the export covers every matching row and not just the visible page.
 */
export function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams

  const columns = parseExportColumns(params.get("columns"))
  if (!columns.ok) return badRequest(columns.error)

  const scope = parseExportScope(params.get("scope"))
  if (!scope.ok) return badRequest(scope.error)

  const filters =
    scope.value === "all"
      ? parseFilters(new URLSearchParams())
      : parseFilters(params)

  const rows = sortPayments(
    filterPayments(filters),
    filters.sort,
    filters.direction,
  )

  // filters.status has already been through parseFilters' allowlist.
  const label =
    scope.value === "all"
      ? "all"
      : filters.status && filters.status !== "all"
        ? filters.status
        : "filtered"

  return new Response(toCsv(rows, columns.value), {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="${exportFilename(new Date(), label)}"`,
    },
  })
}

function badRequest(message: string) {
  return Response.json({ error: message }, { status: 400 })
}
