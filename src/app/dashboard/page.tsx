"use client";

import { useEffect, useState, useCallback } from "react";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";
import type { Submission, SubmissionStatus, Platform } from "@/lib/types";
import StatusBadge from "@/components/dashboard/StatusBadge";
import FilterBar from "@/components/dashboard/FilterBar";

export default function DashboardPage() {
  const { t } = useI18n();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<SubmissionStatus | "all">(
    "all"
  );
  const [searchQuery, setSearchQuery] = useState("");

  const fetchSubmissions = useCallback(async () => {
    let query = supabase
      .from("submissions")
      .select("*, client:clients(*), content:submission_content(*)")
      .order("created_at", { ascending: false });

    if (statusFilter !== "all") {
      query = query.eq("status", statusFilter);
    }

    const { data } = await query;
    setSubmissions((data as Submission[]) || []);
    setLoading(false);
  }, [statusFilter]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const filtered = submissions.filter((sub) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      sub.client?.name?.toLowerCase().includes(q) ||
      sub.client?.contact_email?.toLowerCase().includes(q) ||
      sub.id.toLowerCase().includes(q)
    );
  });

  const getPlatforms = (sub: Submission): Platform[] => {
    return (sub.content || []).map((c) => c.platform);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary">
          {t.dashboard.submissions}
        </h1>
      </div>

      <FilterBar
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {filtered.length === 0 ? (
        <div className="mt-8 rounded-xl border border-border bg-bg-white p-12 text-center">
          <div className="mb-3 text-4xl text-text-muted">
            <svg className="mx-auto h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-text-muted">{t.dashboard.noSubmissions}</p>
        </div>
      ) : (
        <div className="mt-4 overflow-hidden rounded-xl border border-border bg-bg-white shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-bg-subtle text-start text-xs font-semibold uppercase tracking-wider text-text-muted">
                <th className="px-4 py-3 text-start">Client</th>
                <th className="px-4 py-3 text-start">Platforms</th>
                <th className="px-4 py-3 text-start">Status</th>
                <th className="px-4 py-3 text-start">Date</th>
                <th className="px-4 py-3 text-start"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((sub) => (
                <tr
                  key={sub.id}
                  className="border-b border-border-light last:border-0 transition-colors hover:bg-bg-subtle"
                >
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-text-primary">
                      {sub.client?.name || "Unknown"}
                    </div>
                    <div className="text-xs text-text-muted">
                      {sub.client?.contact_email}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {getPlatforms(sub).map((p) => (
                        <PlatformChip key={p} platform={p} />
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={sub.status} />
                  </td>
                  <td className="px-4 py-3 text-sm text-text-secondary">
                    {formatDate(sub.created_at)}
                  </td>
                  <td className="px-4 py-3 text-end">
                    <a
                      href={`/dashboard/submissions/${sub.id}`}
                      className="rounded-lg px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/5"
                    >
                      {t.common.edit}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const PLATFORM_COLORS: Record<Platform, string> = {
  google: "bg-[#4285F4]",
  facebook: "bg-[#1877F2]",
  instagram: "bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737]",
  linkedin: "bg-[#0A66C2]",
  pinterest: "bg-[#E60023]",
};

const PLATFORM_ABBR: Record<Platform, string> = {
  google: "G",
  facebook: "FB",
  instagram: "IG",
  linkedin: "LI",
  pinterest: "PI",
};

function PlatformChip({ platform }: { platform: Platform }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold text-white ${PLATFORM_COLORS[platform]}`}
    >
      {PLATFORM_ABBR[platform]}
    </span>
  );
}
