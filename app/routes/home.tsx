import { Link } from "react-router";
import {
  Rocket, TrendingUp, CheckCircle2, ArrowRight, Wallet,
  Activity, Users, AlertCircle, Flame, Clock, Bot, CalendarDays, Zap
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import type { Route } from "./+types/home";
import { mockProjects } from "~/data/projects";
import { mockTasks } from "~/data/tasks";
import { mockMainWallets } from "~/data/wallets";
import { mockIdentities } from "~/data/identities";
import styles from "./home.module.css";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard — AirdropPulse" },
    { name: "description", content: "Airdrop intelligence dashboard" },
  ];
}

// ── Fake activity data (7-day trend) ────────────────────────────
const activityData = [
  { day: "Mon", tasks: 3, value: 120 },
  { day: "Tue", tasks: 7, value: 340 },
  { day: "Wed", tasks: 4, value: 280 },
  { day: "Thu", tasks: 9, value: 520 },
  { day: "Fri", tasks: 5, value: 410 },
  { day: "Sat", tasks: 2, value: 190 },
  { day: "Sun", tasks: 6, value: 380 },
];

const TASK_PIE_COLORS = ["#22c55e", "#f59e0b", "#3b82f6", "#e5e7eb"];

export default function Home() {
  const activeProjects = mockProjects.filter((p) => p.status === "active" || p.status === "snapshot");
  const hotProjects    = mockProjects.filter((p) => p.isHot);
  const snapshotSoon   = mockProjects.filter((p) => p.snapshotDate).slice(0, 3);
  const highPriority   = mockProjects.filter((p) => p.priority === "high").slice(0, 4);

  const totalTasks     = mockTasks.length;
  const completedTasks = mockTasks.filter((t) => t.status === "completed").length;
  const inProgressTasks = mockTasks.filter((t) => t.status === "in-progress").length;
  const backlogTasks   = mockTasks.filter((t) => t.status === "backlog").length;
  const overdueTasks   = mockTasks.filter((t) => t.isOverdue).length;

  const taskProgress   = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const totalSubWallets = mockMainWallets.reduce((acc, w) => acc + w.subWallets.length, 0);
  const activeIdentities = mockIdentities.filter((i) => i.status === "active").length;

  const taskPieData = [
    { name: "Completed", value: completedTasks },
    { name: "In Progress", value: inProgressTasks },
    { name: "Backlog", value: backlogTasks },
    { name: "Review", value: mockTasks.filter((t) => t.status === "review").length },
  ];

  return (
    <main className={styles.page}>
      {/* ── Top header ── */}
      <div className={styles.topBar}>
        <div>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          <p className={styles.pageSubtitle}>
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
        </div>
        <Link to="/tasks" className={styles.newTaskBtn}>
          <Zap size={14} /> Quick Task
        </Link>
      </div>

      {/* ── Hero stats row ── */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statTop}>
            <span className={styles.statLabel}>Active Campaigns</span>
            <span className={`${styles.statIconWrap} ${styles.iconGold}`}><Rocket size={16}/></span>
          </div>
          <div className={styles.statNum}>{activeProjects.length}</div>
          <div className={styles.statSub}>
            <TrendingUp size={12}/> {hotProjects.length} hot right now
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statTop}>
            <span className={styles.statLabel}>Task Progress</span>
            <span className={`${styles.statIconWrap} ${styles.iconGreen}`}><CheckCircle2 size={16}/></span>
          </div>
          <div className={styles.statNum}>{completedTasks}<span className={styles.statNumSub}>/{totalTasks}</span></div>
          <div className={styles.statBar}>
            <div className={styles.statBarFill} style={{ width: `${taskProgress}%` }} />
          </div>
          <div className={styles.statSub}>{taskProgress}% complete</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statTop}>
            <span className={styles.statLabel}>Wallets Active</span>
            <span className={`${styles.statIconWrap} ${styles.iconBlue}`}><Wallet size={16}/></span>
          </div>
          <div className={styles.statNum}>{totalSubWallets}</div>
          <div className={styles.statSub}>
            <Users size={12}/> {activeIdentities} identities
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statTop}>
            <span className={styles.statLabel}>Overdue Tasks</span>
            <span className={`${styles.statIconWrap} ${styles.iconRed}`}><AlertCircle size={16}/></span>
          </div>
          <div className={styles.statNum}>{overdueTasks}</div>
          <div className={styles.statSub}>
            <Clock size={12}/> Needs attention
          </div>
        </div>
      </div>

      {/* ── Main content: chart + dark card ── */}
      <div className={styles.mainRow}>
        {/* Left: Activity chart */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <div>
              <div className={styles.chartTitle}>Task Activity</div>
              <div className={styles.chartSub}>Last 7 days</div>
            </div>
            <span className={styles.chartBadge}>Weekly View</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="taskGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#c9a028" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#c9a028" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-neutral-4, #e8e8ec)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--color-neutral-9, #8b8d98)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--color-neutral-9, #8b8d98)" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "#fff", border: "1px solid #e4e4e7", borderRadius: 8, fontSize: 12 }}
                labelStyle={{ fontWeight: 600 }}
              />
              <Area type="monotone" dataKey="tasks" stroke="#c9a028" strokeWidth={2} fill="url(#taskGradient)" dot={{ r: 3, fill: "#c9a028" }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Right: Dark priority card */}
        <div className={styles.darkCard}>
          <div className={styles.darkCardHeader}>
            <Flame size={16} className={styles.darkCardIcon} />
            <span>Priority Alerts</span>
          </div>
          {snapshotSoon.length > 0 ? (
            <div className={styles.alertList}>
              {snapshotSoon.map((p) => (
                <Link key={p.id} to={`/projects/${p.id}`} className={styles.alertItem}>
                  <div className={styles.alertName}>{p.name}</div>
                  <div className={styles.alertMeta}>
                    <Clock size={10} />
                    Snapshot: {p.snapshotDate}
                  </div>
                  <div className={styles.alertValue}>
                    {p.potentialValue === "very-high" ? "⚡ Very High" : p.potentialValue}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className={styles.alertEmpty}>No urgent snapshots</div>
          )}

          <div className={styles.darkDivider} />

          <div className={styles.darkMetrics}>
            <div className={styles.darkMetric}>
              <div className={styles.darkMetricNum}>{mockProjects.filter(p => p.hypeScore >= 80).length}</div>
              <div className={styles.darkMetricLabel}>High Hype</div>
            </div>
            <div className={styles.darkMetric}>
              <div className={styles.darkMetricNum}>{mockTasks.filter(t => t.recurring === "daily").length}</div>
              <div className={styles.darkMetricLabel}>Daily Tasks</div>
            </div>
            <div className={styles.darkMetric}>
              <div className={styles.darkMetricNum}>{mockProjects.filter(p => p.status === "snapshot").length}</div>
              <div className={styles.darkMetricLabel}>Snapshot</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom 3-col: projects + pie chart + agent jobs ── */}
      <div className={styles.bottomRow}>

        {/* Col 1: Project progress */}
        <div className={styles.bottomCard}>
          <div className={styles.bottomCardHeader}>
            <span className={styles.bottomCardTitle}>Campaign Progress</span>
            <Link to="/projects" className={styles.seeAll}>View all <ArrowRight size={12}/></Link>
          </div>
          <div className={styles.projectList}>
            {highPriority.map((p) => {
              const done = p.tasks.filter(t => t.completed).length;
              const total = p.tasks.length;
              const pct = total > 0 ? Math.round((done / total) * 100) : 0;
              return (
                <Link key={p.id} to={`/projects/${p.id}`} className={styles.projectRow}>
                  <div className={styles.projectRowTop}>
                    <span className={styles.projectRowName}>{p.name}</span>
                    <span className={styles.projectRowPct}>{pct}%</span>
                  </div>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${pct}%`, background: pct >= 80 ? "#22c55e" : pct >= 40 ? "#c9a028" : "#e84a5f" }} />
                  </div>
                  <div className={styles.projectRowMeta}>{done}/{total} tasks · {p.chain.join(", ")}</div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Col 2: Task distribution pie */}
        <div className={styles.bottomCard}>
          <div className={styles.bottomCardHeader}>
            <span className={styles.bottomCardTitle}>Task Distribution</span>
            <Link to="/tasks" className={styles.seeAll}>View all <ArrowRight size={12}/></Link>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={taskPieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {taskPieData.map((_, i) => (
                  <Cell key={i} fill={TASK_PIE_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e4e4e7" }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Col 3: Quick actions + agent status */}
        <div className={styles.bottomCard}>
          <div className={styles.bottomCardHeader}>
            <span className={styles.bottomCardTitle}>Quick Actions</span>
          </div>
          <div className={styles.quickActions}>
            <Link to="/tasks" className={styles.quickAction}>
              <span className={`${styles.qaIcon} ${styles.qaIconBlue}`}><CalendarDays size={16}/></span>
              <div>
                <div className={styles.qaLabel}>Today's Tasks</div>
                <div className={styles.qaSub}>{mockTasks.filter(t => t.recurring === "daily").length} daily · {inProgressTasks} in progress</div>
              </div>
              <ArrowRight size={14} className={styles.qaArrow} />
            </Link>
            <Link to="/inbox" className={styles.quickAction}>
              <span className={`${styles.qaIcon} ${styles.qaIconGold}`}><Activity size={16}/></span>
              <div>
                <div className={styles.qaLabel}>Inbox</div>
                <div className={styles.qaSub}>Scan for new opportunities</div>
              </div>
              <ArrowRight size={14} className={styles.qaArrow} />
            </Link>
            <Link to="/tasks" className={styles.quickAction}>
              <span className={`${styles.qaIcon} ${styles.qaIconPurple}`}><Bot size={16}/></span>
              <div>
                <div className={styles.qaLabel}>Agent Dispatch</div>
                <div className={styles.qaSub}>Automate tasks with AI agents</div>
              </div>
              <ArrowRight size={14} className={styles.qaArrow} />
            </Link>
            <Link to="/identities" className={styles.quickAction}>
              <span className={`${styles.qaIcon} ${styles.qaIconGreen}`}><Users size={16}/></span>
              <div>
                <div className={styles.qaLabel}>Identities</div>
                <div className={styles.qaSub}>{activeIdentities} active profiles</div>
              </div>
              <ArrowRight size={14} className={styles.qaArrow} />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
