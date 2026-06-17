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
import type { AgentJob } from "~/data/agent-jobs";

// ─────────────────────────────────────────
// Types
// ─────────────────────────────────────────
interface StoreState {
  projects: Project[];
  tasks: Task[];
  inboxItems: InboxItem[];
  wallets: MainWallet[];
  agentJobs: AgentJob[];
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
  // BUG #5 FIX: expose wallet CRUD so wallet changes are persisted
  addWallet: (w: MainWallet) => void;
  updateWallet: (w: MainWallet) => void;
  deleteWallet: (id: string) => void;
  // Agent Jobs
  dispatchAgentJob: (job: Omit<AgentJob, "id" | "createdAt" | "status">) => Promise<AgentJob>;
  updateAgentJob: (id: string, patch: Partial<AgentJob>) => void;
  cancelAgentJob: (id: string) => void;
  getJobsForTask: (taskId: string) => AgentJob[];
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
  initialAgentJobs = [],
}: {
  children: React.ReactNode;
  initialProjects?: Project[];
  initialTasks?: Task[];
  initialInboxItems?: InboxItem[];
  initialWallets?: MainWallet[];
  initialAgentJobs?: AgentJob[];
}) {
  const [projects, setProjects] = React.useState<Project[]>(initialProjects);
  const [tasks, setTasks] = React.useState<Task[]>(initialTasks);
  const [inboxItems, setInboxItems] = React.useState<InboxItem[]>(initialInboxItems);
  // BUG #5 FIX: wallets needs its own setter so CRUD mutations can update it
  const [wallets, setWallets] = React.useState<MainWallet[]>(initialWallets);
  const [agentJobs, setAgentJobs] = React.useState<AgentJob[]>(initialAgentJobs);
  const [isLoading, setIsLoading] = React.useState(false);

  // BUG #3 FIX: removed `if (xxx.length)` guard — an empty array from the server
  // is valid state (no data yet) and must be reflected in the UI.
  React.useEffect(() => { setProjects(initialProjects); }, [initialProjects]);
  React.useEffect(() => { setTasks(initialTasks); }, [initialTasks]);
  React.useEffect(() => { setInboxItems(initialInboxItems); }, [initialInboxItems]);
  React.useEffect(() => { setWallets(initialWallets); }, [initialWallets]);
  React.useEffect(() => { setAgentJobs(initialAgentJobs); }, [initialAgentJobs]);

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
    // Capture old value for rollback on error
    setTasks((prev) => {
      const old = prev.find((x) => x.id === t.id);
      mutate(`/api/tasks/${t.id}`, "PUT", t).catch(() => {
        if (old) setTasks((p) => p.map((x) => (x.id === t.id ? old : x)));
      });
      return prev.map((x) => (x.id === t.id ? t : x));
    });
  }, []);

  const deleteTask = React.useCallback((id: string) => {
    setTasks((prev) => {
      const old = prev.find((x) => x.id === id);
      mutate(`/api/tasks/${id}`, "DELETE").catch(() => {
        if (old) setTasks((p) => [old, ...p]);
      });
      return prev.filter((x) => x.id !== id);
    });
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
      // BUG #4 FIX: snapshot old state before optimistic update so we can roll back
      let oldProjects: Project[];
      let oldTasks: Task[];

      setProjects((prev) => {
        oldProjects = prev;
        return prev.map((p) => (p.id === projectId ? { ...p, participatingWalletIds: walletIds } : p));
      });
      setTasks((prev) => {
        oldTasks = prev;
        return prev.map((t) => {
          if (t.projectId !== projectId) return t;
          const existingIds = new Set(t.executions.map((e) => e.walletId));
          const toAdd: TaskExecution[] = walletIds
            .filter((wid) => !existingIds.has(wid))
            .map((wid) => makeExecution(wid, wallets))
            .filter((e): e is TaskExecution => e !== null);
          const keep = t.executions.filter((e) => walletIds.includes(e.walletId));
          return { ...t, executions: [...keep, ...toAdd] };
        });
      });

      mutate(`/api/projects/${projectId}/wallets`, "PUT", { walletIds }).catch(() => {
        // Rollback both slices on API failure
        setProjects(oldProjects);
        setTasks(oldTasks);
      });
    },
    [wallets]
  );

  // ─── Wallet CRUD (BUG #5 FIX)
  const addWallet = React.useCallback((w: MainWallet) => {
    setWallets((prev) => [w, ...prev]);
    mutate("/api/wallets", "POST", w).catch(() => setWallets((prev) => prev.filter((x) => x.id !== w.id)));
  }, []);

  const updateWallet = React.useCallback((w: MainWallet) => {
    setWallets((prev) => {
      const old = prev.find((x) => x.id === w.id);
      mutate(`/api/wallets/${w.id}`, "PUT", w).catch(() => {
        if (old) setWallets((p) => p.map((x) => (x.id === w.id ? old : x)));
      });
      return prev.map((x) => (x.id === w.id ? w : x));
    });
  }, []);

  const deleteWallet = React.useCallback((id: string) => {
    setWallets((prev) => {
      const old = prev.find((x) => x.id === id);
      mutate(`/api/wallets/${id}`, "DELETE").catch(() => {
        if (old) setWallets((p) => [old, ...p]);
      });
      return prev.filter((x) => x.id !== id);
    });
  }, []);

  // ─── Agent Jobs
  const dispatchAgentJob = React.useCallback(
    async (jobInput: Omit<AgentJob, "id" | "createdAt" | "status">): Promise<AgentJob> => {
      const res = await fetch("/api/agent-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobInput),
      });
      if (!res.ok) throw new Error(`dispatchAgentJob: ${res.status}`);
      const job = (await res.json()) as AgentJob;
      setAgentJobs((prev) => [job, ...prev]);
      return job;
    },
    []
  );

  const updateAgentJob = React.useCallback((id: string, patch: Partial<AgentJob>) => {
    setAgentJobs((prev) => prev.map((j) => (j.id === id ? { ...j, ...patch } : j)));
    mutate(`/api/agent-jobs/${id}`, "PUT", patch).catch(() => {});
  }, []);

  const cancelAgentJob = React.useCallback((id: string) => {
    setAgentJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status: "cancelled" as const } : j)));
    mutate(`/api/agent-jobs/${id}`, "PATCH", { action: "cancel" }).catch(() => {});
  }, []);

  const getJobsForTask = React.useCallback(
    (taskId: string) => agentJobs.filter((j) => j.taskId === taskId),
    [agentJobs]
  );

  const value: StoreState = React.useMemo(
    () => ({
      projects,
      tasks,
      inboxItems,
      wallets,
      agentJobs,
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
      addWallet,
      updateWallet,
      deleteWallet,
      dispatchAgentJob,
      updateAgentJob,
      cancelAgentJob,
      getJobsForTask,
      refresh,
    }),
    [
      projects, tasks, inboxItems, wallets, agentJobs, isLoading,
      addProject, updateProject, deleteProject,
      addTask, updateTask, deleteTask,
      updateInboxItem, deleteInboxItem, addInboxItem,
      assignWalletsToProject,
      addWallet, updateWallet, deleteWallet,
      dispatchAgentJob, updateAgentJob, cancelAgentJob, getJobsForTask,
      refresh,
    ]
  );

  return React.createElement(StoreContext.Provider, { value }, children);
}

export function useStore(): StoreState {
  const ctx = React.useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
