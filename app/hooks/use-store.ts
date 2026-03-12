/**
 * Shared in-memory store for Projects, Tasks, and Inbox items.
 * Uses React context so any route can read/write the same data.
 */
import React from "react";
import { mockProjects, type Project } from "~/data/projects";
import { mockTasks, type Task, type TaskExecution } from "~/data/tasks";
import { mockInboxItems, type InboxItem } from "~/data/inbox";
import { mockMainWallets } from "~/data/wallets";

/**
 * Build a fresh TaskExecution entry (not-started) for a sub-wallet.
 */
function makeExecution(walletId: string): TaskExecution | null {
  for (const main of mockMainWallets) {
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

interface StoreState {
  projects: Project[];
  tasks: Task[];
  inboxItems: InboxItem[];
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
  /**
   * Set the wallet assignment for a project and initialise execution entries
   * for all tasks that belong to that project.
   */
  assignWalletsToProject: (projectId: string, walletIds: string[]) => void;
}

const StoreContext = React.createContext<StoreState | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = React.useState<Project[]>(mockProjects);
  const [tasks, setTasks] = React.useState<Task[]>(mockTasks);
  const [inboxItems, setInboxItems] = React.useState<InboxItem[]>(mockInboxItems);

  const addProject = React.useCallback((p: Project) => setProjects((prev) => [p, ...prev]), []);
  const updateProject = React.useCallback(
    (p: Project) => setProjects((prev) => prev.map((x) => (x.id === p.id ? p : x))),
    [],
  );
  const deleteProject = React.useCallback((id: string) => setProjects((prev) => prev.filter((x) => x.id !== id)), []);

  const addTask = React.useCallback((t: Task) => setTasks((prev) => [t, ...prev]), []);
  const updateTask = React.useCallback(
    (t: Task) => setTasks((prev) => prev.map((x) => (x.id === t.id ? t : x))),
    [],
  );
  const deleteTask = React.useCallback((id: string) => setTasks((prev) => prev.filter((x) => x.id !== id)), []);

  const updateInboxItem = React.useCallback(
    (item: InboxItem) => setInboxItems((prev) => prev.map((x) => (x.id === item.id ? item : x))),
    [],
  );
  const deleteInboxItem = React.useCallback(
    (id: string) => setInboxItems((prev) => prev.filter((x) => x.id !== id)),
    [],
  );
  const addInboxItem = React.useCallback((item: InboxItem) => setInboxItems((prev) => [item, ...prev]), []);

  const assignWalletsToProject = React.useCallback(
    (projectId: string, walletIds: string[]) => {
      // Update project's participatingWalletIds
      setProjects((prev) =>
        prev.map((p) => p.id === projectId ? { ...p, participatingWalletIds: walletIds } : p)
      );
      // For each task in this project, ensure every wallet has an execution entry
      setTasks((prev) =>
        prev.map((t) => {
          if (t.projectId !== projectId) return t;
          const existingIds = new Set(t.executions.map((e) => e.walletId));
          const toAdd: TaskExecution[] = walletIds
            .filter((wid) => !existingIds.has(wid))
            .map(makeExecution)
            .filter((e): e is TaskExecution => e !== null);
          // Remove executions for wallets no longer assigned
          const keep = t.executions.filter((e) => walletIds.includes(e.walletId));
          return { ...t, executions: [...keep, ...toAdd] };
        })
      );
    },
    []
  );

  const value: StoreState = React.useMemo(
    () => ({
      projects,
      tasks,
      inboxItems,
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
    }),
    [
      projects,
      tasks,
      inboxItems,
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
    ],
  );

  return React.createElement(StoreContext.Provider, { value }, children);
}

export function useStore(): StoreState {
  const ctx = React.useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
