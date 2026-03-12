/**
 * Shared in-memory store for Projects and Tasks.
 * Uses React context so any route can read/write the same data.
 */
import React from "react";
import { mockProjects, type Project } from "~/data/projects";
import { mockTasks, type Task } from "~/data/tasks";

interface StoreState {
  projects: Project[];
  tasks: Task[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  addProject: (p: Project) => void;
  updateProject: (p: Project) => void;
  deleteProject: (id: string) => void;
  addTask: (t: Task) => void;
  updateTask: (t: Task) => void;
  deleteTask: (id: string) => void;
}

const StoreContext = React.createContext<StoreState | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = React.useState<Project[]>(mockProjects);
  const [tasks, setTasks] = React.useState<Task[]>(mockTasks);

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

  const value: StoreState = React.useMemo(
    () => ({ projects, tasks, setProjects, setTasks, addProject, updateProject, deleteProject, addTask, updateTask, deleteTask }),
    [projects, tasks, addProject, updateProject, deleteProject, addTask, updateTask, deleteTask],
  );

  return React.createElement(StoreContext.Provider, { value }, children);
}

export function useStore(): StoreState {
  const ctx = React.useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
