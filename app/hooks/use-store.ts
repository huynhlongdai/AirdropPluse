/**
 * Shared in-memory store for Projects, Tasks, and Inbox items.
 * Uses React context so any route can read/write the same data.
 */
import React from "react";
import { mockProjects, type Project } from "~/data/projects";
import { mockTasks, type Task } from "~/data/tasks";
import { mockInboxItems, type InboxItem } from "~/data/inbox";

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
    ],
  );

  return React.createElement(StoreContext.Provider, { value }, children);
}

export function useStore(): StoreState {
  const ctx = React.useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
