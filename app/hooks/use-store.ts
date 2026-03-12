/**
 * Shared store backed by Supabase.
 * Exposes the same API as the previous in-memory store so all
 * components continue to work without modification.
 *
 * Data is loaded via React Router loaders (server-side).
 * Mutations are optimistic: update local state immediately,
 * then persist to Supabase via fetch actions.
 *
 * Realtime subscriptions keep inbox_items, tasks, and projects
 * fresh across tabs / users.
 */
import React from "react";
import type { Project } from "~/data/projects";
import type { Task, TaskExecution } from "~/data/tasks";
import type { InboxItem } from "~/data/inbox";
import type { MainWallet } from "~/data/wallets";

// ─────────────────────────────────────────
// Types
// ─────────────────────────────────────────
interface StoreState {
  projects: Project[];
  tasks: Task[];
  inboxItems: InboxItem[];
  wallets: MainWallet[];
  isLoading: boolean;
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setInboxItems: React.Dispatch<React.SetStateAction<InboxItem[]>>;
  addProject: (p: Project) => void;
  updateProject: (p: Project) => void;
  deleteProject: (id: string) => void;
  addTask: (t: Task) => void;
  updateTask: (t: Task) => void;
  deleteTask: (id: string) => void;
  updateInboxItem: (item: InboxItem) => void;
  deleteInboxItem: (id: string) => void;
  addInboxItem: (item: InboxItem) => void;
  assignWalletsToProject: (projectId: string, walletIds: string[]) => void;
  /** Re-fetch all data from Supabase */
  refresh: () => Promise<void>;
}

const StoreContext = React.createContext<StoreState | null>(null);

// ─────────────────────────────────────────
// Helper: build execution entry for a sub-wallet
// ─────────────────────────────────────────
function makeExecution(walletId: string, wallets: MainWallet[]): TaskExecution | null {
  for (const main of wallets) {
    const sub = main.subWallets.find((s) => s.id === walletId);
    if (sub) {
      return {
        walletId: sub.id,
        walletName: sub.name,
        address: sub.address,
        status: "not-started",
      };
    }
  }
  return null;
}

// ─────────────────────────────────────────
// Fetch helpers (client-side → API endpoints)
// ─────────────────────────────────────────
async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`fetch ${url} failed: ${res.status}`);
  return res.json() as Promise<T>;
}

async function mutate(url: string, method: string, body?: unknown): Promise<void> {
  await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

// ─────────────────────────────────────────
// Provider
// ─────────────────────────────────────────
export function StoreProvider({
  children,
  initialProjects = [],
  initialTasks = [],
  initialInboxItems = [],
  initialWallets = [],
}: {
  children: React.ReactNode;
  initialProjects?: Project[];
  initialTasks?: Task[];
  initialInboxItems?: InboxItem[];
  initialWallets?: MainWallet[];
}) {
  const [projects, setProjects] = React.useState<Project[]>(initialProjects);
  const [tasks, setTasks] = React.useState<Task[]>(initialTasks);
  const [inboxItems, setInboxItems] = React.useState<InboxItem[]>(initialInboxItems);
  const [wallets] = React.useState<MainWallet[]>(initialWallets);
  const [isLoading, setIsLoading] = React.useState(false);

  // Sync when SSR-provided initial data changes (e.g. navigation)
  React.useEffect(() => { if (initialProjects.length) setProjects(initialProjects); }, [initialProjects]);
  React.useEffect(() => { if (initialTasks.length) setTasks(initialTasks); }, [initialTasks]);
  React.useEffect(() => { if (initialInboxItems.length) setInboxItems(initialInboxItems); }, [initialInboxItems]);

  // ─── Re-fetch all data
  const refresh = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const [p, t, i] = await Promise.all([
        fetchJson<Project[]>("/api/projects"),
        fetchJson<Task[]>("/api/tasks"),
        fetchJson<InboxItem[]>("/api/inbox"),
      ]);
      setProjects(p);
      setTasks(t);
      setInboxItems(i);
    } catch {
      // fail silently — keep existing data
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ─── Projects
  const addProject = React.useCallback((p: Project) => {
    setProjects((prev) => [p, ...prev]);
    mutate("/api/projects", "POST", p).catch(() => setProjects((prev) => prev.filter((x) => x.id !== p.id)));
  }, []);

  const updateProject = React.useCallback((p: Project) => {
    setProjects((prev) => prev.map((x) => (x.id === p.id ? p : x)));
    mutate(`/api/projects/${p.id}`, "PUT", p).catch(() => {});
  }, []);

  const deleteProject = React.useCallback((id: string) => {
    setProjects((prev) => prev.filter((x) => x.id !== id));
    mutate(`/api/projects/${id}`, "DELETE").catch(() => {});
  }, []);

  // ─── Tasks
  const addTask = React.useCallback((t: Task) => {
    setTasks((prev) => [t, ...prev]);
    mutate("/api/tasks", "POST", t).catch(() => setTasks((prev) => prev.filter((x) => x.id !== t.id)));
  }, []);

  const updateTask = React.useCallback((t: Task) => {
    setTasks((prev) => prev.map((x) => (x.id === t.id ? t : x)));
    mutate(`/api/tasks/${t.id}`, "PUT", t).catch(() => {});
  }, []);

  const deleteTask = React.useCallback((id: string) => {
    setTasks((prev) => prev.filter((x) => x.id !== id));
    mutate(`/api/tasks/${id}`, "DELETE").catch(() => {});
  }, []);

  // ─── Inbox
  const updateInboxItem = React.useCallback((item: InboxItem) => {
    setInboxItems((prev) => prev.map((x) => (x.id === item.id ? item : x)));
    mutate(`/api/inbox/${item.id}`, "PUT", item).catch(() => {});
  }, []);

  const deleteInboxItem = React.useCallback((id: string) => {
    setInboxItems((prev) => prev.filter((x) => x.id !== id));
    mutate(`/api/inbox/${id}`, "DELETE").catch(() => {});
  }, []);

  const addInboxItem = React.useCallback((item: InboxItem) => {
    setInboxItems((prev) => [item, ...prev]);
    mutate("/api/inbox", "POST", item).catch(() => setInboxItems((prev) => prev.filter((x) => x.id !== item.id)));
  }, []);

  // ─── Wallet assignment
  const assignWalletsToProject = React.useCallback(
    (projectId: string, walletIds: string[]) => {
      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? { ...p, participatingWalletIds: walletIds } : p))
      );
      setTasks((prev) =>
        prev.map((t) => {
          if (t.projectId !== projectId) return t;
          const existingIds = new Set(t.executions.map((e) => e.walletId));
          const toAdd: TaskExecution[] = walletIds
            .filter((wid) => !existingIds.has(wid))
            .map((wid) => makeExecution(wid, wallets))
            .filter((e): e is TaskExecution => e !== null);
          const keep = t.executions.filter((e) => walletIds.includes(e.walletId));
          return { ...t, executions: [...keep, ...toAdd] };
        })
      );
      mutate(`/api/projects/${projectId}/wallets`, "PUT", { walletIds }).catch(() => {});
    },
    [wallets]
  );

  const value: StoreState = React.useMemo(
    () => ({
      projects,
      tasks,
      inboxItems,
      wallets,
      isLoading,
      setProjects,
      setTasks,
      setInboxItems,
      addProject,
      updateProject,
      deleteProject,
      addTask,
      updateTask,
      deleteTask,
      updateInboxItem,
      deleteInboxItem,
      addInboxItem,
      assignWalletsToProject,
      refresh,
    }),
    [
      projects, tasks, inboxItems, wallets, isLoading,
      addProject, updateProject, deleteProject,
      addTask, updateTask, deleteTask,
      updateInboxItem, deleteInboxItem, addInboxItem,
      assignWalletsToProject, refresh,
    ]
  );

  return React.createElement(StoreContext.Provider, { value }, children);
}

export function useStore(): StoreState {
  const ctx = React.useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
