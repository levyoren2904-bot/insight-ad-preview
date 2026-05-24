"use client";

import { useEffect, useState, useCallback } from "react";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";
import type { Submission, SubmissionStatus, Platform } from "@/lib/types";
import StatusBadge from "@/components/dashboard/StatusBadge";
import FilterBar from "@/components/dashboard/FilterBar";
import PlatformLogo from "@/components/ui/PlatformLogo";
import { Card, CardContent } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Loader2Icon,
  FileTextIcon,
  ChevronRightIcon,
} from "lucide-react";

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
        <Loader2Icon className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl animate-page-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {t.dashboard.submissions}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? "submission" : "submissions"}
        </p>
      </div>

      <div className="mb-4">
        <FilterBar
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <div className="rounded-full bg-muted p-3">
              <FileTextIcon className="size-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">{t.dashboard.noSubmissions}</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3 text-start">Client</th>
                <th className="px-4 py-3 text-start">Platforms</th>
                <th className="px-4 py-3 text-start">Status</th>
                <th className="px-4 py-3 text-start">Date</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((sub, i) => (
                <tr
                  key={sub.id}
                  className="animate-stagger border-b border-border-light last:border-0 transition-colors hover:bg-muted/30"
                  style={{ animationDelay: `${Math.min(i * 35, 400)}ms` }}
                >
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-foreground">
                      {sub.client?.name || "Unknown"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {sub.client?.contact_email}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {getPlatforms(sub).map((p) => (
                        <PlatformLogo key={p} platform={p} size={18} />
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={sub.status} />
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {formatDate(sub.created_at)}
                  </td>
                  <td className="px-4 py-3 text-end">
                    <a
                      href={`/dashboard/submissions/${sub.id}`}
                      className={buttonVariants({ variant: "ghost", size: "sm" })}
                    >
                      {t.common.edit}
                      <ChevronRightIcon className="size-3.5 rtl:rotate-180" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
