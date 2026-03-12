import { Link } from "react-router";
import { Calendar, DollarSign, TrendingUp, CheckCircle2, Flame, Zap, Shield } from "lucide-react";
import classNames from "classnames";
import type { Project } from "~/data/projects";
import styles from "./project-card.module.css";

interface ProjectCardProps {
  project: Project;
  className?: string;
}

const RISK_STYLES: Record<string, string> = {
  low: "riskLow",
  medium: "riskMedium",
  high: "riskHigh",
  critical: "riskCritical",
};

export function ProjectCard({ project, className }: ProjectCardProps) {
  const completedTasks = project.tasks.filter((t) => t.completed).length;
  const totalTasks = project.tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <Link to={`/projects/${project.id}`} className={classNames(styles.card, className)}>
      <div className={styles.imageContainer}>
        <img src={project.imageUrl} alt={project.name} className={styles.image} />
        <div className={styles.imageBadges}>
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
          <div className={styles.imageBadgesRight}>
            {project.isHot && (
              <span className={styles.hotBadge}>
                <Flame size={11} /> Hot
              </span>
            )}
            {project.isNew && (
              <span className={styles.newBadge}>
                <Zap size={11} /> New
              </span>
            )}
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.title}>{project.name}</h3>
          <div className={styles.meta}>
            <span className={styles.badge}>{project.category}</span>
            {project.chain.slice(0, 2).map((chain) => (
              <span key={chain} className={styles.badge}>{chain}</span>
            ))}
          </div>
        </div>

        <p className={styles.description}>{project.description}</p>

        {/* Ecosystem tags */}
        <div className={styles.ecosystemTags}>
          {project.ecosystem.slice(0, 3).map((e) => (
            <span key={e} className={styles.ecoTag}>{e}</span>
          ))}
        </div>

        <div className={styles.stats}>
          {project.fundingAmount && (
            <div className={styles.statRow}>
              <span className={styles.statLabel}>
                <DollarSign className={styles.icon} /> Funding
              </span>
              <span className={styles.statValue}>{project.fundingAmount}</span>
            </div>
          )}
          <div className={styles.statRow}>
            <span className={styles.statLabel}>
              <TrendingUp className={styles.icon} /> Hype
            </span>
            <div className={styles.hypeDisplay}>
              <span className={styles.hypeNum}>{project.hypeScore}</span>
              <div className={styles.hypeBar}>
                <div className={styles.hypeBarFill} style={{ width: `${project.hypeScore}%` }} />
              </div>
            </div>
          </div>
          {project.snapshotDate && (
            <div className={styles.statRow}>
              <span className={styles.statLabel}>
                <Calendar className={styles.icon} /> Snapshot
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
          {project.priority} priority
        </span>
        <div className={styles.footerRight}>
          <Shield size={13} className={classNames(styles.riskIcon, styles[RISK_STYLES[project.riskLevel]])} />
          <CheckCircle2 size={13} className={styles.icon} />
          <span className={styles.footerTaskCount}>{completedTasks}/{totalTasks}</span>
        </div>
      </div>
    </Link>
  );
}
