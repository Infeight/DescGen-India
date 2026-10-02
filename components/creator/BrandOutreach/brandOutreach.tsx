"use client";

import { useState } from "react";

import BrandOutreachForm from "./brandOutreachForm";
import BrandOutreachResults from "./brandOutreachResult";
import BrandOutreachEmptyState from "./brandOutreachEmptyState";

import {BrandOutreachOutput} from "./types";

export default function BrandOutreach() {
  const [loading, setLoading] =
    useState(false);

  const [result, setResult] =
    useState<BrandOutreachOutput | null>(null);

  return (
    <div className="space-y-8">
      <BrandOutreachForm
        loading={loading}
        setLoading={setLoading}
        setResult={setResult}
      />

      {result ? (
        <BrandOutreachResults
          result={result}
        />
      ) : (
        <BrandOutreachEmptyState />
      )}
    </div>
  );
}