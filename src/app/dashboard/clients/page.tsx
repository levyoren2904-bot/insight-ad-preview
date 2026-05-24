"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";
import type { Client, Platform } from "@/lib/types";
import PlatformLogo from "@/components/ui/PlatformLogo";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Loader2Icon,
  UsersIcon,
  PlusIcon,
  LinkIcon,
  FileTextIcon,
  ChevronRightIcon,
} from "lucide-react";

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
      const { data: clientsData } = await supabase
        .from("clients")
        .select("*")
        .order("created_at", { ascending: false });

      if (!clientsData) {
        setLoading(false);
        return;
      }

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
        <Loader2Icon className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl animate-page-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {t.dashboard.clients}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {clients.length} {clients.length === 1 ? "client" : "clients"}
          </p>
        </div>
        <a
          href="/dashboard/clients/new"
          className={buttonVariants({ size: "lg" })}
        >
          <PlusIcon className="size-4" />
          {t.dashboard.newClient}
        </a>
      </div>

      {clients.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <div className="rounded-full bg-muted p-3">
              <UsersIcon className="size-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">{t.common.noResults}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {clients.map((client, i) => (
            <a
              key={client.id}
              href={`/dashboard/clients/${client.id}`}
              className="group animate-stagger"
              style={{ animationDelay: `${Math.min(i * 50, 400)}ms` }}
            >
              <Card className="transition-all hover:border-primary/30 hover:shadow-md">
                <CardContent className="flex items-center gap-4 p-4">
                  <Avatar className="size-11 shrink-0">
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {client.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      {client.name}
                    </h3>
                    <div className="mt-1 flex items-center gap-3">
                      {client.platforms && client.platforms.length > 0 ? (
                        <div className="flex items-center gap-1.5">
                          {client.platforms.map((p: Platform) => (
                            <PlatformLogo key={p} platform={p} size={16} />
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          {t.dashboard.noPlatforms}
                        </span>
                      )}

                      {client.contact_email && (
                        <>
                          <span className="text-muted-foreground/40">·</span>
                          <span className="truncate text-xs text-muted-foreground">
                            {client.contact_email}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <LinkIcon className="size-3.5" />
                      <span>{client.links_count}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FileTextIcon className="size-3.5" />
                      <span>{client.submissions_count}</span>
                    </div>
                  </div>

                  <ChevronRightIcon className="size-5 shrink-0 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5 group-hover:text-primary rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
