"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";
import type { Client, Platform } from "@/lib/types";
import PlatformLogo from "@/components/ui/PlatformLogo";

interface ClientWithCounts extends Client {
  links_count: number;
  submissions_count: number;
}

export default function ClientsPage() {
  const { t } = useI18n();
  const [clients, setClients] = useState<ClientWithCounts[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      // Fetch clients with link and submission counts
      const { data: clientsData } = await supabase
        .from("clients")
        .select("*")
        .order("created_at", { ascending: false });

      if (!clientsData) {
        setLoading(false);
        return;
      }

      // Get counts for each client
      const enriched = await Promise.all(
        (clientsData as Client[]).map(async (client) => {
          const [linksRes, subsRes] = await Promise.all([
            supabase
              .from("submission_links")
              .select("id", { count: "exact", head: true })
              .eq("client_id", client.id),
            supabase
              .from("submissions")
              .select("id", { count: "exact", head: true })
              .eq("client_id", client.id),
          ]);
          return {
            ...client,
            links_count: linksRes.count || 0,
            submissions_count: subsRes.count || 0,
          };
        })
      );

      setClients(enriched);
      setLoading(false);
    };

    fetchClients();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary">
          {t.dashboard.clients}
        </h1>
        <a
          href="/dashboard/clients/new"
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-dark hover:shadow active:scale-[0.98]"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          {t.dashboard.newClient}
        </a>
      </div>

      {clients.length === 0 ? (
        <div className="rounded-xl border border-border bg-bg-white p-12 text-center">
          <svg
            className="mx-auto mb-3 h-12 w-12 text-text-muted/40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 00-3-3.87" />
            <path d="M16 3.13a4 4 0 010 7.75" />
          </svg>
          <p className="text-text-muted">{t.common.noResults}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {clients.map((client) => (
            <a
              key={client.id}
              href={`/dashboard/clients/${client.id}`}
              className="group flex items-center gap-4 rounded-xl border border-border bg-bg-white p-4 shadow-sm transition-all hover:border-primary/30 hover:shadow"
            >
              {/* Client avatar/initial */}
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                {client.name.charAt(0).toUpperCase()}
              </div>

              {/* Client info */}
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors">
                  {client.name}
                </h3>
                <div className="mt-1 flex items-center gap-3">
                  {/* Platform logos */}
                  {client.platforms && client.platforms.length > 0 ? (
                    <div className="flex items-center gap-1.5">
                      {client.platforms.map((p: Platform) => (
                        <PlatformLogo key={p} platform={p} size={16} />
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-text-muted">
                      {t.dashboard.noPlatforms}
                    </span>
                  )}

                  {/* Separator dot */}
                  {client.contact_email && (
                    <>
                      <span className="text-text-muted/40">-</span>
                      <span className="truncate text-xs text-text-muted">
                        {client.contact_email}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Counts */}
              <div className="flex items-center gap-4 text-xs text-text-muted">
                <div className="flex items-center gap-1.5">
                  <svg
                    className="h-3.5 w-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                  </svg>
                  <span>{client.links_count}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg
                    className="h-3.5 w-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>{client.submissions_count}</span>
                </div>
              </div>

              {/* Chevron */}
              <svg
                className="h-5 w-5 shrink-0 text-text-muted/40 transition-transform group-hover:translate-x-0.5 group-hover:text-primary rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
