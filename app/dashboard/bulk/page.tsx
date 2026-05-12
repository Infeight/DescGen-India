"use client";

import { useState, useRef } from "react";
import Papa from "papaparse";

import {
  Upload,
  FileSpreadsheet,
  Sparkles,
  Download,
  RefreshCw,
  Copy,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

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
  status:
    | "pending"
    | "success"
    | "failed";

  error?: string;

  v1?: string;
  v2?: string;
  v3?: string;
}

type VariantKey =
  | "v1"
  | "v2"
  | "v3";

const VARIANT_LABELS: Record<
  VariantKey,
  string
> = {
  v1: "Emotional",
  v2: "Features",
  v3: "Punchy",
};

function sleep(ms: number) {
  return new Promise((r) =>
    setTimeout(r, ms)
  );
}

// ─────────────────────────────────────────────────────────────
// Process batches
// ─────────────────────────────────────────────────────────────
async function processBatch(
  rows: CSVRow[],
  onRowComplete: (
    index: number,
    result: ResultRow
  ) => void
): Promise<ResultRow[]> {
  const BATCH_SIZE = 5;

  const results: ResultRow[] =
    rows.map((r) => ({
      productName:
        r.productName,

      platform:
        r.platform,

      status:
        "pending",
    }));

  for (
    let i = 0;
    i < rows.length;
    i += BATCH_SIZE
  ) {
    const batch =
      rows.slice(
        i,
        i + BATCH_SIZE
      );

    await Promise.all(
      batch.map(
        async (
          row,
          batchIndex
        ) => {
          const globalIndex =
            i + batchIndex;

          try {
            const res =
              await fetch(
                "/api/generate",
                {
                  method:
                    "POST",

                  headers: {
                    "Content-Type":
                      "application/json",
                  },

                  body: JSON.stringify(
                    {
                      productName:
                        row.productName,

                      features:
                        row.features,

                      platform:
                        row.platform,

                      tone:
                        row.tone,

                      language:
                        row.language,
                    }
                  ),
                }
              );

            const data =
              await res.json();

            if (!res.ok) {
              results[
                globalIndex
              ] = {
                productName:
                  row.productName,

                platform:
                  row.platform,

                status:
                  "failed",

                error:
                  data.error ||
                  "Generation failed",
              };

            } else {
              results[
                globalIndex
              ] = {
                productName:
                  row.productName,

                platform:
                  row.platform,

                status:
                  "success",

                v1: data.v1,
                v2: data.v2,
                v3: data.v3,
              };
            }

          } catch {
            results[
              globalIndex
            ] = {
              productName:
                row.productName,

              platform:
                row.platform,

              status:
                "failed",

              error:
                "Network error",
            };
          }

          onRowComplete(
            globalIndex,
            results[
              globalIndex
            ]
          );
        }
      )
    );

    if (
      i + BATCH_SIZE <
      rows.length
    ) {
      await sleep(1200);
    }
  }

  return results;
}

// ─────────────────────────────────────────────────────────────
// Copy Button
// ─────────────────────────────────────────────────────────────
function CopyButton({
  text,
}: {
  text: string;
}) {
  const [copied, setCopied] =
    useState(false);

  async function copy() {
    await navigator.clipboard.writeText(
      text
    );

    setCopied(true);

    setTimeout(
      () =>
        setCopied(false),
      2000
    );
  }

  return (
    <button
      onClick={copy}
      className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-gray-300 transition hover:bg-white/10"
    >
      <Copy className="h-3.5 w-3.5" />

      {copied
        ? "Copied"
        : "Copy"}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// Result Card
// ─────────────────────────────────────────────────────────────
function ResultCard({
  item,
  index,
  onRegenerate,
  regenerating,
}: {
  item: ResultRow;

  index: number;

  onRegenerate: (
    index: number,
    variant?: VariantKey
  ) => void;

  regenerating:
    | string
    | null;
}) {
  const [
    expanded,
    setExpanded,
  ] = useState(true);

  const isPending =
    item.status ===
    "pending";

  const isFailed =
    item.status ===
    "failed";

  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
              isPending
                ? "bg-yellow-500/10"
                : isFailed
                ? "bg-red-500/10"
                : "bg-emerald-500/10"
            }`}
          >
            {isPending ? (
              <Loader2 className="h-5 w-5 animate-spin text-yellow-400" />
            ) : isFailed ? (
              <AlertCircle className="h-5 w-5 text-red-400" />
            ) : (
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            )}
          </div>

          <div>
            <h3 className="font-semibold text-white">
              {
                item.productName
              }
            </h3>

            <p className="text-sm text-gray-400">
              {
                item.platform
              }
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {(item.status ===
            "success" ||
            item.status ===
              "failed") && (
            <button
              onClick={() =>
                onRegenerate(
                  index
                )
              }
              disabled={
                !!regenerating
              }
              className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 transition hover:bg-white/10 disabled:opacity-40"
            >
              <RefreshCw className="h-4 w-4" />

              Redo All
            </button>
          )}

          {item.status ===
            "success" && (
            <button
              onClick={() =>
                setExpanded(
                  !expanded
                )
              }
              className="rounded-2xl border border-white/10 bg-white/5 p-2 text-gray-400 transition hover:bg-white/10"
            >
              <ChevronDown
                className={`h-4 w-4 transition ${
                  expanded
                    ? "rotate-180"
                    : ""
                }`}
              />
            </button>
          )}
        </div>
      </div>

      {/* Error */}
      {isFailed && (
        <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {item.error}
        </div>
      )}

      {/* Pending */}
      {isPending && (
        <div className="mt-5 space-y-3 animate-pulse">
          <div className="h-4 rounded bg-white/10" />

          <div className="h-4 w-5/6 rounded bg-white/10" />

          <div className="h-4 w-3/6 rounded bg-white/10" />
        </div>
      )}

      {/* Success */}
      {item.status ===
        "success" &&
        expanded && (
          <div className="mt-5 flex flex-col gap-4">
            {(
              [
                "v1",
                "v2",
                "v3",
              ] as VariantKey[]
            ).map((vk) => (
              <div
                key={vk}
                className="rounded-2xl border border-white/10 bg-black/20 p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">
                      {
                        VARIANT_LABELS[
                          vk
                        ]
                      }
                    </p>

                    <p className="text-xs text-gray-500">
                      AI-generated
                      marketplace
                      description
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        onRegenerate(
                          index,
                          vk
                        )
                      }
                      disabled={
                        !!regenerating
                      }
                      className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-gray-300 transition hover:bg-white/10"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />

                      Redo
                    </button>

                    {item[
                      vk
                    ] && (
                      <CopyButton
                        text={
                          item[
                            vk
                          ]!
                        }
                      />
                    )}
                  </div>
                </div>

                <p className="whitespace-pre-wrap text-sm leading-7 text-gray-300">
                  {item[vk]}
                </p>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────
export default function BulkPage() {
  const [rows, setRows] =
    useState<CSVRow[]>(
      []
    );

  const [
    results,
    setResults,
  ] = useState<
    ResultRow[]
  >([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [
    progress,
    setProgress,
  ] = useState(0);

  const [
    regenerating,
    setRegenerating,
  ] = useState<
    string | null
  >(null);

  const abortRef =
    useRef(false);

  function handleFileUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file =
      e.target.files?.[0];

    if (!file) return;

    setError("");
    setResults([]);
    setProgress(0);

    Papa.parse<CSVRow>(
      file,
      {
        header: true,

        skipEmptyLines: true,

        complete: (
          res
        ) => {
          const required =
            [
              "productName",
              "features",
              "platform",
              "tone",
              "language",
            ];

          const headers =
            Object.keys(
              res.data[0] ??
                {}
            );

          const missing =
            required.filter(
              (
                k
              ) =>
                !headers.includes(
                  k
                )
            );

          if (
            missing.length >
            0
          ) {
            setError(
              `CSV missing columns: ${missing.join(
                ", "
              )}`
            );

            return;
          }

          setRows(
            res.data
          );
        },

        error: () =>
          setError(
            "Failed to parse CSV."
          ),
      }
    );
  }

  async function handleGenerate() {
    if (rows.length === 0)
      return;

    setLoading(true);

    setProgress(0);

    setError("");

    abortRef.current =
      false;

    setResults(
      rows.map((r) => ({
        productName:
          r.productName,

        platform:
          r.platform,

        status:
          "pending",
      }))
    );

    let completed = 0;

    await processBatch(
      rows,
      (
        index,
        result
      ) => {
        completed++;

        setProgress(
          completed
        );

        setResults(
          (prev) => {
            const next =
              [
                ...prev,
              ];

            next[index] =
              result;

            return next;
          }
        );
      }
    );

    setLoading(false);
  }

  async function handleRegenerate(
    rowIndex: number,
    variant?: VariantKey
  ) {
    const row =
      rows[rowIndex];

    if (!row) return;

    const key =
      variant
        ? `${rowIndex}-${variant}`
        : `${rowIndex}`;

    setRegenerating(key);

    try {
      const res =
        await fetch(
          "/api/bulk",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              {
                productName:
                  row.productName,

                features:
                  row.features,

                platform:
                  row.platform,

                tone:
                  row.tone,

                language:
                  row.language,

                ...(variant
                  ? {
                      onlyVariant:
                        variant,
                    }
                  : {}),
              }
            ),
          }
        );

      const data =
        await res.json();

      if (!res.ok) {
        setError(
          data.error ||
            "Regeneration failed."
        );

        return;
      }

      setResults((prev) => {
        const next = [
          ...prev,
        ];

        if (variant) {
          next[
            rowIndex
          ] = {
            ...next[
              rowIndex
            ],

            [variant]:
              data[
                variant
              ],
          };

        } else {
          next[
            rowIndex
          ] = {
            ...next[
              rowIndex
            ],

            status:
              "success",

            v1: data.v1,
            v2: data.v2,
            v3: data.v3,
          };
        }

        return next;
      });

    } catch {
      setError(
        "Regeneration failed."
      );

    } finally {
      setRegenerating(
        null
      );
    }
  }

  function downloadCSV() {
    const successful =
      results.filter(
        (r) =>
          r.status ===
          "success"
      );

    if (
      successful.length ===
      0
    )
      return;

    const csvData =
      successful.map(
        (r) => ({
          product_name:
            r.productName,

          platform:
            r.platform,

          description_emotional:
            r.v1 ?? "",

          description_features:
            r.v2 ?? "",

          description_punchy:
            r.v3 ?? "",
        })
      );

    const csv =
      Papa.unparse(
        csvData
      );

    const blob =
      new Blob(
        [csv],
        {
          type: "text/csv;charset=utf-8;",
        }
      );

    const url =
      URL.createObjectURL(
        blob
      );

    const a =
      document.createElement(
        "a"
      );

    a.href = url;

    a.download = `descriptions_${new Date()
      .toISOString()
      .slice(
        0,
        10
      )}.csv`;

    a.click();

    URL.revokeObjectURL(
      url
    );
  }

  const successCount =
    results.filter(
      (r) =>
        r.status ===
        "success"
    ).length;

  const failCount =
    results.filter(
      (r) =>
        r.status ===
        "failed"
    ).length;

  return (
    <div className="relative flex flex-col gap-8">
      {/* Glow */}
      <div className="absolute left-1/2 top-0 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />

      {/* Header */}
      <div className="relative flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-r from-cyan-500 to-fuchsia-500 shadow-lg shadow-cyan-500/20">
          <FileSpreadsheet className="h-7 w-7 text-white" />
        </div>

        <div>
          <h1 className="text-4xl font-bold text-white">
            Bulk AI Generator
          </h1>

          <p className="mt-1 text-gray-400">
            Generate descriptions
            for hundreds of
            products with AI.
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Upload */}
      <div className="rounded-[32px] border border-dashed border-white/10 bg-white/5 p-10 text-center backdrop-blur-xl">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500/10 to-fuchsia-500/10">
          <Upload className="h-10 w-10 text-cyan-400" />
        </div>

        <h2 className="mt-6 text-2xl font-semibold text-white">
          Upload Product CSV
        </h2>

        <p className="mx-auto mt-3 max-w-xl text-gray-400">
          Upload a CSV file to
          generate marketplace
          descriptions in parallel
          AI batches.
        </p>

        <div className="mt-6">
          <input
            type="file"
            accept=".csv"
            onChange={
              handleFileUpload
            }
            className="mx-auto block text-sm text-gray-400
            file:mr-4
            file:rounded-2xl
            file:border-0
            file:bg-gradient-to-r
            file:from-fuchsia-500
            file:to-cyan-500
            file:px-5
            file:py-3
            file:text-sm
            file:font-semibold
            file:text-white
            hover:file:opacity-90"
          />
        </div>

        <p className="mt-5 text-xs text-gray-500">
          Required columns:
          productName,
          features, platform,
          tone, language
        </p>

        <a
          href="data:text/csv;charset=utf-8,productName,features,platform,tone,language%0AWomen Cotton Kurti,Soft cotton floral print summer wear,Meesho,Friendly,English"
          download="sample_bulk.csv"
          className="mt-3 inline-flex items-center gap-2 text-sm text-cyan-400 transition hover:text-cyan-300"
        >
          <Download className="h-4 w-4" />

          Download sample CSV
        </a>
      </div>

      {/* Preview */}
      {rows.length > 0 && (
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-7 backdrop-blur-xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">
                Product Preview
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                {rows.length}{" "}
                products ready
                for AI generation
              </p>
            </div>

            <button
              onClick={
                handleGenerate
              }
              disabled={
                loading
              }
              className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-cyan-500 px-6 py-4 font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:scale-[1.01] disabled:opacity-50"
            >
              <Sparkles className="h-5 w-5" />

              {loading
                ? `Generating ${progress}/${rows.length}`
                : `Generate All`}
            </button>
          </div>

          {/* Progress */}
          {loading && (
            <div className="mb-6">
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-500 transition-all duration-300"
                  style={{
                    width: `${(progress / rows.length) * 100}%`,
                  }}
                />
              </div>

              <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                <span>
                  AI processing
                  products...
                </span>

                <span>
                  {progress}/
                  {
                    rows.length
                  }
                </span>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="overflow-hidden rounded-3xl border border-white/10">
            <table className="min-w-full">
              <thead className="bg-white/5">
                <tr>
                  {[
                    "Product",
                    "Platform",
                    "Tone",
                    "Language",
                  ].map(
                    (
                      heading
                    ) => (
                      <th
                        key={
                          heading
                        }
                        className="px-5 py-4 text-left text-sm font-medium text-gray-400"
                      >
                        {
                          heading
                        }
                      </th>
                    )
                  )}
                </tr>
              </thead>

              <tbody>
                {rows.map(
                  (
                    row,
                    i
                  ) => (
                    <tr
                      key={i}
                      className="border-t border-white/5"
                    >
                      <td className="px-5 py-4 text-sm text-white">
                        {
                          row.productName
                        }
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-300">
                        {
                          row.platform
                        }
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-300">
                        {
                          row.tone
                        }
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-300">
                        {
                          row.language
                        }
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Results */}
      {results.length >
        0 && (
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-semibold text-white">
                AI Results
              </h2>

              {successCount >
                0 && (
                <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                  {
                    successCount
                  }{" "}
                  completed
                </div>
              )}

              {failCount >
                0 && (
                <div className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-300">
                  {
                    failCount
                  }{" "}
                  failed
                </div>
              )}
            </div>

            {successCount >
              0 &&
              !loading && (
                <button
                  onClick={
                    downloadCSV
                  }
                  className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-gray-300 transition hover:bg-white/10"
                >
                  <Download className="h-4 w-4" />

                  Download CSV
                </button>
              )}
          </div>

          <div className="flex flex-col gap-4">
            {results.map(
              (
                item,
                i
              ) => (
                <ResultCard
                  key={i}
                  item={item}
                  index={i}
                  onRegenerate={
                    handleRegenerate
                  }
                  regenerating={
                    regenerating
                  }
                />
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}