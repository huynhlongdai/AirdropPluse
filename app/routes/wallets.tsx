import React from "react";
import {
  Plus, Search, Wallet, CheckCircle2, XCircle, Clock, TrendingUp,
  AlertCircle, ChevronDown, ChevronUp,
} from "lucide-react";
import classNames from "classnames";
import type { Route } from "./+types/wallets";
import { mockMainWallets } from "~/data/wallets";
import type { MainWallet, SubWallet } from "~/data/wallets";
import { useStore } from "~/hooks/use-store";
import WalletGroup from "~/components/wallets/wallet-group";
import WalletForm from "~/components/wallets/wallet-form";
import styles from "./wallets.module.css";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Wallet Manager - AirdropPulse" },
    { name: "description", content: "Manage your hierarchical crypto wallet groups" },
  ];
}

type ActiveTab = "groups" | "matrix";
type FormState =
  | { open: false }
  | { open: true; mode: "create-main" }
  | { open: true; mode: "edit-main"; main: MainWallet }
  | { open: true; mode: "create-sub"; mainId: string }
  | { open: true; mode: "edit-sub"; sub: SubWallet; mainId: string };

function genId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function Wallets() {
  const { tasks, projects } = useStore();
  const [tab, setTab] = React.useState<ActiveTab>("groups");
  const [search, setSearch] = React.useState("");
  const [filterType, setFilterType] = React.useState<"all" | MainWallet["type"]>("all");
  const [wallets, setWallets] = React.useState<MainWallet[]>(mockMainWallets);
  const [formState, setFormState] = React.useState<FormState>({ open: false });

  const allSubWallets = React.useMemo(() => wallets.flatMap((m) => m.subWallets), [wallets]);

  const filtered = React.useMemo(() => {
    return wallets.filter((m) => {
      const matchSearch =
        !search ||
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.address.toLowerCase().includes(search.toLowerCase()) ||
        m.subWallets.some(
          (s) =>
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.address.toLowerCase().includes(search.toLowerCase()),
        );
      const matchType = filterType === "all" || m.type === filterType;
      return matchSearch && matchType;
    });
  }, [wallets, search, filterType]);

  // Summary stats
  const totalSubs = wallets.reduce((n, m) => n + m.subWallets.length, 0);
  const activeSubs = wallets.reduce((n, m) => n + m.subWallets.filter((s) => s.status === "active").length, 0);
  const lowGasSubs = wallets.reduce((n, m) => n + m.subWallets.filter((s) => s.status === "low-gas").length, 0);

  // Handlers
  const handleSaveMain = (data: Partial<Pick<MainWallet, "id">> & Omit<MainWallet, "id" | "subWallets" | "createdAt">) => {
    setWallets((prev) => {
      if (data.id) {
        return prev.map((m) => (m.id === data.id ? { ...m, ...data } : m));
      }
      return [...prev, { ...data, id: genId("main"), subWallets: [], createdAt: new Date().toISOString().slice(0, 10) }];
    });
    setFormState({ open: false });
  };

  const handleSaveSub = (
    data: Partial<Pick<SubWallet, "id">> & Omit<SubWallet, "id" | "gasBalances" | "activeProjectIds" | "createdAt">,
    mainId: string,
  ) => {
    setWallets((prev) =>
      prev.map((m) => {
        if (m.id !== mainId) return m;
        if (data.id) {
          return { ...m, subWallets: m.subWallets.map((s) => (s.id === data.id ? { ...s, ...data } : s)) };
        }
        const newSub: SubWallet = {
          ...data,
          id: genId("sub"),
          gasBalances: [],
          activeProjectIds: [],
          createdAt: new Date().toISOString().slice(0, 10),
        };
        return { ...m, subWallets: [...m.subWallets, newSub] };
      }),
    );
    setFormState({ open: false });
  };

  const handleImportSubs = (addresses: string[], mainId: string) => {
    setWallets((prev) =>
      prev.map((m) => {
        if (m.id !== mainId) return m;
        const newSubs: SubWallet[] = addresses.map((addr, i) => ({
          id: genId("sub"),
          name: `Imported Wallet ${m.subWallets.length + i + 1}`,
          address: addr,
          type: "burner",
          chains: ["ethereum"],
          status: "active",
          purpose: "",
          linkedIdentityIds: [],
          gasBalances: [],
          activeProjectIds: [],
          createdAt: new Date().toISOString().slice(0, 10),
        }));
        return { ...m, subWallets: [...m.subWallets, ...newSubs] };
      }),
    );
    setFormState({ open: false });
  };

  const handleDeleteMain = (id: string) => {
    setWallets((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <main className={styles.wallets}>
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Wallet Manager</h1>
            <p className={styles.subtitle}>Hierarchical wallet groups for airdrop farming</p>
          </div>
          <button className={styles.addBtn} onClick={() => setFormState({ open: true, mode: "create-main" })}>
            <Plus size={16} />
            New Main Wallet
          </button>
        </header>

        {/* Stats bar */}
        <div className={styles.statsBar}>
          <div className={styles.statCard}>
            <div className={styles.statCardValue}>{wallets.length}</div>
            <div className={styles.statCardLabel}>Main Wallets</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statCardValue}>{totalSubs}</div>
            <div className={styles.statCardLabel}>Sub-wallets</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statCardValue} style={{ color: "var(--color-success-11)" }}>{activeSubs}</div>
            <div className={styles.statCardLabel}>Active</div>
          </div>
          {lowGasSubs > 0 && (
            <div className={styles.statCard}>
              <div className={styles.statCardValue} style={{ color: "var(--color-error-11)" }}>{lowGasSubs}</div>
              <div className={styles.statCardLabel}>⚠ Low Gas</div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button className={classNames(styles.tab, { [styles.tabActive]: tab === "groups" })} onClick={() => setTab("groups")}>
            Wallet Groups
          </button>
          <button className={classNames(styles.tab, { [styles.tabActive]: tab === "matrix" })} onClick={() => setTab("matrix")}>
            Participation Matrix
          </button>
        </div>

        {/* Groups tab */}
        {tab === "groups" && (
          <>
            <div className={styles.toolbar}>
              <div className={styles.searchBox}>
                <Search size={15} className={styles.searchIcon} />
                <input
                  className={styles.searchInput}
                  placeholder="Search wallets by name or address..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <select className={styles.filterSelect} value={filterType}
                onChange={(e) => setFilterType(e.target.value as typeof filterType)}>
                <option value="all">All Types</option>
                <option value="hot">Hot Wallet</option>
                <option value="cold">Cold Wallet</option>
                <option value="cex">CEX</option>
                <option value="burner">Burner</option>
              </select>
            </div>

            <div className={styles.groupsList}>
              {filtered.length === 0 ? (
                <div className={styles.emptyState}>
                  <Wallet size={40} className={styles.emptyIcon} />
                  <p>No wallets found. Create your first main wallet.</p>
                </div>
              ) : (
                filtered.map((main) => (
                  <WalletGroup
                    key={main.id}
                    main={main}
                    allSubWallets={allSubWallets}
                    onEditMain={(m) => setFormState({ open: true, mode: "edit-main", main: m })}
                    onDeleteMain={handleDeleteMain}
                    onAddSub={(mainId) => setFormState({ open: true, mode: "create-sub", mainId })}
                    onEditSub={(sub, mainId) => setFormState({ open: true, mode: "edit-sub", sub, mainId })}
                  />
                ))
              )}
            </div>
          </>
        )}

        {/* Matrix tab */}
        {tab === "matrix" && (
          <ParticipationMatrix tasks={tasks} projects={projects} allSubWallets={allSubWallets} />
        )}
      </div>

      {/* Form drawer */}
      {formState.open && (
        <WalletForm
          key={formState.mode + (formState.mode === "edit-main" ? formState.main.id : formState.mode === "edit-sub" ? formState.sub.id : "")}
          mode={formState.mode}
          editingMain={formState.mode === "edit-main" ? formState.main : undefined}
          editingSub={formState.mode === "edit-sub" ? formState.sub : undefined}
          parentMainId={
            formState.mode === "create-sub"
              ? formState.mainId
              : formState.mode === "edit-sub"
              ? formState.mainId
              : undefined
          }
          onSaveMain={handleSaveMain}
          onSaveSub={handleSaveSub}
          onImportSubs={handleImportSubs}
          onClose={() => setFormState({ open: false })}
        />
      )}
    </main>
  );
}

// ──────────────────────────────────────────────────────────────
// Participation Matrix Component
// ──────────────────────────────────────────────────────────────

import type { Task } from "~/data/tasks";
import type { Project } from "~/data/projects";

interface ParticipationMatrixProps {
  tasks: Task[];
  projects: Project[];
  allSubWallets: SubWallet[];
}

function ParticipationMatrix({ tasks, projects, allSubWallets }: ParticipationMatrixProps) {
  const [selectedProject, setSelectedProject] = React.useState<string>("all");
  const [selectedWalletId, setSelectedWalletId] = React.useState<string | null>(null);
  const [filterStatus, setFilterStatus] = React.useState<"all" | "not-started" | "completed" | "failed">("all");

  // All wallets that appear in any task execution
  const involvedWalletIds = React.useMemo(() => {
    const ids = new Set<string>();
    tasks.forEach((t) => t.executions.forEach((e) => ids.add(e.walletId)));
    return ids;
  }, [tasks]);

  const matrixWallets = React.useMemo(() => {
    const used = allSubWallets.filter((w) => involvedWalletIds.has(w.id));
    // Also include wallets from task executions that might not be in allSubWallets
    const extra: { id: string; name: string; address: string }[] = [];
    tasks.forEach((t) =>
      t.executions.forEach((e) => {
        if (!used.find((w) => w.id === e.walletId)) {
          if (!extra.find((x) => x.id === e.walletId)) {
            extra.push({ id: e.walletId, name: e.walletName, address: e.address });
          }
        }
      })
    );
    return [...used, ...extra];
  }, [allSubWallets, involvedWalletIds, tasks]);

  // Tasks filtered by project
  const filteredTasks = React.useMemo(() => {
    let ts = selectedProject === "all" ? tasks : tasks.filter((t) => t.projectId === selectedProject);
    return ts;
  }, [tasks, selectedProject]);

  // Get status for a wallet on a specific task
  function getWalletStatus(task: Task, walletId: string) {
    const exec = task.executions.find((e) => e.walletId === walletId);
    return exec?.status ?? null;
  }

  // Per-wallet summary across filtered tasks
  function getWalletSummary(walletId: string) {
    const involved = filteredTasks.filter((t) => t.executions.some((e) => e.walletId === walletId));
    const completed = involved.filter((t) => {
      const exec = t.executions.find((e) => e.walletId === walletId);
      return exec?.status === "completed";
    });
    const failed = involved.filter((t) => {
      const exec = t.executions.find((e) => e.walletId === walletId);
      return exec?.status === "failed";
    });
    return { total: involved.length, completed: completed.length, failed: failed.length };
  }

  // Health check — wallets with failed or overdue tasks
  const healthIssues = React.useMemo(() => {
    return matrixWallets
      .map((w) => {
        const failedTasks = filteredTasks.filter((t) =>
          t.executions.some((e) => e.walletId === w.id && e.status === "failed")
        );
        const overdueTasks = filteredTasks.filter((t) =>
          t.isOverdue && t.executions.some((e) => e.walletId === w.id && e.status !== "completed")
        );
        return { wallet: w, failedCount: failedTasks.length, overdueCount: overdueTasks.length };
      })
      .filter((x) => x.failedCount > 0 || x.overdueCount > 0);
  }, [matrixWallets, filteredTasks]);

  // Wallets visible in matrix (filtered by status if needed)
  const visibleWallets = React.useMemo(() => {
    if (filterStatus === "all") return matrixWallets;
    return matrixWallets.filter((w) => {
      const summary = getWalletSummary(w.id);
      if (filterStatus === "not-started") return summary.completed === 0;
      if (filterStatus === "completed") return summary.total > 0 && summary.completed === summary.total;
      if (filterStatus === "failed") return summary.failed > 0;
      return true;
    });
  }, [matrixWallets, filterStatus, filteredTasks]);

  const STATUS_CELL: Record<string, React.ReactNode> = {
    "completed": <CheckCircle2 size={16} color="var(--color-success-9)" />,
    "in-progress": <TrendingUp size={16} color="var(--color-accent-9)" />,
    "not-started": <Clock size={16} color="var(--color-neutral-7)" />,
    "failed": <XCircle size={16} color="var(--color-error-9)" />,
  };

  return (
    <div className={styles.matrixSection}>
      {/* Controls */}
      <div className={styles.matrixControls}>
        <div className={styles.matrixControlGroup}>
          <label className={styles.matrixLabel}>Project</label>
          <select
            className={styles.filterSelect}
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
          >
            <option value="all">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div className={styles.matrixControlGroup}>
          <label className={styles.matrixLabel}>Filter Wallets</label>
          <select
            className={styles.filterSelect}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
          >
            <option value="all">All Wallets</option>
            <option value="not-started">Not started yet</option>
            <option value="completed">100% Completed</option>
            <option value="failed">Has failures</option>
          </select>
        </div>
      </div>

      {/* Health check banner */}
      {healthIssues.length > 0 && (
        <div className={styles.healthBanner}>
          <AlertCircle size={16} />
          <div>
            <strong>Health Alert:</strong>{" "}
            {healthIssues.map((issue, i) => (
              <span key={issue.wallet.id}>
                <strong>{issue.wallet.name}</strong>
                {issue.failedCount > 0 && ` — ${issue.failedCount} failed task(s)`}
                {issue.overdueCount > 0 && ` — ${issue.overdueCount} overdue task(s)`}
                {i < healthIssues.length - 1 ? "; " : ""}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className={styles.matrixLegend}>
        <span className={styles.legendItem}><CheckCircle2 size={13} color="var(--color-success-9)" /> Completed</span>
        <span className={styles.legendItem}><TrendingUp size={13} color="var(--color-accent-9)" /> In Progress</span>
        <span className={styles.legendItem}><Clock size={13} color="var(--color-neutral-7)" /> Not Started</span>
        <span className={styles.legendItem}><XCircle size={13} color="var(--color-error-9)" /> Failed</span>
      </div>

      {filteredTasks.length === 0 || visibleWallets.length === 0 ? (
        <div className={styles.emptyState}>
          <Wallet size={40} className={styles.emptyIcon} />
          <p>No data to display. Try changing the project or filter.</p>
        </div>
      ) : (
        <div className={styles.matrixWrapper}>
          <div
            className={styles.matrix}
            style={{ gridTemplateColumns: `220px repeat(${filteredTasks.length}, minmax(80px, 1fr))` }}
          >
            {/* Header row */}
            <div className={styles.matrixCornerCell} />
            {filteredTasks.map((task) => (
              <div key={task.id} className={styles.matrixTaskHeader} title={task.title}>
                <span className={styles.matrixTaskTitle}>{task.title}</span>
                {task.projectName && (
                  <span className={styles.matrixTaskProject}>{task.projectName}</span>
                )}
              </div>
            ))}

            {/* Wallet rows */}
            {visibleWallets.map((wallet) => {
              const summary = getWalletSummary(wallet.id);
              const pct = summary.total > 0 ? Math.round((summary.completed / summary.total) * 100) : 0;
              const isExpanded = selectedWalletId === wallet.id;

              return (
                <React.Fragment key={wallet.id}>
                  {/* Wallet label cell */}
                  <div
                    className={classNames(styles.matrixWalletCell, {
                      [styles.matrixWalletCellExpanded]: isExpanded,
                    })}
                    onClick={() => setSelectedWalletId(isExpanded ? null : wallet.id)}
                  >
                    <div className={styles.walletCellContent}>
                      <div>
                        <div className={styles.matrixWalletName}>{wallet.name}</div>
                        <div className={styles.matrixWalletAddress}>{wallet.address}</div>
                      </div>
                      <div className={styles.walletCellMeta}>
                        <span className={classNames(styles.walletPctBadge, {
                          [styles.walletPctGood]: pct === 100,
                          [styles.walletPctMid]: pct > 0 && pct < 100,
                          [styles.walletPctNone]: pct === 0,
                        })}>
                          {summary.completed}/{summary.total}
                        </span>
                        {summary.failed > 0 && (
                          <span className={styles.walletFailBadge}>{summary.failed} ✗</span>
                        )}
                        {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      </div>
                    </div>
                    <div className={styles.walletMiniProgress}>
                      <div className={styles.walletMiniProgressFill} style={{ width: `${pct}%` }} />
                    </div>
                  </div>

                  {/* Status cells */}
                  {filteredTasks.map((task) => {
                    const status = getWalletStatus(task, wallet.id);
                    const exec = task.executions.find((e) => e.walletId === wallet.id);
                    return (
                      <div
                        key={task.id}
                        className={classNames(styles.matrixStatusCell, {
                          [styles.cellCompleted]: status === "completed",
                          [styles.cellInProgress]: status === "in-progress",
                          [styles.cellFailed]: status === "failed",
                          [styles.cellNotAssigned]: status === null,
                        })}
                        title={
                          status
                            ? `${wallet.name} — ${status}${exec?.txHash ? `\nTx: ${exec.txHash}` : ""}${exec?.note ? `\nNote: ${exec.note}` : ""}`
                            : `${wallet.name} — not assigned`
                        }
                      >
                        {status ? STATUS_CELL[status] : <span className={styles.notAssigned}>—</span>}
                      </div>
                    );
                  })}

                  {/* Expanded wallet detail row */}
                  {isExpanded && (
                    <>
                      <div className={styles.walletDetailCell}>
                        <div className={styles.walletDetailContent}>
                          <div className={styles.walletDetailStat}>
                            <CheckCircle2 size={12} color="var(--color-success-9)" />
                            {summary.completed} done
                          </div>
                          {summary.failed > 0 && (
                            <div className={styles.walletDetailStat} style={{ color: "var(--color-error-11)" }}>
                              <XCircle size={12} /> {summary.failed} failed
                            </div>
                          )}
                        </div>
                      </div>
                      {filteredTasks.map((task) => {
                        const exec = task.executions.find((e) => e.walletId === wallet.id);
                        return (
                          <div key={`detail-${task.id}`} className={styles.walletDetailTaskCell}>
                            {exec ? (
                              <div className={styles.execDetail}>
                                {exec.txHash && (
                                  <span className={styles.execDetailTx} title={exec.txHash}>
                                    #{exec.txHash.slice(2, 8)}
                                  </span>
                                )}
                                {exec.actualGasFee && (
                                  <span className={styles.execDetailGas}>
                                    {exec.actualGasFee}
                                  </span>
                                )}
                                {exec.note && (
                                  <span className={styles.execDetailNote} title={exec.note}>
                                    💬
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className={styles.notAssigned}>—</span>
                            )}
                          </div>
                        );
                      })}
                    </>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
