import { Link } from "react-router";
import { Flame, Zap, TrendingUp, Clock, Wallet } from "lucide-react";
import classNames from "classnames";
import type { Project } from "~/data/projects";
import styles from "./project-card.module.css";

interface ProjectCardProps {
  project: Project;
  className?: string;
}

// Gradient per category
const CATEGORY_GRADIENTS: Record<string, string> = {
  mainnet:   "linear-gradient(135deg, #1e3a5f 0%, #2d5986 100%)",
  testnet:   "linear-gradient(135deg, #1a3a2e 0%, #2d6b52 100%)",
  galxe:     "linear-gradient(135deg, #2d1b4e 0%, #5a2d91 100%)",
  zealy:     "linear-gradient(135deg, #3d1a1a 0%, #7c3a3a 100%)",
  layer3:    "linear-gradient(135deg, #1a2a3d 0%, #2d4a6e 100%)",
  social:    "linear-gradient(135deg, #1a1a3d 0%, #2d2d7c 100%)",
  defi:      "linear-gradient(135deg, #1a3a1a 0%, #2d7c2d 100%)",
  nft:       "linear-gradient(135deg, #3d1a3a 0%, #7c2d6e 100%)",
  ai:        "linear-gradient(135deg, #1a2d3a 0%, #1a5a6e 100%)",
  other:     "linear-gradient(135deg, #2a2a2a 0%, #4a4a4a 100%)",
};

const CHAIN_COLORS: Record<string, string> = {
  ethereum: "#627EEA", eth: "#627EEA",
  bsc: "#F0B90B", bnb: "#F0B90B",
  arbitrum: "#4dabf7", arb: "#4dabf7",
  optimism: "#FF0420", op: "#FF0420",
  base: "#0052FF",
  zksync: "#8B6EF5",
  solana: "#9945FF", sol: "#9945FF",
  sui: "#4DA2FF",
  starknet: "#E97A2D",
  polygon: "#8247E5",
  avalanche: "#E84142", avax: "#E84142",
};

const POTENTIAL_COLOR: Record<string, string> = {
  "very-high": "#c9a028",
  high:        "#22c55e",
  medium:      "#3b82f6",
  low:         "#a1a1aa",
};

const STATUS_COLOR: Record<string, string> = {
  discovery: "#a1a1aa",
  active:    "#22c55e",
  snapshot:  "#c9a028",
  claiming:  "#f59e0b",
  claimed:   "#6366f1",
  archived:  "#71717a",
};

export function ProjectCard({ project, className }: ProjectCardProps) {
  const completedTasks = project.tasks.filter((t) => t.completed).length;
  const totalTasks = project.tasks.length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const gradient = CATEGORY_GRADIENTS[project.category] ?? CATEGORY_GRADIENTS.other;
  const potentialColor = POTENTIAL_COLOR[project.potentialValue] ?? "#a1a1aa";
  const statusColor = STATUS_COLOR[project.status] ?? "#a1a1aa";

  // Hype score ring
  const hypeColor = project.hypeScore >= 80 ? "#22c55e" : project.hypeScore >= 60 ? "#c9a028" : "#ef4444";
  const circumference = 2 * Math.PI * 16;
  const hypeOffset = circumference - (project.hypeScore / 100) * circumference;

  return (
    <Link to={`/projects/${project.id}`} className={classNames(styles.card, className)}>
      {/* ── Gradient header ── */}
      <div className={styles.header} style={{ background: gradient }}>
        <div className={styles.headerTop}>
          <span className={styles.statusPill} style={{ background: `${statusColor}22`, color: statusColor, borderColor: `${statusColor}55` }}>
            {project.status}
          </span>
          <div className={styles.headerBadges}>
            {project.isHot && <span className={styles.hotBadge}><Flame size={10}/> Hot</span>}
            {project.isNew && <span className={styles.newBadge}><Zap size={10}/> New</span>}
          </div>
        </div>
        <div className={styles.headerBottom}>
          <h3 className={styles.title}>{project.name}</h3>
          <div className={styles.chainPills}>
            {project.chain.slice(0, 3).map((c) => (
              <span key={c} className={styles.chainPill} style={{ background: `${CHAIN_COLORS[c] ?? "#666"}33`, color: CHAIN_COLORS[c] ?? "#aaa", borderColor: `${CHAIN_COLORS[c] ?? "#666"}66` }}>
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className={styles.body}>
        <p className={styles.description}>{project.description}</p>

        {/* ── Ecosystem tags ── */}
        <div className={styles.ecoRow}>
          {project.ecosystem.slice(0, 3).map((e) => (
            <span key={e} className={styles.ecoTag}>{e}</span>
          ))}
        </div>

        {/* ── Metrics row ── */}
        <div className={styles.metrics}>
          {/* Hype score ring */}
          <div className={styles.hypeRing}>
            <svg width="40" height="40" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="16" fill="none" stroke="#e4e4e7" strokeWidth="3.5" />
              <circle
                cx="20" cy="20" r="16"
                fill="none"
                stroke={hypeColor}
                strokeWidth="3.5"
                strokeDasharray={circumference}
                strokeDashoffset={hypeOffset}
                strokeLinecap="round"
                transform="rotate(-90 20 20)"
              />
            </svg>
            <div className={styles.hypeInner}>
              <span className={styles.hypeNum} style={{ color: hypeColor }}>{project.hypeScore}</span>
            </div>
          </div>

          <div className={styles.metricsRight}>
            {project.fundingAmount && (
              <div className={styles.metricItem}>
                <span className={styles.metricLabel}>Funding</span>
                <span className={styles.metricVal} style={{ color: "#c9a028" }}>{project.fundingAmount}</span>
              </div>
            )}
            <div className={styles.metricItem}>
              <span className={styles.metricLabel}>Potential</span>
              <span className={styles.metricVal} style={{ color: potentialColor }}>
                {project.potentialValue === "very-high" ? "⚡ Very High" : project.potentialValue}
              </span>
            </div>
          </div>
        </div>

        {/* ── Progress bar ── */}
        <div className={styles.progressSection}>
          <div className={styles.progressRow}>
            <span className={styles.progressLabel}>
              <Wallet size={10}/> {completedTasks}/{totalTasks} tasks
            </span>
            <span className={styles.progressPct} style={{ color: progress >= 80 ? "#22c55e" : progress >= 40 ? "#c9a028" : "#ef4444" }}>
              {progress}%
            </span>
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{
              width: `${progress}%`,
              background: progress >= 80 ? "#22c55e" : progress >= 40 ? "#c9a028" : "#ef4444"
            }} />
          </div>
        </div>

        {/* ── Footer ── */}
        {project.snapshotDate && (
          <div className={styles.snapshotRow}>
            <Clock size={11} />
            <span>Snapshot: {project.snapshotDate}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
