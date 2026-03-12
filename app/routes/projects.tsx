import React from "react";
import { Search, FolderOpen } from "lucide-react";
import classNames from "classnames";
import type { Route } from "./+types/projects";
import { ProjectCard } from "~/components/project-card";
import { mockProjects, type ProjectStatus, type CostType } from "~/data/projects";
import styles from "./projects.module.css";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Project Directory - AirdropPulse" },
    {
      name: "description",
      content: "Browse and manage all your airdrop opportunities",
    },
  ];
}

export default function Projects() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<ProjectStatus | "all">("all");
  const [costFilter, setCostFilter] = React.useState<CostType | "all">("all");

  const filteredProjects = mockProjects.filter((project) => {
    const matchesSearch =
      searchQuery === "" ||
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    const matchesCost = costFilter === "all" || project.costType === costFilter;

    return matchesSearch && matchesStatus && matchesCost;
  });

  const totalProjects = filteredProjects.length;
  const activeProjects = filteredProjects.filter((p) => p.status === "active" || p.status === "snapshot").length;
  const completedTasks = filteredProjects.reduce((acc, p) => acc + p.tasks.filter((t) => t.completed).length, 0);

  return (
    <main className={styles.projects}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Project Directory</h1>
          <p className={styles.subtitle}>Searchable database of all your airdrop opportunities</p>
        </header>

        <div className={styles.controls}>
          <input
            type="text"
            placeholder="Search projects..."
            className={styles.searchBar}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <div className={styles.filterLabel}>Status</div>
            <div className={styles.filterButtons}>
              <button
                className={classNames(styles.filterButton, {
                  [styles.filterButtonActive]: statusFilter === "all",
                })}
                onClick={() => setStatusFilter("all")}
              >
                All
              </button>
              <button
                className={classNames(styles.filterButton, {
                  [styles.filterButtonActive]: statusFilter === "discovery",
                })}
                onClick={() => setStatusFilter("discovery")}
              >
                Discovery
              </button>
              <button
                className={classNames(styles.filterButton, {
                  [styles.filterButtonActive]: statusFilter === "active",
                })}
                onClick={() => setStatusFilter("active")}
              >
                Active
              </button>
              <button
                className={classNames(styles.filterButton, {
                  [styles.filterButtonActive]: statusFilter === "snapshot",
                })}
                onClick={() => setStatusFilter("snapshot")}
              >
                Snapshot
              </button>
              <button
                className={classNames(styles.filterButton, {
                  [styles.filterButtonActive]: statusFilter === "claiming",
                })}
                onClick={() => setStatusFilter("claiming")}
              >
                Claiming
              </button>
            </div>
          </div>

          <div className={styles.filterGroup}>
            <div className={styles.filterLabel}>Cost</div>
            <div className={styles.filterButtons}>
              <button
                className={classNames(styles.filterButton, {
                  [styles.filterButtonActive]: costFilter === "all",
                })}
                onClick={() => setCostFilter("all")}
              >
                All
              </button>
              <button
                className={classNames(styles.filterButton, {
                  [styles.filterButtonActive]: costFilter === "free",
                })}
                onClick={() => setCostFilter("free")}
              >
                Free
              </button>
              <button
                className={classNames(styles.filterButton, {
                  [styles.filterButtonActive]: costFilter === "paid",
                })}
                onClick={() => setCostFilter("paid")}
              >
                Paid
              </button>
            </div>
          </div>
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <div className={styles.statValue}>{totalProjects}</div>
            <div className={styles.statLabel}>Total Projects</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statValue}>{activeProjects}</div>
            <div className={styles.statLabel}>Active</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statValue}>{completedTasks}</div>
            <div className={styles.statLabel}>Tasks Completed</div>
          </div>
        </div>

        <div className={styles.grid}>
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => <ProjectCard key={project.id} project={project} />)
          ) : (
            <div className={styles.emptyState}>
              <FolderOpen className={styles.emptyIcon} />
              <h3 className={styles.emptyTitle}>No Projects Found</h3>
              <p>Try adjusting your filters or search query</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
