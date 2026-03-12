import { Link } from "react-router";
import { Calendar, DollarSign, TrendingUp, CheckCircle2 } from "lucide-react";
import classNames from "classnames";
import type { Project } from "~/data/projects";
import styles from "./project-card.module.css";

interface ProjectCardProps {
  /**
   * The project data to display
   * @important
   */
  project: Project;
  className?: string;
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  const completedTasks = project.tasks.filter((t) => t.completed).length;
  const totalTasks = project.tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <Link to={`/projects/${project.id}`} className={classNames(styles.card, className)}>
      <div className={styles.imageContainer}>
        <img src={project.imageUrl} alt={project.name} className={styles.image} />
        <span
          className={classNames(styles.statusBadge, {
            [styles.statusDiscovery]: project.status === "discovery",
            [styles.statusActive]: project.status === "active",
            [styles.statusSnapshot]: project.status === "snapshot",
            [styles.statusClaiming]: project.status === "claiming",
            [styles.statusClaimed]: project.status === "claimed",
          })}
        >
          {project.status}
        </span>
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.title}>{project.name}</h3>
          <div className={styles.meta}>
            <span className={styles.badge}>{project.category}</span>
            <span className={styles.badge}>{project.costType}</span>
            {project.chain.slice(0, 2).map((chain) => (
              <span key={chain} className={styles.badge}>
                {chain}
              </span>
            ))}
          </div>
        </div>

        <p className={styles.description}>{project.description}</p>

        <div className={styles.stats}>
          {project.fundingAmount && (
            <div className={styles.statRow}>
              <span className={styles.statLabel}>
                <DollarSign className={styles.icon} />
                Funding
              </span>
              <span className={styles.statValue}>{project.fundingAmount}</span>
            </div>
          )}
          <div className={styles.statRow}>
            <span className={styles.statLabel}>
              <TrendingUp className={styles.icon} />
              Potential
            </span>
            <span className={styles.statValue}>{project.potentialValue}</span>
          </div>
          {project.snapshotDate && (
            <div className={styles.statRow}>
              <span className={styles.statLabel}>
                <Calendar className={styles.icon} />
                Snapshot
              </span>
              <span className={styles.statValue}>{new Date(project.snapshotDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        <div className={styles.progress}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
          <span className={styles.progressText}>
            {completedTasks} of {totalTasks} tasks completed
          </span>
        </div>
      </div>

      <div className={styles.footer}>
        <span
          className={classNames(styles.priorityBadge, {
            [styles.priorityHigh]: project.priority === "high",
            [styles.priorityMedium]: project.priority === "medium",
            [styles.priorityLow]: project.priority === "low",
          })}
        >
          {project.priority}
        </span>
        <CheckCircle2 className={styles.icon} />
      </div>
    </Link>
  );
}
