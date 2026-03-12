import React from "react";
import { Search, FolderOpen, LayoutGrid, List, Flame, Zap, TrendingUp, DollarSign } from "lucide-react";
import classNames from "classnames";
import { Link } from "react-router";
import type { Route } from "./+types/projects";
import { ProjectCard } from "~/components/project-card";
import { mockProjects, type ProjectStatus, type CostType, type Chain } from "~/data/projects";
import styles from "./projects.module.css";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Project Directory - AirdropPulse" },
    { name: "description", content: "Browse and manage all your airdrop opportunities" },
  ];
}

const ECOSYSTEMS = ["All", "Layer 1", "Layer 2", "ZK Rollup", "DeFi", "AI", "Cross-chain", "Modular"];

const POTENTIAL_COLORS: Record<string, string> = {
  low: "potentialLow",
  medium: "potentialMedium",
  high: "potentialHigh",
  "very-high": "potentialVeryHigh",
};

export default function Projects() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<ProjectStatus | "all">("all");
  const [costFilter, setCostFilter] = React.useState<CostType | "all">("all");
  const [ecosystemFilter, setEcosystemFilter] = React.useState("All");
  const [viewMode, setViewMode] = React.useState<"grid" | "table">("grid");

  const filteredProjects = mockProjects.filter((project) => {
    const matchesSearch =
      searchQuery === "" ||
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.ecosystem.some((e) => e.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    const matchesCost = costFilter === "all" || project.costType === costFilter;
    const matchesEcosystem =
      ecosystemFilter === "All" || project.ecosystem.some((e) => e.toLowerCase().includes(ecosystemFilter.toLowerCase()));

    return matchesSearch && matchesStatus && matchesCost && matchesEcosystem;
  });

  const totalProjects = filteredProjects.length;
  const activeProjects = filteredProjects.filter((p) => p.status === "active" || p.status === "snapshot").length;
  const completedTasks = filteredProjects.reduce((acc, p) => acc + p.tasks.filter((t) => t.completed).length, 0);
  const totalFunding = filteredProjects
    .filter((p) => p.fundingAmount)
    .reduce((acc, p) => {
      const match = p.fundingAmount?.match(/[\d.]+/);
      return acc + (match ? parseFloat(match[0]) : 0);
    }, 0);

  return (
    <main className={styles.projects}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Project Directory</h1>
            <p className={styles.subtitle}>Intelligence hub for all your airdrop opportunities</p>
          </div>
          <div className={styles.viewToggle}>
            <button
              className={classNames(styles.viewButton, { [styles.viewButtonActive]: viewMode === "grid" })}
              onClick={() => setViewMode("grid")}
              title="Grid View"
            >
              <LayoutGrid size={18} />
            </button>
            <button
              className={classNames(styles.viewButton, { [styles.viewButtonActive]: viewMode === "table" })}
              onClick={() => setViewMode("table")}
              title="Table View"
            >
              <List size={18} />
            </button>
          </div>
        </header>

        {/* Stats */}
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
            <div className={styles.statLabel}>Tasks Done</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statValue}>${totalFunding}M+</div>
            <div className={styles.statLabel}>Total Funding</div>
          </div>
        </div>

        {/* Controls */}
        <div className={styles.controls}>
          <div className={styles.searchWrapper}>
            <Search className={styles.searchIcon} size={16} />
            <input
              type="text"
              placeholder="Search projects, ecosystems..."
              className={styles.searchBar}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Filters */}
        <div className={styles.filterRow}>
          <div className={styles.filterGroup}>
            <div className={styles.filterLabel}>Status</div>
            <div className={styles.filterButtons}>
              {(["all", "discovery", "active", "snapshot", "claiming", "claimed"] as const).map((s) => (
                <button
                  key={s}
                  className={classNames(styles.filterButton, { [styles.filterButtonActive]: statusFilter === s })}
                  onClick={() => setStatusFilter(s)}
                >
                  {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.filterGroup}>
            <div className={styles.filterLabel}>Cost</div>
            <div className={styles.filterButtons}>
              {(["all", "free", "paid"] as const).map((c) => (
                <button
                  key={c}
                  className={classNames(styles.filterButton, { [styles.filterButtonActive]: costFilter === c })}
                  onClick={() => setCostFilter(c)}
                >
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.filterGroup}>
            <div className={styles.filterLabel}>Ecosystem</div>
            <div className={styles.filterButtons}>
              {ECOSYSTEMS.map((e) => (
                <button
                  key={e}
                  className={classNames(styles.filterButton, { [styles.filterButtonActive]: ecosystemFilter === e })}
                  onClick={() => setEcosystemFilter(e)}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results count + priority highlights */}
        <div className={styles.resultsBar}>
          <span className={styles.resultsCount}>
            {filteredProjects.length} project{filteredProjects.length !== 1 ? "s" : ""}
          </span>
          <div className={styles.highlights}>
            {mockProjects.filter((p) => p.isHot).length > 0 && (
              <span className={styles.highlightBadge}>
                <Flame size={12} /> {mockProjects.filter((p) => p.isHot).length} Hot
              </span>
            )}
            {mockProjects.filter((p) => p.isNew).length > 0 && (
              <span className={classNames(styles.highlightBadge, styles.highlightNew)}>
                <Zap size={12} /> {mockProjects.filter((p) => p.isNew).length} New
              </span>
            )}
            {mockProjects.filter((p) => p.snapshotDate).length > 0 && (
              <span className={classNames(styles.highlightBadge, styles.highlightDeadline)}>
                {mockProjects.filter((p) => p.snapshotDate).length} Snapshot Upcoming
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        {filteredProjects.length === 0 ? (
          <div className={styles.emptyState}>
            <FolderOpen className={styles.emptyIcon} />
            <h3 className={styles.emptyTitle}>No Projects Found</h3>
            <p>Try adjusting your filters or search query</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className={styles.grid}>
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Status</th>
                  <th>Ecosystem</th>
                  <th><TrendingUp size={12} /> Hype</th>
                  <th><DollarSign size={12} /> Funding</th>
                  <th>Potential</th>
                  <th>Progress</th>
                  <th>Cost</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => {
                  const done = project.tasks.filter((t) => t.completed).length;
                  const total = project.tasks.length;
                  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                  return (
                    <tr key={project.id}>
                      <td>
                        <div className={styles.tableProjectCell}>
                          <img src={project.imageUrl} alt={project.name} className={styles.tableThumb} />
                          <div>
                            <div className={styles.tableProjectName}>
                              {project.name}
                              {project.isHot && <Flame size={12} className={styles.hotIcon} />}
                              {project.isNew && <Zap size={12} className={styles.newIcon} />}
                            </div>
                            <div className={styles.tableProjectCategory}>{project.category}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={classNames(styles.tableStatus, styles[`tableStatus_${project.status}`])}>
                          {project.status}
                        </span>
                      </td>
                      <td>
                        <div className={styles.tableEcosystem}>
                          {project.ecosystem.slice(0, 2).map((e) => (
                            <span key={e} className={styles.tableEcoTag}>{e}</span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <div className={styles.tableHype}>
                          <span className={styles.tableHypeValue}>{project.hypeScore}</span>
                          <div className={styles.tableHypeBar}>
                            <div style={{ width: `${project.hypeScore}%` }} className={styles.tableHypeBarFill} />
                          </div>
                        </div>
                      </td>
                      <td className={styles.tableFunding}>{project.fundingAmount ?? "—"}</td>
                      <td>
                        <span className={classNames(styles.tablePotential, styles[POTENTIAL_COLORS[project.potentialValue]])}>
                          {project.potentialValue}
                        </span>
                      </td>
                      <td>
                        <div className={styles.tableProgress}>
                          <div className={styles.tableProgressBar}>
                            <div className={styles.tableProgressFill} style={{ width: `${pct}%` }} />
                          </div>
                          <span>{pct}%</span>
                        </div>
                      </td>
                      <td>
                        <span className={classNames(styles.tableCost, { [styles.tableCostPaid]: project.costType === "paid" })}>
                          {project.costType === "paid" ? project.estimatedCost ?? "Paid" : "Free"}
                        </span>
                      </td>
                      <td>
                        <Link to={`/projects/${project.id}`} className={styles.tableViewBtn}>
                          View →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
