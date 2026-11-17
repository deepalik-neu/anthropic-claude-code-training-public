"use client"

import { Button } from "@/components/Button"
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/Drawer"
import {
  DEFAULT_EXPORT_COLUMNS,
  EXPORT_COLUMN_LABELS,
  EXPORT_COLUMNS,
  ExportColumn,
  ExportScope,
} from "@/lib/csv"
import { Download } from "lucide-react"
import { useState } from "react"

/**
 * Export options for /payments (NWP-101). The browser only builds the URL;
 * the route handler validates it and builds the file from the query builder,
 * so every matching row is exported, not just the visible page.
 */
export function ExportDialog({
  query,
  filteredCount,
  allCount,
}: {
  /** The page's current filter query string, without a leading "?". */
  query: string
  filteredCount: number
  allCount: number
}) {
  const [columns, setColumns] = useState<ExportColumn[]>([...DEFAULT_EXPORT_COLUMNS])
  const [scope, setScope] = useState<ExportScope>("filter")

  const toggle = (column: ExportColumn) =>
    setColumns((current) =>
      current.includes(column)
        ? current.filter((c) => c !== column)
        : EXPORT_COLUMNS.filter((c) => c === column || current.includes(c)),
    )

  const rowCount = scope === "all" ? allCount : filteredCount

  const params = new URLSearchParams(scope === "all" ? "" : query)
  params.delete("page")
  params.set("scope", scope)
  params.set("columns", columns.join(","))
  const href = `/api/payments/export?${params.toString()}`

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="secondary" className="w-full gap-2 py-1.5 sm:w-fit">
          <Download
            className="-ml-0.5 size-4 shrink-0 text-gray-400 dark:text-gray-600"
            aria-hidden="true"
          />
          Export
        </Button>
      </DrawerTrigger>
      <DrawerContent className="sm:max-w-md">
        <DrawerHeader>
          <DrawerTitle>Export payments</DrawerTitle>
          <DrawerDescription>
            Choose what goes in the CSV before you download it.
          </DrawerDescription>
        </DrawerHeader>

        <DrawerBody className="space-y-6">
          <fieldset>
            <legend className="text-sm font-medium text-gray-900 dark:text-gray-50">
              Scope
            </legend>
            <div className="mt-2 space-y-2">
              {(
                [
                  ["filter", "Current filter", filteredCount],
                  ["all", "All payments", allCount],
                ] as const
              ).map(([value, label, count]) => (
                <label
                  key={value}
                  className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  <input
                    type="radio"
                    name="export-scope"
                    value={value}
                    checked={scope === value}
                    onChange={() => setScope(value)}
                    className="size-4 accent-blue-600"
                  />
                  {label}
                  <span className="text-gray-500 tabular-nums">
                    ({count.toLocaleString()})
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-sm font-medium text-gray-900 dark:text-gray-50">
              Columns
            </legend>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {EXPORT_COLUMNS.map((column) => (
                <label
                  key={column}
                  className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  <input
                    type="checkbox"
                    checked={columns.includes(column)}
                    onChange={() => toggle(column)}
                    className="size-4 accent-blue-600"
                  />
                  {EXPORT_COLUMN_LABELS[column]}
                </label>
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Card last four is off by default. Turn it on only for internal files.
            </p>
          </fieldset>

          <p
            className="text-sm text-gray-700 dark:text-gray-300"
            aria-live="polite"
          >
            {columns.length === 0
              ? "Choose at least one column to export."
              : `${rowCount.toLocaleString()} ${rowCount === 1 ? "row" : "rows"} will be exported.`}
          </p>
        </DrawerBody>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="secondary" className="mt-2 w-full sm:mt-0 sm:w-fit">
              Cancel
            </Button>
          </DrawerClose>
          {columns.length === 0 ? (
            <Button disabled className="w-full sm:w-fit">
              Download CSV
            </Button>
          ) : (
            <Button asChild className="w-full sm:w-fit">
              <a href={href} download>
                Download CSV
              </a>
            </Button>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
