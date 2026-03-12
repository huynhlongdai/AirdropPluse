import { Link } from "react-router";
import {
  Rocket,
  TrendingUp,
  CheckCircle2,
  DollarSign,
  Inbox,
  ArrowRight,
  Wallet,
  ListTodo,
  Activity,
  Users,
} from "lucide-react";
import type { Route } from "./+types/home";
import { ProjectCard } from "~/components/project-card";
import { mockProjects } from "~/data/projects";
import { mockInboxItems } from "~/data/inbox";
import { mockWallets } from "~/data/wallets";
import { mockIdentities } from "~/data/identities";
import styles from "./home.module.css";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "AirdropPulse - Your Crypto Airdrop Intelligence Hub" },
    {
      name: "description",
      content: "Track, manage, and optimize your crypto airdrop opportunities with AI-powered insights",
    },
  ];
}

export default function Home() {
  const activeProjects = mockProjects.filter((p) => p.status === "active" || p.status === "snapshot");
  const highPriorityProjects = mockProjects.filter((p) => p.priority === "high");
  const pendingInbox = mockInboxItems.filter((i) => i.status === "review");

  const totalTasks = mockProjects.reduce((acc, p) => acc + p.tasks.length, 0);
  const completedTasks = mockProjects.reduce((acc, p) => acc + p.tasks.filter((t) => t.completed).length, 0);
  const tasksDueToday = mockProjects
    .flatMap((p) =>
      p.tasks
        .filter((t) => !t.completed)
        .map((task) => ({
          ...task,
          projectName: p.name,
          projectId: p.id,
        })),
    )
    .slice(0, 5);

  const activeWallets = mockWallets.filter((w) => w.isActive);
  const activeIdentities = mockIdentities.filter((i) => i.status === "active");

  return (
    <main className={styles.home}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>AirdropPulse</h1>
          <p className={styles.subtitle}>
            Your centralized intelligence hub for crypto airdrops and retroactive opportunities
          </p>
        </header>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statLabel}>Active Campaigns</span>
              <Rocket className={styles.statIcon} />
            </div>
            <div className={styles.statValue}>{activeProjects.length}</div>
            <div className={styles.statChange}>
              <TrendingUp style={{ width: "16px", height: "16px" }} />
              +2 this week
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statLabel}>Tasks Completed</span>
              <CheckCircle2 className={styles.statIcon} />
            </div>
            <div className={styles.statValue}>
              {completedTasks}/{totalTasks}
            </div>
            <div className={styles.statChange}>
              <TrendingUp style={{ width: "16px", height: "16px" }} />
              {Math.round((completedTasks / totalTasks) * 100)}% complete
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statLabel}>Potential Rewards</span>
              <DollarSign className={styles.statIcon} />
            </div>
            <div className={styles.statValue}>$12.5K</div>
            <div className={styles.statChange}>
              <TrendingUp style={{ width: "16px", height: "16px" }} />
              Estimated value
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statLabel}>Pending Review</span>
              <Inbox className={styles.statIcon} />
            </div>
            <div className={styles.statValue}>{pendingInbox.length}</div>
            <div className={styles.statChange}>
              <Activity style={{ width: "16px", height: "16px" }} />
              Needs attention
            </div>
          </div>
        </div>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <Inbox className={styles.sectionIcon} />
              Recent Ingestions
            </h2>
            <Link to="/inbox" className={styles.viewAllLink}>
              View All
              <ArrowRight style={{ width: "16px", height: "16px" }} />
            </Link>
          </div>
          <div className={styles.inboxList}>
            {pendingInbox.slice(0, 3).map((item) => (
              <Link to="/inbox" key={item.id} className={styles.inboxItem}>
                <div className={styles.inboxHeader}>
                  <span className={styles.inboxTitle}>{item.extractedData?.projectName || "Processing..."}</span>
                  <span className={styles.inboxBadge}>{item.status}</span>
                </div>
                <p className={styles.inboxContent}>{item.rawContent}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <ListTodo className={styles.sectionIcon} />
              Priority Checklist
            </h2>
            <Link to="/tasks" className={styles.viewAllLink}>
              View Calendar
              <ArrowRight style={{ width: "16px", height: "16px" }} />
            </Link>
          </div>
          <div className={styles.tasksList}>
            {tasksDueToday.map((task) => (
              <div key={task.id} className={styles.taskItem}>
                <input type="checkbox" className={styles.taskCheckbox} checked={task.completed} readOnly />
                <div className={styles.taskContent}>
                  <div className={styles.taskProject}>{task.projectName}</div>
                  <div className={styles.taskDescription}>{task.description}</div>
                  <div className={styles.taskMeta}>
                    <span>High Priority</span>
                    <span>•</span>
                    <span>Due Today</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <Rocket className={styles.sectionIcon} />
              High Priority Campaigns
            </h2>
            <Link to="/projects" className={styles.viewAllLink}>
              View All Projects
              <ArrowRight style={{ width: "16px", height: "16px" }} />
            </Link>
          </div>
          <div className={styles.projectsGrid}>
            {highPriorityProjects.slice(0, 3).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <Users className={styles.sectionIcon} />
              Active Identities
            </h2>
            <Link to="/identities" className={styles.viewAllLink}>
              Manage Identities
              <ArrowRight style={{ width: "16px", height: "16px" }} />
            </Link>
          </div>
          <div className={styles.walletGrid}>
            {activeIdentities.slice(0, 4).map((identity) => (
              <div key={identity.id} className={styles.walletCard}>
                <div className={styles.walletHeader}>
                  <span className={styles.walletName}>{identity.alias}</span>
                  <span className={styles.walletGroup}>{identity.status}</span>
                </div>
                <div className={styles.walletAddress}>
                  {identity.email?.address ?? "No email"}
                </div>
                <div className={styles.walletStats}>
                  <div className={styles.walletStat}>
                    <div className={styles.walletStatValue}>{identity.linkedWallets.length}</div>
                    <div className={styles.walletStatLabel}>Wallets</div>
                  </div>
                  <div className={styles.walletStat}>
                    <div className={styles.walletStatValue}>
                      {[identity.twitter, identity.discord, identity.telegram, identity.tiktok].filter(Boolean).length}
                    </div>
                    <div className={styles.walletStatLabel}>Platforms</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <Wallet className={styles.sectionIcon} />
              Wallet Performance
            </h2>
            <Link to="/wallets" className={styles.viewAllLink}>
              Manage Wallets
              <ArrowRight style={{ width: "16px", height: "16px" }} />
            </Link>
          </div>
          <div className={styles.walletGrid}>
            {activeWallets.slice(0, 4).map((wallet) => {
              const walletTasks = mockProjects.flatMap((p) => p.tasks.filter((t) => t.walletId === wallet.id));
              const walletCompleted = walletTasks.filter((t) => t.completed).length;

              return (
                <div key={wallet.id} className={styles.walletCard}>
                  <div className={styles.walletHeader}>
                    <span className={styles.walletName}>{wallet.name}</span>
                    <span className={styles.walletGroup}>{wallet.group}</span>
                  </div>
                  <div className={styles.walletAddress}>{wallet.address}</div>
                  <div className={styles.walletStats}>
                    <div className={styles.walletStat}>
                      <div className={styles.walletStatValue}>{walletCompleted}</div>
                      <div className={styles.walletStatLabel}>Tasks Done</div>
                    </div>
                    <div className={styles.walletStat}>
                      <div className={styles.walletStatValue}>{wallet.chain.length}</div>
                      <div className={styles.walletStatLabel}>Chains</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
