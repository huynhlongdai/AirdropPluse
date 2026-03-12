import React from "react";
import { List, LayoutGrid, CalendarDays, AlertCircle, Plus } from "lucide-react";
import classNames from "classnames";
import { toast } from "sonner";
import type { Route } from "./+types/tasks";
import type { Task } from "~/data/tasks";
import { useStore } from "~/hooks/use-store";
import TaskListView from "~/components/tasks/task-list-view";
import TaskBoardView from "~/components/tasks/task-board-view";
import TaskCalendarView from "~/components/tasks/task-calendar-view";
import TaskDetailPanel from "~/components/tasks/task-detail-panel";
import TaskFormDrawer from "~/components/tasks/task-form-drawer";
import ConfirmDeleteDialog from "~/components/confirm-delete-dialog";
import styles from "./tasks.module.css";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Tasks - AirdropPulse" },
    { name: "description", content: "Manage and track all airdrop tasks across projects and wallets" },
  ];
}

type ViewMode = "list" | "board" | "calendar";

export default function Tasks() {
  const { tasks, projects, addTask, updateTask, deleteTask } = useStore();

  const [view, setView] = React.useState<ViewMode>("board");
  const [filterType, setFilterType] = React.useState("all");
  const [filterStatus, setFilterStatus] = React.useState("all");
  const [filterProject, setFilterProject] = React.useState("all");
  const [filterPriority, setFilterPriority] = React.useState("all");
  const [todayFocus, setTodayFocus] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);
  const [showForm, setShowForm] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = React.useState<Task | null>(null);

  const projectNames = React.useMemo(() => {
    const names = tasks.map((t) => t.projectName).filter(Boolean) as string[];
    return [...new Set(names)];
  }, [tasks]);

  const filteredTasks = React.useMemo(() => {
    let filtered: Task[] = tasks;
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.projectName?.toLowerCase().includes(q) ?? false) ||
          (t.description?.toLowerCase().includes(q) ?? false),
      );
    }
    if (filterType !== "all") filtered = filtered.filter((t) => t.type === filterType);
    if (filterStatus !== "all") filtered = filtered.filter((t) => t.status === filterStatus);
    if (filterProject !== "all") filtered = filtered.filter((t) => t.projectName === filterProject);
    if (filterPriority !== "all") filtered = filtered.filter((t) => t.priority === filterPriority);
    if (todayFocus) {
      const now = Date.now();
      filtered = filtered.filter((t) => {
        if (t.recurring === "daily") return true;
        if (!t.deadline) return false;
        const diff = new Date(t.deadline).getTime() - now;
        return diff > 0 && diff < 24 * 60 * 60 * 1000;
      });
    }
    return filtered;
  }, [tasks, search, filterType, filterStatus, filterProject, filterPriority, todayFocus]);

  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const inProgress = tasks.filter((t) => t.status === "in-progress").length;
  const overdue = tasks.filter((t) => t.isOverdue).length;
  const daily = tasks.filter((t) => t.recurring === "daily").length;

  function handleTaskClick(task: Task) {
    setSelectedTask(task);
  }

  function handleTaskUpdate(updatedTask: Task) {
    updateTask(updatedTask);
    setSelectedTask(updatedTask);
  }

  function handleSaveTask(task: Task) {
    if (editingTask) {
      updateTask(task);
    } else {
      addTask(task);
    }
  }

  function handleDeleteConfirm() {
    if (!deletingTask) return;
    deleteTask(deletingTask.id);
    toast.success(`Task "${deletingTask.title}" deleted.`);
    if (selectedTask?.id === deletingTask.id) setSelectedTask(null);
    setDeletingTask(null);
  }

  function openEditTask(task: Task) {
    setEditingTask(task);
    setShowForm(true);
    setSelectedTask(null);
  }

  function openDeleteTask(task: Task) {
    setDeletingTask(task);
  }

  function handleFormClose() {
    setShowForm(false);
    setEditingTask(null);
  }

  return (
    <main className={styles.tasks}>
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>Task Manager</h1>
            <p className={styles.subtitle}>
              Coordinate missions across all projects, wallets, and identities
            </p>
          </div>
          <button className={styles.addButton} onClick={() => { setEditingTask(null); setShowForm(true); }} type="button">
            <Plus size={16} /> New Task
          </button>
        </header>

        {/* Stats bar */}
        <div className={styles.statsBar}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Total Tasks</span>
            <span className={styles.statValue}>{total}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>In Progress</span>
            <span className={classNames(styles.statValue, styles.statValueAccent)}>{inProgress}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Completed</span>
            <span className={classNames(styles.statValue, styles.statValueSuccess)}>{completed}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Overdue</span>
            <span className={classNames(styles.statValue, styles.statValueError)}>{overdue}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Daily Tasks</span>
            <span className={classNames(styles.statValue, styles.statValueWarning)}>{daily}</span>
          </div>
        </div>

        {/* Toolbar */}
        <div className={styles.toolbar}>
          <div className={styles.viewToggle}>
            <button
              className={classNames(styles.viewButton, { [styles.viewButtonActive]: view === "list" })}
              onClick={() => setView("list")}
              type="button"
            >
              <List size={16} /> List
            </button>
            <button
              className={classNames(styles.viewButton, { [styles.viewButtonActive]: view === "board" })}
              onClick={() => setView("board")}
              type="button"
            >
              <LayoutGrid size={16} /> Board
            </button>
            <button
              className={classNames(styles.viewButton, { [styles.viewButtonActive]: view === "calendar" })}
              onClick={() => setView("calendar")}
              type="button"
            >
              <CalendarDays size={16} /> Calendar
            </button>
          </div>

          <button
            className={classNames(styles.todayFocusButton, { [styles.todayFocusActive]: todayFocus })}
            onClick={() => setTodayFocus((v) => !v)}
            type="button"
          >
            <AlertCircle size={14} />
            Today&apos;s Focus
          </button>

          <div className={styles.filterGroup}>
            <select className={styles.filterSelect} value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="all">All Types</option>
              <option value="onchain">On-chain</option>
              <option value="social">Social</option>
              <option value="daily-checkin">Daily Check-in</option>
              <option value="one-time">One-time</option>
            </select>

            <select className={styles.filterSelect} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="backlog">Backlog</option>
              <option value="in-progress">In Progress</option>
              <option value="review">Review</option>
              <option value="completed">Completed</option>
            </select>

            <select className={styles.filterSelect} value={filterProject} onChange={(e) => setFilterProject(e.target.value)}>
              <option value="all">All Projects</option>
              {projectNames.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>

            <select className={styles.filterSelect} value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Content */}
        {filteredTasks.length === 0 ? (
          <div className={styles.emptyState}>
            No tasks match your filters.
            {' '}
            <button className={styles.emptyAddBtn} onClick={() => setShowForm(true)} type="button">Create a task</button>
          </div>
        ) : view === "list" ? (
          <TaskListView tasks={filteredTasks} onTaskClick={handleTaskClick} onEditTask={openEditTask} onDeleteTask={openDeleteTask} />
        ) : view === "board" ? (
          <TaskBoardView tasks={filteredTasks} onTaskClick={handleTaskClick} onEditTask={openEditTask} onDeleteTask={openDeleteTask} />
        ) : (
          <TaskCalendarView tasks={filteredTasks} onTaskClick={handleTaskClick} />
        )}
      </div>

      {selectedTask && (
        <TaskDetailPanel
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onTaskUpdate={handleTaskUpdate}
        />
      )}

      {showForm && (
        <TaskFormDrawer
          task={editingTask}
          projects={projects}
          onClose={handleFormClose}
          onSave={handleSaveTask}
        />
      )}

      {deletingTask && (
        <ConfirmDeleteDialog
          title={`Delete "${deletingTask.title}"?`}
          description="This task will be permanently removed from your task manager."
          onCancel={() => setDeletingTask(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </main>
  );
}
