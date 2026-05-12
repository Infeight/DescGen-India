"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

interface Generation {
  id: string;
  product_name: string;
  features: string;
  platform: string;
  output_v1: string;
  output_v2: string;
  output_v3: string;
  created_at: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchHistory() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("generations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        return;
      }

      setHistory(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="p-10">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 p-6">
      <h1 className="text-3xl font-bold">
        History
      </h1>

      {history.length === 0 ? (
        <p>No generations found.</p>
      ) : (
        history.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border p-5"
          >
            <h2 className="mb-2 text-xl font-bold">
              {item.product_name}
            </h2>

            <p className="mb-4 text-sm text-gray-500">
              {item.platform}
            </p>

            <div className="rounded-lg bg-gray-50 p-3">
  <h3 className="mb-1 text-sm font-semibold text-gray-600">
    Features
  </h3>

  <p className="text-sm text-gray-700">
    {item.features}
  </p>
</div>

            <div className="flex flex-col gap-3">
              <div className="rounded border p-3">
                {item.output_v1}
              </div>

              <div className="rounded border p-3">
                {item.output_v2}
              </div>

              <div className="rounded border p-3">
                {item.output_v3}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}