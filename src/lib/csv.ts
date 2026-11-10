export function downloadCsv(name: string, rows: Record<string, unknown>[]) {
  const keys = Object.keys(rows[0] ?? {});
  const body = [keys.join(","), ...rows.map((r) => keys.map((k) => JSON.stringify(r[k] ?? "")).join(","))].join("\n");
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([body], { type: "text/csv" })); a.download = name; a.click();
}
