/**
 * Supabase Realtime hook.
 * Subscribes to inbox_items, tasks, and projects channels
 * and calls provided callbacks on INSERT/UPDATE/DELETE events.
 */
import React from "react";
import { getSupabaseClient } from "~/lib/supabase.client";

interface RealtimeCallbacks {
  onInboxChange?: () => void;
  onTasksChange?: () => void;
  onProjectsChange?: () => void;
}

export function useRealtime(callbacks: RealtimeCallbacks) {
  const { onInboxChange, onTasksChange, onProjectsChange } = callbacks;

  React.useEffect(() => {
    let client: ReturnType<typeof getSupabaseClient> | null = null;
    let channel: ReturnType<ReturnType<typeof getSupabaseClient>["channel"]> | null = null;

    async function subscribe() {
      try {
        const res = await fetch("/api/config");
        const { supabaseUrl, supabaseAnonKey } = await res.json();
        if (!supabaseUrl || !supabaseAnonKey) return;

        client = getSupabaseClient(supabaseUrl, supabaseAnonKey);

        channel = client
          .channel("db-changes")
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "inbox_items" },
            () => onInboxChange?.()
          )
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "tasks" },
            () => onTasksChange?.()
          )
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "projects" },
            () => onProjectsChange?.()
          )
          .subscribe();
      } catch {
        // Realtime is optional — fail silently
      }
    }

    subscribe();

    return () => {
      if (channel && client) {
        client.removeChannel(channel);
      }
    };
  }, [onInboxChange, onTasksChange, onProjectsChange]);
}
