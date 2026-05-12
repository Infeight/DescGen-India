"use client";

import { useState, useRef } from "react";
import Papa from "papaparse";

interface CSVRow {
  productName: string;
  features: string;
  platform: string;
  tone: string;
  language: string;
}

interface ResultRow {
  productName: string;
  platform: string;
  status: "pending" | "success" | "failed";
  error?: string;
  v1?: string;
  v2?: string;
  v3?: string;
}

type VariantKey = "v1" | "v2" | "v3";

const VARIANT_LABELS: Record<VariantKey, string> = {
  v1: "Emotional",
  v2: "Features",
  v3: "Punchy",
};

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// ── Process rows in parallel batches of 5 ─────────────────────────────────
async function processBatch(
  rows: CSVRow[],
  onRowComplete: (index: number, result: ResultRow) => void
): Promise<ResultRow[]> {
  const BATCH_SIZE = 5;
  const results: ResultRow[] = rows.map((r) => ({
    productName: r.productName,
    platform: r.platform,
    status: "pending",
  }));

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);

    // all rows in a batch run in parallel
    await Promise.all(
      batch.map(async (row, batchIndex) => {
        const globalIndex = i + batchIndex;
        try {
          const res = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              productName: row.productName,
              features:    row.features,
              platform:    row.platform,
              tone:        row.tone,
              language:    row.language,
            }),
          });

          const data = await res.json();

          if (!res.ok) {
            results[globalIndex] = {
              productName: row.productName,
              platform:    row.platform,
              status:      "failed",
              error:       data.error || "Generation failed",
            };
          } else {
            results[globalIndex] = {
              productName: row.productName,
              platform:    row.platform,
              status:      "success",
              v1: data.v1,
              v2: data.v2,
              v3: data.v3,
            };
          }
        } catch {
          results[globalIndex] = {
            productName: row.productName,
            platform:    row.platform,
            status:      "failed",
            error:       "Network error",
          };
        }

        // update UI as each row completes (not waiting for whole batch)
        onRowComplete(globalIndex, results[globalIndex]);
      })
    );

    // 1.2s delay between batches to respect Gemini rate limit
    if (i + BATCH_SIZE < rows.length) {
      await sleep(1200);
    }
  }

  return results;
}

// ── Copy button ───────────────────────────────────────────────────────────────
function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button
      onClick={copy}
      className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs
                 font-medium text-gray-600 transition hover:bg-gray-50 active:scale-95"
    >
      {copied ? "Copied!" : `Copy ${label}`}
    </button>
  );
}

// ── Result card ───────────────────────────────────────────────────────────────
function ResultCard({
  item,
  index,
  csvRows,
  onRegenerate,
  regenerating,
}: {
  item: ResultRow;
  index: number;
  csvRows: CSVRow[];
  onRegenerate: (index: number, variant?: VariantKey) => void;
  regenerating: string | null; // "index" or "index-v1" etc
}) {
  const [expanded, setExpanded] = useState(true);
  const isFullRegen   = regenerating === `${index}`;
  const isPending     = item.status === "pending";
  const isFailed      = item.status === "failed";

  return (
    <div className={`rounded-xl border bg-white transition
      ${isPending ? "opacity-60" : ""}
      ${isFailed  ? "border-red-100" : "border-gray-100"}`}>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <span className={`h-2 w-2 rounded-full flex-shrink-0
            ${isPending ? "bg-gray-300 animate-pulse" :
              isFailed  ? "bg-red-400" : "bg-green-400"}`} />
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {item.productName}
            </p>
            <p className="text-xs text-gray-400">{item.platform}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Full regenerate */}
          {(item.status === "success" || item.status === "failed") && (
            <button
              onClick={() => onRegenerate(index)}
              disabled={!!regenerating}
              className="rounded-lg border border-gray-200 px-3 py-1 text-xs
                         font-medium text-gray-600 transition hover:bg-gray-50
                         disabled:opacity-40 active:scale-95"
            >
              {isFullRegen ? "Redoing..." : "↺ Redo All"}
            </button>
          )}

          {/* Expand/collapse */}
          {item.status === "success" && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="rounded-lg border border-gray-200 p-1.5 text-gray-400
                         hover:text-gray-700 transition"
            >
              <svg className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`}
                fill="none" viewBox="0 0 16 16">
                <path d="M4 6l4 4 4-4" stroke="currentColor"
                  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Pending shimmer */}
      {isPending && (
        <div className="px-4 pb-4 space-y-2 animate-pulse">
          <div className="h-3 w-full rounded bg-gray-100" />
          <div className="h-3 w-4/5 rounded bg-gray-100" />
        </div>
      )}

      {/* Error */}
      {isFailed && (
        <div className="px-4 pb-4">
          <p className="text-xs text-red-500">{item.error || "Generation failed"}</p>
        </div>
      )}

      {/* Variants */}
      {item.status === "success" && expanded && (
        <div className="border-t border-gray-100 px-4 pb-4 pt-3 flex flex-col gap-3">
          {(["v1", "v2", "v3"] as VariantKey[]).map((vk) => {
            const isVarRegen = regenerating === `${index}-${vk}`;
            return (
              <div key={vk} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">
                    {VARIANT_LABELS[vk]}
                  </span>
                  <div className="flex gap-1.5">
                    {/* Per-variant regenerate */}
                    <button
                      onClick={() => onRegenerate(index, vk)}
                      disabled={!!regenerating}
                      className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs
                                 font-medium text-gray-500 transition hover:bg-white
                                 disabled:opacity-40 active:scale-95"
                    >
                      {isVarRegen ? "Redoing..." : "↺ Redo"}
                    </button>
                    {item[vk] && <CopyButton text={item[vk]!} label={VARIANT_LABELS[vk]} />}
                  </div>
                </div>

                {isVarRegen ? (
                  <div className="space-y-1.5 animate-pulse">
                    <div className="h-2.5 w-full rounded bg-gray-200" />
                    <div className="h-2.5 w-4/5 rounded bg-gray-200" />
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap text-xs leading-5 text-gray-700">
                    {item[vk]}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function BulkPage() {
  const [rows,        setRows]        = useState<CSVRow[]>([]);
  const [results,     setResults]     = useState<ResultRow[]>([]);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");
  const [progress,    setProgress]    = useState(0);
  const [regenerating,setRegenerating]= useState<string | null>(null);
  const abortRef = useRef(false);

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setResults([]);
    setProgress(0);

    Papa.parse<CSVRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (res) => {
        // validate required columns
        const required = ["productName","features","platform","tone","language"];
        const headers  = Object.keys(res.data[0] ?? {});
        const missing  = required.filter((k) => !headers.includes(k));
        if (missing.length > 0) {
          setError(`CSV missing columns: ${missing.join(", ")}`);
          return;
        }
        setRows(res.data);
      },
      error: () => setError("Failed to parse CSV file."),
    });
  }

  async function handleGenerate() {
    if (rows.length === 0) return;
    setLoading(true);
    setProgress(0);
    setError("");
    abortRef.current = false;

    // initialise all rows as pending
    setResults(rows.map((r) => ({
      productName: r.productName,
      platform:    r.platform,
      status:      "pending",
    })));

    let completed = 0;

    await processBatch(rows, (index, result) => {
      completed++;
      setProgress(completed);
      setResults((prev) => {
        const next = [...prev];
        next[index] = result;
        return next;
      });
    });

    setLoading(false);
  }

  // ── Regenerate — full row or single variant ──────────────────────────────
  async function handleRegenerate(rowIndex: number, variant?: VariantKey) {
    const row = rows[rowIndex];
    if (!row) return;

    const key = variant ? `${rowIndex}-${variant}` : `${rowIndex}`;
    setRegenerating(key);

    try {
      const res = await fetch("/api/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: row.productName,
          features:    row.features,
          platform:    row.platform,
          tone:        row.tone,
          language:    row.language,
          ...(variant ? { onlyVariant: variant } : {}),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Regeneration failed.");
        return;
      }

      setResults((prev) => {
        const next = [...prev];
        if (variant) {
          // update only the one variant
          next[rowIndex] = { ...next[rowIndex], [variant]: data[variant] };
        } else {
          // replace the full row result
          next[rowIndex] = {
            ...next[rowIndex],
            status: "success",
            v1: data.v1,
            v2: data.v2,
            v3: data.v3,
          };
        }
        return next;
      });
    } catch {
      setError("Regeneration failed. Please try again.");
    } finally {
      setRegenerating(null);
    }
  }

  // ── CSV download ────────────────────────────────────────────────────────────
  function downloadCSV() {
    const successful = results.filter((r) => r.status === "success");
    if (successful.length === 0) return;

    const csvData = successful.map((r) => ({
      product_name:  r.productName,
      platform:      r.platform,
      description_emotional: r.v1 ?? "",
      description_features:  r.v2 ?? "",
      description_punchy:    r.v3 ?? "",
    }));

    const csv  = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `descriptions_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const successCount = results.filter((r) => r.status === "success").length;
  const failCount    = results.filter((r) => r.status === "failed").length;

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Bulk CSV Generator</h1>
        <p className="mt-1 text-sm text-gray-500">
          Upload a CSV and generate descriptions for all products in parallel batches.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Upload area */}
      <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white p-8 text-center">
        <p className="mb-3 text-sm font-medium text-gray-700">
          Upload your product CSV
        </p>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="mx-auto block text-sm text-gray-500
                     file:mr-3 file:rounded-lg file:border-0
                     file:bg-gray-900 file:px-4 file:py-2
                     file:text-sm file:font-medium file:text-white
                     hover:file:bg-gray-700"
        />
        <p className="mt-3 text-xs text-gray-400">
          Required columns: productName, features, platform, tone, language
        </p>
        <a
          href="data:text/csv;charset=utf-8,productName,features,platform,tone,language%0AWomen Cotton Kurti,Soft cotton floral print summer wear,Meesho,Friendly,English%0AMen Linen Shirt,100%25 linen breathable casual formal,Amazon,Professional,English"
          download="sample_bulk.csv"
          className="mt-2 inline-block text-xs text-blue-500 underline"
        >
          Download sample CSV
        </a>
      </div>

      {/* Preview table */}
      {rows.length > 0 && (
        <div className="rounded-2xl border bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Preview</h2>
              <p className="text-xs text-gray-400">
                {rows.length} products · 1 credit per product
              </p>
            </div>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="rounded-xl bg-gray-900 px-5 py-2 text-sm
                         font-medium text-white transition hover:bg-gray-700
                         disabled:opacity-50"
            >
              {loading
                ? `Generating... ${progress}/${rows.length}`
                : `Generate All (${rows.length} credits)`}
            </button>
          </div>

          {/* Progress bar */}
          {loading && (
            <div className="mb-4">
              <div className="h-1.5 w-full rounded-full bg-gray-100">
                <div
                  className="h-1.5 rounded-full bg-gray-900 transition-all duration-300"
                  style={{ width: `${(progress / rows.length) * 100}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-gray-400 text-right">
                {progress} of {rows.length} done
              </p>
            </div>
          )}

          <div className="overflow-auto">
            <table className="min-w-full text-sm border-collapse">
              <thead>
                <tr className="border-b text-left">
                  <th className="p-3 font-medium text-gray-600">Product</th>
                  <th className="p-3 font-medium text-gray-600">Platform</th>
                  <th className="p-3 font-medium text-gray-600">Tone</th>
                  <th className="p-3 font-medium text-gray-600">Language</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="p-3">{row.productName}</td>
                    <td className="p-3">{row.platform}</td>
                    <td className="p-3">{row.tone}</td>
                    <td className="p-3">{row.language}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold">Results</h2>
              {successCount > 0 && (
                <span className="rounded-full bg-green-50 px-2.5 py-0.5 text-xs
                                 font-medium text-green-700">
                  {successCount} done
                </span>
              )}
              {failCount > 0 && (
                <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs
                                 font-medium text-red-600">
                  {failCount} failed
                </span>
              )}
            </div>

            {successCount > 0 && !loading && (
              <button
                onClick={downloadCSV}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2
                           text-sm font-medium text-gray-700 transition
                           hover:bg-gray-50 active:scale-95"
              >
                Download CSV
              </button>
            )}
          </div>

          <div className="flex flex-col gap-3">
            {results.map((item, i) => (
              <ResultCard
                key={i}
                index={i}
                item={item}
                csvRows={rows}
                onRegenerate={handleRegenerate}
                regenerating={regenerating}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}